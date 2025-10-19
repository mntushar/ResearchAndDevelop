import { WorkerPool } from './worker';

// Types
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

(async () => {
    const pool = new WorkerPool();
    await pool.executeTask<void>(
        (fs, PdfPrinter, memoData) => {
            return new Promise((resolve, reject) => {
                const fonts = {
                    Roboto: {
                        normal: 'fonts/Roboto-VariableFont.ttf'
                    }
                };

                const printer = new PdfPrinter(fonts);

                const docDefinition = {
                    pageSize: 'A5',
                    pageMargins: [20, 20, 20, 45],
                    content: [
                        //header
                        // Top Header
                        {
                            text: 'CASH MEMO',
                            style: 'topHeader',
                            alignment: 'center',
                            margin: [0, 0, 0, 5]
                        },

                        // Company Header
                        {
                            stack: [
                                {
                                    text: 'Your Company Name',
                                    style: 'companyName',
                                    alignment: 'center'
                                },
                                {
                                    text: 'Address: 123 Main Road, Dhaka-1200',
                                    style: 'companyDetails',
                                    alignment: 'center'
                                },
                                {
                                    text: 'Phone: 01712-345678 | Email: info@company.com',
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
                                        { text: [{ text: 'Memo No: ', bold: true }, memoData.memoNo], style: 'info' },
                                        { text: [{ text: 'Customer: ', bold: true }, memoData.customer], style: 'info' },
                                        { text: [{ text: 'Address: ', bold: true }, memoData.address], style: 'info' }
                                    ],
                                    width: '70%'
                                },
                                {
                                    stack: [
                                        { text: [{ text: 'Date: ', bold: true }, memoData.date], style: 'info' },
                                        { text: [{ text: 'Mobile: ', bold: true }, memoData.mobile], style: 'info' }
                                    ],
                                    width: '30%'
                                }
                            ],
                            margin: [0, 0, 0, 15]
                        },

                        // Items Table
                        {
                            table: {
                                headerRows: 1,
                                widths: [30, '*', 40, 80, 80],
                                body: [
                                    // Header
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
                                    ])
                                ]
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
                        {
                            columns: [
                                // Payment Section
                                {
                                    stack: [
                                        { text: [{ text: 'Payment: ', bold: true }, memoData.payment], style: 'payment' },
                                        { text: [{ text: 'Status: ', bold: true }, memoData.status], style: 'payment' },
                                        { text: [{ text: 'Note: ', bold: true }, memoData.note], style: 'payment' }
                                    ],
                                    width: '45%'
                                },
                                // Amount Section
                                {
                                    stack: [
                                        {
                                            columns: [
                                                { text: 'Sub-Total:', bold: true, alignment: 'right', width: '*' },
                                                { text: memoData.subTotal.toFixed(2), alignment: 'right', width: 100 }
                                            ],
                                            style: 'totalRow'
                                        },
                                        {
                                            columns: [
                                                { text: 'VAT (0%):', bold: true, alignment: 'right', width: '*' },
                                                { text: memoData.vat.toFixed(2), alignment: 'right', width: 100 }
                                            ],
                                            style: 'totalRow'
                                        },
                                        {
                                            columns: [
                                                { text: 'Discount:', bold: true, alignment: 'right', width: '*' },
                                                { text: `-${memoData.discount.toFixed(2)}`, alignment: 'right', width: 100 }
                                            ],
                                            style: 'totalRow'
                                        },
                                        {
                                            columns: [
                                                { text: 'Grand Total:', bold: true, alignment: 'right', width: '*' },
                                                { text: memoData.grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 }), alignment: 'right', width: 100, bold: true, }
                                            ],
                                            style: 'grandTotalRow'
                                        }
                                    ],
                                    width: '55%'
                                }
                            ]
                        },
                    ],

                    // Footer
                    footer: {
                        stack: [
                            // Terms & Conditions
                            {
                                text: [
                                    { text: 'Terms & Conditions: ', bold: true },
                                    'Products can be exchanged within 7 days of purchase. Memo must be preserved.'
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
                                text: 'Thank you for your business! Please visit again.',
                                fontSize: 6,
                                margin: [20, 0, 5, 3]
                            }
                        ]

                    },

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

                const pdfDoc = printer.createPdfKitDocument(docDefinition);
                const writeStream = fs.createWriteStream('output.pdf');

                // Handle stream events
                writeStream.on('finish', () => {
                    console.log('PDF created successfully!');
                    resolve();
                });

                writeStream.on('error', (err: any) => {
                    console.error('Write stream error:', err);
                    reject(err);
                });

                pdfDoc.on('error', (err: any) => {
                    console.error('PDF document error:', err);
                    reject(err);
                });

                pdfDoc.pipe(writeStream);
                pdfDoc.end();
            });
        },
        { fs: 'fs', PdfPrinter: 'pdfmake' },
        [memoData],
    );

    console.log('Done!');
})();


