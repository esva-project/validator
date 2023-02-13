interface PDFContentsInterface {
  omobility_id: string
  sending_hei_id: string
  receiving_hei_id: string
}

class PDFContentsDTO {
  public response: PDFContentsInterface

  constructor(omobility_id: string, sending_hei_id: string, receiving_hei_id: string) {
    this.response = {
      omobility_id,
      receiving_hei_id,
      sending_hei_id
    }
  }

  public getResponse = () => this.response
  public getOMobilityID = () => this.response.omobility_id
  public getSendingSchac = () => this.response.sending_hei_id
  public getReceivingSchac = () => this.response.receiving_hei_id
}

export { PDFContentsDTO }
