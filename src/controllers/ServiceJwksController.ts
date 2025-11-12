import { Context } from 'hono';
import { Env } from '../env';

/**
 * Controller handling the OpenID Connect service jwks endpoint.
 * Provides OpenID Provider jwks information.
 */
export class ServiceJwksController {
  /**
   * Handles the service jwks request.
   * Returns the OpenID Provider jwks information.
   * @param {Context<Env>} c - The Hono context containing environment and request information.
   * @returns {Promise<Response>} A promise that resolves to the service jwks response.
   */
  static async handle(c: Context<Env>) {
    const di = c.get('getDI')(c);
    const endpointConfiguration = di.serviceJwksHandler();
    return await endpointConfiguration.processRequest(c.req.raw);
  }
}
