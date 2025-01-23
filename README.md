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

## How to emulate AWS Lambda

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

2. Create .env
    ```bash
    API_BASE_URL=YOUR_API_BASE_URL
    API_VERSION=YOUR_API_VERSION
    API_KEY=YOUR_API_KEY
    ACCESS_TOKEN=YOUR_ACCESS_TOKEN
    ```

3. Start the Dev Container:
   ```bash
   # Open in VS Code and click "Reopen in Container"
   # Or use the command palette: F1 -> "Dev Containers: Rebuild and Reopen in Container"
   ```

4. Inside the container, run the setup script:
   ```bash
   ./shell/setupLinks.sh
   ```

5. Start the Lambda emulator:
   ```bash
   npm run emulate:lambda
   ```