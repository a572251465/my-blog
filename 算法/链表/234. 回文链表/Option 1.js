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

  /***
   * @description 回文链表
   * 1. 回文链表的特征就是 无论是从左 还是 从右开始读  都是一样的
   * 2. 方法1：从中间截取链表(A/B), 将B 反转。 跟A作比较
   * 3. 方法2.：将整个链表反转为新链表 做比较
   * 4. 方法3：将之放到数组，一个头指针 一个尾指针 作比较
   */

  // 1 2 2 1
  // 1 2 3 2 1
  const stack = []
  let p = head
  while (p) {
    stack.push(p)
    p = p.next
  }

  let fast = 0
  let tail = stack.length - 1

  for (let i = 0; i <= ((stack.length / 2) | 0); i += 1) {
    const val = stack[fast].val
    const val1 = stack[tail].val
    if (val !== val1) return false

    fast++
    tail--
  }

  return true
}
