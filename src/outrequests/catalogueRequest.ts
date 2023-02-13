import https from 'https'

import axios, { AxiosResponse } from 'axios'
import xmlparser from 'xml2js'

const instance = axios.create({
  headers: { 'Content-Type': 'application/xml; charset=UTF-8' },
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  }),
  method: 'GET'
})

const fetchCatalogue = async () => {
  try {
    const response: AxiosResponse = await instance.get(
      `https://${process.env.REGISTRY_FQDN}/catalogue-v1.xml`
    )

    const par = xmlparser.parseStringPromise
    const h = response.data.replace(/(<\/)\s*(\w+):/g, '</').replace(/(<\s*\/?)\w+:/g, '<')
    return await par(h)
  } catch (error) {
    if (error instanceof Error) {
      return error.message
    }
    console.log('unexpected error:', error)
    return 'An unexpected error occurred'
  }
}

export default { fetchCatalogue }
