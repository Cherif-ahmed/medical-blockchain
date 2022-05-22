async function  loadHealthInfo(addr) {
    contract = await $.getJSON('../Auth.json');
    contractAddress = localStorage.getItem('contractAddress')

    web3 = new Web3(window.ethereum);
    Authcontract = new web3.eth.Contract(contract.abi, contractAddress); 

    health_info = await Authcontract.methods.patients(addr).call();
    $('#weight').val(health_info.weight);
    $('#height').val(health_info.height);
    $('#allergy').val( health_info.allergies);
    $('#chronicIllness').val(health_info.chronic_illness);

}

async function  updateHealthInfo() {
    contract = await $.getJSON('../Auth.json');
    contractAddress = localStorage.getItem('contractAddress')

    web3 = new Web3(window.ethereum);
    Authcontract = new web3.eth.Contract(contract.abi, contractAddress); 
    addr = getUrlVars()["addr"];
    var res = await App.Authcontract.methods.addPatientInfo(addr, $('#weight').val(), $('#height').val(), 
      $('#allergy').val(), $('#chronicIllness').val()).send({from: App.accounts[0], gas:3000000});

      if(res.events.PatientInfoUpdated.returnValues.email == null){
        alert("Couldn't update information!")
      } else {
        loadHealthInfo(addr);
        alert("Information Updated succesfully! \n Patient Email: "+ res.events.PatientInfoUpdated.returnValues.email)
        history.back();
      }
}



function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

$( ()=>{
    $(window).on("Load", loadHealthInfo(getUrlVars()["addr"]))
  })