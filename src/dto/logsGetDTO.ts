interface LogGetDTOInterface {
  selectedPage: number
  since: string
  until: string
  ip: string
  browser: string
  operating_system: string
  receivingendpoint: string
  receivingparameterscontains: string
  requestsperformedcontains: string[]
  responsestatus: string
  responsemessagecontains: string
}

class LogGetDTOParameters {
  public logDTO: LogGetDTOInterface

  constructor(
    selectedPage: number,
    since: string,
    until: string,
    ip: string,
    browser: string,
    operating_system: string,
    receivingendpoint: string,
    receivingparameterscontains: string,
    requestsperformedcontains: string[],
    responsestatus: string,
    responsemessagecontains: string
  ) {
    this.logDTO = {
      browser,
      ip,
      operating_system,
      receivingendpoint,
      receivingparameterscontains,
      requestsperformedcontains,
      responsemessagecontains,
      responsestatus,
      selectedPage,
      since,
      until
    }
  }

  public getSince = () => this.logDTO.since
  public getUntil = () => this.logDTO.until
  public getIP = () => this.logDTO.ip
  public getBrowser = () => this.logDTO.browser
  public getOS = () => this.logDTO.operating_system
  public getReceivingEndpoint = () => this.logDTO.receivingendpoint
  public getReceivingParametersContains = () => this.logDTO.receivingparameterscontains
  public getRequestsPerformedContains = () => this.logDTO.requestsperformedcontains
  public getResponseStatus = () => this.logDTO.responsestatus
  public getResponseMessageContains = () => this.logDTO.responsemessagecontains
  public getSelectedPage = () => this.logDTO.selectedPage
}

export { LogGetDTOParameters }
