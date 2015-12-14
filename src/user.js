import req from 'request'

export default function user(token, callback) {
  let uri = 'https://api.github.com/user'
  let json = true
  let headers = {
    'User-Agent':    'Bugbot',
    'Authorization': `token ${token}`,
    'Accept':        'application/json'
  }
  req.get({uri, json, headers}, (err, res)=> {
    callback(err, res.body)
  })
}
