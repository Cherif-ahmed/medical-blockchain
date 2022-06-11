async function  loadPersonalInformation() {

    contract = await $.getJSON('../Auth.json');
    contractAddress = localStorage.getItem('contractAddress')

    web3 = new Web3(window.ethereum);
    Authcontract = new web3.eth.Contract(contract.abi, contractAddress);
    accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    
    res = await Authcontract.methods.users(accounts[0]).call();

    if(window.location.pathname.split("/")[1]=="patient"){
        info = await Authcontract.methods.patients(accounts[0]).call();
        address = info.homeAddress;
    }else if(window.location.pathname.split("/")[1]=="doctor"){
        info = await Authcontract.methods.doctors(accounts[0]).call();
        let speciality = document.getElementById("speciality");
        speciality.innerHTML = info.speciality;
        let institution = document.getElementById("institution");
        institution.innerHTML = info.Institution;
        address = info.workAddress;
    }
    document.getElementById("profileName").innerHTML= res.firstName +" "+ res.lastName;
    document.getElementById("profileName2").innerHTML= res.firstName +" "+ res.lastName;
    document.getElementById("NavbarName").innerHTML= res.firstName +" "+ res.lastName;
    document.getElementById("navEmail").innerHTML= res.email;
    let firstName = document.getElementById("firstName");
    firstName.innerHTML = res.firstName;
    let lastName = document.getElementById("lastName");
    lastName.innerHTML = res.lastName;
    let phoneNum = document.getElementById("phoneNum");
    phoneNum.innerHTML =  res.phoneNum;
    let DOB = document.getElementById("DOB");
    DOB.innerHTML =  res.DOB;
    let gender = document.getElementById("gender");
    gender.innerHTML =  res.gender;
    let email = document.getElementById("email");
    email.innerHTML =  res.email;
    let homeAddress = document.getElementById("homeAddress");
    homeAddress.innerHTML =  address;
        

}

$( ()=>{
    $(window).on("Load", loadPersonalInformation())
  })