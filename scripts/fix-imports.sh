#!/bin/bash

# Script to convert @/ path aliases to relative paths in the API

cd "$(dirname "$0")/../apps/api/src"

echo "Converting @/ imports to relative paths..."

# Find all TypeScript files and convert imports
find . -name "*.ts" -type f | while read file; do
  echo "Processing: $file"

  # Get the directory depth to calculate relative path
  depth=$(echo "$file" | tr -cd '/' | wc -c)

  # Create the relative path prefix based on depth
  if [ "$depth" -eq 1 ]; then
    prefix="."
  else
    prefix=$(printf '../%.0s' $(seq 2 $depth))
    prefix="${prefix%/}"
  fi

  # Replace @/ with the calculated relative path
  sed -i.bak "s|from '@/|from '${prefix}/|g" "$file"
  sed -i.bak "s|import('@/|import('${prefix}/|g" "$file"

  # Remove backup file
  rm -f "${file}.bak"
done

echo "Conversion complete!"
echo "Please review the changes and commit them."
