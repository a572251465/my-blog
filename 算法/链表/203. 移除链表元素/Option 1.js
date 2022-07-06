/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} val
 * @return {ListNode}
 */
var removeElements = function (head, val) {
  if (!head) return head

  /**
   * @description 移除元素
   * 1. 使用虚拟head 节点来解决一个元素跟val相等的问题
   * @type {ListNode}
   */
  const dummyHead = new ListNode(-1, head)
  let p = dummyHead

  while (p && p.next) {
    const result = p.next.val
    if (result === val) {
      p.next = p.next.next
    } else {
      p = p.next
    }
  }

  return dummyHead.next
}
