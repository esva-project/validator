interface LogDTOInterface {
  ip: string
  receivingendpoint: string
  receivingparameters: string
  requestsperformed: string[]
  responsestatus: number
  responsemessage: string
}

class LogDTOParameters {
  public logDTO: LogDTOInterface

  constructor(
    ip: string,
    receivingendpoint: string,
    receivingparameters: string,
    requestsperformed: string[],
    responsestatus: number,
    responsemessage: string
  ) {
    this.logDTO = {
      ip,
      receivingendpoint,
      receivingparameters,
      requestsperformed,
      responsemessage,
      responsestatus
    }
  }

  public getIP = () => this.logDTO.ip
  public getReceivingEndpoint = () => this.logDTO.receivingendpoint
  public getReceivingParameters = () => this.logDTO.receivingparameters
  public getRequestsPerformed = () => this.logDTO.requestsperformed
  public getResponseStatus = () => this.logDTO.responsestatus
  public getResponseMessage = () => this.logDTO.responsemessage
}

export { LogDTOParameters }
