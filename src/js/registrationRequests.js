async function loadRegistrationRequestList() {

    contract = await $.getJSON('../RegistrationReq.json');
    contractAddress =  "0x193998e3d4a5706Ffcb5a5fA4ddb1aedd7a92519";

    web3 = new Web3(window.ethereum);
    Authcontract = new web3.eth.Contract(contract.abi, contractAddress);

    RegistrationRequestCount = parseInt(await Authcontract.methods.registrationRequestsCount.call().call())

    RegistrationRequestAddresses = [];
    for (let i = 0; i < RegistrationRequestCount; i++) {
        RegistrationRequestAddresses.push(await Authcontract.methods.requestAddresses(i).call())
    }

    const table = document.getElementById("RegistrationRequestTable");
    RegistrationRequestAddresses.forEach(async (item) => {
        if(await Authcontract.methods.isDeleted(item).call()){
        
        }else{
        let row = table.insertRow();
        row.setAttribute("id", item);
        let FullName = row.insertCell(0);
        res = await Authcontract.methods.registrationRequests(item).call();
        FullName.innerHTML = res.firstName + " " + res.lastName;
        let Gender = row.insertCell(1);
        Gender.innerHTML = res.gender;
        let Email = row.insertCell(2);
        Email.innerHTML = res.email;
        let phoneNum = row.insertCell(3);
        phoneNum.innerHTML = res.phoneNum;
        let add = row.insertCell(4);
        del  = "<button onclick=deleteRegistrationRequest('"+res.addr+"') type='button' class='btn2 btn-outline-dark' style='margin-left: 10%; width:30%'><i class='icon-minus' style='margin-right:5%'></i>Discard request</button>";
        add.innerHTML = "<a href='addPatientRegRequest.html?addr=" + res.addr + "'><button type='button' class='btn2 btn-outline-dark' style='margin-left:15%;width:30%'><i class='icon-plus' style='margin-right:5%'></i>Add Patient</button></a>" +del;
        
        }

    });
}

async function deleteRegistrationRequest(addr) {

    contract = await $.getJSON('../RegistrationReq.json');
    contractAddress =  "0x193998e3d4a5706Ffcb5a5fA4ddb1aedd7a92519";
    accounts = await ethereum.request({ method: 'eth_requestAccounts' });


    web3 = new Web3(window.ethereum);
    Authcontract = new web3.eth.Contract(contract.abi, contractAddress);

    RegistrationRequestCount = parseInt(await Authcontract.methods.registrationRequestsCount.call().call())

    RegistrationRequestAddresses = [];
    for (let i = 0; i < RegistrationRequestCount; i++) {
        RegistrationRequestAddresses.push(await Authcontract.methods.requestAddresses(i).call())
    }
    Authcontract.methods.deleteRegistrationRequest(addr).send({from: accounts[0], gas:3000000});
    window.getElementById(addr).style.display = 'none';
    
}

$(() => {
    $(window).on("Load", loadRegistrationRequestList())
})