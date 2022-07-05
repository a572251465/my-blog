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
   * @description 实现链表反转
   *  1. 实现两两反转
   */
  if (!head || !head.next) return head

  const reverse = (head) => {
    if (!head || !head.next) return head

    const cur = reverse(head.next)
    head.next.next = head
    head.next = null
    return cur
  }
  return reverse(head)
}
