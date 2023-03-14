import { Institutions } from '../../model/institutionResponse'
import { Mobility } from '../../model/mobilityResponse'
import { OUnits } from '../../model/ounitResponse'
import { logger } from '../../utils/logs'

import { DataCollectionDTO } from './dataCollection'
import { EWPReport } from './ewpReport'

interface ResponseDTOInterface {
  message: string
  dataCollection: DataCollectionDTO
  ewpReport: EWPReport
}

class ResponseDTO {
  private response: ResponseDTOInterface
  constructor(status: number, message: string) {
    switch (status) {
      case 0:
        logger.ola.error(message)
        break
      case 1:
        logger.ola.info(message)
        break
    }
    this.response = {
      dataCollection: new DataCollectionDTO(),
      ewpReport: new EWPReport(),
      message
    }
  }

  public getMessage = () => this.response.message
  private getDataCollection = () => this.response.dataCollection
  private getEWPReport = () => this.response.ewpReport

  public setPDFSignatures = (signatures: any) => {
    for (const signature of signatures)
      this.getDataCollection().addSignature(signature.signedBy, signature.description)
  }
  public addSignersCertificateInformation = (certificates: any) => {
    for (const certificate of certificates) {
      this.getDataCollection().setSignersCertificateInformation(
        certificate.commonName,
        certificate.countryName,
        certificate.email,
        certificate.organizationIdentifier,
        certificate.organizationName,
        certificate.subjectDistinguishedName
      )
    }
  }
  public countSignatures = () => this.getDataCollection().getSignatures().length
  public getSignatures = () => this.getDataCollection().getSignatures()

  public setMobilityHEIInformation = (flow: number, mob: Mobility) =>
    this.getDataCollection().setMobilityHEI(flow, mob)
  public setStudentInformation = (mob: Mobility) => this.getDataCollection().setMobilityStudent(mob)
  public setInstitutionHEIInformation = (flow: number, inst: Institutions) =>
    this.getDataCollection().setInstitutionContacts(flow, inst)
  public setOUnitHEIInformation = (flow: number, inst: OUnits) =>
    this.getDataCollection().setOUnitsContacts(flow, inst)

  public getSendingHEIInformation = () => this.getDataCollection().getEWPDataSendingHEI()
  public getReceivingHEIInformation = () => this.getDataCollection().getEWPDataReceivingHEI()
  public getStudentInformation = () => this.getDataCollection().getEWPDataStudent()

  public addHEIValidation = (
    flow: number,
    nameAttribute: string,
    valueAttribute: string,
    location: string
  ) => {
    flow == 1
      ? this.getEWPReport().addSendingHEIValidation(nameAttribute, valueAttribute, location)
      : this.getEWPReport().addReceivingHEIValidation(nameAttribute, valueAttribute, location)
  }
  public addStudentHEIValidation = (
    nameAttribute: string,
    valueAttribute: string,
    location: string
  ) => this.getEWPReport().addStudentValidation(nameAttribute, valueAttribute, location)

  public foundSendingHEIValdiation = (nameAttribute: string, location: string) =>
    this.getEWPReport().foundSendingHEIValidation(nameAttribute, location)
  public foundReceivingHEIValdiation = (nameAttribute: string, location: string) =>
    this.getEWPReport().foundReceivingHEIValidation(nameAttribute, location)
  public foundStudentValdiation = (nameAttribute: string, location: string) =>
    this.getEWPReport().foundStudentValidation(nameAttribute, location)
}

export { ResponseDTO }
