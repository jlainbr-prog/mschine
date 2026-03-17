import requests
import json

# Contratos a validar
contracts = [
    "0x419ecA43dB68E868E68d1aB460c8AC32523c7540",  # USDT
    "0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11"   # FLASH
]

# Validar se o logo está acessível
response = requests.get("https://ipfs.io/ipns/k51qzi5uqu5djxjtug907nso8egrgh38rvnx3cjhnw6eg2szekdbxm0jyi1ma1")
if response.status_code == 200:
    print("Logo acessível via IPFS")
else:
    print(f"Erro ao acessar logo: {response.status_code}")

# Validar se os contratos são compatíveis com TrustWallet (usando Etherscan para Ethereum)
for contract in contracts:
    etherscan_url = f"https://api.etherscan.io/api?module=contract&action=getabi&address={contract}&apikey=YourApiKeyHere"
    response = requests.get(etherscan_url)
    if response.status_code == 200:
        data = response.json()
        if data.get("status") == "1":
            print(f"Contrato {contract} verificado no Etherscan")
        else:
            print(f"Erro ao verificar contrato {contract}: {data.get('message')}")
    else:
        print(f"Erro na requisição para {contract}: {response.status_code}")