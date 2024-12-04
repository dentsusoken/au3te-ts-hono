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
 * Props for the ClientInfo component.
 */
type ClientInfoProps = {
  /** Name of the client application */
  clientName: string | undefined | null;
  /** URI of the client's logo image */
  logoUri: string | undefined | null;
  /** Description of the client application */
  description: string | undefined | null;
  /** URI of the client's homepage */
  clientUri: string | undefined | null;
  /** URI of the client's privacy policy */
  policyUri: string | undefined | null;
  /** URI of the client's terms of service */
  tosUri: string | undefined | null;
};

/**
 * Component that displays client application information.
 * Shows the client's name, logo, description, and relevant links
 * (homepage, privacy policy, terms of service).
 * @param {ClientInfoProps} props - The component props
 * @returns {JSX.Element} The rendered client information section
 */
export const ClientInfo: FC<ClientInfoProps> = (props) => (
  <>
    <h3 id="client-name">{props.clientName}</h3>
    <div className="indent">
      <img id="logo" src={props.logoUri ?? undefined} alt="[Logo] (150x150)" />
      <div id="client-summary">
        <p>{props.description}</p>
        <ul id="client-link-list">
          {props.clientUri && (
            <li>
              <a target="_blank" href={props.clientUri} rel="noreferrer">
                Homepage
              </a>
            </li>
          )}
          {props.policyUri && (
            <li>
              <a target="_blank" href={props.policyUri} rel="noreferrer">
                Policy
              </a>
            </li>
          )}
          {props.tosUri && (
            <li>
              <a target="_blank" href={props.tosUri} rel="noreferrer">
                Terms of Service
              </a>
            </li>
          )}
        </ul>
      </div>
      <div style={{ clear: 'both' }}></div>
    </div>
  </>
);
