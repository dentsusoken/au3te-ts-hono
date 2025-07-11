import { Context } from 'hono';
import { CredentialMetadataHandlerConfigurationImpl } from '@vecrea/au3te-ts-server/handler.credential-metadata';
import { Env } from '../env';

/**
 * Controller handling the credential issuer metadata endpoint.
 * Provides metadata about the credential issuer's capabilities and configuration.
 */
export class CredentialMetadataController {
  /**
   * Handles the credential issuer metadata request.
   * Returns the metadata about supported credential types and issuer configuration.
   * @param {Context<Env>} c - The Hono context containing environment and request information.
   * @returns {Promise<Response>} A promise that resolves to the credential issuer metadata response.
   */
  static async handle(c: Context<Env>) {
    const endpointConfiguration =
      new CredentialMetadataHandlerConfigurationImpl(
        c.get('serverHandlerConfiguration')
      );
    return await endpointConfiguration.processRequest(c.req.raw);
  }
}
