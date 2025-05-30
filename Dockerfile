# Node.jsのベースイメージを使用
FROM node:20-slim

# 必要なツールのインストール
RUN apt-get update && apt-get install -y \
    zip \
    curl \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# AWS CLIのインストール
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && \
    ./aws/install && \
    rm -rf aws awscliv2.zip

# 環境変数のPATHを更新
ENV PATH="/root/.local/bin:$PATH"

# 作業ディレクトリの設定
WORKDIR /app

# パッケージファイルのコピー
COPY package*.json ./

# 依存関係のインストール
RUN npm install

# ソースコードのコピー
COPY . .

RUN sh ./shell/setupLinks.sh

# アプリケーションのビルドとzip化
RUN npm run build && \
    cd dist && \
    zip -j ../lambda.zip index.js && \
    cd .. && \
    ls -la lambda.zip

# スクリプトに実行権限を付与
RUN chmod +x /app/shell/setupAws.sh

# セットアップスクリプトの実行
CMD ["sh","/app/shell/setupAws.sh"]