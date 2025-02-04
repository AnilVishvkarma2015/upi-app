import { UPIAccountModel } from "./upi-account.model";

export class UPIPaymentModel {
    payerAccount: UPIAccountModel;
    payeeAccount: UPIAccountModel;
    txnAmount: string;
}