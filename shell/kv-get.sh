#!/bin/bash

# Load environment variables from .env.local
if [ -f .env.local ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
fi

# Function to get data
kv_get() {
    local namespace_name=$1
    local key=$2
    local namespace_id="${namespace_name}_ID"

    if [ -z "${!namespace_id}" ]; then
        echo "Error: Namespace ID not found for $namespace_name"
        echo "Please check your .env.local file"
        exit 1
    fi

    npx wrangler kv key get --namespace-id="${!namespace_id}" $key
}

# Main script
if [ $# -lt 2 ]; then
    echo "Usage: $0 <namespace> <key>"
    echo "Example: $0 USER_KV 1004"
    echo ""
    echo "Available namespaces: SESSION_KV, USER_KV, MDOC_KV"
    echo "Make sure your .env.local file contains the namespace IDs:"
    echo "  SESSION_KV_ID=your_session_kv_id"
    echo "  USER_KV_ID=your_user_kv_id"
    echo "  MDOC_KV_ID=your_mdoc_kv_id"
    exit 1
fi

kv_get $1 $2