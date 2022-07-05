/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} head
 * @return {boolean}
 */
const hasCycle = function (head) {
  /**
   * @description 判断链表中是否有环 可以使用快慢指针来判断
   * - 如果有环的话 快指针一定会再次追上慢指针
   * - 如果没有环的话 快指针一定是先到达重点的
   */

  if (!head || !head.next) return false

  let fast = head.next
  let slow = head

  while (fast && fast.next && fast !== slow) {
    fast = fast.next.next
    slow = slow.next
  }

  return fast === slow && !!fast
}
