const fs = require("fs")
const path = require("path")

const rootPath = path.resolve(__dirname, "..")

// 1. 读取目录 以及筛选真正的目录
const excludeDirs = [".vitepress", "public"]
const dirs = fs.readdirSync(rootPath, "utf-8")
  .filter(name => !excludeDirs.includes(name))
  .filter(name => {
  const joinPath = path.join(rootPath, name)
  const stats = fs.statSync(joinPath)
  return stats.isDirectory()
})

const resolveAssignPath = (filename, joinPath, relativePath = rootPath, level) => {
  const newPath = path.join(relativePath, filename)
  const dirs = fs.readdirSync(newPath)
  // 如果是文件都是文件 如果是目录都是目录（※※※）
  const isFile = dirs.some(name => name.endsWith(".md"))

  if (isFile) {
    return [
      {
        text: filename,
        collapsible: true,
        collapsed: level !== 0,
        items: dirs.map(text => ({
          text: text.slice(0, -3),
          link: `/${joinPath}/${text.slice(0, -3)}`
        }))
      }
    ]
  }

  return dirs.map(oneDir => {
    return resolveAssignPath(oneDir, `${filename}/${oneDir}`, newPath, level + 1)[0]
  })
}

// 2. 组成sidebar 对象
const sidebar = dirs.reduce((memo, curr) => {
  const key = `/${curr}/`
  return {
    ...memo,
    [key]: resolveAssignPath(curr, curr, rootPath, 0)
  }
}, {})

const getFirstItem = (i) => {
  const values = Object.values(sidebar)
  const item = values[i][0]
  return item.items[0].link
}

// 3. 根据sidebar 获取nav
const nav = dirs.map((text, index) => ({
  text: text,
  link: getFirstItem(index)
}))

module.exports = {
  nav,
  sidebar
}