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
import { set } from "date-fns"
import ProductCard from "./ProductCard"
import { PlusOutlined } from "@ant-design/icons"
import { Modal, Upload } from "antd"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"


const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })

export default function DataTableDemo() {
  const router = useRouter()
  const { toast } = useToast()
  const [data, setData] = useState([])
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})
  const [stock,setStock] = useState()
  const [teams, setTeams] = useState([])
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [copyItem, setCopyItem] = useState("")
  const [variant,setVariant] = useState('')
  const [prodName, setProdName] = useState("")
  const [prodCat, setProdCat] = useState("")
  const [fileList, setFileList] = useState([])
  const [images, setImages] = useState([])


  const [sellingPrice, setSellingPrice] = useState("")
  const [costPrice, setCostPrice] = useState("")
  const [MRP, setMRP] = useState("")
  const [description, setDescription] = useState('')

  const [reorderPoint, setReorderPoint] = useState('')

  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState("")
  const [previewTitle, setPreviewTitle] = useState("")

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type='button'>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}>
        Upload
      </div>
    </button>
  )

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList)


  const fetchJerseys = async () => {
    try {
      const response = await axios.get('/api/jerseys');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching jerseys:', error);
      // Handle the error appropriately (e.g., show an error message to the user)
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await axios.get('/api/teams');
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
      // Handle the error appropriately (e.g., show an error message to the user)
    }
  };


  useEffect(() => {
    fetchJerseys();
    fetchTeams();
  }, [])

  useEffect(() => {
    const updateCopyItem = async () => {
      const res = await axios.get(`api/jerseys?id=${copyItem}`)
      const jersey = res.data.jersey
      console.log("jersey", jersey)
      setSelectedTeam(jersey.team._id)
      setProdName(jersey.name)
      setProdCat(jersey.category)
      setSellingPrice(jersey.price)
      setCostPrice(jersey.costPrice)
      setMRP(jersey.mrp)
      setDescription(jersey.description)
      setVariant(jersey.variant)
    }

    if (copyItem) {
      updateCopyItem()
    }
  }, [copyItem])

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
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className=' capitalize'>
            Name
            <CaretSortIcon className='ml-2 h-4 w-4' />
          </Button>
        )
      },
      cell: ({ row }) => (
        <Dialog className='w-fit'>
          <DialogTrigger>{row.getValue("name")}</DialogTrigger>
          <DialogContent className='flex justify-center items-center w-fit p-10'>
            <ProductCard product={row.original} />
          </DialogContent>
        </Dialog>
      ),
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => {
        return <div className='capitalize'>{row.getValue("stock")}</div>
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        return <div className='capitalize'>{row.getValue("category")}</div>
      },
    },
    {
      accessorKey: "variant",
      header: "Variant",
      cell: ({ row }) => {
        return <div className='capitalize'>{row.getValue("variant")}</div>
      },
    },
    {
      accessorKey: "price",
      header: () => <div className='text-right'>Price</div>,
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("price"))

        // Format the amount as a dollar amount
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "INR",
        }).format(price)

        return <div className='text-right font-medium'>{formatted}</div>
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const product = row.original
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
                onClick={() => navigator.clipboard.writeText(product._id)}>
                Copy product ID
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={`/inventory/${product._id}`}>Edit product</Link>
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

      console.log(selectedIds)

      await Promise.all(
        selectedIds.map(async (id) => {
          await axios.delete(`/api/jerseys?id=${id}`).then((res)=>{
            toast({
              title: `${res.data.name} DELETED`,
            })
          })

        })
      )

      setData(data.filter((product) => !selectedIds.includes(product._id)))

      setRowSelection({})
    } catch (error) {
      console.error("Error deleting categories:", error)
    }
  }

  const addNewItem = async () => {
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
      name: prodName,
      team: selectedTeam,
      variant,
      stock,
      category: prodCat,
      images: res.data,
      price: sellingPrice,
      costPrice: costPrice,
      mrp: MRP,
      description: description,
      reorderPoint: reorderPoint,
    }
    axios
      .post(`/api/jerseys`, requestBody)
      .then((res) => {
        fetchJerseys()
        toast({
          title: `Jersey created successfully`,
        })
        router.push('/inventory')
      })
      .catch((error) => {
        setFileList([])
        toast({
          title: `Error adding jersey`,
        })
      })
  }

  return (
    <Card className='col-span-7'>
      <CardHeader>
        <CardTitle className='flex justify-between'>
          Jerseys
          <Dialog>
            <DialogTrigger asChild>
              <Button> Add New Item</Button>
            </DialogTrigger>
            <DialogContent className='max-w-3xl overflow-y-scroll max-h-full'>
              <DialogHeader>
                <DialogTitle>New Jersey</DialogTitle>
                <DialogDescription>
                  Enter the details below to add a new Jersey.
                </DialogDescription>
              </DialogHeader>
              <div className='flex items-center space-x-2'>
                <div className='grid flex-1 gap-2'>
                  <Separator className='mb-5' />

                  <div className='flex flex-col gap-5'>
                    <div className='flex flex-col gap-2 w-full'>
                      <div className='w-full flex gap-10'>
                        <div className='text-muted-foreground w-32'>
                          Copy Jersey
                        </div>
                        <Select
                          value={copyItem}
                          onValueChange={(e) => {
                            setCopyItem(e)
                          }}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {data
                              .slice() // Create a shallow copy of the array to avoid mutating the original
                              .sort((a, b) => a.name.localeCompare(b.name)) // Sort the array based on the 'name' property
                              .map((product) => (
                                <SelectItem
                                  key={product._id}
                                  value={product._id}>
                                  {product.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className='w-full flex gap-10'>
                        <div className='text-muted-foreground w-32'>Team</div>
                        <Select
                          value={selectedTeam}
                          onValueChange={(value) => {
                            setSelectedTeam(value)
                          }}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {teams.map((team) => (
                              <SelectItem key={team._id} value={team._id}>
                                {team.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className='w-full flex gap-10'>
                        <div className='text-muted-foreground w-32'>Name</div>
                        <Input
                          value={prodName}
                          onChange={(e) => setProdName(e.target.value)}
                        />
                      </div>

                      <div className='w-full flex gap-10'>
                        <div className='text-muted-foreground w-32'>
                          Category
                        </div>
                        <Select
                          value={prodCat}
                          onValueChange={(e) => {
                            setProdCat(e)
                          }}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='international'>
                              International
                            </SelectItem>
                            <SelectItem value='club'>Club </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className='w-full flex gap-10'>
                        <div className='text-muted-foreground w-32'>
                          Variant
                        </div>
                        <Select
                          value={variant}
                          onValueChange={(e) => {
                            setVariant(e)
                          }}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='firstcopy'>firstcopy</SelectItem>
                            <SelectItem value='master'>master</SelectItem>
                            <SelectItem value='player'>player</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Label>
                      Add Images
                      <p className=' text-muted-foreground text-sm font-light'>
                        You can add up to 5 images, each not exceeding 5 MB.
                      </p>
                    </Label>
                    <div className=' w-full py-5 p-3  rounded border flex '>
                      <div className='text-muted-foreground'>
                        <Upload
                          listType='picture-card'
                          fileList={fileList}
                          onChange={handleChange}
                          multiple={true}>
                          {fileList.length >= 5 ? null : uploadButton}
                        </Upload>
                      </div>
                    </div>
                  </div>

                  <div className='mt-10'></div>

                  <div className='w-full flex gap-10'>
                    <div className='flex w-full'>
                      <div className='flex items-center gap-2 mb-5'>
                        <Checkbox checked name='Sales' id='Sales' />
                        <Label htmlFor='Sales'>Sales Information</Label>
                      </div>
                    </div>
                  </div>

                  <div className='w-full flex gap-10'>
                    <div className='flex w-full'>
                      <div className='text-muted-foreground w-40'>
                        Cost Price
                      </div>
                      <Input
                        value={costPrice}
                        onChange={(e) => setCostPrice(e.target.value)}
                        type='number'
                      />
                    </div>
                  </div>

                  <div className='w-full flex gap-10'>
                    <div className='flex w-full'>
                      <div className='text-muted-foreground w-40'>
                        Selling Price
                      </div>
                      <Input
                        value={sellingPrice}
                        onChange={(e) => setSellingPrice(e.target.value)}
                        type='number'
                      />
                    </div>
                  </div>

                  <div className='w-full flex gap-10'>
                    <div className='flex w-full'>
                      <div className='text-muted-foreground w-40'>MRP</div>
                      <Input
                        value={MRP}
                        onChange={(e) => setMRP(e.target.value)}
                        type='number'
                      />
                    </div>
                  </div>

                  <div className='w-full flex gap-10'>
                    <div className='flex w-full'>
                      <div className='text-muted-foreground w-40'>Stock</div>
                      <Input
                        value={stock || 20}
                        onChange={(e) => setStock(e.target.value)}
                        type='number'
                      />
                    </div>
                  </div>

                  <div className='w-full flex gap-10'>
                    <div className='flex w-full'>
                      <div className='text-muted-foreground w-40'>
                        Reorder Point
                      </div>
                      <Input
                        value={reorderPoint || 5}
                        onChange={(e) => setReorderPoint(e.target.value)}
                        type='number'
                      />
                    </div>
                  </div>

                  <div className='w-full flex gap-10'>
                    <div className='flex w-full'>
                      <div className='text-muted-foreground w-40'>
                        Description
                      </div>
                      <Textarea
                        value={description || `Official Jersey of ${prodName} for 24/25 Season - ${variant} version
For Name Print orders, contact directly on WhatsApp`}
                       
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                  </div>
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
          Total {data.length} {data.length === 1 ? "Jersey" : "Jerseys"}
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
            selected jersey(s) from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={()=>setRowSelection({})}>Cancel</AlertDialogCancel>
          <AlertDialogAction  onClick={deleteProduct}>
            Yes, delete jersey(s)
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
