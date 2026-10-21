#!/bin/bash
# Backup harian ramadanadipa.com ke GitHub
set -e
WEBROOT="$HOME/workspace/www/ramadanadipa.com"
STAGE="$HOME/workspace/releases/ramadanadipa.com-github"
TOKEN_FILE="$HOME/workspace/mc-portal/config/github_token"

# Sync isi web root; pertahankan file milik repo (.git, script ini, README.md, .nojekyll)
rsync -a --delete \
  --exclude='.git' \
  --exclude='daily-backup.sh' \
  --exclude='README.md' \
  --exclude='.nojekyll' \
  "$WEBROOT/" "$STAGE/"

cd "$STAGE"
git add -A
if git diff --cached --quiet; then
  echo "no changes"
  exit 0
fi
git -c user.name="dasrams31" -c user.email="ramadanadipa176@gmail.com" \
  commit -qm "Daily backup $(date +%F)"

TOKEN="$(cat "$TOKEN_FILE")"
git push "https://dasrams31:${TOKEN}@github.com/dasrams31/ramadanadipa.com.git" main 2>&1 | tail -2
echo "pushed $(date -Is)"

# Mirror ke GitLab (RamsNotes31) - ditambahkan 2026-10-22, bareng GitHub
GL_TOKEN_FILE="$HOME/workspace/mc-portal/config/gitlab_token"
if [ -f "$GL_TOKEN_FILE" ]; then
  GLTOKEN=$(tr -d '\n' < "$GL_TOKEN_FILE")
  git push "https://oauth2:${GLTOKEN}@gitlab.com/RamsNotes31/ramadanadipa.com.git" main 2>&1 | tail -2 || echo "gitlab push failed (github push ok)"
  unset GLTOKEN
fi
