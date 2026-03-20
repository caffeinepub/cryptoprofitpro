import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface ProfitCalculation {
    profitLossAmount: number;
    isProfit: boolean;
    profitLossPercent: number;
}
export interface TaxCalculation {
    taxAmount: number;
    isTaxable: boolean;
}
export interface CryptoPrice {
    volume: number;
    price: number;
    changePercent: number;
    symbol: string;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface backendInterface {
    calculateProfit(buyPrice: number, sellPrice: number, quantity: number): Promise<ProfitCalculation>;
    calculateTax(profitAmount: number, taxPercent: number): Promise<TaxCalculation>;
    getCryptoPrices(): Promise<Array<CryptoPrice>>;
    transform(arg0: TransformationInput): Promise<TransformationOutput>;
}
