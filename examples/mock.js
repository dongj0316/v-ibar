const data = []

for (let i = 65; i < 91; i++) {
  const anchor = String.fromCharCode(i)
  // const len = i === 90 ? 20 : ~~(Math.random()*20)
  // const len = ~~(Math.random()*20)
  const len = 3
  for (let i = 0; i < len; i++) {
    const item = {
      anchor,
      name: `${anchor} -- ${i}`
    }
    data.push(item)
  }
}

export default data