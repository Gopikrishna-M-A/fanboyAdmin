import Order from './models/Order';



// export async function getAllOrders() {
//   try {
//     const orders = await Order.find()
//       .populate('customer')
//       .populate('jerseys.jersey')
//       .sort({ orderDate: -1 });
//     return orders;
//   } catch (error) {
//     console.error('Error getting all orders:', error);
//     throw new Error('An error occurred');
//   }
// }



export async function statusUpdate(orderId, newStatus) {
  const orderDescMapping = {
    "Processing": "Your order is confirmed and in processing. Thank you for your patience.",
    "Packed": "All items are packed and ready for dispatch. Your order is prepared with care.",
    "Shipped": "Your package is on its way! It has been dispatched from our store.",
    "Delivered": "Package successfully delivered to your address. Enjoy your purchase!",
    "Completed": "Congratulations! Your order is successfully completed. Thank you for choosing us!",
    "Cancelled": "Regrettably, your order has been cancelled. Contact support for assistance.",
    "Refunded": "Good news! Your order has been refunded. Expect the amount in your account soon.",
  };

  try {
    // Find the order by ID
    const order = await Order.findById(orderId).populate('jerseys.jersey').populate('customer');

    // Check if the order exists
    if (!order) {
      throw new Error('Order not found');
    }

    // Add the new status to the orderStatus array
    order.orderStatus.push({
      status: newStatus,
      timestamp: new Date(),
      desc: orderDescMapping[newStatus]
    });

    // Save the updated order
    await order.save();

    return order;
  } catch (error) {
    console.error('Error updating status:', error);
    throw new Error('Internal server error');
  }
}

export async function statusRemove(orderId) {
  try {
    // Find the order by ID
    const order = await Order.findById(orderId).populate('jerseys.jersey').populate('customer');

    // Check if the order exists
    if (!order) {
      throw new Error('Order not found');
    }

    // Remove the last status from the orderStatus array
    order.orderStatus.pop();

    // Save the updated order
    await order.save();

    return order;
  } catch (error) {
    console.error('Error removing status:', error);
    throw new Error('Internal server error');
  }
}

export async function createOrder({ amount }) {
  console.log("amount",amount);
  try {
    const order = await razorpayClient.orders.create({
      amount: amount * 100, 
      currency: 'INR',
    });
    console.log("order serv",order);
    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Bad request');
  }
}

export async function getOrderDetails(orderId){
  try {
    const order = await Order.findById(orderId).populate('jerseys.jersey').populate('customer');

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  } catch (error) {
    console.error('Error getting order details:', error);
    throw new Error('An error occurred');
  }
}

export async function getOrderHistory(userId){
  console.log("userid in services history", userId);
  try {
    const orderHistory = await Order.find({ customer: userId })
      .populate('jerseys.jersey')
      .sort({ orderDate: -1 });
      console.log("orderHistory",orderHistory);
    return orderHistory;
  } catch (error) {
    console.error('Error getting order history:', error);
    throw new Error('An error occurred while fetching order history');
  }
}

export async function getAllOrders() {
  try {
    const orders = await Order.find()
      .populate('jerseys.jersey')
      .populate('customer')
      .sort({ orderDate: -1 });
    return orders;
  } catch (error) {
    console.error('Error getting order history:', error);
    throw new Error('An error occurred while fetching order history');
  }
}