async function loadReport(){
    var x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    
    contract = await $.getJSON('../Auth.json');
    contractAddress = localStorage.getItem('contractAddress')

    web3 = new Web3(window.ethereum);
    Authcontract = new web3.eth.Contract(contract.abi, contractAddress);
    accounts = await ethereum.request({ method: 'eth_requestAccounts' });

    AdminCount =parseInt( await Authcontract.methods.AdminCount.call().call())
    patientCount =parseInt( await Authcontract.methods.patientCount.call().call())
    doctorCount =parseInt( await Authcontract.methods.doctorCount.call().call())

    if(window.location.pathname.split("/")[1]=="AdminOwner"){
        document.getElementById("AdminNum").innerHTML= AdminCount
    }
    document.getElementById("PatientNum").innerHTML= patientCount
    document.getElementById("DoctorNum").innerHTML= doctorCount

}


$( ()=>{
    $(window).on("Load", loadReport())
  })