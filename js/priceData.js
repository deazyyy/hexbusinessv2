var referralAddress = "";
//referral handling
if (window.location.href.includes("r=0x")) { //new ref
  referralAddress = getAllUrlParams(window.location.href).r;
  console.log(referralAddress);
  //document.cookie = "r=" + referralAddress + "; expires=Monday, 01 Jan 2120 12:00:00 UTC; path=/";
  //console.log("new ref cookie: " + referralAddress);
  window.location.assign("hexmoney.html?r="+referralAddress.toString());
}


const infura = "https://mainnet.infura.io/v3/dd681b4563134685a4e5cf4519513222";

var hxyContract;

const HXY = '0x0FFF95D5ab18c763c42C209F137C47354af104a8';
const HXY_ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_whitelistAddress',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '_liqSupAddress',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_liqSupAmount',
        type: 'uint256'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'spender',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256'
      }
    ],
    name: 'Approval',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'release',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'Freezed',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'Released',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address'
      }
    ],
    name: 'RoleGranted',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address'
      }
    ],
    name: 'RoleRevoked',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256'
      }
    ],
    name: 'Transfer',
    type: 'event'
  },
  {
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [],
    name: 'DEPLOYER_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [],
    name: 'MINIMAL_FREEZE_PERIOD',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [],
    name: 'SECONDS_IN_DAY',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [],
    name: 'TEAM_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'actualBalanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: 'balance',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'spender',
        type: 'address'
      }
    ],
    name: 'allowance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'approve',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [],
    name: 'cap',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'subtractedValue',
        type: 'uint256'
      }
    ],
    name: 'decreaseAllowance',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'freezingBalanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: 'balance',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'freezingId',
        type: 'bytes32'
      }
    ],
    name: 'getFreezingById',
    outputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'startDate',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'freezeDays',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'freezeAmount',
        type: 'uint256'
      },
      {
        internalType: 'bool',
        name: 'capitalized',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32'
      }
    ],
    name: 'getRoleAdmin',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32'
      },
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256'
      }
    ],
    name: 'getRoleMember',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32'
      }
    ],
    name: 'getRoleMemberCount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [],
    name: 'getTeamAddress',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_user',
        type: 'address'
      }
    ],
    name: 'getUserFreezings',
    outputs: [
      {
        internalType: 'bytes32[]',
        name: 'userFreezings',
        type: 'bytes32[]'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [],
    name: 'getWhitelistAddress',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32'
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32'
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'hasRole',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'addedValue',
        type: 'uint256'
      }
    ],
    name: 'increaseAllowance',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'latestFreezeTimeOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32'
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32'
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'transfer',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'sender',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'transferFrom',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getRemainingHxyInRound',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [],
    name: 'getTotalHxyInRound',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [],
    name: 'getTotalHxyMinted',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [],
    name: 'getCirculatingSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [],
    name: 'getCurrentHxyRound',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [],
    name: 'getCurrentHxyRate',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [],
    name: 'getTotalFrozen',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [],
    name: 'getTotalPayedInterest',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_addr',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_freezeStartDate',
        type: 'uint256'
      }
    ],
    name: 'getCurrentInterestAmount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'mintFromExchange',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'mintFromDappOrReferral',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'lockAmount',
        type: 'uint256'
      }
    ],
    name: 'freezeHxy',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'startDate',
        type: 'uint256'
      }
    ],
    name: 'refreezeHxy',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_startDate',
        type: 'uint256'
      }
    ],
    name: 'releaseFrozen',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address[6]',
        name: '_lockSupAddresses',
        type: 'address[6]'
      },
      {
        internalType: 'uint256[10]',
        name: '_unlockDates',
        type: 'uint256[10]'
      }
    ],
    name: 'premintLocked',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_round',
        type: 'uint256'
      }
    ],
    name: '_getTotalHxyInRound',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_round',
        type: 'uint256'
      }
    ],
    name: '_getRemainingHxyInRound',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  }
];

web3 = new Web3(new Web3.providers.HttpProvider(infura));
hxyContract = new web3.eth.Contract(HXY_ABI, HXY);

var hexUsd = document.getElementById("hexUsd");
var hexChange = document.getElementById("hexChange");
var btcUsd = document.getElementById("btcUsd");
var btcChange = document.getElementById("btcChange");
var hexBtc = document.getElementById("hexBtc");
var hexBtcChange = document.getElementById("hexBtcChange");
var ethUsd = document.getElementById("ethUsd");
var ethChange = document.getElementById("ethChange");
var ethHex = document.getElementById("ethHex");
var ethHexChange = document.getElementById("ethHexChange");

var hxyTotal = document.getElementById("hxyTotal");
//var hxyTotalUsd = document.getElementById("hxyTotalUsd");
var hxyTotalPercent = document.getElementById("hxyTotalPercent");
var hxyFrozen = document.getElementById("hxyFrozen");
//var hxyFrozenUsd = document.getElementById("hxyFrozenUsd");
var hxyFrozenPercent = document.getElementById("hxyFrozenPercent");
var hxyCirculating = document.getElementById("hxyCirculating");
//var hxyCirculatingUsd = document.getElementById("hxyCirculatingUsd");
var hxyCirculatingPercent = document.getElementById("hxyCirculatingPercent");
var hxyLocked = document.getElementById("hxyLocked");
//var hxyLockedUsd = document.getElementById("hxyLockedUsd");
var hxyLockedPercent = document.getElementById("hxyLockedPercent");
var hxyPrice = document.getElementById("hxyPrice");
var hxyPriceChange = document.getElementById("hxyPriceChange");

var hexTotal = document.getElementById("hexTotal");
var hexTotalPercent = document.getElementById("hexTotalPercent");
var hexStaked = document.getElementById("hexStaked");
var hexStakedPercent = document.getElementById("hexStakedPercent");
var hexCirculating = document.getElementById("hexCirculating");
var hexCirculatingPercent = document.getElementById("hexCirculatingPercent");
var hexPrice = document.getElementById("hexPrice");
var hexPriceChange = document.getElementById("hexPriceChange");

var aaHexRate = document.getElementById("aaHexRate");
var aaHexChange = document.getElementById("aaHexChange");
var aaHexRate2 = document.getElementById("aaHexRate2");
var aaHexChange2 = document.getElementById("aaHexChange2");
var aaPool = document.getElementById("aaPool");
var aaPoolChange = document.getElementById("aaPoolChange");
var countdown = document.getElementById("aaClosingTicker");

GetData();

setInterval(function(){
    GetData();
}, 120000);
function GetData(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = async function() {
        if (this.readyState == 4 && this.status == 200) {
           // Typical action to be performed when the document is ready:
           var data = JSON.parse(xhttp.responseText);
           console.log(data);
           hexUsd.innerHTML = "$" + toFixedMax(data.hexUsd, 6);
           hexChange.innerHTML = data.hexUsd24Change + "%";
           if(data.hexUsd24Change < 0){
            hexChange.className = "down";
           }
           else{
            hexChange.className = "up";
           }
           btcUsd.innerHTML = "$" + toFixedMax(data.btcUsd, 2);
           btcChange.innerHTML = data.btcUsd24Change + "%";
           if(data.btcUsd24Change < 0){
            btcChange.className = "down";
           }
           else{
            btcChange.className = "up";
           }
           hexBtc.innerHTML = toFixedMax((data.hexBtc * 10 ** 8), 1) + " sats"
           hexBtcChange.innerHTML = data.hexBtc24Change + "%";
           if(data.hexBtc24Change < 0){
            hexBtcChange.className = "down";
           }
           else{
            hexBtcChange.className = "up";
           }
           ethUsd.innerHTML = "$" + toFixedMax(data.ethUsd, 2);
           ethChange.innerHTML = data.ethUsd24Change + "%";
           if(data.ethUsd24Change < 0){
            ethChange.className = "down";
           }
           else{
            ethChange.className = "up";
           }
           hexEth.innerHTML = toFixedMax(data.hexEth * 10 ** 9) + " gwei";
           hexEthChange.innerHTML = data.hexEth24Change + "%";
           if(data.ethUsd24Change < 0){
            hexEthChange.className = "down";
           }
           else{
            hexEthChange.className = "up";
           }
           //HXY////////////////////////
           //overview
           var maxSupply = 60000000;
           //total
           var totalSupply = await hxyContract.methods.totalSupply().call();
           hxyTotal.innerHTML = toFixedMax((totalSupply / 10 ** 8), 1) + " HXY";
           var percentage = ((totalSupply / 10 ** 8) / maxSupply) * 100;
           hxyTotalPercent.innerHTML = toFixedMax(percentage,2) + "% / max";
           //frozen
           var frozenSupply = await hxyContract.methods.getTotalFrozen().call();
           hxyFrozen.innerHTML = toFixedMax((frozenSupply / 10 ** 8), 1) + " HXY";
           percentage = (frozenSupply / totalSupply) * 100;
           hxyFrozenPercent.innerHTML = toFixedMax(percentage,3) + "% / total";
           //locked
           var lockedSupply = 750000000000000;
           hxyLocked.innerHTML = toFixedMax((lockedSupply / 10 ** 8), 1) + " HXY";
           percentage = (lockedSupply / totalSupply) * 100;
           hxyLockedPercent.innerHTML = toFixedMax(percentage,2) + "% / total";
           //circulating
           var circulatingSupply = parseInt(totalSupply) - (parseInt(frozenSupply) + parseInt(lockedSupply));
           hxyCirculating.innerHTML = toFixedMax((circulatingSupply / 10 ** 8), 1) + " HXY";
           percentage = (circulatingSupply / totalSupply) * 100;
           hxyCirculatingPercent.innerHTML = toFixedMax(percentage,2) + "% / total";
           //price
           var tRound = await hxyContract.methods.getCurrentHxyRound().call();
           tRound += 2;
           var _hxyPrice = data.hexUsd;
           hxyPrice.innerHTML = "$" + toFixedMax(parseFloat(_hxyPrice) * (1000 * tRound), 2) + " per HXY";
           hxyPriceChange.innerHTML = toFixedMax(data.hexUsd24Change, 2) + "%";
           if(data.hexUsd24Change < 0){
            hxyPriceChange.className = "down";
           }
           else{
            hxyPriceChange.className = "up";
           }
           //HEX///////////////////
           //total
           var totalSupply = data.hexTotalSupply;
           hexTotal.innerHTML = toFixedMax(totalSupply, 1) + " HEX";
           hexTotalPercent.innerHTML =  "100%";
           //staked
           var stakedSupply = data.hexLockedSupply;
           hexStaked.innerHTML = toFixedMax(stakedSupply, 1) + " HEX";
           percentage = (stakedSupply / totalSupply) * 100;
           hexStakedPercent.innerHTML = toFixedMax(percentage,3) + "% / total";
           if(data.hexLockedSupply24Change < 0){
            hexStakedPercent.className = "down";
           }
           else{
            hexStakedPercent.className = "up";
           }
           //circulating
           var circulatingSupply = data.hexCirculatingSupply;
           hexCirculating.innerHTML = toFixedMax(circulatingSupply, 1) + " HEX";
           percentage = (circulatingSupply / totalSupply) * 100;
           hexCirculatingPercent.innerHTML = toFixedMax(percentage,2) + "% / total";
           if(data.hexCirculatingSupply24Change < 0){
            hexCirculatingPercent.className = "down";
           }
           else{
            hexCirculatingPercent.className = "up";
           }
           //price
           var _hexPrice = data.hexUsd;
           hexPrice.innerHTML = "$" + toFixedMax(_hexPrice, 5);
           hexPriceChange.innerHTML = toFixedMax(data.hexUsd24Change ,2) + "%";
           if(data.hexUsd24Change < 0){
            hexPriceChange.className = "down";
           }
           else{
            hexPriceChange.className = "up";
           }
           //lobby close
           var today = new Date(new Date().getTime());
           var day = today.getDate() + 1;
           var month = today.getMonth();
           var year = today.getFullYear();
           console.log(day + "/" + month + "/" + year);
           var aaClose = Date.UTC(year, month, day);
           console.log(aaClose);
           countdown.innerHTML = CalcTimeTill(aaClose);
           
           //aa eth
           var aaPoolValue = data.adoptionAmplifierCurrentEth;
           aaPool.innerHTML = toFixedMax(aaPoolValue, 2) + " ETH";
           aaPoolChange.innerHTML = toFixedMax(data.adoptionAmplifierCurrentEth24Change, 2) + "%";
           if(data.adoptionAmplifierCurrentEth24Change < 0){
            aaPoolChange.className = "down";
           }
           else{
            aaPoolChange.className = "up";
           }
           //hex rate
           var _aaHexRate = data.adoptionAmplifierCurrentHexEth;
           aaHexRate.innerHTML = toFixedMax(_aaHexRate, 1) + " H/E";
           aaHexChange.innerHTML = toFixedMax(data.adoptionAmplifierCurrentHexEth24Change,2) + "%";
           aaHexRate2.innerHTML = toFixedMax(_aaHexRate, 1) + " HEX/ETH";
           aaHexChange2.innerHTML = toFixedMax(data.adoptionAmplifierCurrentHexEth24Change,2) + "%";
           if(data.adoptionAmplifierCurrentHexEth24Change < 0){
            aaHexChange.className = "down";
            aaHexChange2.className = "down";
           }
           else{
            aaHexChange.className = "up";
            aaHexChange2.className = "up";
           }
        }
    };
    xhttp.open("GET", "https://hexvisionbusinessapi.azurewebsites.net/api/extendedStats", true);
    xhttp.send();

    var xhttp2 = new XMLHttpRequest();
    xhttp2.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
           // Typical action to be performed when the document is ready:
           var json = JSON.parse(xhttp2.responseText);
           console.log(json);
           document.getElementById("gasFast").innerHTML = json.fastest / 10 + " gwei";
           document.getElementById("gasFastConf").innerHTML = (60 * json.fastestWait) + " seconds";
           document.getElementById("gasNorm").innerHTML = json.average / 10 + " gwei";
           document.getElementById("gasNormConf").innerHTML = json.avgWait + " minutes";
           document.getElementById("gasSlow").innerHTML = json.safeLow / 10 + " gwei";
           document.getElementById("gasSlowConf").innerHTML = json.safeLowWait + " minutes";
        }
    };
    xhttp2.open("GET", "https://ethgasstation.info/api/ethgasAPI.json?api-key=7e4087ffad6eb1dbe6334260f0a528e3f2fb7a4f381959bfd50b32231269", true);
    xhttp2.send();
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

function toFixedMax(value, dp) {
  return +parseFloat(value).toFixed(dp);
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