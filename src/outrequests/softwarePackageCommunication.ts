import https from 'https'

import axios, { AxiosResponse } from 'axios'

const instance = axios.create({
  headers: { 'Content-Type': 'application/json; charset=UTF-8' },
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  }),
  method: 'POST'
})

const fetchFileMetadata = async (contentsToSend: string, filename: string) => {
  try {
    const response: AxiosResponse = await instance.post(
      `https://${process.env.ESVA_BACKEND}/api/v2/validation/document`,
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
      return error.message
    }
    console.log('unexpected error:', error)
    return 'An unexpected error occurred'
  }
}

export default { fetchFileMetadata }
