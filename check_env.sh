#!/bin/bash
echo "🔍 Checking Inferno AI Environment..."
echo ""

# Check Node.js
if command -v node &> /dev/null; then
  echo "✅ Node.js installed: $(node --version)"
else
  echo "❌ Node.js not found"
fi

# Check npm
if command -v npm &> /dev/null; then
  echo "✅ npm installed: $(npm --version)"
else
  echo "❌ npm not found"
fi

# Check if node_modules exists
if [ -d "node_modules" ]; then
  echo "✅ node_modules directory exists"
else
  echo "⚠️  node_modules not found - run 'npm install'"
fi

# Check for .env file
if [ -f ".env" ]; then
  echo "✅ .env file exists"
  echo ""
  echo "Environment variables:"
  
  # Check each variable without revealing full values
  if grep -q "DATABASE_URL" .env; then
    echo "  ✅ DATABASE_URL set"
  else
    echo "  ❌ DATABASE_URL not set"
  fi
  
  if grep -q "OPENAI_API_KEY" .env; then
    echo "  ✅ OPENAI_API_KEY set"
  else
    echo "  ❌ OPENAI_API_KEY not set"
  fi
  
  if grep -q "AWS_ACCESS_KEY_ID" .env; then
    echo "  ✅ AWS_ACCESS_KEY_ID set"
  else
    echo "  ⚠️  AWS_ACCESS_KEY_ID not set (optional)"
  fi
  
  if grep -q "AWS_SECRET_ACCESS_KEY" .env; then
    echo "  ✅ AWS_SECRET_ACCESS_KEY set"
  else
    echo "  ⚠️  AWS_SECRET_ACCESS_KEY not set (optional)"
  fi
else
  echo "⚠️  .env file not found - create one from .env.example"
fi

echo ""
echo "Ready to test? Run: npm run dev"
