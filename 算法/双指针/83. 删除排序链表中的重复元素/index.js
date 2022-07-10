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

  // 指向头节点
  let cur = head,
    // 指向头节点的next节点
    next = head.next
  while (next) {
    // 如果当前的节点值 跟下个节点的值一致的话
    if (cur.val === next.val) {
      // 当前节点的nex指针 指向下下个节点(就是把重复的节点跳过)
      cur.next = next.next
    } else {
      // 如果当前节点值 跟next节点值不一致 赋值相同 重新开始对比
      cur = next
    }
    next = next.next
  }

  return head
}
