import { Context } from 'hono';
import { Env } from '../env';

/**
 * Controller handling the credential issuer jwks endpoint.
 * Provides jwks information about the credential issuer.
 */
export class CredentialIssuerJwksController {
  /**
   * Handles the credential issuer jwks request.
   * Returns the jwks information about the credential issuer.
   * @param {Context<Env>} c - The Hono context containing environment and request information.
   * @returns {Promise<Response>} A promise that resolves to the credential issuer jwks response.
   */
  static async handle(c: Context<Env>) {
    const di = c.get('getDI')(c);
    const endpointConfiguration = di.credentialIssuerJwksHandler();
    return await endpointConfiguration.processRequest(c.req.raw);
  }
}
