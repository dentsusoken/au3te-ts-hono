import { Env } from '../env';
import { Context } from 'hono';
import { DIContainer, DIContainerOverrides } from './DIContainer';
import {
  SessionSchemas,
  sessionSchemas,
} from '@vecrea/au3te-ts-server/session';
import { DIContainerImpl } from './DIContainerImpl';

export interface GetDI {
  <SS extends SessionSchemas = typeof sessionSchemas>(
    c: Context<Env<SS>>,
    overrides?: DIContainerOverrides
  ): DIContainer<SS>;
}

export interface CreateGetDI {
  (overrides?: DIContainerOverrides): GetDI;
}

export const getDI: GetDI = <SS extends SessionSchemas = typeof sessionSchemas>(
  c: Context<Env<SS>>,
  overrides: DIContainerOverrides = {}
): DIContainer<SS> => {
  return new DIContainerImpl<SS>(c, overrides);
};

export const createGetDI: CreateGetDI = (
  overrides: DIContainerOverrides = {}
) => {
  return <SS extends SessionSchemas>(c: Context<Env<SS>>) =>
    getDI<SS>(c, overrides);
};
