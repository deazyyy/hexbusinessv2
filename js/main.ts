import {MetamaskService} from '../../services/web3/web3.service';
import {ContractConstants} from './constants';
import BigNumber from 'bignumber.js';
// import BigNumber from 'bignumber.js';

// const oneDaySeconds = 86400;
const oneDaySeconds = 300;
const dividendsKeys = ['HEX', 'HXY', 'ETH', 'USDC'];

export class Contract {

  private HEXTokenContract: any;
  private HXYTokenContract: any;
  private USDCTokenContract: any;
  private DividendsContract: any;
  private HEXExchangeContract: any;
  private USDCExchangeContract: any;
  private ETHExchangeContract: any;
  private uniswapContract: any;
  private uniswapUSDCContract: any;

  private coinsDecimals: any;

  constructor(
    private network: string,
    private web3Service: MetamaskService
  ) {

    this.HEXTokenContract = this.web3Service.getContract(
      ContractConstants.ABIs.HEX,
      ContractConstants.ADDRESSES[this.network].HEX
    );

    this.HXYTokenContract = this.web3Service.getContract(
      ContractConstants.ABIs.HXY,
      ContractConstants.ADDRESSES[this.network].HXY
    );


    this.USDCTokenContract = this.web3Service.getContract(
      ContractConstants.ABIs.USDC,
      ContractConstants.ADDRESSES[this.network].USDC
    );

    this.DividendsContract = this.web3Service.getContract(
      ContractConstants.ABIs.DIVIDENDS,
      ContractConstants.ADDRESSES[this.network].DIVIDENDS
    );

    this.HEXExchangeContract = this.web3Service.getContract(
      ContractConstants.ABIs.HEX_EXCHANGE,
      ContractConstants.ADDRESSES[this.network].HEX_EXCHANGE
    );

    this.ETHExchangeContract = this.web3Service.getContract(
      ContractConstants.ABIs.ETH_EXCHANGE,
      ContractConstants.ADDRESSES[this.network].ETH_EXCHANGE
    );

    this.USDCExchangeContract = this.web3Service.getContract(
      ContractConstants.ABIs.USDC_EXCHANGE,
      ContractConstants.ADDRESSES[this.network].USDC_EXCHANGE
    );

    this.uniswapContract = this.web3Service.getContract(
      ContractConstants.ABIs.UNISWAP,
      ContractConstants.ADDRESSES[this.network].UNISWAP
    );

    this.uniswapUSDCContract = this.web3Service.getContract(
      ContractConstants.ABIs.UNISWAP_USDC,
      ContractConstants.ADDRESSES[this.network].UNISWAP_USDC
    );
  }

  public getCoinsDecimals() {
    const promises = [
      this.HEXTokenContract.methods.decimals().call().then((result: any) => {
        return {
          key: 'HEX',
          value: parseInt(result, 10)
        };
      }),
      this.HXYTokenContract.methods.decimals().call().then((result: any) => {
        return {
          key: 'HXY',
          value: parseInt(result, 10)
        };
      }),
      this.USDCTokenContract.methods.decimals().call().then((result: any) => {
        return {
          key: 'USDC',
          value: parseInt(result, 10)
        };
      })
    ];

    return Promise.all(promises).then((result) => {
      const decimals = {
        ETH: 18
      };
      result.forEach((coinItem) => {
        decimals[coinItem.key] = coinItem.value;
      });
      this.coinsDecimals = decimals;
      return decimals;
    });
  }

  public getCoinsBalances() {
      const promises = [
        this.HEXTokenContract.methods.balanceOf(this.HEXTokenContract.givenProvider.selectedAddress).call().then((res) => {
          return {
            key: 'HEX',
            value: res
          };
        }),
        this.HXYTokenContract.methods.actualBalanceOf(this.HXYTokenContract.givenProvider.selectedAddress).call().then((res) => {
          return {
            key: 'HXY',
            value: res
          };
        }),
        this.USDCTokenContract.methods.balanceOf(this.USDCTokenContract.givenProvider.selectedAddress).call().then((res) => {
          return {
            key: 'USDC',
            value: res
          };
        }),
        this.web3Service.getBalance(this.HXYTokenContract.givenProvider.selectedAddress).then((res) => {
          return {
            key: 'ETH',
            value: res
          };
        })
      ];
      return Promise.all(promises);
  }

  public getAmountsLimits() {
    const promises = [
      this.HEXExchangeContract.methods.getMinAmount().call().then((result: any) => {
        return {
          key: 'HEX',
          type: 'min',
          value: result
        };
      }),
      this.HEXExchangeContract.methods.getMaxAmount().call().then((result: any) => {
        return {
          key: 'HEX',
          type: 'max',
          value: result
        };
      }),
      this.USDCExchangeContract.methods.getMinAmount().call().then((result: any) => {
        return {
          key: 'USDC',
          type: 'min',
          value: result
        };
      }),
      this.USDCExchangeContract.methods.getMaxAmount().call().then((result: any) => {
        return {
          key: 'USDC',
          type: 'max',
          value: result
        };
      }),
      this.ETHExchangeContract.methods.getMinAmount().call().then((result: any) => {
        return {
          key: 'ETH',
          type: 'min',
          value: result
        };
      }),
      this.ETHExchangeContract.methods.getMaxAmount().call().then((result: any) => {
        return {
          key: 'ETH',
          type: 'max',
          value: result
        };
      }),
    ];
    return Promise.all(promises).then((result) => {
      return result.reduce((val, limit) => {
        val[limit.key] = val[limit.key] || {};
        val[limit.key][limit.type] = limit.value;
        return val;
      }, {});
    });
  }

  public sendETH(amount) {
    return this.web3Service.Web3.eth.sendTransaction({
      value: amount,
      from: this.ETHExchangeContract.givenProvider.selectedAddress,
      to: this.ETHExchangeContract.options.address
    });
  }

  public sendHEX(amount) {
    const fromAccount = this.HEXTokenContract.givenProvider.selectedAddress;
    return new Promise((resolve, reject) => {
      this.HEXTokenContract.methods.approve(this.HEXExchangeContract.options.address, amount).send({
        from: fromAccount
      }).then(() => {
        this.HEXExchangeContract.methods.exchangeHex(amount).send({
          from: fromAccount
        }).then(resolve, reject);
      }, reject);
    });
  }

  public sendUSDC(amount) {
    const fromAccount = this.USDCTokenContract.givenProvider.selectedAddress;
    return new Promise((resolve, reject) => {
      this.USDCTokenContract.methods.approve(this.USDCExchangeContract.options.address, amount).send({
        from: fromAccount
      }).then(() => {
        this.USDCExchangeContract.methods.exchangeUSDC(amount).send({
          from: fromAccount
        }).then(resolve, reject);
      }, reject);
    });
  }

  public getHXYPrices() {
    const getPrices = () => {
      return this.getHxyRate().then((hexRate: string) => {
        const rates: any = {};
        rates.HEX = new BigNumber(1).div(hexRate);

        return this.getHexPrice().then((hexPrice: string) => {
          rates.ETH = rates.HEX.times(new BigNumber(hexPrice).div(Math.pow(10, this.coinsDecimals.HEX)));

          return this.getUSDCPrice().then((usdcPrice: string) => {

            // Fixme USDC decimals
            rates.USDC = rates.ETH.div(new BigNumber(usdcPrice).div(Math.pow(10, 8)));

            const prices = [];
            for (const coin in rates) {
              prices.push({coin, rate: new BigNumber(1).div(rates[coin]).toString(10)});
            }
            return {prices, rates};
          });
        });
      });
    };
    this.getUSDCPrice().then((res) => {
      console.log(res);
    });
    if (!this.coinsDecimals) {
      return this.getCoinsDecimals().then(getPrices);
    }
    return getPrices();
  }

  public getUSDCPrice() {
    return this.uniswapUSDCContract.methods.getEthToTokenInputPrice((10 ** 18).toString()).call();
  }

  public getHexPrice() {
    return this.uniswapContract.methods.getEthToTokenInputPrice((10 ** 18).toString()).call();
  }

  public getHxyRate() {
    return this.HXYTokenContract.methods.getCurrentHxyRate().call();
  }


  public getRemainingRecordTime() {
    return this.DividendsContract.methods.getRecordTime().call().then((r) => {
      let leftSeconds = r % oneDaySeconds - Math.round((new Date().getTime() / 1000) % oneDaySeconds);
      if (leftSeconds < 0) {
        leftSeconds += oneDaySeconds;
      }
      return {
        left: leftSeconds,
        latest: r  - oneDaySeconds + 1,
        next: Math.round((new Date().getTime() / 1000)) + leftSeconds,
        period: oneDaySeconds
      };
    });
  }

  public getAvailableDividends() {
    return this.DividendsContract.methods.getAvailableDividends(
      this.DividendsContract.givenProvider.selectedAddress
    ).call().then((result) => {
      return result.map((dividend, index) => {
        return {
          coin: dividendsKeys[index],
          value: dividend
        };
      });
    }).catch((err) => {
      return null;
    });
  }

  public getRound() {
    return this.HXYTokenContract.methods.getCurrentHxyRound().call();
  }


  public freezeHXY(amount) {
    const fromAccount = this.HEXTokenContract.givenProvider.selectedAddress;
    return this.HXYTokenContract.methods.freezeHxy(amount).send({
      from: fromAccount
    });
  }

  public getTotalInfo() {
    const promises = [
      this.HXYTokenContract.methods.cap().call().then((res) => {
        return {key: 'maxSupply', value: res};
      }),
      this.HXYTokenContract.methods.getLockedSupply().call().then((res) => {
        return {key: 'locked', value: res};
      }),
      this.HXYTokenContract.methods.getTotalHxyMinted().call().then((res) => {
        return {key: 'totalSupply', value: res};
      }),
      this.HXYTokenContract.methods.getTotalFrozen().call().then((res) => {
        return {key: 'frozen', value: res};
      }),
      this.HXYTokenContract.methods.getCirculatingSupply().call().then((res) => {
        return {key: 'circulating', value: res};
      })
    ];
    return Promise.all(promises).then((res) => {
      const convertedResult = {};
      res.forEach((coinItem) => {
        convertedResult[coinItem.key] = coinItem.value;
      });
      return convertedResult;
    });
  }

  public getUserFreezings() {
    const account = this.HXYTokenContract.givenProvider.selectedAddress;

    return this.getBlock().then((block) => {
      const timeRange = new Date().getTime() - block.timestamp * 1000;

      return this.HXYTokenContract.methods.getUserFreezings(account).call().then((res) => {
        const allFreezingsPromises = res.map((freezId) => {
          return this.HXYTokenContract.methods.getFreezingById(freezId).call().then((freezing: any) => {
            freezing.id = freezId;
            freezing.endDateTime = (+freezing.startDate + freezing.freezeDays * oneDaySeconds) * 1000 + timeRange;
            return this.HXYTokenContract.methods.getCurrentInterestAmount(account, freezing.startDate).call().then((interest) => {
              freezing.interest = interest;
              return freezing;
            });
          });
        });
        return Promise.all(allFreezingsPromises).then((freezings) => {
          return freezings.filter((freezing: any) => {
            return +freezing.id > 0;
          }).sort((a: any, b: any) => {
            return +a.endDateTime > +b.endDateTime ? 1 : -1;
          });
        });
      });
    });
  }

  public unfreeze(freezingDate) {
    return this.HXYTokenContract.methods.releaseFrozen(freezingDate).send({
      from: this.HXYTokenContract.givenProvider.selectedAddress
    });
  }

  public refreezeHxy(freezingDate) {
    return this.HXYTokenContract.methods.refreezeHxy(freezingDate).send({
      from: this.HXYTokenContract.givenProvider.selectedAddress
    });
  }

  public claimDividends() {
    return this.DividendsContract.methods.claimDividends().send({
      from: this.HXYTokenContract.givenProvider.selectedAddress
    });
  }

  private getBlock() {
    return this.web3Service.getBlock();
  }

  public getDividendsState() {
    const promises = [
      this.DividendsContract.methods.getTodayDividendsTotal().call().then((ret) => {
        return {
          key: 'today',
          val: ret
        };
      }),
      this.DividendsContract.methods.getAvailableDividendsTotal().call().then((ret) => {
        return {
          key: 'availableTotal',
          val: ret
        };
      }),
      this.DividendsContract.methods.getClaimedDividendsTotal().call().then((ret) => {
        return {
          key: 'claimedTotal',
          val: ret
        };
      })
    ];

    return Promise.all(promises).then((res) => {
      const convertedResult = {};
      res.forEach((coinItem) => {
        convertedResult[coinItem.key] = coinItem.val.map((oneCoinValue, index) => {
          return {
            coin: dividendsKeys[index],
            value: +oneCoinValue
          };
        });
      });
      return convertedResult;
    });

  }
}