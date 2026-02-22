#!/usr/bin/env python3
"""
Extract bytecode field from artifact  and check what we should submit
"""
import json

with open("artifacts/TetherToken-Complete.json") as f:
    artifact = json.load(f)

bytecode = artifact.get('bytecode', '')
runtime = artifact.get('runtimeBytecode', '')

# Remove 0x prefix
if bytecode.startswith("0x"):
    bytecode = bytecode[2:]
if runtime.startswith("0x"):
    runtime = runtime[2:]

print("Analyzing bytecode fields:\n")
print(f"Bytecode (constructor + runtime):")
print(f"  Length: {len(bytecode)}")
print(f"  First 100: {bytecode[:100]}")
print(f"  Last 100:  {bytecode[-100:]}")

print(f"\nRuntimeBytecode (just runtime):")
print(f"  Length: {len(runtime)}")
print(f"  First 100: {runtime[:100]}")
print(f"  Last 100:  {runtime[-100:]}")

# Load on-chain bytecode
with open("bytecode_0x419ecA43dB68E868E68d1aB460c8AC32523c7540.txt", "r") as f:
    on_chain = f.read().strip()
    if on_chain.startswith("0x"):
        on_chain = on_chain[2:]

print(f"\nOn-chain bytecode (from Etherscan):")
print(f"  Length: {len(on_chain)}")
print(f"  First 100: {on_chain[:100]}")
print(f"  Last 100:  {on_chain[-100:]}")

print(f"\n\nComparisons:")
print(f"  bytecode == on_chain:       {bytecode == on_chain}")
print(f"  runtime == on_chain:        {runtime == on_chain}")

# For standard-json approach, which one should be in sourceCode?
# Actually, in standard-json, we don't provide bytecode, we provide source code
# and Etherscan compiles it. So the issue is the SOURCE, not the bytecode field.

print(f"\n\nThe problem is likely in the SOURCE CODE itself.")
print(f"The on-chain bytecode doesn't match what our TetherToken.sol compiles to.")
print(f"This means our TetherToken.sol is NOT the exact original source.")
