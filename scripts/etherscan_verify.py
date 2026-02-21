#!/usr/bin/env python3
"""
Etherscan Smart Contract Verification Script
Submits TetherToken contract source code for verification on Etherscan

Requirements:
- Python 3.6+
- requests library: pip install requests
- Valid Etherscan API Key from https://etherscan.io/apis

Usage:
    python etherscan_verify.py --key YOUR_ETHERSCAN_API_KEY --contract 0x419ecA43dB68E868E68d1aB460c8AC32523c7540

"""

import requests
import json
import time
import argparse
import sys
from pathlib import Path


class EtherscanVerifier:
    """Submits Solidity contracts for verification on Etherscan"""
    
    # Etherscan API endpoints
    API_MAINNET = "https://api.etherscan.io/api"
    
    # Contract details
    CONTRACT_NAME = "TetherToken"
    COMPILER_VERSION = "v0.4.18"
    OPTIMIZATION_ENABLED = "1"
    OPTIMIZATION_RUNS = "200"
    SPDX_LICENSE = "MIT"
    
    # Contract addresses
    CONTRACTS = {
        "0x419ecA43dB68E868E68d1aB460c8AC32523c7540": {
            "name": "TetherToken",
            "symbol": "USDT",
            "decimals": 6
        },
        "0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11": {
            "name": "TetherToken", 
            "symbol": "USDT",
            "decimals": 6
        }
    }
    
    # Constructor arguments (ABI-encoded)
    CONSTRUCTOR_ARGS = "000000000000000000000000000000000000000000000000000000e8d4a5100000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000003555344000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000045553445400000000000000000000000000000000000000000000000000000000"
    
    def __init__(self, api_key, source_code_file="contracts/TetherToken.sol"):
        """
        Initialize the verifier
        
        Args:
            api_key (str): Etherscan API key
            source_code_file (str): Path to Solidity source file
        """
        self.api_key = api_key
        self.source_code_file = source_code_file
        self.source_code = None
        self.session = requests.Session()
        
    def load_source_code(self):
        """Load source code from file"""
        try:
            with open(self.source_code_file, 'r', encoding='utf-8') as f:
                self.source_code = f.read()
            print(f"✅ Source code loaded: {len(self.source_code)} characters")
            return True
        except FileNotFoundError:
            print(f"❌ Error: File not found: {self.source_code_file}")
            return False
        except Exception as e:
            print(f"❌ Error reading file: {e}")
            return False
    
    def submit_verification(self, contract_address):
        """
        Submit contract for verification
        
        Args:
            contract_address (str): Ethereum address of contract to verify
            
        Returns:
            dict: API response
        """
        
        if not self.source_code:
            print("❌ Source code not loaded!")
            return None
        
        # Prepare payload
        payload = {
            "apikey": self.api_key,
            "module": "contract",
            "action": "verifysourcecode",
            "contractaddress": contract_address,
            "sourceCode": self.source_code,
            "codeformat": "solidity-single-file",
            "contractname": self.CONTRACT_NAME,
            "compilerversion": self.COMPILER_VERSION,
            "optimizationUsed": self.OPTIMIZATION_ENABLED,
            "runs": self.OPTIMIZATION_RUNS,
            "constructorArguements": self.CONSTRUCTOR_ARGS,
            "licenseType": "MIT"
        }
        
        print(f"\n📤 Submitting verification for: {contract_address}")
        print(f"   Contract: {self.CONTRACT_NAME}")
        print(f"   Compiler: {self.COMPILER_VERSION}")
        print(f"   Optimization: Enabled ({self.OPTIMIZATION_RUNS} runs)")
        
        try:
            response = self.session.post(
                self.API_MAINNET,
                data=payload,
                timeout=30
            )
            response.raise_for_status()
            
            result = response.json()
            
            if result.get("status") == "1":
                guid = result.get("result")
                print(f"✅ Submitted successfully!")
                print(f"   GUID: {guid}")
                return {
                    "status": "SUCCESS",
                    "guid": guid,
                    "address": contract_address
                }
            else:
                print(f"❌ Submission failed!")
                print(f"   Message: {result.get('message', 'Unknown error')}")
                print(f"   Result: {result.get('result', 'No details')}")
                return {
                    "status": "FAILED",
                    "error": result.get("result", "Unknown error"),
                    "address": contract_address
                }
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Network error: {e}")
            return {
                "status": "ERROR",
                "error": str(e),
                "address": contract_address
            }
    
    def check_verification_status(self, guid):
        """
        Check verification status using GUID
        
        Args:
            guid (str): Submission GUID from initial submission
            
        Returns:
            dict: Current status
        """
        payload = {
            "apikey": self.api_key,
            "module": "contract",
            "action": "checkverifystatus",
            "guid": guid
        }
        
        try:
            response = self.session.get(
                self.API_MAINNET,
                params=payload,
                timeout=10
            )
            response.raise_for_status()
            
            result = response.json()
            
            if result.get("status") == "1":
                status = result.get("result", [{}])[0].get("isvalid")
                if status == "1":
                    print(f"✅ Contract verified successfully!")
                    return {"status": "VERIFIED", "guid": guid}
                elif status == "0":
                    print(f"⏳ Still processing... Try again in a few seconds")
                    return {"status": "PENDING", "guid": guid}
            else:
                print(f"⚠️ Status: {result.get('message', 'Unknown')}")
                return {"status": "UNKNOWN", "guid": guid}
                
        except Exception as e:
            print(f"❌ Error checking status: {e}")
            return {"status": "ERROR", "error": str(e), "guid": guid}
    
    def verify_all_contracts(self):
        """Submit all contracts for verification"""
        
        results = []
        
        print("\n" + "="*60)
        print("ETHERSCAN CONTRACT VERIFICATION")
        print("="*60)
        
        # Load source code
        if not self.load_source_code():
            return results
        
        # Submit each contract
        for address in self.CONTRACTS.keys():
            result = self.submit_verification(address)
            results.append(result)
            
            # Small delay between submissions
            time.sleep(2)
        
        return results
    
    def print_results(self, results):
        """Print verification results"""
        
        print("\n" + "="*60)
        print("VERIFICATION RESULTS")
        print("="*60)
        
        for result in results:
            if result["status"] == "SUCCESS":
                print(f"\n✅ {result['address']}")
                print(f"   Status: Submitted")
                print(f"   GUID: {result['guid']}")
                print(f"   Check status: https://etherscan.io/address/{result['address']}")
            elif result["status"] == "FAILED":
                print(f"\n❌ {result['address']}")
                print(f"   Status: Failed")
                print(f"   Error: {result['error']}")
            else:
                print(f"\n⚠️ {result['address']}")
                print(f"   Status: {result['status']}")
                if "error" in result:
                    print(f"   Error: {result['error']}")
        
        print("\n" + "="*60)
        print("NEXT STEPS:")
        print("="*60)
        print("1. Visit https://etherscan.io/address/{CONTRACT_ADDRESS}")
        print("2. Look for 'Contract Source Code Verified' message")
        print("3. Source code should appear in the Contract tab")
        print("4. ABI will be auto-populated")
        print("5. Verification usually takes 30-60 seconds")
        print("="*60 + "\n")


def main():
    """Main entry point"""
    
    parser = argparse.ArgumentParser(
        description="Verify TetherToken contracts on Etherscan",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Verify both contracts
  python etherscan_verify.py --key YOUR_API_KEY
  
  # Verify specific contract
  python etherscan_verify.py --key YOUR_API_KEY --contract 0x419ecA43dB68E868E68d1aB460c8AC32523c7540
  
  # Use custom source code file
  python etherscan_verify.py --key YOUR_API_KEY --source contracts/TetherToken.sol
        """
    )
    
    parser.add_argument(
        "--key",
        required=True,
        help="Etherscan API key (get from https://etherscan.io/apis)",
        metavar="API_KEY"
    )
    
    parser.add_argument(
        "--contract",
        help="Specific contract address to verify",
        metavar="ADDRESS"
    )
    
    parser.add_argument(
        "--source",
        default="contracts/TetherToken.sol",
        help="Path to Solidity source file (default: contracts/TetherToken.sol)",
        metavar="FILE"
    )
    
    parser.add_argument(
        "--check-guid",
        help="Check verification status using GUID",
        metavar="GUID"
    )
    
    args = parser.parse_args()
    
    # Create verifier
    verifier = EtherscanVerifier(args.key, args.source)
    
    # Check if just checking status
    if args.check_guid:
        print(f"Checking verification status for GUID: {args.check_guid}")
        status = verifier.check_verification_status(args.check_guid)
        print(f"Status: {status}")
        return
    
    # If specific contract provided, verify only that one
    if args.contract:
        if not verifier.load_source_code():
            sys.exit(1)
        result = verifier.submit_verification(args.contract)
        verifier.print_results([result])
    else:
        # Verify all contracts
        results = verifier.verify_all_contracts()
        verifier.print_results(results)


if __name__ == "__main__":
    main()
