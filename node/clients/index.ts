import { IOClients } from '@vtex/api'
import MdClient from './mdClient'

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
    public get MdClient() {
        return this.getOrSet('mdClient', MdClient)
      }

}
