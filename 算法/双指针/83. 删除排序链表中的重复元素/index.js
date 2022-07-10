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
var deleteDuplicates = function (head) {
  if (!head || !head.next) return head

  let cur = head,
    next = head.next
  while (next) {
    if (cur.val === next.val) {
      cur.next = next.next
    } else {
      cur = next
    }
    next = next.next
  }

  return head
}
