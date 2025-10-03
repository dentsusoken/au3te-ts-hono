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
import { User } from '@vecrea/au3te-ts-common/schemas.common';

/**
 * Props for the AuthorizationForm component.
 */
type AuthorizationFormProps = {
  /** Currently logged in user, if any */
  user: User | undefined | null;
  /** Pre-filled login ID value */
  loginId: string | undefined | null;
  /** Read-only login ID value */
  loginIdReadOnly: string | undefined | null;
  publicUrl: string;  
};

/**
 * Component that renders the authorization form.
 * Displays either a login form or the current user's information,
 * along with authorize/deny buttons.
 * @param {AuthorizationFormProps} props - The component props
 * @returns {JSX.Element} The rendered authorization form
 */
export const AuthorizationForm: FC<AuthorizationFormProps> = (props) => {
  const initialValue = props.loginId || '';
  const isReadOnly = Boolean(props.loginIdReadOnly);

  return (
    <>
      <h4 id="authorization">Authorization</h4>
      <div className="indent">
        <p>Do you grant authorization to the application?</p>

        <form
          id="authorization-form"
          action={`${props.publicUrl}/api/authorization/decision`}
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
                value={initialValue}
                {...(isReadOnly ? { readOnly: true } : {})}
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
              Logged in as <b>{props.user.subject}</b>. If re-authentication is
              needed, append <code>&prompt=login</code> to the authorization
              request.
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
    </>
  );
};
