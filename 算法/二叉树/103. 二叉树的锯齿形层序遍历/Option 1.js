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
var zigzagLevelOrder = function (root) {
  if (!root) return []

  const res = []
  const genSeq = (treeArr, flag = true) => {
    if (treeArr.length === 0) return

    const values = treeArr.map((item) => item.val)
    res.push(flag ? values : values.reverse())
    const newArr = []
    treeArr.forEach((item) => {
      if (item.left) newArr.push(item.left)
      if (item.right) newArr.push(item.right)
    })

    genSeq(newArr, !flag)
  }
  genSeq([root], true)
  return res
}
