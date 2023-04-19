const asyncHandler = require('express-async-handler');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const moment = require('moment');
const orderHelpers = require('../helpers/order-helper');
const userHelpers = require('../helpers/user-helper');
const productHelpers = require('../helpers/product-helper');

// Download invoice of order
const invoiceDownload = asyncHandler(async (req, res) => {
  try {
    console.log('reached invoice download:::');
    const { orderId } = req.params;
    const invoiceDetails = await orderHelpers.getSingleOrderDetails(orderId);

    const userData = await userHelpers.findUser(invoiceDetails.userId);

    const { products } = invoiceDetails;
    const productDetails = await Promise.all(
      products.map(async (product) => {
        const prod = await productHelpers.findSingleProductId(product.prodId);
        return {
          ...prod,
          quantity: product.quantity,
          subTotal: product.subTotal,
        };
      })
    );
    const foundProducts = JSON.parse(JSON.stringify(productDetails));

    // // Generate the invoice using pdfkit
    // const doc = new Pdfkit();

    // doc.text(`Invoice for order ${orderId}`);
    // doc.text(`Total: ₹ ${invoiceDetails.totalPrice}`);
    // doc.end();

    const path = `public/invoices/invoice_${orderId}.pdf`;
    // doc.pipe(fs.createWriteStream(filePath));
    // // Return the invoice file as a download
    // res.download(filePath, `invoice_${orderId}.pdf`);
    // // res.json({ doc });

    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
    });

    generateHeader(doc);
    generateCustomerInformation(doc, userData, invoiceDetails);
    generateInvoiceTable(doc, invoiceDetails, foundProducts);
    generateFooter(doc);

    // doc.end();
    // doc.pipe(fs.createWriteStream(path));

    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=invoice_${orderId}.pdf`
      );
      res.setHeader('Content-Length', pdfData.length);
      res.send(pdfData);
    });
    doc.end();
  } catch (error) {
    // throw new Error(error);
    console.error(error);
    res.status(500).send('An error occurred while generating the invoice.');
  }
});

// header of the pdf
function generateHeader(doc) {
  doc
    .image('public/assets-user/imgs/theme/Heats.png', 50, 45, { width: 100 })
    // .image('', 50, 45, { width: 50 })
    .fillColor('#444444')
    // .fontSize(14)
    // .text('Heats Shoes.', 110, 57)
    .fontSize(10)
    .text('Heats shoes.', 200, 50, { align: 'right' })
    .text('123 Main Street', 200, 65, { align: 'right' })
    .text('Bangalore, IN, 680212', 200, 80, { align: 'right' })
    .moveDown();
}

// customer information
function generateCustomerInformation(doc, userData, invoiceDetails) {
  doc.fillColor('#444444').fontSize(20).text('Tax Invoice', 50, 160);

  generateHr(doc, 185);

  const customerInformationTop = 200;
  const customerName = `${userData.firstname} ${userData.lastname}`;
  doc
    .fontSize(10)
    .text('Invoice Number:', 50, customerInformationTop)
    .font('Helvetica-Bold')
    .text(`IN${invoiceDetails._id}`, 150, customerInformationTop)
    .font('Helvetica')
    .text('Invoice Date:', 50, customerInformationTop + 17)
    .text(formatDate(new Date()), 150, customerInformationTop + 17)
    .text('Order Id:', 50, customerInformationTop + 32)
    .font('Helvetica-Bold')
    .text(invoiceDetails.orderId, 150, customerInformationTop + 32)
    .font('Helvetica')
    .text('Order Date:', 50, customerInformationTop + 47)
    .text(
      formatDate(invoiceDetails.createdAt),
      150,
      customerInformationTop + 47
    )
    // .text('Balance Due:', 50, customerInformationTop + 30)
    // .text(
    //   formatCurrency(invoiceDetails.subtotal - invoiceDetails.paid),
    //   150,
    //   customerInformationTop + 30
    // )

    .font('Helvetica-Bold')
    .text(customerName, 330, customerInformationTop)
    .font('Helvetica')
    .text(
      invoiceDetails.deliveryDetails.locality,
      330,
      customerInformationTop + 17
    )
    .text(
      `${invoiceDetails.deliveryDetails.area}, ${invoiceDetails.deliveryDetails.district}, ${invoiceDetails.deliveryDetails.state}`,
      330,
      customerInformationTop + 32
    )
    .moveDown();

  generateHr(doc, 252 + 17);
}

// Invoice table
function generateInvoiceTable(doc, invoiceDetails, foundProducts) {
  let i;
  const invoiceTableTop = 330;

  doc.font('Helvetica-Bold');
  generateTableRow(
    doc,
    invoiceTableTop,
    'Item',
    'Description',
    'Unit Cost',
    'Quantity',
    'Sub Total'
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font('Helvetica');

  for (i = 0; i < foundProducts.length; i++) {
    const item = foundProducts[i];
    const description = `${item.brand}'s ${item.category}'s ${item.subCategory}`;
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.title,
      description,
      formatCurrency(item.price / item.quantity),
      item.quantity,
      formatCurrency(item.subTotal)
    );

    generateHr(doc, position + 30);
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(
    doc,
    subtotalPosition,
    '',
    '',
    'Grand Total:',
    '',
    formatCurrency(invoiceDetails.totalPrice)
  );

  //   const paidToDatePosition = subtotalPosition + 20;
  //   generateTableRow(
  //     doc,
  //     paidToDatePosition,
  //     '',
  //     '',
  //     'Paid To Date',
  //     '',
  //     formatCurrency(invoice.paid)
  //   );

  //   const duePosition = paidToDatePosition + 25;
  //   doc.font('Helvetica-Bold');
  //   generateTableRow(
  //     doc,
  //     duePosition,
  //     '',
  //     '',
  //     'Balance Due',
  //     '',
  //     formatCurrency(invoice.subtotal - invoice.paid)
  //   );
  //   doc.font('Helvetica');
}

// Footer of pdf
function generateFooter(doc) {
  doc.fontSize(10).text('Thank you for your business.', 50, 780, {
    align: 'center',
    width: 500,
  });
}

// generate row
function generateTableRow(
  doc,
  y,
  item,
  description,
  unitCost,
  quantity,
  subTotal
) {
  const itemX = 50;
  const itemWidth = 100;
  const descX = 150;
  const descWidth = 100;
  const colY = y + 5;

  doc
    .fontSize(10)
    .text(item, itemX, colY, { width: itemWidth, lineGap: 3 })
    .text(description, descX, colY, { width: descWidth, lineGap: 3 })
    .text(unitCost, 280, colY, { width: 90, align: 'right' })
    .text(quantity, 370, colY, { width: 90, align: 'right' })
    .text(subTotal, 0, colY, { align: 'right' });
}

// generate hr
function generateHr(doc, y) {
  doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

// format currency
function formatCurrency(price) {
  return `Rs. ${price.toFixed(2)}`;
}

// format date
// function formatDate(date) {
//   const day = date.getDate();
//   const month = date.getMonth() + 1;
//   const year = date.getFullYear();

//   return `${day}/${month}/${year}`;
// }
function formatDate(date) {
    return moment(date).format('ddd, MMM D, YYYY, h:mmA');
  }

module.exports = { invoiceDownload };
