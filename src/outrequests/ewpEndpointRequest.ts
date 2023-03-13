/* eslint-disable node/no-unsupported-features/node-builtins */
import crypto from 'crypto'
import fs from 'fs'
import https from 'https'
import url from 'url'

import httpSignature from 'http-signature'
import { v4 as uuidv4 } from 'uuid'
import xmlparser from 'xml2js'

import { logger } from '../utils/logs'

const get = async (get_url: string, params: any) => {
  const parser = new url.URL(get_url)

  const algorithm = 'sha256'
  const digest = crypto.createHash(algorithm).update('').digest('base64')

  const options = {
    headers: {
      'Content-Type': 'application/xml; charset=UTF-8',
      Digest: 'SHA-256=' + digest.toString(),
      'Request-Target': 'GET /' + parser.host.replace(':8443', ''),
      'X-Request-Id': uuidv4()
    },
    host: parser.host.replace(':8443', ''),
    method: 'GET',
    path: parser.pathname + '?' + new URLSearchParams(params).toString(),
    port: parser.port
  }

  logger.ola.info('URL Found: ' + get_url)
  logger.ola.info('Parameters used: ' + JSON.stringify(params))
  logger.ola.info('Options: ' + JSON.stringify(options))

  const res: any = await doRequest(options)
  const par = xmlparser.parseStringPromise
  const h = res.replace(/(<\/)\s*(\w+):/g, '</').replace(/(<\s*\/?)\w+:/g, '<')

  return await par(h, { explicitArray: false })
}

function doRequest(options: any) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      res.setEncoding('utf8')
      let responseBody = ''

      res.on('data', (chunk) => {
        responseBody += chunk
      })

      res.on('end', () => {
        resolve(responseBody)
      })
    })

    httpSignature.sign(req, {
      headers: ['(request-target)', 'host', 'date', 'digest', 'x-request-id'],
      key: fs.readFileSync(`./certificates/${process.env.CERT_DOMAIN}.key`),
      keyId: process.env.EWP_KEY_ID
    })

    req.on('error', (err) => {
      reject(err)
    })

    req.end()
  })
}

export default { get }
