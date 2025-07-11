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
import { Pair } from '@vecrea/au3te-ts-common/schemas.common';

/**
 * Props for the IdentityAssurance component.
 */
type IdentityAssuranceProps = {
  /** Purpose of the identity assurance request */
  purpose: string | undefined | null;
  /** Whether all verified claims are requested for ID token */
  allVerifiedClaimsForIdTokenRequested: boolean | undefined | null;
  /** Whether all verified claims are requested for UserInfo */
  allVerifiedClaimsForUserInfoRequested: boolean | undefined | null;
  /** Specific verified claims requested for ID token */
  verifiedClaimsForIdToken: Pair[] | undefined | null;
  /** Specific verified claims requested for UserInfo */
  verifiedClaimsForUserInfo: Pair[] | undefined | null;
};

/**
 * Component that displays identity assurance information.
 * Shows the purpose of verification and requested verified claims
 * for both ID token and UserInfo endpoints.
 * @param {IdentityAssuranceProps} props - The component props
 * @returns {JSX.Element} The rendered identity assurance section
 */
export const IdentityAssurance: FC<IdentityAssuranceProps> = (props) => (
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

      {(props.allVerifiedClaimsForIdTokenRequested ||
        props.verifiedClaimsForIdToken) && (
        <>
          <h5>Verified claims requested for ID token</h5>
          <div className="indent">
            {props.allVerifiedClaimsForIdTokenRequested ? (
              'All'
            ) : (
              <table
                border={1}
                cellPadding={5}
                style={{ borderCollapse: 'collapse' }}
                className="verified-claims"
              >
                <thead>
                  <tr bgcolor="orange">
                    <th>claim</th>
                    <th>purpose</th>
                  </tr>
                </thead>
                <tbody>
                  {props.verifiedClaimsForIdToken?.map((pair, index) => (
                    <tr key={index}>
                      <td>{pair.key}</td>
                      <td>{pair.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {(props.allVerifiedClaimsForUserInfoRequested ||
        props.verifiedClaimsForUserInfo) && (
        <>
          <h5>Verified claims requested for userinfo</h5>
          <div className="indent">
            {props.allVerifiedClaimsForUserInfoRequested ? (
              'All'
            ) : (
              <table
                border={1}
                cellPadding={5}
                style={{ borderCollapse: 'collapse' }}
              >
                <thead>
                  <tr bgcolor="orange">
                    <th>claim</th>
                    <th>purpose</th>
                  </tr>
                </thead>
                <tbody>
                  {props.verifiedClaimsForUserInfo?.map((pair, index) => (
                    <tr key={index}>
                      <td>{pair.key}</td>
                      <td>{pair.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  </>
);
