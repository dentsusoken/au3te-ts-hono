
import { Context } from 'hono';
import { Env } from '../env';

/**
 * Controller handling federation initiation endpoint requests.
 * Processes federation initiation requests and initiates the federation flow
 * with external identity providers.
 */
export class FederationInitiationController {
  /**
   * Handles the federation initiation request.
   * Validates the request, performs necessary checks, and initiates federation.
   * @param {Context<Env>} c - The Hono context containing environment and request information.
   * @returns {Promise<Response>} A promise that resolves to the federation initiation response.
   */
  static async handle(c: Context<Env>) {
    const di = c.get('getDI')(c);
    const endpointConfiguration = di.federationInitiationHandler();
    return await endpointConfiguration.processRequest(c.req.raw);
  }
}
