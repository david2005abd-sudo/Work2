#!/usr/bin/env bash
set -euo pipefail

echo "▸ Checking for hardcoded secrets..."
if grep -rEn "(sk-[a-zA-Z0-9]{20,}|api[_-]?key\s*=\s*['\"][a-zA-Z0-9]{20,})" src/ 2>/dev/null; then
  echo "✗ Potential secrets found"
  exit 1
fi
echo "✓ No hardcoded secrets"

echo "▸ Auditing npm dependencies..."
pnpm audit --audit-level=high || true

echo "▸ Checking env usage in client bundles..."
if grep -rn "SUPABASE_SERVICE_ROLE_KEY\|DEEPSEEK_API_KEY\|OPENAI_API_KEY\|GEMINI_API_KEY" src/components src/features src/hooks 2>/dev/null; then
  echo "✗ Server secret referenced in client code"
  exit 1
fi
echo "✓ No server secrets in client code"

echo "✓ Security audit complete"
