import { jsPDF } from "jspdf";
const calculateTotalPrice = (quantity, price) => quantity * price;
const options = { day: "2-digit", month: "2-digit", year: "numeric" };
const Discount = 0;
const Tax = 0;

export const viewInvoice = (order) => {
  // Create a new jsPDF instance
  var pdf = new jsPDF({
    orientation: "p",
    unit: "mm",
    format: "a4",
    putOnlyUsedFonts: true,
  });

  // Add your watermark or other elements if needed

  // Set font and text color
  pdf.setFont("times");
  pdf.setTextColor(50);
  pdf.setDrawColor(200);

  // Add invoice header
  pdf.setFontSize(22);
  pdf.setFont("times", "bold");
  pdf.text(25, 20, "INVOICE");
  pdf.setFont("times", "normal");

  // Add customer information
  pdf.setFontSize(11);
  pdf.setFont("times", "bold");
  pdf.text(25, 30, "Invoice number");
  pdf.setFont("times", "normal");
  pdf.text(55, 30, `${order.orderNumber}`);

  pdf.setFont("times", "bold");
  pdf.text(25, 35, "Date of issue");
  pdf.setFont("times", "normal");
  pdf.text(
    55,
    35,
    `${new Date(order.orderDate).toLocaleString("en-IN", options)}`
  );

  // Add a line separator
  pdf.line(0, 40, 210, 40);

  const addressObject = order.shippingAddress;
  const addressString = `${addressObject.street}, ${addressObject.city}, ${addressObject.state} ${addressObject.zipcode}`;

  pdf.setFont("times", "bold");
  pdf.text(25, 48, "Billed to");
  pdf.setFont("times", "normal");
  pdf.text(25, 54, `${order.customer.name}`);
  pdf.text(25, 58, `${addressString}`);
  pdf.text(25, 66, `${order.customer.email}`);
  pdf.text(25, 71, `${order.customer.address.phone}`);

  // Add a line separator
  pdf.line(0, 75, 210, 75);

  pdf.setFont("times", "bold");
  pdf.text(25, 80, "Item");
  pdf.text(105, 80, "Qutanity");
  pdf.text(145, 80, "Rate");
  pdf.text(175, 80, "Amount");
  pdf.setFont("times", "normal");

  pdf.line(0, 85, 210, 85);

  // Add product details
  pdf.setFontSize(11);
  let startY = 95;
  order?.jerseys.forEach((item, index) => {
    const yPos = startY + index * 10;
    const productNameLines = pdf.splitTextToSize(item.jersey?.name, 80);

    // Display the wrapped text
    productNameLines.forEach((line, lineIndex) => {
      pdf.text(25, yPos + lineIndex * 6, line);
    });
    // pdf.text(25, yPos, `${item.product.name}`);
    pdf.text(110, yPos, `${item.quantity}`);
    pdf.text(145, yPos, `${item.price}.00`);
    pdf.text(175, yPos, `${item.price * item.quantity}.00`);
  });

  // Add a line separator
  pdf.line(
    0,
    startY + order.jerseys.length * 10 + 10,
    210,
    startY + order.jerseys.length * 10 + 10
  );


    // Sub Total amount
    pdf.text(120, startY + order.jerseys.length * 10 + 20, "Sub Total:");
    pdf.text(
      160,
      startY + order.jerseys.length * 10 + 20,
      `$${
        order.jerseys?.reduce(
          (total, cartItem) =>
            total +
            calculateTotalPrice(cartItem.quantity, cartItem.jersey.price),
          0
        ) - Discount
      }.00`
    );

  // Discount amount
  pdf.text(120, startY + order.jerseys.length * 10 + 25, "Discount:");
  pdf.text(160, startY + order.jerseys.length * 10 + 25, `$${Discount}.00`);

  // Tax amount
  pdf.text(120, startY + order.jerseys.length * 10 + 30, "Tax:");
  pdf.text(160, startY + order.jerseys.length * 10 + 30, `$${Tax}.00`);

  // total amount
  pdf.setFont("times", "bold");
  pdf.setFontSize(20);
  pdf.text(120, startY + order.jerseys.length * 10 + 40, "Total:");
  pdf.text(
    160,
    startY + order.jerseys.length * 10 + 40,
    `$${
      order.jerseys?.reduce(
        (total, cartItem) =>
          total +
          calculateTotalPrice(cartItem.quantity, cartItem.jersey?.price),
        0
      ) - Discount
    }.00`
  );
  pdf.setFont("times", "normal");

  // Add footer and other details if needed
  // Add a line separator
  pdf.line(0, 250, 210, 250);

  // Footer Section
  pdf.setFontSize(10);
  pdf.setTextColor(100);

  // Column 1
  pdf.text(25, 260, "Thank you for shopping with us!");
  pdf.text(25, 265, "For any inquiries, please contact:");
  pdf.text(25, 270, "Email: support@example.com");

  // Column 2
  pdf.text(110, 260, "Contact Details:");
  pdf.text(110, 265, "Phone: +123 456 7890");

  // Business Address
  pdf.text(25, 280, "Our Business Address:");
  pdf.text(25, 285, "123 Street, Cityville, Country");

  // Save the PDF with a specific filename
  const fileName = `${order.orderNumber}.pdf`;
  // pdf.save(fileName);
  return pdf;
};

export const downloadInvoice = (order) => {
  // Create a new jsPDF instance
  var pdf = new jsPDF({
    orientation: "p",
    unit: "mm",
    format: "a4",
    putOnlyUsedFonts: true,
  });

  // Add your watermark or other elements if needed

  // Set font and text color
  pdf.setFont("times");
  pdf.setTextColor(50);
  pdf.setDrawColor(200);

  // Add invoice header
  pdf.setFontSize(22);
  pdf.setFont("times", "bold");
  pdf.text(25, 20, "INVOICE");
  pdf.setFont("times", "normal");

  // Add customer information
  pdf.setFontSize(11);
  pdf.setFont("times", "bold");
  pdf.text(25, 30, "Invoice number");
  pdf.setFont("times", "normal");
  pdf.text(55, 30, `${order.orderNumber}`);

  pdf.setFont("times", "bold");
  pdf.text(25, 35, "Date of issue");
  pdf.setFont("times", "normal");
  pdf.text(
    55,
    35,
    `${new Date(order.orderDate).toLocaleString("en-IN", options)}`
  );

  // Add a line separator
  pdf.line(0, 40, 210, 40);

  const addressObject = order.shippingAddress;
  const addressString = `${addressObject.street}, ${addressObject.city}, ${addressObject.state} ${addressObject.zipcode}`;

  pdf.setFont("times", "bold");
  pdf.text(25, 48, "Billed to");
  pdf.setFont("times", "normal");
  pdf.text(25, 54, `${order.customer.name}`);
  pdf.text(25, 58, `${addressString}`);
  pdf.text(25, 66, `${order.customer.email}`);
  pdf.text(25, 71, `${order.customer.address.phone}`);

  // Add a line separator
  pdf.line(0, 75, 210, 75);

  pdf.setFont("times", "bold");
  pdf.text(25, 80, "Item");
  pdf.text(105, 80, "Qutanity");
  pdf.text(145, 80, "Rate");
  pdf.text(175, 80, "Amount");
  pdf.setFont("times", "normal");

  pdf.line(0, 85, 210, 85);

  // Add product details
  pdf.setFontSize(11);
  let startY = 95;
  order?.jerseys.forEach((item, index) => {
    const yPos = startY + index * 10;
    const productNameLines = pdf.splitTextToSize(item.jersey.name, 80);

    // Display the wrapped text
    productNameLines.forEach((line, lineIndex) => {
      pdf.text(25, yPos + lineIndex * 6, line);
    });
    // pdf.text(25, yPos, `${item.product.name}`);
    pdf.text(110, yPos, `${item.quantity}`);
    pdf.text(145, yPos, `${item.price}.00`);
    pdf.text(175, yPos, `${item.price * item.quantity}.00`);
  });

  // Add a line separator
  pdf.line(
    0,
    startY + order.jerseys.length * 10 + 10,
    210,
    startY + order.jerseys.length * 10 + 10
  );

  // Sub Total amount
  pdf.text(120, startY + order.jerseys.length * 10 + 20, "Sub Total:");
  pdf.text(
    160,
    startY + order.jerseys.length * 10 + 20,
    `$${
      order.jerseys?.reduce(
        (total, cartItem) =>
          total +
          calculateTotalPrice(cartItem.quantity, cartItem.jersey.price),
        0
      ) - Discount
    }.00`
  );

  // Discount amount
  pdf.text(120, startY + order.jerseys.length * 10 + 25, "Discount:");
  pdf.text(160, startY + order.jerseys.length * 10 + 25, `$${Discount}.00`);

  // Tax amount
  pdf.text(120, startY + order.jerseys.length * 10 + 30, "Tax:");
  pdf.text(160, startY + order.jerseys.length * 10 + 30, `$${Tax}.00`);

  // total amount
  pdf.setFont("times", "bold");
  pdf.setFontSize(20);
  pdf.text(120, startY + order.jerseys.length * 10 + 40, "Total:");
  pdf.text(
    160,
    startY + order.jerseys.length * 10 + 40,
    `$${
      order.jerseys?.reduce(
        (total, cartItem) =>
          total +
          calculateTotalPrice(cartItem.quantity, cartItem.jersey.price),
        0
      ) - Discount
    }.00`
  );
  pdf.setFont("times", "normal");

  // Add footer and other details if needed
  // Add a line separator
  pdf.line(0, 250, 210, 250);

  // Footer Section
  pdf.setFontSize(10);
  pdf.setTextColor(100);

  // Column 1
  pdf.text(25, 260, "Thank you for shopping with us!");
  pdf.text(25, 265, "For any inquiries, please contact:");
  pdf.text(25, 270, "Email: support@example.com");

  // Column 2
  pdf.text(110, 260, "Contact Details:");
  pdf.text(110, 265, "Phone: +123 456 7890");

  // Business Address
  pdf.text(25, 280, "Our Business Address:");
  pdf.text(25, 285, "123 Street, Cityville, Country");

  // Save the PDF with a specific filename
  const fileName = `${order.orderNumber}.pdf`;
  pdf.save(fileName);
//   return pdf;
};
