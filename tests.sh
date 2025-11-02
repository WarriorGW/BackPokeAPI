#!/bin/bash

# ==============================================
# Script de pruebas automáticas para la API
# ==============================================

BASE_URL="http://localhost:4000"
DATE=$(date +"%Y-%m-%d %H:%M:%S")
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
BLUE="\033[1;34m"
RESET="\033[0m"

echo -e "${BLUE}Iniciando pruebas a las $DATE${RESET}"
echo "==============================================="

run_test() {
  DESCRIPTION=$1
  CMD=$2

  echo ""
  echo -e "${YELLOW}$DESCRIPTION${RESET}"
  echo "-----------------------------------------------"

  RESPONSE=$(eval $CMD 2>/dev/null)
  STATUS=$?

  if [ $STATUS -ne 0 ]; then
    echo -e "${RED}Error al ejecutar la solicitud${RESET}"
    return
  fi

  # Mostrar solo primeros 20 líneas si es muy largo
  LINE_COUNT=$(echo "$RESPONSE" | jq . | wc -l)
  if [ $LINE_COUNT -gt 20 ]; then
    echo "$RESPONSE" | jq . | head -n 20
    echo -e "${YELLOW}... (respuesta truncada)${RESET}"
  else
    echo "$RESPONSE" | jq .
  fi

  # Validación rápida
  if echo "$RESPONSE" | jq -e 'type=="array"' >/dev/null 2>&1; then
    COUNT=$(echo "$RESPONSE" | jq 'length')
    echo -e "${GREEN}OK (${COUNT} elementos)${RESET}"
  elif echo "$RESPONSE" | jq -e '.id or .message' >/dev/null 2>&1; then
    echo -e "${GREEN}OK${RESET}"
  else
    echo -e "${YELLOW}Estructura inesperada${RESET}"
  fi
}

# ==============================================
# PRUEBAS
# ==============================================

run_test "GET /api/wallets" \
  "curl -s $BASE_URL/api/wallets"

NEW_WALLET_NAME="TestWallet_$(date +%s)"
run_test "POST /api/wallets (crear nueva wallet)" \
  "curl -s -X POST $BASE_URL/api/wallets -H 'Content-Type: application/json' -d '{\"name\":\"$NEW_WALLET_NAME\",\"balance\":0}'"

run_test "POST /api/wallets/add (agregar fondos a wallet 1)" \
  "curl -s -X POST $BASE_URL/api/wallets/add -H 'Content-Type: application/json' -d '{\"walletId\":1,\"denominations\":[{\"value\":20,\"amount\":2},{\"value\":10,\"amount\":1}],\"note\":\"Prueba script avanzada\",\"date\":\"2025-11-02\"}'"

run_test "GET /api/transactions" \
  "curl -s $BASE_URL/api/transactions"

# ==============================================
# FINAL
# ==============================================
echo ""
echo -e "${BLUE}Pruebas completadas a las $(date +"%H:%M:%S")${RESET}"
echo "==============================================="
