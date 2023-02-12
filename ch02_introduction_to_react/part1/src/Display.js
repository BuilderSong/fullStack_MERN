function Display({ number }) {
  if (number === 0) {
    return (<div>number is not being pressed</div>)
  }
  return (
    <div>{number}</div>
  )
}

export default Display