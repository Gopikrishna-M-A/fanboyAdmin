import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Bill = ({ order }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Item</TableHead>
              <TableHead>Variant</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order?.jerseys?.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{row?.jersey?.name}</TableCell>
                <TableCell className='uppercase'>{row?.jersey?.variant}</TableCell>
                <TableCell className='font-semibold'>{row?.size}</TableCell>
                <TableCell>{row?.quantity}</TableCell>
                <TableCell className="text-right font-semibold">
                  ₹{(row.price * row.quantity).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <Separator className="my-4" />
      <CardFooter className="flex justify-between items-center">
        <div className="text-lg font-semibold">Total</div>
        <div className="text-2xl font-bold">₹{order?.total}</div>
      </CardFooter>
    </Card>
  );
};

export default Bill;