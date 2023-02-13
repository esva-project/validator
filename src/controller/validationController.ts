/** source/controllers/posts.ts */
import fs from 'fs'

import { Request, Response } from 'express'

import softwarePackage from '../outrequests/softwarePackageCommunication'
import olaValidation from '../services/olaValidation'

const validateOLA = async (req: Request, res: Response) => {
  // const title = 'example'
  const f = req.files
  const file = JSON.parse(JSON.stringify(f))
  let contentsToSend = ''

  fs.readFile(file.file.path, async function (_err: unknown, contents: Buffer) {
    contentsToSend = contents.toString('base64')
    const fileMeta = await softwarePackage.fetchFileMetadata(contentsToSend, file.file.name)
    const response = await olaValidation.validateOLA(JSON.stringify(fileMeta), contents)
    res.send(response)
  })
}

export default { validateOLA }
