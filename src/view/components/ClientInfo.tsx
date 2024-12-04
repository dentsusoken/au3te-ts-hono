import { FC } from 'hono/jsx';

type ClientInfoProps = {
  clientName: string | undefined | null;
  logoUri: string | undefined | null;
  description: string | undefined | null;
  clientUri: string | undefined | null;
  policyUri: string | undefined | null;
  tosUri: string | undefined | null;
};

export const ClientInfo: FC<ClientInfoProps> = (props) => (
  <>
    <h3 id="client-name">{props.clientName}</h3>
    <div className="indent">
      <img id="logo" src={props.logoUri ?? undefined} alt="[Logo] (150x150)" />
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
  </>
);
