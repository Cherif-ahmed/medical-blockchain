async function  loadHealthInfo() {
    contract = await $.getJSON('../Auth.json');
    contractAddress = localStorage.getItem('contractAddress')

    web3 = new Web3(window.ethereum);
    Authcontract = new web3.eth.Contract(contract.abi, contractAddress); 
    accounts = await ethereum.request({ method: 'eth_requestAccounts' });

    health_info = await Authcontract.methods.patients(accounts[0]).call();
    let weight = document.getElementById("weight");
    weight.innerHTML = health_info.weight;
    let height = document.getElementById("height");
    height.innerHTML = health_info.height;
    let allergy = document.getElementById("allergy");
    allergy.innerHTML = health_info.allergies;
    let chronicIllness = document.getElementById("chronicIllness");
    chronicIllness.innerHTML = health_info.chronic_illness;
    $('#weight').val(health_info.weight);
    $('#height').val(health_info.height);
    $('#allergy').val( health_info.allergies);
    $('#chronicIllness').val(health_info.chronic_illness);

}






$( ()=>{
    $(window).on("Load", loadHealthInfo())
  })