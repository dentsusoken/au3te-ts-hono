import { Context } from 'hono';
import { Env } from '../env';

/**
 * Controller handling the credential issuance endpoint.
 * Processes credential requests and issues Verifiable Credentials.
 */
export class CredentialController {
  /**
   * Handles the credential issuance request.
   * Validates the request, performs necessary checks, and issues credentials.
   * @param {Context<Env>} c - The Hono context containing environment and request information.
   * @returns {Promise<Response>} A promise that resolves to the credential issuance response.
   */
  static async handle(c: Context<Env>) {
    const di = c.get('getDI')(c);
    const endpointConfiguration = di.credentialHandler();
    return await endpointConfiguration.processRequest(c.req.raw);
  }
}
