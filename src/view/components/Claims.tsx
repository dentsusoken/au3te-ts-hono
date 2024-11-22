import { FC } from 'hono/jsx';

type ClaimsProps = {
  type: 'id_token' | 'userinfo';
  claims: string[];
};

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
