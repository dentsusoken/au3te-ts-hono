import { Context } from 'hono';
import { CredentialSingleIssueHandlerConfigurationImpl } from '@vecrea/au3te-ts-server/handler.credential-single-issue';
import { CredentialSingleParseHandlerConfigurationImpl } from '@vecrea/au3te-ts-server/handler.credential-single-parse';
import { ServerCredentialHandlerConfigurationImpl } from '@vecrea/au3te-ts-server/handler.credential';
import { IntrospectionHandlerConfigurationImpl } from '@vecrea/au3te-ts-server/handler.introspection';
import { CommonCredentialHandlerConfigurationImpl } from '@vecrea/au3te-ts-common/handler.credential';
import { CredentialMetadataHandlerConfigurationImpl } from '@vecrea/au3te-ts-server/handler.credential-metadata';
// import { UserHandlerConfigurationImpl } from 'au3te-ts-common/handler.user';
import { UserHandlerKV as UserHandlerConfigurationImpl } from '../user/UserHandlerKV';
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
    const serverHandlerConfiguration = c.get('serverHandlerConfiguration');
    const extractorConfiguration = c.get('extractorConfiguration');
    const userHandlerConfiguration = new UserHandlerConfigurationImpl(
      c.env.USER_KV,
      c.env.MDOC_KV
    );

    const introspectionHandlerConfiguration =
      new IntrospectionHandlerConfigurationImpl(serverHandlerConfiguration);
    const credentialSingleParseHandlerConfiguration =
      new CredentialSingleParseHandlerConfigurationImpl(
        serverHandlerConfiguration
      );
    const commonCredentialHandlerConfiguration =
      new CommonCredentialHandlerConfigurationImpl({
        userHandlerConfiguration,
      });
    const credentialMetadataHandlerConfiguration =
      new CredentialMetadataHandlerConfigurationImpl(
        serverHandlerConfiguration
      );
    const serverCredentialHandlerConfiguration =
      new ServerCredentialHandlerConfigurationImpl({
        credentialMetadataHandlerConfiguration,
      });

    const endpointConfiguration =
      new CredentialSingleIssueHandlerConfigurationImpl({
        serverHandlerConfiguration,
        extractorConfiguration,
        introspectionHandlerConfiguration,
        credentialSingleParseHandlerConfiguration,
        commonCredentialHandlerConfiguration,
        serverCredentialHandlerConfiguration,
      });
    return await endpointConfiguration.processRequest(c.req.raw);
  }
}
