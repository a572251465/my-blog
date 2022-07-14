/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode}
 */
var buildTree = function (preorder, inorder) {
  const genTree = (
    preorder,
    inorder,
    preStart,
    preEnd,
    centerStart,
    centerEnd
  ) => {
    if (preEnd < preStart || centerEnd < centerStart) return null
    // 获取一个最新的节点
    const val = preorder[preStart]
    const newTree = new TreeNode(val)

    const index = inorder.findIndex((item) => item === val)
    const leftSize = index - centerStart

    newTree.left = genTree(
      preorder,
      inorder,
      preStart + 1,
      preStart + leftSize,
      centerStart,
      index - 1
    )
    newTree.right = genTree(
      preorder,
      inorder,
      preStart + leftSize + 1,
      preEnd,
      index + 1,
      centerEnd
    )

    return newTree
  }
  return genTree(
    preorder,
    inorder,
    0,
    preorder.length - 1,
    0,
    inorder.length - 1
  )
}
