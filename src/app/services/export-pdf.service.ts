import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BankTransactionModel } from '../models/bank-transactions.model';

@Injectable({
    providedIn: 'root'
})
export class ExportPdfService {

    exportAccountsToPdf(columns: any, rows: any[], item: string, currentBank: any) {
        const doc = new jsPDF('landscape', 'pt');
        doc.addFont("Helvetica-Bold", 'Helvetica-Bold', 'bold');
        doc.setFontSize(18);
        doc.text((currentBank.bankName).toUpperCase(), 40, 40);
        doc.setFontSize(10);
        doc.text("Address: " + currentBank.bankAddress, 40, 55);
        doc.text("License No.: " + currentBank.bankLicense, 40, 70);
        doc.text("Phone: " + currentBank.bankPhone, 40, 85);
        doc.text("Email: " + currentBank.bankEmail, 40, 100);
        doc.setLineWidth(3);
        doc.line(40, 110, 800, 110);
        doc.setFontSize(11);
        doc.text(item, 360, 135);
        autoTable(doc, { margin: { top: 150 }, head: [columns], body: rows });
        doc.save(item + '.pdf');
    }

    exportTransactionsToPdf(columns: any, rows: any[], item: string, currentBank: any) {
        const doc = new jsPDF('landscape', 'pt');
        doc.addFont("Helvetica-Bold", 'Helvetica-Bold', 'bold');
        doc.setFontSize(18);
        doc.text((currentBank.bankName).toUpperCase(), 40, 40);
        doc.setFontSize(10);
        doc.text("Address: " + currentBank.bankAddress, 40, 55);
        doc.text("License No.: " + currentBank.bankLicense, 40, 70);
        doc.text("Phone: " + currentBank.bankPhone, 40, 85);
        doc.text("Email: " + currentBank.bankEmail, 40, 100);
        doc.setLineWidth(3);
        doc.line(40, 110, 800, 110);
        doc.setFontSize(11);
        doc.text(item, 360, 135);
        autoTable(doc, { margin: { top: 150 }, head: [columns], body: rows });
        doc.save(currentBank.bankCode + "-" + item + '.pdf');
    }

    exportStatementToPdf(columns: any, rows: any[], item: string, currentTxn: BankTransactionModel, currentBank: any) {
        const doc = new jsPDF('landscape', 'pt');
        doc.addFont("Helvetica-Bold", 'Helvetica-Bold', 'bold');
        doc.setFontSize(18);
        doc.text((currentBank.bankName).toUpperCase(), 40, 40);
        doc.setFontSize(10);
        doc.text("Address: " + currentBank.bankAddress, 40, 55);
        doc.text("License No.: " + currentBank.bankLicense, 40, 70);
        doc.text("Phone: " + currentBank.bankPhone, 40, 85);
        doc.text("Email: " + currentBank.bankEmail, 40, 100);
        doc.setLineWidth(3);
        doc.line(40, 110, 800, 110);
        doc.setFontSize(11);
        doc.text(item, 360, 135);

        let accRows: any[] = [];
        let accColumns = ["TITLE", "DETAILS"];
        accRows.push(['Account Name', currentTxn.accName]);
        accRows.push(['Account Number', currentTxn.accNum]);
        accRows.push(['Account IFSC', currentTxn.accIfsc]);
        accRows.push(['Account Type', currentTxn.accType]);
        accRows.push(['Branch Name', currentTxn.bankBranch]);
        accRows.push(['Mobile No.', currentTxn.mobileNo]);
        console.log(accRows)
        autoTable(doc, { margin: { top: 120 }, head: [accColumns], body: accRows });
        doc.setLineWidth(3);
        doc.line(40, 305, 800, 305);

        autoTable(doc, { margin: { top: 20 }, head: [columns], body: rows });
        doc.save(currentBank.bankCode + "-" + item + '.pdf');
    }

    exportAccountToPdf(columns: any, item: string, fileName: string, rows: any[], currentBank: any) {
        const doc = new jsPDF('l', 'pt');
        doc.addFont("Helvetica-Bold", 'Helvetica-Bold', 'bold');
        doc.setFontSize(18);
        doc.text((currentBank.bankName).toUpperCase(), 40, 40);
        doc.setFontSize(10);
        doc.text("Address: " + currentBank.bankAddress, 40, 55);
        doc.text("License No.: " + currentBank.bankLicense, 40, 70);
        doc.text("Phone: " + currentBank.bankPhone, 40, 85);
        doc.text("Email: " + currentBank.bankEmail, 40, 100);
        doc.setLineWidth(3);
        doc.line(40, 110, 800, 110);
        doc.setFontSize(11);
        doc.text(item, 360, 135);
        autoTable(doc, { margin: { top: 150 }, head: [columns], body: rows });
        doc.setLineWidth(3);
        doc.line(40, 350, 800, 350);
        doc.save(fileName + '.pdf');
    }
}
