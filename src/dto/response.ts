import { Validations } from '../model/validations'

import { HEIInformationDTO } from './HeiInformationDTO'
import { SignerCertificateInformationDTO } from './signerCertificateInformationDTO'
import { StudentInformationDTO } from './StudentInformationDTO'
interface ResponseDTO {
  validationResult: string
  message: string
  logs: string[]
  validations: AttributesValidations
}

interface AttributesValidations {
  numberValidSignatures: number
  signature: {
    signerDocument?: string
    signatureLevel?: string
    country?: string
    email?: string
    organization?: {
      id?: string
      name?: string
      subjectDistinguishedName?: string
    }
  }[]
  ewpResponse: {
    mobility: {
      sending_hei?: HEIInformationDTO
      receiving_hei?: HEIInformationDTO
      student?: StudentInformationDTO
    }
    institution: {
      sending_hei: {
        schac_code: string
        contacts: HEIInformationDTO[]
      }
      receiving_hei: {
        schac_code: string
        contacts: HEIInformationDTO[]
      }
    }
    ounit: {
      sending_hei: {
        ounit_id?: string
        ounit_name?: string
        contacts: HEIInformationDTO[]
      }
      receiving_hei: {
        ounit_id?: string
        ounit_name?: string
        contacts: HEIInformationDTO[]
      }
    }
  }
  matches?: Validations
}
class ResponseDTOConstructor {
  public response: ResponseDTO
  constructor(result: string, msg: string, validations: AttributesValidations, logs: string[]) {
    this.response = {
      logs,
      message: msg,
      validationResult: result,
      validations
    }
  }

  public getResponse = () => this.response

  public addLog = (log: string) => this.response.logs.push(log)

  public setMessage = (msg: string) => {
    this.response.message = msg
  }

  public setSendingHEIMobilityInformation = (_info: HEIInformationDTO) => {
    this.response.validations.ewpResponse.mobility.sending_hei = _info
  }

  public setReceivingHEIMobilityInformation = (_info: HEIInformationDTO) => {
    this.response.validations.ewpResponse.mobility.receiving_hei = _info
  }

  public setSendingHEIInstitutionInformation = (_info: HEIInformationDTO[], schac_code: string) => {
    if (_info.length > 0) {
      this.response.validations.ewpResponse.institution.sending_hei.contacts = _info
    }
    if (schac_code != '') {
      this.response.validations.ewpResponse.institution.sending_hei.schac_code = schac_code
    }
  }

  public setSendingHEIOUnitInformation = (
    _info: HEIInformationDTO[],
    ounit_id: string,
    ounit_name: string
  ) => {
    if (_info.length > 0) {
      this.response.validations.ewpResponse.ounit.sending_hei.contacts = _info
    }
    if (ounit_id != '') {
      this.response.validations.ewpResponse.ounit.sending_hei.ounit_id = ounit_id
    }
    if (ounit_name != '') {
      this.response.validations.ewpResponse.ounit.sending_hei.ounit_name = ounit_name
    }
  }

  public setReceivingHEIOUnitInformation = (
    _info: HEIInformationDTO[],
    ounit_id: string,
    ounit_name: string
  ) => {
    if (_info.length > 0) {
      this.response.validations.ewpResponse.ounit.receiving_hei.contacts = _info
    }
    if (ounit_id != '') {
      this.response.validations.ewpResponse.ounit.receiving_hei.ounit_id = ounit_id
    }
    if (ounit_name != '') {
      this.response.validations.ewpResponse.ounit.receiving_hei.ounit_name = ounit_name
    }
  }

  public setReceivingHEIInstitutionInformation = (
    _info: HEIInformationDTO[],
    schac_code: string
  ) => {
    if (_info.length > 0) {
      this.response.validations.ewpResponse.institution.receiving_hei.contacts = _info
    }
    if (schac_code != '') {
      this.response.validations.ewpResponse.institution.receiving_hei.schac_code = schac_code
    }
  }

  public setStudentInformation = (_info: StudentInformationDTO) => {
    this.response.validations.ewpResponse.mobility.student = _info
  }
  public setMatches = (_info: Validations) => {
    this.response.validations.matches = _info
  }
  public countCorrectValidations = () => {
    let count = 0

    if (this.response.validations.matches) {
      let values = Object.values(this.response.validations.matches.sendingHeiValidations)
      for (const value of values) {
        if (value) {
          count++
        }
      }

      values = Object.values(this.response.validations.matches.receivingHeiValidations)
      for (const value of values) {
        if (value) {
          count++
        }
      }

      values = Object.values(this.response.validations.matches.studentValidations)
      for (const value of values) {
        if (value) {
          count++
        }
      }
    }
    return count
  }

  public countValidations = () => {
    let count = 0

    if (this.response.validations.matches) {
      let values = Object.values(this.response.validations.matches.sendingHeiValidations)
      for (const _ of values) {
        count++
      }

      values = Object.values(this.response.validations.matches.receivingHeiValidations)
      for (const _ of values) {
        count++
      }

      values = Object.values(this.response.validations.matches.studentValidations)
      for (const _ of values) {
        count++
      }
    }
    return count
  }
}

class AttributesValidationsConstructor {
  private validations: AttributesValidations

  constructor(nrSigs: number) {
    this.validations = {
      ewpResponse: {
        institution: {
          receiving_hei: { contacts: [], schac_code: '' },
          sending_hei: { contacts: [], schac_code: '' }
        },
        mobility: {},
        ounit: {
          receiving_hei: { contacts: [] },
          sending_hei: { contacts: [] }
        }
      },
      numberValidSignatures: nrSigs,
      signature: []
    }
  }

  public setNumberValidSignatures = (sigs: number) => {
    this.validations.numberValidSignatures = sigs
  }

  public setSignersDocument = (signer: string, level: string) => {
    this.validations.signature.push({ signatureLevel: level, signerDocument: signer })
  }

  public setSignersCertificateInformation = (_info: SignerCertificateInformationDTO) => {
    for (const element of this.validations.signature) {
      if (element.signerDocument == _info.commonName) {
        element.country = _info.country
        element.email = _info.email
        element.organization = {
          id: _info.organizationId,
          name: _info.organizationName,
          subjectDistinguishedName: _info.subjectDistinguishedName
        }
      }
    }
  }

  public getValidations = () => this.validations
}

export { AttributesValidationsConstructor, ResponseDTOConstructor }
