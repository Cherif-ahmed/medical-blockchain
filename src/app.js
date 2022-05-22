App = {
  provider: new Web3.providers.HttpProvider("http://localhost:7545"),
  loading: false,
  contracts : {},
  load : async () =>{
    //loading app
    console.log("the app is loading")
    await App.loadWeb3()
    await App.loadBlockchainData()
    await App.loadContract()
    await App.render()
  },

   loadWeb3: function  () {
     console.log("loadWeb3")
     if (window.ethereum) {
       window.web3 = new Web3(window.ethereum)
        window.ethereum.enable()
     } else if (window.web3) {
       window.web3 = new Web3(window.web3.currentProvider)
     } else {
       window.alert(
         "Non-Ethereum browser detected. You should consider trying MetaMask!"
       )
       window.location.href =
         "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
     }
   },

   loadBlockchainData:  async ()=> {
    console.log("loadBlockchainData");
    // const web3 = window.web3;
    const webeProvider = web3.givenProvider || "http://localhost:7545"
    
    const accounts = await ethereum.request({ method: 'eth_accounts' });


    App.account = accounts[0]

    console.log(App.account);
  },

  loadContract: async () =>{
    console.log("loading contract")
    const appContract = await $.getJSON('Auth.json')
    App.contracts.Auth = TruffleContract(appContract)
    App.contracts.Auth.setProvider(App.provider)

    // App.todoList = await App.contracts.TodoList.deployed()
    App.auth = App.contracts.Auth.deployed()
  },

  

  constructor(props) {
    super.props
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      name: "",
      password: "",
      address: "",
      cnic: "",
    };
  },



  checkRegistration : async (event) => {
    try {
      console.log("Account: " + App.account);



      await App.auth.then(function(instance) {
        deployed = instance;
        return instance.checkRegister(
          $('#address').val(),
          {from: App.account, gas:3000000});

      }).then(function(result) {
        // Do something with the result or continue with more transactions.
        if(!result[0])
          console.log("user is not registered : " +result );
        
      });
    
    } catch (e) {
      console.log("User Already registered with this account, no?");
    }
  },

  
  PatientRegistration : async (event) => {
    try {
      console.log("Account: " + App.account);



      await App.auth.then(function(instance) {
        deployed = instance;
        return instance.registerUser(
          $('#address').val(),
          $('#firstName').val(),
          $('#lastName').val(),
          $('#email').val(),
          {from: App.account, gas:3000000});

      }).then(function(result) {
        // Do something with the result or continue with more transactions.
        if(!result[0])
          console.log("user not registered successfully: " );
        
      });
    
    } catch (e) {
      console.log("User Already registered with this account, no?"+e);
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