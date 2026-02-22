#!/usr/bin/env python3
import requests
import json
import time

API_KEY = "32XVVRWZ67YAZN9A2D3J7P497YY8YEEPBY"
URL_V2 = "https://api.etherscan.io/v2/api"

# Read source
with open("contracts/TetherToken.sol", "r") as f:
    source = f.read()

# Build payload for Contract 1
stdj = {"language": "Solidity", "sources": {"TetherToken.sol": {"content": source}}, "settings": {"optimizer": {"enabled": True, "runs": 200}, "outputSelection": {"*": {"*": ["abi", "evm.bytecode"]}}}}

payload1 = {
    "apikey": API_KEY, "module": "contract", "action": "verifysourcecode",
    "chainid": "1", "contractaddress": "0x419ecA43dB68E868E68d1aB460c8AC32523c7540",
    "sourceCode": json.dumps(stdj), "codeformat": "solidity-standard-json-input",
    "contractname": "TetherToken.sol:TetherToken", "compilerversion": "v0.4.18+commit.9cf6e910",
    "optimizationUsed": "1", "runs": "200"
}

print("Submitting Contract 1...")
r1 = requests.post(URL_V2, data=payload1, timeout=10)
res1 = r1.json()
print(f"Status: {res1.get('status')}")
print(f"Message: {res1.get('message')}")
guid1 = res1.get('result')
print(f"GUID: {guid1}")

# Submit Contract 2
payload2 = dict(payload1)
payload2["contractaddress"] = "0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11"

print("\nSubmitting Contract 2...")
r2 = requests.post(URL_V2, data=payload2, timeout=10)
res2 = r2.json()
print(f"Status: {res2.get('status')}")
print(f"Message: {res2.get('message')}")
guid2 = res2.get('result')
print(f"GUID: {guid2}")

# Save GUIDs to file for monitoring
with open("verification_guids.txt", "w") as f:
    f.write(f"Contract 1 (0x419ecA43dB68E868E68d1aB460c8AC32523c7540): {guid1}\n")
    f.write(f"Contract 2 (0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11): {guid2}\n")
    f.write(f"Check status at: https://etherscan.io/contractsVerified\n")

print("\nGUIDs saved to verification_guids.txt")
print("Polling for 2 minutes...")

# Brief poll (2 minutes)
guids = [(guid1, "Contract 1"), (guid2, "Contract 2")]
for attempt in range(12):  # 2 minutes (10 sec * 12)
    time.sleep(10)
    for guid, name in guids:
        try:
            resp = requests.get(URL_V2, params={
                "apikey": API_KEY, "module": "contract", "action": "checkverifystatus", "guid": guid
            }, timeout=10)
            result = resp.json().get('result', 'unknown')[:60]
            print(f"[{attempt+1:2d}] {name}: {result}")
        except:
            pass

print("\nVerification in progress. Check verification_guids.txt for GUIDs.")
