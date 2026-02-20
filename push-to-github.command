#!/bin/bash

# ─────────────────────────────────────────────────────────────
#  Securology.ai — GitHub Push Helper
#  Double-click this file in Finder to run it.
# ─────────────────────────────────────────────────────────────

# Move to the folder this script lives in (the project root)
cd "$(dirname "$0")"

clear
echo "╔══════════════════════════════════════════════╗"
echo "║   Securology.ai — GitHub Publisher           ║"
echo "╚══════════════════════════════════════════════╝"
echo ""
echo "This script will push your website to:"
echo "  https://github.com/securology-ai/securology-ai.github.io"
echo ""
echo "─────────────────────────────────────────────"
echo "You need a GitHub Personal Access Token (PAT)."
echo ""
echo "To create one:"
echo "  1. Go to: https://github.com/settings/tokens/new"
echo "  2. Make sure you're logged in as the securology-ai org owner"
echo "  3. Note: 'securology deploy'"
echo "  4. Expiration: 90 days"
echo "  5. Tick the 'repo' checkbox"
echo "  6. Click 'Generate token' and copy it"
echo "─────────────────────────────────────────────"
echo ""

# Prompt for PAT (hidden input)
read -s -p "Paste your GitHub Personal Access Token and press Enter: " TOKEN
echo ""

if [ -z "$TOKEN" ]; then
  echo "❌ No token entered. Exiting."
  exit 1
fi

echo ""
echo "⏳ Clearing any cached GitHub credentials..."
# Clear macOS Keychain entry for github.com
security delete-internet-password -s github.com 2>/dev/null
git credential reject <<EOF 2>/dev/null
protocol=https
host=github.com
EOF

echo "⏳ Configuring remote..."
git remote remove origin 2>/dev/null
git remote add origin "https://securology-ai:${TOKEN}@github.com/securology-ai/securology-ai.github.io.git"

echo "⏳ Pushing to GitHub..."
git push -u origin main

PUSH_STATUS=$?

echo ""
echo "⏳ Removing token from remote URL (security cleanup)..."
git remote set-url origin "https://github.com/securology-ai/securology-ai.github.io.git"

if [ $PUSH_STATUS -eq 0 ]; then
  echo ""
  echo "╔══════════════════════════════════════════════╗"
  echo "║  ✅  Push successful!                        ║"
  echo "║                                              ║"
  echo "║  Next step: Enable GitHub Pages              ║"
  echo "║  Go to → Settings → Pages → GitHub Actions  ║"
  echo "║                                              ║"
  echo "║  Your site will be live in ~2 minutes at:   ║"
  echo "║  https://securology-ai.github.io             ║"
  echo "╚══════════════════════════════════════════════╝"
else
  echo ""
  echo "╔══════════════════════════════════════════════╗"
  echo "║  ❌  Push failed (exit code: $PUSH_STATUS)         ║"
  echo "║                                              ║"
  echo "║  Possible causes:                            ║"
  echo "║  • PAT doesn't have 'repo' scope             ║"
  echo "║  • Token was copied incorrectly              ║"
  echo "║  • Account doesn't have write access to org  ║"
  echo "║                                              ║"
  echo "║  Try running this script again.              ║"
  echo "╚══════════════════════════════════════════════╝"
fi

echo ""
echo "Press any key to close..."
read -n 1
