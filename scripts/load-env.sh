#!/bin/bash

# Script to convert .env file variables to environment variables
# Usage: ./env-to-vars.sh [path-to-env-file]
# If no path provided, looks for .env in current directory

ENV_FILE="${1:-.env}"

# Check if .env file exists
if [ ! -f "$ENV_FILE" ]; then
    echo "Error: .env file not found at $ENV_FILE"
    exit 1
fi

echo "Loading environment variables from $ENV_FILE..."

# Read .env file and export variables
while IFS= read -r line || [ -n "$line" ]; do
    # Skip empty lines and comments
    if [[ -z "$line" || "$line" =~ ^[[:space:]]*# ]]; then
        continue
    fi
    
    # Remove leading/trailing whitespace
    line=$(echo "$line" | xargs)
    
    # Check if line contains = sign
    if [[ "$line" =~ = ]]; then
        # Split on first = sign
        key=$(echo "$line" | cut -d= -f1)
        value=$(echo "$line" | cut -d= -f2-)
        
        # Remove quotes from value if present
        value=$(echo "$value" | sed 's/^"//; s/"$//')
        value=$(echo "$value" | sed "s/^'//; s/'$//")
        
        # Export the variable
        export "$key"="$value"
        echo "Exported: $key"
    fi
done < "$ENV_FILE"

echo "Environment variables loaded successfully!"
echo ""
echo "To use these variables in your current shell session, run:"
echo "source $0 $ENV_FILE"