import { MobilityLaParameters } from '../dto/mobilityParameters'
import { ResponseDTO } from '../dto/response/response'
import { logger } from '../utils/logs'

import validateEWPInstitutions from './ewpValidations/validateInstitutionDataService'
import validateEWPMobility from './ewpValidations/validateMobilityDataService'
import validateEWPOUnits from './ewpValidations/validateOUnitsDataService'
import fetchDataEWP from './softwarePackage/fetchDataEWPService'
import fileHandling from './softwarePackage/fileHandlingService'

const validateOLA = async (fileMeta: string, params: MobilityLaParameters) => {
  const response = await fileHandling.validateFileValidatorResponse(fileMeta)
  if (response.countSignatures() == 0) return response

  const mobilityValidation = await processMobility(params, response)
  if (mobilityValidation.getMessage().includes('Could not fetch')) return mobilityValidation
  const institutionsAndMobilityValidation = await processInstitutions(params, mobilityValidation)
  if (institutionsAndMobilityValidation.getMessage().includes('Could not fetch'))
    return mobilityValidation
  const fullResponse = await processOUnits(params, institutionsAndMobilityValidation)
  return fullResponse
}

/*********
AUXILIARY METHODS
********** */

const processMobility = async (contents: MobilityLaParameters, responseSoFar: ResponseDTO) => {
  // Fetch Mobility Data From EWP
  const mobility_response = await fetchDataEWP.fetchMobilityXMLFromEWP(contents)
  if (mobility_response instanceof ResponseDTO) {
    return mobility_response
  }

  logger.ola.info('Mobility Response: ' + JSON.stringify(mobility_response))

  // Start Validation Mobility Data
  return await validateEWPMobility.validateEWPMobilityResponse(
    mobility_response,
    contents,
    responseSoFar
  )
}

const processInstitutions = async (
  contents: MobilityLaParameters,
  mobilityValidation: ResponseDTO
) => {
  // Fetch Data From Sending HEI EWP Institutions API
  const sending_institutions_response = await fetchDataEWP.fetchInstitutionsXMLFromEWP(
    contents.getSendingSchac()
  )
  if (sending_institutions_response instanceof ResponseDTO) {
    return sending_institutions_response
  }

  logger.ola.info(
    contents.getSendingSchac() +
      ' Institutions Response: ' +
      JSON.stringify(sending_institutions_response)
  )

  const responseSoFar = await validateEWPInstitutions.validateEWPInstitutionsResponse(
    1,
    sending_institutions_response,
    mobilityValidation
  )

  // Fetch Data From Receiving HEI EWP Institutions API
  const receiving_institutions_response = await fetchDataEWP.fetchInstitutionsXMLFromEWP(
    contents.getReceivingSchac()
  )
  if (receiving_institutions_response instanceof ResponseDTO) {
    return receiving_institutions_response
  }

  logger.ola.info(
    contents.getReceivingSchac() +
      ' Institutions Response: ' +
      JSON.stringify(receiving_institutions_response)
  )

  return await validateEWPInstitutions.validateEWPInstitutionsResponse(
    2,
    receiving_institutions_response,
    responseSoFar
  )
}

const processOUnits = async (
  contents: MobilityLaParameters,
  institutionsAndMobilityValidation: ResponseDTO
) => {
  let responseSoFar = institutionsAndMobilityValidation
  const sending_hei_ounit_id = institutionsAndMobilityValidation
    .getSendingHEIInformation()
    .getOUnitID()
  if (sending_hei_ounit_id) {
    // Fetch Data From Sending HEI EWP OUnits API
    const sending_ounits_response = await fetchDataEWP.fetchOUnitsXMLFromEWP(
      contents.getSendingSchac(),
      sending_hei_ounit_id
    )
    if (sending_ounits_response instanceof ResponseDTO) {
      return sending_ounits_response
    }

    logger.ola.info(
      contents.getSendingSchac() + ' OUnits Response: ' + JSON.stringify(sending_ounits_response)
    )

    responseSoFar = await validateEWPOUnits.validateEWPOUnitsResponse(
      1,
      sending_ounits_response,
      institutionsAndMobilityValidation
    )
  }

  const receiving_hei_ounit_id = institutionsAndMobilityValidation
    .getReceivingHEIInformation()
    .getOUnitID()
  if (receiving_hei_ounit_id) {
    // Fetch Data From Sending HEI EWP OUnits API
    const receiving_ounits_response = await fetchDataEWP.fetchOUnitsXMLFromEWP(
      contents.getReceivingSchac(),
      receiving_hei_ounit_id
    )
    if (receiving_ounits_response instanceof ResponseDTO) {
      return receiving_ounits_response
    }

    logger.ola.info(
      contents.getReceivingSchac() +
        ' OUnits Response: ' +
        JSON.stringify(receiving_ounits_response)
    )

    responseSoFar = await validateEWPOUnits.validateEWPOUnitsResponse(
      2,
      receiving_ounits_response,
      responseSoFar
    )
  }

  return responseSoFar
}

export default { validateOLA }
