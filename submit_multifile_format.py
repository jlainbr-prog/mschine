#!/usr/bin/env python3
"""
Submit using multi-file format (without standard-json) 
This sometimes works better with older contracts
"""
import requests
import json
import time

API_KEY = "32XVVRWZ67YAZN9A2D3J7P497YY8YEEPBY"
URL_V2 = "https://api.etherscan.io/v2/api"

# Read entire source code
with open("contracts/TetherToken.sol", "r") as f:
    source_code = f.read()

# Get constructors args from ETHERSCAN_VERIFICATION_DATA.md
constructor_args_hex = "000000000000000000000000000000000000000000000000000000e8d4a51000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000003555344000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000045553445400000000000000000000000000000000000000000000000000000000"

contracts = [
    ("Contract 1", "0x419ecA43dB68E868E68d1aB460c8AC32523c7540"),
    ("Contract 2", "0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11")
]

print("Attempting multi-file format submission (without standard-json)...\n")

for name, address in contracts:
    print(f"\nSubmitting {name}...")
    
    # Try with solidity-single-file format (might work better)
    payload = {
        "apikey": API_KEY,
        "module": "contract",
        "action": "verifysourcecode",
        "chainid": "1",
        "contractaddress": address,
        "sourceCode": source_code,  # Raw source, not json
        "codeformat": "solidity-single-file",  # NOT standard-json
        "contractname": "TetherToken",
        "compilerversion": "v0.4.18+commit.9cf6e910",
        "optimizationUsed": "1",
        "runs": "200",
        "constructorArguements": constructor_args_hex  # Note: typo in Etherscan param name!
    }
    
    try:
        resp = requests.post(URL_V2, data=payload, timeout=10)
        result = resp.json()
        
        print(f"Status: {result.get('status')}")
        print(f"Message: {result.get('message')}")
        
        if result.get('status') == '1':
            guid = result.get('result')
            print(f"GUID: {guid}")
            
            # Poll once
            time.sleep(5)
            status_resp = requests.get(URL_V2, params={
                "apikey": API_KEY,
                "module": "contract",
                "action": "checkverifystatus",
                "guid": guid,
                "chainid": "1"
            }, timeout=10)
            
            status = status_resp.json()
            print(f"Status: {status.get('result')}")
        else:
            print(f"Error: {result.get('result')}")
    except Exception as e:
        print(f"Exception: {e}")
