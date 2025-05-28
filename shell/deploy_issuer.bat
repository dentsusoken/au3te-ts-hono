@echo off
setlocal enabledelayedexpansion

:: エラーハンドリング関数
:handle_error
echo エラーが発生しました: %~1
call :cleanup
exit /b 1

:: クリーンアップ関数
:cleanup
echo クリーンアップを実行します...
if exist "%BUILD_DIR%" (
    rmdir /s /q "%BUILD_DIR%" || echo 警告: buildディレクトリの削除に失敗しました
)
exit /b 0

echo Issuerのデプロイを開始します。
echo Cloudflareにログインしていない場合、処理の途中でログインを求められます。
echo 続行するにはEnterキーを押してください。
pause > nul

:: 各モジュールのディレクトリを設定
set "BUILD_DIR=build"
set "CORE_DIR=%BUILD_DIR%\oid4vc-core"
set "COMMON_DIR=%BUILD_DIR%\au3te-ts-common"
set "BASE_DIR=%BUILD_DIR%\au3te-ts-base"

:: build ディレクトリの存在確認と作成
if not exist "%BUILD_DIR%" (
    mkdir "%BUILD_DIR%" || (
        echo buildディレクトリの作成に失敗しました
        call :handle_error "buildディレクトリの作成に失敗"
    )
)

:: モジュールをクローン
cd "%BUILD_DIR%" || (
    call :handle_error "buildディレクトリへの移動に失敗"
)

echo oid4vc-coreをクローンしています...
git clone https://github.com/dentsusoken/oid4vc-core || (
    call :handle_error "oid4vc-coreのクローンに失敗"
)

echo au3te-ts-commonをクローンしています...
git clone https://github.com/dentsusoken/au3te-ts-common || (
    call :handle_error "au3te-ts-commonのクローンに失敗"
)

echo au3te-ts-baseをクローンしています...
git clone https://github.com/dentsusoken/au3te-ts-base || (
    call :handle_error "au3te-ts-baseのクローンに失敗"
)

:: モジュールをビルド
echo oid4vc-coreをビルドしています...
cd "%CORE_DIR%" || (
    call :handle_error "oid4vc-coreディレクトリへの移動に失敗"
)
call npm install || (
    call :handle_error "oid4vc-coreのnpm installに失敗"
)
call npm run build || (
    call :handle_error "oid4vc-coreのビルドに失敗"
)
call npm link || (
    call :handle_error "oid4vc-coreのnpm linkに失敗"
)

echo au3te-ts-commonをビルドしています...
cd "%COMMON_DIR%" || (
    call :handle_error "au3te-ts-commonディレクトリへの移動に失敗"
)
call npm install || (
    call :handle_error "au3te-ts-commonのnpm installに失敗"
)
call npm link oid4vc-core || (
    call :handle_error "oid4vc-coreのリンクに失敗"
)
call npm run build || (
    call :handle_error "au3te-ts-commonのビルドに失敗"
)
call npm link || (
    call :handle_error "au3te-ts-commonのnpm linkに失敗"
)

echo au3te-ts-baseをビルドしています...
cd "%BASE_DIR%" || (
    call :handle_error "au3te-ts-baseディレクトリへの移動に失敗"
)
call npm install || (
    call :handle_error "au3te-ts-baseのnpm installに失敗"
)
call npm link oid4vc-core au3te-ts-common || (
    call :handle_error "依存モジュールのリンクに失敗"
)
call npm run build || (
    call :handle_error "au3te-ts-baseのビルドに失敗"
)

:: デプロイ
echo Honoアプリケーションをデプロイしています...
cd .. || (
    call :handle_error "Honoディレクトリへの移動に失敗"
)
call npm install || (
    call :handle_error "Honoアプリケーションのnpm installに失敗"
)
call npm link oid4vc-core au3te-ts-common au3te-ts-base || (
    call :handle_error "依存モジュールのリンクに失敗"
)
call npm i -g wrangler || (
    call :handle_error "wranglerのインストールに失敗"
)
call npx wrangler login || (
    call :handle_error "Cloudflareへのログインに失敗"
)
call npm run deploy || (
    call :handle_error "デプロイに失敗"
)

echo Issuerのデプロイが完了しました。

exit /b 0 