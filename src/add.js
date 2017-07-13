import request from 'request'

export default function add(params, callback) {
  let req = ['token', 'repoID', 'title']
  let uri = `https://github.com/${params.repoID}/issues`
  let json = true
  let headers = {
    'User-Agent':    'Bugbot', 
    'Authorization': `token ${params.token}`,
    'Content-Type':  'application/json'
  }
  let body = params
  request.post({uri, headers, json, body}, (err, res)=> {
    let issues = res.body
    callback(err, issues)
  })
}
