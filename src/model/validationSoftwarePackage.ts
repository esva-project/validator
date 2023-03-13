interface SimpleReportInterface {
  signatureOrTimestamp: SignatureOrTimeStamp[]
  validSignaturesCount: number
}

interface SignatureOrTimeStampInterface {
  signedBy: string
  signatureLevel: SignatureLevelInterface
  extensionPeriodMax: string
}

interface SignatureLevelInterface {
  description: string
  value: string
}

class SimpleReport {
  private response: SimpleReportInterface

  constructor(obj: any) {
    this.response = JSON.parse(obj)
  }

  public getNrValidSignatures = () => this.response.validSignaturesCount
  public getSignatures = () => this.response.signatureOrTimestamp
}

class SignatureOrTimeStamp {
  public response: SignatureOrTimeStampInterface
  constructor(obj: any) {
    this.response = JSON.parse(obj)
  }

  public getSignedBy = () => this.response.signedBy
  public getExtensionPeriodMax = () => this.response.extensionPeriodMax
  public getSigLevelDescription = () => this.response.signatureLevel.description
}

export { SignatureOrTimeStamp, SimpleReport }
