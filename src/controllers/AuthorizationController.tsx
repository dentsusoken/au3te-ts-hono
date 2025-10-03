import { Context } from 'hono';
import { AuthorizationHandlerConfigurationImpl } from '@vecrea/au3te-ts-server/handler.authorization';
import { AuthorizationIssueHandlerConfigurationImpl } from '@vecrea/au3te-ts-server/handler.authorization-issue';
import { AuthorizationFailHandlerConfigurationImpl } from '@vecrea/au3te-ts-server/handler.authorization-fail';
import {
  AuthorizationPageHandlerConfigurationImpl,
  AuthorizationPageModel,
} from '@vecrea/au3te-ts-common/handler.authorization-page';
import { Env } from '../env';
import { AuthorizationPage } from '../view/AuthorizationPage';

/**
 * Controller handling OAuth 2.0 authorization endpoint requests.
 * Processes authorization requests and renders the authorization page.
 */
export class AuthorizationController {
  /**
   * Handles the authorization request.
   * @param {Context<Env>} c - The Hono context containing environment and request information.
   * @returns {Promise<Response>} A promise that resolves to either the authorization page or an error response.
   */
  static async handle(c: Context<Env>) {
    const serverHandlerConfiguration = c.get('serverHandlerConfiguration');
    const extractorConfiguration = c.get('extractorConfiguration');

    const authorizationIssueHandlerConfiguration =
      new AuthorizationIssueHandlerConfigurationImpl(
        serverHandlerConfiguration
      );
    const authorizationFailHandlerConfiguration =
      new AuthorizationFailHandlerConfigurationImpl(serverHandlerConfiguration);
    const authorizationPageHandlerConfiguration =
      new AuthorizationPageHandlerConfigurationImpl();
    const endpointConfiguration = new AuthorizationHandlerConfigurationImpl({
      serverHandlerConfiguration,
      authorizationIssueHandlerConfiguration,
      authorizationFailHandlerConfiguration,
      authorizationPageHandlerConfiguration,
      extractorConfiguration,
    });
    const result = await endpointConfiguration.processRequest(c.req.raw);
    if (result.ok) {
      const pageModel = (await result.json()) as AuthorizationPageModel;
      const host = c.req.header('host') || '';
      return c.render(<AuthorizationPage {...pageModel} publicUrl={c.env.PUBLIC_URL} />);
    }
    return result;
  }
}
