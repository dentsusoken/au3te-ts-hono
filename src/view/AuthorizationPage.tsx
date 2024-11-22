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
import { AuthorizationPageModel } from 'au3te-ts-common/page-model.authorization';

export const AuthorizationPage: FC<AuthorizationPageModel> = (props) => {
  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, minimum-scale=1.0, initial-scale=1.0, user-scalable=yes"
        />
        <title>{props.serviceName} | Authorization</title>
        <link rel="stylesheet" href="/css/authorization.css" />
      </head>
      <body className="font-default">
        <div id="page_title">{props.serviceName}</div>

        <div id="content">
          <h3 id="client-name">{props.clientName}</h3>
          <div className="indent">
            <img id="logo" src={props.logoUri} alt="[Logo] (150x150)" />

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

          {props.scopes && props.scopes.length > 0 && (
            <>
              <h4 id="permissions">Permissions</h4>
              <div className="indent">
                <p>The application is requesting the following permissions.</p>
                <dl id="scope-list">
                  {props.scopes.map((scope, index) => (
                    <Fragment key={index.toString()}>
                      <dt>{scope.name}</dt>
                      <dd>{scope.description}</dd>
                    </Fragment>
                  ))}
                </dl>
              </div>
            </>
          )}

          {props.claimsForIdToken && (
            <>
              <h4 id="claims-for-id_token">Claims for ID Token</h4>
              <div className="indent">
                <ul>
                  {props.claimsForIdToken.map((claim, index) => (
                    <li key={index}>{claim}</li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {/* Identity Assurance Section */}
          {props.identityAssuranceRequired && (
            <>
              <h4 id="identity-assurance">Identity Assurance</h4>
              <div className="indent">
                {props.purpose && (
                  <>
                    <h5>Purpose</h5>
                    <div className="indent">
                      <p>{props.purpose}</p>
                    </div>
                  </>
                )}

                {/* Verified Claims Tables */}
                {/* ... 他の検証済みクレームセクション ... */}
              </div>
            </>
          )}

          <h4 id="authorization">Authorization</h4>
          <div className="indent">
            <p>Do you grant authorization to the application?</p>

            <form
              id="authorization-form"
              action="/api/authorization/decision"
              method="post"
            >
              {!props.user ? (
                <div id="login-fields" className="indent">
                  <div id="login-prompt">Input Login ID and Password.</div>
                  <input
                    type="text"
                    id="loginId"
                    name="loginId"
                    placeholder="Login ID"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    className="font-default"
                    value={props.loginId}
                    readOnly={props.loginIdReadOnly}
                  />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    className="font-default"
                  />
                </div>
              ) : (
                <div id="login-user" className="indent">
                  Logged in as <b>{props.user.subject}</b>. If re-authentication
                  is needed, append <code>&prompt=login</code>
                  to the authorization request.
                </div>
              )}

              <div id="authorization-form-buttons">
                <input
                  type="submit"
                  name="authorized"
                  id="authorize-button"
                  value="Authorize"
                  className="font-default"
                />
                <input
                  type="submit"
                  name="denied"
                  id="deny-button"
                  value="Deny"
                  className="font-default"
                />
              </div>
            </form>
          </div>
        </div>
      </body>
    </html>
  );
};
