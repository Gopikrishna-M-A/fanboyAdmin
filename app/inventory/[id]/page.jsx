"use client";
import { Button } from "../../../components/ui/button";
import { PlusOutlined } from "@ant-design/icons";
import { Modal, Upload, message } from "antd";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { CalendarDateRangePicker } from "../../../components/dashboard/date-range-picker";
import { Overview } from "../../../components/dashboard/overview";
import ProductsList from "../../../components/inventory/Items";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { set } from "date-fns";
import { Checkbox } from "../../../components/ui/checkbox";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const page = ({ params }) => {
  const [product, setProduct] = useState([]);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const [goods, setGoods] = useState(true);
  const [service, setService] = useState(false);
  const [prodName, setProdName] = useState("");
  const [SKU, setSKU] = useState("");
  const [unit, setUnit] = useState("");
  const [prodCat, setProdCat] = useState("");
  const [fileList, setFileList] = useState([]);
  const [images, setImages] = useState([]);

  const [dimensions, setDimensions] = useState("");
  const [weight, setWeight] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [brand, setBrand] = useState("");
  const [UPC, setUPC] = useState("");
  const [MPN, setMPN] = useState("");
  const [EAN, setEAN] = useState("");
  const [ISBN, setISBN] = useState("");

  const [sellingPrice, setSellingPrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [MRP, setMRP] = useState("");
  const [salesAccount, setSalesAccount] = useState("");
  const [purchaseAccount, setPurchaseAccount] = useState("");
  const [salesDescription, setSalesDescription] = useState("");
  const [purchaseDescription, setPurchaseDescription] = useState("");
  const [preferredVendor, setPreferredVendor] = useState("");

  const [inventoryAccount, setInventoryAccount] = useState("");
  const [openingStock, setOpeningStock] = useState("");
  const [openingStockRatePerUnit, setOpeningStockRatePerUnit] = useState("");
  const [reorderPoint, setReorderPoint] = useState("");

  const [attributes, setAttributes] = useState([]);
  const [prodAttr, setProdAttr] = useState({});
  const [parentAttributes, setParentAttributes] = useState([]);
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    console.log(fileList);
  };

  const handleGoodsChange = () => {
    setGoods(true);
    setService(false);
  };

  const handleServiceChange = () => {
    setGoods(false);
    setService(true);
  };

  useEffect(() => {
    axios.get(`${baseURL}/api/products/${params.id}`).then((res) => {
      const product = res.data;
      setProduct(res.data);
      const imgs = product.images.map((link) => {
        const splitLink = link.split("/");
        const imageName = splitLink[splitLink.length - 1]; // Get the last part as image name
        return { name: imageName, status: "done", url: link };
      });

      // setFileList(product.images)
      setGoods(product.type === "Goods");
      setService(product.type === "Service");
      setProdName(product.name);
      setSKU(product.SKU);
      setUnit(product.unit);
      setProdCat(product.category);
      // setImages(imgs);
      setDimensions({
        length: product.dimention.length,
        width: product.dimention.width,
        height: product.dimention.height,
        unit: product.dimention.unit,
      });
      setWeight({
        value: product.weight.value,
        unit: product.weight.unit,
      });
      setManufacturer(product.manufacturer);
      setBrand(product.brand);
      setMPN(product.MPN);
      setEAN(product.EAN);
      setISBN(product.ISBN);
      setUPC(product.UPC);
      setSellingPrice(product.sellingPrice);
      setCostPrice(product.costPrice);
      setMRP(product.MRP);
      setSalesAccount(product.salesAccount);
      setSalesDescription(product.description);
      setPurchaseAccount(product.purchaseAccount);
      setPurchaseDescription(product.purchaseDescription);
      setPreferredVendor(product.preferredVendor);

      setInventoryAccount(product.inventoryAccount);
      setOpeningStock(product.openingStock);
      setOpeningStockRatePerUnit(product.openingStockRatePerUnit);
      setReorderPoint(product.reorderPoint);

      setAttributes(product.attributes);
    });

    axios.get(`${baseURL}/api/categories`).then((res) => {
      setCategories(res.data);
    });
  }, []);

  useEffect(() => {
    setAttributes({});
    setParentAttributes([]);

    if (category) {
      let catInfo = categories.find((cat) => cat._id === category);

      if (catInfo) {
        setParentAttributes([...catInfo.attributeKeys]);

        while (catInfo?.parentCategory?._id) {
          let parentCat = categories.find(
            (cat) => cat._id === catInfo.parentCategory._id
          );

          if (parentCat?.attributeKeys?.length > 0) {
            setParentAttributes((prevParentAttributes) => [
              ...prevParentAttributes,
              ...parentCat.attributeKeys,
            ]);
          }

          catInfo = parentCat;
        }
      }
    }
  }, [category]);

  const onSubmit = async () => {
    const formData = new FormData();
    fileList.map((file) => {
      formData.append("file", file.originFileObj);
    });
    const res = await axios.post("/api/aws", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const data = {
      type: goods ? "Goods" : "Service",
      name: prodName,
      SKU: SKU,
      unit: unit,
      category: prodCat._id,
      images: res.data,
      dimention: dimensions,
      weight: weight,
      manufacturer: manufacturer,
      brand: brand,
      MPN: MPN,
      EAN: EAN,
      ISBN: ISBN,
      UPC: UPC,
      sellingPrice: sellingPrice,
      costPrice: costPrice,
      MRP: MRP,
      salesAccount: salesAccount,
      description: salesDescription,
      purchaseAccount: purchaseAccount,
      purchaseDescription: purchaseDescription,
      preferredVendor: preferredVendor,
      inventoryAccount: inventoryAccount,
      openingStock: openingStock,
      openingStockRatePerUnit: openingStockRatePerUnit,
      reorderPoint: reorderPoint,
      // attributes: prodAttr,
    };
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([key, value]) => value !== undefined)
    );
    console.log("data", filteredData);
    axios
      .patch(`${baseURL}/api/products/${product._id}`, { data: filteredData })
      .then((res) => {
        message.success("item updated")
      });
  };

  const handleRemove = (e) => {
    const updatedFileList = fileList.filter((file) => file !== e);
    setFileList(updatedFileList);
  };

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
        <TabsContent value="items" className="space-y-4 ">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 max-w-3xl">
            <Card className="col-span-7">
              <CardHeader>
                <CardTitle className="flex justify-between">
                  Edit Product
                  <Button onClick={onSubmit}> Save Item</Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <div className="grid flex-1 gap-2">
                    {/* <Separator className="mb-5" /> */}

                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col gap-2 w-full">
                        <div className="w-full flex gap-7">
                          <div className="text-muted-foreground w-28">Type</div>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={goods}
                              name="type"
                              id="goods"
                              onClick={handleGoodsChange}
                            />
                            <Label htmlFor="goods">Goods</Label>
                            <Checkbox
                              checked={service}
                              name="type"
                              id="service"
                              onClick={handleServiceChange}
                            />
                            <Label htmlFor="service">Service</Label>
                          </div>
                        </div>

                        <div className="w-full flex gap-10">
                          <div className="text-muted-foreground w-32">Name</div>
                          <Input
                            value={prodName}
                            onChange={(e) => setProdName(e.target.value)}
                          />
                        </div>

                        <div className="w-full flex gap-10">
                          <div className="text-muted-foreground w-32">SKU</div>
                          <Input
                            value={SKU}
                            onChange={(e) => setSKU(e.target.value)}
                          />
                        </div>

                        <div className="w-full flex gap-10">
                          <div className="text-muted-foreground w-32">Unit</div>
                          <Select
                            value={unit}
                            onValueChange={(e) => {
                              setUnit(e);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="box">box</SelectItem>
                              <SelectItem value="cm">cm</SelectItem>
                              <SelectItem value="dz">dz</SelectItem>
                              <SelectItem value="ft">ft</SelectItem>
                              <SelectItem value="g">g</SelectItem>
                              <SelectItem value="in">in</SelectItem>
                              <SelectItem value="kg">kg</SelectItem>
                              <SelectItem value="km">km</SelectItem>
                              <SelectItem value="lb">lb</SelectItem>
                              <SelectItem value="mg">mg</SelectItem>
                              <SelectItem value="ml">ml</SelectItem>
                              <SelectItem value="m">m</SelectItem>
                              <SelectItem value="pcs">pcs</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="w-full flex gap-10">
                          <div className="text-muted-foreground w-32">
                            Category
                          </div>
                          <Select
                            value={prodCat._id}
                            onValueChange={(e) => {
                              setProdCat(e);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category, index) => (
                                <SelectItem key={index} value={category._id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Label>
                        Add Images
                        <p className=" text-muted-foreground text-sm font-light">
                          You can add up to 5 images, each not exceeding 5 MB.
                        </p>
                      </Label>
                      <div className=" w-full py-5 p-3  rounded border flex ">
                        <div className="text-muted-foreground">
                          <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onChange={handleChange}
                            onRemove={handleRemove}
                          >
                            {fileList.length >= 5 ? null : uploadButton}
                          </Upload>
                        </div>
                      </div>
                    </div>

                    <div className="mt-10"></div>

                    <div className="w-full flex gap-10">
                      <div className="flex w-full">
                        <div className="text-muted-foreground w-40">
                          Dimensions
                        </div>
                        <Input
                          value={`${dimensions.length} x ${dimensions.width} x ${dimensions.height}`}
                          onChange={(e) => setDimensions(e.target.value)}
                          placeholder="length x width x height"
                        />
                      </div>
                      <div className="flex w-full">
                        <div className="text-muted-foreground w-40">Weight</div>
                        <Input
                          value={weight?.value}
                          type="number"
                          onChange={(e) => setWeight(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="w-full flex gap-10">
                      <div className="flex w-full">
                        <div className="text-muted-foreground w-40">
                          Manufacturer
                        </div>
                        <Input
                          value={manufacturer}
                          onChange={(e) => setManufacturer(e.target.value)}
                        />
                      </div>
                      <div className="flex w-full">
                        <div className="text-muted-foreground w-40">Brand</div>
                        <Input
                          value={brand}
                          onChange={(e) => setBrand(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="w-full flex gap-10">
                      <div className="flex w-full">
                        <div className="text-muted-foreground w-40">UPC</div>
                        <Input
                          value={UPC}
                          onChange={(e) => setUPC(e.target.value)}
                        />
                      </div>
                      <div className="flex w-full">
                        <div className="text-muted-foreground w-40">MPN</div>
                        <Input
                          value={MPN}
                          onChange={(e) => setMPN(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="w-full flex gap-10">
                      <div className="flex w-full">
                        <div className="text-muted-foreground w-40">EAN</div>
                        <Input
                          value={EAN}
                          onChange={(e) => setEAN(e.target.value)}
                        />
                      </div>
                      <div className="flex w-full">
                        <div className="text-muted-foreground w-40">ISBN</div>
                        <Input
                          value={ISBN}
                          onChange={(e) => setISBN(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="mt-10"></div>

                    <div className="w-full flex gap-10">
                      <div className="flex w-full">
                        <div className="flex items-center gap-2 mb-5">
                          <Checkbox checked name="Sales" id="Sales" />
                          <Label htmlFor="Sales">Sales Information</Label>
                        </div>
                      </div>
                      <div className="flex w-full">
                        <div className="flex items-center gap-2 mb-5">
                          <Checkbox checked name="Sales" id="Sales" />
                          <Label htmlFor="Sales">Purchase Information</Label>
                        </div>
                      </div>
                    </div>

                    <div className="w-full flex gap-10">
                      <div className="flex w-full">
                        <div className="text-muted-foreground w-40">
                          Selling Price
                        </div>
                        <Input
                          value={sellingPrice}
                          onChange={(e) => setSellingPrice(e.target.value)}
                          type="number"
                        />
                      </div>
                      <div className="flex w-full">
                        <div className="text-muted-foreground w-40">
                          Cost Price
                        </div>
                        <Input
                          value={costPrice}
                          onChange={(e) => setCostPrice(e.target.value)}
                          type="number"
                        />
                      </div>
                    </div>

                    <div className="w-full flex gap-10">
                      <div className="flex w-full">
                        <div className="text-muted-foreground w-40">MRP</div>
                        <Input
                          value={MRP}
                          onChange={(e) => setMRP(e.target.value)}
                          type="number"
                        />
                      </div>
                      <div className="flex w-full">
                        <div className="text-muted-foreground w-40">
                          Account
                        </div>
                        <Input
                          value={purchaseAccount}
                          onChange={(e) => setPurchaseAccount(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="w-full flex gap-10">
                      <div className="flex w-full">
                        <div className="text-muted-foreground w-40">
                          Account
                        </div>
                        <Input
                          value={salesAccount}
                          onChange={(e) => setSalesAccount(e.target.value)}
                        />
                      </div>
                      <div className="flex w-full">
                        <div className="text-muted-foreground w-40">
                          Description
                        </div>
                        <Textarea
                          value={purchaseDescription}
                          onChange={(e) =>
                            setPurchaseDescription(e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="w-full flex gap-10">
                      <div className="flex w-full">
                        <div className="text-muted-foreground w-40">
                          Description
                        </div>
                        <Textarea
                          value={salesDescription}
                          onChange={(e) => setSalesDescription(e.target.value)}
                        />
                      </div>
                      <div className="flex w-full">
                        <div className="text-muted-foreground w-40">
                          Preferred Vendor
                        </div>
                        <Input
                          value={preferredVendor}
                          onChange={(e) => setPreferredVendor(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="mt-10"></div>

                    <div className="flex items-center gap-2 mb-5">
                      <Checkbox checked name="Sales" id="Sales" />
                      <Label htmlFor="Sales">
                        Track Inventory for this item
                      </Label>
                    </div>

                    <div className="flex items-center">
                      <div className="text-muted-foreground w-32">
                        Inventory Account
                      </div>
                      <Input
                        value={inventoryAccount}
                        className="w-1/2"
                        onChange={(e) => setInventoryAccount(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center">
                      <div className="text-muted-foreground w-32">
                        Opening Stock
                      </div>
                      <Input
                        value={openingStock}
                        className="w-1/2"
                        onChange={(e) => setOpeningStock(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center">
                      <div className="text-muted-foreground w-32">
                        Opening Stock Rate per Unit
                      </div>
                      <Input
                        value={openingStockRatePerUnit}
                        className="w-1/2"
                        onChange={(e) =>
                          setOpeningStockRatePerUnit(e.target.value)
                        }
                      />
                    </div>
                    <div className="flex items-center">
                      <div className="text-muted-foreground w-32">
                        Reorder Point
                      </div>
                      <Input
                        value={reorderPoint}
                        className="w-1/2"
                        onChange={(e) => setReorderPoint(e.target.value)}
                      />
                    </div>

                    {parentAttributes.map((attribute, index) => (
                      <div
                        key={index}
                        className="flex gap-2 w-full items-center"
                      >
                        <div className="w-24 capitalize text-sm text-foreground rounded-md bg-gray-100 px-3 py-2">
                          {attribute}
                        </div>
                        <Input
                          placeholder="Attribute value..."
                          onChange={(e) => {
                            setProdAttr((prevProdAttri) => ({
                              ...prevProdAttri,
                              [index]: e.target.value,
                            }));
                          }}
                        />
                      </div>
                    ))}
                  </div>
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
