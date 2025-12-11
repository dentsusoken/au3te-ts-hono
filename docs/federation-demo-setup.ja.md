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
    VCI_ISSUER_URL = <ISSUER_URL>
    VCI_CLIENT_ID = <ISSUER_CLIENT_ID>
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
           - "18080:8443"
        environment:
          KEYCLOAK_ADMIN: admin
          KEYCLOAK_ADMIN_PASSWORD: password
          KC_HTTPS_CERTIFICATE_FILE: /etc/x509/https/tls.crt
          KC_HTTPS_CERTIFICATE_KEY_FILE: /etc/x509/https/tls.key
        command:
          - start-dev
        volumes:
          - ./data:/opt/keycloak/data
          - ./certs/localhost.pem:/etc/x509/https/tls.crt
          - ./certs/localhost-key.pem:/etc/x509/https/tls.key
    ```

3. 以下のコマンドを実行して、自己証明書を生成します。

    ```bash
    mkdir -p certs
    mkcert -key-file certs/localhost-key.pem -cert-file certs/localhost.pem localhost
    ```

4. 以下のコマンドでKeycloakを起動します。

    ```bash
    docker compose up -d
    ```

5. Webブラウザで`https://localhost:18080`にアクセスします。
6. 「この接続ではプライバシーが保護されません」の画面が表示された場合は、画面左下の「詳細設定」をクリックし、下部に表示される「localhostにアクセスする」をクリックします。
7. Keycloakのサインイン画面で以下のIDとパスワードを入力します。

    ```plaintext
    ID: admin
    パスワード: password
    ```

8. 画面左のナビゲーションから「Manage realms」をクリックします。
9. Realmsの管理画面で「Create realm」をクリックします。
10. モーダルが表示されたら、「Drag a file here or browse to upload」の入力フィールドで事前準備でダウンロードした`realm-settings.json`を選択し、「Create」ボタンをクリックします。
11. Realmの作成完了後、「au3te-saml」が「Current realm」になっていることを確認します。もし「Current realm」になっていない場合は「au3te-saml」をクリックします。
12. 画面左のナビゲーションから「Clients」をクリックします。
13. クライアントの一覧から「au3te.federation.test」をクリックします。
14. 「Keys」タブを開き、「Signing keys config > Certificate」の「Import key」ボタンをクリックします。
15. 以下の通り入力し、「Import」ボタンをクリックします。

    ```plaintext
    Archive format: Certificate PEM
    Import file: 事前準備でダウンロードしたsaml-cert.pemファイル
    ```

16. 画面左のナビゲーションから「Users」をクリックします。
17. User管理画面の「Create new user」ボタンをクリックします。
18. 適当な値を入力し「Create」ボタンをクリックします。
19. 作成されたユーザの詳細画面に遷移したら「Credentials」タブを開き、「Set password」ボタンをクリックします。
20. 適当な値を入力し「Save」ボタンをクリックします。（「Temporary」のOn/Offは任意です）
21. 以上で設定は完了です。Keycloakを終了する時は以下のコマンドを実行します。

    ```bash
    docker compose down
    ```

### iOSシミュレータ設定

1. Keycloakを起動しておきます。
2. iOSシミュレータを起動します。（Walletをインストールする端末と同じ端末を起動してください。Walletのインストールと同時にすでに起動済みのものがあればその端末を利用します）
3. iOSシミュレータのSafariで`https://localhost:18080`にアクセスし、エラーが発生することを確認します。（モーダルが表示されたら「無視」をクリックします）
4. 以下のコマンドでmkcertの証明書ディレクトリをFinderで開きます。

    ```bash
    open "$(mkcert -CAROOT)" 
    ```

5. 開かれたディレクトリにある`rootCA.pem`をiOSシミュレータにドラッグ&ドロップします。
6. 再度iOSシミュレータのSafariで`https://localhost:18080`にアクセスし、Keycloakの画面が開くことを確認します。
