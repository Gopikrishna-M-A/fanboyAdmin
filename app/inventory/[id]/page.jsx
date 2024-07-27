"use client"
import { Button } from "../../../components/ui/button"
import { PlusOutlined } from "@ant-design/icons"
import { Modal, Upload, message } from "antd"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Tabs, TabsContent } from "../../../components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select"
import { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"
import { Checkbox } from "../../../components/ui/checkbox"
import { Label } from "../../../components/ui/label"
import { Textarea } from "../../../components/ui/textarea"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

const page = ({ params }) => {
  const { toast } = useToast()
  const [prodName, setProdName] = useState("")
  const [prodCat, setProdCat] = useState("")
  const [selectedTeam,setSelectedTeam] = useState('')
  const [stock, setStock] = useState('')
  const [variant, setVariant] = useState('')
  const router = useRouter()
  const [sellingPrice, setSellingPrice] = useState("")
  const [costPrice, setCostPrice] = useState("")
  const [MRP, setMRP] = useState("")
  const [description, setDescription] = useState("")

  const [reorderPoint, setReorderPoint] = useState("")
  const [teams, setTeams] = useState([])

  
  useEffect(() => {
    axios.get(`/api/jerseys?id=${params.id}`).then((res) => {
      setSelectedTeam(res.data.jersey.team._id)
      setVariant(res.data.jersey.variant)
      setStock(res.data.jersey.stock)
      setProdName(res.data.jersey.name)
      setProdCat(res.data.jersey.category)
      setSellingPrice(res.data.jersey.price)
      setCostPrice(res.data.jersey.costPrice)
      setMRP(res.data.jersey.mrp)
      setDescription(res.data.jersey.description)
      setReorderPoint(res.data.jersey.reorderPoint)
    })

    axios.get(`/api/teams`).then((res) => {
      console.log(res.data);
      setTeams(res.data)
    })
  }, [])

  const onSubmit = async () => {
    const data = {
      name: prodName,
      category: prodCat,
      price: sellingPrice,
      costPrice,
      mrp: MRP,
      description,
      reorderPoint,
      stock,
    }

    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([key, value]) => value !== undefined)
    )

    axios
      .put(`/api/jerseys?id=${params.id}`, filteredData )
      .then((res) => {
        toast({
          title: `${res.data.name} UPDATED`,
        })
        router.push('/inventory')
      })
  }


  return (
    <div className='flex-1 space-y-4 p-8 pt-6'>
      <div className='flex items-center justify-between space-y-2'>
        <h2 className='text-3xl font-bold tracking-tight'>
          <Link href='/inventory'>Inventory</Link>
        </h2>
      </div>
      <Tabs defaultValue='items' className='space-y-4'>
        <div className='flex justify-between'></div>
        <TabsContent value='items' className='space-y-4 '>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7 max-w-3xl'>
            <Card className='col-span-7'>
              <CardHeader>
                <CardTitle className='flex justify-between'>
                  Edit Jersey
                  <Button onClick={onSubmit}> Save Item</Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex items-center space-x-2'>
                  <div className='grid flex-1 gap-2'>
                    <div className='flex flex-col gap-5'>
                      <div className='flex flex-col gap-2 w-full'>
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
                        value={stock}
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
                        value={reorderPoint}
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
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                  </div>

                    <div className='mt-10'></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default page
