#!/bin/bash
echo "🔍 Checking PostgreSQL installation..."

# Check if PostgreSQL is installed
if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL is installed!"
    echo "📊 PostgreSQL version:"
    psql --version
    
    echo ""
    echo "🔍 Checking if PostgreSQL is running..."
    if pg_isready &> /dev/null; then
        echo "✅ PostgreSQL is running!"
        
        echo ""
        echo "🗄️  Creating database 'hibionichand'..."
        createdb hibionichand 2>/dev/null && echo "✅ Database created!" || echo "⚠️  Database might already exist"
        
        echo ""
        echo "📝 Updating .env file..."
        USERNAME=$(whoami)
        sed -i.bak "s|DATABASE_URL=.*|DATABASE_URL=\"postgresql://$USERNAME@localhost:5432/hibionichand?schema=public\"|" .env
        echo "✅ .env updated!"
        
        echo ""
        echo "🚀 Next steps:"
        echo "   1. npm run prisma:generate"
        echo "   2. npm run prisma:migrate"
    else
        echo "❌ PostgreSQL is not running"
        echo "   Start it with: brew services start postgresql@15"
    fi
else
    echo "❌ PostgreSQL is not installed"
    echo ""
    echo "📦 Install it with:"
    echo "   brew install postgresql@15"
    echo "   brew services start postgresql@15"
    echo ""
    echo "Or use a cloud database (see QUICK_DATABASE_SETUP.md)"
fi
