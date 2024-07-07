import { jsPDF } from "jspdf";
import "jspdf-autotable";

function generateCustomerTable(data) {
  let tableData = [];

  // Group orders by customer
  const customerOrders = {};
  data.forEach((order) => {
    const customerId = order.customer._id.toString();
    if (!customerOrders[customerId]) {
      customerOrders[customerId] = [];
    }
    customerOrders[customerId].push(order);
  });

  // Process each customer
  for (const [customerId, orders] of Object.entries(customerOrders)) {
    let customerInfo = {};
    let totalSpend = 0;
    let totalJerseysPurchased = 0;
    let jerseysCount = {};
    let favouriteJersey = null;
    let favouriteTeam = null;
    let preferredPaymentType = null;
    let preferredDeliveryType = null;

    orders.forEach((order) => {
      totalSpend += order.total;

      order.jerseys.forEach((jersey) => {
        totalJerseysPurchased += jersey.quantity;
        jerseysCount[jersey.jersey.name] = (jerseysCount[jersey.jersey.name] || 0) + jersey.quantity;
        if (!favouriteJersey || jerseysCount[jersey.jersey.name] > jerseysCount[favouriteJersey]) {
          favouriteJersey = jersey.jersey.name;
          favouriteTeam = jersey.jersey.team.name;
        }
      });

      preferredPaymentType = order.method;
      preferredDeliveryType = order.DeliverType;
    });

    const customer = orders[0].customer;
    customerInfo["Name"] = customer.name;
    customerInfo["Email"] = customer.email;
    customerInfo["Phone"] = customer.address?.phone || 'N/A';
    customerInfo["Location"] = customer.address ? `${customer.address.city}, ${customer.address.state}` : 'N/A';
    customerInfo["Total Spend"] = totalSpend.toFixed(2);
    customerInfo["Total Jerseys Purchased"] = totalJerseysPurchased;
    customerInfo["Favourite Jersey"] = favouriteJersey;
    customerInfo["Favourite Team"] = favouriteTeam;
    customerInfo["Preferred Payment Type"] = preferredPaymentType;
    customerInfo["Preferred Delivery Type"] = preferredDeliveryType;

    tableData.push(customerInfo);
  }

  return tableData;
}

function getProductInsights(data) {
  const productInsightsMap = new Map();

  data.forEach(order => {
    order.jerseys.forEach(jersey => {
      const jerseyId = jersey.jersey._id.toString();
      const jerseyName = jersey.jersey.name;

      if (!productInsightsMap.has(jerseyId)) {
        productInsightsMap.set(jerseyId, {
          "Jersey Name": jerseyName,
          "Total Amount": 0,
          "Quantity Sold": 0,
          "Order Frequency": 0,
          "Stock Quantity": jersey.jersey.stock,
          "Total Cost": 0
        });
      }

      const productInsights = productInsightsMap.get(jerseyId);
      productInsights["Total Amount"] += jersey.price * jersey.quantity;
      productInsights["Quantity Sold"] += jersey.quantity;
      productInsights["Order Frequency"]++;
      productInsights["Total Cost"] += (jersey.jersey.costPrice || 0) * jersey.quantity;
    });
  });

  for (let [jerseyId, productInsights] of productInsightsMap) {
    const totalRevenue = productInsights["Total Amount"];
    const totalProfit = totalRevenue - productInsights["Total Cost"];
    const profitMargin = (totalProfit / totalRevenue) * 100;
    productInsights["Profit Margin"] = profitMargin.toFixed(2) + "%";
    productInsights["Order Frequency"] = (productInsights["Order Frequency"] / data.length).toFixed(2);
  }

  return Array.from(productInsightsMap.values());
}

export const generatePerformanceReport = (orders) => {
  console.log("orders", orders);
  const customerData = generateCustomerTable(orders);
  const productsData = getProductInsights(orders);

  const pdf = new jsPDF({
    orientation: "p",
    unit: "mm",
    format: "a4",
  });

  pdf.setFontSize(20);
  pdf.text("Jersey Shop Performance Report", 105, 15, { align: "center" });
  pdf.setFontSize(12);
  pdf.text("Date: " + new Date().toLocaleDateString(), 105, 25, {
    align: "center",
  });
  pdf.line(10, 30, 200, 30);

  pdf.setFontSize(16);
  pdf.text("Summary", 10, 40);
  pdf.setFontSize(12);
  pdf.text(`Total Orders: ${orders.length}`, 10, 50);
  const totalRevenue = orders.reduce((total, order) => total + order.total, 0);
  pdf.text(`Total Revenue: $${totalRevenue.toFixed(2)}`, 10, 60);
  const averageOrderValue = totalRevenue / orders.length;
  pdf.text(`Average Order Value: $${averageOrderValue.toFixed(2)}`, 10, 70);

  pdf.setFontSize(16);
  pdf.text("Order Details", 10, 90);
  pdf.autoTable({
    startY: 100,
    head: [
      [
        "Order Number",
        "Date",
        "Customer Name",
        "Total Amount",
        "Payment Status",
      ],
    ],
    body: orders.map((order) => [
      order.orderNumber,
      new Date(order.orderDate).toLocaleDateString(),
      order.customer.name,
      `$${order.total.toFixed(2)}`,
      order.payment,
    ]),
  });

  pdf.addPage();
  pdf.setFontSize(16);
  pdf.text("Customer Insights", 10, 10);
  const customerColumns = [
    { header: "Name", dataKey: "Name" },
    { header: "Email", dataKey: "Email" },
    { header: "Phone", dataKey: "Phone" },
    { header: "Spend", dataKey: "Total Spend" },
    { header: "Jerseys", dataKey: "Total Jerseys Purchased" },
    { header: "Favourite Jersey", dataKey: "Favourite Jersey" },
    { header: "Payment", dataKey: "Preferred Payment Type" },
  ];

  const customerRows = customerData.map((customer) => [
    customer.Name,
    customer.Email,
    customer.Phone,
    customer["Total Spend"],
    customer["Total Jerseys Purchased"],
    customer["Favourite Jersey"],
    customer["Preferred Payment Type"],
  ]);

  pdf.autoTable({
    startY: 15,
    head: [customerColumns.map((col) => col.header)],
    body: customerRows,
  });

  pdf.addPage();
  pdf.setFontSize(16);
  pdf.text("Jersey Insights", 10, 20);

  const productsColumns = [
    { header: "Name", dataKey: "Jersey Name" },
    { header: "Total", dataKey: "Total Amount" },
    { header: "Quantity", dataKey: "Quantity Sold" },
    { header: "Stock", dataKey: "Stock Quantity" },
    { header: "Total Cost", dataKey: "Total Cost" },
    { header: "Profit", dataKey: "Profit Margin" },
  ];

  const productsRows = productsData.map((product) => [
    product["Jersey Name"],
    product["Total Amount"].toFixed(2),
    product["Quantity Sold"],
    product["Stock Quantity"],
    product["Total Cost"].toFixed(2),
    product["Profit Margin"],
  ]);

  pdf.autoTable({
    startY: 30,
    head: [productsColumns.map((col) => col.header)],
    body: productsRows,
  });

  pdf.setFontSize(10);

  const fileName = `Fanboy_Jerseys_Performance_Report_${new Date().getTime()}.pdf`;
  pdf.save(fileName);
};