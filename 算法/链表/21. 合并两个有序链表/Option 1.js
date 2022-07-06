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
   * @description 将两个有序的链表进行合并
   * - 如果list1 为空 那么返回list2
   * - 如果list2 为空 那么返回list1
   * - 找一个小的 重新new一个节点
   * - 新节点的next 重新递归来找下一个比较小的
   */
  if (!list1) return list2
  if (!list2) return list1

  const val1 = list1.val
  const val2 = list2.val

  let newList
  if (val1 < val2) {
    newList = new ListNode(val1)
    newList.next = mergeTwoLists(list1.next, list2)
  } else {
    newList = new ListNode(val2)
    newList.next = mergeTwoLists(list1, list2.next)
  }

  return newList
}
