import fs from 'fs'
import https from 'https'

import axios, { AxiosResponse } from 'axios'
import httpSignature from 'http-signature'
import xmlparser from 'xml2js'

const instance = axios.create({
  headers: { 'Content-Type': 'application/xml; charset=UTF-8' },
  httpsAgent: new https.Agent({
    cert: fs.readFileSync(`./certificates/${process.env.CERT_DOMAIN}.crt`),
    key: fs.readFileSync(`./certificates/${process.env.CERT_DOMAIN}.key`),
    rejectUnauthorized: false
  }),
  method: 'GET'
})

const get = async (get_url: string, params: unknown) => {
  try {
    console.log(instance)
    httpSignature.sign(instance.defaults, {
      key: fs.readFileSync(`./certificates/${process.env.CERT_DOMAIN}.key`),
      keyId: `./certificates/${process.env.CERT_DOMAIN}.crt`
    })
    const response: AxiosResponse = await instance.get(get_url, {
      params
    })
    const par = xmlparser.parseStringPromise
    const h = response.data.replace(/(<\/)\s*(\w+):/g, '</').replace(/(<\s*\/?)\w+:/g, '<')
    return await par(h)
  } catch (error) {
    console.log(error)
    if (error instanceof Error) {
      return error.message
    }
    console.log('unexpected error:', error)
    return 'An unexpected error occurred'
  }
}

export default { get }
