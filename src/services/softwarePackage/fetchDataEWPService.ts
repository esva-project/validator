import { IIAParameters } from '../../dto/iiaParameters'
import { MobilityLaParameters } from '../../dto/mobilityParameters'
import { ResponseDTO } from '../../dto/response/response'
import { Catalogue } from '../../model/catalogue'
import { IIA, IIAGetResponseInterface } from '../../model/iiaResponse'
import { Institutions, InstitutionsInterface } from '../../model/institutionResponse'
import { Mobility, MobilityInterface } from '../../model/mobilityResponse'
import { OUnits, OUnitsInterface } from '../../model/ounitResponse'
import fetchCatalogue from '../../outrequests/catalogueRequest'
import EWPRequest from '../../outrequests/ewpEndpointRequest'

let catalogue: Catalogue = new Catalogue(await fetchCatalogue.fetchCatalogue())

const updateDataFromEWP = async (): Promise<Catalogue> => {
  const lastUpdated = catalogue.getLastUpdated()

  if (Date.now() - lastUpdated.getTime() > 60 * 60 * 1000) {
    // Perform asynchronous operation to update catalogue
    fetchCatalogue
      .fetchCatalogue()
      .then((newCatalogueData) => {
        catalogue = new Catalogue(newCatalogueData)
        return catalogue
      })
      .catch((error) => {
        console.log(error)
      })
  }
  return catalogue
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
    const m = new Mobility(mobility_response)
    return { m, url }
  }

  return new ResponseDTO(400, 'Could not fetch Mobility Response from EWP')
}

const fetchIIAXMLFromEWP = async (pdfContents: IIAParameters, posing: string) => {
  updateDataFromEWP()
  const params = {
    // hei_id: posing,
    iia_id: pdfContents.getIIAID(),
    posing_hei: posing
  }

  let url = ''
  for (const host of catalogue.getHosts()) {
    for (const instCovered of catalogue.getInstitutionsCovered(host)) {
      if (pdfContents.getSchac() === catalogue.getHEIID(instCovered)) {
        url = catalogue.getOMobilityIIAAPIURL(catalogue.getAPIImplemented(host))
      }
    }
  }

  if (url) {
    const iia_response: IIAGetResponseInterface = await EWPRequest.get(url, params)
    const i = new IIA(iia_response)
    return { i, url }
  }

  return new ResponseDTO(400, 'Could not fetch Mobility Response from EWP')
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
    const i = new Institutions(institutions_response)
    return { i, url }
  }

  return
}

const fetchOUnitsXMLFromEWP = async (hei_id: string, ounit_id: string) => {
  updateDataFromEWP()
  const params = {
    hei_id,
    ounit_id
  }

  let url = ''

  console.log('before for')
  for (const host of catalogue.getHosts()) {
    for (const instCovered of catalogue.getInstitutionsCovered(host)) {
      if (hei_id === catalogue.getHEIID(instCovered)) {
        url = catalogue.getOUnitsAPIURL(catalogue.getAPIImplemented(host))
      }
    }
  }

  console.log('before if')
  if (url) {
    const ounits_response: OUnitsInterface = await EWPRequest.get(url, params)

    console.log('check ounits_response')
    console.log(JSON.stringify(ounits_response))
    const o = new OUnits(ounits_response)

    console.log('check o')
    console.log(JSON.stringify(o))
    return { o, url }
  }
  console.log('after if')

  return new ResponseDTO(400, 'Could not fetch OUnits Response from EWP')
}

export default {
  fetchIIAXMLFromEWP,
  fetchInstitutionsXMLFromEWP,
  fetchMobilityXMLFromEWP,
  fetchOUnitsXMLFromEWP
}
