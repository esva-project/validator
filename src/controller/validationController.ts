/** source/controllers/posts.ts */
import fs from 'fs'

import { Request, Response } from 'express'

import { LogDTOParameters } from '../dto/logsDTO'
import { MobilityLaParameters } from '../dto/mobilityParameters'
import softwarePackage from '../outrequests/softwarePackageCommunication'
import logs from '../services/logs'
import olaValidation from '../services/olaValidation'
import { logger } from '../utils/logs'

// Use Case to Validate OLAs
const validateOLA = async (req: Request, res: Response) => {
  console.log(req.path)

  // Read file that is sent
  const f = req.files
  const file = JSON.parse(JSON.stringify(f))

  const params = req.fields
  const mobParams = new MobilityLaParameters(
    params?.omobility_id as string,
    params?.sending_hei_id as string,
    params?.receiving_hei_id as string
  )

  fs.readFile(file.file.path, async function (_err: unknown, contents: Buffer) {
    logger.ola.info(
      new Date().toUTCString() + ' - Analyzing PDF of mobility ' + mobParams.getOMobilityID()
    )
    console.log(
      new Date().toUTCString() + ' - Analyzing PDF of mobility ' + mobParams.getOMobilityID()
    )
    // Read contents of file
    const contentsToSend = contents.toString('base64')
    // Retreive file information from ESVA software package
    const fileMeta = await softwarePackage.fetchFileMetadata(contentsToSend, file.file.name)
    // Validate OLA Contents and compare with EWP information
    const response = await olaValidation.validateOLA(JSON.stringify(fileMeta), mobParams)
    res.send(response)
    logger.ola.info('Validations: ' + JSON.stringify(response))
    logger.ola.info('----------------------------------------------------------------------------')

    response.clearDataForLogs()

    logs.insertLogs(
      new LogDTOParameters(
        req.socket.remoteAddress as string,
        req.path,
        JSON.stringify(mobParams.toJSON()),
        response.getURLs(),
        response.getStatus(),
        JSON.stringify(response)
      )
    )
  })
}

export default { validateOLA }
