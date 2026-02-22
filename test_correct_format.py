#!/usr/bin/env python3
"""Submit with correct contractname format for standard-json"""
import requests
import json

api_key = "32XVVRWZ67YAZN9A2D3J7P497YY8YEEPBY"
url_v2 = "https://api.etherscan.io/v2/api"

# Read source
with open("contracts/TetherToken.sol", "r") as f:
    source = f.read()

# Build standard-json
stdj = {
    "language": "Solidity",
    "sources": {
        "TetherToken.sol": {"content": source}
    },
    "settings": {
        "optimizer": {"enabled": True, "runs": 200},
        "outputSelection": {"*": {"*": ["abi", "evm.bytecode"]}}
    }
}

payload = {
    "apikey": api_key,
    "module": "contract",
    "action": "verifysourcecode",
    "chainid": "1",
    "contractaddress": "0x419ecA43dB68E868E68d1aB460c8AC32523c7540",
    "sourceCode": json.dumps(stdj),
    "codeformat": "solidity-standard-json-input",
    "contractname": "TetherToken.sol:TetherToken",  # CORRECT FORMAT!
    "compilerversion": "0.4.18",
    "optimizationUsed": "1",
    "runs": "200"
}

print(f"Testing with correct contractname format: TetherToken.sol:TetherToken")
resp = requests.post(url_v2, data=payload, timeout=10)
result = resp.json()
print(json.dumps(result, indent=2))

if result.get("status") == "1":
    print(f"\n✓✓ SUBMISSION ACCEPTED!")
    print(f"GUID: {result.get('result')}")
