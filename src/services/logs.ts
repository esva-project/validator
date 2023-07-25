import { LogDTOParameters } from '../dto/logsDTO'
import logsPersistence from '../persistence/logs'

const insertLogs = async (logsDTO: LogDTOParameters) => {
  logsPersistence
    .insertLogs(logsDTO)
    .then((logs) => {
      return logs
    })
    .catch((error) => {
      console.log(error)
    })
}

const getLogs = async () => {
  logsPersistence
    .getLogs()
    .then((logs) => {
      return logs
    })
    .catch((error) => {
      console.log(error)
    })
}

export default { getLogs, insertLogs }
