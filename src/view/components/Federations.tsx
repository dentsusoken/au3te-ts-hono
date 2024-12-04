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

/**
 * Represents a federation configuration with an external OpenID Provider.
 * @todo define Federation type at au3te-ts-common
 */
type Federation = {
  /** Unique identifier for the federation */
  id: string;
  /** Server configuration for the federation */
  server: {
    /** Name of the federation server */
    name: string;
  };
};

/**
 * Props for the Federations component.
 */
type FederationsProps = {
  /** Array of available federation configurations */
  federations: Federation[];
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
      {props.federations.map((federation, index) => (
        <li key={index}>
          <a href={`/api/federation/initiation/${federation.id}`}>
            {federation.server.name}
          </a>
        </li>
      ))}
    </ul>
  </div>
);
