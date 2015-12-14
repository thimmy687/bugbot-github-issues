import register from './register'
import token from './token'
import repos from './repos'
import issues from './issues'
import add from './add'
import user from './user'

let describe = `
  github
    describe
    register((err, link)=>)
    token(code, (err, token)=>)
    user(token, (err, user)=>)
    repos(token, (err, repos[])=>)
    issues(token, repoID, (err, issues[])=>)
    add({token, repoID, title}, (err, issues)=>)
`

export default {
  describe,
  token,
  register,
  user,
  repos,
  issues,
  add
}
