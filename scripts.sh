#!/bin/bash
set -e

ENV_FILE=".env"
COMPOSE_FILE="docker-compose.yaml"
BACKUP_FILE="docker-compose.yaml.bak"

# Check if files exist
if [[ ! -f "$ENV_FILE" ]]; then
  echo "❌ $ENV_FILE not found!"
  exit 1
fi

if [[ ! -f "$COMPOSE_FILE" ]]; then
  echo "❌ $COMPOSE_FILE not found!"
  exit 1
fi

# Backup original compose file
cp "$COMPOSE_FILE" "$BACKUP_FILE"
echo "📦 Backup created at $BACKUP_FILE"

# Read .env file line by line
while IFS='=' read -r key value; do
  # Skip empty lines and comments
  [[ -z "$key" || "$key" =~ ^# ]] && continue

  # Trim whitespace
  key=$(echo "$key" | xargs)
  value=$(echo "$value" | xargs)

  # Remove surrounding quotes
  value=$(echo "$value" | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")

  # Escape special characters for sed
  safe_value=$(printf '%s\n' "$value" | sed -e 's/[\/&]/\\&/g')

  # Check if key exists in environment section
  if grep -qE "^\s*-\s*$key=" "$COMPOSE_FILE"; then
    # Replace the existing line
    sed -i.bak -E "s|^\s*-\s*$key=.*|      - $key=$safe_value|" "$COMPOSE_FILE"
    echo "🔄 Updated $key"
  fi
done < "$ENV_FILE"

rm -rf "$BACKUP_FILE" 

echo "✅ Environment variables updated successfully in $COMPOSE_FILE"
