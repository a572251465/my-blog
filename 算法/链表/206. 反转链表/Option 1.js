/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function (head) {
  /**
   * @description 将整条链表进行反转 有一个新的节点
   */

  if (!head || !head.next) return head

  let newHead = null
  let p = head

  while (p) {
    const temp = p
    p = p.next
    temp.next = newHead
    newHead = temp
  }

  return newHead
}
