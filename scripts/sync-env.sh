#!/bin/bash

# ===============================================================
# 🔄 Auto Env Sync Script for GitHub Actions
# Description: Syncs .env.production to GitHub secrets and CI/CD.
# Author: Sabbir (ST Sabbir)
# ===============================================================

set -euo pipefail

ENV_FILE=".env.production"
CI_FILE=".github/workflows/ci.yaml"
CD_FILE=".github/workflows/cd.yaml"

# Static values
DOCKER_USERNAME="softvence"
EMAIL="softvenceomega@gmail.com"

# Get values from package.json
PACKAGE_NAME=$(node -p "require('./package.json').name || 'empty_name'")
PACKAGE_VERSION=$(node -p "require('./package.json').version || '0.0.1'")

IMAGE_TAG="${DOCKER_USERNAME}/${PACKAGE_NAME}:${PACKAGE_VERSION}"

# Color codes
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
BLUE="\033[0;34m"
RESET="\033[0m"

# Check if .env file exists
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}❌ Error: $ENV_FILE file not found.${RESET}"
    exit 1
fi

echo -e "${BLUE}🔧 Updating dynamic values in $ENV_FILE...${RESET}"
TMP_ENV=$(mktemp)

while IFS= read -r line || [ -n "$line" ]; do
    if [[ -z "$line" || "$line" =~ ^[[:space:]]*# ]]; then
        echo "$line" >> "$TMP_ENV"
        continue
    fi

    case "$line" in
        DOCKER_USERNAME=*) echo "DOCKER_USERNAME=$DOCKER_USERNAME" >> "$TMP_ENV" ;;
        PACKAGE_NAME=*) echo "PACKAGE_NAME=$PACKAGE_NAME" >> "$TMP_ENV" ;;
        PACKAGE_VERSION=*) echo "PACKAGE_VERSION=$PACKAGE_VERSION" >> "$TMP_ENV" ;;
        EMAIL=*) echo "EMAIL=$EMAIL" >> "$TMP_ENV" ;;
        IMAGE_TAG=*) echo "IMAGE_TAG=$IMAGE_TAG" >> "$TMP_ENV" ;;
        MAIL_PASS=*)
            value="${line#MAIL_PASS=}"
            value="${value%\"}"
            value="${value#\"}"
            echo "MAIL_PASS=\"$value\"" >> "$TMP_ENV"
            ;;
        *) echo "$line" >> "$TMP_ENV" ;;
    esac
done < "$ENV_FILE"

mv "$TMP_ENV" "$ENV_FILE"

echo -e "${GREEN}✅ Updated .env.production successfully.${RESET}"

# ===============================================================
# 🔐 Upload to GitHub Secrets
# ===============================================================

if ! command -v gh &>/dev/null; then
    echo -e "${RED}❌ GitHub CLI not installed. Please install it first.${RESET}"
    exit 1
fi

if ! gh auth status &>/dev/null; then
    echo -e "${RED}❌ Not authenticated with GitHub CLI. Run: gh auth login${RESET}"
    exit 1
fi

echo -e "${BLUE}🚀 Uploading secrets to GitHub...${RESET}"

while IFS= read -r line || [ -n "$line" ]; do
    [[ -z "$line" || "$line" =~ ^[[:space:]]*# ]] && continue
    if [[ "$line" =~ ^([A-Z_][A-Z0-9_]*)=(.*)$ ]]; then
        key="${BASH_REMATCH[1]}"
        value="${BASH_REMATCH[2]}"
        value="${value%\"}"
        value="${value#\"}"

        echo -e "${YELLOW}Setting secret:${RESET} ${BLUE}$key${RESET}"
        gh secret set "$key" --body "$value" >/dev/null \
            && echo -e "${GREEN}✅ $key uploaded.${RESET}" \
            || echo -e "${RED}⚠️ Failed to upload $key${RESET}"
    fi
done < "$ENV_FILE"

# ===============================================================
# 🧩 Update GitHub Action Workflows (env block injection)
# ===============================================================

update_workflow_env() {
    local file="$1"
    if [ ! -f "$file" ]; then
        echo -e "${YELLOW}⚠️ Skipping missing file: $file${RESET}"
        return
    fi

    echo -e "${BLUE}🔄 Updating env block in $file...${RESET}"

    # Remove old env block between markers
    sed -i '/# >>> AUTO-GENERATED ENV START >>>/,/# <<< AUTO-GENERATED ENV END <<</d' "$file"

    {
        echo "    # >>> AUTO-GENERATED ENV START >>>"
        echo "    env:"
        while IFS= read -r line || [ -n "$line" ]; do
            [[ -z "$line" || "$line" =~ ^[[:space:]]*# ]] && continue
            if [[ "$line" =~ ^([A-Z_][A-Z0-9_]*)=(.*)$ ]]; then
                key="${BASH_REMATCH[1]}"
                value="${BASH_REMATCH[2]}"
                echo "      $key: $value"
            fi
        done < "$ENV_FILE"
        echo "    # <<< AUTO-GENERATED ENV END <<<"
    } >>"$file"

    echo -e "${GREEN}✅ Updated env block in $file${RESET}"
}

update_workflow_env "$CI_FILE"
update_workflow_env "$CD_FILE"

echo -e "${GREEN}🎉 All done!${RESET}"
echo -e "${BLUE}✨ Updated .env, pushed GitHub secrets, and refreshed workflows.${RESET}"
