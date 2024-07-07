"use client";

import React, { useEffect, useState } from "react";
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import { isSameDay, format, parseISO } from "date-fns";
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
import { cn } from "../../lib/utils";
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
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
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
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import Link from "next/link";
import axios from "axios";
import { Calendar as CalendarIcon } from "lucide-react";
import OrderDetails from "./OrderDetails";
import { viewInvoice, downloadInvoice } from "./invoice";
import InvoiceView from "./InvoiceView";

function formatDate(inputDateTime) {
  const dateTimeObject = parseISO(inputDateTime);
  const formattedDate = format(dateTimeObject, "MMM d");
  const formattedTime = format(dateTimeObject, "h:mm a");

  return {
    date: formattedDate,
    time: formattedTime,
  };
}

export default function DataTableDemo() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [date, setDate] = useState(null);
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    axios.get(`/api/orders`).then((res) => {
      setData(res.data);
      setFilteredData(res.data);
    });
  }, []);

  useEffect(() => {
    axios.get(`/api/orders`).then((res) => {
      const filteredOrders = date
        ? res.data.filter((order) => {
            const orderDate = new Date(order.orderDate);
            return isSameDay(orderDate, date);
          })
        : res.data;
      setFilteredData(filteredOrders);
    });
  }, [date]);

  const handleSearch = (query) => {
    console.log("query", query);
    const filtered = data.filter((order) =>
    order.orderNumber.toLowerCase().includes(query.toLowerCase())
    );
    console.log("filtered", filtered);
    setFilteredData(filtered);
  };

  const columns = [
    // {
    //   id: "select",
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={
    //         table.getIsAllPageRowsSelected() ||
    //         (table.getIsSomePageRowsSelected() && "indeterminate")
    //       }
    //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //       aria-label="Select all"
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onCheckedChange={(value) => row.toggleSelected(!!value)}
    //       aria-label="Select row"
    //     />
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      accessorKey: "OrderId",
      header: "Order Number",
      cell: ({ row }) => {
        const order = row.original;

        return (
          <div className="lowercase flex gap-1 ">
            <div
              onClick={() => navigator.clipboard.writeText(order.orderNumber)}
              className=" cursor-pointer"
            >
              <svg
                className="text-gray-600 hover:text-black"
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 9.50006C1 10.3285 1.67157 11.0001 2.5 11.0001H4L4 10.0001H2.5C2.22386 10.0001 2 9.7762 2 9.50006L2 2.50006C2 2.22392 2.22386 2.00006 2.5 2.00006L9.5 2.00006C9.77614 2.00006 10 2.22392 10 2.50006V4.00002H5.5C4.67158 4.00002 4 4.67159 4 5.50002V12.5C4 13.3284 4.67158 14 5.5 14H12.5C13.3284 14 14 13.3284 14 12.5V5.50002C14 4.67159 13.3284 4.00002 12.5 4.00002H11V2.50006C11 1.67163 10.3284 1.00006 9.5 1.00006H2.5C1.67157 1.00006 1 1.67163 1 2.50006V9.50006ZM5 5.50002C5 5.22388 5.22386 5.00002 5.5 5.00002H12.5C12.7761 5.00002 13 5.22388 13 5.50002V12.5C13 12.7762 12.7761 13 12.5 13H5.5C5.22386 13 5 12.7762 5 12.5V5.50002Z"
                  fill="currentColor"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
            <Link href={`/sales/order/${order._id}`}>{order.orderNumber} </Link>
          </div>
        );
      },
    },
    {
      accessorKey: "orderDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() == "asc")}
          >
            Date / Time
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const { date, time } = formatDate(row.getValue("orderDate"));
        return (
          <div className="flex gap-1 w-fit items-center">
            <div className="ml-4">
              {date}, {time}
            </div>
            {/* <div className="">{date}</div> */}
          </div>
        );
      },
    },

    {
      accessorKey: "method",
      header: "Method",
      cell: ({ row }) => {
        return <div className=" capitalize">{row.getValue("method")}</div>;
      },
    },
    // {
    //   accessorKey: "payment",
    //   header: "Payment Status",
    //   cell: ({ row }) => {
    //     const paymentStatus = row.getValue("payment");
    //     return (
    //       <div
    //         className={` capitalize text-xs w-fit  px-2 py-1 rounded border ${
    //           paymentStatus === "captured" || paymentStatus === "Paid"
    //             ? "bg-green-100 text-green-600 border-green-600"
    //             : "bg-red-100 text-red-600 border-red-600"
    //         }`}
    //       >
    //         {paymentStatus === "captured" || paymentStatus === "Paid" ? "Paid" : "unpaid"}
    //       </div>
    //     );
    //   },
    // },

    {
      accessorKey: "orderStatus",
      header: "Order Status",
      cell: ({ row }) => {
        const status = row.getValue("orderStatus");
        const length = status.length;

        return <div className="">{status[length - 1].status}</div>;
      },
    },
    // {
    //   accessorKey: "customer",
    //   header: "Customer",
    //   cell: ({ row }) => {
    //     const customer = row.getValue("customer");

    //     return <div className="">{customer?.name}</div>;
    //   },
    // },

    {
      accessorKey: "total",
      header: "Amount",
      cell: ({ row }) => {
        const price = row.getValue("total");
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "INR",
        }).format(price);
        return <div className="font-mono">{formatted}</div>;
      },
    },
    {
      accessorKey: "products",
      header: "",
      cell: ({ row }) => {
        return (
          <Dialog>
            <DialogTrigger asChild>
              <div className="text-sky-500 cursor-pointer hover:text-sky-600">View</div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Order Details</DialogTitle>
                <DialogDescription>
                  {/* Enter the details below to add a new Item. */}
                </DialogDescription>
              </DialogHeader>
              <OrderDetails
                order={row.original}
                jerseys={row.original.jerseys}
              />
              <DialogFooter className="sm:justify-start"></DialogFooter>
            </DialogContent>
          </Dialog>
        );
      },
    },
    // {
    //   accessorKey: "shippingAddress",
    //   header: () => <div className="text-right">Address</div>,
    //   cell: ({ row }) => {
    //     const addressObject = row.getValue("shippingAddress");
    //     const addressString = `${addressObject.street}, ${addressObject.city}, ${addressObject.state} ${addressObject.zipCode}, ${addressObject.country}`;
    //     const truncatedAddress =
    //       addressString.length > 20
    //         ? `${addressString.substring(0, 20)}...`
    //         : addressString;
    //     return <div className="text-right">{truncatedAddress}</div>;
    //   },
    // },

    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const order = row.original;
        const pdf = viewInvoice(row.original);
        return (
          <Dialog>
            <DialogTrigger>
            <div className="text-sky-500 cursor-pointer hover:text-sky-600">Invoice</div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex justify-between pr-4 items-center">
                  Invoice
                  <Button onClick={() => downloadInvoice(row.original)}>Download</Button>
                </DialogTitle>
              </DialogHeader>
              <InvoiceView
                pdf={pdf}
              />
            </DialogContent>
          </Dialog>
        );
      },
    },
  ];

  const table = useReactTable({
    data:filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <Card className="col-span-7">
      <CardHeader>
        <CardTitle className="flex justify-between">
          Orders
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </CardTitle>
        <CardDescription>
          Total {data.length} {data.length === 1 ? "Order" : "Orders"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <div className="flex gap-1 items-center justify-between py-4">
            <Input
              placeholder="Filter order..."
              // value={table.getColumn("OrderId")?.getFilterValue() ?? ""}
              // onChange={(event) =>
              //   table.getColumn("OrderId")?.setFilterValue(event.target.value)
              // }
              onChange={(e) => handleSearch(e.target.value)}
              className="max-w-sm"
            />
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table?.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
