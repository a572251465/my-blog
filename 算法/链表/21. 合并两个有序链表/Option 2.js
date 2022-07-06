/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
var mergeTwoLists = function (list1, list2) {
  /**
   * @description 合并两个有序链表
   * - 定义一个虚拟节点头
   * - 同时遍历两个链表，将每个节点进行比较，小的节点放到next位置
   */
  if (!list1) return list2
  if (!list2) return list1

  const dummyHead = new ListNode(-1)
  let result = dummyHead

  let p1 = list1
  let p2 = list2
  while (p1 && p2) {
    const val1 = p1.val
    const val2 = p2.val

    if (val1 < val2) {
      result.next = new ListNode(val1)
      p1 = p1.next
    } else {
      result.next = new ListNode(val2)
      p2 = p2.next
    }
    result = result.next
  }

  if (p1) result.next = p1
  if (p2) result.next = p2

  return dummyHead.next
}
