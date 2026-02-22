#!/usr/bin/env python3
"""
Submit Solidity source code to Etherscan using V1 API with MultipartFormDataContent.
This is more reliable than V2 API for standard-json format.
"""
import argparse
import json
import time
import requests
from pathlib import Path

SOURCE_PATH = Path("contracts/TetherToken.sol")
CONTRACT_NAME = "TetherToken"

def submit_with_v1_api(api_key: str, contract_address: str):
    """Submit contract using V1 API (more reliable than V2 for this use case)"""
    
    # Read source code
    with open(SOURCE_PATH, "r") as f:
        source_code = f.read()
    
    # Build standard-json
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
                "*": {
                    "*": ["abi", "evm.bytecode", "evm.deployedBytecode"]
                }
            }
        }
    }
    
    # V1 API endpoint
    url = "https://api.etherscan.io/api"
    
    # Prepare payload with proper formatting
    payload = {
        "apikey": api_key,
        "module": "contract",
        "action": "verifysourcecode",
        "contractaddress": contract_address,
        "sourceCode": json.dumps(standard_json),  # Must be JSON string
        "codeformat": "solidity-standard-json-input",
        "contractname": CONTRACT_NAME,
        "compilerversion": "v0.4.18",  # V1 API likes 'v' prefix
        "optimizationUsed": "1",
        "runs": "200"
    }
    
    print(f"Submitting to V1 API...")
    print(f"Address: {contract_address}")
    print(f"Compiler: v0.4.18")
    print()
    
    try:
        response = requests.post(url, data=payload, timeout=30)
        result = response.json()
        print("SUBMISSION RESPONSE:")
        print(json.dumps(result, indent=2))
        
        if result.get("status") == "1" and result.get("result"):
            guid = result.get("result")
            print(f"\n✓ Submission accepted with GUID: {guid}")
            
            # Poll for status
            print(f"\nPolling verification status...")
            for attempt in range(30):  # Poll for 5 minutes (10 sec * 30)
                time.sleep(10)
                
                status_payload = {
                    "apikey": api_key,
                    "module": "contract",
                    "action": "checkverifystatus",
                    "guid": guid
                }
                
                status_response = requests.get(url, params=status_payload, timeout=30)
                status_result = status_response.json()
                
                print(f"[Attempt {attempt+1}] Status: {status_result.get('result', 'unknown')}")
                
                if "verified" in status_result.get("result", "").lower():
                    print(f"\n✓✓ VERIFICATION COMPLETE!")
                    print(json.dumps(status_result, indent=2))
                    return True
                elif "fail" in status_result.get("result", "").lower():
                    print(f"\n✗ Verification failed: {status_result.get('result')}")
                    return False
            
            print(f"\n⏱ Timeout: Still verifying after 5 minutes")
            return None
        else:
            print(f"\n✗ Submission failed: {result.get('result')}")
            return False
            
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--key", required=True, help="Etherscan API key")
    parser.add_argument("--address", required=True, help="Contract address (0x...)")
    args = parser.parse_args()
    
    submit_with_v1_api(args.key, args.address)
