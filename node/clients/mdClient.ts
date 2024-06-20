/* eslint-disable prettier/prettier */
import type { InstanceOptions, IOContext } from '@vtex/api'
import { JanusClient } from '@vtex/api'

const baseURL = '/api/dataentities/'

const routes = {
  emailWheel: (dataEntity: string, prizesEvent: string, email: string | string[]) =>
    `${baseURL}${dataEntity}/search?_fields=${prizesEvent}&_where=email=${email}`,
}

export default class MdClient extends JanusClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        VtexIdClientAutCookie:
          context.adminUserAuthToken ??
          context.storeUserAuthToken ??
          context.authToken,
      },
    })
  }

  public async validateEmailWheel(dataEntity: string,prizesEvent: string, email: string | string[]): Promise<any> {
    return this.http.get(`${routes.emailWheel(dataEntity, prizesEvent, email)}`)
  }
}
