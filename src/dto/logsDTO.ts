interface LogDTOInterface {
  ip: string
  browser: string
  operating_system: string
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
    browser: string,
    operating_system: string,
    receivingendpoint: string,
    receivingparameters: string,
    requestsperformed: string[],
    responsestatus: number,
    responsemessage: string
  ) {
    this.logDTO = {
      browser,
      ip,
      operating_system,
      receivingendpoint,
      receivingparameters,
      requestsperformed,
      responsemessage,
      responsestatus
    }
  }

  public getIP = () => this.logDTO.ip
  public getBrowser = () => this.logDTO.browser
  public getOS = () => this.logDTO.operating_system
  public getReceivingEndpoint = () => this.logDTO.receivingendpoint
  public getReceivingParameters = () => this.logDTO.receivingparameters
  public getRequestsPerformed = () => this.logDTO.requestsperformed
  public getResponseStatus = () => this.logDTO.responsestatus
  public getResponseMessage = () => this.logDTO.responsemessage
}

export { LogDTOParameters }
