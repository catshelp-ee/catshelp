#!/bin/bash

# Directories to scan
directories=("models" "migrations")

# Loop through each directory
for dir in "${directories[@]}"; do
  # Check if the directory exists
  if [ -d "$dir" ]; then
    echo "Scanning directory: $dir"

    # Find files ending with .js
    find "$dir" -type f -name "*.js" | while read -r file; do
      # Skip files that already have .cjs extension
      if [[ "$file" =~ \.cjs$ ]]; then
        echo "Skipping (already .cjs): $file"
        continue
      fi

      # Rename the file to .cjs
      new_file="${file%.js}.cjs"
      echo "Renaming: $file -> $new_file"
      mv "$file" "$new_file"
    done
  else
    echo "Directory not found: $dir"
  fi

done

echo "Renaming completed."

