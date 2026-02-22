#!/usr/bin/env python3
"""Compare bytecodes removing 0x prefix"""
import json

# Load on-chain bytecode (has 0x prefix)
with open("bytecode_0x419ecA43dB68E868E68d1aB460c8AC32523c7540.txt", "r") as f:
    on_chain = f.read().strip()

# Remove 0x prefix if present
if on_chain.startswith("0x"):
    on_chain = on_chain[2:]

# Load compiled bytecode
with open("artifacts/TetherToken-Complete.json", "r") as f:
    artifact = json.load(f)
    compiled = artifact.get('runtimeBytecode', '')

print(f"After removing '0x' prefix:")
print(f"On-chain   length: {len(on_chain)}")
print(f"Compiled   length: {len(compiled)}")
print(f"Match: {on_chain == compiled}")

if on_chain != compiled:
    print(f"\nDifference length: {len(on_chain) - len(compiled)}")
    
    # Find first difference
    min_len = min(len(on_chain), len(compiled))
    for i in range(min_len):
        if on_chain[i] != compiled[i]:
            print(f"\nFirst diff at position {i}:")
            start = max(0, i-30)
            print(f"  On-chain:  ...{on_chain[start:i+30]}...")
            print(f"  Compiled:  ...{compiled[start:i+30]}...")
            print(f"\n  On-chain char:  '{on_chain[i]}'")
            print(f"  Compiled char:  '{compiled[i]}'")
            break
    
    # Check if one is longer
    if len(on_chain) != len(compiled):
        print(f"\nLength mismatch at end:")
        print(f"  On-chain   last 50: ...{on_chain[-50:]}")
        print(f"  Compiled   last 50: ...{compiled[-50:]}")
else:
    print("\n✓✓ BYTECODES MATCH PERFECTLY!")
