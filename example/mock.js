const data = []

for (let i = 65; i < 91; i++) {
  const letter = String.fromCharCode(i)
  // const len = i === 90 ? 20 : ~~(Math.random()*20)
  const len = ~~(Math.random()*20)
  for (let i = 0; i < len; i++) {
    const item = {
      letter,
      name: `${letter} -- ${i}`
    }
    data.push(item)
  }
}

export default data