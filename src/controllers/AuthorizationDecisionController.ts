import { Context } from 'hono';
import { Env } from '../env';

/**
 * Controller handling the authorization decision endpoint.
 * Processes user's consent decision for OAuth 2.0 authorization requests.
 */
export class AuthorizationDecisionController {
  /**
   * Handles the authorization decision request.
   * Processes the user's consent decision and returns appropriate response.
   * @param {Context<Env>} c - The Hono context containing environment and request information.
   * @returns {Promise<Response>} A promise that resolves to the authorization decision response.
   */
  static async handle(c: Context<Env>) {
    const di = c.get('getDI')(c);
    const endpointConfiguration = di.authorizationDecisionHandler();
    return await endpointConfiguration.processRequest(c.req.raw);
  }
}
