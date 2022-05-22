async function  loaddocuments() {

    accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    contract = await $.getJSON('../Auth.json');
    contractAddress = localStorage.getItem('contractAddress')

    web3 = new Web3(window.ethereum);
    Authcontract = new web3.eth.Contract(contract.abi, contractAddress); 

    // doctorCount =parseInt( await Authcontract.methods.doctorCount.call().call())

    // doctorAddresses =[];
    // for (let i = 0; i < doctorCount; i++){
    // doctorAddresses.push(await Authcontract.methods.doctorAddresses(i).call())
    // }

    const table = document.getElementById("documentTable");

    let i=0;
    res = await Authcontract.methods.patient_documents(accounts[0], i).call();
    if(res.patient_addr == "0x0000000000000000000000000000000000000000"){   
        document.getElementById("tableBody").innerHTML = "<td id='filling' colspan='4'>No documents found!</td>";
    }else if(res.patient_addr == addr){
        document.getElementById("tableBody").innerHTML = "<td id='filling' colspan='4'></td>";
    }
    while(res.patient_addr != "0x0000000000000000000000000000000000000000"){
        let row = table.insertRow();
        let doctorName = row.insertCell(0);
        doc = await Authcontract.methods.users(res.doctor_addr).call();
        doctorName.innerHTML = doc.firstName+" "+doc.lastName;
        let Date = row.insertCell(1);
        Date.innerHTML =  res.date
        let Type = row.insertCell(2);
        Type.innerHTML =  res.document_type;
        let Link = row.insertCell(3);
        Link.innerHTML =  "<a href='#'>"+res.document_link+"</a>";
        i++;
	    res = await Authcontract.methods.patient_documents(accounts[0], i).call()
    }
//     doctorAddresses.forEach( async(item) => {
//         let row = table.insertRow();
//         let FullName = row.insertCell(0);
//         res = await Authcontract.methods.users(item).call();
//         FullName.innerHTML = res.firstName+" "+res.lastName;
//         let Gender = row.insertCell(1);
//         Gender.innerHTML =  res.gender
//         let Email = row.insertCell(2);
//         Email.innerHTML =  res.email;
        
// });
}

$( ()=>{
    $(window).on("Load", loaddocuments())
  })