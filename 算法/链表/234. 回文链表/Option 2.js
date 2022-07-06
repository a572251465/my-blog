/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {boolean}
 */
var isPalindrome = function (head) {
  if (!head.next) return true

  // 1 2 2 1
  // 1 2 3 2 1
  let fast = head
  let slow = head

  while (fast && fast.next && fast.next.next) {
    fast = fast.next.next
    slow = slow.next
  }

  let b = slow.next
  let a = head
  slow.next = null

  const reverseal = (head) => {
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

  b = reverseal(b)

  while (a && b) {
    const val = a.val
    const val1 = b.val
    if (val !== val1) return false

    a = a.next
    b = b.next
  }

  return true
}
