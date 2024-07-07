import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs"
import { CalendarDateRangePicker } from "../../components/dashboard/date-range-picker"
import Customers from "../../components/sales/Customers"
import Orders from "../../components/sales/Orders"




export default function Page() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Sales</h2>
      </div>
      <Tabs defaultValue="Customers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="Customers">Customers</TabsTrigger>
          <TabsTrigger value="orders" >orders</TabsTrigger>

        </TabsList>
        <TabsContent value="Customers" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Customers />
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Orders />
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
}
