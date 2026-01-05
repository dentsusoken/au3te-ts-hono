/*
 * Copyright (C) 2014-2024 Authlete, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * either express or implied. See the License for the specific
 * language governing permissions and limitations under the
 * License.
 */
// import { Context } from 'hono';
// import { Env } from '../env';
// import { DefaultSessionSchemas } from '@vecrea/au3te-ts-server/session';

// /**
//  * Controller handling the OpenID Connect service configuration endpoint.
//  * Provides OpenID Provider configuration information (/.well-known/openid-configuration).
//  * 
//  * @deprecated Use AuthorizationServerMetadataController or OpenIDConfigurationController instead.
//  */
// export class ServiceConfigurationController {
//   /**
//    * Handles the service configuration request.
//    * Returns the OpenID Provider metadata as specified in OpenID Connect Discovery.
//    * @param {Context<Env>} c - The Hono context containing environment and request information.
//    * @returns {Promise<Response>} A promise that resolves to the service configuration response.
//    * 
//    * @deprecated Use AuthorizationServerMetadataController or OpenIDConfigurationController instead.
//    */
//   static async handle(c: Context<Env<DefaultSessionSchemas>>) {
//     const di = c.get('getDI')(c);
//     const endpointConfiguration = di.serviceConfigurationHandler();
//     return await endpointConfiguration.processRequest(c.req.raw);
//   }
// }
