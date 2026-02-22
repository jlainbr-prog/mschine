#!/usr/bin/env python3
"""Submit with correct compiler version v0.4.18+commit.9cf6e910"""
import requests
import json
import time

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

# Use correct compiler version
correct_version = "v0.4.18+commit.9cf6e910"

payload = {
    "apikey": api_key,
    "module": "contract",
    "action": "verifysourcecode",
    "chainid": "1",
    "contractaddress": "0x419ecA43dB68E868E68d1aB460c8AC32523c7540",
    "sourceCode": json.dumps(stdj),
    "codeformat": "solidity-standard-json-input",
    "contractname": "TetherToken.sol:TetherToken",
    "compilerversion": correct_version,
    "optimizationUsed": "1",
    "runs": "200"
}

print(f"Submitting Contract 1 with compiler version: {correct_version}")
print()

resp = requests.post(url_v2, data=payload, timeout=10)
result = resp.json()
print("SUBMISSION RESPONSE:")
print(json.dumps(result, indent=2))

if result.get("status") == "1":
    guid = result.get('result')
    print(f"\n✓✓ SUBMISSION ACCEPTED!")
    print(f"GUID: {guid}")
    print(f"\nPolling verification status...")
    
    # Poll for status
    for attempt in range(60):  # Poll for 10 minutes (10 sec * 60)
        time.sleep(10)
        
        status_payload = {
            "apikey": api_key,
            "module": "contract",
            "action": "checkverifystatus",
            "guid": guid
        }
        
        status_resp = requests.get(url_v2, params=status_payload, timeout=10)
        status_result = status_resp.json()
        status_msg = status_result.get("result", "unknown")[:80]
        
        print(f"[{attempt+1}] {status_msg}")
        
        if "verified" in status_msg.lower() or "pass" in status_msg.lower():
            print(f"\n✓✓✓ VERIFICATION COMPLETE!")
            print(json.dumps(status_result, indent=2))
            break
        elif "fail" in status_msg.lower():
            print(f"\n✗ Verification failed")
            print(json.dumps(status_result, indent=2))
            break
else:
    print(f"\n✗ Submission failed: {result.get('result')}")
