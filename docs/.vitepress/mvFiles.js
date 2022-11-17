const path = require("path")
const fs = require("fs");
const {ensureDirSync, removeSync} = require("fs-extra")

const targetPath = path.resolve(__dirname, "..")
const currPath = path.resolve(__dirname, "../../md")

const existBasicDir = [".vitepress", "public", "index.md"]

const genKey = () => {
  const world = Array.from("QWERTYUIOPLKJHGFDSAZXCVBNM")
  return `_${world[(Math.random() * world.length) | 0]}${+ new Date()}${(Math.random() * 10000) | 0}`
}
let nameMapping = {}

// 1. 先删除多余目录
const docsDirs = fs.readdirSync(targetPath, "utf-8");
docsDirs.forEach(name => {
  if (existBasicDir.includes(name)) return
  removeSync(path.join(targetPath, name))
})

// 2. 开始读取文件 复制文件
const readNextDir = (currPath, targetPath) => {
  ensureDirSync(targetPath)

  // 开始读取文件
  const dirs = fs.readdirSync(currPath)
  dirs.forEach(name => {
    const newPath = path.join(currPath, name)
    const stats = fs.statSync(newPath)

    const newName = genKey()
    if (stats.isFile()) {
      const filename = name.slice(0, -3)
      nameMapping = {...nameMapping, [newName]: filename}

      const content = fs.readFileSync(path.join(currPath, name), 'utf-8')
      fs.writeFileSync(path.join(targetPath, `${newName}.md`), content, 'utf-8')
    } else {
      const newCurrPath = path.join(currPath, name)
      nameMapping = {...nameMapping, [newName]: name}
      const newTargetPath = path.join(targetPath, newName)
      readNextDir(newCurrPath, newTargetPath)
    }
  })
}

const readDir = (currPath) => {
  const dirs = fs.readdirSync(currPath, "utf-8")
  dirs.forEach(dirName => {
    const newName = genKey()
    nameMapping = {...nameMapping, [newName]: dirName}

    // 生成新目录
    ensureDirSync(path.resolve(targetPath, newName))
    readNextDir(path.join(currPath, dirName), path.join(targetPath, newName))
  })
}
readDir(currPath)

module.exports = nameMapping
