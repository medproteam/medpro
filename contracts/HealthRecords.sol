// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract HealthRecords {
    struct MedicationSchedule {
        string medicationName;
        string dosage;
        uint256 frequency;
        uint256 startTime;
        uint256 endTime;
        bool active;
    }
    
    struct VitalRecord {
        uint256 timestamp;
        uint256 heartRate;
        uint256 bloodPressureSystolic;
        uint256 bloodPressureDiastolic;
        uint256 temperature;
        uint256 oxygenSaturation;
    }
    
    struct HealthProfile {
        address patient;
        string encryptedDataHash;
        uint256 createdAt;
        uint256 updatedAt;
    }
    
    struct Subscription {
        uint256 amount;
        uint256 startDate;
        uint256 endDate;
        string subscriptionType;
        bool active;
    }
    
    mapping(address => HealthProfile) public profiles;
    mapping(address => MedicationSchedule[]) public medications;
    mapping(address => VitalRecord[]) public vitals;
    mapping(address => mapping(address => bool)) public authorizedProviders;
    mapping(address => Subscription) public subscriptions;
    
    address public owner;
    uint256 public totalRevenue;
    
    event ProfileCreated(address indexed patient, uint256 timestamp);
    event ProfileUpdated(address indexed patient, uint256 timestamp);
    event MedicationAdded(address indexed patient, string medicationName);
    event VitalRecorded(address indexed patient, uint256 timestamp);
    event ProviderAuthorized(address indexed patient, address indexed provider);
    event ProviderRevoked(address indexed patient, address indexed provider);
    event SubscriptionPaid(address indexed user, uint256 amount, uint256 endDate, string subscriptionType);
    event FundsWithdrawn(address indexed owner, uint256 amount);
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyPatient() {
        require(profiles[msg.sender].patient == msg.sender, "Not authorized");
        _;
    }
    
    modifier onlyAuthorized(address _patient) {
        require(
            msg.sender == _patient || authorizedProviders[_patient][msg.sender],
            "Not authorized"
        );
        _;
    }
    
    function createProfile(string memory _encryptedDataHash) external {
        require(profiles[msg.sender].patient == address(0), "Profile exists");
        
        profiles[msg.sender] = HealthProfile({
            patient: msg.sender,
            encryptedDataHash: _encryptedDataHash,
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });
        
        emit ProfileCreated(msg.sender, block.timestamp);
    }
    
    function updateProfile(string memory _encryptedDataHash) external onlyPatient {
        profiles[msg.sender].encryptedDataHash = _encryptedDataHash;
        profiles[msg.sender].updatedAt = block.timestamp;
        
        emit ProfileUpdated(msg.sender, block.timestamp);
    }
    
    function addMedication(
        string memory _name,
        string memory _dosage,
        uint256 _frequency,
        uint256 _startTime,
        uint256 _endTime
    ) external onlyPatient {
        medications[msg.sender].push(MedicationSchedule({
            medicationName: _name,
            dosage: _dosage,
            frequency: _frequency,
            startTime: _startTime,
            endTime: _endTime,
            active: true
        }));
        
        emit MedicationAdded(msg.sender, _name);
    }
    
    function recordVitals(
        uint256 _heartRate,
        uint256 _bpSystolic,
        uint256 _bpDiastolic,
        uint256 _temperature,
        uint256 _oxygenSat
    ) external onlyPatient {
        vitals[msg.sender].push(VitalRecord({
            timestamp: block.timestamp,
            heartRate: _heartRate,
            bloodPressureSystolic: _bpSystolic,
            bloodPressureDiastolic: _bpDiastolic,
            temperature: _temperature,
            oxygenSaturation: _oxygenSat
        }));
        
        emit VitalRecorded(msg.sender, block.timestamp);
    }
    
    function authorizeProvider(address _provider) external onlyPatient {
        authorizedProviders[msg.sender][_provider] = true;
        emit ProviderAuthorized(msg.sender, _provider);
    }
    
    function revokeProvider(address _provider) external onlyPatient {
        authorizedProviders[msg.sender][_provider] = false;
        emit ProviderRevoked(msg.sender, _provider);
    }
    
    function getProfile(address _patient) 
        external 
        view 
        onlyAuthorized(_patient) 
        returns (HealthProfile memory) 
    {
        return profiles[_patient];
    }
    
    function getMedications(address _patient) 
        external 
        view 
        onlyAuthorized(_patient) 
        returns (MedicationSchedule[] memory) 
    {
        return medications[_patient];
    }
    
    function getVitals(address _patient) 
        external 
        view 
        onlyAuthorized(_patient) 
        returns (VitalRecord[] memory) 
    {
        return vitals[_patient];
    }
    
    function getMedicationCount(address _patient) 
        external 
        view 
        returns (uint256) 
    {
        return medications[_patient].length;
    }
    
    function getVitalsCount(address _patient) 
        external 
        view 
        returns (uint256) 
    {
        return vitals[_patient].length;
    }
    
    // Payable function to accept subscription payments
    function paySubscription(uint256 _durationDays, string memory _subscriptionType) 
        external 
        payable 
    {
        require(msg.value > 0, "Payment required");
        require(_durationDays > 0, "Invalid duration");
        
        uint256 endDate = block.timestamp + (_durationDays * 1 days);
        
        subscriptions[msg.sender] = Subscription({
            amount: msg.value,
            startDate: block.timestamp,
            endDate: endDate,
            subscriptionType: _subscriptionType,
            active: true
        });
        
        totalRevenue += msg.value;
        
        emit SubscriptionPaid(msg.sender, msg.value, endDate, _subscriptionType);
    }
    
    // Check if user has active subscription
    function hasActiveSubscription(address _user) 
        external 
        view 
        returns (bool) 
    {
        return subscriptions[_user].active && 
               subscriptions[_user].endDate > block.timestamp;
    }
    
    // Get subscription details
    function getSubscription(address _user) 
        external 
        view 
        returns (Subscription memory) 
    {
        return subscriptions[_user];
    }
    
    // Owner can withdraw collected funds
    function withdraw() external {
        require(msg.sender == owner, "Only owner");
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds");
        
        payable(owner).transfer(balance);
        
        emit FundsWithdrawn(owner, balance);
    }
    
    // Fallback to receive CAMP
    receive() external payable {
        totalRevenue += msg.value;
    }
}