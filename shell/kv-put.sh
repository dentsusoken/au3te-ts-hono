#!/bin/bash

# Load environment variables from .env.local
if [ -f .env.local ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
fi

# Function to put data
kv_put() {
    local namespace_name=$1
    local key=$2
    local value=$3
    local namespace_id="${namespace_name}_ID"

    if [ -z "${!namespace_id}" ]; then
        echo "Error: Namespace ID not found for $namespace_name"
        echo "Please check your .env.local file"
        exit 1
    fi

    npx wrangler kv key put --namespace-id="${!namespace_id}" $key --value="$value"
}

# Main script
if [ $# -lt 3 ]; then
    echo "Usage: $0 <namespace> <key> <value>"
    echo "Example: $0 USER_KV 1004 '{\"name\":\"test\"}'"
    echo ""
    echo "Available namespaces: SESSION_KV, USER_KV, MDOC_KV"
    echo "Make sure your .env.local file contains the namespace IDs:"
    echo "  SESSION_KV_ID=your_session_kv_id"
    echo "  USER_KV_ID=your_user_kv_id"
    echo "  MDOC_KV_ID=your_mdoc_kv_id"
    exit 1
fi

kv_put $1 $2 "$3"