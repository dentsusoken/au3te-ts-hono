#!/bin/bash

# デバッグ情報
echo "Current directory: $(pwd)"
echo "Listing zip files:"
ls -la *.zip

echo "Checking if DynamoDB table exists: $DYNAMODB_TABLE"
TABLE_EXISTS=$(aws dynamodb describe-table --table-name "$DYNAMODB_TABLE" --region $AWS_DEFAULT_REGION 2>/dev/null)

# DynamoDBテーブルの作成または、更新
# if [ -z "$TABLE_EXISTS" ];then
#     echo "Creating DynamoDB table: $DYNAMODB_TABLE"
#     aws dynamodb create-table \
#         --table-name "$DYNAMODB_TABLE" \
#         --attribute-definitions \
#             AttributeName=key,AttributeType=S \
#         --key-schema \
#             AttributeName=key,KeyType=HASH \
#         --provisioned-throughput \
#             ReadCapacityUnits=5,WriteCapacityUnits=5 \
#         --region $AWS_DEFAULT_REGION

#     if [ $? -ne 0 ];then
#         echo "Failed to create DynamoDB table"
#         exit 1
#     fi

#     echo "DynamoDB table created successfully"
# else
#     echo "Updating DynamoDB table throughput"
#     aws dynamodb update-table \
#         --table-name "$DYNAMODB_TABLE" \
#         --provisioned-throughput \
#             ReadCapacityUnits=10,WriteCapacityUnits=10 \
#         --region $AWS_DEFAULT_REGION

#     if [ $? -ne 0 ]; then
#         echo "Failed to update DynamoDB table"
#         exit 1
#     fi

#     echo "DynamoDB table updated successfully"
# fi

# IAMロールの取得
# ROLE_NAME="tw-lambda"
# ROLE_ARN=$(aws iam get-role --role-name $ROLE_NAME --query 'Role.Arn' --output text)
# ROLE_ARN="arn:aws:iam::577638367706:role/tw-lambda"

# Lambda関数の作成または更新
echo "Checking if Lambda function exists: issuer"
LAMBDA_EXISTS=$(aws lambda get-function --function-name issuer --region $AWS_DEFAULT_REGION 2>/dev/null)

if [ $? -ne 0 ]; then
    echo "Creating Lambda function: issuer"
    LAMBDA_ARN=$(aws lambda create-function \
        --function-name issuer \
        --runtime nodejs20.x \
        --handler index.handler \
        --timeout 600 \
        --zip-file fileb://lambda.zip \
        --role $LAMBDA_ROLE_NAME \
        --output text)

    # エラーチェック
    if [ $? -ne 0 ]; then
        echo "Failed to create Lambda function"
        exit 1
    fi

    echo "Lambda function created successfully"
else
    echo "Updating Lambda function: issuer"
    aws lambda update-function-code \
        --function-name issuer \
        --zip-file fileb://lambda.zip \
        --region $AWS_DEFAULT_REGION

    if [ $? -ne 0 ];then
        echo "Failed to update Lambda function"
        exit 1
    fi

    LAMBDA_ARN=$(aws lambda get-function --function-name issuer --query 'Configuration.FunctionArn' --output text --region $AWS_DEFAULT_REGION)
    echo "Lambda function updated successfully"
fi

# API Gatewayの作成または、更新
echo "Checking if API Gateway exists: issuer"
API_ID=$(aws apigateway get-rest-apis --query "items[?name=='issuer'].id" --output text --region $AWS_DEFAULT_REGION)

if [ -z "$API_ID" ];then
    echo "Creating API Gateway: issuer"
    API_ID=$(aws apigateway create-rest-api \
        --name "issuer" \
        --query "id" \
        --output text \
        --region $AWS_DEFAULT_REGION)

    if [ -z "$API_ID" ]; then
        echo "Failed to create API Gateway"
        exit 1
    fi

    echo "Created API Gateway with ID: $API_ID"
else
    echo "API Gateway already exists: issuer"
    aws apigateway update-stage \
        --rest-api-id "$API_ID" \
        --stage-name "dev" \
        --patch-operations op=replace,path=/description,value="Updated stage description" \
        --region $AWS_DEFAULT_REGION

    if [ $? -ne 0 ];then
        echo "Failed to update API Gateway function"
        exit 1
    fi

    echo "Updated API Gateway with ID: $API_ID"
fi

aws lambda remove-permission \
    --function-name "issuer" \
    --statement-id "apigateway-permission" \
    --region $AWS_DEFAULT_REGION

aws lambda add-permission \
    --function-name issuer \
    --statement-id apigateway-permission \
    --action lambda:InvokeFunction \
    --principal apigateway.amazonaws.com \
    --source-arn "arn:aws:execute-api:$AWS_DEFAULT_REGION:$(aws sts get-caller-identity --query 'Account' --output text):$API_ID/*/*/*" \
    --region $AWS_DEFAULT_REGION

PROXY_RESOURCE_ID=$(aws apigateway get-resources \
    --rest-api-id "$API_ID" \
    --query "items[?path=='/{proxy+}'].id" \
    --output text \
    --region $AWS_DEFAULT_REGION)

aws apigateway delete-resource \
    --rest-api-id "$API_ID" \
    --resource-id "$PROXY_RESOURCE_ID" \
    --region $AWS_DEFAULT_REGION

# リソースIDの確認
ROOT_RESOURCE_ID=$(aws apigateway get-resources \
    --rest-api-id "$API_ID" \
    --query "items[0].id" \
    --output text \
    --region $AWS_DEFAULT_REGION)

# プロキシ統合のための{proxy+}リソースを作成
PROXY_RESOURCE_ID=$(aws apigateway create-resource \
    --rest-api-id "$API_ID" \
    --parent-id "$ROOT_RESOURCE_ID" \
    --path-part "{proxy+}" \
    --query "id" \
    --output text \
    --region $AWS_DEFAULT_REGION)

# プロキシリソースにANYメソッドを設定
aws apigateway put-method \
    --rest-api-id "$API_ID" \
    --resource-id "$PROXY_RESOURCE_ID" \
    --http-method ANY \
    --authorization-type NONE \
    --region $AWS_DEFAULT_REGION

# Lambda関数との統合
aws apigateway put-integration \
    --rest-api-id "$API_ID" \
    --resource-id "$PROXY_RESOURCE_ID" \
    --http-method ANY \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri arn:aws:apigateway:$AWS_DEFAULT_REGION:lambda:path/2015-03-31/functions/$LAMBDA_ARN/invocations \
    --region $AWS_DEFAULT_REGION

DELETE_METHOD=$(aws apigateway get-method \
    --rest-api-id "$API_ID" \
    --resource-id "$ROOT_RESOURCE_ID" \
    --http-method ANY \
    --region $AWS_DEFAULT_REGION)

aws apigateway delete-method \
    --rest-api-id "$API_ID" \
    --resource-id "$ROOT_RESOURCE_ID" \
    --http-method ANY \
    --region $AWS_DEFAULT_REGION

# ルートパスにもANYメソッドを設定
aws apigateway put-method \
    --rest-api-id "$API_ID" \
    --resource-id "$ROOT_RESOURCE_ID" \
    --http-method ANY \
    --authorization-type NONE \
    --region $AWS_DEFAULT_REGION

# ルートパスのLambda関数との統合
aws apigateway put-integration \
    --rest-api-id "$API_ID" \
    --resource-id "$ROOT_RESOURCE_ID" \
    --http-method ANY \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri arn:aws:apigateway:$AWS_DEFAULT_REGION:lambda:path/2015-03-31/functions/$LAMBDA_ARN/invocations \
    --region $AWS_DEFAULT_REGION

# APIのデプロイ
aws apigateway create-deployment \
    --rest-api-id "$API_ID" \
    --stage-name dev \
    --region $AWS_DEFAULT_REGION

echo "Setup completed. API Gateway endpoint: https://$API_ID.execute-api.$AWS_DEFAULT_REGION.amazonaws.com/dev/" 