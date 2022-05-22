async function  loadAdminList() {

    contract = await $.getJSON('../Auth.json');
    contractAddress = localStorage.getItem('contractAddress')
    
    web3 = new Web3(window.ethereum);
    Authcontract = new web3.eth.Contract(contract.abi, contractAddress); 

    AdminCount =parseInt( await Authcontract.methods.AdminCount.call().call())

    AdminAddresses =[];
    for (let i = 0; i < AdminCount; i++){
    AdminAddresses.push(await Authcontract.methods.adminAddresses(i).call())
    }

    const table = document.getElementById("adminTable");
    AdminAddresses.forEach( async(item) => {
        let row = table.insertRow();
        let FullName = row.insertCell(0);
        res = await Authcontract.methods.users(item).call();
        FullName.innerHTML = res.firstName+" "+res.lastName;
        let Gender = row.insertCell(1);
        Gender.innerHTML =  res.gender
        let Email = row.insertCell(2);
        Email.innerHTML =  res.email;
        
});
}

$( ()=>{
    $(window).on("Load", loadAdminList())
  })