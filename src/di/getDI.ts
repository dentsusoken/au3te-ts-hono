import { Env } from '../env';
import { Context } from 'hono';
import { DIContainer, DIContainerOverrides } from './DIContainer';
import { SessionSchemas } from '@vecrea/au3te-ts-server/session';
import { DIContainerImpl } from './DIContainerImpl';

/**
 * Function type that creates a DI container instance from a context.
 * @template SS - The session schemas type.
 */
export interface GetDI<SS extends SessionSchemas> {
  /**
   * Creates a DI container instance for the given context.
   * @param {Context<Env<SS>>} c - The Hono context.
   * @returns {DIContainer<SS>} A configured DI container instance.
   */
  (c: Context<Env<SS>>): DIContainer<SS>;
}

/**
 * Factory interface for creating GetDI functions.
 */
export interface CreateGetDI {
  /**
   * Creates a GetDI function configured with session schemas and optional overrides.
   * @template SS - The session schemas type.
   * @param {SS} sessionSchemas - The session schemas to use.
   * @param {DIContainerOverrides} [overrides={}] - Optional overrides for handler factories.
   * @returns {GetDI<SS>} A function that creates DI container instances.
   */
  <SS extends SessionSchemas>(
    sessionSchemas: SS,
    overrides?: DIContainerOverrides,
  ): GetDI<SS>;
}

/**
 * Creates a GetDI function factory with the specified session schemas and overrides.
 * @param {SS} sessionSchemas - The session schemas to use.
 * @param {DIContainerOverrides} [overrides={}] - Optional overrides for handler factories.
 * @returns {GetDI<SS>} A function that creates DI container instances.
 * @example
 * const getDI = createGetDI(unifiedIdSessionSchemas, {
 *   userHandler: createUnifiedIdUserHandler,
 * });
 * const di = getDI(context);
 */
export const createGetDI: CreateGetDI = <SS extends SessionSchemas>(
  sessionSchemas: SS,
  overrides: DIContainerOverrides = {},
): GetDI<SS> => {
  return (c: Context<Env<SS>>): DIContainer<SS> => {
    return new DIContainerImpl<SS>(c, sessionSchemas, overrides);
  };
};
