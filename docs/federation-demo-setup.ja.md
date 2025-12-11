# フェデレーションデモセットアップ手順

## SAML2.0

### 事前準備

#### mkcertのインストール

mkcertがインストールされていない場合は、以下の手順でインストールしてください。

1. macOSの場合、以下のコマンドを実行してmkcertをインストールします。

    ```bash
    brew install mkcert
    ```

2. Root CAを設定します。

    ```bash
    mkcert -install
    ```

#### ファイルのダウンロード

以下のファイルを事前にダウンロードしておいてください。

1. [realm-settings.json](./resource/realm-settings.json)をダウンロード
2. [saml-cert.pem](./resource/saml-cert.pem)をダウンロード

### Wallet設定

1. Issuerの向け先を変更します。

    ```plaintext
    VCI_ISSUER_URL = https:/$()/localhost:8787
    ```

### Keycloak設定

1. 任意の作業ディレクトリを作成します。（後続の手順は作成したディレクトリで行います）
2. 以下の`docker-compose.yml`ファイルを作成し、以下の内容をコピー＆ペーストします。

    ```yaml
    services:
      keycloak:
        image: quay.io/keycloak/keycloak:26.3
        container_name: keycloak
        tty: true
        stdin_open: true
        ports:
           - "18080:8080"
        environment:
          KEYCLOAK_ADMIN: admin
          KEYCLOAK_ADMIN_PASSWORD: password
        command:
          - start-dev
        volumes:
          - ./data:/opt/keycloak/data
    ```

3. 以下のコマンドでKeycloakを起動します。

    ```bash
    docker compose up -d
    ```

4. Webブラウザでhttp://localhost:18080 にアクセスします。
5. Keycloakのサインイン画面で以下のIDとパスワードを入力します。

    ```plaintext
    ID: admin
    パスワード: password
    ```

6. 画面左のナビゲーションから「Manage realms」をクリックします。
7. Realmsの管理画面で「Create realm」をクリックします。
8. モーダルが表示されたら、「Drag a file here or browse to upload」の入力フィールドで事前準備でダウンロードした`realm-settings.json`を選択し、「Create」ボタンをクリックします。
9. Realmの作成完了後、「au3te-saml」が「Current realm」になっていることを確認します。もし「Current realm」になっていない場合は「au3te-saml」をクリックします。
10. 画面左のナビゲーションから「Clients」をクリックします。
11. クライアントの一覧から「au3te.federation.test」をクリックします。
12. 「Keys」タブを開き、「Signing keys config > Certificate」の「Import key」ボタンをクリックします。
13. 以下の通り入力し、「Import」ボタンをクリックします。

    ```plaintext
    Archive format: Certificate PEM
    Import file: 事前準備でダウンロードしたsaml-cert.pemファイル
    ```

14. 画面左のナビゲーションから「Users」をクリックします。
15. User管理画面の「Create new user」ボタンをクリックします。
16. 適当な値を入力し「Create」ボタンをクリックします。
17. 作成されたユーザの詳細画面に遷移したら「Credentials」タブを開き、「Set password」ボタンをクリックします。
18. 適当な値を入力し「Save」ボタンをクリックします。（「Temporary」のOn/Offは任意です）
19. 以上で設定は完了です。Keycloakを終了する時は以下のコマンドを実行します。

    ```bash
    docker compose down
    ```

### iOSシミュレータ設定

1. iOSシミュレータを起動します。（Walletをインストールする端末と同じ端末を起動してください。Walletのインストールと同時にすでに起動済みのものがあればその端末を利用します）
2. 以下のコマンドでmkcertの証明書ディレクトリをFinderで開きます。

    ```bash
    open "$(mkcert -CAROOT)" 
    ```

3. 開かれたディレクトリにある`rootCA.pem`をiOSシミュレータにドラッグ&ドロップします。

### Issuer起動

1. 以下のコマンドでリポジトリをクローンして下さい。

    ```bash
    git clone -b saml-demo https://github.com/dentsusoken/au3te-ts-hono.git
    ```

    すでにクローン済みの場合は以下のコマンドで最新化&ブランチ変更

    ```bash
    git fetch origin
    git checkout saml-demo
    ```

2. リポジトリのルートディレクトに移動。
3. 以下のコマンドを実行して自己証明書を作成。

   ```bash
    mkdir -p certs
    mkcert -key-file certs/localhost-key.pem -cert-file certs/localhost.pem localhost
   ```

4. `.dev.vars`ファイルを作成し適切な値を設定。
5. 依存関係をインストール

    ```bash
    npm install
    ```

6. 以下のコマンドでローカルサーバを起動。

    ```bash
    npm run dev -- --local-protocol="https" --https-key-path="./certs/localhost-key.pem" --https-cert-path="./certs/localhost.pem"
    ```

### VC発行

1. XCodeからiOSシミュレータにWalletアプリをインストール。
2. アプリが起動したら「VC発行」 > 「mDL」を選択。
3. Authleteの認可画面が表示されたら「Keycloak SAML Federation」をクリック。
4. 「送信しようとしている...」というアラートが表示されたら「送信」をクリック。
5. Keycloakの認証画面が表示されたらKeycloakの設定手順で作成したユーザの認証情報を入力。
6. Authleteの画面に戻ってきたら、「Authorize」をクリック。
