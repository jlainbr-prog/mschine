#!/usr/bin/env python3
"""Find the correct 0.4.18 compiler version string from solc-bin"""
import requests

# Fetch the solc version list
print("Fetching solc version list from ethereum/solc-bin...")
response = requests.get('https://raw.githubusercontent.com/ethereum/solc-bin/gh-pages/bin/list.txt', timeout=10)

# Parse the list and find all 0.4.18 versions
lines = response.text.strip().split('\n')
v418_versions = [line for line in lines if '0.4.18' in line]

print(f"\nFound {len(v418_versions)} versions of solc 0.4.18:")
print("="*70)
for version in v418_versions:
    print(version)

if v418_versions:
    print("\n✓ Available 0.4.18 versions:")
    # Try the first one
    suggested = v418_versions[0]
    print(f"  Latest: {suggested}")

# Also check if 0.4.18 with +commit exists
commit_versions = [v for v in v418_versions if '+commit' in v]
if commit_versions:
    print(f"\n✓ With commit hash: {commit_versions[0]}")
