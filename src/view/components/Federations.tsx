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
import { FC } from 'hono/jsx';
import { FederationRegistry } from '@vecrea/au3te-ts-common/schemas.federation';

/**
 * Props for the Federations component.
 */
type FederationsProps = {
  /** Array of available federation configurations */
  federationRegistry: FederationRegistry;
  /** Optional message to display about federation */
  federationMessage?: string;
};

/**
 * Component that displays available federation options.
 * Shows a list of external OpenID Providers that can be used for federation,
 * along with an optional message.
 * @param {FederationsProps} props - The component props
 * @returns {JSX.Element} The rendered federations section
 */
export const Federations: FC<FederationsProps> = (props) => (
  <div id="federations" className="indent">
    <div id="federations-prompt">
      ID federation using an external OpenID Provider
    </div>
    {props.federationMessage && (
      <div id="federation-message">{props.federationMessage}</div>
    )}
    <ul>
      {props.federationRegistry?.federations?.map((config, index) => (
        <li key={index}>
          <a href={`/api/federation/initiation/${config.id}`}>
            {config.protocol === 'oidc'
              ? config.server.name
              : config.name}
          </a>
        </li>
      ))}
    </ul>
  </div>
);
