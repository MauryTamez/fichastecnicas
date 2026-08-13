#!/bin/bash

if [ -z "$1" ]; then
  echo "Uso: ./scripts/make-doc.sh <nombre-de-el-documento>"
  exit 1
fi

BRANCH_NAME=$(git branch --show-current)
DOCS_DIR="docs/$BRANCH_NAME"
FILE_NAME="$DOCS_DIR/$1.md"

mkdir -p "$DOCS_DIR"

# Plantilla base
cat <<EOT > "$FILE_NAME"
# Documentacion Técnica: $1
> **Rama:** $BRANCH_NAME | **Fecha:** $(date +%F)

## 1. Descripción
[Escribe aquí el propósito de este módulo/archivo]

## 2. Cambios / Implementación
- 

## 3. Notas adicionales
- 
EOT

echo "📄 documento creado en: $FILE_NAME"
