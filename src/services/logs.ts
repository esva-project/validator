import { LogDTOParameters } from '../dto/logsDTO'
import { LogGetDTOParameters } from '../dto/logsGetDTO'
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

const getLogs = async (logParameters: LogGetDTOParameters) => {
  await logsPersistence.checkTableExists()

  const [logs, total] = await logsPersistence.getLogs(logParameters)
  const parsedLogs = JSON.parse(logs)

  // Parse the "responsemessage" property in each log entry to JSON
  for (const log of parsedLogs) {
    const timeParts = log.time.split('.')
    log.time = timeParts[0]
    log.responsemessage = JSON.parse(log.responsemessage)
    log.receivingparameters = JSON.parse(log.receivingparameters)
  }

  const startingIndex = (logParameters.getSelectedPage() - 1) * 10 + 1
  let finishIndex = startingIndex + 9

  if (total < 9) finishIndex = total

  const returningJSON = {
    index: {
      currentLogs: `Showing logs from index ${startingIndex} to ${finishIndex} out of ${total}`,
      currentPage: `Showing page ${logParameters.getSelectedPage()} of ${Math.ceil(total / 10)}`
    },
    logs: parsedLogs
  }

  const prettifiedLogs = JSON.stringify(returningJSON, undefined, 2)

  return prettifiedLogs
}

export default { getLogs, insertLogs }
