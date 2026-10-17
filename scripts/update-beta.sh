#!/usr/bin/env bash
# scripts/update-beta.sh
# Pulls the latest redesign from branch v3 and builds it into the /beta slug on main

set -e

echo "Updating /beta from branch v3..."

git checkout v3
npm run build:beta
git checkout main

if [ -f "beta/CNAME" ]; then
  rm -f "beta/CNAME"
fi

echo "Successfully updated /beta on main from v3!"
echo "Review changes with 'git status' and commit when ready."
