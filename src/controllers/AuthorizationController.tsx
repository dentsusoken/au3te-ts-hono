import { Context } from 'hono';
import { AuthorizationPageModel } from '@vecrea/au3te-ts-common/handler.authorization-page';
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
    const di = c.get('getDI')(c);

    const endpointConfiguration = di.authorizationHandler();
    const result = await endpointConfiguration.processRequest(c.req.raw);
    if (result.ok) {
      const pageModel = (await result.json()) as AuthorizationPageModel;
      return c.render(
        <AuthorizationPage {...pageModel} publicUrl={c.env.PUBLIC_URL} />
      );
    }
    return result;
  }
}
