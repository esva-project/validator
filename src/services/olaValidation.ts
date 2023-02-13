// FIXME
import { PDFDocument } from 'pdf-lib'
import winston from 'winston'

import {
  HEIInformationDTO,
  HEIInformationDTOConstructor,
  HEISignatureDTO
} from '../dto/HeiInformationDTO'
import { PDFContentsDTO } from '../dto/pdfContentsDTO'
import { AttributesValidationsConstructor, ResponseDTOConstructor } from '../dto/response'
import { SignerCertificateInformationDTOConstructor } from '../dto/signerCertificateInformationDTO'
import { StudentInformationDTOConstructor } from '../dto/StudentInformationDTO'
import { Catalogue } from '../model/catalogue'
import {
  EWPResponseContentValidationsConstructor,
  HEIValidationsConstructor,
  StudentValidationsConstructor,
  Validations,
  ValidationsConstructor
} from '../model/validations'
import fetchCatalogue from '../outrequests/catalogueRequest'
import EWPRequest from '../outrequests/ewpEndpointRequest2'

const logger = winston.createLogger({
  transports: [new winston.transports.Console()]
})

const sending_schac_code_field = 'sending_hei_id'
const receiving_schac_code_field = 'receiving_hei_id'
const omobility_id_field = 'omobility_id'

const validateOLA = async (fileMeta: string, contentsToSend: Buffer) => {
  // Validate Signature Information
  const response = await validateFileValidatorResponse(fileMeta)

  // Read PDF Form Field names and values
  const contentsResponse = await fetchDataFromPDF(contentsToSend, response)
  if (contentsResponse.getResponse().validationResult == 'FAILED') {
    return contentsResponse
  }

  const pdf = JSON.parse(contentsResponse.getResponse().message)
  const pdfContents = new PDFContentsDTO(pdf.omobility_id, pdf.sending_hei_id, pdf.receiving_hei_id)
  // const omobility_id = '7957EF4C45AC4946221ED3768EB67372'
  // const sending_hei_id = 'up.pt'
  // const receiving_schac_code = 'uni-foundation.eu'

  // Fetch Data From EWP
  console.log(pdfContents)
  const mobility_response = await fetchMobilityXMLFromEWP(pdfContents)

  // START VALIDATING
  let mobilityValidation = await validateEWPMobilityResponse(
    mobility_response,
    pdfContents,
    response
  )

  // Fetch Data From Sending HEI EWP Institutions API
  const sending_institutions_response = await fetchInstitutionsXMLFromEWP(
    pdfContents.getSendingSchac()
  )
  if (sending_institutions_response) {
    mobilityValidation = await validateEWPInstitutionsResponse(
      'sending',
      sending_institutions_response,
      mobilityValidation.getResponse().validations.ewpResponse.mobility.sending_hei,
      mobilityValidation
    )
  }
  // Fetch Data From Sending HEI EWP Institutions API
  const receiving_institutions_response = await fetchInstitutionsXMLFromEWP(
    pdfContents.getReceivingSchac()
  )
  if (receiving_institutions_response) {
    mobilityValidation = await validateEWPInstitutionsResponse(
      'receiving',
      receiving_institutions_response,
      mobilityValidation.getResponse().validations.ewpResponse.mobility.receiving_hei,
      mobilityValidation
    )
  }

  const la = mobility_response['omobility-las-get-response'].la[0]

  if (la['sending-hei'][0]['ounit-id']) {
    const sending_hei_ounit_id = la['sending-hei'][0]['ounit-id'][0]

    console.log(sending_hei_ounit_id)
    // Fetch Data From Sending HEI EWP OUnits API
    const sending_ounits_response = await fetchOUnitsXMLFromEWP(
      pdfContents.getSendingSchac(),
      sending_hei_ounit_id
    )
    if (sending_ounits_response) {
      console.log(sending_ounits_response)
    }

    if (sending_ounits_response) {
      mobilityValidation = await validateEWPOUnitsResponse(
        'sending',
        sending_ounits_response,
        mobilityValidation.getResponse().validations.ewpResponse.mobility
          .sending_hei as HEIInformationDTO,
        mobilityValidation
      )
    }
  }

  if (la['receiving-hei'][0]['ounit-id']) {
    const receiving_hei_ounit_id = la['receiving-hei'][0]['ounit-id'][0]

    console.log(receiving_hei_ounit_id)
    // Fetch Data From Sending HEI EWP OUnits API
    const receiving_ounits_response = await fetchOUnitsXMLFromEWP(
      pdfContents.getReceivingSchac(),
      receiving_hei_ounit_id
    )
    if (receiving_ounits_response) {
      console.log(receiving_ounits_response)
    }

    if (receiving_ounits_response) {
      mobilityValidation = await validateEWPOUnitsResponse(
        'receiving',
        receiving_ounits_response,
        mobilityValidation.getResponse().validations.ewpResponse.mobility
          .receiving_hei as HEIInformationDTO,
        mobilityValidation
      )
    }
  }

  return mobilityValidation
}

const validateFileValidatorResponse = async (fileMeta: string) => {
  const simpleReport = JSON.parse(fileMeta).simpleReport

  const logs: string[] = []

  // Build Match Attributes
  const matchAttributes = new AttributesValidationsConstructor(simpleReport.validSignaturesCount)

  // Validate Nr of Signatures
  if (simpleReport.validSignaturesCount > 0) {
    const msg = `Found ${simpleReport.validSignaturesCount} signatures`
    logger.info(msg)
    logs.push(`SUCCESS: ${msg}`)
  } else {
    const msg = 'No signatures found!'
    logger.error(msg)
    logs.push(`ERROR: ${msg}`)
    return new ResponseDTOConstructor(
      'FAILED',
      'No signatures found',
      matchAttributes.getValidations(),
      logs
    )
  }

  for (const element of simpleReport.signatureOrTimestamp) {
    // Fetch signature level and name
    const msg = [
      `Signature of ${element.signedBy} is a ${element.signatureLevel.description}`,
      `Signature of ${element.signedBy} has expiration time ${element.extensionPeriodMax}`
    ]
    for (const m of msg) {
      logger.info(m)
      logs.push(`INFO: ${m}`)
    }

    const diff = Date.now() - new Date(element.extensionPeriodMax).valueOf()
    if (diff <= 0) {
      const msg = `Signature did not expire`
      logger.info(msg)

      logs.push(`SUCCESS: ${msg}`)
    } else {
      const msg = 'Signature Expired'
      logger.error(msg)
      logs.push(`ERROR: ${msg}`)
      return new ResponseDTOConstructor(
        'FAILED',
        `Signature of ${element.signedBy} Expired`,
        matchAttributes.getValidations(),
        logs
      )
    }

    matchAttributes.setSignersDocument(element.signedBy, element.signatureLevel.description)
  }

  const certificates = JSON.parse(fileMeta).certificates

  // Fetch country and common name from certificates
  for (const element of certificates) {
    const certInfo = new SignerCertificateInformationDTOConstructor(
      element.commonName,
      element.countryName,
      element.organizationIdentifier,
      element.organizationName,
      element.email,
      element.subjectDistinguishedName
    )
    matchAttributes.setSignersCertificateInformation(certInfo.getResponse())
  }

  return new ResponseDTOConstructor(
    'SUCCESS',
    'Document is valid',
    matchAttributes.getValidations(),
    logs
  )
}
const fetchDataFromPDF = async (contentsToSend: Buffer, response: ResponseDTOConstructor) => {
  const pdfDoc = await PDFDocument.load(contentsToSend)
  const form = pdfDoc.getForm()
  const fields = form.getFields()

  const listOfFieldName = []

  for (const field of fields) {
    const type = field.constructor.name
    const name = field.getName()
    listOfFieldName.push(name)
    console.log(`${type}: ${name}`)
  }

  // Validate if fields exist in PDF form
  if (
    !listOfFieldName.includes(sending_schac_code_field) ||
    !listOfFieldName.includes(receiving_schac_code_field) ||
    !listOfFieldName.includes(omobility_id_field)
  ) {
    response.addLog('ERROR: Required PDF fields not found.')
    return new ResponseDTOConstructor(
      'FAILED',
      'Required PDF fields not found.',
      response.getResponse().validations,
      response.getResponse().logs
    )
  }

  return new ResponseDTOConstructor(
    'SUCCESS',
    JSON.stringify({
      omobility_id: form.getTextField(omobility_id_field).getText(),
      receiving_hei_id: form.getTextField(receiving_schac_code_field).getText(),
      sending_hei_id: form.getTextField(sending_schac_code_field).getText()
    }),
    response.getResponse().validations,
    response.getResponse().logs
  )
}
const fetchMobilityXMLFromEWP = async (pdfContents: PDFContentsDTO) => {
  const catalogue = new Catalogue(await fetchCatalogue.fetchCatalogue())
  const params = {
    omobility_id: pdfContents.getOMobilityID(),
    sending_hei_id: pdfContents.getSendingSchac()
  }

  let mobility_get_url = ''
  for (const host of catalogue.getHosts()) {
    for (const instCovered of catalogue.getInstitutionsCovered(host)) {
      if (params.sending_hei_id === catalogue.getHEIID(instCovered)) {
        mobility_get_url = catalogue.getOMobilityLASAPIURL(catalogue.getAPIImplemented(host))
      }
    }
  }

  console.log(mobility_get_url)
  return await EWPRequest.get(mobility_get_url, params)
}
const fetchInstitutionsXMLFromEWP = async (hei_id: string) => {
  const catalogue = new Catalogue(await fetchCatalogue.fetchCatalogue())
  const params = { hei_id }

  let url = ''

  for (const host of catalogue.getHosts()) {
    for (const instCovered of catalogue.getInstitutionsCovered(host)) {
      if (hei_id === catalogue.getHEIID(instCovered)) {
        url = catalogue.getInstitutionsAPIURL(catalogue.getAPIImplemented(host))
      }
    }
  }

  console.log(url)
  if (url) {
    return await EWPRequest.get(url, params)
  }
  return
}

const fetchOUnitsXMLFromEWP = async (hei_id: string, ounit_id: string) => {
  const catalogue = new Catalogue(await fetchCatalogue.fetchCatalogue())
  const params = {
    hei_id,
    ounit_id
  }

  let url = ''

  for (const host of catalogue.getHosts()) {
    for (const instCovered of catalogue.getInstitutionsCovered(host)) {
      if (hei_id === catalogue.getHEIID(instCovered)) {
        url = catalogue.getOUnitsAPIURL(catalogue.getAPIImplemented(host))
      }
    }
  }

  console.log(url)
  if (url) {
    return await EWPRequest.get(url, params)
  }
  return
}

const validateEWPMobilityResponse = async (
  mobility_response: any,
  pdfContents: PDFContentsDTO,
  response: ResponseDTOConstructor
) => {
  console.log(JSON.stringify(mobility_response, undefined, 2))
  const la = mobility_response['omobility-las-get-response'].la[0]
  const mobility_response_mobility_id = la['omobility-id'][0]
  const first_version = la['first-version'][0]
  // FETCH HEIS AND STUDENT INFORMATION
  // SENDING
  const sending_hei_information = await getMobilityHEIInformation('sending', la, first_version)
  // RECEIVING
  const receiving_hei_information = await getMobilityHEIInformation('receiving', la, first_version)
  // STUDENT
  const student_information = await getStudentInformation(la)

  // Checks if PDF mobility ID and EWP Mobility IDs are the same
  const mobilityIDsAreEqual = pdfContents.getOMobilityID() === mobility_response_mobility_id
  // Checks if PDF sending schac code and EWP Mobility sending schac code are the same
  const sendingSCHACCodesAreEqual =
    pdfContents.getSendingSchac() === sending_hei_information.getSchac()
  // Checks if PDF receiving schac code and EWP Mobility receiving schac code are the same
  const receivingSCHACCodesAreEqual =
    pdfContents.getReceivingSchac() === receiving_hei_information.getSchac()
  // Build EWP Response Content Validations
  const ewpResponseContentValidations = new EWPResponseContentValidationsConstructor(
    mobilityIDsAreEqual,
    sendingSCHACCodesAreEqual,
    receivingSCHACCodesAreEqual
  )

  // Perform EWP Response Content Validations
  const err = await validatePDFContents(ewpResponseContentValidations)
  if (err != '') {
    response.addLog(err)
    return new ResponseDTOConstructor(
      'FAILED',
      err,
      response.getResponse().validations,
      response.getResponse().logs
    )
  }

  // Set the EWPResponse object in the response JSON
  response.setSendingHEIMobilityInformation(sending_hei_information.getResponse())
  response.setReceivingHEIMobilityInformation(receiving_hei_information.getResponse())
  response.setStudentInformation(student_information.getResponse())

  // Add information about the mobility found
  const msg = `Found Correct Mobility with ID ${pdfContents.getOMobilityID()}`
  logger.info(msg)
  response.addLog(`SUCCESS: ${msg}`)
  response.addLog(await printSignerInformation(sending_hei_information.getResponse()))
  response.addLog(await printSignerInformation(receiving_hei_information.getResponse()))

  // Compare PDF Signatures With Sending HEI, Receiving HEI, and Student Information
  const findings = {
    receiving_hei: { foundSignatureEmail: false, foundSignatureName: false },
    sending_hei: { foundSignatureEmail: false, foundSignatureName: false },
    student: { foundEmail: false, foundName: false }
  }

  const sending_signature = sending_hei_information.getSignature()
  const receiving_signature = receiving_hei_information.getSignature()
  if (sending_signature && receiving_signature) {
    for (const signature of response.response.validations.signature) {
      if (signature.signerDocument === sending_signature.getSigName()) {
        findings.sending_hei.foundSignatureName = true
      }
      if (signature.email === sending_signature.getSigEmail()) {
        findings.sending_hei.foundSignatureEmail = true
      }
      if (signature.signerDocument === receiving_signature.getSigName()) {
        findings.receiving_hei.foundSignatureName = true
      }
      if (signature.email === receiving_signature.getSigEmail()) {
        findings.receiving_hei.foundSignatureEmail = true
      }
      if (signature.signerDocument === student_information.getContactPersonName()) {
        findings.student.foundName = true
      }
      if (signature.signerDocument === student_information.getContactPersonEmail()) {
        findings.student.foundEmail = true
      }
    }
  }

  // Build Validations Objects
  const sendingHEIValidations = new HEIValidationsConstructor(
    findings.sending_hei.foundSignatureName,
    findings.sending_hei.foundSignatureEmail
  )
  const receivingHEIValidations = new HEIValidationsConstructor(
    findings.receiving_hei.foundSignatureName,
    findings.receiving_hei.foundSignatureEmail
  )
  const studentValidations = new StudentValidationsConstructor(
    findings.student.foundName,
    findings.student.foundEmail
  )

  // Perform Validations of Information between Response and PDF
  response.addLog(
    await validateAttribute(
      sendingHEIValidations.getResponse().isHEISignatureNameEqualsPDF,
      'Sending HEI Signature Person Name',
      sending_hei_information.getSignature()?.getSigName() as string
    )
  )
  response.addLog(
    await validateAttribute(
      sendingHEIValidations.getResponse().isHEISignatureEmailEqualsPDF,
      'Sending HEI Signature Person Email',
      sending_hei_information.getSignature()?.getSigEmail() as string
    )
  )
  response.addLog(
    await validateAttribute(
      receivingHEIValidations.getResponse().isHEISignatureNameEqualsPDF,
      'Receiving HEI Signature Person Name',
      receiving_hei_information.getSignature()?.getSigName() as string
    )
  )
  response.addLog(
    await validateAttribute(
      receivingHEIValidations.getResponse().isHEISignatureEmailEqualsPDF,
      'Receiving HEI Signature Person Email',
      receiving_hei_information.getSignature()?.getSigEmail() as string
    )
  )
  response.addLog(
    await validateAttribute(
      studentValidations.getResponse().isNameEqual,
      'Student Person Name',
      student_information.getContactPersonName()
    )
  )
  response.addLog(
    await validateAttribute(
      studentValidations.getResponse().isEmailEqual,
      'Student Person Email',
      student_information.getContactPersonEmail()
    )
  )

  // Build Validations Object
  const validations = new ValidationsConstructor(
    ewpResponseContentValidations.getResponse(),
    sendingHEIValidations.getResponse(),
    receivingHEIValidations.getResponse(),
    studentValidations.getResponse()
  )

  response.setMatches(validations.getResponse())

  return new ResponseDTOConstructor(
    'SUCCESS',
    `Document is Valid. Found ${response.countCorrectValidations()}/${response.countValidations()} matches with the Mobility found in EWP.`,
    response.getResponse().validations,
    response.getResponse().logs
  )
}
const validateEWPInstitutionsResponse = async (
  flow: string,
  institutions_response: any,
  hei_information: any,
  response: ResponseDTOConstructor
) => {
  const hei = institutions_response['institutions-response'].hei[0]
  const schac_code = hei['hei-id'][0]
  const institutionName = hei['name'][0]['_']
  const contactList: HEIInformationDTO[] = []
  if (hei['contact']) {
    for (const contact of hei['contact']) {
      const heiInfo = await getInstitutionsHEIContactInformation(contact)
      const msg = `Found Contact from ${institutionName} (${schac_code}): ${heiInfo.contactPersonName} (${heiInfo.contactPersonEmail})`
      logger.info(msg)
      response.addLog(`INFO: ${msg}`)
      contactList.push(heiInfo)
    }
  }
  const msg = `Fetched Information from ${schac_code} insitution`
  logger.info(msg)
  response.addLog(`SUCCESS: ${msg}`)

  // Compare Institution and Mobility Informations
  const findings = {
    rolesEqual: false,
    schacCodesEqual: false,
    signatureEmailInInstitutionContact: false,
    signatureNameInInstitutionContact: false
  }

  if (schac_code === hei_information.schac_code) {
    findings.schacCodesEqual = true
  }
  for (const contact of contactList) {
    if (contact.contactPersonName === hei_information.signature.getSigName()) {
      findings.signatureNameInInstitutionContact = true
    }
    if (contact.contactPersonEmail === hei_information.signature.getSigEmail()) {
      findings.signatureEmailInInstitutionContact = true
    }
    if (contact.roleDescription === hei_information.signature.getSigPosition()) {
      findings.rolesEqual = true
    }
  }

  const apiLabel = 'Institution'

  response.addLog(
    await compareMobilityAttributeWithInstitutionOrOUnitAttribute(
      apiLabel,
      findings.schacCodesEqual,
      'HEI ID',
      'SCHAC code',
      hei_information.schac_code
    )
  )
  response.addLog(
    await compareMobilityAttributeWithInstitutionOrOUnitAttribute(
      apiLabel,
      findings.rolesEqual,
      'Role Description',
      'Signer Position',
      hei_information.signature.getSigPosition()
    )
  )
  response.addLog(
    await compareMobilityAttributeWithInstitutionOrOUnitAttribute(
      apiLabel,
      findings.signatureNameInInstitutionContact,
      'Contact Name',
      'Signature Name',
      hei_information.signature.getSigName()
    )
  )
  response.addLog(
    await compareMobilityAttributeWithInstitutionOrOUnitAttribute(
      apiLabel,
      findings.signatureEmailInInstitutionContact,
      'Contact Email',
      'Signature Email',
      hei_information.signature.getSigEmail()
    )
  )

  const currentMatches = response.getResponse().validations.matches as Validations
  const inst = new ValidationsConstructor(
    currentMatches.ewpResponseContentValidations,
    currentMatches.sendingHeiValidations,
    currentMatches.receivingHeiValidations,
    currentMatches.studentValidations
  )
  if (flow == 'sending') {
    inst.setSendingInstitutionsValidations(
      findings.signatureNameInInstitutionContact,
      findings.signatureEmailInInstitutionContact,
      findings.schacCodesEqual,
      findings.rolesEqual
    )
    response.setSendingHEIInstitutionInformation(contactList, schac_code)
  } else {
    inst.setReceivingInstitutionsValidations(
      findings.signatureNameInInstitutionContact,
      findings.signatureEmailInInstitutionContact,
      findings.schacCodesEqual,
      findings.rolesEqual
    )
    response.setReceivingHEIInstitutionInformation(contactList, schac_code)
  }

  response.setMessage(
    `Document is Valid. Found ${response.countCorrectValidations()}/${response.countValidations()} matches with the Mobility found in EWP.`
  )

  return response
}

const validateEWPOUnitsResponse = async (
  flow: string,
  ounits_response: any,
  hei_information: HEIInformationDTO,
  response: ResponseDTOConstructor
) => {
  const ounit = ounits_response['ounits-response'].ounit[0]
  const ounit_id = ounit['ounit-id'][0]
  const ounit_name = ounit['name'][0]['_']
  const contactList: HEIInformationDTO[] = []
  if (ounit['contact']) {
    for (const contact of ounit['contact']) {
      const ounitInfo = await getInstitutionsHEIContactInformation(contact)
      const msg = `Found Contact from ${ounit_name} (${ounit_id}): ${ounitInfo.contactPersonName} (${ounitInfo.contactPersonEmail})`
      logger.info(msg)
      response.addLog(`INFO: ${msg}`)
      contactList.push(ounitInfo)
    }
  }
  const msg = `Fetched Information from ${ounit_id} ounit named ${ounit_name}`
  logger.info(msg)
  response.addLog(`SUCCESS: ${msg}`)

  // Compare Institution and Mobility Informations
  const findings = {
    contactEmailInOUnitContact: false,
    contactNameInOUnitContact: false,
    ounitIdsEqual: false,
    ounitNamesEqual: false,
    rolesEqual: false
  }

  if (ounit_id === hei_information.ounit_id) {
    findings.ounitIdsEqual = true
  }
  if (ounit_name === hei_information.ounit_name) {
    findings.ounitNamesEqual = true
  }
  for (const contact of contactList) {
    if (contact.contactPersonName === hei_information.contactPersonName) {
      findings.contactNameInOUnitContact = true
    }
    if (contact.contactPersonEmail === hei_information.contactPersonEmail) {
      findings.contactEmailInOUnitContact = true
    }
    if (contact.roleDescription === hei_information.roleDescription) {
      findings.rolesEqual = true
    }
  }

  const apiLabel = 'Organizational Unit'

  response.addLog(
    await compareMobilityAttributeWithInstitutionOrOUnitAttribute(
      apiLabel,
      findings.ounitIdsEqual,
      'OUnit ID',
      'OUnit ID',
      hei_information.ounit_id as string
    )
  )
  response.addLog(
    await compareMobilityAttributeWithInstitutionOrOUnitAttribute(
      apiLabel,
      findings.ounitNamesEqual,
      'OUnit Name',
      'OUnit Name',
      hei_information.ounit_name as string
    )
  )
  response.addLog(
    await compareMobilityAttributeWithInstitutionOrOUnitAttribute(
      apiLabel,
      findings.rolesEqual,
      'Role Description',
      'Contact Position',
      hei_information.roleDescription as string
    )
  )
  response.addLog(
    await compareMobilityAttributeWithInstitutionOrOUnitAttribute(
      apiLabel,
      findings.contactNameInOUnitContact,
      'Contact Name',
      'Contact Name',
      hei_information.contactPersonName
    )
  )
  response.addLog(
    await compareMobilityAttributeWithInstitutionOrOUnitAttribute(
      apiLabel,
      findings.contactEmailInOUnitContact,
      'Contact Email',
      'Contact Email',
      hei_information.contactPersonEmail
    )
  )

  const currentMatches = response.getResponse().validations.matches as Validations
  const inst = new ValidationsConstructor(
    currentMatches.ewpResponseContentValidations,
    currentMatches.sendingHeiValidations,
    currentMatches.receivingHeiValidations,
    currentMatches.studentValidations
  )
  if (flow == 'sending') {
    inst.setSendingOUnitValidations(
      findings.rolesEqual,
      findings.contactNameInOUnitContact,
      findings.contactEmailInOUnitContact,
      findings.ounitIdsEqual,
      findings.ounitNamesEqual
    )
    response.setSendingHEIOUnitInformation(contactList, ounit_id, ounit_name)
  } else {
    inst.setReceivingOUnitValidations(
      findings.rolesEqual,
      findings.contactNameInOUnitContact,
      findings.contactEmailInOUnitContact,
      findings.ounitIdsEqual,
      findings.ounitNamesEqual
    )
    response.setReceivingHEIOUnitInformation(contactList, ounit_id, ounit_name)
  }

  response.setMessage(
    `Document is Valid. Found ${response.countCorrectValidations()}/${response.countValidations()} matches with the Mobility found in EWP.`
  )

  return response
}

/*********
AUXILIARY METHODS
********** */
const validateAttribute = async (toValidate: boolean, label: string, attribute: string) => {
  if (!toValidate) {
    const msg = `${label} (${attribute}) Not Found in PDF Signatures`
    logger.warn(msg)
    return `WARNING: ${msg}`
  }
  const msg = `${label} (${attribute}) matched in PDF Signatures`
  logger.info(msg)
  return `SUCCESS: ${msg}`
}
const validatePDFField = async (toValidate: boolean, label: string) => {
  if (!toValidate) {
    const msg = `${label} in EWP Mobility Agreement is not the same as the one specified in the PDF`
    logger.error(msg)
    return `ERROR: ${msg}`
  }
  return ``
}
const compareMobilityAttributeWithInstitutionOrOUnitAttribute = async (
  apiLabel: string,
  toValidate: boolean,
  labelInstitution: string,
  labelMobility: string,
  attributeMobility: string
) => {
  if (!toValidate) {
    const msg = `${apiLabel} ${labelInstitution}s do not contain/is different than the Mobility ${labelMobility} (${attributeMobility})`
    logger.warn(msg)
    return `WARNING: ${msg}`
  }
  const msg = `${apiLabel} ${labelInstitution}s contain/is equal to the Mobility ${labelMobility} (${attributeMobility})`
  logger.info(msg)
  return `SUCCESS: ${msg}`
}
const getMobilityHEIInformation = async (flow: string, la: any, first_version: any) => {
  const schac_code = la[`${flow}-hei`][0]['hei-id'][0]
  let ounit_id, ounit_name
  if (la[`${flow}-hei`][0]['ounit-id']) {
    ounit_id = la[`${flow}-hei`][0]['ounit-id'][0]
  }
  if (la[`${flow}-hei`][0]['ounit-name']) {
    ounit_name = la[`${flow}-hei`][0]['ounit-name'][0]
  }

  const contact = la[`${flow}-hei`][0]['contact-person'][0]
  const contact_name = `${contact['given-names'][0]} ${contact['family-name'][0]}`
  const email = contact['email'][0]

  const sig = first_version[`${flow}-hei-signature`][0]
  const sig_name = sig['signer-name'][0]
  const sig_email = sig['signer-email'][0]
  const position = sig['signer-position'][0]

  const hei = new HEIInformationDTOConstructor(contact_name, email)
  hei.setSignature(new HEISignatureDTO(sig_email, sig_name, position))
  if (schac_code != '') {
    hei.setSchac(schac_code)
  }
  if (ounit_id != '' || ounit_name != '') {
    hei.setOUnitInformation(ounit_id, ounit_name)
  }
  return hei
}
const getInstitutionsHEIContactInformation = async (contact: any) => {
  const contact_name = contact['contact-name'][0]
  const email = contact['email'][0]
  const position = contact['role-description'][0]['_']

  const heiInfo = new HEIInformationDTOConstructor(contact_name, email)
  heiInfo.setRole(position)
  return heiInfo.getResponse()
}
const getStudentInformation = async (la: any) => {
  const contact = la['student'][0]
  const name = `${contact['given-names'][0]} ${contact['family-name'][0]}`
  const email = contact['email'][0]

  return new StudentInformationDTOConstructor(email, name)
}
const validatePDFContents = async (
  ewpResponseContentValidations: EWPResponseContentValidationsConstructor
) => {
  const validateMobilityID = await validatePDFField(
    ewpResponseContentValidations.isMobilityIDsEqual(),
    'OMobility ID'
  )
  if (validateMobilityID != '') {
    return validateMobilityID
  }
  const validateSendingSCHAC = await validatePDFField(
    ewpResponseContentValidations.isSendingSchacsEqual(),
    'Sending HEI Schac Code'
  )
  if (validateSendingSCHAC != '') {
    return validateSendingSCHAC
  }
  const validateReceivingSCHAC = await validatePDFField(
    ewpResponseContentValidations.isReceivingSchacsEqual(),
    'Receiving HEI Schac Code'
  )
  if (validateReceivingSCHAC != '') {
    return validateReceivingSCHAC
  }

  return ''
}
const printSignerInformation = async (hei: HEIInformationDTO) => {
  const message = hei.signature
    ? `${hei.signature.signatureName} (${hei.signature.signatureEmail}), ${hei.signature.signerPosition}, signed the mobility on behalf of ${hei.schac_code}`
    : ''
  logger.info(message)
  return `INFO: ${message}`
}

export default { validateOLA }
