/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} headA
 * @param {ListNode} headB
 * @return {ListNode}
 */
var getIntersectionNode = function (headA, headB) {
  if (!headA || !headB) return null

  /**
   * @description 相交链表
   * @type {ListNode}
   *  1. 两个链表是A B
   *  2. 如果两个链表一定会相遇的话  那么他们走过的节点个数一定是相同的
   *  3. 那就可以遍历完A之后 紧接着开始遍历B
   */

  let p = headA
  let p1 = headB

  while (p !== p1) {
    p = p ? p.next : headB
    p1 = p1 ? p1.next : headA
  }

  return p
}
