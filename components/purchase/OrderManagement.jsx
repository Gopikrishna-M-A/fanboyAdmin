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

export default function DataTableDemo() {

  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});


  const [firstName,setFirstName] = useState('')
  const [lastName,setLastName] = useState('')
  const [companyName,setCompanyName] = useState('')
  const [displayName,setDisplayName] = useState('')
  const [email,setEmail] = useState('')
  const [phone,setPhone] = useState('')
  const [MSME,setMSME] = useState(true)
  const [PAN,setPAN] = useState('')
  const [registrationType,setRegistrationType] = useState('')
  const [registrationNumber,setRegistrationNumber] = useState('')
  const [currency,setCurrency] = useState('')
  const [paymentTerms,setPaymentTerms] = useState('')
  const [website,setWebsite] = useState('')
  const [department,setDepartment] = useState('')


  const [shippingAttention,setShippingAttention] = useState('')
  const [shippingCountry,setShippingCountry] = useState('')
  const [shippingCity,setShippingCity] = useState('')
  const [shippingState,setShippingState] = useState('')
  const [shippingAddress,setShippingAddress] = useState('')
  const [shippingZipCode,setShippingZipCode] = useState('')
  const [shippingPhone,setShippingPhone] = useState('')

  const [billingAttention,setBillingAttention] = useState('')
  const [billingCountry,setBillingCountry] = useState('')
  const [billingCity,setBillingCity] = useState('')
  const [billingState,setBillingState] = useState('')
  const [billingAddress,setBillingAddress] = useState('')
  const [billingZipCode,setBillingZipCode] = useState('')
  const [billingPhone,setBillingPhone] = useState('')



  const [vendors,setVendors] = useState([])

  
  const copyBilling = () => {
    setShippingAttention(billingAttention)
    setShippingCountry(billingCountry)
    setShippingCity(billingCity)
    setShippingState(billingState)
    setShippingAddress(billingAddress)
    setShippingZipCode(billingZipCode)
    setShippingPhone(billingPhone)
  }

function formatDate(dateString) {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return formattedDate;
}
  



  useEffect(() => {
    axios.get(`${baseURL}/api/purchase`).then((res) => {
      setData(res.data)
      console.log("data",data);
    })

    // axios.get(`${baseURL}/api/vendor`).then((res) => {
    //   setVendors(res.data)
    //   console.log("res",res.data);
    // })
  }, []);



  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "billDate",
      header: ({ column }) => {
        return (
          <Button
          className='p-0'
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            BILL Date
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        // <HoverCard>
        //   <HoverCardTrigger className="lowercase cursor-pointer">
        //     {row.getValue("name")}
        //   </HoverCardTrigger>
        //   <HoverCardContent>
        //     The React Framework – created and maintained by @vercel.
        //   </HoverCardContent>
        // </HoverCard>
        <div>{formatDate(row.getValue("billDate"))}</div>
        // <Dialog className="w-fit">
        //   <DialogTrigger>{row.getValue("displayName")}</DialogTrigger>
        //   <DialogContent className="flex justify-center items-center w-fit p-10">
        //     <ProductCard product={row.original} />
        //   </DialogContent>
        // </Dialog>
      ),
    },
    {
      accessorKey: "dueDate",
      header: ({ column }) => {
        return (
          <Button
          className='p-0'
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            DUE Date
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div>{formatDate(row.getValue("dueDate"))}</div>
      ),
    },
    {
      accessorKey: "billNumber",
      header: '# BILL',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("billNumber")}</div>
      ),
    },
    {
      accessorKey: "vendor",
      header: "VENDOR NAME",
      cell: ({ row }) => {
        const vendor = row.getValue("vendor");
        return <div className="capitalize">{vendor.displayName}</div>;
      },
    },
    {
      accessorKey: "status",
      header: "STATUS",
      cell: ({ row }) => {
        return (
          <div className="uppercase">
           {row.getValue("status")}
          </div>
        );
      },
    },
    {
      accessorKey: "paymentTerms",
      header: () => <div >PAYMENT TERMS</div>,
      cell: ({ row }) => {

        return <div className="uppercase">{row.getValue("paymentTerms")}</div>;
      },
    },
    {
      accessorKey: "total",
      header: () => <div>TOTAL</div>,
      cell: ({ row }) => {
        const total = parseFloat(row.getValue("total"));

        // Format the amount as a dollar amount
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "INR",
        }).format(total);

        return <div >{formatted}</div>;
      },
    },
    {
        accessorKey: "balance",
        header: () => <div>BALANCE DUE</div>,
        cell: ({ row }) => {
          const balance = parseFloat(row.getValue("balance"));
  
          // Format the amount as a dollar amount
          const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "INR",
          }).format(balance);
  
          return <div >{formatted}</div>;
        },
      },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const purchase = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(purchase._id)}
              >
                Copy Purchase ID
              </DropdownMenuItem>
              <DropdownMenuItem>
                {/* <Link href={`/inventory/${purchase._id}`}>Edit Vendor</Link> */}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
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

  const deleteProduct = async () => {
    try {
      const selectedRows = table.getFilteredSelectedRowModel().rows;
      const selectedIds = selectedRows.map((row) => row.original._id);
      const selectedIndexs = selectedRows.map((row) => row.index);

      await Promise.all(
        selectedIds.map(async (id) => {
          await axios.delete(`${baseURL}/api/purchase/${id}`);
        })
      );

      setData(data.filter((vendor) => !selectedIds.includes(vendor._id)));

      setRowSelection({});
    } catch (error) {
      console.error("Error deleting categories:", error);
    }
  };

  const addNewItem = async() => {

    const requestBody = {
      primaryContact: {
        firstName,
        lastName
      },
      companyName,
      displayName,
      email,
      phone,
      PAN,
      MSME,
      registrationType,
      registrationNumber,
      currency,
      paymentTerms,
      website,
      department,
      billingAddress: {
        Attention: billingAttention,
        country: billingCountry,
        Address: billingAddress,
        city: billingCity,
        state: billingState,
        zipCode: billingZipCode,
        Phone: billingPhone,
      },
      shippingAddress: {
        Attention: shippingAttention,
        country: shippingCountry,
        Address: shippingAddress,
        city: shippingCity,
        state: shippingState,
        zipCode: shippingZipCode,
        Phone: shippingPhone,
      },
    };

    axios
      .post(`${baseURL}/api/vendor`, requestBody)
      .then((res) => {
        console.log(res.data);
        setData([...data, res.data]);
      })
      .catch((error) => {
        console.error("Error adding product:", error);
      });
  };



  return (
    <Card className="col-span-7">
      <CardHeader>
        <CardTitle className="flex justify-between">
        Bills
        <Button><Link href='/purchases/addBill'>Add New Bill</Link></Button>

        </CardTitle>
        <CardDescription>
          Total {data.length} {data.length === 1 ? "bill" : "bills"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <div className="flex gap-1 items-center justify-between py-4">
            <Input
              placeholder="Filter name..."
              value={table.getColumn("vendor")?.getFilterValue() ?? ""}
              onChange={(event) =>
                table.getColumn("vendor")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            <div className="flex gap-2">
              <Button
                onClick={deleteProduct}
                disabled={!Object.keys(rowSelection).length}
                variant="destructive"
              >
                Delete
              </Button>

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
                {table.getRowModel().rows?.length ? (
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
