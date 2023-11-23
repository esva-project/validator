const partialPresentInFull = (str1: string, str2: string) => {
  let full, partial
  if (str1.length >= str2.length) {
    full = str1
    partial = str2
  } else {
    full = str2
    partial = str1
  }

  console.log('partial ' + partial)
  console.log('full ' + full)
  const partialList = partial.split(' ')
  for (const p of partialList) {
    if (!full.includes(p)) {
      return false
    }
  }
  return true
}

export { partialPresentInFull }
