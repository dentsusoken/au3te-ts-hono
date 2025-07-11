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
import { FC, Fragment } from 'hono/jsx';
import { Scope } from '@vecrea/au3te-ts-common/schemas.common';

/**
 * Props for the Permissions component.
 */
type PermissionsProps = {
  /** Array of OAuth 2.0 scopes requested by the client */
  scopes: Scope[];
};

/**
 * Component that displays the requested OAuth 2.0 scopes.
 * Shows a list of scopes with their descriptions that the client
 * application is requesting access to.
 * @param {PermissionsProps} props - The component props
 * @returns {JSX.Element} The rendered permissions section
 */
export const Permissions: FC<PermissionsProps> = ({ scopes }) => (
  <>
    <h4 id="permissions">Permissions</h4>
    <div className="indent">
      <p>The application is requesting the following permissions.</p>
      <dl id="scope-list">
        {scopes.map((scope, index) => (
          <Fragment key={index.toString()}>
            <dt>{scope.name}</dt>
            <dd>{scope.description}</dd>
          </Fragment>
        ))}
      </dl>
    </div>
  </>
);
