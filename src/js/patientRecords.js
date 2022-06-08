async function  loaddocuments(addr) {

    // accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    contract = await $.getJSON('../Auth.json');
    contractAddress = localStorage.getItem('contractAddress')

    web3 = new Web3(window.ethereum);
    Authcontract = new web3.eth.Contract(contract.abi, contractAddress); 

    // doctorCount =parseInt( await Authcontract.methods.doctorCount.call().call())

    // doctorAddresses =[];
    // for (let i = 0; i < doctorCount; i++){
    // doctorAddresses.push(await Authcontract.methods.doctorAddresses(i).call())
    // }
    if(await App.Authcontract.methods.checkRegister(addr).call()){
        loadHealthInfo(addr, Authcontract);

        const table = document.getElementById("documentTable");
        


        let i=0;
        res = await Authcontract.methods.patient_documents(addr, i).call();
        if(res.patient_addr == "0x0000000000000000000000000000000000000000"){   
            const button = document.getElementById("btn_addDocument");
            button.style.display="block";
            document.getElementById("tableBody").style= "text-align: center";
            document.getElementById("tableBody").innerHTML = "<td id='filling' colspan='4'>Patient has no documents!</td>";
        }else if(res.patient_addr == addr){
            const button = document.getElementById("btn_addDocument");
            button.style.display="block";
            document.getElementById("tableBody").style= "";
            document.getElementById("tableBody").innerHTML = "<td id='filling' colspan='4'></td>";

        }
        while(res.patient_addr != "0x0000000000000000000000000000000000000000"){
            document.getElementById("filling").style.display="none"
            let row = table.insertRow();
            let doctorName = row.insertCell(0);
            doc = await Authcontract.methods.users(res.doctor_addr).call();
            doctorName.innerHTML = doc.firstName+" "+doc.lastName;
            let Date = row.insertCell(1);
            Date.innerHTML =  res.date
            let Type = row.insertCell(2);
            Type.innerHTML =  res.document_type;
            let Link = row.insertCell(3);
            if(res.document_type=="Prescription / Ordonnance médicale"&&i>7){
                console.log("inside of fosajf"+res.document_link)
                Link.innerHTML =  "<a id='test' class='test' href='#'>preview</a><div id='testing' class='imgContainer hide'><img id='jojo"+i+"' src='' alt=''/></div>"
                await getBase64(res.document_link, i)

                     
            }else{
                Link.innerHTML =  "<a id='test' class='test' href='#'>preview</a><div id='testing' class='imgContainer hide'><img src='"+res.document_link+"' alt=''/></div>"
                
            }
            
            // "<a href='#'>"+res.document_link+"</a>";
            
            i++;
            res = await Authcontract.methods.patient_documents(addr, i).call()
        }
        preview();
    }else{
        alert("Patient Address not registered!")
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

function sleep(milliseconds) {  
    return new Promise(resolve => setTimeout(resolve, milliseconds));  
 } 

async function getBase64(link, id){
    data = null
    $.ajax({url:link,
        type:"GET", success:function(res){console.log(res); document.getElementById("jojo"+id).src = res.toString();}, error:function(res){console.log(res); }})
         
  
}

async function  loadHealthInfo(addr, contract) {
    const button = document.getElementById("btn_editHealthInfo");
    button.style.display="block";
    const link_editHealthInfo = document.getElementById("link_editHealthInfo");
    link_editHealthInfo.href= link_editHealthInfo.href +"?addr="+ addr;
    
    const link_addDocument = document.getElementById("link_addDocument");
    link_addDocument.href= link_addDocument.href +"?addr="+ addr;

    const table_health = document.getElementById("healthInfoTable");
    
    health_info = await contract.methods.patients(addr).call();
    let row = table_health.insertRow();
    let FullName = row.insertCell(0);
    patient = await contract.methods.users(addr).call();
    FullName.innerHTML = patient.firstName+" "+patient.lastName;
    let Weight = row.insertCell(1);
    Weight.innerHTML =  health_info.weight;
    let Height = row.insertCell(2);
    Height.innerHTML =  health_info.height;
    let Allergy = row.insertCell(3);
    Allergy.innerHTML =  health_info.allergies;
    let ChronicIllness = row.insertCell(4);
    ChronicIllness.innerHTML =  health_info.chronic_illness;
}

function preview(){
 button = document.querySelectorAll(".test");
const picture = document.querySelectorAll(".imgContainer");
const xButton = document.querySelector(".xButton");

 ximgContainer = document.querySelectorAll(".imgContainer");

for (let i = 0; i < button.length; i++) {
  button[i].addEventListener("click", () => {
    let nextSibling = button[i].nextElementSibling;
    nextSibling.classList.toggle("hide");
  })
}

for (let i = 0; i < ximgContainer.length; i++) {
ximgContainer[i].addEventListener("click", () => {
ximgContainer[i].classList.toggle("hide");
})
}


let fileInput = document.getElementById("file-input");
let imageContainer = document.getElementById("images");
let numOfFiles = document.getElementById("num-of-files");
}

// $( ()=>{
//     $(window).on("Load", loaddocuments())
//   })