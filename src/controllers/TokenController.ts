import { Context } from 'hono';
import { Env } from '../env';
import { TokenIssueHandlerConfigurationImpl } from '@vecrea/au3te-ts-server/handler.token-issue';
import { TokenFailHandlerConfigurationImpl } from '@vecrea/au3te-ts-server/handler.token-fail';
import { TokenCreateHandlerConfigurationImpl } from '@vecrea/au3te-ts-server/handler.token-create';
import { TokenHandlerConfigurationImpl } from '@vecrea/au3te-ts-server/handler.token';
// import { UserHandlerConfigurationImpl } from 'au3te-ts-common/handler.user';
import { UserHandlerKV as UserHandlerConfigurationImpl } from '../user/UserHandlerKV';

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
    console.log('TokenController.handle');
    const serverHandlerConfiguration = c.get('serverHandlerConfiguration');
    const extractorConfiguration = c.get('extractorConfiguration');
    const userHandlerConfiguration = new UserHandlerConfigurationImpl(
      c.env.USER_KV,
      c.env.MDOC_KV
    );
    const tokenFailHandlerConfiguration = new TokenFailHandlerConfigurationImpl(
      serverHandlerConfiguration
    );
    const tokenIssueHandlerConfiguration =
      new TokenIssueHandlerConfigurationImpl(serverHandlerConfiguration);
    const tokenCreateHandlerConfiguration =
      new TokenCreateHandlerConfigurationImpl(serverHandlerConfiguration);

    const tokenEndpointConfiguration = new TokenHandlerConfigurationImpl({
      serverHandlerConfiguration,
      extractorConfiguration,
      userHandlerConfiguration,
      tokenFailHandlerConfiguration,
      tokenIssueHandlerConfiguration,
      tokenCreateHandlerConfiguration,
    });

    return tokenEndpointConfiguration.processRequest(c.req.raw);
  }
}
