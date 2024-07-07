import { Separator } from "../ui/separator"


const PriceDetails = ({ jerseys, order }) => {


    const calculateTotalPrice = (quantity, price) => quantity * price;

    const priceDetails = jerseys?.map((cartItem) => (
        <div key={cartItem?.jersey?._id} className="flex justify-between text-sm text-muted-foreground">
          <p style={{width:"70%"}} type="secondary" >{`${cartItem?.quantity} x ${cartItem?.jersey?.name}  `} <span className="uppercase text-gray-700 font-semibold">{`(${cartItem?.size})`}</span> <span className="uppercase font-semibold">{`${cartItem?.jersey?.variant}`}</span></p>
          <p>{`₹${calculateTotalPrice(cartItem?.quantity, cartItem?.price).toFixed(2)}`}</p>
        </div>
      ));
    const totalAmount = order?.total
    const couponDiscount = 0 // Assuming a fixed coupon discount for this example
    const deliveryCharges = 0; // Assuming free delivery for this example
    const cartTotal = ((totalAmount + deliveryCharges) - couponDiscount ).toFixed(2);

    const addressObject = order?.shippingAddress
    const addressString = `${addressObject?.street}, ${addressObject?.city}, ${addressObject?.state} ${addressObject.zipcode}`;



  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <p className="text-sm">{`${jerseys?.length} items`}</p>
        {priceDetails}
        <div className="flex justify-between">
          <p className="text-sm text-muted-foreground">Discount</p>
          <p className="text-sm">{`-₹${couponDiscount}`}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-sm text-muted-foreground">Delivery Charges</p>
          <p className="text-sm">{deliveryCharges === 0 ? 'Free Delivery' : `₹${deliveryCharges}`}</p>
        </div>
        <Separator style={{ margin: 5 }} />
        <div className="flex justify-between">
          <div className="font-bold">Total Amount</div>
          <div className="font-bold">{`₹${(totalAmount - couponDiscount).toFixed(2)}`}</div>
        </div>
      </div>

      <div className="bg-gray-100 rounded-md p-2 text-sm">
        <div className="flex flex-col text-muted-foreground">
        <div className="font-bold">{order.customer.name}</div>
        <div>{addressString}</div>
        <div>{order.customer.email}</div>
        <div>{order.customer.phone}</div>
        </div>
      </div>
    </div>
  )
}

export default PriceDetails
