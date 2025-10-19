import fs from 'fs';
import PdfPrinter from 'pdfmake';
import { Content, StyleDictionary, TableCell, TDocumentDefinitions } from 'pdfmake/interfaces';

// Define the type for invoice
export interface InvoiceHeader {
    topHeader: string,
    companyName: string,
    companyAddress: string,
    companyContractInfo: string,
    memoNo: string,
    customerName: string,
    customerAddress: string,
    customerContractInfo: string,
    date: string,
};

export interface InvoiceButtom {
    paymentMethod: string,
    paymentStatus: string,
    note: string,
    subTotalAmount: string,
    vatAmount: string,
    discountAmount: string,
    totalAmount: string,
};

type TableRow = TableCell[];

export interface InvoiceFooter {
    terms: string,
    footerTitle: string
};

interface PdfFont {
    normal: string;
    bold?: string;
    italics?: string;
    bolditalics?: string;
}

export interface PdfFonts {
    [fontName: string]: PdfFont;
}

export function invoiceFont(): PdfFonts {
    return {
        Roboto: {
            normal: './Roboto-VariableFont.ttf',
            bold: './Roboto_Condensed-Bold.ttf',
            italics: './Roboto-VariableFont.ttf',
            bolditalics: './Roboto-VariableFont.ttf'
        }
    };
}

export function invoiceHeader(data: InvoiceHeader): Content[] {
    return [
        // Top Header
        {
            text: data.topHeader,
            style: 'topHeader',
            alignment: 'center',
            margin: [0, 0, 0, 5]
        },

        // Company Header
        {
            stack: [
                {
                    text: data.companyName,
                    style: 'companyName',
                    alignment: 'center'
                },
                {
                    text: data.companyAddress,
                    style: 'companyDetails',
                    alignment: 'center'
                },
                {
                    text: data.companyContractInfo,
                    style: 'companyDetails',
                    alignment: 'center'
                }
            ],
            margin: [0, 0, 0, 10]
        },

        // Separator line
        {
            canvas: [
                {
                    type: 'line',
                    x1: 0, y1: 0,
                    x2: 380, y2: 0,
                    lineWidth: 0.5
                },
                {
                    type: 'line',
                    x1: 0, y1: 1.6,
                    x2: 380, y2: 1.6,
                    lineWidth: 0.5
                }
            ],
            margin: [0, 0, 0, 15]
        },

        // Info Section
        {
            columns: [
                {
                    stack: [
                        { text: [{ text: 'Memo No: ', bold: true }, data.memoNo], style: 'info' },
                        { text: [{ text: 'Customer: ', bold: true }, data.customerName], style: 'info' },
                        { text: [{ text: 'Address: ', bold: true }, data.customerAddress], style: 'info' }
                    ],
                    width: '70%'
                },
                {
                    stack: [
                        { text: [{ text: 'Date: ', bold: true }, data.date], style: 'info' },
                        { text: [{ text: 'Mobile: ', bold: true }, data.customerContractInfo], style: 'info' }
                    ],
                    width: '30%'
                }
            ],
            margin: [0, 0, 0, 15]
        },
    ];
}

export function invoiceButtom(data: InvoiceButtom): Content[] {
    return [
        {
            columns: [
                // Payment Section
                {
                    stack: [
                        { text: [{ text: 'Payment: ', bold: true }, data.paymentMethod], style: 'payment' },
                        { text: [{ text: 'Status: ', bold: true }, data.paymentStatus], style: 'payment' },
                        { text: [{ text: 'Note: ', bold: true }, data.note], style: 'payment' }
                    ],
                    width: '45%'
                },
                // Amount Section
                {
                    stack: [
                        {
                            columns: [
                                { text: 'Sub-Total:', bold: true, alignment: 'right', width: '*' },
                                { text: data.subTotalAmount, alignment: 'right', width: 100 }
                            ],
                            style: 'totalRow'
                        },
                        {
                            columns: [
                                { text: 'VAT (0%):', bold: true, alignment: 'right', width: '*' },
                                { text: data.vatAmount, alignment: 'right', width: 100 }
                            ],
                            style: 'totalRow'
                        },
                        {
                            columns: [
                                { text: 'Discount:', bold: true, alignment: 'right', width: '*' },
                                { text: data.discountAmount, alignment: 'right', width: 100 }
                            ],
                            style: 'totalRow'
                        },
                        {
                            columns: [
                                { text: 'Grand Total:', bold: true, alignment: 'right', width: '*' },
                                { text: data.totalAmount, alignment: 'right', width: 100, bold: true, }
                            ],
                            style: 'grandTotalRow'
                        }
                    ],
                    width: '55%'
                }
            ]
        }
    ];
}

export function invoiceFooter(
    data: InvoiceFooter
): { footer: Content } {
    return {
        footer: {
            stack: [
                // Terms & Conditions
                {
                    text: [
                        { text: 'Terms & Conditions: ', bold: true },
                        data.terms
                    ],
                    fontSize: 6,
                    margin: [20, 10, 20, 0]
                },
                {
                    canvas: [
                        {
                            type: 'line',
                            x1: 0, y1: 0,
                            x2: 380, y2: 0,
                            lineWidth: 0.5
                        }
                    ],
                    margin: [20, 3, 0, 3]
                },
                {
                    text: data.footerTitle,
                    fontSize: 6,
                    margin: [20, 0, 5, 3]
                }
            ]

        }
    };
}

export function invoiceStyle(): { styles: StyleDictionary } {
    return {
        styles: {
            topHeader: {
                fontSize: 7,
                bold: true,
            },
            companyName: {
                fontSize: 11,
                bold: true,
                color: '#2c3e50',
                margin: [0, 0, 0, 5]
            },
            companyDetails: {
                fontSize: 7,
            },
            info: {
                fontSize: 9,
                margin: [0, 0, 0, 5]
            },
            tableHeader: {
                fontSize: 9,
                bold: true,
                color: 'black'
            },
            tableCell: {
                fontSize: 9
            },
            payment: {
                fontSize: 9,
                margin: [0, 0, 0, 5]
            },
            totalRow: {
                fontSize: 9,
                margin: [0, 0, 0, 5]
            },
            grandTotalRow: {
                fontSize: 9,
                bold: true,
                margin: [0, 8, 0, 0]
            },
        }
    };
}

export function generateInvoice(
    invoiceHeaderData: InvoiceHeader,
    tableBody: TableRow[],
    invoiceButtomData: InvoiceButtom,
    footerData: InvoiceFooter
) {
    const fonts = invoiceFont();
    const printer = new PdfPrinter(fonts);

    const docDefinition: TDocumentDefinitions = {
        pageSize: 'A5',
        pageMargins: [20, 20, 20, 45],
        content: [
            //header
            ...invoiceHeader(invoiceHeaderData),

            // Items Table
            {
                table: {
                    headerRows: 1,
                    widths: [30, '*', 40, 80, 80],
                    body: tableBody
                },
                layout: {
                    hLineWidth: (i: number, node: any): number => {
                        return (i === 0 || i === 1 || i === node.table.body.length) ? 1 : 0.5;
                    },
                    vLineWidth: (): number => 0,
                    hLineColor: (): string => 'black',
                    paddingTop: (): number => 3,
                    paddingBottom: (): number => 3
                },
                margin: [0, 0, 0, 20]
            },

            // Total Section
            ...invoiceButtom(invoiceButtomData)
        ],

        // Footer
        ...invoiceFooter(footerData),

        // style
        ...invoiceStyle()
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    pdfDoc.pipe(fs.createWriteStream('output.pdf'));
    pdfDoc.end();


    console.log('✅ PDF created successfully!');
}

interface MemoItem {
    sl: number;
    description: string;
    qty: number;
    price: number;
    total: number;
}

interface MemoData {
    memoNo: string;
    date: string;
    customer: string;
    address: string;
    mobile: string;
    items: MemoItem[];
    payment: string;
    status: string;
    note: string;
    subTotal: number;
    vat: number;
    discount: number;
    grandTotal: number;
}

// Sample data - replace with your actual data
export const memoData: MemoData = {
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

const invoiceHeaderData: InvoiceHeader = {
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

const tableBody: TableRow[] = [
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

const invoiceButtomData: InvoiceButtom = {
    discountAmount: memoData.discount.toString(),
    note: memoData.note,
    paymentMethod: memoData.payment,
    paymentStatus: memoData.status,
    subTotalAmount: memoData.subTotal.toString(),
    totalAmount: memoData.grandTotal.toString(),
    vatAmount: memoData.vat.toString()
};

const invoiceFooterData: InvoiceFooter = {
    footerTitle: 'Thank you for your business! Please visit again.',
    terms: 'Products can be exchanged within 7 days of purchase. Memo must be preserved.'
};

generateInvoice(
    invoiceHeaderData,
    tableBody,
    invoiceButtomData,
    invoiceFooterData
);

