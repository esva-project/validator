interface HEIInformationDTO {
  contactPersonName: string
  contactPersonEmail: string
  schac_code?: string
  ounit_id?: string
  ounit_name?: string
  roleDescription?: string
  signature?: HEISignatureDTO
}

interface HEISignatureInterface {
  signatureName: string
  signatureEmail: string
  signerPosition: string
}

class HEIInformationDTOConstructor {
  private response: HEIInformationDTO

  constructor(contactPersonName: string, contactPersonEmail: string) {
    this.response = {
      contactPersonEmail,
      contactPersonName
    }
  }

  public getResponse = () => this.response

  public getContactPersonName = () => this.response.contactPersonName

  public getContactPersonEmail = () => this.response.contactPersonEmail

  public getSchac = () => this.response.schac_code

  public getSignature = () => this.response.signature

  public getRole = () => this.response.roleDescription

  public setSignature = (sig: HEISignatureDTO) => {
    this.response.signature = sig
  }
  public setRole = (role: string) => {
    this.response.roleDescription = role
  }
  public setSchac = (schac: string) => {
    this.response.schac_code = schac
  }
  public setOUnitInformation = (ounit_id: string, ounit_name: string) => {
    this.response.ounit_id = ounit_id
    this.response.ounit_name = ounit_name
  }
}

class HEISignatureDTO implements HEISignatureInterface {
  constructor(signatureEmail: string, signatureName: string, signerPosition: string) {
    this.signatureName = signatureName
    this.signatureEmail = signatureEmail
    this.signerPosition = signerPosition
  }
  signatureName: string
  signatureEmail: string
  signerPosition: string

  public getSigName = () => this.signatureName

  public getSigEmail = () => this.signatureEmail

  public getSigPosition = () => this.signerPosition
}

export { HEIInformationDTO, HEIInformationDTOConstructor, HEISignatureDTO }
