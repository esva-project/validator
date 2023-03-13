import { ResponseDTO } from '../../dto/response/response'
import { SignatureOrTimeStamp, SimpleReport } from '../../model/validationSoftwarePackage'
import { logger } from '../../utils/logs'

// Validates the Response fetched from Software package
const validateFileValidatorResponse = async (fileMeta: string) => {
  let simpleReport

  // Check if Simple Report object can be fetched
  try {
    simpleReport = new SimpleReport(JSON.stringify(JSON.parse(fileMeta).simpleReport))
  } catch (error) {
    return new ResponseDTO(0, 'Software Package response is invalid. ' + error)
  }

  // Validate Nr of Valid Signatures
  if (simpleReport.getNrValidSignatures() > 0) {
    const msg = `Found ${simpleReport.getNrValidSignatures()} valid signatures`
    logger.ola.info(msg)
  } else {
    return new ResponseDTO(0, 'No valid signatures found!')
  }

  // Fetch signatures and descriptions from the document
  const signatures = await fetchSignaturesInformation(simpleReport)
  if (!signatures.status) {
    return new ResponseDTO(0, `Error while fetching signature information`)
  }
  const response = new ResponseDTO(1, 'Document is valid')
  response.setPDFSignatures(signatures.values)

  // Fetch certificates from document
  const certificates = JSON.parse(fileMeta).certificates
  response.addSignersCertificateInformation(certificates)

  return response
}
// Fetch signatures and descriptions from the document
const fetchSignaturesInformation = async (simpleReport: SimpleReport) => {
  const list = []

  for (const e of simpleReport.getSignatures()) {
    // Fetch signature level and name
    const element = new SignatureOrTimeStamp(JSON.stringify(e))
    const msg = [
      `Signature of ${element.getSignedBy()} is a ${element.getSigLevelDescription()}`,
      `Signature of ${element.getSignedBy()} has expiration time ${element.getExtensionPeriodMax()}`
    ]
    for (const m of msg) logger.ola.info(m)

    // Check if signature expired
    if (new Date(element.getExtensionPeriodMax()).valueOf() != 0) {
      const diff = Date.now() - new Date(element.getExtensionPeriodMax()).valueOf()
      if (diff <= 0) {
        const msg = `Signature did not expire`
        logger.ola.info(msg)
      } else {
        const msg = `Signature of ${element.getSignedBy()} Expired`
        logger.ola.error(msg)
        return {
          status: false,
          values: list
        }
      }
      list.push({
        description: element.getSigLevelDescription(),
        signedBy: element.getSignedBy()
      })
    } else {
      const msg = `Could not analyze expiration date of ${element.getSignedBy()} signature`
      logger.ola.error(msg)
    }
  }

  return {
    status: true,
    values: list
  }
}

export default { validateFileValidatorResponse }
