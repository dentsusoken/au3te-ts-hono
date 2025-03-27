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
 * Top page component that displays the service landing page.
 * Shows service information and available endpoints.
 * @returns {JSX.Element} The rendered top page
 */
export const TopPage: FC = () => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, minimum-scale=1.0, initial-scale=1.0, user-scalable=yes"
        />
        <title>Authorization Server</title>
        <link rel="stylesheet" href="/dev/css/index.css" />
      </head>
      <body className="font-default" style={{ margin: 0, textShadow: 'none' }}>
        <div id="page_title">Authorization Server</div>

        <div id="content">
          <p>
            Authorization server supporting OAuth 2.0 & OpenID Connect, powered
            by{' '}
            <b>
              <a href="https://www.authlete.com/" target="_blank">
                Authlete
              </a>
            </b>
            .
          </p>

          <table border={1} style={{ margin: '40px 20px' }}>
            <thead>
              <tr className="label">
                <th>Endpoint</th>
                <th>Path</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td valign="top">Authorization Endpoint</td>
                <td>/api/authorization</td>
              </tr>
              <tr>
                <td valign="top">Token Endpoint</td>
                <td>/api/token</td>
              </tr>
              <tr>
                <td valign="top">JWK Set Endpoint</td>
                <td>
                  <a href="/api/jwks">/api/jwks</a>
                </td>
              </tr>
              <tr>
                <td valign="top">Discovery Endpoint</td>
                <td>
                  <a href="/.well-known/openid-configuration">
                    /.well-known/openid-configuration
                  </a>
                </td>
              </tr>
              <tr>
                <td valign="top">Revocation Endpoint</td>
                <td>/api/revocation</td>
              </tr>
              <tr>
                <td valign="top">Introspection Endpoint</td>
                <td>/api/introspection</td>
              </tr>
              <tr>
                <td valign="top">Registration Endpoint</td>
                <td>/api/register</td>
              </tr>
              <tr>
                <td valign="top">Pushed Authorization Request Endpoint</td>
                <td>/api/par</td>
              </tr>
              <tr>
                <td valign="top">Grant Management Endpoint</td>
                <td>/api/gm/{'{grantId}'}</td>
              </tr>
              <tr>
                <td valign="top">Federation Configuration Endpoint</td>
                <td>
                  <a href="/.well-known/openid-federation">
                    /.well-known/openid-federation
                  </a>
                </td>
              </tr>
              <tr>
                <td valign="top">Federation Registration Endpoint</td>
                <td>/api/federation/register</td>
              </tr>
              <tr>
                <td valign="top">Credential Issuer Metadata Endpoint</td>
                <td>
                  <a href="/.well-known/openid-credential-issuer">
                    /.well-known/openid-credential-issuer
                  </a>
                </td>
              </tr>
              <tr>
                <td valign="top">JWT Issuer Metadata Endpoint</td>
                <td>
                  <a href="/.well-known/jwt-issuer">/.well-known/jwt-issuer</a>
                </td>
              </tr>
              <tr>
                <td valign="top">JWT VC Issuer Metadata Endpoint</td>
                <td>
                  <a href="/.well-known/jwt-vc-issuer">
                    /.well-known/jwt-vc-issuer
                  </a>
                </td>
              </tr>
            </tbody>
          </table>

          <table border={1} style={{ margin: '40px 20px' }}>
            <tbody>
              <tr>
                <td valign="top" className="label">
                  Management Console
                </td>
                <td>
                  <a href="https://so.authlete.com/" target="_blank">
                    https://so.authlete.com
                  </a>
                </td>
              </tr>
              <tr>
                <td valign="top" className="label">
                  Source Code
                </td>
                <td>
                  <a
                    href="https://github.com/authlete/java-oauth-server"
                    target="_blank"
                  >
                    https://github.com/authlete/java-oauth-server
                  </a>
                </td>
              </tr>
              <tr>
                <td valign="top" className="label">
                  Libraries
                </td>
                <td>
                  <a
                    href="https://github.com/authlete/authlete-java-common"
                    target="_blank"
                  >
                    https://github.com/authlete/authlete-java-common
                  </a>
                  <br />
                  <a
                    href="https://github.com/authlete/authlete-java-jaxrs"
                    target="_blank"
                  >
                    https://github.com/authlete/authlete-java-jaxrs
                  </a>
                </td>
              </tr>
            </tbody>
          </table>

          <ol>
            <li>
              <a href="https://www.authlete.com/" target="_blank">
                Authlete
              </a>{' '}
              is an OAuth 2.0 & OpenID Connect implementation on cloud (
              <a
                href="https://www.authlete.com/developers/overview/"
                target="_blank"
              >
                overview
              </a>
              ).
            </li>
            <li>
              This authorization server is written using Authlete's open source
              libraries.
            </li>
            <li>
              This authorization server is DB-less because authorization data
              are stored on cloud.
            </li>
            <li>
              You can manage settings of authorization servers by{' '}
              <a href="https://so.authlete.com/" target="_blank">
                Service Owner Console
              </a>{' '}
              (
              <a
                href="https://www.authlete.com/developers/so_console/"
                target="_blank"
              >
                document
              </a>
              ).
            </li>
            <li>
              You can manage settings of client applications by Developer
              Console (
              <a
                href="https://www.authlete.com/developers/cd_console/"
                target="_blank"
              >
                document
              </a>
              ).
            </li>
          </ol>
        </div>
      </body>
    </html>
  );
};
