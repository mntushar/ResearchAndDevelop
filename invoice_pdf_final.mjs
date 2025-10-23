// @ts-nocheck

import fs from 'fs';
import path from 'path';
import PdfPrinter from 'pdfmake';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fonts
export function invoiceFont() {
    return {
        Roboto: {
            normal: path.join(__dirname, 'Roboto-VariableFont.ttf'),
            bold: path.join(__dirname, 'Roboto_Condensed-Bold.ttf'),
            italics: path.join(__dirname, 'Roboto-VariableFont.ttf'),
            bolditalics: path.join(__dirname, 'Roboto-VariableFont.ttf')
        }
    };
}

// Header
export function invoiceHeader(data) {
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

// Bottom (Totals & Payment)
export function invoiceButtom(data) {
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

// Footer
export function invoiceFooter(data) {
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

// Styles
export function invoiceStyle() {
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

export default function generateInvoice(
    invoiceHeaderData,
    tableBody,
    invoiceButtomData,
    footerData
) {
    const fonts = invoiceFont();
    const printer = new PdfPrinter(fonts);

    const docDefinition = {
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
                    hLineWidth: (i, node) => {
                        return (i === 0 || i === 1 || i === node.table.body.length) ? 1 : 0.5;
                    },
                    vLineWidth: () => 0,
                    hLineColor: () => 'black',
                    paddingTop: () => 3,
                    paddingBottom: () => 3
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


