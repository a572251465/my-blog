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

  const dummyHead = new ListNode(-101, head)

  // 虚拟头节点
  let cur = dummyHead,
    // 头节点
    p = head

  // 1 1 1 2 2 3

  while (p && p.next) {
    // 当前节点 以及下一个节点
    if (cur.next.val === p.next.val) {
      // 一直移动p节点 直到找到不同的节点(结合上述实例。当跳出while的时候 p处于最后一个1，p.next 就是第一个2)
      while (p && p.next && cur.next.val === p.next.val) p = p.next
      // cur 下一个节点指向2 因为1包含重复节点了
      cur.next = p.next
    } else {
      cur = cur.next
    }
    // 下一个节点
    p = p.next
  }

  return dummyHead.next
}
