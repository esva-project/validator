import { MobilityLaParameters } from '../../dto/mobilityParameters'
import { ResponseDTO } from '../../dto/response/response'
import { Mobility } from '../../model/mobilityResponse'
import { logger } from '../../utils/logs'
import { partialPresentInFull } from '../../utils/strings'

const validateEWPMobilityResponse = async (
  mobility_response: Mobility,
  params: MobilityLaParameters,
  response: ResponseDTO
) => {
  // Add information about the mobility found
  const msg = `Found Correct Mobility with ID ${params.getOMobilityID()}`
  logger.ola.info(msg)

  if (mobility_response.getOMobilityID() == '') {
    return response
  }

  // Set the EWPResponse object in the response JSON
  response.setMobilityHEIInformation(1, mobility_response)
  const sending_signature = response.getSendingHEIInformation().getMobilitySignature()
  response.setMobilityHEIInformation(2, mobility_response)
  const receiving_signature = response.getReceivingHEIInformation().getMobilitySignature()
  response.setStudentInformation(mobility_response)
  const student_information = response.getStudentInformation()

  // Compare PDF Signatures With Sending HEI, Receiving HEI, and Student Information
  if (sending_signature && receiving_signature) {
    const location = 'Document Signatures'
    console.log('printing sending stuff')
    console.log(sending_signature.getName())
    console.log(sending_signature.getEmail())

    console.log('printing receiving stuff')
    console.log(receiving_signature.getName())
    console.log(receiving_signature.getName())
    if (sending_signature.getName() == undefined && sending_signature.getEmail() == undefined) {
      response.addHEIValidation(
        1,
        'No LA Signer information was found to perform validations',
        '',
        ''
      )
    } else {
      response.addHEIValidation(
        1,
        'LA Signer Name',
        sending_signature.getName() as string,
        location
      )
      response.addHEIValidation(
        1,
        'LA Signer Email',
        sending_signature.getEmail() as string,
        location
      )
    }

    if (receiving_signature.getName() == undefined && receiving_signature.getEmail() == undefined) {
      response.addHEIValidation(
        2,
        'No LA Signer information was found to perform validations',
        '',
        ''
      )
    } else {
      response.addHEIValidation(
        2,
        'LA Signer Name',
        receiving_signature.getName() as string,
        location
      )
      response.addHEIValidation(
        2,
        'LA Signer Email',
        receiving_signature.getEmail() as string,
        location
      )
    }
    response.addStudentHEIValidation(
      'Student Name',
      student_information.getName().getValue(),
      location
    )
    response.addStudentHEIValidation(
      'Student Email',
      student_information.getEmail().getValue(),
      location
    )

    for (const signature of response.getSignatures()) {
      if (signature.getCommonName().toLowerCase() === sending_signature.getName()) {
        response.foundSendingHEIValdiation('LA Signer Name', location)
      }
      if (signature.getEmail() === sending_signature.getEmail()) {
        response.foundSendingHEIValdiation('LA Signer Email', location)
      }
      if (signature.getCommonName().toLowerCase() === receiving_signature.getName()) {
        response.foundReceivingHEIValdiation('LA Signer Name', location)
      }
      if (signature.getEmail() === receiving_signature.getEmail()) {
        response.foundReceivingHEIValdiation('LA Signer Email', location)
      }
      if (
        signature.getCommonName().toLowerCase() ===
        student_information.getName().getValue().toLowerCase()
      ) {
        response.foundStudentValdiation('Student Name', location)
      } else if (
        signature.getEmail() === student_information.getEmail().getValue() &&
        partialPresentInFull(
          signature.getCommonName().toLowerCase(),
          student_information.getName().getValue().toLowerCase()
        )
      ) {
        response.foundStudentValdiation('Student Name', location)
      }
      if (signature.getEmail() === student_information.getEmail().getValue()) {
        response.foundStudentValdiation('Student Email', location)
      }
    }

    response.getSendingHEIInformation().removeEmptyInstitutionContact()
    response.getReceivingHEIInformation().removeEmptyInstitutionContact()
  }

  return response
}

export default { validateEWPMobilityResponse }
