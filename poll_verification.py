#!/usr/bin/env python3
import requests
import json
import time

API_KEY = "32XVVRWZ67YAZN9A2D3J7P497YY8YEEPBY"
URL_V2 = "https://api.etherscan.io/v2/api"

# GUIDs from previous submission
GUIDS = {
    "Contract 1": "2f5p3sdcayr68rqprg8d73khanz7aqtxqcaytzweyierrjjq1e",
    "Contract 2": "t4mpwyvnfes73k5tfxfsvrmtfnpkrrw96vwqasfcu6jfmsguky"
}

print("Polling verification status with proper V2 API format...\n")

# Poll for 10 minutes
for attempt in range(60):
    time.sleep(10)
    
    for name, guid in GUIDS.items():
        try:
            # Proper V2 API call with chainid
            resp = requests.get(URL_V2, params={
                "apikey": API_KEY,
                "module": "contract",
                "action": "checkverifystatus",
                "guid": guid,
                "chainid": "1"  # Add chainid for V2 API!
            }, timeout=10)
            
            result = resp.json()
            status_msg = result.get('result', 'unknown')
            status_short = status_msg[:70] if len(status_msg) > 70 else status_msg
            
            print(f"[{attempt+1:2d}] {name}: {status_short}")
            
            # Check for completion
            if "verified" in status_msg.lower() or "pass" in status_msg.lower():
                print(f"    >>> VERIFIED! <<<")
            elif "fail" in status_msg.lower():
                print(f"    >>> FAILED <<<")
        except Exception as e:
            print(f"[{attempt+1:2d}] {name}: Error - {str(e)[:50]}")

print("\nPolling complete. Check https://etherscan.io/contractsVerified")
