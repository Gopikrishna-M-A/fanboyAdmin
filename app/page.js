"use client"
import { Button } from "../components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { DatePickerWithPresets } from "../components/ui/datepicker"
import { Overview } from "../components/dashboard/overview"
import { RecentSales } from "../components/dashboard/recent-sales"
import { useEffect, useState } from "react"
import axios from "axios"
import { generatePerformanceReport } from "../components/dashboard/report"
import { boolean } from "zod"
import Image from "next/image"
const baseURL = process.env.NEXT_PUBLIC_BASE_URL

export default function DashboardPage() {
  const [orders, setOrders] = useState([])
  const [ordersCopy, setOrdersCopy] = useState([])
  const [totalRevenue, setTotalRevenue] = useState()
  const [totalRevenuePercentageChange, setTotalRevenuePercentageChange] =
    useState()
  const [todayRevenue, setTodayRevenue] = useState()
  const [previousRevenue, setPreviousRevenue] = useState()

  const [sales, setSales] = useState()
  const [salesPercentageChange, setSalesPercentageChange] = useState()
  const [customers, setCustomers] = useState()
  const [customersPercentageChange, setCustomersPercentageChange] = useState()
  const [recentSales, setRecentSales] = useState()
  const [overview, setOverview] = useState()

  const [products, setProducts] = useState()
  const [productsToReorder, setProductsToReorder] = useState([])

  const [reportDate, setReportDate] = useState()

  const fetchOrders = () => {
    axios.get(`/api/orders`).then((res) => {
      setOrders(res.data)
      setOrdersCopy(res.data)
      calculateTotalRevenue(res.data)
      calculateTotalSales(res.data)
      getLatestOrders(res.data)
      calculateDistinctCustomers(res.data)
      calculateDailyRevenue(res.data)
      generateMonthlyRevenueData(res.data)
    })
  }

  const fetchProducts = () => {
    axios.get(`/api/jerseys`).then((res) => {
      setProducts(res.data)
      const filteredProducts = res.data.filter(
        (product) => product.stock < product.reorderPoint
      )
      setProductsToReorder(filteredProducts)
      console.log("ProductsToReorder", filteredProducts)
    })
  }

  useEffect(() => {
    fetchOrders()
    fetchProducts()
  }, [])

  useEffect(() => {
    const dateObject = new Date(reportDate)
    const newOrders = ordersCopy.filter((order) => {
      const orderDate = new Date(order.orderDate)
      return orderDate >= dateObject
    })
    if (dateObject == "Invalid Date") setOrders(ordersCopy)
    else setOrders(newOrders)
  }, [reportDate])

  const formattedPrice = (price) => {
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    }).format(price)
    return formatted
  }

  function calculateTotalRevenue(orders) {
    // Get the current date
    const currentDate = new Date()
    // Get the current month and year
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()

    // Filter orders for the current month and year
    const currentMonthOrders = orders?.filter((order) => {
      const orderDate = new Date(order.orderDate)
      return (
        orderDate.getMonth() === currentMonth &&
        orderDate.getFullYear() === currentYear
      )
    })

    // Filter orders for the previous month and year
    const previousMonthOrders = orders?.filter((order) => {
      const orderDate = new Date(order.orderDate)
      const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1
      const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear
      return (
        orderDate.getMonth() === previousMonth &&
        orderDate.getFullYear() === previousYear
      )
    })

    // Calculate total revenue for the current month
    const totalRevenueCurrentMonth = currentMonthOrders.reduce(
      (total, order) => {
        return total + order.total
      },
      0
    )

    // Calculate total revenue for the previous month
    const totalRevenuePreviousMonth = previousMonthOrders.reduce(
      (total, order) => {
        return total + order.total
      },
      0
    )
    // Calculate percentage change
    const percentageChange =
      ((totalRevenueCurrentMonth - totalRevenuePreviousMonth) /
        totalRevenuePreviousMonth) *
      100

    // Format total revenue
    const formattedTotalRevenue = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    }).format(totalRevenueCurrentMonth)

    // Set the state variables
    setTotalRevenue(formattedTotalRevenue)
    setTotalRevenuePercentageChange(percentageChange.toFixed(2))
  }

  function calculateTotalSales(orders) {
    // Get the current date
    const currentDate = new Date()
    // Get the current month and year
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()

    // Filter orders for the current month and previous month
    const currentMonthOrders = orders.filter((order) => {
      const orderDate = new Date(order.orderDate)
      return (
        orderDate.getMonth() === currentMonth &&
        orderDate.getFullYear() === currentYear
      )
    })

    // Get the previous month and year
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear

    // Filter orders for the previous month
    const previousMonthOrders = orders.filter((order) => {
      const orderDate = new Date(order.orderDate)
      return (
        orderDate.getMonth() === previousMonth &&
        orderDate.getFullYear() === previousYear
      )
    })

    // Calculate the total number of sales for the current month and previous month
    const totalSalesCurrentMonth = currentMonthOrders.length
    const totalSalesPreviousMonth = previousMonthOrders.length

    // Calculate the percentage increase or decrease
    const percentageChange =
      totalSalesCurrentMonth === 0
        ? 0
        : ((totalSalesCurrentMonth - totalSalesPreviousMonth) /
            totalSalesPreviousMonth) *
          100

    // console.log("totalSalesPreviousMonth", totalSalesPreviousMonth);
    // Store the results in state variables
    setSales(totalSalesCurrentMonth)
    setSalesPercentageChange(percentageChange.toFixed(2))
  }

  function getLatestOrders(orders) {
    // Sort orders by order date in descending order
    const sortedOrders = orders.sort((a, b) => {
      const dateA = new Date(a.orderDate)
      const dateB = new Date(b.orderDate)
      return dateB - dateA
    })

    // Get the first 5 orders
    const latestOrders = sortedOrders.slice(0, 5)

    setRecentSales(latestOrders)
  }

  function calculateDistinctCustomers(orders) {
    // Get the current date
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth() + 1 // Months are zero-based
    const currentYear = currentDate.getFullYear()

    // Filter orders for the current month
    const currentMonthOrders = orders.filter((order) => {
      const orderDate = new Date(order.orderDate)
      return (
        orderDate.getMonth() + 1 === currentMonth &&
        orderDate.getFullYear() === currentYear
      )
    })

    // Extract unique customer phone numbers for the current month
    const currentMonthCustomers = new Set()
    currentMonthOrders.forEach((order) =>
      currentMonthCustomers.add(order.customer.address.phone)
    )

    // Filter orders for the previous month
    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1
    const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear
    const previousMonthOrders = orders.filter((order) => {
      const orderDate = new Date(order.orderDate)
      return (
        orderDate.getMonth() + 1 === previousMonth &&
        orderDate.getFullYear() === previousYear
      )
    })

    // Extract unique customer phone numbers for the previous month
    const previousMonthCustomers = new Set()
    previousMonthOrders.forEach((order) =>
      previousMonthCustomers.add(order.customer.address.phone)
    )

    // Calculate the count of distinct customers for both months
    const currentMonthCount = currentMonthCustomers.size
    const previousMonthCount = previousMonthCustomers.size

    // Calculate the percentage change
    const percentageChange =
      previousMonthCount !== 0
        ? ((currentMonthCount - previousMonthCount) / previousMonthCount) * 100
        : 0

    setCustomers(currentMonthCount)
    setCustomersPercentageChange(percentageChange.toFixed(2))
  }

  function calculateDailyRevenue(orders) {
    // Get the current date
    const currentDate = new Date()
    const currentDateString = currentDate.toISOString().slice(0, 10) // Get current date in "YYYY-MM-DD" format

    // Filter orders for the current day
    const currentDayOrders = orders.filter(
      (order) => order.orderDate.slice(0, 10) === currentDateString
    )

    // Calculate total revenue for the current day
    const totalRevenueToday = currentDayOrders.reduce(
      (total, order) => total + order.total,
      0
    )

    // Get the previous day's date
    const previousDate = new Date(currentDate)
    previousDate.setDate(previousDate.getDate() - 1)
    const previousDateString = previousDate.toISOString().slice(0, 10) // Get previous day's date in "YYYY-MM-DD" format

    // Filter orders for the previous day
    const previousDayOrders = orders.filter(
      (order) => order.orderDate.slice(0, 10) === previousDateString
    )

    // Calculate total revenue for the previous day
    const totalRevenuePreviousDay = previousDayOrders.reduce(
      (total, order) => total + order.total,
      0
    )

    // Calculate the percentage change
    const percentageChange =
      ((totalRevenueToday - totalRevenuePreviousDay) /
        totalRevenuePreviousDay) *
      100

    setTodayRevenue(totalRevenueToday)
    setPreviousRevenue(totalRevenuePreviousDay)
  }

  function generateMonthlyRevenueData(orders) {
    const monthlyRevenueData = [
      { name: "Jan", total: 0 },
      { name: "Feb", total: 0 },
      { name: "Mar", total: 0 },
      { name: "Apr", total: 0 },
      { name: "May", total: 0 },
      { name: "Jun", total: 0 },
      { name: "Jul", total: 0 },
      { name: "Aug", total: 0 },
      { name: "Sep", total: 0 },
      { name: "Oct", total: 0 },
      { name: "Nov", total: 0 },
      { name: "Dec", total: 0 },
    ]

    // Iterate through orders to calculate monthly totals
    orders?.forEach((order) => {
      const orderDate = new Date(order.orderDate)
      const month = orderDate.getMonth()
      const total = order.total
      monthlyRevenueData[month].total += total
    })
    // console.log("monthlyRevenueData",monthlyRevenueData);
    setOverview(monthlyRevenueData)
  }

  return (
    <div className='flex-1 space-y-4 p-8 pt-6'>
      <div className='flex items-center justify-between space-y-2'>
        <h2 className='text-3xl font-bold tracking-tight'>Dashboard</h2>
        <div className='flex items-center space-x-2'>
          <DatePickerWithPresets setDateChange={setReportDate} />
          <Button onClick={() => generatePerformanceReport(orders)}>
            Download
          </Button>
        </div>
      </div>
      <Tabs defaultValue='overview' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          {/* <TabsTrigger value="analytics"> Analytics</TabsTrigger> */}
          {/* <TabsTrigger value="reports"> Reports</TabsTrigger> */}
          <TabsTrigger value='notifications'> Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value='overview' className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Total Revenue
                </CardTitle>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  stroke-width='2'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  className='h-4 w-4 text-muted-foreground'>
                  {/* class='lucide lucide-indian-rupee'> */}
                  <path d='M6 3h12' />
                  <path d='M6 8h12' />
                  <path d='m6 13 8.5 8' />
                  <path d='M6 13h3' />
                  <path d='M9 13c6.667 0 6.667-10 0-10' />
                </svg>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {totalRevenue || "₹0.00"}
                </div>
                <p className='text-xs text-muted-foreground'>
                  {totalRevenuePercentageChange || "0.00"}% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Customers</CardTitle>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  className='h-4 w-4 text-muted-foreground'>
                  <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
                  <circle cx='9' cy='7' r='4' />
                  <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
                </svg>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{customers}</div>
                <p className='text-xs text-muted-foreground'>
                  {customersPercentageChange || "0.00"}% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Sales</CardTitle>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  className='h-4 w-4 text-muted-foreground'>
                  <rect width='20' height='14' x='2' y='5' rx='2' />
                  <path d='M2 10h20' />
                </svg>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>+{sales || 0}</div>
                <p className='text-xs text-muted-foreground'>
                  {salesPercentageChange || "0.00"}% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Today's Revenue
                </CardTitle>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  className='h-4 w-4 text-muted-foreground'>
                  <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
                </svg>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {formattedPrice(todayRevenue) || "₹0.00"}
                </div>
                <p className='text-xs text-muted-foreground'>
                  {`${
                    todayRevenue - previousRevenue >= 0
                      ? `+ ${formattedPrice(todayRevenue - previousRevenue)}`
                      : formattedPrice(todayRevenue - previousRevenue)
                  }  compared to the last day.`}
                </p>
              </CardContent>
            </Card>
          </div>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
            <Card className='col-span-4'>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className='pl-2'>
                <Overview data={overview} />
              </CardContent>
            </Card>
            <Card className='col-span-3'>
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>
                  You made {sales || 0} sales this month.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentSales recentSales={recentSales} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value='notifications' className='space-y-4 h-full'>
          <Card className='min-h-96'>
            <CardHeader>
              <CardTitle>Low Stock Products</CardTitle>
              <CardDescription>
                Below are the products that need to be reordered:
              </CardDescription>
            </CardHeader>
            <CardContent className='flex gap-3 flex-wrap'>
              {productsToReorder.map((product) => (
                <div key={product._id}>
                  <div className='border min-w-80 w-fit rounded px-5 py-2 flex gap-5 relative'>
                    <div className='bg-red-600 text-white text-sm px-2 rounded-full flex justify-center gap-2 items-center w-15 h-7 absolute -top-2 -right-2'>
                      Low Stock{" "}
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        height='24px'
                        viewBox='0 -960 960 960'
                        width='16px'
                        fill='#e8eaed'>
                        <path d='M200-80q-33 0-56.5-23.5T120-160v-451q-18-11-29-28.5T80-680v-120q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v120q0 23-11 40.5T840-611v451q0 33-23.5 56.5T760-80H200Zm0-520v440h560v-440H200Zm-40-80h640v-120H160v120Zm200 280h240v-80H360v80Zm120 20Z' />
                      </svg>
                    </div>
                    <Image src={product.images[0]} width={80} height={50} />
                    <div className='flex flex-col'>
                      <div className='text-sm text-muted-foreground mt-3'>
                        {product.name}
                      </div>
                      <div className='text-sm text-muted-foreground '>
                        MRP :{" "}
                        <span className='text-black font-bold'>
                          {formattedPrice(product.MRP)}
                        </span>{" "}
                      </div>
                      <div className='text-sm text-muted-foreground '>
                        QTY : {product.stockQuantity} remaining
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
