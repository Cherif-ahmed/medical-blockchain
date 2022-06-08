
async function  onSubmit() {
    contract = await $.getJSON('../Auth.json');
    contractAddress = localStorage.getItem('contractAddress')
    accounts = await ethereum.request({ method: 'eth_requestAccounts' });

    web3 = new Web3(window.ethereum);
    Authcontract = new web3.eth.Contract(contract.abi, contractAddress); 
    addr = getUrlVars()["addr"];
    link = await uploadDocument();


    var res = await Authcontract.methods.Add_document(addr, $('#docType').val(), link, 
      $('#docDecsription').val(), $('#docDate').val()).send({from: accounts[0], gas:3000000});

      if(res.events.DocumentAdded.returnValues.patient_addr == null){
        alert("Couldn't update information!")
      } else {
        alert("Information Updated succesfully! \n Patient Email: "+ res.events.DocumentAdded.returnValues.patient_addr)
        history.back();
      }
}

async function  onSubmitOrdo() {
  contract = await $.getJSON('../Auth.json');
  contractAddress = localStorage.getItem('contractAddress')
  accounts = await ethereum.request({ method: 'eth_requestAccounts' });

  web3 = new Web3(window.ethereum);
  Authcontract = new web3.eth.Contract(contract.abi, contractAddress); 
  addr = getUrlVars()["addr"];
  var element = document.getElementById('Ordonnance');
  var opt = {
          margin: 0,
          jsPDF:        { unit: 'mm', format: [130.5,180.5], orientation: 'portrait' }
      };
  const resul = await html2pdf().set(opt).from(element).outputImg('datauri');
  // console.log(res)
  const result = await App2.ipfs.add(resul);
  link = "https://ipfs.io/ipfs/"+result.path;
  console.log(link)


  var res = await Authcontract.methods.Add_document(addr, $('#docType').val(), link, 
    $('#docDecsription').val(), $('#docDate').val()).send({from: accounts[0], gas:3000000});

    if(res.events.DocumentAdded.returnValues.patient_addr == null){
      alert("Couldn't update information!")
    } else {
      alert("Information Updated succesfully! \n Patient Email: "+ res.events.DocumentAdded.returnValues.patient_addr)
      history.back();
    }
}

async function uploadDocument() {
    const result = await App2.ipfs.add(App2.file);
      console.log(result);
      return "https://ipfs.io/ipfs/" + result.path;
}

App2 = {
    file: null,
    ipfs: null,

    captureFile: () => {
      console.log("inside1!")
      App2.file = document.getElementById('myFile').files[0];
      const reader = new FileReader();
      reader.readAsDataURL(App2.file);
      reader.onload = () => {
        const preview = document.getElementById("preview");
        preview.src = reader.result;
      };

    },

    onSubmit: async (event) => {
      const result = await App2.ipfs.add(App2.file);
      console.log(result);
      link = "https://ipfs.io/ipfs/" + result.path;
      document.getElementById("previewlink").innerHTML = "Check it out: <a href= " + link + ">" + link + "</a>";

    },

    func: async () => {
      var now = new Date();
      var month = (now.getMonth() + 1);               
      var day = now.getDate();
      if (month < 10) 
        month = "0" + month;
      if (day < 10) 
        day = "0" + day;
      var today = now.getFullYear() + '-' + month + '-' + day;
      $('#docDate').val(today);
      $('#ordoDate').val(today);
      document.getElementById("inputDate").innerHTML = ", le: " + today
      console.info("initializing ipfs node...");
      App2.ipfs = await Ipfs.create();
      // const { cid } = await node.add('Hello world')
    //   console.log(s.ipfs);
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
    $(window).on("Load", App2.func())
  })