/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */

const reversal = (head) => {
  let newHead = null
  let p = head

  while (p) {
    let temp = p
    p = p.next
    temp.next = newHead
    newHead = temp
  }

  return newHead
}

/**
 * @param {ListNode} head
 * @return {void} Do not return anything, modify head in-place instead.
 */
const reorderList = function (head) {
  /**
   * @description 重排链表
   * - 1. 通过双指针模式 将链表一分为二(one/ two)
   * - 2. 将two部分进行反转
   * - 3. 使用新链表 将one/ two 穿插在一起
   */

  if (!head || !head.next || !head.next.next) return head

  // 1. 进行节点一分为二
  let fast = head
  let slow = head
  while (fast && fast.next && fast.next.next) {
    slow = slow.next
    fast = fast.next.next
  }
  let two = slow.next
  let one = head
  slow.next = null

  // 2. 反转后面的链表
  two = reversal(two)

  // 3. 开始合并链表
  // 设置虚拟节点
  const dummyHead = new ListNode(-1)
  p = dummyHead

  while (one || two) {
    if (one) {
      p.next = one
      one = one.next
      p = p.next
    }

    if (two) {
      p.next = two
      two = two.next
      p = p.next
    }
  }

  return dummyHead.next
}
