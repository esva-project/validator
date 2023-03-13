interface SubjectDistinguishedName {
  value: string
  format: string
}

interface SignerCertificateInformationInterface {
  level: string
  commonName: string
  country: string
  organizationId: string
  organizationName: string
  email: string
  subjectDistinguishedName?: string
}

class SignerCertificateInformationDTO {
  private response: SignerCertificateInformationInterface

  constructor(commonName: string, level: string) {
    this.response = {
      commonName,
      country: '',
      email: '',
      level,
      organizationId: '',
      organizationName: '',
      subjectDistinguishedName: ''
    }
  }

  public getCommonName = () => this.response.commonName
  public getEmail = () => this.response.email

  public setCountry = (c: string) => (this.response.country = c)
  public setOrganizationId = (o: string) => (this.response.organizationId = o)
  public setOrganizationName = (o: string) => (this.response.organizationName = o)
  public setEmail = (e: string) => (this.response.email = e)
  public setSubjectDistinguishedName = (subjectDistinguishedName: SubjectDistinguishedName[]) => {
    for (const element of subjectDistinguishedName) {
      if (element.format == 'RFC2253') {
        this.response.subjectDistinguishedName = element.value
      }
    }
  }
}

export { SignerCertificateInformationDTO, SubjectDistinguishedName }
