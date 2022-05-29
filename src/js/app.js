App = {
  provider: new Web3.providers.HttpProvider("http://localhost:7545"),
  loading: false,
  accounts : {},
  contractAddress : "0xf903630040d6038a845C8206C09c97512cbc3DC9",
  ContractAddress2 : "0x5868a1071E5Ac86966B2F817EC1B8e9670bfC8d2",
  role:-1,
  load : async () =>{
    //loading app
    console.log("the app is loading")
    localStorage.setItem('contractAddress', App.contractAddress);
    // localStorage.setItem('secondkey', App.contractAddress2);
    await App.loadBlockchainData()
    await App.render()
  },

   

   loadBlockchainData:  async ()=> {
     
    App.contract = await $.getJSON('../Auth.json');
    App.contract2 = await $.getJSON('../RegistrationReq.json');

    if (window.ethereum) {
      console.log("This is DAppp Environment");
      App.accounts = await ethereum.request({ method: 'eth_requestAccounts' }).then(console.log("Requesting metamask accounts..."))
      .catch((error) => {
        if (error.code === 4001) {
          // EIP-1193 userRejectedRequest error
          alert('Please connect with MetaMask to enter the App.');
        } else if(error.code === -32002){
          if(window.location.pathname != "/"){
          window.location.replace("/");
          console.log(window.location.pathname)
          }
        }
         else {
          console.error(error);
        }
      });

      web3 = new Web3(window.ethereum);
      App.Authcontract = new web3.eth.Contract(App.contract.  abi, App.contractAddress); // add your already defined abi and address in Contract(abi, address)
      App.Requestcontract = new web3.eth.Contract(App.contract2.abi, App.ContractAddress2); 
      await App.getRole(); 
      
} else {
        console.log("Please connect with metamask");
    }
   
  },

  getRole : async (addr) => {
    App.accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    switch(parseInt(await App.Authcontract.methods.getRole(App.accounts[0]).call())) {
      case 0:
        
        App.role="patient"
        break;
      case 1:
        App.role="doctor"
        break;
      case 2:
        // if (await App.Authcontract.methods.isOwner().call()){
        //   App.role="AdminOwner"
        // }else
        App.role="Admin"
        break;
      case 3:
        App.role="anon"
        break;
      case 4:
        App.role="AdminOwner"
        break;
      default:
        App.role="anon"
    } 
  },

  checkRegistration : async (addr) => {
    return await App.Authcontract.methods.checkRegister(addr)
    .call();
  },

  UpdateContactInfo : async (e) => {
    var info = await App.Authcontract.methods.users(App.accounts[0]).call();
    email = $('#email').val().length!=0 ? $('#email').val(): info.email
    phoneNum = $('#phoneNum').val().length!=0 ? $('#phoneNum').val(): info.phoneNum
    if(window.location.pathname.split("/")[1]=="patient"){
      user = await App.Authcontract.methods.patients(App.accounts[0]).call();
      homeAddress = $('#homeAddress').val().length!=0 ? $('#homeAddress').val(): user.homeAddress
  }else if(window.location.pathname.split("/")[1]=="doctor"){
      user = await App.Authcontract.methods.doctors(App.accounts[0]).call();
      homeAddress = $('#homeAddress').val().length!=0 ? $('#homeAddress').val(): user.homeAddress
  }
    
    var res = await App.Authcontract.methods.updateContactInfo(
      email, phoneNum, homeAddress).send({from: App.accounts[0], gas:3000000});
    if(res.events.contactInfoUpdated.returnValues.email == null){
      alert("Couldn't update information!")
    } else {
      document.getElementById("form_editContactInfo").reset()
      alert("Information Updated succesfully! \n new Email: "+ res.events.contactInfoUpdated.returnValues.email)
    }
  },



  PatientRegistration : async (event) => {
    event.preventDefault();
    form = document.getElementById("form_registerPatient");
    if (await App.checkRegistration($('#address').val())){

      alert("User Already registered with this address!")

    }else{
      const radioButtons = document.querySelectorAll('input[name="genderRadios"]');
              let selectedGender;
              for (const radioButton of radioButtons) {
                  if (radioButton.checked) {
                      selectedGender = radioButton.value;
                      break;
                  }
              }
        var res = await App.Authcontract.methods.registerPatient(
          $('#address').val(),
          $('#firstName').val(),
          $('#lastName').val(),
          $('#email').val(),
          $('#phoneNum').val(),
          $('#DOB').val(),
          $('#homeAddress').val(),
          selectedGender).send({from: App.accounts[0], gas:3000000});
      if(res.events.UserRegistered.returnValues.email == null){
        alert("user not registered")
      } else {
        // if(await App.Requestcontract.methods.hasRequestedRegistration($('#address').val()).call()){
        //   await App.Requestcontract.methods.deleteRegistrationRequest($('#address').val()).send({from: App.accounts[0], gas:3000000});
        // }
        form.reset()
        alert("Patient registered succesfully! \n Address: "+ res.events.UserRegistered.returnValues.addr)
      }
    }
  },
  
  sendRegistrationRequest : async (event) => {
    if (await App.Requestcontract.methods.hasRequestedRegistration(App.accounts[0]).call()){

      alert("Registeration request Already sent with this address!")

  }else{
    const radioButtons = document.querySelectorAll('input[name="genderRadios"]');
            let selectedGender;
            for (const radioButton of radioButtons) {
                if (radioButton.checked) {
                    selectedGender = radioButton.value;
                    break;
                }
            }
    var res = await App.Requestcontract.methods.AddRegistrationRequest(
      $('#firstName').val(),
      $('#lastName').val(),
      $('#email').val(),
      $('#phoneNum').val(),
      $('#DOB').val(),
      $('#homeAddress').val(),
      selectedGender).send({from: App.accounts[0], gas:3000000});
    if(res.events.RequestSent.returnValues.email == null){
      alert("Failed to send registration request")
    } else {
      document.getElementById("form_registerPatient").reset()
      alert(" Registration request sent succesfully! \n Address: "+ res.events.RequestSent.returnValues.addr)
    }
  }
  },

  AdminRegistration : async (event) => {
      event.preventDefault();
      if (await App.checkRegistration($('#address').val())){

        alert("User Already registered with this address!")

    }else{
      const radioButtons = document.querySelectorAll('input[name="genderRadios"]');
              let selectedGender;
              for (const radioButton of radioButtons) {
                  if (radioButton.checked) {
                      selectedGender = radioButton.value;
                      break;
                  }
              }
      var res = await App.Authcontract.methods.registerAdmin(
        $('#address').val(),
        $('#firstName').val(),
        $('#lastName').val(),
        $('#email').val(),
        $('#phoneNum').val(),
        $('#DOB').val(),
        selectedGender).send({from: App.accounts[0], gas:3000000});
      if(res.events.UserRegistered.returnValues.email == null){
        alert("user not registered")
      } else {
        document.getElementById("form_registerAdmin").reset()
        alert("Admin registered succesfully! \n Address: "+ res.events.UserRegistered.returnValues.addr)
      }
    }
  },

  
  DoctorRegistration : async (event) => {
    event.preventDefault();
    form = document.getElementById("form_registerDoctor");
    form.checkValidity();
    if (await App.checkRegistration($('#address').val())){
      alert("User Already registered with this address!")
  }else{
    
    const radioButtons = document.querySelectorAll('input[name="genderRadios"]');
            let selectedGender;
            for (const radioButton of radioButtons) {
                if (radioButton.checked) {
                    selectedGender = radioButton.value;
                    break;
                }
            }
    var res = await App.Authcontract.methods.registerDoctor(
      $('#address').val(),
      $('#firstName').val(),
      $('#lastName').val(),
      $('#speciality').val(),
      $('#institution').val(),
      $('#email').val(),
      $('#phoneNum').val(),
      $('#DOB').val(),
      $('#homeAddress').val(),
      selectedGender).send({from: App.accounts[0], gas:3000000});
    if(res.events.UserRegistered.returnValues.email == null){
      alert("user not registered")
    } else {
      form.reset()
      alert("Health Worker registered succesfully! \n Address: "+ res.events.UserRegistered.returnValues.addr)
    }
  }
  },

  render: async () => {
    // Prevent double render
    if (App.loading) {
      return
    }

    // Update app loading state
    App.setLoading(true)
    

    // Render Account
    $('#account').html(App.account)
    await App.getRole();
    if (window.ethereum) {
      if(App.role != window.location.pathname.split("/")[1]){
        window.location.replace("/"+App.role+"/index.html");
      }
      window.ethereum.on("accountsChanged", () => {
        console.log('test')
        console.log(App.accounts[0])

        window.location.reload();
      });
    }
    
    
    // Render Tasks
    // await App.renderTasks()

    // Update loading state
    App.setLoading(false);
  },

  setLoading: (boolean) => {
    App.loading = boolean
  }



}


$( ()=>{
  $(window).on("Load", App.load())
})