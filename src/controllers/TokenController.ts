import { Context } from 'hono';
import { Env } from '../env';

/**
 * Controller handling the OAuth 2.0 token endpoint.
 * Processes token requests and issues access tokens, refresh tokens, and ID tokens.
 */
export class TokenController {
  /**
   * Handles the token request.
   * Validates the request and issues appropriate tokens based on the grant type.
   * @param {Context<Env>} c - The Hono context containing environment and request information.
   * @returns {Promise<Response>} A promise that resolves to the token response.
   */
  static async handle(c: Context<Env>) {
    const di = c.get('getDI')(c);
    const tokenEndpointConfiguration = di.tokenHandler();
    return tokenEndpointConfiguration.processRequest(c.req.raw);
  }
}
