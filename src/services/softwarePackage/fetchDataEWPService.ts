import { MobilityLaParameters } from '../../dto/mobilityParameters'
import { ResponseDTO } from '../../dto/response/response'
import { Catalogue } from '../../model/catalogue'
import { Institutions, InstitutionsInterface } from '../../model/institutionResponse'
import { Mobility, MobilityInterface } from '../../model/mobilityResponse'
import { OUnits, OUnitsInterface } from '../../model/ounitResponse'
import fetchCatalogue from '../../outrequests/catalogueRequest'
import EWPRequest from '../../outrequests/ewpEndpointRequest'

let catalogue: Catalogue = new Catalogue(await fetchCatalogue.fetchCatalogue())

const updateDataFromEWP = async () => {
  const lastUpdated = catalogue.getLastUpdated()
  if (Date.now() - lastUpdated.getTime() > 15 * 60 * 1000) {
    catalogue = new Catalogue(await fetchCatalogue.fetchCatalogue())
  }
}

const fetchMobilityXMLFromEWP = async (pdfContents: MobilityLaParameters) => {
  updateDataFromEWP()
  const params = {
    omobility_id: pdfContents.getOMobilityID(),
    sending_hei_id: pdfContents.getSendingSchac()
  }

  let url = ''
  for (const host of catalogue.getHosts()) {
    for (const instCovered of catalogue.getInstitutionsCovered(host)) {
      if (params.sending_hei_id === catalogue.getHEIID(instCovered)) {
        url = catalogue.getOMobilityLASAPIURL(catalogue.getAPIImplemented(host))
      }
    }
  }

  if (url) {
    const mobility_response: MobilityInterface = await EWPRequest.get(url, params)
    return new Mobility(mobility_response)
  }

  return new ResponseDTO(0, 'Could not fetch Mobility Response from EWP')
}
const fetchInstitutionsXMLFromEWP = async (hei_id: string) => {
  updateDataFromEWP()
  const params = { hei_id }

  let url = ''

  for (const host of catalogue.getHosts()) {
    for (const instCovered of catalogue.getInstitutionsCovered(host)) {
      if (hei_id === catalogue.getHEIID(instCovered)) {
        url = catalogue.getInstitutionsAPIURL(catalogue.getAPIImplemented(host))
      }
    }
  }

  if (url) {
    const institutions_response: InstitutionsInterface = await EWPRequest.get(url, params)
    return new Institutions(institutions_response)
  }

  return new ResponseDTO(0, 'Could not fetch Institutions Response from EWP')
}

const fetchOUnitsXMLFromEWP = async (hei_id: string, ounit_id: string) => {
  updateDataFromEWP()
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

  if (url) {
    const ounits_response: OUnitsInterface = await EWPRequest.get(url, params)
    return new OUnits(ounits_response)
  }

  return new ResponseDTO(0, 'Could not fetch OUnits Response from EWP')
}

export default { fetchInstitutionsXMLFromEWP, fetchMobilityXMLFromEWP, fetchOUnitsXMLFromEWP }
