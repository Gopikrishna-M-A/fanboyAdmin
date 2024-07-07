"use client";
import { Button } from "../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select"
import { CalendarDateRangePicker } from "../../../../components/dashboard/date-range-picker";
import { Overview } from "../../../../components/dashboard/overview";
import ProductsList from "../../../../components/inventory/Items";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { set } from "date-fns";
import { LogIn } from "lucide-react";


const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const page = ({ params }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoryAttributes, setCategoryAttributes] = useState([]);
  const [category, setCategory] = useState({});

  useEffect(() => {
    axios.get(`${baseURL}/api/categories`).then((res) => {
      setCategories(res.data)
    });

    axios.get(`${baseURL}/api/categories/${params.id}`).then((res) => {
          setCategory(res.data);
    })

  }, []);




  const onSubmit = () => {
    const data ={
      name,
      description,
      parentCategory,
      attributeKeys: categoryAttributes,
    }
    axios.patch(`${baseURL}/api/categories/${category._id}`, data)
  }

  useEffect(() => {
    setName(category.name);
    setDescription(category.description);
    setParentCategory(category.parentCategory);
    setCategoryAttributes(category.attributeKeys);
  }, [category]);





  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          <Link href="/inventory">Inventory</Link>
        </h2>
        {/* <div className="flex items-center space-x-2">
        <CalendarDateRangePicker />
        <Button>Download</Button>
      </div> */}
      </div>
      <Tabs defaultValue="items" className="space-y-4">
        <div className="flex justify-between">
          {/* <TabsList>
        <TabsTrigger value="items">items</TabsTrigger>
        <TabsTrigger value="item-groups">item groups</TabsTrigger>
        <TabsTrigger value="Composite-items">Composite items</TabsTrigger>
        <TabsTrigger value="Adjustments"> Adjustments</TabsTrigger>
      </TabsList> */}
        </div>
        <TabsContent value="items" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-7">
                  <CardHeader>
                    <CardTitle className="flex justify-between">
                      Edit Category
                      <Button onClick={onSubmit}> Save Item</Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>


                    <div className="flex gap-2 text-md -mt-4 items-center">
                      <div className="text-md text-foreground font-bold w-24">
                        Title
                      </div>
                      <Input
                        className="text-md text-muted-foreground "
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2 text-md my-2 items-center">
                      <div className="text-md text-foreground font-bold w-24">
                        Description
                      </div>
                      <Input
                        className="text-md text-muted-foreground "
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    

                    <div className="flex gap-2 text-md my-2 items-center">
                      <div className="text-md text-foreground font-bold w-24">
                        Parent Category
                      </div>
                       <Select 
                       value={parentCategory}
                       onValueChange={(e)=>{
                        setParentCategory(e)
                        }}>
                        <SelectTrigger >
                          <SelectValue 
                          placeholder="Item Category"/>
                        </SelectTrigger>
                        <SelectContent >
                          {categories.map((cat,index) => (
                            <SelectItem key={index} value={cat._id}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                   

                    <div className="flex gap-2 text-md flex-col">
                      <div className="text-md text-foreground font-bold w-24">
                        Attributes
                      </div>
          
                      {categoryAttributes?.map((attribute,index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <Input
                            className="text-md text-muted-foreground "
                            value={attribute}
                            onChange={(e) =>
                              setCategoryAttributes((prevProdAttr) =>{
                                const updatedArray = [...prevProdAttr]
                                updatedArray[index] = e.target.value
                                return updatedArray
                              })
                            }
                          />
                        </div>
                      ))}
                    </div>
                
                  </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
