import https from 'https'

import axios, { AxiosResponse } from 'axios'

import { logger } from '../utils/logs'

const instance = axios.create({
  baseURL: `http://validador-core`,
  headers: { 'Content-Type': 'application/json; charset=UTF-8' },
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  }),
  method: 'POST'
})

// Make request to ESVA software package to retrieve file signature information
const fetchFileMetadata = async (contentsToSend: string, filename: string) => {
  logger.ola.warn(`http://validador-core/api/v2/validation/document`)
  try {
    const response: AxiosResponse = await instance.post(
      `/api/v2/validation/document`,
      JSON.stringify({
        dataToValidate: {
          signedDocument: {
            bytes: contentsToSend,
            name: filename
          },
          tokenExtractionStrategy: 'EXTRACT_ALL'
        },
        resources: ['simpleReport', 'certificates']
      })
    )

    return response.data
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message)
      return error.message
    }
    return 'An unexpected error occurred'
  }
}

export default { fetchFileMetadata }
