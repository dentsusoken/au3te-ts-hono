import { FC, Fragment } from 'hono/jsx';
import { Scope } from 'au3te-ts-common/schemas.common';

type PermissionsProps = {
  scopes: Scope[];
};

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
