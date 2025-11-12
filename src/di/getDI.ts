import { Env } from '../env';
import { Context } from 'hono';
import { DIContainer, DIContainerOverrides } from './DIContainer';
import { SessionSchemas } from '@vecrea/au3te-ts-server/session';
import { DIContainerImpl } from './DIContainerImpl';

export interface GetDI<SS extends SessionSchemas> {
  (c: Context<Env<SS>>): DIContainer<SS>;
}

export interface CreateGetDI {
  <SS extends SessionSchemas>(
    sessionSchemas: SS,
    overrides?: DIContainerOverrides
  ): GetDI<SS>;
}

export const createGetDI: CreateGetDI = <SS extends SessionSchemas>(
  sessionSchemas: SS,
  overrides: DIContainerOverrides = {}
): GetDI<SS> => {
  return (c: Context<Env<SS>>): DIContainer<SS> => {
    return new DIContainerImpl<SS>(c, sessionSchemas, overrides);
  };
};
