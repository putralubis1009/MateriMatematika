const fs = require('fs')
const path = require('path')

function walk(dir) {
  const entries = fs.readdirSync(dir)
  entries.forEach(file => {
    const p = path.join(dir, file)
    if (fs.statSync(p).isDirectory()) {
      if (!p.includes('node_modules')) walk(p)
    } else if (p.match(/\.(ts|tsx)$/)) {
      let content = fs.readFileSync(p, 'utf8')
      if (content.includes('createSupabaseServerClient') && content.includes('@/lib/db"')) {
        const newContent = content.replace(/from "@\/lib\/db"/g, 'from "@/lib/db.server"')
        if (newContent !== content) {
          fs.writeFileSync(p, newContent, 'utf8')
          console.log('Fixed:', path.relative(process.cwd(), p))
        }
      }
    }
  })
}

const appRoot = path.join(__dirname)
walk(path.join(appRoot, 'app'))
walk(path.join(appRoot, 'lib'))
console.log('All done!')
