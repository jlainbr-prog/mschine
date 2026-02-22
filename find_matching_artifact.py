#!/usr/bin/env python3
"""Compare bytecodes from all TetherToken artifacts"""
import json

# We already know the on-chain bytecode (without 0x prefix)
with open("bytecode_0x419ecA43dB68E868E68d1aB460c8AC32523c7540.txt") as f:
    on_chain = f.read().strip()
    if on_chain.startswith("0x"):
        on_chain = on_chain[2:]

print(f"On-chain bytecode length: {len(on_chain)}")
print(f"On-chain bytecode  hash:  {hash(on_chain)}")
print()

artifacts = ["artifacts/TetherToken-Complete.json", "artifacts/TetherToken.json", "artifacts/TetherToken_metadata.json"]

for artifact_path in artifacts:
    print(f"\n{'='*70}")
    print(f"Artifact: {artifact_path}")
    print(f"{'='*70}")
    
    try:
        with open(artifact_path) as f:
            artifact = json.load(f)
        
        # Extract bytecodes from all possible fields
        bytecodes = {}
        
        if 'bytecode' in artifact:
            bytecodes['bytecode'] = artifact['bytecode']
        if 'runtimeBytecode' in artifact:
            bytecodes['runtimeBytecode'] = artifact['runtimeBytecode']
        if 'deployedBytecode' in artifact:
            bytecodes['deployedBytecode'] = artifact['deployedBytecode']
        
        # For metadata files, check nested structures
        if 'output' in artifact and 'contracts' in artifact['output']:
            for file_contracts in artifact['output']['contracts'].values():
                for contract_info in file_contracts.values():
                    if 'evm' in contract_info:
                        if 'bytecode' in contract_info['evm']:
                            bytecodes['evm.bytecode'] = contract_info['evm']['bytecode'].get('object', '')
                        if 'deployedBytecode' in contract_info['evm']:
                            bytecodes['evm.deployedBytecode'] = contract_info['evm']['deployedBytecode'].get('object', '')
        
        for field_name, bytecode in bytecodes.items():
            if bytecode:
                # Remove 0x prefix
                if isinstance(bytecode, str) and bytecode.startswith("0x"):
                    bytecode = bytecode[2:]
                
                length = len(bytecode)
                match = bytecode == on_chain
                
                symbol = "✓ MATCH" if match else "✗ DIFF"
                print(f"{field_name:25} | Length: {length:6} | {symbol}")
                
                if match:
                    print(f"{'':25}   ^^^ THIS IS THE CORRECT BYTECODE ^^^")
        
        if not bytecodes:
            print("No bytecode fields found in this artifact")
    
    except Exception as e:
        print(f"Error: {e}")
