# au3te-ts-hono

## How to build

### Create .dev.vars

API_BASE_URL = "YOUR_API_BASE_URL"
API_VERSION = "YOUR_API_VERSION"
API_KEY = "YOUR_API_KEY"
ACCESS_TOKEN = "YOUR_ACCESS_TOKEN"

### Install dependencies

npm install

### Run locally

npm run dev

### Deploy

npm run deploy

## How to emulate AWS Lambda (localstack)

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

2. Create .env
    ```bash
    API_BASE_URL=YOUR_API_BASE_URL
    API_VERSION=YOUR_API_VERSION
    API_KEY=YOUR_API_KEY
    ACCESS_TOKEN=YOUR_ACCESS_TOKEN
    DEPLOY_ENV=local
    ```

3. Rebuilding the Image and Starting the Container:
   ```bash
   docker-compose up --build
   ```

## How to deploy AWS Lambda

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

2. IAM Role Configuration:

   **Add to the IAM role you are using**

   * AWSLambdaBasicExecutionRole
   * AWSLambdaDynamoDBExecutionRole
   * dynamodb:GetItem
   * SecretsManagerReadWrite

3. Set Environment Variables for SecretsManager:
   ```bash
   API_BASE_URL=YOUR_API_BASE_URL
   API_VERSION=YOUR_API_VERSION
   API_KEY=YOUR_API_KEY
   ACCESS_TOKEN=YOUR_ACCESS_TOKEN
   AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY_ID
   AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_ACCESS_KEY
   AWS_DEFAULT_REGION=YOUR_AWS_DEFAULT_REGION
   LAMBDA_ROLE_NAME=YOUR_LAMBDA_ROLE_NAME
   ```

4. Build:
   ```bash
   docker build -t issuer:latest .
   ```

5. Run:
   ```bash
   docker run --env-file ./.env issuer:latest
   ```