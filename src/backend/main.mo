import Text "mo:core/Text";
import Time "mo:core/Time";
import Float "mo:core/Float";
import Runtime "mo:core/Runtime";

import OutCall "http-outcalls/outcall";

actor {
  type CryptoPrice = {
    symbol : Text;
    price : Float;
    changePercent : Float;
    volume : Float;
  };

  type ProfitCalculation = {
    profitLossAmount : Float;
    profitLossPercent : Float;
    isProfit : Bool;
  };

  type TaxCalculation = {
    taxAmount : Float;
    isTaxable : Bool;
  };

  // Kept for stable variable compatibility with previous version
  stable var cachedCryptoPrices : ?([CryptoPrice], Time.Time) = null;
  stable var cacheDuration : Time.Time = 60 * 1_000_000_000;

  // Pass-through transform required by http-outcalls component
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    { status = input.response.status; body = input.response.body; headers = [] };
  };

  // Calculate profit or loss from trade
  public query ({ caller }) func calculateProfit(
    buyPrice : Float,
    sellPrice : Float,
    quantity : Float,
  ) : async ProfitCalculation {
    if (buyPrice <= 0 or sellPrice <= 0 or quantity <= 0) {
      Runtime.trap("Values must be positive");
    };

    let totalBuy = buyPrice * quantity;
    let totalSell = sellPrice * quantity;
    let profitLossAmount = totalSell - totalBuy;
    let profitLossPercent = (profitLossAmount / totalBuy) * 100;
    let isProfit = profitLossAmount > 0;

    {
      profitLossAmount;
      profitLossPercent;
      isProfit;
    };
  };

  // Calculate tax on profit
  public query ({ caller }) func calculateTax(
    profitAmount : Float,
    taxPercent : Float,
  ) : async TaxCalculation {
    if (taxPercent < 0) { Runtime.trap("taxPercent must be positive") };

    if (profitAmount <= 0) {
      return {
        taxAmount = 0.0;
        isTaxable = false;
      };
    };

    let taxAmount = profitAmount * (taxPercent / 100);
    {
      taxAmount;
      isTaxable = true;
    };
  };
};
