import request from 'request'
import async from 'async'
import _ from 'lodash'

let json = true

function head(token) {
  let headers = {
    'User-Agent': 'Bugbot',
    'Authorization': `token ${token}`,
    'Accept': 'application/json'
  }
  return headers
}

function getOrgs(token, callback) {
  let uri = 'https://api.github.com/user/orgs'
  let headers = head(token)
  request.get({uri, headers, json}, (err, res)=> {
    let orgs = res.body
    if (orgs.message === 'Bad credentials') {
      callback(orgs.message)
    }
    else {
      callback(err, orgs.map(o=>o.repos_url))
    } 
  })
}

function getRepos(token, uri, callback) {
  let headers = head(token)
  request.get({uri, headers, json}, (err, res)=> {
    if (err) {
      callback(err)
    }
    else {
      callback(null, res.body.map(r=>r.full_name))
    }
  })
}

function getAllOrgRepos(token, callback) {
  let headers = head(token)
  let i = (repo, cb)=> getRepos(token, repo, cb)
  getOrgs(token, (err, repos)=> {
    async.map(repos, i, (err, unflat)=> {
      callback(err, _.flatten(unflat))
    })
  })
}

function getUserRepos(affiliation, visibility, token, callback) {
  let uri = 'https://api.github.com/user/repos'
  let json = true
  let qs = {affiliation, visibility}
  // FIXME need to generalize User-Agent
  let headers = {
    'User-Agent': 'Bugbot',
    'Authorization': `token ${token}`,
    'Accept': 'application/json'
  }
  request.get({uri, qs, headers, json}, (err, res)=> {
    let repos = res.body
    if (repos.message === 'Bad credentials') {
      callback(repos.message)
    }
    else {
      callback(err, repos.map(r=>r.full_name))
    } 
  })
}

function getAllUserRepos(token, callback) {
  let a = cb=> getUserRepos('collaborator', 'private', token, cb)
  let b = cb=> getUserRepos('organization_member', 'private', token, cb)
  let c = cb=> getUserRepos('owner', 'private', token, cb)
  let a1 = cb=> getUserRepos('collaborator', 'public', token, cb)
  let b1 = cb=> getUserRepos('organization_member', 'public', token, cb)
  let c1 = cb=> getUserRepos('owner', 'public', token, cb)
  async.parallel([a, b, c, a1, b1, c1], (err, data)=> {
    callback(err, _.flatten(data))
  })
}

export default function repos(token, callback) {
  let u = cb=> getAllUserRepos(token, cb)
  let r = cb=> getAllOrgRepos(token, cb)
  async.parallel([u, r], (err, data)=> {
    callback(err, _.flatten(data).sort())
  })
}
