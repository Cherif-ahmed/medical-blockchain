//Add patient from address parameter 
async function  loadPatInfo(addr) {
    contract = await $.getJSON('../RegistrationReq.json');
    contractAddress = "0x72Bd1ee1Da85609f5AfE54969847d0EBea03F208"

    web3 = new Web3(window.ethereum);
    Authcontract = new web3.eth.Contract(contract.abi, contractAddress); 

    pat_info = await Authcontract.methods.registrationRequests(addr).call();
    $('#firstName').val(pat_info.firstName);
    $('#lastName').val(pat_info.lastName);
    $('#phoneNum').val(pat_info.phoneNum);
    $('#DOB').val(pat_info.DOB);
    $('#homeAddress').val(pat_info.homeAddress);
    const radioButtons = document.querySelectorAll('input[name="genderRadios"]');
    for (const radioButton of radioButtons) {
        if(radioButton.value == pat_info.gender){
            radioButton.checked = true;
        }
    }
    $('#email').val( pat_info.email);
    $('#address').val(pat_info.addr);

}


function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

$( ()=>{
    $(window).on("Load", loadPatInfo(getUrlVars()["addr"]))
  })