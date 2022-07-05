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
   *  @description 判断链表中是否有环，可以使用hash表来做
   *  - 无环  如果没有环的话 从hash表中不会存在
   *  - 有环 如果有环的的话 再次相遇的时候 hash表中是一定存在的
   */

  if (!head || !head.next) return false
  const hashSet = new Set()
  let p = head

  while (p) {
    if (hashSet.has(p)) return true

    hashSet.add(p)
    p = p.next
  }

  return false
}
