// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AdherenceToken {
    string public name = "MEDPRO Adherence Token";
    string public symbol = "MADT";
    uint8 public decimals = 0;
    uint256 public totalSupply;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    mapping(address => uint256) public adherenceStreak;
    mapping(address => uint256) public lastCheckIn;
    
    address public healthRecordsContract;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event StreakUpdated(address indexed patient, uint256 streak);
    event RewardEarned(address indexed patient, uint256 amount);
    
    constructor(address _healthRecordsContract) {
        healthRecordsContract = _healthRecordsContract;
    }
    
    function _mint(address _to, uint256 _amount) internal {
        totalSupply += _amount;
        balanceOf[_to] += _amount;
        emit Transfer(address(0), _to, _amount);
    }
    
    function checkIn() external {
        uint256 daysSinceLastCheckIn = (block.timestamp - lastCheckIn[msg.sender]) / 1 days;
        
        if (daysSinceLastCheckIn == 1) {
            adherenceStreak[msg.sender] += 1;
        } else if (daysSinceLastCheckIn > 1) {
            adherenceStreak[msg.sender] = 1;
        }
        
        lastCheckIn[msg.sender] = block.timestamp;
        
        uint256 reward = calculateReward(adherenceStreak[msg.sender]);
        if (reward > 0) {
            _mint(msg.sender, reward);
            emit RewardEarned(msg.sender, reward);
        }
        
        emit StreakUpdated(msg.sender, adherenceStreak[msg.sender]);
    }
    
    function calculateReward(uint256 _streak) public pure returns (uint256) {
        if (_streak < 7) return 1;
        if (_streak < 30) return 2;
        if (_streak < 90) return 5;
        return 10;
    }
    
    function transfer(address _to, uint256 _value) external returns (bool) {
        require(balanceOf[msg.sender] >= _value, "Insufficient balance");
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
    
    function approve(address _spender, uint256 _value) external returns (bool) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
    
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) external returns (bool) {
        require(balanceOf[_from] >= _value, "Insufficient balance");
        require(allowance[_from][msg.sender] >= _value, "Insufficient allowance");
        
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        
        emit Transfer(_from, _to, _value);
        return true;
    }
    
    function getStreak(address _patient) external view returns (uint256) {
        return adherenceStreak[_patient];
    }
}