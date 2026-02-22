#!/usr/bin/env python3
"""Compare on-chain bytecode with compiled bytecode"""
import requests
import json

# Get on-chain bytecode from Etherscan
api_key = "32XVVRWZ67YAZN9A2D3J7P497YY8YEEPBY"
address1 = "0x419ecA43dB68E868E68d1aB460c8AC32523c7540"
address2 = "0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11"

url = "https://api.etherscan.io/v2/api"

print("Fetching on-chain bytecode from Etherscan...\n")

for name, address in [("Contract 1", address1), ("Contract 2", address2)]:
    print(f"\n{'='*70}")
    print(f"{name}: {address}")
    print(f"{'='*70}")
    
    try:
        # Get bytecode from Etherscan
        resp = requests.get(url, params={
            "apikey": api_key,
            "module": "proxy",
            "action": "eth_getCode",
            "address": address,
            "tag": "latest",
            "chainid": "1"
        }, timeout=10)
        
        result = resp.json()
        on_chain_bytecode = result.get('result', '')
        
        if on_chain_bytecode:
            print(f"\nOn-chain bytecode length: {len(on_chain_bytecode)} chars")
            print(f"First 100 chars:  {on_chain_bytecode[:100]}")
            print(f"Last 100 chars:   {on_chain_bytecode[-100:]}")
            
            # Save to file for analysis
            with open(f"bytecode_{address}.txt", "w") as f:
                f.write(on_chain_bytecode)
            print(f"\nSaved to bytecode_{address}.txt")
        else:
            print(f"Error: {result.get('message', 'No bytecode found')}")
    except Exception as e:
        print(f"Error fetching bytecode: {e}")

# Load our compiled bytecode from artifact
print(f"\n\n{'='*70}")
print("Comparing with compiled bytecode")
print(f"{'='*70}\n")

try:
    with open("artifacts/TetherToken-Complete.json", "r") as f:
        artifact = json.load(f)
        compiled_bytecode = artifact.get('runtimeBytecode', '')
        
    print(f"Compiled bytecode length: {len(compiled_bytecode)} chars")
    print(f"First 100 chars:  {compiled_bytecode[:100]}")
    print(f"Last 100 chars:   {compiled_bytecode[-100:]}")
    
    # Compare with Contract 1
    print(f"\n\nBytecode Comparison:")
    print(f"{'='*70}")
    
    with open("bytecode_0x419ecA43dB68E868E68d1aB460c8AC32523c7540.txt", "r") as f:
        on_chain1 = f.read().strip()
    
    if on_chain1 == compiled_bytecode:
        print("✓ MATCH - On-chain bytecode matches compiled bytecode!")
    else:
        print("✗ MISMATCH - Bytecodes are different")
        print(f"\n  On-chain   length: {len(on_chain1)}")
        print(f"  Compiled   length: {len(compiled_bytecode)}")
        print(f"  Length diff:      {len(on_chain1) - len(compiled_bytecode)}")
        
        # Find first difference
        for i, (c1, c2) in enumerate(zip(on_chain1, compiled_bytecode)):
            if c1 != c2:
                print(f"\n  First difference at position {i}:")
                print(f"    On-chain:  ...{on_chain1[max(0,i-20):i+20]}...")
                print(f"    Compiled:  ...{compiled_bytecode[max(0,i-20):i+20]}...")
                break

except Exception as e:
    print(f"Error: {e}")
