#!/usr/bin/env python3
"""Submit and poll Etherscan verification for USDT contracts (both)"""
import requests
import json
import time

API_KEY = "32XVVRWZ67YAZN9A2D3J7P497YY8YEEPBY"
URL_V2 = "https://api.etherscan.io/v2/api"
COMPILER_VERSION = "v0.4.18+commit.9cf6e910"

CONTRACTS = [
    ("Contract 1", "0x419ecA43dB68E868E68d1aB460c8AC32523c7540"),
    ("Contract 2", "0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11")
]

def read_source():
    with open("contracts/TetherToken.sol", "r") as f:
        return f.read()

def build_payload(address):
    source = read_source()
    stdj = {
        "language": "Solidity",
        "sources": {"TetherToken.sol": {"content": source}},
        "settings": {
            "optimizer": {"enabled": True, "runs": 200},
            "outputSelection": {"*": {"*": ["abi", "evm.bytecode"]}}
        }
    }
    return {
        "apikey": API_KEY,
        "module": "contract",
        "action": "verifysourcecode",
        "chainid": "1",
        "contractaddress": address,
        "sourceCode": json.dumps(stdj),
        "codeformat": "solidity-standard-json-input",
        "contractname": "TetherToken.sol:TetherToken",
        "compilerversion": COMPILER_VERSION,
        "optimizationUsed": "1",
        "runs": "200"
    }

def submit_and_poll():
    source = read_source()
    guids = {}
    
    # Submit both contracts
    for name, address in CONTRACTS:
        print("=" * 70)
        print(f"Submitting {name}: {address}")
        print("=" * 70)
        
        payload = build_payload(address)
        
        try:
            resp = requests.post(URL_V2, data=payload, timeout=10)
            result = resp.json()
            
            if result.get("status") == "1":
                guid = result.get("result")
                guids[name] = guid
                print(f"[OK] Submission accepted")
                print(f"     GUID: {guid}\n")
            else:
                print(f"[FAILED] {result.get('result', 'Unknown error')}\n")
        except Exception as e:
            print(f"[ERROR] {e}\n")
    
    if not guids:
        print("No contracts submitted successfully")
        return
    
    # Poll for verification
    print("\n" + "=" * 70)
    print("POLLING VERIFICATION STATUS")
    print("=" * 70 + "\n")
    
    for name, guid in guids.items():
        print(f"Polling {name}...")
        verified = False
        
        for attempt in range(60):  # 10 minutes (10 sec * 60)
            time.sleep(10)
            
            try:
                resp = requests.get(URL_V2, params={
                    "apikey": API_KEY,
                    "module": "contract",
                    "action": "checkverifystatus",
                    "guid": guid
                }, timeout=10)
                
                result = resp.json()
                status_msg = result.get("result", "unknown")
                status_short = status_msg[:70] if len(status_msg) > 70 else status_msg
                print(f"  [{attempt+1:2d}] {status_short}")
                
                if status_msg.lower() not in ["pending...", "in progress"]:
                    if "verified" in status_msg.lower() or "pass" in status_msg.lower():
                        print(f"  [VERIFIED] {name}\n")
                        verified = True
                    elif "fail" in status_msg.lower():
                        print(f"  [FAILED] {status_msg}\n")
                    break
            except Exception as e:
                print(f"  [{attempt+1:2d}] Error: {e}")
        
        if not verified:
            print(f"  [TIMEOUT or ONGOING] Check manually with GUID: {guid}\n")
    
    # Summary
    print("=" * 70)
    print("Summary:")
    for name, guid in guids.items():
        print(f"  {name}: {guid}")
    print("=" * 70)

if __name__ == "__main__":
    submit_and_poll()
