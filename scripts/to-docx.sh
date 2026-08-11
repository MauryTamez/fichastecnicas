#!/bin/bash

if [ -z "$1" ]; then
  echo "Uso: ./scripts/to-docx.sh <nombre-del-documento>"
  exit 1
fi

BRANCH_NAME=$(git branch --show-current)
DOCS_DIR="docs/$BRANCH_NAME"
FILE_NAME="$DOCS_DIR/$1.md"

if [ -f "$FILE_NAME" ]; then
    # Nombre base para el archivo de salida
    OUTPUT_NAME=$(basename "$FILE_NAME" .md)
    
    # Crear directorio de salida si no existe
    mkdir -p "$DOCS_DIR"
    
    # Ejecutar pandoc
    # -s para documento standalone (con estilos Word)
    # --metadata title para el título del documento
    # --metadata author para el autor (opcional)
    pandoc "$FILE_NAME" -o "$DOCS_DIR/$OUTPUT_NAME.docx" \
        --metadata title="$OUTPUT_NAME" \
        --metadata author="$USER" \
        --metadata date="$(date +'%d/%m/%Y')" \
        --standalone
        
    echo "✅ Documento creado: $DOCS_DIR/$OUTPUT_NAME.docx"
else
    echo "❌ Archivo no encontrado: $FILE_NAME"
    exit 1
fi