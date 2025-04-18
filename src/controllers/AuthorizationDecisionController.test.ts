import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Context } from 'hono';
import { AuthorizationDecisionController } from './AuthorizationDecisionController';
import { Env } from '../env';
import { AuthorizationDecisionHandlerConfigurationImpl } from 'au3te-ts-base/handler.authorization-decision';
import { AuthorizationIssueHandlerConfigurationImpl } from 'au3te-ts-base/handler.authorization-issue';
import { AuthorizationFailHandlerConfigurationImpl } from 'au3te-ts-base/handler.authorization-fail';
import { AuthorizationPageHandlerConfigurationImpl } from 'au3te-ts-common/handler.authorization-page';
import { AuthorizationHandlerConfigurationImpl } from 'au3te-ts-base/handler.authorization';
import { UserHandlerConfigurationImpl } from 'au3te-ts-common/handler.user';
import { ExtractorConfigurationImpl } from 'au3te-ts-base/extractor';
import { apiClient } from '../../build/au3te-ts-base/lib/testing/configurations';

describe('AuthorizationDecisionController', () => {
  const mockBaseHandlerConfiguration = {
    apiClient: {
      authorizationIssuePath: '/authorization/issuer',
    },
  };
  const mockExtractorConfiguration = new ExtractorConfigurationImpl();
  const mockUserHandlerConfiguration = new UserHandlerConfigurationImpl();
  const mockAuthorizationIssueHandlerConfiguration =
    new AuthorizationIssueHandlerConfigurationImpl(
      mockBaseHandlerConfiguration
    );
  const mockAuthorizationFailHandlerConfiguration =
    new AuthorizationFailHandlerConfigurationImpl(mockBaseHandlerConfiguration);
  const mockAuthorizationPageHandlerConfiguration =
    new AuthorizationPageHandlerConfigurationImpl();
  const mockAuthorizationHandlerConfiguration =
    new AuthorizationHandlerConfigurationImpl({
      mockBaseHandlerConfiguration,
      mockAuthorizationIssueHandlerConfiguration,
      mockAuthorizationFailHandlerConfiguration,
      mockAuthorizationPageHandlerConfiguration,
      mockExtractorConfiguration,
    });
  const mockEndpointConfiguration =
    new AuthorizationDecisionHandlerConfigurationImpl({
      mockBaseHandlerConfiguration,
      mockExtractorConfiguration,
      mockUserHandlerConfiguration,
      mockAuthorizationHandlerConfiguration,
      mockAuthorizationIssueHandlerConfiguration,
      mockAuthorizationFailHandlerConfiguration,
    });

  const mockContext = {
    req: {
      raw: {},
    },
  } as unknown as Context<Env>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle authorization decision request successfully', async () => {
    mockEndpointConfiguration.processRequest = vi
      .fn()
      .mockResolvedValue(new Response('Success'));

    const response = await AuthorizationDecisionController.handle(mockContext);

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(200);
    expect(await response.text()).toBe('Success');
    expect(mockEndpointConfiguration.processRequest).toHaveBeenCalledWith(
      mockContext.req.raw
    );
  });

  it('should handle authorization decision request with failure', async () => {
    mockEndpointConfiguration.processRequest = vi
      .fn()
      .mockRejectedValue(new Error('Failure'));

    try {
      await AuthorizationDecisionController.handle(mockContext);
    } catch (error) {
      if (error instanceof Error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Failure');
      } else {
        throw error;
      }
      expect(mockEndpointConfiguration.processRequest).toHaveBeenCalledWith(
        mockContext.req.raw
      );
    }
  });
});
