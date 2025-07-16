#!/bin/bash

# Load environment variables from .env.local
if [ -f .env.local ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
fi

# Function to update wrangler.toml with KV namespace IDs
update_wrangler_kv_ids() {
    local wrangler_file="wrangler.toml"

    if [ ! -f "$wrangler_file" ]; then
        echo "Error: $wrangler_file not found"
        exit 1
    fi

    # Check if required environment variables are set
    if [ -z "$SESSION_KV_ID" ] || [ -z "$USER_KV_ID" ] || [ -z "$MDOC_KV_ID" ]; then
        echo "Error: Required KV namespace IDs not found in .env.local"
        echo "Please ensure .env.local contains:"
        echo "  SESSION_KV_ID=your_session_kv_id"
        echo "  USER_KV_ID=your_user_kv_id"
        echo "  MDOC_KV_ID=your_mdoc_kv_id"
        exit 1
    fi

    echo "Updating $wrangler_file with KV namespace IDs from .env.local..."

    # Create a temporary file
    local temp_file=$(mktemp)

    # Replace placeholders with actual IDs
    sed "s/SESSION_KV_ID_PLACEHOLDER/$SESSION_KV_ID/g" "$wrangler_file" | \
    sed "s/USER_KV_ID_PLACEHOLDER/$USER_KV_ID/g" | \
    sed "s/MDOC_KV_ID_PLACEHOLDER/$MDOC_KV_ID/g" > "$temp_file"

    # Replace original file
    mv "$temp_file" "$wrangler_file"

    echo "✅ Successfully updated $wrangler_file"
    echo "  SESSION_KV_ID: $SESSION_KV_ID"
    echo "  USER_KV_ID: $USER_KV_ID"
    echo "  MDOC_KV_ID: $MDOC_KV_ID"
}

# Main script
echo "🔄 Updating wrangler.toml KV namespace IDs..."
update_wrangler_kv_ids