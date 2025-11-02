#!/bin/bash

BASE_URL="http://localhost:4000"

run_test() {
  DESCRIPTION=$1
  CMD=$2

  echo "==============================="
  echo "TEST: $DESCRIPTION"
  echo "Ejecutando: $CMD"

  RESPONSE=$(eval $CMD)
  if [ $? -ne 0 ]; then
    echo "❌ ERROR al ejecutar $DESCRIPTION"
    echo ""
    return
  fi

  echo "Respuesta del servidor:"
  echo $RESPONSE | jq

  # Verifica si es un array (GET) o un object con message (POST)
  if echo $RESPONSE | jq -e 'type=="array"' >/dev/null; then
    LENGTH=$(echo $RESPONSE | jq 'length')
    if [ "$LENGTH" -ge 0 ]; then
      echo "✅ $DESCRIPTION PASÓ"
    else
      echo "⚠️ $DESCRIPTION respondió pero array vacío"
    fi
  elif echo $RESPONSE | jq -e '.message' >/dev/null; then
    echo "✅ $DESCRIPTION PASÓ"
  else
    echo "⚠️ $DESCRIPTION respondió pero sin mensaje esperado"
  fi

  echo ""
}

# 1️⃣ Obtener wallets
run_test "GET /api/wallets" "curl -s $BASE_URL/api/wallets"

# 2️⃣ Agregar fondos a wallet 1
run_test "POST /api/wallets/add" "curl -s -X POST $BASE_URL/api/wallets/add -H 'Content-Type: application/json' -d '{\"walletId\":\"1\",\"denominations\":[{\"value\":5,\"amount\":3},{\"value\":10,\"amount\":2}],\"note\":\"Prueba script\",\"date\":\"2025-10-23\"}'"

# 3️⃣ Obtener transacciones
run_test "GET /api/transactions" "curl -s $BASE_URL/api/transactions"
