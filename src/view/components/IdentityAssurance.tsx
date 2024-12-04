import { FC } from 'hono/jsx';
import { Pair } from 'au3te-ts-common/schemas.common';

type IdentityAssuranceProps = {
  purpose: string | undefined | null;
  allVerifiedClaimsForIdTokenRequested: boolean | undefined | null;
  allVerifiedClaimsForUserInfoRequested: boolean | undefined | null;
  verifiedClaimsForIdToken: Pair[] | undefined | null;
  verifiedClaimsForUserInfo: Pair[] | undefined | null;
};

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
