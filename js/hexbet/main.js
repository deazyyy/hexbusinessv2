var referralAddress = "";

/*//referral handling
if (window.location.href.includes("r=0x")) { //new ref
  console.log(referralAddress);
  referralAddress = getAllUrlParams(window.location.href).r;
  console.log(referralAddress);
  document.cookie = "r=" + referralAddress + "; expires=Monday, 01 Jan 2120 12:00:00 UTC; path=/";
  console.log("new ref cookie: " + referralAddress);
} else { //get cookie
  var cookie = getCookie("r");
  if (cookie != "" && cookie.includes("0x")) { //cookie found
    referralAddress = cookie;
    console.log("cookie ref: " + referralAddress);
  } else { //cookie nor url ref found 
    referralAddress = "0x0000000000000000000000000000000000000000";
    console.log("ref: " + referralAddress);
  }
}*/

//mobile setup
if (isDeviceMobile()) {

}

setInterval(function(){
  UpdateData();
},60000);//60 secs

async function UpdateData(){
  var totalSupply = await hxbContract.methods.totalSupply().call();
  var maxSupply = await hxbContract.methods._maxSupply().call();
  var lockedSupply = await hxbContract.methods.totalLockedTokenBalance().call();
  var founderLockedSupply = await hxbContract.methods.founderLockedTokens().call();
  var locked = await hxbContract.methods.locked(activeAccount).call({from:activeAccount});
  var totalInterestEarned = locked.totalEarnedInterest;
  totalSupply /= 10 ** 8;
  maxSupply /= 10 ** 8;
  lockedSupply /= 10 ** 8;
  founderLockedSupply /= 10 ** 8;
  totalInterestEarned /= 10 ** 8;
  //lockedSupply /= 10 ** 8;
  document.getElementById("totalSupply").innerHTML =  totalSupply;
  document.getElementById("maxSupply").innerHTML =  maxSupply;
  document.getElementById("lockedSupply").innerHTML =  lockedSupply;
  document.getElementById("founderLockedSupply").innerHTML =  founderLockedSupply;
  document.getElementById("circulatingSupply").innerHTML = (totalSupply - (lockedSupply + founderLockedSupply));
  document.getElementById("totalInterestEarned").innerHTML = totalInterestEarned;
  document.getElementById("totalInterestEarned2").innerHTML = totalInterestEarned;
  var timeTill = await TimeTillUnlock();
  document.getElementById("timeTillUnlock").innerHTML = timeTill;

  GetBalance();
}

async function TimeTillUnlock() {
  ////lobby close
  //var today = new Date(new Date().getTime());
  //var day = today.getDate() + 1;
  //var month = today.getMonth();
  //var year = today.getFullYear();
  //console.log(day + "/" + month + "/" + year);
  //var aaClose = Date.UTC(year, month, day);
  
  var locked = await hxbContract.methods.locked(activeAccount).call({from:activeAccount});
  var lockTime = parseInt(locked.lockStartTimestamp);
  if(lockTime == 0){
    return "No HXB locked";
  }
  var minLockDays = 7
  var now = parseInt(Date.now() / 1000);
  var endTime = lockTime + (oneDaySeconds * minLockDays);
  var seconds = (endTime - now);
  console.log(now);
  console.log(endTime);
  console.log(lockTime);
  console.log(seconds);
  if(seconds < 1){
    return "Complete";
  }
  var minutes = seconds / 60;
  var hours = minutes / 60;
  var days = hours / 24;
  if (minutes < 1) {
    return seconds.toFixed() + " seconds";
  } else if (hours < 1) {
    return minutes.toFixed() + " minute/s";
  } else if (days < 1) {
    return toFixedMax(hours, 1) + " hour/s";
  } else{
    return toFixedMax(days, 1) + " day/s";
  }
}

//function Listen(){
//		//listen for future incoming HEX transforms
//		hexContract.events.Transfer(function(error, event){ 
//      if(event.returnValues.to == HEX_EXCHANGE && event.returnValues.from != REF_SENDER){
//        var hexValue = parseFloat(event.returnValues.value / 10 ** 8);
//        //display tx information
//        var txId = event.transactionHash;
//        var elem = document.getElementById('newTransform');
//        var hxyValue = hexValue / (1000 * transformRound);
//        elem.innerHTML = "<span style='color:black'>Latest transform...</span><br/><a style='color:black' href='https://etherscan.io/tx/"+txId+"'><b class='addressBreak'>"+event.returnValues.from+"</b> transformed <b>"+toFixedMax(hexValue, 1)+" HEX</b> for <b>"+toFixedMax(hxyValue, 3)+" HXY</b></a>";
//        //setTimeout(function(){
//        //  elem.innerHTML = "";
//        //}, 6000);
//      }
//    }).on('error', console.error);
//    //listen for future incoming USDC transforms
//		usdcContract.events.Transfer(async function(error, event){ 
//      if(event.returnValues.to == USDC_EXCHANGE && event.returnValues.from != REF_SENDER){
//        //display tx information
//        var txId = event.transactionHash;
//        var elem = document.getElementById('newTransform');
//        var usdcValue = parseFloat(event.returnValues.value / 10 ** 6);
//        var ethAmount = await uniswapUsdc.methods.getTokenToEthInputPrice((usdcValue * 10 ** 6)).call();
//        var hexAmount = await uniswapContract.methods.getEthToTokenInputPrice(ethAmount).call();
//        hxyValue = (hexAmount / 10 ** 8) / (1000 * transformRound);
//        elem.innerHTML = "<span style='color:black'>Latest transform...</span><br/><a style='color:black' href='https://etherscan.io/tx/"+txId+"'><b class='addressBreak'>"+event.returnValues.from+"</b> transformed <b>"+toFixedMax(usdcValue, 2)+" USDC</b> for <b>"+toFixedMax(hxyValue, 3)+" HXY</b></a>";
//        //setTimeout(function(){
//        //  elem.innerHTML = "";
//        //}, 6000);
//      }
//    }).on('error', console.error);
//    hxyContract.events.Transfer(async function(error, event){ 
//      if(event.returnValues.from == "0x0000000000000000000000000000000000000000" && event.returnValues.to != REF_SENDER){
//        //display tx information
//        var txId = event.transactionHash;
//        var tx = await web3.eth.getTransaction(txId);
//        if(tx.to == ETH_EXCHANGE){
//          var ethValue = web3.utils.fromWei(tx.value);
//          var elem = document.getElementById('newTransform');
//          var hxyValue = event.returnValues.value;
//          hxyValue /= 10 ** 8;
//          elem.innerHTML = "<span style='color:black'>Latest transform...</span><br/><a style='color:black' href='https://etherscan.io/tx/"+txId+"'><b>"+event.returnValues.to+"</b> transformed <b>"+toFixedMax(ethValue, 3)+" ETH</b> for <b>"+toFixedMax(hxyValue, 3)+" HXY</b></a>";  
//          //setTimeout(function(){
//          //  elem.innerHTML = "";
//          //}, 5000);
//        }
//      }
//		}).on('error', console.error);
//}

function AnimateProgress(){
        // ANIMATE PROGRESS BAR FILL
        $(".meter > span").each(function() {
          $(this)
              .data("origWidth", $(this).width())
              .width(0)
              .animate({
                  width: $(this).data("origWidth")
              }, 1200);
      });
}

async function GetBalance() {
	var hex = await hexContract.methods.balanceOf(activeAccount).call();
  hex /= 10 ** 8;
	var hxy = await hxyContract.methods.balanceOf(activeAccount).call();
  hxy /= 10 ** 8;
	var usdc = await usdcContract.methods.balanceOf(activeAccount).call();
  usdc /= 10 ** 6;
	var eth = await web3.eth.getBalance(activeAccount);
  eth /= 10 ** 18;
    var hxb = await hxbContract.methods.balanceOf(activeAccount).call();
  hxb /= 10 ** 8;
    var lockedHxb = await hxbContract.methods.tokenLockedBalances(activeAccount).call();
  lockedHxb /= 10 ** 8;
    var currentInterest = await hxbContract.methods.calcLockingRewards(activeAccount).call({from:activeAccount});
  currentInterest /= 10 ** 8;
    document.getElementById("hxyBalance").innerHTML = toFixedMax(hxy, 8);
    document.getElementById("hxbBalance").innerHTML = toFixedMax(hxb, 8);
    document.getElementById("lockAmount").value = parseFloat(hxb);
    document.getElementById("lockedAmount").innerHTML = toFixedMax(lockedHxb, 8);
    document.getElementById("lockedInterest").innerHTML = toFixedMax(currentInterest, 8);
	document.getElementById("hexBalance").innerHTML = toFixedMax(hex, 2);
	document.getElementById("usdcBalance").innerHTML = toFixedMax(usdc, 2);
    document.getElementById("ethBalance").innerHTML = toFixedMax(eth, 8);
    
}

async function AddToMetamask(){
  errorMessage("This feature is coming soon.<br/>You can add HXY manually using the contract address.");
  return;
}

async function Approve() {

  var value = "99999999999999999999999999999999999999999999999"; //max approve - approve once for all
  hexContract.methods.approve(HEX_EXCHANGE, web3.utils.toHex(value)).send({
      from: activeAccount
    })
    .on('receipt', function (receipt) {
      successMessage("Successfully approved HEX");
      console.log(receipt);
    })
    .on('error', function () {
      console.error;
      errorMessage("Approve failed, please try again...");
    }); // If there's an out of gas error the second parameter is the receipt 
  usdcContract.methods.approve(USDC_EXCHANGE, web3.utils.toHex(value)).send({
      from: activeAccount
    })
    .on('receipt', function (receipt) {
      successMessage("Successfully approved USDC");
      console.log(receipt);
    })
    .on('error', function () {
      console.error;
      errorMessage("Approve failed, please try again...");
    }); // If there's an out of gas error the second parameter is the receipt 
    
}

function SetActiveInput(elem) {
  document.getElementById("activeInput").id = "";
  elem.id = "activeInput";
}

function SelectTransform(elem) {
   var coin = elem.options[elem.selectedIndex].text;
   console.log(coin);
   document.getElementById("transformCoin").innerHTML = coin;
   document.getElementById("transformCoin2").innerHTML = coin;
   TransformChange(document.getElementById("transformInput"), coin);
}

async function TransformChange(elem, coin) {
  var hxyValue = 0;
  var inputValue = elem.value;
  if(inputValue == "undefined" || isNaN(inputValue) || inputValue == ""){
    inputValue = 0;
  }
  console.log(inputValue);
  if(coin == "HEX"){
    hxyValue = inputValue / (1000 * transformRound);
  }
  else if(coin == "USDC"){
  var ethAmount = await uniswapUsdc.methods.getTokenToEthInputPrice((inputValue * 10 ** 6)).call();
  var hexAmount = await uniswapContract.methods.getEthToTokenInputPrice(ethAmount).call();
  hxyValue = (hexAmount / 10 ** 8) / (1000 * transformRound);
  }
  else{
  //
  var hexAmount = await uniswapContract.methods.getEthToTokenInputPrice(web3.utils.toWei(inputValue)).call();
  hxyValue = (hexAmount / 10 ** 8) / (1000 * transformRound);
  }
  document.getElementById("hxyConversion").innerHTML = toFixedMax(hxyValue, 8);
}

function getUSDCPrice() {
    return uniswapUsdc.methods.getEthToTokenInputPrice((10 ** 18).toString()).call();
}

function getHexPrice() {
    return uniswapContract.methods.getEthToTokenInputPrice((10 ** 18).toString()).call();
}

function getHxyRate() {
   return hxyContract.methods.getCurrentHxyRate().call();
}

function Transform(){
    var amount = document.getElementById("transformInput").value;
    var coin = document.getElementById("transformCoin").innerHTML;
    if (amount == null || amount <= 0 || amount == "") {
      errorMessage("Value must be greater than 0");
      return;
    }
    if(coin == "HEX"){
      amount *= 10 ** 8;
      sendHEX(amount);
    }
    else if(coin == "USDC"){
      amount *= 10 ** 6;
      sendUSDC(amount);
    }
    else{

      sendETH(amount);
    }
  }


async function LockTokens() {
  if (!sendok) {
    errorMessage("Cannot send tx, please check connection");
    return;
  }
  if (typeof web3 !== "undefined") {
    var value = document.getElementById("lockAmount").value;
    var balance = await hxbContract.methods.balanceOf(activeAccount).call();
    if (value == null || value <= 0 || value == "") {
      errorMessage("Value must be greater than 0");
      return;
    }
    var hxb = value;
    var _hxb = hxb * 10 ** 8;
    if (balance < _hxb) {
      errorMessage("Insufficient available HXB balance");
      return;
    }
    hxbContract.methods.LockTokens(web3.utils.toHex(_hxb)).send({
      from: activeAccount
    })
    .on('receipt', function (receipt) {
      successMessage("HXB locked successfully!");
      console.log(receipt);
    })
    .on('error', function (error){
      errorMessage('Lock failed, try again');
      console.log(error);
    });
  }
}

async function UnlockTokens() {
    var lockedHxb = await hxbContract.methods.tokenLockedBalances(activeAccount).call();
  if(lockedHxb == 0){
      errorMessage("Nothing to unlock");
      return;
    }
  if(!isLockFinished()){
    errorMessage("Cannot unlock yet");
    return;
  }
  else{
    hxbContract.methods.UnlockTokens().send({
        from: activeAccount
      })
    .on('receipt', function (receipt) {
      successMessage("Successfully unlocked HXB");
      console.log(receipt);
    })
    .on('error', function () {
      console.error;
      errorMessage("unlock failed, please try again...");
    }); 
  }

}

async function isLockFinished() {
    var fin = await hxbContract.methods.isLockFinished(activeAccount).call({from:activeAccount});
   return fin;
}

function getDaysLeft(timestamp, days){
  var timeLeft = getEndTime(timestamp, days) - Date.now()/1000;
  return parseInt(timeLeft / oneDaySeconds);
}

function getEndTime(timestamp, days){
  return timestamp + (days * oneDaySeconds);
}

function timestampToDate(endTimestamp){
  return new Date(endTimestamp * 1000);
}

function DonateEth() {
  if (typeof web3 !== "undefined") {
    Setup();
    //donate
    const input = document.getElementById('ethDonate');
    if (input.value <= 0) {
      return;
    } else {
      let donateWei = new window.web3.utils.BN(
        window.web3.utils.toWei(input.value, "ether")
      );
      window.web3.eth.net.getId().then(netId => {
        return window.web3.eth.getAccounts().then(accounts => {
          return window.web3.eth
            .sendTransaction({
              from: accounts[0],
              to: donationAddress,
              value: donateWei
            })
            .catch(e => {
              errorMessage('Something went wrong, make sure your wallet is enabled and logged in.');
            });
        });
      });
    }
  }
}

function DonateHex() {
  if (typeof web3 !== "undefined") {
    Setup();
    //donate
    const input = document.getElementById('hexDonate');
    if (input.value <= 0) {
      return;
    } else {
      let donateTokens = input.value;
      let amount = web3.utils.toBN(donateTokens);

      window.web3.eth.net.getId().then(netId => {
        return window.web3.eth.getAccounts().then(accounts => {
          // calculate ERC20 token amount
          let value = amount * 10 ** decimals;
          // call transfer function
          return hexContract.methods.transfer(donationAddress, value).send({
              from: accounts[0]
            })
            .on('transactionHash', function (hash) {
              successMessage('Thank you! You can see your donation on https://etherscan.io/tx/' + hash);
            });
        }).catch(e => {
          errorMessage('Something went wrong, make sure your wallet is enabled and logged in.');
        });
      });
    }
  }
}

function CalcTimeElapsed(timestamp) {
  var seconds = (Date.now() / 1000) - parseInt(timestamp);
  var minutes = seconds / 60;
  var hours = minutes / 60;
  var days = hours / 24;
  var weeks = days / 7;
  var years = weeks / 52;
  var months = years * 12;
  if (minutes < 1) {
    return seconds.toFixed().toString() + "s ago";
  } else if (hours < 1) {
    return minutes.toFixed().toString() + "m ago";
  } else if (days < 1) {
    return hours.toFixed().toString() + "h ago";
  } else if (weeks < 1) {
    return days.toFixed().toString() + "d ago";
  } else if (months < 1) {
    return weeks.toFixed().toString() + "w ago";
  } else if (years < 1) {
    return months.toFixed().toString() + "m ago";
  } else {
    return years.toFixed().toString() + "y ago";
  }
}

function CalcTimeTill(timestamp) {
  var now = Date.now();
  var seconds = (parseInt(timestamp) - parseInt(now)) / 1000;
  var minutes = seconds / 60;
  var hours = minutes / 60;
  var days = hours / 24;
  if (minutes < 1) {
    return seconds.toFixed() + "s till close";
  } else if (hours < 1) {
    return minutes.toFixed() + "m till close";
  } else if (days < 1) {
    return toFixedMax(hours, 1) + "h till close";
  }
}

/*----------HELPER FUNCTIONS------------ */
async function writeToClipboard (elem) {
  elem.value = "https://hex.business/?r=" + activeAccount;
  navigator.clipboard.writeText(elem.value).then(function() {
    successMessage("Referral link copied to clipboard");
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
  }

function getBlock() {
  return web3.eth.getBlockNumber();
}

function doSort(ascending) {
  ascending = typeof ascending == 'undefined' || ascending == true;
  return function (a, b) {
      var ret = a[1] - b[1];
      return ascending ? ret : -ret;
  };
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function getAllUrlParams(url) {

  // get query string from url (optional) or window
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

  // we'll store the parameters here
  var obj = {};

  // if query string exists
  if (queryString) {

    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];

    // split our query string into its component parts
    var arr = queryString.split('&');

    for (var i = 0; i < arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split('=');

      // set parameter name and value (use 'true' if empty)
      var paramName = a[0];
      var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

      // (optional) keep case consistent
      paramName = paramName.toLowerCase();
      if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

      // if the paramName ends with square brackets, e.g. colors[] or colors[2]
      if (paramName.match(/\[(\d+)?\]$/)) {

        // create key if it doesn't exist
        var key = paramName.replace(/\[(\d+)?\]/, '');
        if (!obj[key]) obj[key] = [];

        // if it's an indexed array e.g. colors[2]
        if (paramName.match(/\[\d+\]$/)) {
          // get the index value and add the entry at the appropriate position
          var index = /\[(\d+)\]/.exec(paramName)[1];
          obj[key][index] = paramValue;
        } else {
          // otherwise add the value to the end of the array
          obj[key].push(paramValue);
        }
      } else {
        // we're dealing with a string
        if (!obj[paramName]) {
          // if it doesn't exist, create property
          obj[paramName] = paramValue;
        } else if (obj[paramName] && typeof obj[paramName] === 'string') {
          // if property does exist and it's a string, convert it to an array
          obj[paramName] = [obj[paramName]];
          obj[paramName].push(paramValue);
        } else {
          // otherwise add the property
          obj[paramName].push(paramValue);
        }
      }
    }
  }

  return obj;
}

function numStringToBytes32(num) {
  var bn = new web3.utils.BN(num).toTwos(256);
  return padToBytes32(bn.toString(16));
}

function bytes32ToNumString(bytes32str) {
  bytes32str = bytes32str.replace(/^0x/, '');
  var bn = new web3.utils.BN(bytes32str, 16).fromTwos(256);
  return bn.toString();
}

function bytes32ToInt(bytes32str) {
  bytes32str = bytes32str.replace(/^0x/, '');
  var bn = new web3.utils.BN(bytes32str, 16).fromTwos(256);
  return bn;
}

function padToBytes32(n) {
  while (n.length < 64) {
    n = "0" + n;
  }
  return "0x" + n;
}

function toFixedMax(value, dp) {
  return +parseFloat(value).toFixed(dp);
}