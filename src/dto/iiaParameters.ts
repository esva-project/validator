interface IIAParametersInterface {
  iia_id: string
  hei_id: string
}

class IIAParameters {
  public response: IIAParametersInterface

  constructor(iia_id: string, hei_id: string) {
    this.response = {
      hei_id,
      iia_id
    }
  }

  public getIIAID = () => this.response.iia_id
  public getSchac = () => this.response.hei_id

  public toJSON = () => {
    return {
      hei_id: this.getSchac(),
      omobility_id: this.getIIAID()
    }
  }
}

export { IIAParameters }
