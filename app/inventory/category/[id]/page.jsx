"use client";
import { Button } from "../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import {
  Tabs,
  TabsContent,

} from "../../../../components/ui/tabs";
import { Upload } from "antd"
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { UploadOutlined } from "@ant-design/icons"
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast"

const page = ({ params }) => {
  const { toast } = useToast()
  const [name, setName] = useState("");
  const [fileList, setFileList] = useState([])
  const router  = useRouter()


  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList)


  useEffect(() => {
    axios.get(`/api/teams?id=${params.id}`).then((res) => {
          setName(res.data.team.name);
    })
  }, []);




  const onSubmit = async () => {
    const formData = new FormData()
    fileList.map((file) => {
      formData.append("file", file.originFileObj)
    })
    const res = await axios.post("/api/aws", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    const data ={
      name,
      logo:res.data[0]
    }
    console.log("data",data);
    axios.put(`/api/teams?id=${params.id}`, data).then((res) => {
      toast({
        title: `${res.data.name} UPDATED`,
      })
      router.push('/inventory')
    })
  }



  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          <Link href="/inventory">Inventory</Link>
        </h2>

      </div>
      <Tabs defaultValue="items" className="space-y-4">
        <div className="flex justify-between">
        </div>
        <TabsContent value="items" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-7">
                  <CardHeader>
                    <CardTitle className="flex justify-between">
                      Edit Team
                      <Button onClick={onSubmit}> Save Item</Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>


                  <div className='grid flex-1 gap-2'>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='Team name'
                  />

                  <Label>Add Logo</Label>

                  <Upload 
                          fileList={fileList}
                          onChange={handleChange}>
                    <Button className='flex gap-2' variant='outline'> <UploadOutlined />Click to Upload</Button>
                  </Upload>
                  
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
