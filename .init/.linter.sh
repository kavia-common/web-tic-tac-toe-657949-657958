#!/bin/bash
cd /tmp/kavia/workspace/code-generation/web-tic-tac-toe-657949-657958/tic_tac_toe_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

