pragma solidity >=0.4.0 ;

contract RegistrationReq {

    uint public registrationRequestsCount = 0;

    mapping(address => RegistrationRequest) public registrationRequests;
    mapping(uint => address) public requestAddresses;
    mapping(address => uint) public requestIDs;
    mapping(address => bool) public deletedRequest;


    struct RegistrationRequest{
        address addr;
        string firstName;
        string lastName;
        string email;
        string phoneNum;
        string DOB;
        string homeAddress;
        string gender;
    }

    event RequestSent(
        address addr,
        string email
    );

    function AddRegistrationRequest(
        string memory _firstName,
        string memory _lastName,
        string memory _email,
        string memory _phoneNum,
        string memory _DOB,
        string memory _homeAddress,
        string memory _gender
    ) public {
        registrationRequests[msg.sender] = RegistrationRequest(msg.sender, _firstName, _lastName,
             _email, _phoneNum, _DOB, _homeAddress, _gender);
        deletedRequest[msg.sender] = false;
        requestAddresses[registrationRequestsCount] = msg.sender;
        requestIDs[msg.sender] = registrationRequestsCount;
        registrationRequestsCount++;
        emit RequestSent(msg.sender, _email);    
    }

    function hasRequestedRegistration(address _addr) public view returns (bool) {
        return registrationRequests[_addr].addr == _addr;
    }

    function isDeleted(address _addr) public view returns (bool) {
        return deletedRequest[_addr];
    }

    function deleteRegistrationRequest(address _addr) public {
        deletedRequest[_addr] = true;
    }


}