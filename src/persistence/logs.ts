import pgPromise from 'pg-promise'

import { LogDTOParameters } from '../dto/logsDTO'
const pg = pgPromise({})

const db = pg(`postgres://postgres:"${process.env.DB_PASS}"@db:5432/esva_db`)

const getLogs = async () => {
  return await db.query('SELECT * FROM logs')
}

const insertLogs = async (logsDTO: LogDTOParameters) => {
  return await db.query(
    `insert into "logs" 
  ("ip", "receivingendpoint", "receivingparameters", "requestsPerformed", "responsestatus", "responsemessage") 
  values
  ('$1', '$2', '$3', '$4', '$5', '$6')`,
    [
      logsDTO.getIP(),
      logsDTO.getReceivingEndpoint(),
      logsDTO.getReceivingParameters(),
      logsDTO.getRequestsPerformed(),
      logsDTO.getResponseStatus(),
      logsDTO.getResponseMessage()
    ]
  )
}

export default { getLogs, insertLogs }
