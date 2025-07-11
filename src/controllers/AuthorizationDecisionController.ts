import { Context } from 'hono';
import { AuthorizationDecisionHandlerConfigurationImpl } from '@vecrea/au3te-ts-server/handler.authorization-decision';
import { AuthorizationIssueHandlerConfigurationImpl } from '@vecrea/au3te-ts-server/handler.authorization-issue';
import { AuthorizationFailHandlerConfigurationImpl } from '@vecrea/au3te-ts-server/handler.authorization-fail';
import { AuthorizationPageHandlerConfigurationImpl } from '@vecrea/au3te-ts-common/handler.authorization-page';
import { AuthorizationHandlerConfigurationImpl } from '@vecrea/au3te-ts-server/handler.authorization';
// import { UserHandlerConfigurationImpl } from 'au3te-ts-common/handler.user';
import { UserHandlerKV as UserHandlerConfigurationImpl } from '../user/UserHandlerKV';
import { ExtractorConfigurationImpl } from '@vecrea/au3te-ts-server/extractor';
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
    const serverHandlerConfiguration = c.get('serverHandlerConfiguration');
    const extractorConfiguration = new ExtractorConfigurationImpl();
    const userHandlerConfiguration = new UserHandlerConfigurationImpl(
      c.env.USER_KV,
      c.env.MDOC_KV
    );

    const authorizationIssueHandlerConfiguration =
      new AuthorizationIssueHandlerConfigurationImpl(
        serverHandlerConfiguration
      );
    const authorizationFailHandlerConfiguration =
      new AuthorizationFailHandlerConfigurationImpl(serverHandlerConfiguration);
    const authorizationPageHandlerConfiguration =
      new AuthorizationPageHandlerConfigurationImpl();

    const authorizationHandlerConfiguration =
      new AuthorizationHandlerConfigurationImpl({
        serverHandlerConfiguration,
        authorizationIssueHandlerConfiguration,
        authorizationFailHandlerConfiguration,
        authorizationPageHandlerConfiguration,
        extractorConfiguration,
      });

    const endpointConfiguration =
      new AuthorizationDecisionHandlerConfigurationImpl({
        serverHandlerConfiguration,
        extractorConfiguration,
        userHandlerConfiguration,
        authorizationHandlerConfiguration,
        authorizationIssueHandlerConfiguration,
        authorizationFailHandlerConfiguration,
      });

    return await endpointConfiguration.processRequest(c.req.raw);
  }
}
