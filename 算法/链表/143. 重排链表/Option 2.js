/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {void} Do not return anything, modify head in-place instead.
 */
var reorderList = function (head) {
  /**
   * @description 重排链表
   * 1. 先链表存放到数组中
   * 2. 访问数组中指定的位置 来拼接新的链表
   */

  if (!head || !head.next || !head.next.next) return head

  // 1. 将链表放置到数组中
  const stack = []
  let p = head
  while (p) {
    const temp = p.next
    p.next = null
    stack.push(p)
    p = temp
  }

  // 2. 访问指定的位置
  const dummyHead = new ListNode(-1)
  let t = dummyHead
  while (stack.length) {
    const top = stack.shift()
    if (top) {
      t.next = top
      t = t.next
    }
    const bottom = stack.pop()
    if (bottom) {
      t.next = bottom
      t = t.next
    }
  }

  return dummyHead.next
}
