import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CommonUtils {
    branchCodes = new Map();

    constructor() {
        this.initializeBranchCodes();
    }

    loadAccountTypes(): String[] {
        let accountTypes = ['SAVINGS', 'CURRENT'];
        return accountTypes;
    }

    loadGenders() {
        let genders = ['Male', 'Female'];
        return genders;
    }

    loadNetworkProviders(): String[] {
        let networkProviders = ['JIO', 'Airtel', 'Vodafone Idea', 'BSNL'];
        return networkProviders;
    }

    loadBankBranches(): String[] {
        let branches = ['BAVDHAN', 'DHANORI', 'HINJEWADI', 'SHIVAJI NAGAR'];
        return branches;
    }

    loadBranchCodes(bankCode: string, branch: string): String {
        let selectedBankBranch = bankCode.concat("-").concat(branch);
        return this.branchCodes.get(selectedBankBranch);
    }

    loadSupportedBanks(): any[] {
        return [
            { 'bankCode': 'SBI', 'bankName': 'State Bank of India' },
            { 'bankCode': 'HDFC', 'bankName': 'HDFC' },
            { 'bankCode': 'ICICI', 'bankName': 'ICICI Bank' },
            { 'bankCode': 'BOB', 'bankName': 'Bank of Baroda' }
        ]
    }

    initializeBranchCodes() {
        this.branchCodes.set("SBI-BAVDHAN", "SBIN0013280");
        this.branchCodes.set("SBI-DHANORI", "SBIN0061474");
        this.branchCodes.set("SBI-HINJEWADI", "SBIN0010203");
        this.branchCodes.set("SBI-SHIVAJI NAGAR", "SBIN0003298");

        this.branchCodes.set("HDFC-BAVDHAN", "HDFC0002690");
        this.branchCodes.set("HDFC-DHANORI", "HDFC0009317");
        this.branchCodes.set("HDFC-HINJEWADI", "HDFC0000794");
        this.branchCodes.set("HDFC-SHIVAJI NAGAR", "HDFC0005759");

        this.branchCodes.set("BOB-BAVDHAN", "BARB0BAVDHA");
        this.branchCodes.set("BOB-DHANORI", "BARB0VJLOHE");
        this.branchCodes.set("BOB-HINJEWADI", "BARB0DBMANN");
        this.branchCodes.set("BOB-SHIVAJI NAGAR", "BARB0SHIPOO");

        this.branchCodes.set("ICICI-BAVDHAN", "ICIC0001876");
        this.branchCodes.set("ICICI-DHANORI", "ICIC0003977");
        this.branchCodes.set("ICICI-HINJEWADI", "ICIC0000986");
        this.branchCodes.set("ICICI-SHIVAJI NAGAR", "ICIC0000039");
    }
}
