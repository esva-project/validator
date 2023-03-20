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
  subjectDistinguishedName: string
}

class SignerCertificateInformationDTO implements SignerCertificateInformationInterface {
  level: string
  commonName: string
  country: string
  organizationId: string
  organizationName: string
  email: string
  subjectDistinguishedName: string

  constructor(commonName: string, level: string) {
    this.commonName = commonName
    this.country = ''
    this.email = ''
    this.level = level
    this.organizationId = ''
    this.organizationName = ''
    this.subjectDistinguishedName = ''
  }

  public getCommonName = () => this.commonName
  public getEmail = () => this.email

  public setCountry = (c: string) => (this.country = c)
  public setOrganizationId = (o: string) => (this.organizationId = o)
  public setOrganizationName = (o: string) => (this.organizationName = o)
  public setEmail = (e: string) => (this.email = e)
  public setSubjectDistinguishedName = (subjectDistinguishedName: SubjectDistinguishedName[]) => {
    for (const element of subjectDistinguishedName) {
      if (element.format == 'RFC2253') {
        this.subjectDistinguishedName = element.value
      }
    }
  }
}

export { SignerCertificateInformationDTO, SubjectDistinguishedName }
