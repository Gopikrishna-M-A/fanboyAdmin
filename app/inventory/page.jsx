"use client";
  import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { CalendarDateRangePicker } from "../../components/dashboard/date-range-picker";
import { Overview } from "../../components/dashboard/overview";
import Items from "../../components/inventory/Items";
import Category from "../../components/inventory/Category";
import { useEffect, useState } from "react";


export default function Page() {
  const [tab, setTab] = useState(0);

  useEffect(() => {
  }, [tab]);

  const handleTabChange = (num) => {
    setTab(num);
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
        {/* <div className="flex items-center space-x-2">
        <CalendarDateRangePicker />
        <Button>Download</Button>
      </div> */}
      </div>
      <Tabs defaultValue="items" className="space-y-4">
        <div className="flex justify-between">
          <TabsList>
            <TabsTrigger onClick={() => handleTabChange(0)} value="items">
              items
            </TabsTrigger>
            <TabsTrigger onClick={() => handleTabChange(1)} value="Categories">
              Teams
            </TabsTrigger>
            {/* <TabsTrigger onClick={() => handleTabChange(2)} value="Adjustments">
              Adjustments
            </TabsTrigger> */}
          </TabsList>
        </div>

        <TabsContent value="items" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Items />
          </div>
        </TabsContent>

        <TabsContent value="Categories" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Category />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
