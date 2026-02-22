#!/usr/bin/env python3
"""Test compiler version formats with Etherscan API"""
import requests
import json

api_key = "32XVVRWZ67YAZN9A2D3J7P497YY8YEEPBY"

# Read the source code
with open("contracts/TetherToken.sol", "r") as f:
    source_code = f.read()[:1000]  # Just first 1000 chars for quick test

# Try minimal standard-json
standard_json = {
    "language": "Solidity",
    "sources": {
        "TetherToken.sol": {
            "content": source_code
        }
    },
    "settings": {
        "optimizer": {"enabled": True, "runs": 200},
        "outputSelection": {
            "*": {"*": ["abi", "evm.bytecode"]}
        }
    }
}

# Test with version 0.4.18 (without 'v' prefix)
payload = {
    "apikey": api_key,
    "module": "contract",
    "action": "verifysourcecode",
    "chainid": "1",
    "codeformat": "solidity-standard-json-input",
    "sourceCode": json.dumps(standard_json),
    "contractname": "TetherToken",
    "compilerversion": "0.4.18"  # Try without 'v' prefix
}

url = "https://api.etherscan.io/v2/api"
print(f"Testing compiler version format: 0.4.18")
response = requests.post(url, data=payload, timeout=10)
result = response.json()
print(json.dumps(result, indent=2))
