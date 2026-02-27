@echo off
REM Testa as 3 opções do mschine
REM Execute como: test-all.bat

cd /d "C:\Users\JEF\Documents\Projeto Moedas\Contrato Flash USDT\mschine"

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║  INSTALANDO DEPENDÊNCIAS E TESTANDO 3 OPÇÕES                  ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Instala tronweb
echo [1/4] Instalando tronweb...
call npm install tronweb --legacy-peer-deps
if %ERRORLEVEL% neq 0 (
  echo [x] Erro ao instalar tronweb
  exit /b 1
)
echo [OK] tronweb instalado
echo.

REM Teste Opção 1: TRON Testnet
echo [2/4] Testando OPÇÃO 1: TRON Testnet Shasta...
echo.
call npm run test:tron
set RESULT_TRON=%ERRORLEVEL%
echo.
if %RESULT_TRON% equ 0 (
  echo [OK] TRON Testnet: FUNCIONANDO ✓
) else (
  echo [x] TRON Testnet: FALHOU
)
echo.

REM Teste Opção 2: Custom RPC (vai falhar sem config)
echo [3/4] Testando OPÇÃO 2: RPC Customizado...
echo.
call npm run test:custom-rpc
set RESULT_CUSTOM=%ERRORLEVEL%
echo.
if %RESULT_CUSTOM% equ 0 (
  echo [OK] RPC Customizado: FUNCIONANDO ✓
) else (
  echo [x] RPC Customizado: Não configurado (normal, configure CUSTOM_RPC_ENDPOINT em .env)
)
echo.

REM Teste Opção 3: API Keys (vai falhar sem config)
echo [4/4] Testando OPÇÃO 3: API Keys (Infura/Alchemy)...
echo.
call npm run test:api-keys
set RESULT_KEYS=%ERRORLEVEL%
echo.
if %RESULT_KEYS% equ 0 (
  echo [OK] API Keys: FUNCIONANDO ✓
) else (
  echo [x] API Keys: Não configuradas (normal, configure em .env)
)
echo.

REM Resumo
echo ╔════════════════════════════════════════════════════════════════╗
echo ║  RESUMO DOS TESTES                                             ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
if %RESULT_TRON% equ 0 (
  echo ✓ Opção 1 (TRON Testnet)    : FUNCIONANDO
) else (
  echo x Opção 1 (TRON Testnet)    : Falhou
)

if %RESULT_CUSTOM% equ 0 (
  echo ✓ Opção 2 (RPC Customizado) : FUNCIONANDO
) else (
  echo x Opção 2 (RPC Customizado) : Não configurado
)

if %RESULT_KEYS% equ 0 (
  echo ✓ Opção 3 (API Keys)        : FUNCIONANDO
) else (
  echo x Opção 3 (API Keys)        : Não configurado
)
echo.

echo Próximos passos:
echo   1. Se TRON funcionou: Use npm run test:tron para novos testes
echo   2. Se Custom RPC não funciona: Configure CUSTOM_RPC_ENDPOINT em .env
echo   3. Se API Keys não funcionam: Configure INFURA_API_KEY ou ALCHEMY_API_KEY em .env
echo.

pause
