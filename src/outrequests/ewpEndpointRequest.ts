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

  // const posing = params.posing_hei
  params.posing_hei = ''

  const algorithm = 'sha256'
  const digest = crypto.createHash(algorithm).update('').digest('base64')
  // const username = 'lIZ5$nrr8B4h'
  // const password = 'tN21Fy9&3lrs'
  // const authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64')
  const options = {
    headers: {
      'Content-Type': 'application/xml; charset=UTF-8',
      Digest: 'SHA-256=' + digest.toString(),
      'Request-Target': 'GET /' + parser.host.replace(':8443', ''),
      'X-Request-Id': uuidv4()
    } as Record<string, string>,
    host: parser.host.replace(':8443', ''),
    method: 'GET',
    path: parser.pathname + '?' + new URLSearchParams(params).toString(),
    port: parser.port
  }
  const actualUrl = Array.isArray(get_url) ? get_url[0] : get_url

  if (actualUrl.includes('ewp.up.pt')) {
    // options.headers.Posing = posing
    // options.headers.Authorization = authHeader
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
  console.log('hereeee')
  console.log(options)
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
