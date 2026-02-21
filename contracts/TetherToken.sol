// SPDX-License-Identifier: MIT
pragma solidity ^0.4.18;

/**
 * @title TetherToken - Consolidated and Optimized
 * @dev Complete implementation combining all contract components
 * @author USDT Team
 */

// ============================================================================
// LIBRARIES AND UTILITIES
// ============================================================================

/**
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
 */
library SafeMath {
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }
        uint256 c = a * b;
        assert(c / a == b);
        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a / b;
        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }
}

// ============================================================================
// INTERFACES AND STANDARDS
// ============================================================================

/**
 * @title ERC20Basic
 * @dev Simpler version of ERC20 interface
 */
contract ERC20Basic {
    function totalSupply() public constant returns (uint);
    function balanceOf(address who) public view returns (uint256);
    function transfer(address to, uint256 value) public returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
}

/**
 * @title ERC20
 * @dev ERC20 interface with allowance functionality
 */
contract ERC20 is ERC20Basic {
    function allowance(address owner, address spender) public view returns (uint256);
    function transferFrom(address from, address to, uint256 value) public returns (bool);
    function approve(address spender, uint256 value) public returns (bool);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

// ============================================================================
// BASE CONTRACTS
// ============================================================================

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 */
contract Ownable {
    address public owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    function Ownable() public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0));
        OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}

/**
 * @title BasicToken
 * @dev Basic version of StandardToken, with no allowances
 */
contract BasicToken is ERC20Basic {
    using SafeMath for uint256;

    mapping(address => uint256) balances;

    /**
     * @dev Transfer token for a specified address
     */
    function transfer(address _to, uint256 _value) public returns (bool) {
        require(_to != address(0));
        require(_value <= balances[msg.sender]);

        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to] = balances[_to].add(_value);
        Transfer(msg.sender, _to, _value);
        return true;
    }

    /**
     * @dev Gets the balance of the specified address
     */
    function balanceOf(address _owner) public view returns (uint256 balance) {
        return balances[_owner];
    }
}

/**
 * @title StandardToken
 * @dev Implementation of the basic standard token with full ERC20 interface
 */
contract StandardToken is ERC20, BasicToken {
    using SafeMath for uint256;

    mapping(address => mapping(address => uint256)) internal allowed;

    /**
     * @dev Transfer tokens from one address to another
     */
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
        require(_to != address(0));
        require(_value <= balances[_from]);
        require(_value <= allowed[_from][msg.sender]);

        balances[_from] = balances[_from].sub(_value);
        balances[_to] = balances[_to].add(_value);
        allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);
        Transfer(_from, _to, _value);
        return true;
    }

    /**
     * @dev Approve the passed address to spend the specified amount of tokens
     */
    function approve(address _spender, uint256 _value) public returns (bool) {
        allowed[msg.sender][_spender] = _value;
        Approval(msg.sender, _spender, _value);
        return true;
    }

    /**
     * @dev Function to check the amount of tokens that an owner allowed to a spender
     */
    function allowance(address _owner, address _spender) public view returns (uint256) {
        return allowed[_owner][_spender];
    }

    /**
     * @dev Increase the amount of tokens that an owner allowed to a spender
     */
    function increaseApproval(address _spender, uint _addedValue) public returns (bool) {
        allowed[msg.sender][_spender] = allowed[msg.sender][_spender].add(_addedValue);
        Approval(msg.sender, _spender, allowed[msg.sender][_spender]);
        return true;
    }

    /**
     * @dev Decrease the amount of tokens that an owner allowed to a spender
     */
    function decreaseApproval(address _spender, uint _subtractedValue) public returns (bool) {
        uint oldValue = allowed[msg.sender][_spender];
        if (_subtractedValue > oldValue) {
            allowed[msg.sender][_spender] = 0;
        } else {
            allowed[msg.sender][_spender] = oldValue.sub(_subtractedValue);
        }
        Approval(msg.sender, _spender, allowed[msg.sender][_spender]);
        return true;
    }
}

/**
 * @title StandardTokenWithFees
 * @dev StandardToken with transaction fee capability
 */
contract StandardTokenWithFees is StandardToken, Ownable {
    using SafeMath for uint256;

    uint256 public basisPointsRate = 0;
    uint256 public maximumFee = 0;
    uint256 constant MAX_SETTABLE_BASIS_POINTS = 20;
    uint256 constant MAX_SETTABLE_FEE = 50;

    string public name;
    string public symbol;
    uint8 public decimals;
    uint public _totalSupply;

    uint public constant MAX_UINT = 2**256 - 1;

    /**
     * @dev Calculate transaction fee
     */
    function calcFee(uint _value) constant returns (uint) {
        uint fee = (_value.mul(basisPointsRate)).div(10000);
        if (fee > maximumFee) {
            fee = maximumFee;
        }
        return fee;
    }

    /**
     * @dev Transfer tokens with fees
     */
    function transfer(address _to, uint _value) public returns (bool) {
        uint fee = calcFee(_value);
        uint sendAmount = _value.sub(fee);

        super.transfer(_to, sendAmount);
        if (fee > 0) {
            super.transfer(owner, fee);
        }
        return true;
    }

    /**
     * @dev TransferFrom tokens with fees
     */
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
        require(_to != address(0));
        require(_value <= balances[_from]);
        require(_value <= allowed[_from][msg.sender]);

        uint fee = calcFee(_value);
        uint sendAmount = _value.sub(fee);

        balances[_from] = balances[_from].sub(_value);
        balances[_to] = balances[_to].add(sendAmount);
        if (allowed[_from][msg.sender] < MAX_UINT) {
            allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);
        }
        Transfer(_from, _to, sendAmount);
        if (fee > 0) {
            balances[owner] = balances[owner].add(fee);
            Transfer(_from, owner, fee);
        }
        return true;
    }

    /**
     * @dev Set transaction fee parameters
     */
    function setParams(uint newBasisPoints, uint newMaxFee) public onlyOwner {
        require(newBasisPoints < MAX_SETTABLE_BASIS_POINTS);
        require(newMaxFee < MAX_SETTABLE_FEE);

        basisPointsRate = newBasisPoints;
        maximumFee = newMaxFee.mul(uint(10)**decimals);

        Params(basisPointsRate, maximumFee);
    }

    event Params(uint feeBasisPoints, uint maxFee);
}

/**
 * @title Pausable
 * @dev Base contract which allows children to implement an emergency stop mechanism
 */
contract Pausable is Ownable {
    event Pause();
    event Unpause();

    bool public paused = false;

    modifier whenNotPaused() {
        require(!paused);
        _;
    }

    modifier whenPaused() {
        require(paused);
        _;
    }

    function pause() onlyOwner whenNotPaused public {
        paused = true;
        Pause();
    }

    function unpause() onlyOwner whenPaused public {
        paused = false;
        Unpause();
    }
}

/**
 * @title BlackList
 * @dev Manages a blacklist of addresses
 */
contract BlackList is Ownable {
    mapping(address => bool) public isBlackListed;

    event AddedBlackList(address indexed _user);
    event RemovedBlackList(address indexed _user);

    function getBlackListStatus(address _maker) external constant returns (bool) {
        return isBlackListed[_maker];
    }

    function addBlackList(address _evilUser) public onlyOwner {
        isBlackListed[_evilUser] = true;
        AddedBlackList(_evilUser);
    }

    function removeBlackList(address _clearedUser) public onlyOwner {
        isBlackListed[_clearedUser] = false;
        RemovedBlackList(_clearedUser);
    }
}

// ============================================================================
// MAIN CONTRACTS
// ============================================================================

/**
 * @title UpgradedStandardToken
 * @dev Interface for upgraded token contract versions
 */
contract UpgradedStandardToken is StandardToken {
    uint public _totalSupply;
    function transferByLegacy(address from, address to, uint value) public returns (bool);
    function transferFromByLegacy(address sender, address from, address spender, uint value) public returns (bool);
    function approveByLegacy(address from, address spender, uint value) public returns (bool);
    function increaseApprovalByLegacy(address from, address spender, uint addedValue) public returns (bool);
    function decreaseApprovalByLegacy(address from, address spender, uint subtractedValue) public returns (bool);
}

/**
 * @title TetherToken
 * @dev Complete implementation of Tether (USDT) token
 * Features:
 * - ERC20 compliant
 * - Pausable functionality
 * - Blacklist management
 * - Transaction fees support
 * - Contract upgrade mechanism
 * - Token issuance and redemption
 */
contract TetherToken is Pausable, StandardTokenWithFees, BlackList {
    using SafeMath for uint256;

    address public upgradedAddress;
    bool public deprecated;

    // Events
    event Issue(uint amount);
    event Redeem(uint amount);
    event Deprecate(address newAddress);
    event DestroyedBlackFunds(address indexed _blackListedUser, uint _balance);

    /**
     * @dev Initialize the TetherToken contract
     * @param _initialSupply Initial supply of tokens
     * @param _name Token name
     * @param _symbol Token symbol
     * @param _decimals Decimal places
     */
    function TetherToken(uint _initialSupply, string _name, string _symbol, uint8 _decimals) public {
        _totalSupply = _initialSupply;
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        balances[owner] = _initialSupply;
        deprecated = false;
    }

    /**
     * @dev Transfer tokens (forwards to upgraded contract if deprecated)
     */
    function transfer(address _to, uint _value) public whenNotPaused returns (bool) {
        require(!isBlackListed[msg.sender]);
        if (deprecated) {
            return UpgradedStandardToken(upgradedAddress).transferByLegacy(msg.sender, _to, _value);
        } else {
            return super.transfer(_to, _value);
        }
    }

    /**
     * @dev TransferFrom tokens (forwards to upgraded contract if deprecated)
     */
    function transferFrom(address _from, address _to, uint _value) public whenNotPaused returns (bool) {
        require(!isBlackListed[_from]);
        if (deprecated) {
            return UpgradedStandardToken(upgradedAddress).transferFromByLegacy(msg.sender, _from, _to, _value);
        } else {
            return super.transferFrom(_from, _to, _value);
        }
    }

    /**
     * @dev Get balance of address (forwards to upgraded contract if deprecated)
     */
    function balanceOf(address who) public constant returns (uint) {
        if (deprecated) {
            return UpgradedStandardToken(upgradedAddress).balanceOf(who);
        } else {
            return super.balanceOf(who);
        }
    }

    /**
     * @dev Get balance at time of deprecation
     */
    function oldBalanceOf(address who) public constant returns (uint) {
        if (deprecated) {
            return super.balanceOf(who);
        }
    }

    /**
     * @dev Approve spending (forwards to upgraded contract if deprecated)
     */
    function approve(address _spender, uint _value) public whenNotPaused returns (bool) {
        if (deprecated) {
            return UpgradedStandardToken(upgradedAddress).approveByLegacy(msg.sender, _spender, _value);
        } else {
            return super.approve(_spender, _value);
        }
    }

    /**
     * @dev Increase approval (forwards to upgraded contract if deprecated)
     */
    function increaseApproval(address _spender, uint _addedValue) public whenNotPaused returns (bool) {
        if (deprecated) {
            return UpgradedStandardToken(upgradedAddress).increaseApprovalByLegacy(msg.sender, _spender, _addedValue);
        } else {
            return super.increaseApproval(_spender, _addedValue);
        }
    }

    /**
     * @dev Decrease approval (forwards to upgraded contract if deprecated)
     */
    function decreaseApproval(address _spender, uint _subtractedValue) public whenNotPaused returns (bool) {
        if (deprecated) {
            return UpgradedStandardToken(upgradedAddress).decreaseApprovalByLegacy(msg.sender, _spender, _subtractedValue);
        } else {
            return super.decreaseApproval(_spender, _subtractedValue);
        }
    }

    /**
     * @dev Get allowance (forwards to upgraded contract if deprecated)
     */
    function allowance(address _owner, address _spender) public constant returns (uint remaining) {
        if (deprecated) {
            return StandardToken(upgradedAddress).allowance(_owner, _spender);
        } else {
            return super.allowance(_owner, _spender);
        }
    }

    /**
     * @dev Get total supply (forwards to upgraded contract if deprecated)
     */
    function totalSupply() public constant returns (uint) {
        if (deprecated) {
            return StandardToken(upgradedAddress).totalSupply();
        } else {
            return _totalSupply;
        }
    }

    /**
     * @dev Issue new tokens
     */
    function issue(uint amount) public onlyOwner {
        require(amount > 0);
        balances[owner] = balances[owner].add(amount);
        _totalSupply = _totalSupply.add(amount);
        Issue(amount);
        Transfer(address(0), owner, amount);
    }

    /**
     * @dev Redeem tokens
     */
    function redeem(uint amount) public onlyOwner {
        require(amount > 0);
        require(amount <= _totalSupply);
        _totalSupply = _totalSupply.sub(amount);
        balances[owner] = balances[owner].sub(amount);
        Redeem(amount);
        Transfer(owner, address(0), amount);
    }

    /**
     * @dev Deprecate current contract in favor of a new one
     */
    function deprecate(address _upgradedAddress) public onlyOwner {
        require(_upgradedAddress != address(0));
        deprecated = true;
        upgradedAddress = _upgradedAddress;
        Deprecate(_upgradedAddress);
    }

    /**
     * @dev Destroy blacklisted funds
     */
    function destroyBlackFunds(address _blackListedUser) public onlyOwner {
        require(isBlackListed[_blackListedUser]);
        uint dirtyFunds = balanceOf(_blackListedUser);
        balances[_blackListedUser] = 0;
        _totalSupply = _totalSupply.sub(dirtyFunds);
        DestroyedBlackFunds(_blackListedUser, dirtyFunds);
    }
}

// ============================================================================
// OPTIONAL: MULTISIG WALLET (Separate Deployment)
// ============================================================================

/**
 * @title MultiSigWallet
 * @dev Multisignature wallet implementation
 * @author Stefan George
 */
contract MultiSigWallet {
    uint constant public MAX_OWNER_COUNT = 50;

    event Confirmation(address indexed sender, uint indexed transactionId);
    event Revocation(address indexed sender, uint indexed transactionId);
    event Submission(uint indexed transactionId);
    event Execution(uint indexed transactionId);
    event ExecutionFailure(uint indexed transactionId);
    event Deposit(address indexed sender, uint value);
    event OwnerAddition(address indexed owner);
    event OwnerRemoval(address indexed owner);
    event RequirementChange(uint required);

    mapping(uint => Transaction) public transactions;
    mapping(uint => mapping(address => bool)) public confirmations;
    mapping(address => bool) public isOwner;
    address[] public owners;
    uint public required;
    uint public transactionCount;

    struct Transaction {
        address destination;
        uint value;
        bytes data;
        bool executed;
    }

    modifier onlyWallet() {
        require(msg.sender == address(this));
        _;
    }

    modifier ownerDoesNotExist(address owner) {
        require(!isOwner[owner]);
        _;
    }

    modifier ownerExists(address owner) {
        require(isOwner[owner]);
        _;
    }

    modifier transactionExists(uint transactionId) {
        require(transactions[transactionId].destination != 0);
        _;
    }

    modifier confirmed(uint transactionId, address owner) {
        require(confirmations[transactionId][owner]);
        _;
    }

    modifier notConfirmed(uint transactionId, address owner) {
        require(!confirmations[transactionId][owner]);
        _;
    }

    modifier notExecuted(uint transactionId) {
        require(!transactions[transactionId].executed);
        _;
    }

    modifier notNull(address _address) {
        require(_address != 0);
        _;
    }

    modifier validRequirement(uint ownerCount, uint _required) {
        require(ownerCount <= MAX_OWNER_COUNT && _required <= ownerCount && _required != 0 && ownerCount != 0);
        _;
    }

    function()
        payable
    {
        if (msg.value > 0)
            Deposit(msg.sender, msg.value);
    }

    function MultiSigWallet(address[] _owners, uint _required)
        public
        validRequirement(_owners.length, _required)
    {
        for (uint i = 0; i < _owners.length; i++) {
            require(!isOwner[_owners[i]] && _owners[i] != 0);
            isOwner[_owners[i]] = true;
        }
        owners = _owners;
        required = _required;
    }

    function addOwner(address owner)
        public
        onlyWallet
        ownerDoesNotExist(owner)
        notNull(owner)
        validRequirement(owners.length + 1, required)
    {
        isOwner[owner] = true;
        owners.push(owner);
        OwnerAddition(owner);
    }

    function removeOwner(address owner)
        public
        onlyWallet
        ownerExists(owner)
    {
        isOwner[owner] = false;
        for (uint i = 0; i < owners.length - 1; i++)
            if (owners[i] == owner) {
                owners[i] = owners[owners.length - 1];
                break;
            }
        owners.length -= 1;
        if (required > owners.length)
            changeRequirement(owners.length);
        OwnerRemoval(owner);
    }

    function replaceOwner(address owner, address newOwner)
        public
        onlyWallet
        ownerExists(owner)
        ownerDoesNotExist(newOwner)
    {
        for (uint i = 0; i < owners.length; i++)
            if (owners[i] == owner) {
                owners[i] = newOwner;
                break;
            }
        isOwner[owner] = false;
        isOwner[newOwner] = true;
        OwnerRemoval(owner);
        OwnerAddition(newOwner);
    }

    function changeRequirement(uint _required)
        public
        onlyWallet
        validRequirement(owners.length, _required)
    {
        required = _required;
        RequirementChange(_required);
    }

    function submitTransaction(address destination, uint value, bytes data)
        public
        returns (uint)
    {
        uint transactionId = addTransaction(destination, value, data);
        confirmTransaction(transactionId);
        return transactionId;
    }

    function confirmTransaction(uint transactionId)
        public
        ownerExists(msg.sender)
        transactionExists(transactionId)
        notConfirmed(transactionId, msg.sender)
    {
        confirmations[transactionId][msg.sender] = true;
        Confirmation(msg.sender, transactionId);
        executeTransaction(transactionId);
    }

    function revokeConfirmation(uint transactionId)
        public
        ownerExists(msg.sender)
        confirmed(transactionId, msg.sender)
        notExecuted(transactionId)
    {
        confirmations[transactionId][msg.sender] = false;
        Revocation(msg.sender, transactionId);
    }

    function executeTransaction(uint transactionId)
        public
        notExecuted(transactionId)
    {
        if (isConfirmed(transactionId)) {
            Transaction tx = transactions[transactionId];
            tx.executed = true;
            if (tx.destination.call.value(tx.value)(tx.data))
                Execution(transactionId);
            else {
                ExecutionFailure(transactionId);
                tx.executed = false;
            }
        }
    }

    function isConfirmed(uint transactionId)
        public
        constant
        returns (bool)
    {
        uint count = 0;
        for (uint i = 0; i < owners.length; i++) {
            if (confirmations[transactionId][owners[i]])
                count += 1;
            if (count == required)
                return true;
        }
    }

    function addTransaction(address destination, uint value, bytes data)
        internal
        notNull(destination)
        returns (uint)
    {
        uint transactionId = transactionCount;
        transactions[transactionId] = Transaction({
            destination: destination,
            value: value,
            data: data,
            executed: false
        });
        transactionCount += 1;
        Submission(transactionId);
        return transactionId;
    }

    function getConfirmationCount(uint transactionId)
        public
        constant
        returns (uint)
    {
        uint count = 0;
        for (uint i = 0; i < owners.length; i++)
            if (confirmations[transactionId][owners[i]])
                count += 1;
        return count;
    }

    function getTransactionCount(bool pending, bool executed)
        public
        constant
        returns (uint)
    {
        uint count = 0;
        for (uint i = 0; i < transactionCount; i++)
            if (pending && !transactions[i].executed || executed && transactions[i].executed)
                count += 1;
        return count;
    }

    function getOwners()
        public
        constant
        returns (address[])
    {
        return owners;
    }

    function getConfirmations(uint transactionId)
        public
        constant
        returns (address[])
    {
        address[] memory confirmationsTemp = new address[](owners.length);
        uint count = 0;
        uint i;
        for (i = 0; i < owners.length; i++)
            if (confirmations[transactionId][owners[i]]) {
                confirmationsTemp[count] = owners[i];
                count += 1;
            }
        address[] memory _confirmations = new address[](count);
        for (i = 0; i < count; i++)
            _confirmations[i] = confirmationsTemp[i];
        return _confirmations;
    }

    function getTransactionIds(uint from, uint to, bool pending, bool executed)
        public
        constant
        returns (uint[])
    {
        uint[] memory transactionIdsTemp = new uint[](transactionCount);
        uint count = 0;
        uint i;
        for (i = 0; i < transactionCount; i++)
            if (pending && !transactions[i].executed || executed && transactions[i].executed) {
                transactionIdsTemp[count] = i;
                count += 1;
            }
        uint[] memory _transactionIds = new uint[](to - from);
        for (i = from; i < to; i++)
            _transactionIds[i - from] = transactionIdsTemp[i];
        return _transactionIds;
    }
}
