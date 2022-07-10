/**
 * @param {number[]} bills
 * @return {boolean}
 */
var lemonadeChange = function (bills) {
  /**
   * @description 这道题最根本的核心就在于 使用掉大面钱币。例如优先花费掉10元 这样的话 5元才能有更多的可能性
   */
  if (bills.length < 1) return true
  const obj = {
    5: 0,
    10: 0,
    20: 0
  }

  let i = 0
  for (; i < bills.length; i += 1) {
    const money = bills[i]
    if (money === 5) obj[money] = obj[money] + 1

    if (money === 10) {
      if (obj['5'] === 0) return false
      obj[money] = obj[money] + 1
      obj['5'] -= 1
    }

    if (money === 20) {
      if (obj['5'] === 0) return false
      if (obj['5'] >= 1 && obj['10'] >= 1) {
        obj['5'] -= 1
        obj['10'] -= 1
      } else if (obj['5'] >= 3) {
        obj['5'] -= 3
      } else {
        return false
      }
    }
  }

  return true
}

console.log(lemonadeChange([10, 10]))
