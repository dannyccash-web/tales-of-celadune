#!/bin/bash
cd "/Users/dannycash/Documents/Claude/Projects/Tales of Celadune" || exit 1
rm -f .git/*.lock .git/refs/remotes/origin/*.lock
git fetch origin && git reset --soft origin/main && git read-tree HEAD
git add -A
git commit -m "D3: new background art + shift coords down 74px to match; docs"
git push origin main
echo ""
echo "==== PUSH COMPLETE ===="
sleep 4
