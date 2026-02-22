#!/usr/bin/env python3
"""Test different compiler version strings with V2 API"""
import requests
import json

api_key = "32XVVRWZ67YAZN9A2D3J7P497YY8YEEPBY"
url_v2 = "https://api.etherscan.io/v2/api"

# Read source once
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

# Test multiple version formats
versions_to_test = [
    "0.4.18",  # No prefix
    "v0.4.18",  # With v prefix
    "0.4.18+commit.0a7a1d0d",  # With commit hash (example)
]

for version_str in versions_to_test:
    payload = {
        "apikey": api_key,
        "module": "contract",
        "action": "verifysourcecode",
        "chainid": "1",
        "contractaddress": "0x419ecA43dB68E868E68d1aB460c8AC32523c7540",
        "sourceCode": json.dumps(stdj),
        "codeformat": "solidity-standard-json-input",
        "contractname": "TetherToken",
        "compilerversion": version_str,
        "optimizationUsed": "1",
        "runs": "200"
    }
    
    print(f"\n{'='*60}")
    print(f"Testing compilerversion: {version_str}")
    print(f"{'='*60}")
    
    try:
        resp = requests.post(url_v2, data=payload, timeout=10)
        result = resp.json()
        print(json.dumps(result, indent=2))
        
        # Check if submission was accepted
        if result.get("status") == "1":
            print(f"✓ ACCEPTED - GUID: {result.get('result')}")
            break
        else:
            print(f"✗ REJECTED - {result.get('result')}")
    except Exception as e:
        print(f"✗ ERROR: {e}")
