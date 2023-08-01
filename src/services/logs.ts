import { LogDTOParameters } from '../dto/logsDTO'
import logsPersistence from '../persistence/logs'

const insertLogs = async (logsDTO: LogDTOParameters) => {
  await logsPersistence.checkTableExists()
  await logsPersistence
    .insertLogs(logsDTO)
    .then((logs) => {
      return logs
    })
    .catch((error) => {
      console.log(error)
    })
}

const getLogs = async () => {
  const logs = await logsPersistence.getLogs()
  const parsedLogs = JSON.parse(logs)

  // Parse the "responsemessage" property in each log entry to JSON
  for (const log of parsedLogs) {
    const timeParts = log.time.split('.')
    log.time = timeParts[0]
    log.responsemessage = JSON.parse(log.responsemessage)
    log.receivingparameters = JSON.parse(log.receivingparameters)
  }

  return parsedLogs
}

export default { getLogs, insertLogs }
