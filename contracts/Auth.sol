pragma solidity >=0.4.0 ;

contract Auth {

    address ownerAddress;
    uint docCount = 0;
    uint public patientCount = 0;
    uint public doctorCount = 0;
    uint public AdminCount = 0;

    constructor() public {
        ownerAddress = msg.sender;
        users[ownerAddress].addr = ownerAddress;
        users[ownerAddress].role = UserRole.AdminOwner;
        users[ownerAddress].firstName = "Admin";
        users[ownerAddress].lastName = "Owner";
    }

    modifier onlyOwner() {
        require(msg.sender == ownerAddress);
        _;
    }

    modifier onlyAdmin() {
        require(users[msg.sender].role == UserRole.Admin || users[msg.sender].role == UserRole.AdminOwner);
        _;
    }

    modifier notAdmin() {
        require(users[msg.sender].role != UserRole.Admin);
        _;
    }

    event contactInfoUpdated(
        address addr,
        string email
    );
    event getRoleEvent(
        UserRole role
    );

    event UserRegistered(
        address addr,
        string email
    );

    event PatientInfoUpdated(
        address addr,
        string email
    );

    event DocumentAdded(
        address doctor_addr,
        address patient_addr,
        uint document_id
    );

    mapping(address => UserInfo) public users;
    mapping(address => PatientInfo) public patients;
    mapping(address => DoctorInfo) public doctors;
    mapping(uint => address) public patientAddresses;
    mapping(uint => address) public doctorAddresses;
    mapping(uint => address) public adminAddresses;
    mapping(uint => Document) public documents;
    mapping(address => mapping(uint => Document)) public patient_documents;

    enum UserRole{Patient, Doctor, Admin, Anon, AdminOwner}

     struct UserInfo{
        address addr;
        string firstName;
        string lastName;
        string email;
        string phoneNum;
        string DOB;
        string gender;
        UserRole role;
    }

    struct AdminInfo{
        address addr;
    
    }
    
    struct PatientInfo{
        address addr;
        string homeAddress;
        string weight;
        string height;
        string allergies;
        string chronic_illness;
        uint patient_docCount;
    }

    struct DoctorInfo{
         address addr;
         string speciality;
         string Institution;
         string workAddress;
    }

    struct Document{
        address patient_addr;
        address doctor_addr;
        string document_type;
        string document_description;
        uint document_id;
        string document_link;
        string date;
    }

    function registerPatient(
        address  _address,
        string memory _firstName,
        string memory _lastName,
        string memory _email,
        string memory _phoneNum,
        string memory _DOB,
        string memory _homeAddress,
        string memory _gender
    ) public onlyAdmin {
        users[_address]= UserInfo(_address, _firstName, _lastName, _email, _phoneNum, _DOB, _gender, UserRole.Patient);
        patientAddresses[patientCount]= _address;
        patients[_address]=PatientInfo(_address, _homeAddress,"Not Set","Not Set","Not Set","Not Set", 0);
        patientCount++;
        emit UserRegistered(_address, _email);    
    }

    function registerAdmin(
        address  _address,
        string memory _firstName,
        string memory _lastName,
        string memory _email,
        string memory _phoneNum,
        string memory _DOB,
        string memory _gender
    ) public onlyOwner {
        users[_address]= UserInfo(_address, _firstName, _lastName, _email, _phoneNum, _DOB, _gender, UserRole.Admin);
        adminAddresses[AdminCount]= _address;
        AdminCount++;
        emit UserRegistered(_address, _email);    
    }


        function registerDoctor(
        address  _address,
        string memory _firstName,
        string memory _lastName,
        string memory _speciality,
        string memory _institution,
        string memory _email,
        string memory _phoneNum,
        string memory _DOB,
        string memory _workAddress,
        string memory _gender
    ) public onlyAdmin {
        users[_address]= UserInfo(_address, _firstName, _lastName, _email, _phoneNum, _DOB, _gender, UserRole.Doctor);
        doctors[_address] = DoctorInfo(_address, _speciality, _institution, _workAddress);
        doctorAddresses[doctorCount] = _address;
        doctorCount++;
        emit UserRegistered(_address, _email);    
    }

    function addPatientInfo(
        address  _addr,
        string memory _weight,
        string memory _height,
        string memory _allergies,
        string memory _chronic_illness
    ) public {
        require(users[msg.sender].role == UserRole.Doctor);
        require(users[_addr].role == UserRole.Patient);
        patients[_addr]= PatientInfo(_addr, patients[_addr].homeAddress, _weight, _height, _allergies, _chronic_illness, patients[_addr].patient_docCount);
        emit PatientInfoUpdated(_addr, users[_addr].email);  
    }

    function checkRegister(address _addr) public view returns (bool) {
        return users[_addr].addr == _addr;
    }

    function isAdmin(address _addr) public view returns (bool) {
        return users[_addr].role == UserRole.Admin;
    }

    function isOwner() public view returns (bool) {
        return msg.sender == ownerAddress;
    }

    function isDoctor(address _addr) public view returns (bool) {
        return users[_addr].role == UserRole.Doctor;
    }

    
    

    function Add_document(
        address  _patient_addr, 
        string memory _document_type,
        string memory _document_link,
        string memory _document_description,
        string memory _date
    ) public {
        require(users[msg.sender].role == UserRole.Doctor);
        require(users[_patient_addr].role == UserRole.Patient);
        uint _doc_id = patients[_patient_addr].patient_docCount;
        patient_documents[_patient_addr][_doc_id] = Document(_patient_addr, msg.sender, _document_type, _document_description, docCount,  _document_link, _date);
        patients[_patient_addr].patient_docCount++;
        emit DocumentAdded(msg.sender, _patient_addr, _doc_id);
    }

    function updateContactInfo(
        string memory _email,
        string memory _phoneNum,
        string memory _homeAddress
    ) public {
        users[msg.sender].email = _email;
        users[msg.sender].phoneNum = _phoneNum;
        if(users[msg.sender].role== UserRole.Doctor){
            doctors[msg.sender].workAddress=_homeAddress;
        }else if(users[msg.sender].role== UserRole.Patient){
            patients[msg.sender].homeAddress = _homeAddress;
        }
        emit contactInfoUpdated(msg.sender, _email);   
    }

    function getRole(
        address _addr
    ) public view returns (UserRole){
        if(users[_addr].addr == _addr){
            return users[_addr].role;
        }else{
           return UserRole.Anon;
        }
    }
    
}
