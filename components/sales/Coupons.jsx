"use client"

import React, { useEffect, useState } from "react"
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Textarea } from "../ui/textarea"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../ui/dialog"
import { Separator } from "../ui/separator"

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"

import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Input } from "../ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import Link from "next/link"
import axios from "axios"

export default function Coupons() {
  const [data, setData] = useState([])
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})
  const [jerseys, setJerseys] = useState([])
  const [users, setUsers] = useState([])

  const [code, setCode] = useState("")
  const [description, setDescription] = useState("")
  const [discountType, setDiscountType] = useState("")
  const [discountValue, setDiscountValue] = useState("")
  const [maxDiscount, setMaxDiscount] = useState("")
  const [minPurchase, setMinPurchase] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [usageLimit, setUsageLimit] = useState("")
  const [applicableProducts, setApplicableProducts] = useState([])
  const [eligibleEmails, setEligibleEmails] = useState("")

  useEffect(() => {
    axios.get(`/api/coupons`).then((res) => {
      setData(res.data)
    })
    axios.get("/api/jerseys").then((res) => {
      setJerseys(res.data)
    })
    axios.get("/api/users").then((res) => {
      setUsers(res.data)
    })
  }, [])

  function formatDate(isoDateStr) {
    const date = new Date(isoDateStr)
    const options = { day: "2-digit", month: "short", year: "numeric" }
    const formattedDate = new Intl.DateTimeFormat("en-GB", options).format(date)
    return formattedDate
  }

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
          aria-label='Select all'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "code",
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className=' capitalize'>
            code
            <CaretSortIcon className='ml-2 h-4 w-4' />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className='capitalize'>{row.getValue("code")}</div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        return <div className='capitalize'>{row.getValue("description")}</div>
      },
    },
    {
      accessorKey: "discountValue",
      header: "Discount",
      cell: ({ row }) => {
        return <div className='capitalize'>{row.getValue("discountValue")}</div>
      },
    },
    {
      accessorKey: "discountType",
      header: "Type",
      cell: ({ row }) => {
        return <div className='capitalize'>{row.getValue("discountType")}</div>
      },
    },
    {
      accessorKey: "maxDiscount",
      header: "Max",
      cell: ({ row }) => {
        return <div className='capitalize'>{row.getValue("maxDiscount")}</div>
      },
    },
    {
      accessorKey: "minPurchase",
      header: "Min",
      cell: ({ row }) => {
        return <div className='capitalize'>{row.getValue("minPurchase")}</div>
      },
    },
    {
      accessorKey: "usageLimit",
      header: "Limit",
      cell: ({ row }) => {
        return <div className='capitalize'>{row.getValue("usageLimit")}</div>
      },
    },
    {
      accessorKey: "startDate",
      header: "Start",
      cell: ({ row }) => {
        const date = formatDate(row.getValue("startDate"))
        return <div className='capitalize'>{date}</div>
      },
    },
    {
      accessorKey: "endDate",
      header: "End",
      cell: ({ row }) => {
        const date = formatDate(row.getValue("endDate"))
        return <div className='capitalize'>{date}</div>
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const coupon = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <span className='sr-only'>Open menu</span>
                <DotsHorizontalIcon className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(coupon._id)}>
                Copy coupon ID
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={`/inventory/${coupon._id}`}>Edit coupon</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

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
  })

  const deleteProduct = async () => {
    try {
      const selectedRows = table.getFilteredSelectedRowModel().rows
      const selectedIds = selectedRows.map((row) => row.original._id)
      const selectedIndexs = selectedRows.map((row) => row.index)

      await Promise.all(
        selectedIds.map(async (id) => {
          await axios.delete(`/api/coupons?id=${id}`)
        })
      )

      setData(data.filter((coupon) => !selectedIds.includes(coupon._id)))
      setRowSelection({})
    } catch (error) {
      console.error("Error deleting categories:", error)
    }
  }

  const addNewItem = async () => {
    let emails = eligibleEmails.split(",").map((email) => email.trim());
    if (emails.length === 1 && emails[0] === "") {
      emails = users.map(user => user.email);
    }
    const requestBody = {
      code,
      description,
      discountType,
      discountValue,
      maxDiscount,
      minPurchase,
      startDate,
      endDate,
      usageLimit,
      applicableProducts: jerseys.map((jersey) => jersey._id),
      eligibleEmails: emails,
    }
    console.log("requestBody", requestBody)
    axios
      .post(`/api/coupons`, requestBody)
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.error("Error adding coupon:", error)
      })
  }

  return (
    <Card className='col-span-7'>
      <CardHeader>
        <CardTitle className='flex justify-between'>
          Coupons
          <Dialog>
            <DialogTrigger asChild>
              <Button> Add New Coupon</Button>
            </DialogTrigger>
            <DialogContent className='max-w-3xl overflow-y-scroll max-h-full'>
              <DialogHeader>
                <DialogTitle>New Coupon</DialogTitle>
                <DialogDescription>
                  Enter the details below to add a new Coupon.
                </DialogDescription>
              </DialogHeader>

              <div className='grid gap-4 py-4'>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='code' className='text-right'>
                    Code
                  </Label>
                  <Input
                    id='code'
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className='col-span-3'
                  />
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='description' className='text-right'>
                    Description
                  </Label>
                  <Textarea
                    id='description'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className='col-span-3'
                  />
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='discountType' className='text-right'>
                    Discount Type
                  </Label>
                  <Select
                    value={discountType}
                    onValueChange={(value) => setDiscountType(value)}>
                    <SelectTrigger className='col-span-3'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='percentage'>Percentage</SelectItem>
                      <SelectItem value='fixed'>Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='discountValue' className='text-right'>
                    Discount Value
                  </Label>
                  <Input
                    id='discountValue'
                    type='number'
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className='col-span-3'
                  />
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='maxDiscount' className='text-right'>
                    Max Discount
                  </Label>
                  <Input
                    id='maxDiscount'
                    type='number'
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(e.target.value)}
                    className='col-span-3'
                  />
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='minPurchase' className='text-right'>
                    Min Purchase
                  </Label>
                  <Input
                    id='minPurchase'
                    type='number'
                    value={minPurchase}
                    onChange={(e) => setMinPurchase(e.target.value)}
                    className='col-span-3'
                  />
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='startDate' className='text-right'>
                    Start Date
                  </Label>
                  <Input
                    id='startDate'
                    type='date'
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className='col-span-3'
                  />
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='endDate' className='text-right'>
                    End Date
                  </Label>
                  <Input
                    id='endDate'
                    type='date'
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className='col-span-3'
                  />
                </div>

                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='usageLimit' className='text-right'>
                    Usage Limit
                  </Label>
                  <Input
                    id='usageLimit'
                    type='number'
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value)}
                    className='col-span-3'
                  />
                </div>

                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='eligibleEmails' className='text-right'>
                    Eligible Emails
                  </Label>
                  <Textarea
                    id='eligibleEmails'
                    value={eligibleEmails}
                    onChange={(e) => setEligibleEmails(e.target.value)}
                    className='col-span-3'
                    placeholder='Enter comma-separated email addresses'
                  />
                </div>
              </div>

              <DialogFooter className='sm:justify-start'>
                <DialogClose asChild>
                  <Button
                    size='lg'
                    className='w-full'
                    type='button'
                    onClick={addNewItem}>
                    Add
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardTitle>
        <CardDescription>
          Total {data.length} {data.length === 1 ? "Coupon" : "Coupons"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='w-full'>
          <div className='flex gap-1 items-center justify-between py-4'>
            <Input
              placeholder='Filter name...'
              value={table.getColumn("name")?.getFilterValue() ?? ""}
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className='max-w-sm'
            />
            <div className='flex gap-2'>
              <Button
                onClick={deleteProduct}
                disabled={!Object.keys(rowSelection).length}
                variant='destructive'>
                Delete
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline'>
                    Columns <ChevronDownIcon className='ml-2 h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className='capitalize'
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }>
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      )
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className='rounded-md border'>
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
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}>
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
                      className='h-24 text-center'>
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className='flex items-center justify-end space-x-2 py-4'>
            <div className='flex-1 text-sm text-muted-foreground'>
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className='space-x-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}>
                Previous
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}>
                Next
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
