#!/usr/bin/env python3
"""
Submit Solidity standard JSON input to Etherscan for verification.
Usage:
  python scripts/etherscan_verify_standardjson.py --key YOUR_API_KEY --address 0x...

This script:
- reads contracts/TetherToken.sol
- builds a solc standard-json input with optimizer runs=200
- submits to Etherscan with codeformat=solidity-standard-json-input
- polls verification status and prints the result

Notes:
- Requires `requests` (pip install requests)
"""
import argparse
import json
import time
import requests
from pathlib import Path

API_URL_V2 = "https://api.etherscan.io/v2/api"
SOURCE_PATH = Path("contracts/TetherToken.sol")
CONTRACT_FILE_NAME = "TetherToken.sol"
CONTRACT_NAME = "TetherToken"
COMPILER_VERSION = "v0.4.18"
OPTIMIZATION_USED = "1"
OPTIMIZATION_RUNS = "200"
# Constructor args from ETHERSCAN_VERIFICATION_DATA.md
CONSTRUCTOR_ARGS = "000000000000000000000000000000000000000000000000000000e8d4a5100000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000003555344000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000045553445400000000000000000000000000000000000000000000000000000000"


def build_standard_json(source_code: str):
    return {
        "language": "Solidity",
        "sources": {
            CONTRACT_FILE_NAME: {
                "content": source_code
            }
        },
        "settings": {
            "optimizer": {"enabled": True, "runs": int(OPTIMIZATION_RUNS)},
            "outputSelection": {
                "*": {"*": ["abi", "evm.bytecode", "evm.deployedBytecode", "metadata"]}
            }
        }
    }


def submit_standard_json(api_key: str, contract_address: str, standard_json: dict, constructor_args: str = ""):
    # Etherscan V2 API uses URL parameters, with chainid (1=Ethereum mainnet)
    params = {
        "apikey": api_key,
        "chainid": "1",
        "module": "contract",
        "action": "verifysourcecode",
        "contractaddress": contract_address,
        "sourceCode": json.dumps(standard_json),
        "codeformat": "solidity-standard-json-input",
        "contractname": f"{CONTRACT_FILE_NAME}:{CONTRACT_NAME}",
        "compilerversion": COMPILER_VERSION,
        "optimizationUsed": OPTIMIZATION_USED,
        "runs": OPTIMIZATION_RUNS,
    }
    if constructor_args:
        params["constructorArguements"] = constructor_args
    r = requests.post(API_URL_V2, data=params, timeout=60)
    return r.json()


def check_status(api_key: str, guid: str):
    params = {
        "apikey": api_key,
        "chainid": "1",
        "module": "contract",
        "action": "checkverifystatus",
        "guid": guid
    }
    r = requests.get(API_URL_V2, params=params, timeout=20)
    return r.json()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--key", required=True, help="Etherscan API Key")
    parser.add_argument("--address", required=True, help="Contract address to verify")
    parser.add_argument("--poll-seconds", type=int, default=5, help="Seconds between status polls")
    parser.add_argument("--timeout-mins", type=int, default=5, help="Total timeout minutes to wait for verification")
    args = parser.parse_args()

    if not SOURCE_PATH.exists():
        print(f"Error: source file not found: {SOURCE_PATH}")
        return 2

    source_code = SOURCE_PATH.read_text(encoding="utf-8")
    standard_json = build_standard_json(source_code)

    print("Submitting standard-json input to Etherscan (without constructor args)...")
    resp = submit_standard_json(args.key, args.address, standard_json, constructor_args="")
    print(json.dumps(resp, indent=2))

    if str(resp.get("status")) == "1":
        guid = resp.get("result")
        print(f"Submission GUID: {guid}")
        # Poll status
        timeout = time.time() + args.timeout_mins * 60
        while time.time() < timeout:
            time.sleep(args.poll_seconds)
            st = check_status(args.key, guid)
            print(json.dumps(st, indent=2))
            # Etherscan returns status 1 for success, 0 for pending or failure depending
            if st.get("status") == "1" and "Pass - Verified" in st.get("result", ""):
                print("✅ Contract verified successfully on Etherscan.")
                return 0
            if st.get("status") == "1" and st.get("result"):
                # Some responses embed text; check for Passed
                if "Verified" in st.get("result", "") or "Pass - Verified" in st.get("result", ""):
                    print("✅ Contract verified successfully on Etherscan.")
                    return 0
            # if status==0 and result contains error message, show and continue
            if st.get("status") == "0" and st.get("result") and "Pending in queue" in st.get("result"):
                print("⏳ Pending in queue, will poll again...")
                continue
        print("⚠️ Timeout waiting for verification. Check GUID later via Etherscan.")
        return 3
    else:
        print("❌ Submission failed:")
        print(resp.get("message"))
        print(resp.get("result"))
        return 4

if __name__ == '__main__':
    exit(main())
