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
import { AuthorizationPageModel } from 'au3te-ts-common/handler.authorization-page';
import { ClientInfo } from './components/ClientInfo';
import { Permissions } from './components/Permissions';
import { Claims } from './components/Claims';
import { IdentityAssurance } from './components/IdentityAssurance';
import { AuthorizationForm } from './components/AuthorizationForm';
// import { Federations } from './components/Federations';

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
          <ClientInfo
            clientName={props.clientName}
            logoUri={props.logoUri}
            description={props.description}
            clientUri={props.clientUri}
            policyUri={props.policyUri}
            tosUri={props.tosUri}
          />

          {props.scopes && props.scopes.length > 0 && (
            <Permissions scopes={props.scopes} />
          )}

          {props.claimsForIdToken && (
            <Claims type="id_token" claims={props.claimsForIdToken} />
          )}

          {props.claimsForUserInfo && (
            <Claims type="userinfo" claims={props.claimsForUserInfo} />
          )}

          {props.identityAssuranceRequired && (
            <IdentityAssurance
              purpose={props.purpose}
              allVerifiedClaimsForIdTokenRequested={
                props.allVerifiedClaimsForIdTokenRequested
              }
              allVerifiedClaimsForUserInfoRequested={
                props.allVerifiedClaimsForUserInfoRequested
              }
              verifiedClaimsForIdToken={props.verifiedClaimsForIdToken}
              verifiedClaimsForUserInfo={props.verifiedClaimsForUserInfo}
            />
          )}

          {props.authorizationDetails && (
            <>
              <h4 id="authorization-details">Authorization Details</h4>
              <div className="indent">
                <pre>{props.authorizationDetails}</pre>
              </div>
            </>
          )}

          {/*
          TODO: define Federation type at au3te-ts-common
          {!props.user && props.federations && (
            <Federations
              federations={props.federations}
              federationMessage={props.federationMessage}
            />
          )}
          */}

          <AuthorizationForm
            user={props.user}
            loginId={props.loginId}
            loginIdReadOnly={props.loginIdReadOnly}
          />
        </div>
      </body>
    </html>
  );
};
