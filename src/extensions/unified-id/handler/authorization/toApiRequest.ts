import { AuthorizationRequest } from '@vecrea/au3te-ts-common/schemas.authorization';
import { CreateToApiRequestParams } from '@vecrea/au3te-ts-server/handler.authorization';
import {
  ApiRequestWithOptions,
  ToApiRequest,
} from '@vecrea/au3te-ts-server/handler.core';
import { UnifiedIdParams } from '../../schemas/UnifiedIdParams';

export const createToApiRequest =
  <OPTS extends UnifiedIdParams = UnifiedIdParams>({
    extractParameters,
  }: CreateToApiRequestParams): ToApiRequest<
    ApiRequestWithOptions<AuthorizationRequest, OPTS>
  > =>
  async (
    request: Request,
  ): Promise<ApiRequestWithOptions<AuthorizationRequest, OPTS>> => {
    const { parameters, context } = JSON.parse(
      await extractParameters(request),
    ) as { parameters: string; context: string };

    const searchParams = new URLSearchParams(context);
    const options = Object.fromEntries(searchParams.entries()) as OPTS;

    return {
      apiRequest: {
        parameters,
        context,
      },
      options: options,
    };
  };
