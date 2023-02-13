interface SubjectDistinguishedName {
  value: string
  format: string
}

interface SignerCertificateInformationDTO {
  commonName: string
  country: string
  organizationId: string
  organizationName: string
  email: string
  subjectDistinguishedName?: string
}

class SignerCertificateInformationDTOConstructor {
  public response: SignerCertificateInformationDTO

  constructor(
    commonName: string,
    country: string,
    organizationId: string,
    organizationName: string,
    email: string,
    subjectDistinguishedName: SubjectDistinguishedName[]
  ) {
    this.response = {
      commonName,
      country,
      email,
      organizationId,
      organizationName
    }

    for (const element of subjectDistinguishedName) {
      if (element.format === 'RFC2253') {
        this.response.subjectDistinguishedName == element.value
      }
    }
  }

  public getResponse = () => this.response
}

export { SignerCertificateInformationDTO, SignerCertificateInformationDTOConstructor }
