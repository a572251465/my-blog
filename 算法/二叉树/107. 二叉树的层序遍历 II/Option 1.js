/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
var levelOrderBottom = function (root) {
  if (!root) return []

  const res = []
  const genSequence = (treeArr) => {
    if (treeArr.length === 0) return

    const newArr = []
    res.unshift(treeArr.map((item) => item.val))
    treeArr.forEach((item) => {
      if (item.left) newArr.push(item.left)
      if (item.right) newArr.push(item.right)
    })

    genSequence(newArr)
  }
  genSequence([root])

  return res
}
