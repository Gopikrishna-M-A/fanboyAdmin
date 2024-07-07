import React, { useState } from "react";
import {Button} from '../ui/button';

const ProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const truncatedDescription = product.description.length > 30
    ? `${product.description.slice(0, 60)}...`
    : product.description;

  const uppdateWishlist =  () => {
    setIsWishlisted(!isWishlisted);
  }

console.log("product.images[0]",product.images[0]);


  return (
    <div className="w-80 border rounded-md p-2.5 relative flex-col gap-1">
      <div className="w-full flex justify-center items-center ">
        <img
          className="w-3/6"
          src={`${product.images[0]}`}
          alt=""
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loop in case fallback image also fails
            e.target.src = '/images/Products/placeholder.png'; // Path to your fallback image
          }}
        />
      </div>
      <div className="flex flex-col items-start">
        <div className="text-md font-bold">{product.name}</div>
        <div className="text-nowrap text-sm text-muted-foreground uppercase" >{product?.category}</div>
      </div>
      <div className="flex gap-1 ">
        <div className=" text-muted-foreground text-sm">{truncatedDescription}</div>
      </div>
 
      <div className="flex gap-2 items-center ">
        <div className="font-bold text-sm">₹{product.price.toFixed(2)}</div>
        <div className="text-sm text-muted-foreground line-through" >
          ₹{(product.mrp).toFixed(2)}
        </div>
        <div className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
        {Math.round(((product.mrp - product.price) / product.mrp) * 100)}%
        OFF
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
