import { Context } from 'hono';
import { Env } from '../env';

/**
 * Controller handling the Pushed Authorization Request (PAR) endpoint.
 * Processes PAR requests according to OAuth 2.0 PAR specification.
 */
export class PARController {
  /**
   * Handles the PAR request.
   * Creates and returns a request URI for a pushed authorization request.
   * @param {Context<Env>} c - The Hono context containing environment and request information.
   * @returns {Promise<Response>} A promise that resolves to the PAR response containing the request URI.
   */
  static async handle(c: Context<Env>) {
    const di = c.get('getDI')(c);
    const endpointConfiguration = di.parHandler();
    return await endpointConfiguration.processRequest(c.req.raw);
  }
}
