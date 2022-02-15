import * as express from "express";
import { Wallet } from "ethers";
const { CowSdk, OrderKind } = require("@gnosis.pm/cow-sdk");

import { MNEMONIC } from "../../../config";
import { BaseController } from "../BaseController";

interface Jue {
  message: string;
}

const RinkebyNetwork = 4;

let wallet = Wallet.fromMnemonic(MNEMONIC);
console.log(MNEMONIC);
const cowSdk = new CowSdk(RinkebyNetwork, { signer: wallet });

export class CreateOrderController extends BaseController {
  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const quoteResponse = await cowSdk.cowApi.getQuote({
      kind: OrderKind.SELL,
      amount: "100000000000000000",
      sellToken: "0xc778417e063141139fce010982780140aa0cd5ab",
      buyToken: "0x4dbcdf9b62e891a7cec5a2568c3f4faf9e8abe2b",
      userAddress: "0x1811be0994930fe9480eaede25165608b093ad7a",
      validTo: 2524608000,
    });

    const order = {
      kind: OrderKind.SELL,
      sellToken: quoteResponse.quote.sellToken,
      buyToken: quoteResponse.quote.buyToken,
      validTo: quoteResponse.quote.validTo,
      buyAmount: quoteResponse.quote.buyAmount,
      sellAmount: quoteResponse.quote.sellAmount,
      receiver: quoteResponse.quote.receiver,
      partiallyFillable: false,
      feeAmount: quoteResponse.quote.feeAmount,
    };

    const signedOrder = await cowSdk.signOrder(order);

    const orderId = await cowSdk.cowApi.sendOrder({
      order: { ...order, ...signedOrder },
      owner: "0x1811be0994930fe9480eaede25165608b093ad7a",
    });

    console.log(orderId);

    const dto: Jue = { message: "Jueeee" };
    return this.ok<Jue>(res, dto);
  }
}
