#!/usr/bin/env python3
"""Submit and poll Etherscan verification for USDT contracts (Contract 1 & 2)"""
import requests
import json
import time
import sys

# Force UTF-8 output on Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

API_KEY = "32XVVRWZ67YAZN9A2D3J7P497YY8YEEPBY"
URL_V2 = "https://api.etherscan.io/v2/api"
COMPILER_VERSION = "v0.4.18+commit.9cf6e910"

CONTRACTS = [
    {
        "name": "Contract 1",
        "address": "0x419ecA43dB68E868E68d1aB460c8AC32523c7540"
    },
    {
        "name": "Contract 2",
        "address": "0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11"
    }
]

def read_source():
    """Read TetherToken.sol"""
    with open("contracts/TetherToken.sol", "r") as f:
        return f.read()

def build_standard_json(source):
    """Build solc standard-json input"""
    return {
        "language": "Solidity",
        "sources": {
            "TetherToken.sol": {"content": source}
        },
        "settings": {
            "optimizer": {"enabled": True, "runs": 200},
            "outputSelection": {"*": {"*": ["abi", "evm.bytecode"]}}
        }
    }

def submit_contract(contract_name, contract_address, source_code):
    """Submit contract for verification"""
    print(f"\n{'='*70}")
    print(f"Submitting {contract_name}: {contract_address}")
    print(f"Compiler: {COMPILER_VERSION}")
    print(f"{'='*70}\n")
    
    stdj = build_standard_json(source_code)
    
    payload = {
        "apikey": API_KEY,
        "module": "contract",
        "action": "verifysourcecode",
        "chainid": "1",
        "contractaddress": contract_address,
        "sourceCode": json.dumps(stdj),
        "codeformat": "solidity-standard-json-input",
        "contractname": "TetherToken.sol:TetherToken",
        "compilerversion": COMPILER_VERSION,
        "optimizationUsed": "1",
        "runs": "200"
    }
    
    try:
        resp = requests.post(URL_V2, data=payload, timeout=10)
        result = resp.json()
        
        if result.get("status") == "1":
            guid = result.get("result")
            print(f"[OK] Submission accepted")
            print(f"     GUID: {guid}\n")
            return guid
        else:
            print(f"[FAILED] {result.get('result')}\n")
            return None
    except Exception as e:
        print(f"[ERROR] {e}\n")
        return None

def poll_verification(guid, contract_name, max_attempts=60):
    """Poll verification status until complete (max 10 minutes)"""
    print(f"Polling verification for {contract_name}...")
    
    for attempt in range(max_attempts):
        time.sleep(10)
        
        status_payload = {
            "apikey": API_KEY,
            "module": "contract",
            "action": "checkverifystatus",
            "guid": guid
        }
        
        try:
            status_resp = requests.get(URL_V2, params=status_payload, timeout=10)
            status_result = status_resp.json()
            status_msg = status_result.get("result", "unknown")
            
            # Truncate for display
            display_msg = status_msg[:80] if len(status_msg) > 80 else status_msg
            print(f"  [{attempt+1:2d}] {display_msg}")
            
            # Check for completion
            if "verified" in status_msg.lower() or "pass" in status_msg.lower():
                print(f"\n[SUCCESS] {contract_name} verification complete!\n")
                return True
            elif "fail" in status_msg.lower():
                print(f"\n[FAILED] {contract_name} verification failed: {status_msg}\n")
                return False
        except Exception as e:
            print(f"  [{attempt+1:2d}] Error: {e}")
    
    print(f"\n[TIMEOUT] Still verifying after 10 minutes")
    print(f"          Check status manually with GUID: {guid}\n")
    return None

def main():
    """Main workflow"""
    source = read_source()
    
    results = {}
    
    for contract in CONTRACTS:
        guid = submit_contract(contract["name"], contract["address"], source)
        
        if guid:
            results[contract["name"]] = {
                "address": contract["address"],
                "guid": guid,
                "submitted": True
            }
            success = poll_verification(guid, contract["name"])
            results[contract["name"]]["verified"] = success
        else:
            results[contract["name"]] = {
                "address": contract["address"],
                "submitted": False,
                "verified": False
            }
    
    # Summary
    print(f"\n{'='*70}")
    print("SUMMARY")
    print(f"{'='*70}\n")
    
    for contract_name, data in results.items():
        status = "VERIFIED" if data.get("verified") else "FAILED" if data.get("submitted") else "NOT SUBMITTED"
        print(f"{contract_name}: {status}")
        print(f"  Address: {data['address']}")
        if data.get("guid"):
            print(f"  GUID:    {data['guid']}")
        print()

if __name__ == "__main__":
    main()
