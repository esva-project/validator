import pgPromise from 'pg-promise'

import { LogDTOParameters } from '../dto/logsDTO'
const pg = pgPromise({})

const db = pg(`postgres://postgres:${process.env.DB_PASS}@db:5432/esva_db`)

const checkTableExists = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS logs (
        time VARCHAR DEFAULT NOW(),
        ip VARCHAR,
        receivingEndpoint VARCHAR,
        receivingParameters VARCHAR,
        requestsPerformed VARCHAR[],
        responseStatus SMALLINT,
        responseMessage VARCHAR
      );
    `
    await db.query(query)
    console.log('Table logs created (if it did not exist).')
  } catch (error) {
    console.error('Error creating table:', error)
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
