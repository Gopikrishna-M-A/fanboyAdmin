"use client"

import React, { useEffect, useState } from "react"
import { Label } from "../ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"
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
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Upload } from "antd"
import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"
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
import { UploadOutlined } from "@ant-design/icons"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"

export default function DataTableDemo() {
  const { toast } = useToast()
  const [data, setData] = useState([])
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})

  const [catName, setCatName] = useState("")
  const [fileList, setFileList] = useState([])


  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList)


  useEffect(() => {
    axios.get(`/api/teams`).then((res) => {
      console.log(res.data)
      setData(res.data)
    })
  }, [])

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
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            Name
            <CaretSortIcon className='ml-2 h-4 w-4' />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className=''>{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "logo",
      header: "Logo",
      cell: ({ row }) => {
        const logo = row.getValue("logo")
        return <div className=''>
          <img className="rounded-full aspect-square" src={logo} width={50} height={50} alt='logo'/>
        </div>
      },
    }, 

    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const Category = row.original
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
                onClick={() => navigator.clipboard.writeText(Category._id)}>
                Copy Team ID
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={`/inventory/category/${Category._id}`}>
                  Edit Team
                </Link>
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

      console.log(selectedIds)

      await Promise.all(
        selectedIds.map(async (id) => {
          await axios.delete(`/api/teams?id=${id}`).then((res)=>{
            toast({
              title: `${res.data.name} DELETED`,
            })
          })
        })
      )

      setData(data.filter((category) => !selectedIds.includes(category._id)))
      setRowSelection({})
    } catch (error) {
      console.error("Error deleting teams:", error)
    }
  }

  const addNewCategory = async () => {
    const formData = new FormData()
    fileList.map((file) => {
      formData.append("file", file.originFileObj)
    })
    const res = await axios.post("/api/aws", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    const requestBody = {
      name: catName,
      logo: res.data[0],
    }
    console.log("requestBody", requestBody)

    axios
      .post(`/api/teams`, requestBody)
      .then((res) => {
        console.log(res.data);
        setData([...data, res.data]);
      })
      .catch((error) => {
        console.error("Error adding category:", error);
      });
  }


  return (
    <Card className='col-span-7'>
      <CardHeader>
        <CardTitle className='flex justify-between'>
          Teams
          <Dialog>
            <DialogTrigger asChild>
              <Button> Add New Team</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Team</DialogTitle>
                <DialogDescription>
                  Enter the details below to add a new Team.
                </DialogDescription>
              </DialogHeader>
              <div className='flex items-center space-x-2'>
                <div className='grid flex-1 gap-2'>
                  <Input
                    onChange={(e) => setCatName(e.target.value)}
                    placeholder='Team name'
                  />

                  <Label>Add Logo</Label>

                  <Upload 
                          fileList={fileList}
                          onChange={handleChange}>
                    <Button className='flex gap-2' variant='outline'> <UploadOutlined />Click to Upload</Button>
                  </Upload>
                  
                </div>
              </div>
              <DialogFooter className='sm:justify-start'>
                <DialogClose asChild>
                  <Button
                    type='button'
                    variant='secondary'
                    onClick={addNewCategory}>
                    Create
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardTitle>
        <CardDescription>
          Total {data.length} {data.length === 1 ? "Team" : "Teams"}
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
          
              <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={!Object.keys(rowSelection).length}>
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            selected team(s) from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={()=>setRowSelection({})}>Cancel</AlertDialogCancel>
          <AlertDialogAction  onClick={deleteProduct}>
            Yes, delete team(s)
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

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
