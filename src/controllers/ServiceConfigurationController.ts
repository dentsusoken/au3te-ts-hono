import { Context } from 'hono';
import { Env } from '../env';
import { getDI } from '../di';

/**
 * Controller handling the OpenID Connect service configuration endpoint.
 * Provides OpenID Provider configuration information (/.well-known/openid-configuration).
 */
export class ServiceConfigurationController {
  /**
   * Handles the service configuration request.
   * Returns the OpenID Provider metadata as specified in OpenID Connect Discovery.
   * @param {Context<Env>} c - The Hono context containing environment and request information.
   * @returns {Promise<Response>} A promise that resolves to the service configuration response.
   */
  static async handle(c: Context<Env>) {
    const di = c.get('getDI')(c);
    const endpointConfiguration = di.serviceConfigurationHandler();
    return await endpointConfiguration.processRequest(c.req.raw);
  }
}
