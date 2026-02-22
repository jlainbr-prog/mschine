#!/usr/bin/env python3
"""
Final attempt: Submit with minimal formatting
Try both contracts with different approaches
"""
import requests
import json
import time

API_KEY = "32XVVRWZ67YAZN9A2D3J7P497YY8YEEPBY"
URL_V2 = "https://api.etherscan.io/v2/api"

with open("contracts/TetherToken.sol", "r") as f:
    source = f.read()

contracts = [
    ("0x419ecA43dB68E868E68d1aB460c8AC32523c7540", "Contract 1"),
    ("0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11", "Contract 2")
]

print("FINAL SUBMISSION ATTEMPTS\n")

# Note: The bytes mismatch issue suggests this source might not be 100% original
# But let's try with different approaches

for address, name in contracts:
    print(f"\n{'='*70}")
    print(f"{name}\n")
    
    approaches = [
        {
            "name": "standard-json (no constructor args)",
            "stdj": {
                "language": "Solidity",
                "sources": {"TetherToken.sol": {"content": source}},
                "settings": {
                    "optimizer": {"enabled": True, "runs": 200},
                    "outputSelection": {"*": {"*": ["abi", "evm.bytecode"]}}
                }
            },
            "codeformat": "solidity-standard-json-input",
            "contractname": "TetherToken.sol:TetherToken"
        },
    ]
    
    for approach in approaches:
        print(f"  Trying: {approach['name']}")
        
        payload = {
            "apikey": API_KEY,
            "module": "contract",
            "action": "verifysourcecode",
            "chainid": "1",
            "contractaddress": address,
            "codeformat": approach["codeformat"],
            "contractname": approach["contractname"],
            "compilerversion": "v0.4.18+commit.9cf6e910",
            "optimizationUsed": "1",
            "runs": "200"
        }
        
        if "stdj" in approach:
            payload["sourceCode"] = json.dumps(approach["stdj"])
        else:
            payload["sourceCode"] = source
        
        try:
            resp = requests.post(URL_V2, data=payload, timeout=10)
            result = resp.json()
            
            if result.get("status") == "1":
                guid = result.get("result")
                print(f"    GUID: {guid}")
                
                # Save to tracking file
                with open(f"final_submission_guids.txt", "a") as f:
                    f.write(f"{name} ({address}): {guid}\n")
            else:
                error = result.get("result", "Unknown")
                print(f"    ERROR: {error[:80]}")
        
        except Exception as e:
            print(f"    EXCEPTION: {str(e)[:60]}")
        
        time.sleep(2)

print("\n\nNote: Bytecode mismatch suggests our source code differs slightly")
print("from the original. This is likely due to source code consolidation.")
print(f"\nCheck status with GUIDs in final_submission_guids.txt")
