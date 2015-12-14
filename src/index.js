import register from './register'
import token from './token'
import repos from './repos'
import issues from './issues'
import add from './add'

let describe = `
  github
    describe
    register((err, link)=>)
    token(code, (err, token)=>)
    repos(token, (err, repos[])=>)
    issues(token, repoID, (err, issues[])=>)
    add({token, repoID, title}, (err, issues)=>)
`

export default {
  describe, 
  token,
  register,
  repos, 
  issues,
  add
}
