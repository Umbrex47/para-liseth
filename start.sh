#!/usr/bin/env bash
# Script para iniciar el proyecto Para Liseth
cd "$(dirname "$0")" || exit 1

echo "✨ Iniciando «Para Liseth»..."
echo "🌌 Cargando el universo y las cartas especiales..."
echo "🌐 Disponible en: http://localhost:5173"

if command -v bun &> /dev/null; then
    bun run dev
elif command -v npm &> /dev/null; then
    npm run dev
else
    echo "Error: No se encontró bun ni npm instalado."
    exit 1
fi
