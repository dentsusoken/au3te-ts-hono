# Federation Configuration

## Overview

This section describes how to configure federation with an external Identity Provider (IdP) in your application.
Federation settings are configured as a JSON string in the environment variable `FEDERATTION_CONFIGS` (it is recommended to register this as a secret in environments like Cloudflare Workers).

By configuring this, you can enable authentication via external IdPs using either OpenID Connect (OIDC) or SAML 2.0 protocols.

## Configuration File Structure

The configuration has the following JSON structure. You define configuration objects for each IdP you want to federate with inside the `federations` array.

```json
{
  "federations": [
    {
      "id": "unique-id-for-idp-1",
      "protocol": "oidc",
      // ... OIDC configuration ...
    },
    {
      "id": "unique-id-for-idp-2",
      "protocol": "saml2",
      // ... SAML2 configuration ...
    }
  ]
}
```

---

## OpenID Connect (OIDC) Configuration

Configuration for federating using the OIDC protocol.

### Example Configuration

```json
{
  "id": "google-oidc",
  "protocol": "oidc",
  "client": {
    "clientId": "your-client-id",
    "clientSecret": "your-client-secret",
    "redirectUri": "https://your-app.example.com/api/federation/callback/google-oidc",
    "scopes": ["openid", "email", "profile"]
  },
  "server": {
    "name": "Google",
    "issuer": "https://accounts.google.com"
  }
}
```

### Configuration Details

#### Basic Settings

| Field Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Yes | Unique ID to identify this configuration. Also used as part of the URL (e.g., path parameter for callback URL). |
| `protocol` | `'oidc'` | Yes | Protocol type. Must be specified as `"oidc"` for OIDC. |

#### Client Settings (`client`)

Configuration for your application as an RP (Relying Party).

| Field Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `clientId` | `string` | Yes | Client ID issued by the IdP. |
| `clientSecret` | `string` | Yes | Client Secret issued by the IdP. |
| `redirectUri` | `string` | Yes | URL where the IdP redirects after authentication (Callback URL).<br>The end of the path typically matches the `id` of this configuration. |
| `scopes` | `string[]` | Yes | Array of requested scopes. `openid` is required.<br>Example: `["openid", "email", "profile"]` |
| `idTokenSignedResponseAlg` | `string` | No | Algorithm used for ID Token signing (e.g., `RS256`, `HS256`).<br>If not specified, it is determined based on the IdP's metadata, etc. |

#### Server Settings (`server`)

Configuration for the external IdP (OpenID Provider).

| Field Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `name` | `string` | Yes | Display name of the IdP (intended for use on login buttons, etc.). |
| `issuer` | `string` | Yes | Issuer URL of the IdP.<br>The discovery document (`/.well-known/openid-configuration`) is retrieved based on this URL to automatically configure endpoints. |

---

## SAML 2.0 Configuration

Configuration for federating using the SAML 2.0 protocol.
This system uses the [samlify](https://github.com/tngan/samlify) library for SAML implementation. Detailed behavior conforms to samlify specifications.

### Example Configuration

```json
{
  "id": "enterprise-saml",
  "protocol": "saml2",
  "name": "Enterprise Login",
  "idp": {
    "metadataUrl": "https://idp.example.com/saml/metadata"
  },
  "sp": {
    "entityID": "https://your-app.example.com/saml/metadata",
    "assertionConsumerService": [
      {
        "Binding": "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST",
        "Location": "https://your-app.example.com/api/federation/callback/enterprise-saml"
      }
    ],
    "nameIDFormat": ["urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress"],
    "wantAssertionsSigned": true,
    "authnRequestsSigned": true,
    "privateKey": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQ...\n-----END PRIVATE KEY-----",
    "signingCert": "-----BEGIN CERTIFICATE-----\nMIIDdTCCAl2gAwIBAgIU...\n-----END CERTIFICATE-----"
  }
}
```

### Configuration Details

#### Basic Settings

| Field Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Yes | Unique ID to identify this configuration. |
| `protocol` | `'saml2'` | Yes | Protocol type. Must be specified as `"saml2"` for SAML. |
| `name` | `string` | Yes | Display name of the IdP. |

#### Service Provider (SP) Settings (`sp`)

Items to configure your application as an SP.

| Field Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `entityID` | `string` | No | ID uniquely identifying the SP (usually in URI format). Must match the Entity ID registered on the IdP side. |
| `assertionConsumerService` | `Object[]` | No | Configuration for endpoints receiving assertions (ACS).<br>Specify `Binding` (e.g., `HTTP-POST`) and `Location` (URL). |
| `singleLogoutService` | `Object[]` | No | Endpoint configuration for Single Logout (SLO). Structure is the same as ACS. |
| `nameIDFormat` | `string[]` | No | Supported NameID formats. |
| `authnRequestsSigned` | `boolean` | No | Whether to sign authentication requests to the IdP. If `true`, `privateKey` and `signingCert` are required. |
| `wantAssertionsSigned` | `boolean` | No | Whether to require signatures on assertions from the IdP. |
| `wantMessageSigned` | `boolean` | No | Whether to require signatures on the entire SAML message from the IdP. |
| `privateKey` | `string` | No | SP's private key used for signing and decryption (PEM format). Use `\n` for newlines within JSON. |
| `signingCert` | `string` | No | SP's public key certificate for signature verification (PEM format). |
| `encryptCert` | `string` | No | SP's public key certificate for encryption (PEM format). Required when using assertion encryption. |
| `isAssertionEncrypted` | `boolean` | No | Whether to expect assertions to be encrypted. |

* Other fine-tuning options are available, such as `encPrivateKey` (decryption private key) and signature placement settings (`signatureConfig`).

#### Identity Provider (IdP) Settings (`idp`)

Configures the external IdP information. There are two ways: specifying a metadata URL or describing metadata directly.

| Field Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `metadataUrl` | `string` | No* | URL where the IdP's metadata XML can be retrieved. If specified, metadata is automatically retrieved and parsed at application startup.<br>*Required if `metadata` is not specified.* |
| `metadata` | `string` | No | The IdP's metadata XML string itself. Used when setting statically without using `metadataUrl`. |
| `entityID` | `string` | No | IdP's Entity ID. Usually not needed as it is automatically retrieved from metadata. |
| `singleSignOnService` | `Object[]` | Yes* | SSO endpoint configuration. Can be omitted if using metadata as it is automatically configured. |
| `singleLogoutService` | `Object[]` | Yes* | SLO endpoint configuration. Can be omitted if using metadata as it is automatically configured. |
| `signingCert` | `string` | No | IdP's certificate for signature verification. Automatically configured if included in metadata. |

* The `idp` setting can automatically configure many items (endpoints, certificates, etc.) by specifying `metadataUrl` or `metadata`. Manual individual configuration is also possible.
