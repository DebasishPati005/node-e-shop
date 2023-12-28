"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PdfDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
function generateInvoicePdf(order, callBack) {
    const pdfDoc = new PdfDocument();
    const invoiceName = 'invoice-' + order._id + '.pdf';
    const invoicePath = path.join('utils', 'invoices', invoiceName);
    // Pipe the PDF to a file (you can also send it to a response stream)
    const pdfStream = fs.createWriteStream(invoicePath);
    pdfDoc.pipe(pdfStream);
    // Write content to the PDF
    pdfDoc.fontSize(28).fillColor('aqua').text('Invoice', { underline: true });
    pdfDoc.fontSize(20).fillColor('black');
    pdfDoc.text(`Order ID: ${order._id}`);
    pdfDoc.moveDown();
    // Personal Information
    pdfDoc.fontSize(18).text(`Full Name: ${order.fullName}`);
    pdfDoc.fontSize(18).text(`Email: ${order.email}`);
    pdfDoc.moveDown();
    // Products Ordered
    pdfDoc.fontSize(18);
    pdfDoc.text('Products Ordered');
    // Create a table for products
    const col1Width = 25;
    const col2Width = 15;
    const col3Width = 8;
    const col4Width = 10;
    // const colSpacing = 5;
    pdfDoc
        .fontSize(19)
        .fillColor('gray')
        .text(alignText('Name', col1Width) +
        alignText('Price', col2Width, 'right') +
        alignText('Qty', col3Width, 'right') +
        alignText('Amount', col4Width, 'right'));
    order.productsOrdered.products.forEach((product) => {
        pdfDoc
            .fontSize(16)
            .text(alignText(product.name, col1Width) +
            alignText(product.price, col2Width, 'right') +
            alignText(product.quantity, col3Width, 'right') +
            alignText((product.quantity * product.price).toString(), col4Width, 'right'));
    });
    pdfDoc.fontSize(18).text('----------  ----------  ----------   ----------  ----------  ---------- -----');
    // Additional order details if needed
    pdfDoc.fontSize(18);
    pdfDoc.text(`Total Price: Rs. ${order.productsOrdered.totalPrice}/-`);
    pdfDoc.text(`Order Date: ${new Date(order.createdAt).toLocaleString()}`);
    pdfDoc.moveDown().fillColor('black');
    // Address Section
    pdfDoc.text(`Address: ${order.address}`);
    pdfDoc.text(`City: ${order.city}`);
    pdfDoc.text(`State: ${order.state}`);
    pdfDoc.moveDown();
    // End the PDF
    pdfDoc.end();
    callBack(invoicePath, invoiceName);
}
const alignText = (text, width, alignment) => {
    const padLength = width - text.toString().length;
    if (alignment === 'right') {
        return ' '.repeat(padLength) + text;
    }
    else {
        return text + ' '.repeat(padLength);
    }
};
exports.default = generateInvoicePdf;
