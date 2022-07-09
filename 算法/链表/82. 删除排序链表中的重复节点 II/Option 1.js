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
  if (!head) return head

  const existObj = {}
  let p = head
  while (p) {
    const { val } = p
    existObj[val] = (existObj[val] || 0) + 1
    p = p.next
  }

  const dummyHead = new ListNode(-999, head)
  p = dummyHead
  while (p && p.next) {
    const num = existObj[p.next.val]
    if (num > 1) {
      p.next = p.next.next
    } else {
      p = p.next
    }
  }
  return dummyHead.next
}
