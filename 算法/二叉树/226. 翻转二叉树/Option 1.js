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
 * @return {TreeNode}
 */
var invertTree = function (root) {
  if (!root) return root

  const next = (root) => {
    if (!root) return

    const left = root.left
    root.left = root.right
    root.right = left
    next(root.left)
    next(root.right)
  }
  next(root)
  return root
}
