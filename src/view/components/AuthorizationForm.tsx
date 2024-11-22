import { FC } from 'hono/jsx';
import { User } from 'au3te-ts-common/schemas.common';

type AuthorizationFormProps = {
  user?: User;
  loginId?: string;
  loginIdReadOnly?: string;
};

export const AuthorizationForm: FC<AuthorizationFormProps> = (props) => (
  <>
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
