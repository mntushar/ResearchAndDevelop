import { memoData } from "./pdf_main";
import { pool } from "./worker/worker_thread";

(async () => {
    // @ts-ignore
    const codef = (data) => {
        const invoiceHeaderData = {
            companyName: 'Your Company Name',
            companyAddress: 'Address: 123 Main Road, Dhaka-1200',
            companyContractInfo: 'Phone: 01712-345678 | Email: info@company.com',
            customerName: data.memoData.customer,
            customerAddress: data.memoData.address,
            customerContractInfo: data.memoData.mobile,
            date: data.memoData.date,
            memoNo: data.memoData.memoNo,
            topHeader: 'CASH MEMO'
        };

        const tableBody = [
            // Header row
            [
                { text: 'SL', style: 'tableHeader', alignment: 'center' },
                { text: 'Item Description', style: 'tableHeader' },
                { text: 'Qty', style: 'tableHeader', alignment: 'center' },
                { text: 'Price (BDT)', style: 'tableHeader', alignment: 'right' },
                { text: 'Total (BDT)', style: 'tableHeader', alignment: 'right' }
            ],

            // Data rows
            ...data.memoData.items.map(item => [
                { text: item.sl.toString(), alignment: 'center', style: 'tableCell' },
                { text: item.description, style: 'tableCell' },
                { text: item.qty.toString(), alignment: 'center', style: 'tableCell' },
                { text: item.price.toFixed(2), alignment: 'right', style: 'tableCell' },
                { text: item.total.toLocaleString('en-US', { minimumFractionDigits: 2 }), alignment: 'right', style: 'tableCell' }
            ]),
        ];

        const invoiceButtomData = {
            discountAmount: data.memoData.discount.toString(),
            note: data.memoData.note,
            paymentMethod: data.memoData.payment,
            paymentStatus: data.memoData.status,
            subTotalAmount: data.memoData.subTotal.toString(),
            totalAmount: data.memoData.grandTotal.toString(),
            vatAmount: data.memoData.vat.toString()
        };

        const invoiceFooterData = {
            footerTitle: 'Thank you for your business! Please visit again.',
            terms: 'Products can be exchanged within 7 days of purchase. Memo must be preserved.'
        };

        data.dependencyFunction(
            invoiceHeaderData,
            tableBody,
            invoiceButtomData,
            invoiceFooterData
        );
    }

    const codes = `
  const fn = ${codef.toString()};
  return fn(task);
`;
    const generateInvoice  = await import('./invoice_pdf_final.mjs');
    const data = {
        dependencyFunction: generateInvoice,
        memoData: memoData
    }
    await pool.runTaskScriptCode(codes, { data });
})();