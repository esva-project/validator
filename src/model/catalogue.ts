interface CatalogueInterface {
  catalogue: CatalogueHostsInterface
}

interface CatalogueHostsInterface {
  host: HostInterface[]
}

interface HostInterface {
  'apis-implemented': ApiImplementedInterface[]
  'institutions-covered'?: InstitutionsCoveredInterface[]
}

interface InstitutionsCoveredInterface {
  'hei-id'?: string
}

interface ApiImplementedInterface {
  'omobility-las': ApiInterface[] | undefined
  institutions: ApiInterface[] | undefined
  'organizational-units': ApiInterface[] | undefined
}

interface ApiInterface {
  url: string
  'get-url': string
}

class Catalogue {
  private catalogue: CatalogueInterface
  private lastUpdated: Date

  constructor(catalogue: CatalogueInterface) {
    this.catalogue = catalogue
    this.lastUpdated = new Date()
  }

  public getHosts = () => this.catalogue.catalogue.host
  public getAPIImplemented = (h: HostInterface) => h['apis-implemented'][0]
  public getInstitutionsCovered = (h: HostInterface) =>
    h['institutions-covered'] ? h['institutions-covered'] : []
  public getHEIID = (i: InstitutionsCoveredInterface) => (i['hei-id'] ? i['hei-id'][0] : '')
  public getOMobilityLASAPIURL = (a: ApiImplementedInterface): string => {
    return a['omobility-las'] != undefined ? a['omobility-las'][0]['get-url'] : ''
  }
  public getInstitutionsAPIURL = (a: ApiImplementedInterface): string => {
    return a['institutions'] != undefined ? a['institutions'][0].url : ''
  }
  public getOUnitsAPIURL = (a: ApiImplementedInterface): string => {
    return a['organizational-units'] != undefined ? a['organizational-units'][0].url : ''
  }
  public getLastUpdated = () => this.lastUpdated
  public setLastUpdated = (l: Date) => (this.lastUpdated = l)
}

export { Catalogue }
