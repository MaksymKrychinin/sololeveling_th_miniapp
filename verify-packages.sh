#!/bin/bash

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 Verifying package declaration files..."
echo ""

# Function to check if declaration files exist
check_package() {
    local package_name=$1
    local package_path=$2

    if [ -f "$package_path/dist/index.d.ts" ] || [ -f "$package_path/dist/index.d.mts" ]; then
        echo -e "${GREEN}✓${NC} $package_name: Declaration files found"
        return 0
    else
        echo -e "${RED}✗${NC} $package_name: Declaration files missing"
        return 1
    fi
}

# Check all packages
all_good=true

check_package "@solo-leveling/shared" "packages/shared" || all_good=false
check_package "@solo-leveling/database" "packages/database" || all_good=false
check_package "@solo-leveling/telegram-sdk" "packages/telegram-sdk" || all_good=false
check_package "@solo-leveling/ui" "packages/ui" || all_good=false

echo ""

if [ "$all_good" = true ]; then
    echo -e "${GREEN}✓ All packages have declaration files!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠ Some packages are missing declaration files${NC}"
    echo ""
    echo "Run the following to rebuild all packages:"
    echo "  cd packages/shared && npx tsup src/index.ts --format cjs,esm --dts"
    echo "  cd ../database && npx tsc"
    echo "  cd ../telegram-sdk && npx tsup src/index.ts --format cjs,esm --dts"
    echo "  cd ../ui && npx tsup src/index.ts --format cjs,esm --dts"
    exit 1
fi
