# au3te-ts-hono

A Hono-based implementation of the au3te-ts server for OAuth 2.0 and OpenID Connect operations.

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Setup](#setup)
  - [Prerequisites](#prerequisites)
    - [Authlete Client Registration](#authlete-client-registration)
    - [mkcert Installation](#mkcert-installation)
      - [macOS Installation](#macos-installation)
      - [Root CA Setup](#root-ca-setup)
      - [Check Root Certificate Location](#check-root-certificate-location)
    - [Clone Repository](#clone-repository)
    - [Install Dependencies](#install-dependencies)
    - [Creating Server Certificate](#creating-server-certificate)
      - [Preparation](#preparation)
      - [Certificate Creation](#certificate-creation)
  - [Cloudflare Setup](#cloudflare-setup)
    - [Create .dev.vars](#create-devvars)
    - [Setup KV Namespaces for Local Development](#setup-kv-namespaces-for-local-development)
  - [KV Helper Scripts](#kv-helper-scripts)
    - [Using update-wrangler-kv-ids.sh](#using-update-wrangler-kv-idssh)
    - [Using kv-put.sh](#using-kv-putsh)
    - [Using kv-get.sh](#using-kv-getsh)
- [Local Development](#local-development)
  - [Run Locally](#run-locally)
- [Deployment](#deployment)
  - [Deploy to Cloudflare Workers](#deploy-to-cloudflare-workers)
- [AWS Setup](#aws-setup)
  - [Prerequisites](#prerequisites-1)
  - [Setup Steps](#setup-steps)
    - [Environment Variables Configuration](#environment-variables-configuration)
    - [VSCode Dev Container Startup](#vscode-dev-container-startup)
- [LocalStack Deployment](#localstack-deployment)
- [AWS Deployment](#aws-deployment)
  - [Deploy Script Details](#deploy-script-details)
    - [deployLocalStack.sh](#deploylocalstacksh)
    - [deployAws.sh](#deployawssh)
- [Federation Configuration](#federation-configuration)
- [License](#license)

## Setup

### Prerequisites

#### Authlete Client Registration

Register your service and client (and organization if needed) on the Authlete console.
Required configuration information:

- Service ID
- Service Access Token
- Client ID
- Redirect URL

For setup instructions, see [here](https://www.authlete.com/ja/developers/tutorial/signup/)

#### mkcert Installation

mkcert is a tool for easily implementing HTTPS communication in local development environments.
Here's how to install and configure mkcert.

##### macOS Installation

```bash
brew install mkcert
brew install nss # Required if using Firefox
```

##### Root CA Setup

```bash
mkcert -install
```

##### Check Root Certificate Location

```bash
mkcert -CAROOT
```

#### Clone Repository

```bash
git clone https://github.com/dentsusoken/au3te-ts-hono
cd au3te-ts-hono
```

#### Install Dependencies

```bash
npm install
```

#### Creating Server Certificate

To enable HTTPS communication with the previously set static IP address, we'll create a server certificate.

##### Preparation

```bash
mkdir .mkcert
cd .mkcert
```

Create and move to a dedicated folder for certificate storage.

##### Certificate Creation

```bash
mkcert localhost
```

### Cloudflare Setup

#### Create .dev.vars

Create a `.dev.vars` file in the project root:

```bash
API_BASE_URL=https://jp.authlete.com
API_VERSION=V3
API_KEY=YOUR_SERVICE_ID
ACCESS_TOKEN=YOUR_ACCESS_TOKEN
```

#### Setup KV Namespaces for Local Development

1. Create KV namespaces for local development:

```bash
npx wrangler kv namespace create "SESSION_KV"
npx wrangler kv namespace create "USER_KV"
npx wrangler kv namespace create "MDOC_KV"
```

2. Find your KV namespace IDs:

```bash
npx wrangler kv namespace list
```

This will show output like:

```json
[
  {
    "id": "8b4ec28a716544169c2814a6ca02cb76",
    "title": "SESSION_KV",
    "supports_url_encoding": true,
    "beta": false
  },
  {
    "id": "3ff4347455a94aea9507aba0881f2ec4",
    "title": "USER_KV",
    "supports_url_encoding": true,
    "beta": false
  },
  {
    "id": "2cf695d7db584e2b82f475a4f719787b",
    "title": "MDOC_KV",
    "supports_url_encoding": true,
    "beta": false
  }
]
```

3. Set environment variables with your KV IDs:

Create a `.env.local` file:

```bash
SESSION_KV_ID=8b4ec28a716544169c2814a6ca02cb76
USER_KV_ID=3ff4347455a94aea9507aba0881f2ec4
MDOC_KV_ID=2cf695d7db584e2b82f475a4f719787b
```

4. Ignore `wrangler.toml` changes in git (recommended for local development):

```bash
git update-index --assume-unchanged wrangler.toml
```

This prevents accidental commits of your local KV namespace IDs while allowing you to modify the file for local development.

5. Update `wrangler.toml` with your local KV namespace IDs:

```bash
# Use the provided script to automatically update wrangler.toml
./shell/update-wrangler-kv-ids.sh
```

This script reads the KV namespace IDs from your `.env.local` file and updates the placeholders in `wrangler.toml`.

**To commit changes to wrangler.toml when needed:**

```bash
# Temporarily track the file
git update-index --no-assume-unchanged wrangler.toml

# Add and commit your changes
git add wrangler.toml
git commit -m "Update wrangler.toml configuration"

# Resume ignoring the file
git update-index --assume-unchanged wrangler.toml
```

**Optional: Create aliases for easier management:**

```bash
# Add these to your ~/.zshrc or ~/.bashrc
alias ignore-wrangler="git update-index --assume-unchanged wrangler.toml"
alias track-wrangler="git update-index --no-assume-unchanged wrangler.toml"

# Reload your shell configuration
source ~/.zshrc  # or source ~/.bashrc
```

Then you can use:

- `ignore-wrangler` to ignore wrangler.toml changes
- `track-wrangler` to track wrangler.toml changes

7. (Optional) Add test data to your KV namespaces:

```bash
# Add user data to USER_KV
./shell/kv-put.sh USER_KV 1004 "$(cat data/user.json)"

# Add mdoc data to MDOC_KV
./shell/kv-put.sh MDOC_KV 1004 "$(cat data/mdoc.json)"

# Verify the data
./shell/kv-get.sh USER_KV 1004
./shell/kv-get.sh MDOC_KV 1004
```

**Note**: The `kv-put.sh` and `kv-get.sh` scripts automatically read namespace IDs from your `.env.local` file.

### KV Helper Scripts

The project includes helper scripts in the `shell/` directory for easy KV operations:

#### Using update-wrangler-kv-ids.sh

```bash
# Update wrangler.toml with KV namespace IDs from .env.local
./shell/update-wrangler-kv-ids.sh
```

This script automatically updates the KV namespace IDs in `wrangler.toml` using the values from your `.env.local` file.

#### Using kv-put.sh

```bash
# Put data to KV
./shell/kv-put.sh <namespace> <key> <value>

# Examples
./shell/kv-put.sh USER_KV 1004 '{"name":"test"}'
./shell/kv-put.sh USER_KV 1004 "$(cat data/user.json)"
./shell/kv-put.sh MDOC_KV 1004 "$(cat data/mdoc.json)"
```

#### Using kv-get.sh

```bash
# Get data from KV
./shell/kv-get.sh <namespace> <key>

# Examples
./shell/kv-get.sh USER_KV 1004
./shell/kv-get.sh MDOC_KV 1004
./shell/kv-get.sh SESSION_KV session123
```

**Available namespaces**: `SESSION_KV`, `USER_KV`, `MDOC_KV`

## Local Development

### Run Locally

```bash
npm run dev
```

## Deployment

### Deploy to Cloudflare Workers

```bash
npm run deploy
```

## AWS Setup

This section describes the setup procedure for the au3te-ts-hono application in an AWS Lambda environment.

### Prerequisites

- Docker installed
- VSCode Dev Container available

### Setup Steps

#### Environment Variables Configuration

Copy the `.env.template` file to create a `.env` file and configure your AWS credentials.

```bash
cp .env.template .env
```

Set the following information in the `.env` file:

```bash
# AWS credentials
AWS_PROD_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY_ID
AWS_PROD_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_ACCESS_KEY
AWS_PROD_REGION=YOUR_AWS_REGION
AWS_ECR_REPOSITORY=YOUR_ECR_REPOSITORY

# LocalStack configuration (for local development)
LOCALSTACK_ACCESS_KEY_ID=test
LOCALSTACK_SECRET_ACCESS_KEY=test
LOCALSTACK_ENDPOINT_URL=http://localstack:4566
LOCALSTACK_REGION=ap-northeast-1
LOCALSTACK_ECR_REPOSITORY=
```

#### VSCode Dev Container Startup

Start the Dev Container in VSCode:

1. Open the project in VSCode
2. Open the command palette (Ctrl+Shift+P)
3. Select "Dev Containers: Reopen in Container"
4. Wait for the container to start

## LocalStack Deployment

When using LocalStack as a local development environment:

```bash
# Deploy to LocalStack
./shell/deployLocalStack.sh
```

After deployment, configure appropriate secret information in SecretsManager.

## AWS Deployment

When deploying to AWS production environment:

```bash
# Deploy to AWS production environment
./shell/deployAws.sh
```

For initial deployment or when cleanup is needed:

```bash
# Deploy with cleanup
./shell/deployAws.sh --clean
```

After deployment, configure appropriate secret information in AWS SecretsManager.

### Deploy Script Details

#### deployLocalStack.sh

Script for deploying to LocalStack environment:

- Cleanup of S3 bucket and SAM stack
- Build SAM application
- Deploy to LocalStack
- Upload CSS files to S3

#### deployAws.sh

Script for deploying to AWS production environment:

- `--clean` option for deployment with cleanup
- Cleanup of S3 bucket and SAM stack
- Build SAM application
- Deploy to AWS production environment
- Upload CSS files to S3

## Federation Configuration

For details on how to configure federation with external Identity Providers (OIDC/SAML 2.0), please refer to [Federation Configuration](docs/federation/FederationConfiguration.md).

## License

This project is licensed under the Apache License, Version 2.0.
