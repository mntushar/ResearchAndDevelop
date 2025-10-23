import generateInvoice from "./invoice_pdf_final.mjs";

// Sample data - replace with your actual data
export const memoData = {
    memoNo: 'CM-2025-001',
    date: '29/09/2025',
    customer: 'Rahim Ahmed',
    address: 'Mirpur, Dhaka',
    mobile: '01712-345678',
    items: [
        { sl: 1, description: 'T-Shirt (White)', qty: 2, price: 500.00, total: 1000.00 },
        { sl: 2, description: 'Jeans Pant (Blue)', qty: 1, price: 1500.00, total: 1500.00 },
        { sl: 3, description: 'Shoes', qty: 1, price: 2000.00, total: 2000.00 }
    ],
    payment: 'Cash',
    status: 'Paid',
    note: '-',
    subTotal: 4500.00,
    vat: 0.00,
    discount: 200.00,
    grandTotal: 4300.00
};

const invoiceHeaderData = {
    companyName: 'Your Company Name',
    companyAddress: 'Address: 123 Main Road, Dhaka-1200',
    companyContractInfo: 'Phone: 01712-345678 | Email: info@company.com',
    customerName: memoData.customer,
    customerAddress: memoData.address,
    customerContractInfo: memoData.mobile,
    date: memoData.date,
    memoNo: memoData.memoNo,
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
    ...memoData.items.map(item => [
        { text: item.sl.toString(), alignment: 'center', style: 'tableCell' },
        { text: item.description, style: 'tableCell' },
        { text: item.qty.toString(), alignment: 'center', style: 'tableCell' },
        { text: item.price.toFixed(2), alignment: 'right', style: 'tableCell' },
        { text: item.total.toLocaleString('en-US', { minimumFractionDigits: 2 }), alignment: 'right', style: 'tableCell' }
    ]),
];

const invoiceButtomData = {
    discountAmount: memoData.discount.toString(),
    note: memoData.note,
    paymentMethod: memoData.payment,
    paymentStatus: memoData.status,
    subTotalAmount: memoData.subTotal.toString(),
    totalAmount: memoData.grandTotal.toString(),
    vatAmount: memoData.vat.toString()
};

const invoiceFooterData = {
    footerTitle: 'Thank you for your business! Please visit again.',
    terms: 'Products can be exchanged within 7 days of purchase. Memo must be preserved.'
};

export default function runInvoice() {
    generateInvoice(
        invoiceHeaderData,
        tableBody,
        invoiceButtomData,
        invoiceFooterData
    );
}