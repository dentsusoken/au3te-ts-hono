#!/bin/bash

# エラーハンドリング関数
handle_error() {
    echo "エラーが発生しました: $1"
    # クリーンアップ処理を実行
    cleanup
    exit 1
}

# クリーンアップ関数
cleanup() {
    echo "クリーンアップを実行します..."
    if [ -d "$BUILD_DIR" ]; then
        rm -rf "$BUILD_DIR" || echo "警告: buildディレクトリの削除に失敗しました"
    fi
}

# エラー発生時に handle_error 関数を呼び出す
set -e
trap 'handle_error "$BASH_COMMAND"' ERR
# スクリプト終了時に cleanup を実行
trap cleanup EXIT

echo "Issuerのデプロイを開始します。"
echo "Cloudflareにログインしていない場合、処理の途中でログインを求められます。"
echo "続行するにはEnterキーを押してください。"
read -p ""

# 各モジュールのディレクトリを設定
BUILD_DIR=build
CORE_DIR=$BUILD_DIR/oid4vc-core
COMMON_DIR=$BUILD_DIR/au3te-ts-common
BASE_DIR=$BUILD_DIR/au3te-ts-base

# build ディレクトリの存在確認と作成
if [ ! -d "$BUILD_DIR" ]; then
    mkdir -p "$BUILD_DIR" || handle_error "buildディレクトリの作成に失敗しました"
fi

# モジュールをクローン
cd $BUILD_DIR || handle_error "buildディレクトリへの移動に失敗しました"

echo "oid4vc-coreをクローンしています..."
git clone https://github.com/dentsusoken/oid4vc-core || handle_error "oid4vc-coreのクローンに失敗しました"

echo "au3te-ts-commonをクローンしています..."
git clone https://github.com/dentsusoken/au3te-ts-common || handle_error "au3te-ts-commonのクローンに失敗しました"

echo "au3te-ts-baseをクローンしています..."
git clone https://github.com/dentsusoken/au3te-ts-base || handle_error "au3te-ts-baseのクローンに失敗しました"

# モジュールをビルド
echo "oid4vc-coreをビルドしています..."
cd $CORE_DIR || handle_error "oid4vc-coreディレクトリへの移動に失敗しました"
npm install || handle_error "oid4vc-coreのnpm installに失敗しました"
npm run build || handle_error "oid4vc-coreのビルドに失敗しました"
npm link || handle_error "oid4vc-coreのnpm linkに失敗しました"

echo "au3te-ts-commonをビルドしています..."
cd $COMMON_DIR || handle_error "au3te-ts-commonディレクトリへの移動に失敗しました"
npm install || handle_error "au3te-ts-commonのnpm installに失敗しました"
npm link oid4vc-core || handle_error "oid4vc-coreのリンクに失敗しました"
npm run build || handle_error "au3te-ts-commonのビルドに失敗しました"
npm link || handle_error "au3te-ts-commonのnpm linkに失敗しました"

echo "au3te-ts-baseをビルドしています..."
cd $BASE_DIR || handle_error "au3te-ts-baseディレクトリへの移動に失敗しました"
npm install || handle_error "au3te-ts-baseのnpm installに失敗しました"
npm link oid4vc-core au3te-ts-common || handle_error "依存モジュールのリンクに失敗しました"
npm run build || handle_error "au3te-ts-baseのビルドに失敗しました"

# デプロイ
echo "Honoアプリケーションをデプロイしています..."
cd .. || handle_error "Honoディレクトリへの移動に失敗しました"
npm install || handle_error "Honoアプリケーションのnpm installに失敗しました"
npm link oid4vc-core au3te-ts-common au3te-ts-base || handle_error "依存モジュールのリンクに失敗しました"
npm i -g wrangler || handle_error "wranglerのインストールに失敗しました"
npx wrangler login || handle_error "Cloudflareへのログインに失敗しました"
npm run deploy || handle_error "デプロイに失敗しました"

echo "Issuerのデプロイが完了しました。"