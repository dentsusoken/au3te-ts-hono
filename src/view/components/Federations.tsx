import { FC } from 'hono/jsx';

// TODO: define Federation type at au3te-ts-common
type Federation = {
  id: string;
  server: {
    name: string;
  };
};

type FederationsProps = {
  federations: Federation[];
  federationMessage?: string;
};

export const Federations: FC<FederationsProps> = (props) => (
  <div id="federations" className="indent">
    <div id="federations-prompt">
      ID federation using an external OpenID Provider
    </div>
    {props.federationMessage && (
      <div id="federation-message">{props.federationMessage}</div>
    )}
    <ul>
      {props.federations.map((federation, index) => (
        <li key={index}>
          <a href={`/api/federation/initiation/${federation.id}`}>
            {federation.server.name}
          </a>
        </li>
      ))}
    </ul>
  </div>
);
