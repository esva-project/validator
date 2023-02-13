const writeGreen = async (message: string) => {
  console.log('\u001B[32m%s\u001B[0m', `SUCCESS: ${message}`)
}

const writeRed = async (message: string) => {
  console.log('\u001B[31m%s\u001B[0m', `ERROR: ${message}`)
}

const writeBlue = async (message: string) => {
  console.log('\u001B[34m%s\u001B[0m', `INFO: ${message}`)
}

const writeYellow = async (message: string) => {
  console.log('\u001B[33m%s\u001B[0m', `WARNING: ${message}`)
}

export default { writeBlue, writeGreen, writeRed, writeYellow }
