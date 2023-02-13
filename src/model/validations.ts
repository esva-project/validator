interface Validations {
  ewpResponseContentValidations: EWPResponseContentValidations
  sendingHeiValidations: HEIValidations
  receivingHeiValidations: HEIValidations
  studentValidations: StudentValidation
}

interface HEIValidations {
  isHEISignatureNameEqualsPDF: boolean
  isHEISignatureEmailEqualsPDF: boolean
  isHEISignatureNameInInstitutionAPI?: boolean
  isHEISignatureEmailInInstitutionAPI?: boolean
  isHEISchacCodeEqualInInstitutionAPI?: boolean
  isHEIRolesEqualInInstitutionAPI?: boolean

  isOUnitRolesEqualInInstitutionAPI?: boolean
  isOUnitContactNameEqualInOUnitAPI?: boolean
  isOUnitContactEmailEqualInOUnitAPI?: boolean
  isOUnitIDEqualInOUnitAPI?: boolean
  isOUnitNameEqualInOUnitAPI?: boolean
}
interface StudentValidation {
  isNameEqual: boolean
  isEmailEqual: boolean
}

interface EWPResponseContentValidations {
  isResponseIDEqualToPDFID: boolean
  isResponseSendingSCHACCodeEqualToPDFSendingSCHACCode: boolean
  isResponseReceivingSCHACCodeEqualToPDFReceivingSCHACCode: boolean
}

class ValidationsConstructor {
  public response: Validations

  constructor(
    ewpResponseContentValidations: EWPResponseContentValidations,
    sendingHeiValidations: HEIValidations,
    receivingHeiValidations: HEIValidations,
    studentValidations: StudentValidation
  ) {
    this.response = {
      ewpResponseContentValidations,
      receivingHeiValidations,
      sendingHeiValidations,
      studentValidations
    }
  }

  public getResponse = () => this.response

  public setSendingInstitutionsValidations(
    isHEISignatureNameInInstitutionAPI: boolean,
    isHEISignatureEmailInInstitutionAPI: boolean,
    isHEISchacCodeEqualInInstitutionAPI: boolean,
    isHEIRolesEqualInInstitutionAPI: boolean
  ) {
    this.response.sendingHeiValidations.isHEISignatureNameInInstitutionAPI =
      isHEISignatureNameInInstitutionAPI
    this.response.sendingHeiValidations.isHEISignatureEmailInInstitutionAPI =
      isHEISignatureEmailInInstitutionAPI
    this.response.sendingHeiValidations.isHEISchacCodeEqualInInstitutionAPI =
      isHEISchacCodeEqualInInstitutionAPI
    this.response.sendingHeiValidations.isHEIRolesEqualInInstitutionAPI =
      isHEIRolesEqualInInstitutionAPI
  }

  public setSendingOUnitValidations(
    isOUnitRolesEqualInInstitutionAPI: boolean,
    isOUnitContactNameEqualInOUnitAPI: boolean,
    isOUnitContactEmailEqualInOUnitAPI: boolean,
    isOUnitIDEqualInOUnitAPI: boolean,
    isOUnitNameEqualInOUnitAPI: boolean
  ) {
    this.response.sendingHeiValidations.isOUnitIDEqualInOUnitAPI = isOUnitIDEqualInOUnitAPI
    this.response.sendingHeiValidations.isOUnitNameEqualInOUnitAPI = isOUnitNameEqualInOUnitAPI
    this.response.sendingHeiValidations.isOUnitContactNameEqualInOUnitAPI =
      isOUnitContactNameEqualInOUnitAPI
    this.response.sendingHeiValidations.isOUnitContactEmailEqualInOUnitAPI =
      isOUnitContactEmailEqualInOUnitAPI
    this.response.sendingHeiValidations.isOUnitRolesEqualInInstitutionAPI =
      isOUnitRolesEqualInInstitutionAPI
  }

  public setReceivingOUnitValidations(
    isOUnitRolesEqualInInstitutionAPI: boolean,
    isOUnitContactNameEqualInOUnitAPI: boolean,
    isOUnitContactEmailEqualInOUnitAPI: boolean,
    isOUnitIDEqualInOUnitAPI: boolean,
    isOUnitNameEqualInOUnitAPI: boolean
  ) {
    this.response.receivingHeiValidations.isOUnitIDEqualInOUnitAPI = isOUnitIDEqualInOUnitAPI
    this.response.receivingHeiValidations.isOUnitNameEqualInOUnitAPI = isOUnitNameEqualInOUnitAPI
    this.response.receivingHeiValidations.isOUnitContactNameEqualInOUnitAPI =
      isOUnitContactNameEqualInOUnitAPI
    this.response.receivingHeiValidations.isOUnitContactEmailEqualInOUnitAPI =
      isOUnitContactEmailEqualInOUnitAPI
    this.response.receivingHeiValidations.isOUnitRolesEqualInInstitutionAPI =
      isOUnitRolesEqualInInstitutionAPI
  }

  public setReceivingInstitutionsValidations(
    isHEISignatureNameInInstitutionAPI: boolean,
    isHEISignatureEmailInInstitutionAPI: boolean,
    isHEISchacCodeEqualInInstitutionAPI: boolean,
    isHEIRolesEqualInInstitutionAPI: boolean
  ) {
    this.response.receivingHeiValidations.isHEISignatureNameInInstitutionAPI =
      isHEISignatureNameInInstitutionAPI
    this.response.receivingHeiValidations.isHEISignatureEmailInInstitutionAPI =
      isHEISignatureEmailInInstitutionAPI
    this.response.receivingHeiValidations.isHEISchacCodeEqualInInstitutionAPI =
      isHEISchacCodeEqualInInstitutionAPI
    this.response.receivingHeiValidations.isHEIRolesEqualInInstitutionAPI =
      isHEIRolesEqualInInstitutionAPI
  }
}

class EWPResponseContentValidationsConstructor {
  private response: EWPResponseContentValidations

  constructor(
    isResponseIDEqualToPDFID: boolean,
    isResponseSendingSCHACCodeEqualToPDFSendingSCHACCode: boolean,
    isResponseReceivingSCHACCodeEqualToPDFReceivingSCHACCode: boolean
  ) {
    this.response = {
      isResponseIDEqualToPDFID,
      isResponseReceivingSCHACCodeEqualToPDFReceivingSCHACCode,
      isResponseSendingSCHACCodeEqualToPDFSendingSCHACCode
    }
  }

  public isMobilityIDsEqual = () => this.response.isResponseIDEqualToPDFID

  public isSendingSchacsEqual = () =>
    this.response.isResponseSendingSCHACCodeEqualToPDFSendingSCHACCode

  public isReceivingSchacsEqual = () =>
    this.response.isResponseReceivingSCHACCodeEqualToPDFReceivingSCHACCode

  public getResponse = () => this.response
}

class HEIValidationsConstructor {
  public response: HEIValidations

  constructor(isHEISignatureEmailEqualsPDF: boolean, isHEISignatureNameEqualsPDF: boolean) {
    this.response = {
      isHEISignatureEmailEqualsPDF,
      isHEISignatureNameEqualsPDF
    }
  }

  public getResponse = () => this.response
}

class StudentValidationsConstructor {
  public response: StudentValidation

  constructor(isNameEqual: boolean, isEmailEqual: boolean) {
    this.response = {
      isEmailEqual,
      isNameEqual
    }
  }

  public getResponse = () => this.response
}

export {
  EWPResponseContentValidationsConstructor,
  HEIValidationsConstructor,
  StudentValidationsConstructor,
  Validations,
  ValidationsConstructor
}
