async function  loadProfileName() {
    contract = await $.getJSON('../Auth.json');
    contractAddress = localStorage.getItem('contractAddress')

    web3 = new Web3(window.ethereum);
    Authcontract = new web3.eth.Contract(contract.abi, contractAddress);
    accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    
    res = await Authcontract.methods.users(accounts[0]).call();
    document.getElementById("profileName").innerHTML= res.firstName +" "+ res.lastName;
    document.getElementById("profileName2").innerHTML= res.firstName +" "+ res.lastName;
    document.getElementById("NavbarName").innerHTML= res.firstName +" "+ res.lastName;
}

$( ()=>{
    $(window).on("Load", loadProfileName())
  })