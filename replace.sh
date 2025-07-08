find utils -type f -name '*.ts' | while read -r file; do
  sed -E 's/^(.*if[[:space:]]*\(.*\))[[:space:]]+return[[:space:]]+(.*);[[:space:]]*$/\1 {\nreturn \2;\n}/' "$file"
done

