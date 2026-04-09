#!/bin/bash
# Push leaderboard changes to all repos
# Usage: ./push-all.sh

echo "🚀 Pushing to all repos..."
echo ""

# 1. Push leaderboard
echo "📤 [1/3] Pushing leaderboard..."
git push origin master || exit 1

# 2. Update parent
cd ../..
echo "📤 [2/3] Updating parent repos..."

COMMIT_MSG=$(cd tools/affiliate-leaderboard && git log -1 --pretty=%B)
PARENT_MSG="chore: update leaderboard submodule

${COMMIT_MSG}

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

git add tools/affiliate-leaderboard
git commit -m "$PARENT_MSG"

# 3. Push parent to both remotes
echo "📤 [3/3] Pushing parent to origin & upstream..."
git push origin main
git push upstream main

echo ""
echo "✅ All repos synchronized!"
echo "   ✓ chichi-png/altcoinist-leaderboard"
echo "   ✓ chichi-png/altcoinist-affiliates-outbound"  
echo "   ✓ altcoinist-com/altcoinist-affiliates-outbound"
echo ""
