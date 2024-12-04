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
 * Props for the Claims component.
 */
type ClaimsProps = {
  /** Type of claims, either for ID Token or UserInfo endpoint */
  type: 'id_token' | 'userinfo';
  /** Array of claim names requested */
  claims: string[];
};

/**
 * Component that displays the requested OpenID Connect claims.
 * Shows a list of claims that are requested either for the ID Token
 * or the UserInfo endpoint.
 * @param {ClaimsProps} props - The component props
 * @returns {JSX.Element} The rendered claims section
 */
export const Claims: FC<ClaimsProps> = ({ type, claims }) => (
  <>
    <h4 id={`claims-for-${type}`}>
      Claims for {type === 'id_token' ? 'ID Token' : 'UserInfo'}
    </h4>
    <div className="indent">
      <ul>
        {claims.map((claim, index) => (
          <li key={index}>{claim}</li>
        ))}
      </ul>
    </div>
  </>
);
