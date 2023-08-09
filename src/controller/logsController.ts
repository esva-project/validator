import { Request, Response } from 'express'

import { LogGetDTOParameters } from '../dto/logsGetDTO'
import logsService from '../services/logs'

// Use Case to Validate OLAs
const logs = async (req: Request, res: Response) => {
  console.log(req.path)
  const logParameters = await processLogParameters(req.query)

  const logs = await logsService.getLogs(logParameters)

  res.setHeader('Content-Type', 'application/json')
  res.send(logs)
}

const processLogParameters = async (query: any) => {
  console.log(query)
  console.log(query.requestsperformedcontains)
  if (query.requestsperformedcontains == undefined) {
    query.requestsperformedcontains = []
  }
  return new LogGetDTOParameters(
    query.page,
    query.since,
    query.until,
    query.ip,
    query.browser,
    query.operating_system,
    query.receivingendpoint,
    query.receivingparameterscontains,
    query.requestsperformedcontains,
    query.responsestatus,
    query.responsemessagecontains
  )
}

export default { logs }
