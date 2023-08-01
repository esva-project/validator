import pgPromise from 'pg-promise'

import { LogDTOParameters } from '../dto/logsDTO'
const pg = pgPromise({})

const db = pg(`postgres://postgres:${process.env.DB_PASS}@db:5432/esva_db`)

console.log(`postgres://postgres:${process.env.DB_PASS}@db:5432/esva_db`)

const checkTableExists = async (tableName: string) => {
  try {
    const query = `
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_name = $1
      );
    `
    const result = await db.query(query, [tableName])
    console.log(result)
  } catch (error) {
    console.error('Error checking if table exists:', error)
  }
}

const getLogs = async () => {
  return JSON.stringify(await db.query('SELECT * FROM logs'))
}

const insertLogs = async (logsDTO: LogDTOParameters) => {
  return await db.query(
    `insert into "logs" 
  ("ip", "receivingendpoint", "receivingparameters", "requestsperformed", "responsestatus", "responsemessage") 
  values
  ($1, $2, $3, $4, $5, $6)`,
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

export default { checkTableExists, getLogs, insertLogs }
