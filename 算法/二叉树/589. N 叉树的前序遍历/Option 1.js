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
  const genFrontNode = (root) => {
    if (!root) return

    res.push(root.val)
    if (!Array.isArray(root.children)) return

    root.children.forEach((node) => genFrontNode(node))
  }
  genFrontNode(root)
  return res
}
