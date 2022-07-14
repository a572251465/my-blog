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
 * @return {number[]}
 */
var preorderTraversal = function (root) {
  /**
   * @description 所有的排序都是按照中间节点而言的 前序的意思就是中间节点在前面 中=》左=》右
   */
  if (!root) return []
  if (!root.left && !root.right) return [root.val]

  const res = []
  const next = (root) => {
    if (!root) return
    res.push(root.val)
    next(root.left)
    next(root.right)
  }

  next(root)
  return res
}
