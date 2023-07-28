import { LogDTOParameters } from '../dto/logsDTO'
import logsPersistence from '../persistence/logs'

const insertLogs = async (logsDTO: LogDTOParameters) => {
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
  await logsPersistence
    .getLogs()
    .then((logs) => {
      console.log(logs)
      return logs
    })
    .catch((error) => {
      console.log(error)
    })
}

export default { getLogs, insertLogs }
