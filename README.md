# au3te-ts-hono

A Hono-based implementation of the au3te-ts server for OAuth 2.0 and OpenID Connect operations.

## Table of Contents

- [Setup](#setup)
- [Local Development](#local-development)
- [Deployment](#deployment)
- [AWS Lambda Emulation](#aws-lambda-emulation)
- [AWS SAM + LocalStack](#aws-sam--localstack)
- [AWS Lambda Deployment](#aws-lambda-deployment)

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

#### Clone Repository

```bash
git clone https://github.com/dentsusoken/au3te-ts-hono
cd au3te-ts-hono
```

#### Install Dependencies

```bash
npm install
```

### Cloudflare Setup

#### Create .dev.vars

Create a `.dev.vars` file in the project root:

```bash
API_BASE_URL=https://ja.authlete.com
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

2. Set environment variables with your KV IDs:

```bash
export SESSION_KV_ID=your_session_kv_id_here
export USER_KV_ID=your_user_kv_id_here
export MDOC_KV_ID=your_mdoc_kv_id_here
```

Or create a `.env.local` file:

```bash
SESSION_KV_ID=your_session_kv_id_here
USER_KV_ID=your_user_kv_id_here
MDOC_KV_ID=your_mdoc_kv_id_here
```

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

## AWS Lambda Emulation

### Prerequisites

1. Clone or copy the following repositories into the `./build` directory:

   - [`oid4vc-core`](https://github.com/dentsusoken/oid4vc-core.git)
   - [`au3te-ts-common`](https://github.com/dentsusoken/au3te-ts-common.git)
   - [`au3te-ts-base`](https://github.com/dentsusoken/au3te-ts-base.git)

   ```bash
   # If cloning new repositories
   cd build
   git clone https://github.com/dentsusoken/oid4vc-core.git
   git clone https://github.com/dentsusoken/au3te-ts-common.git
   git clone https://github.com/dentsusoken/au3te-ts-base.git

   # Or if copying existing local development repositories
   cp -r /path/to/local/oid4vc-core ./build/
   cp -r /path/to/local/au3te-ts-common ./build/
   cp -r /path/to/local/au3te-ts-base ./build/
   ```

2. Create `.env` file:

   ```bash
   API_BASE_URL=https://nextdev-api.authlete.net
   API_VERSION=V3
   API_KEY=YOUR_API_KEY
   ACCESS_TOKEN=YOUR_ACCESS_TOKEN
   DEPLOY_ENV=local
   ```

3. Build and start the container:

   ```bash
   docker-compose up --build
   ```

## AWS SAM + LocalStack

### Setup

1. Build with SAM CLI:

   ```bash
   sam build
   ```

2. Build and start the container:

   ```bash
   docker-compose up --build
   ```

3. Launch local API with SAM CLI:

   ```bash
   sam local start-api --template template.yml --docker-network localstack-net
   ```

## AWS Lambda Deployment

### Prerequisites

1. Clone or copy the following repositories into the `./build` directory:

   - [`oid4vc-core`](https://github.com/dentsusoken/oid4vc-core.git)
   - [`au3te-ts-common`](https://github.com/dentsusoken/au3te-ts-common.git)
   - [`au3te-ts-base`](https://github.com/dentsusoken/au3te-ts-base.git)

   ```bash
   # If cloning new repositories
   cd build
   git clone https://github.com/dentsusoken/oid4vc-core.git
   git clone https://github.com/dentsusoken/au3te-ts-common.git
   git clone https://github.com/dentsusoken/au3te-ts-base.git

   # Or if copying existing local development repositories
   cp -r /path/to/local/oid4vc-core ./build/
   cp -r /path/to/local/au3te-ts-common ./build/
   cp -r /path/to/local/au3te-ts-base ./build/
   ```

### IAM Role Configuration

Add the following to your IAM role:

- AWSLambdaBasicExecutionRole
- AWSLambdaDynamoDBExecutionRole
- dynamodb:GetItem
- SecretsManagerReadWrite

### Environment Variables

Set environment variables for SecretsManager:

```bash
API_BASE_URL=YOUR_API_BASE_URL
API_VERSION=YOUR_API_VERSION
API_KEY=YOUR_API_KEY
ACCESS_TOKEN=YOUR_ACCESS_TOKEN
DYNAMODB_TABLE_ISSUER=ISSUER_SESSION_DYNAMO
```

Create `.env` file:

```bash
AWS_DEFAULT_REGION=YOUR_AWS_DEFAULT_REGION
LAMBDA_ROLE_NAME=YOUR_LAMBDA_ROLE_NAME
DYNAMODB_TABLE_ISSUER=ISSUER_SESSION_DYNAMO
AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_ACCESS_KEY
```

### Build and Deploy

1. Build the Docker image:

   ```bash
   docker build -t issuer:latest .
   ```

2. Run the container:

   ```bash
   docker run --env-file ./.env issuer:latest
   ```

## License

This project is licensed under the Apache License, Version 2.0.
