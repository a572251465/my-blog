/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} left
 * @param {number} right
 * @return {ListNode}
 */
var reverseBetween = function (head, left, right) {
  if (!head || !head.next) return head

  const dummyHead = new ListNode(-1, head)
  let pre = dummyHead,
    i = 0

  for (; i < left - 1; i += 1) pre = pre.next

  let cur = pre.next
  for (let i = 0; i < right - left; i += 1) {
    const next = cur.next
    cur.next = next.next
    next.next = pre.next
    pre.next = next
  }

  return dummyHead.next
}
