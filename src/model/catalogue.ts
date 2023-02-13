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
  'omobility-las': ApiInterface[]
  institutions: ApiInterface[]
  'organizational-units': ApiInterface[]
}

interface ApiInterface {
  url: string
  'get-url': string
}

class Catalogue {
  public catalogue: CatalogueInterface

  constructor(catalogue: any) {
    this.catalogue = catalogue
  }

  public getHosts = () => this.catalogue.catalogue.host
  public getAPIImplemented = (h: HostInterface) => h['apis-implemented'][0]
  public getInstitutionsCovered = (h: HostInterface) =>
    h['institutions-covered'] ? h['institutions-covered'] : []
  public getHEIID = (i: InstitutionsCoveredInterface) => (i['hei-id'] ? i['hei-id'][0] : '')
  public getOMobilityLASAPIURL = (a: ApiImplementedInterface) => a['omobility-las'][0]['get-url']
  public getInstitutionsAPIURL = (a: ApiImplementedInterface) => a.institutions[0].url
  public getOUnitsAPIURL = (a: ApiImplementedInterface) => a['organizational-units'][0].url
}

export { Catalogue }
