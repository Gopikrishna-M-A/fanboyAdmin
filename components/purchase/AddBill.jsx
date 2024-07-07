"use client";

import React, { useEffect, useState } from "react";
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../ui/dialog";
import { Separator } from "../ui/separator";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import Link from "next/link";
import axios from "axios";
import { set } from "date-fns";
import ProductCard from "../inventory/ProductCard";

import { DatePickerWithPresets } from "../ui/datepicker";

function generateRandomSixDigitNumber() {
  const min = 100000; // Minimum value for a 6-digit number
  const max = 999999; // Maximum value for a 6-digit number
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function DataTableDemo() {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  const [products, setProducts] = useState([]);

  const [vendor, setVendor] = useState("");

  const [billNumber, setBillNumber] = useState(null);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [billDate, setBillDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");

  const [discount, setDiscount] = useState(0);
  const [tds, setTds] = useState(0);
  const [adjustment, setAdjustment] = useState(0);

  const [vendors, setVendors] = useState([]);

  const [entries, setEntries] = useState([
    { product: "", quantity: "", rate: "", amount: "" },
  ]);

  useEffect(() => {
    // Generate random number only on the client side
    setBillNumber(generateRandomSixDigitNumber());
  }, []);

  const handleAddEntry = () => {
    setEntries([
      ...entries,
      { product: "", quantity: "", rate: "", amount: "" },
    ]);
  };

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const newEntries = [...entries];
    newEntries[index][name] = value;
    setEntries(newEntries);
    console.log("newEntries", newEntries);

    const rate = parseFloat(newEntries[index].rate || 0);
    const quantity = parseFloat(newEntries[index].quantity || 0);
    newEntries[index].amount = (rate * quantity).toFixed(2);
  };

  const handleSelectChange = (index, value, name) => {
    const newEntries = [...entries];
    newEntries[index][name] = value;
    setEntries(newEntries);

    const selectedProduct = products.find(product => product._id === value);
    if (selectedProduct) {
      newEntries[index]['MRP'] = selectedProduct.MRP || '';
      newEntries[index]['rate'] = selectedProduct.costPrice || '';
    }
  };

  const handleRemoveEntry = (index) => {
    const newEntries = [...entries];
    newEntries.splice(index, 1);
    setEntries(newEntries);
  };

  useEffect(() => {
    // axios.get(`${baseURL}/api/vendor`).then((res) => {
    //   setData(res.data)
    // })

    axios.get(`${baseURL}/api/vendor`).then((res) => {
      setVendors(res.data);
      console.log("res", res.data);
    });

    axios.get(`${baseURL}/api/products`).then((res) => {
      setProducts(res.data);
      console.log("res", res.data);
    });
  }, []);

  const addNewItem = async () => {

    const subTotal = calculateSubTotal()
    const total = calculateTotal()


    const requestBody = {
      entries,
      vendor,
      billNumber,
      invoiceNumber,
      billDate,
      dueDate,
      paymentTerms,
      balance:parseFloat(total),
      tds: parseFloat(tds),
      adjustment: parseFloat(adjustment),
      discount: parseFloat(discount),
      subTotal: parseFloat(subTotal),
      total: parseFloat(total)
    };
    console.log("requestBody", requestBody);
    axios
      .post(`${baseURL}/api/purchase`, requestBody)
      .then((res) => {
        console.log(res.data);
        // setData([...data, res.data]);
      })
      .catch((error) => {
        console.error("Error adding product:", error);
      });
  };

  const calculateSubTotal = () => {
    let subTotal = 0;
    entries.forEach((entry) => {
      subTotal += parseFloat(entry.amount || 0);
    });
    return subTotal.toFixed(2);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubTotal(); // Calculate subtotal function
    const discountPercentage = parseFloat(discount); // Parse discount to float
    const adjustmentValue = parseFloat(adjustment); // Parse adjustment to float
    const tdsValue = parseFloat(tds); // Parse TDS to float

    // Calculate the total
    const discountAmount = (subtotal * discountPercentage) / 100;
    const total = subtotal - discountAmount + adjustmentValue - tdsValue;

    return total.toFixed(2); // Format total to two decimal places
  };

  return (
    <Card className="col-span-7">
      <CardHeader>
        <CardTitle className="flex justify-between">
          #{billNumber}
          <Button onClick={handleAddEntry}>Add Product</Button>
        </CardTitle>
        <CardDescription>
          {/* Total {data.length} {data.length === 1 ? "bill" : "bills"} */}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <div className="flex flex-col gap-2">
            <div className="w-full flex gap-10">
              <div className="text-muted-foreground w-40">Vendor Name</div>
              <div className="w-full">
                <Select
                  onValueChange={(e) => {
                    setVendor(e);
                  }}
                >
                  <SelectTrigger className="w-3/4">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {vendors.map((vendor) => (
                      <SelectItem value={vendor._id}>
                        {vendor.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="w-full flex gap-10">
              <div className="text-muted-foreground w-40">Bill#</div>
              <div className="w-full">
                <Input
                  className="w-3/4"
                  value={billNumber}
                  disabled={true}
                  // onChange={(e) => setBillNumber(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full flex gap-10">
              <div className="text-muted-foreground w-40">Invoice Number</div>
              <div className="w-full">
                <Input
                  className="w-3/4"
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full flex gap-10 ">
              <div className="text-muted-foreground w-40">Bill Date</div>
              <div className="w-full">
                <DatePickerWithPresets
                  setDateChange={setBillDate}
                  // onChange={(e) => setBillDate(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full flex gap-10 items-center justify-center">
              <div className="text-muted-foreground w-40">Due Date</div>
              <div className="w-full">
                <DatePickerWithPresets
                  setDateChange={setDueDate}
                  // onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>

            {/* <div className="w-full flex gap-10">
              <div className="text-muted-foreground w-40">Due Date</div>
              <div className="w-full">
                <Input
                  className="w-3/4"
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div> */}

            <div className="w-full flex gap-10">
              <div className="text-muted-foreground w-40">Payment Terms</div>
              <div className="w-full">
                <Select
                  onValueChange={(e) => {
                    setPaymentTerms(e);
                  }}
                >
                  <SelectTrigger className="w-3/4">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="net-15">Net 15</SelectItem>
                    <SelectItem value="net-30">Net 30</SelectItem>
                    <SelectItem value="net-45">Net 45</SelectItem>
                    <SelectItem value="net-60">Net 60</SelectItem>
                    <SelectItem value="month-end">
                      Due end of the month
                    </SelectItem>
                    <SelectItem value="next-month-end">
                      Due end of next month
                    </SelectItem>
                    <SelectItem value="receipt">Due on receipt</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex gap-1 items-center justify-between py-4"></div>
          <div className="">
            <div className="">
              {entries.map((entry, index) => (
                <div key={index} className="border rounded-md p-2 flex gap-2">
                  <Select
                    value={entry.product}
                    name="product"
                    onValueChange={(value) =>
                      handleSelectChange(index, value, "product")
                    }
                    className="w-3/4"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product._id} value={product._id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    name="quantity"
                    value={entry.quantity}
                    onChange={(e) => handleInputChange(index, e)}
                    placeholder="Quantity"
                    type="number"
                    className="w-3/4"
                  />

                  <Input
                    name="rate"
                    value={entry.rate}
                    onChange={(e) => handleInputChange(index, e)}
                    placeholder="Rate"
                    type="number"
                    className="w-3/4"
                  />

                  <Input
                    name="mrp"
                    value={entry.MRP}
                    onChange={(e) => handleInputChange(index, e)}
                    placeholder="MRP"
                    type="number"
                    className="w-3/4"
                  />

                  <Input
                    name="amount"
                    value={entry.amount}
                    placeholder="Amount"
                    type="number"
                    className="w-3/4"
                    disabled
                  />

                  <Button
                    onClick={() => handleRemoveEntry(index)}
                    variant="ghost"
                    className="text-red-600"
                  >
                    X
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full mt-10 flex justify-end">
            <div className="flex flex-col gap-5 bg-gray-200 rounded-md w-1/2 p-5">
              <div className="flex justify-between items-center">
                <p className=" text-muted-foreground">Sub Total</p>
                <p>{calculateSubTotal()}</p>
              </div>
              <div className="flex justify-between items-center w-full">
                <p className="flex-1 text-muted-foreground">Discount</p>
                <Input
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="flex-1 w-40"
                  type="number"
                  suffix="%"
                ></Input>
                <p className="flex-1 text-right">
                  {" "}
                  {(
                    calculateSubTotal() *
                    (parseFloat(discount || 0) / 100)
                  ).toFixed(2)}
                </p>
              </div>
              <div className="flex justify-between items-center w-full">
                <p className="flex-1 text-muted-foreground">TDS</p>
                <Input
                  value={tds}
                  onChange={(e) => setTds(e.target.value)}
                  className="flex-1 w-40"
                  type="number"
                ></Input>
                <p className="flex-1 text-right">
                  {parseFloat(tds).toFixed(2)}
                </p>
              </div>
              <div className="flex justify-between items-center w-full">
                <p className="flex-1 text-muted-foreground">Adjustment</p>
                <Input
                  value={adjustment}
                  onChange={(e) => setAdjustment(e.target.value)}
                  className="flex-1 w-40"
                  type="number"
                ></Input>
                <p className="flex-1 text-right">
                  {parseFloat(adjustment).toFixed(2)}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className="font-bold">Total</p>
                <p className="font-bold">{calculateTotal()}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground"></div>
            <div className="space-x-2">
              <Button onClick={addNewItem}>Save</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// const [discount,setDiscount] = useState(0)
// const [tds,setTds] = useState(0)
// const [adjustment,setAdjustment] = useState(0)
