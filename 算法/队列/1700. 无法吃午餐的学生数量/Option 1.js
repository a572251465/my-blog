/**
 * @param {number[]} students
 * @param {number[]} sandwiches
 * @return {number}
 */
var countStudents = function (students, sandwiches) {
  if (students.length === 0 || sandwiches.length === 0) return 0

  while (
    students.length > 0 &&
    sandwiches.length > 0 &&
    students.includes(sandwiches[0])
  ) {
    const p1 = students[0],
      p2 = sandwiches[0]

    if (p1 === p2) {
      students.shift()
      sandwiches.shift()
    } else {
      students.push(students.shift())
    }
  }

  return students.length
}
