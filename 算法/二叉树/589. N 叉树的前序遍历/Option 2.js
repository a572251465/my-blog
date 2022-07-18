/**
 * // Definition for a Node.
 * function Node(val, children) {
 *    this.val = val;
 *    this.children = children;
 * };
 */

/**
 * @param {Node|null} root
 * @return {number[]}
 */
var preorder = function (root) {
  if (!root) return []

  const res = []
  const treeArr = [root]
  while (treeArr.length) {
    const item = treeArr.shift()
    res.push(item.val)

    if (Array.isArray(item.children) && item.children.length > 0) {
      treeArr.unshift(...item.children)
    }
  }
  return res
}
