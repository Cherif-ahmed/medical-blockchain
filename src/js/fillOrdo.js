async function fillOrdo(){
    contract = await $.getJSON('../Auth.json');
    contractAddress = localStorage.getItem('contractAddress')

    web3 = new Web3(window.ethereum);
    Authcontract = new web3.eth.Contract(contract.abi, contractAddress);
    accounts = await ethereum.request({ method: 'eth_requestAccounts' });

    patAddr = getUrlVars()["addr"];
    
    docInfo = await Authcontract.methods.users(accounts[0]).call();
    patInfo = await Authcontract.methods.users(patAddr).call();
    const patDob = new Date(patInfo.DOB);
    const now = new Date();
    const patAge = now.getFullYear() - patDob.getFullYear();

    docExtinfo = await Authcontract.methods.doctors(accounts[0]).call();
    
    //doctor info
    let speciality = document.getElementById("speciality");
    speciality.innerHTML = docExtinfo.speciality;
    address = docExtinfo.workAddress;
    let docName = document.getElementById("docName");
    docName.innerHTML = docInfo.firstName+docInfo.lastName;
    let phoneNum = document.getElementById("phoneNum");
    phoneNum.innerHTML =  docInfo.phoneNum;
    let email = document.getElementById("docEmail");
    email.innerHTML =  docInfo.email;
    let homeAddress = document.getElementById("inputAddress");
    homeAddress.innerHTML =  address;
    //patient info
    let Nom = document.getElementById("nom");
    Nom.innerHTML =  "Nom: "+ patInfo.firstName;
    let Prenom = document.getElementById("prenom");
    Prenom.innerHTML =  "Prenom: "+ patInfo.lastName;
    let DOB = document.getElementById("age");
    DOB.innerHTML =  "Age: "+ patAge;
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

$( ()=>{
    $(window).on("Load", fillOrdo())
  })