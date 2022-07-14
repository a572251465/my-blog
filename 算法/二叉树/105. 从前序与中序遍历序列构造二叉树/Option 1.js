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
  /**
   * @description 分析
   * 1. 特性：前序遍历中 头节点一定是在最前面
   * 2. 特性：中序遍历中 头节点就在中间位置。而其左边以及右边就是两个子树
   * 3. 先从前序中拿到头节点。再到中序中寻找。找到后，左边的节点就是左子树。右边的节点就是右子树
   * 4. 这个需要构建一个新的数。头节点为root。重新递归来构建左子树 以及右子树
   *
   * @param preorder
   * @param inorder
   * @param preStart
   * @param preEnd
   * @param centerStart
   * @param centerEnd
   * @returns {TreeNode|null}
   */
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
