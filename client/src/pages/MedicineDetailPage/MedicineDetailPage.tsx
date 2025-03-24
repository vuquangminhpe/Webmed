// Updated MedicineDetailPage.tsx
import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingCart, Plus, Minus, AlertCircle, CheckCircle2, Info, Loader2, Pill } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useMedicine } from '@/hooks/useMedicine'
import { useAddToCart } from '@/hooks/useCart' // Import the proper hook
import path from '@/constants/path'

const MedicineDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(1)

  const { data: medicine, isLoading, error } = useMedicine(id || '')
  const addToCart = useAddToCart() // Use the proper hook

  const incrementQuantity = () => setQuantity((prev) => prev + 1)
  const decrementQuantity = () => setQuantity((prev) => Math.max(prev - 1, 1))

  const handleAddToCart = () => {
    if (!medicine) return
    if (medicine.requires_prescription) return

    // Use the proper hook with the right parameters
    addToCart.mutate({ medicineId: medicine._id, quantity })
  }

  if (isLoading) {
    return (
      <div className='container px-4 py-8 md:py-12'>
        <div className='flex items-center space-x-4'>
          <Button variant='ghost' size='icon' asChild>
            <Link to={path.medicines}>
              <ArrowLeft className='h-5 w-5' />
            </Link>
          </Button>
          <Skeleton className='h-9 w-72' />
        </div>

        <div className='mt-8 flex flex-col space-y-8 lg:flex-row lg:space-x-8 lg:space-y-0'>
          <div className='lg:w-1/3'>
            <Skeleton className='aspect-square w-full' />
            <Skeleton className='mt-6 h-64 w-full' />
          </div>

          <div className='flex-1'>
            <Skeleton className='h-10 w-40 rounded-md' />
            <div className='mt-6 space-y-6'>
              <Skeleton className='h-24 w-full' />
              <Skeleton className='h-72 w-full' />
              <Skeleton className='h-72 w-full' />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !medicine) {
    return (
      <div className='container px-4 py-8 md:py-12'>
        <div className='flex items-center space-x-4'>
          <Button variant='ghost' size='icon' asChild>
            <Link to={path.medicines}>
              <ArrowLeft className='h-5 w-5' />
            </Link>
          </Button>
          <h1 className='text-2xl font-bold'>Error Loading Medicine Information</h1>
        </div>

        <div className='mt-8 flex flex-col items-center justify-center rounded-lg border border-destructive p-8 text-center text-destructive'>
          <AlertCircle className='mb-2 h-10 w-10' />
          <h3 className='mb-2 text-lg font-semibold'>Failed to Load Medicine Details</h3>
          <p>
            There was an error loading the medicine information. Please try again later or return to{' '}
            <Link to={path.medicines} className='font-medium underline'>
              Drugs & Supplements
            </Link>
            .
          </p>
          <Button variant='outline' className='mt-4' onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='container px-4 py-8 md:py-12'>
      <div className='flex items-center space-x-4'>
        <Button variant='ghost' size='icon' asChild>
          <Link to={path.medicines}>
            <ArrowLeft className='h-5 w-5' />
          </Link>
        </Button>
        <h1 className='text-2xl font-bold md:text-3xl'>{medicine.name}</h1>
      </div>

      <div className='mt-8 flex flex-col space-y-8 lg:flex-row lg:space-x-8 lg:space-y-0'>
        {/* Left Column: Image and Purchase Options */}
        <div className='lg:w-1/3'>
          <div className='overflow-hidden rounded-lg border'>
            <div className='aspect-square w-full bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center'>
              <ShoppingCart className='h-24 w-24 text-gray-300' />
            </div>
          </div>

          <Card className='mt-6'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle>Purchase Options</CardTitle>
                <div>
                  {medicine.requires_prescription ? (
                    <Badge className='bg-red-100 text-red-700 hover:bg-red-200'>Prescription Required</Badge>
                  ) : (
                    <Badge variant='outline' className='bg-green-100 text-green-700 hover:bg-green-200'>
                      Over-the-Counter
                    </Badge>
                  )}
                </div>
              </div>
              <CardDescription>Manufacturer: {medicine.manufacturer}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-6'>
                <div className='flex items-center justify-between'>
                  <span className='font-medium'>Price:</span>
                  <span className='text-lg font-bold text-primary'>${medicine.price.toFixed(2)}</span>
                </div>

                <div className='flex items-center justify-between'>
                  <span className='font-medium'>Availability:</span>
                  <span className='flex items-center text-green-600'>
                    <CheckCircle2 className='mr-1 h-4 w-4' />
                    In Stock
                  </span>
                </div>

                <div className='flex items-center justify-between'>
                  <span className='font-medium'>Quantity:</span>
                  <div className='flex items-center border rounded-md'>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-9 rounded-none rounded-l-md'
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                    >
                      <Minus className='h-4 w-4' />
                    </Button>
                    <div className='flex items-center justify-center h-9 w-12 text-center border-x'>{quantity}</div>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-9 rounded-none rounded-r-md'
                      onClick={incrementQuantity}
                    >
                      <Plus className='h-4 w-4' />
                    </Button>
                  </div>
                </div>

                <div className='flex flex-col space-y-3'>
                  <Button
                    onClick={handleAddToCart}
                    disabled={medicine.requires_prescription || addToCart.isPending}
                    className='w-full'
                  >
                    {addToCart.isPending ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Adding to Cart...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className='mr-2 h-4 w-4' />
                        Add to Cart
                      </>
                    )}
                  </Button>

                  {medicine.requires_prescription ? (
                    <Alert variant='destructive'>
                      <AlertCircle className='h-4 w-4' />
                      <AlertTitle>Prescription Required</AlertTitle>
                      <AlertDescription>
                        This medication requires a valid prescription from a healthcare provider.
                      </AlertDescription>
                    </Alert>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='flex-1'>
          <Tabs defaultValue='overview'>
            <TabsList className='mb-6'>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='dosage'>Dosage & Usage</TabsTrigger>
              <TabsTrigger value='side-effects'>Side Effects</TabsTrigger>
              <TabsTrigger value='warnings'>Warnings</TabsTrigger>
            </TabsList>

            <TabsContent value='overview' className='space-y-6'>
              <div className='rounded-lg bg-muted p-6'>
                <h2 className='mb-4 text-xl font-semibold'>About {medicine.name}</h2>
                <p className='text-muted-foreground'>{medicine.description}</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Key Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <div>
                      <h3 className='font-semibold'>Category</h3>
                      <p className='text-muted-foreground'>General</p>
                    </div>
                    <div>
                      <h3 className='font-semibold'>Form</h3>
                      <p className='text-muted-foreground'>
                        {medicine.dosage.includes('tablet') ? 'Tablet' : 'Capsule'}
                      </p>
                    </div>
                    <div>
                      <h3 className='font-semibold'>Active Ingredient</h3>
                      <p className='text-muted-foreground'>{medicine.name.split(' ')[0]}</p>
                    </div>
                    <div>
                      <h3 className='font-semibold'>Strength</h3>
                      <p className='text-muted-foreground'>{medicine.dosage}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>What is {medicine.name} used for?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-muted-foreground mb-4'>
                    Based on its properties and common medical uses, this medication may be used for:
                  </p>
                  <ul className='list-inside list-disc space-y-2'>
                    <li>Relief of symptoms</li>
                    <li>Management of associated conditions</li>
                    <li>Short or long-term treatment as prescribed</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='dosage' className='space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Dosage</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='mb-4 text-muted-foreground'>Refer to doctor's instructions for proper usage.</p>

                  <h3 className='mb-2 font-semibold'>Standard Adult Dosage:</h3>
                  <p className='mb-4 text-muted-foreground'>
                    Follow the dosage instructions provided on the medication packaging or as prescribed by your
                    healthcare provider.
                  </p>

                  <h3 className='mb-2 font-semibold'>For Children:</h3>
                  <p className='text-muted-foreground'>
                    Dosage for children should be determined by a healthcare professional based on age, weight, and
                    specific condition.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>How to Take</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className='list-inside list-disc space-y-2'>
                    <li>Follow your doctor's instructions carefully</li>
                    <li>Take with or without food as directed</li>
                    <li>
                      If a dose is missed, take it as soon as you remember (unless it's almost time for your next dose)
                    </li>
                    <li>Do not double doses to make up for missed doses</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Storage</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-muted-foreground'>
                    Store below 25°C in a dry place. Keep out of reach of children.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='side-effects' className='space-y-6'>
              <div className='rounded-lg bg-muted p-6'>
                <h2 className='mb-4 text-xl font-semibold'>Potential Side Effects</h2>
                <p className='text-muted-foreground'>
                  Like all medicines, {medicine.name} can cause side effects, although not everybody gets them. Most
                  side effects are mild and temporary.
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Common Side Effects</CardTitle>
                </CardHeader>
                <CardContent>
                  {medicine.side_effects && medicine.side_effects.length > 0 ? (
                    <ul className='list-inside list-disc space-y-2'>
                      {medicine.side_effects.map((effect, index) => (
                        <li key={index}>{effect}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className='text-muted-foreground'>
                      Information about side effects is not available for this medication.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Alert>
                <Info className='h-4 w-4' />
                <AlertTitle>Seek Medical Attention</AlertTitle>
                <AlertDescription>
                  Stop taking the medication and seek immediate medical attention if you experience:
                  <ul className='mt-2 list-inside list-disc space-y-1'>
                    <li>Difficulty breathing or swallowing</li>
                    <li>Swelling of the face, lips, tongue, or throat</li>
                    <li>Severe skin reactions</li>
                    <li>Yellowing of the skin or eyes (jaundice)</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value='warnings' className='space-y-6'>
              <Alert variant='destructive'>
                <AlertCircle className='h-4 w-4' />
                <AlertTitle>Important Safety Information</AlertTitle>
                <AlertDescription>
                  Read all warnings carefully before using this medication. Incorrect use can lead to serious health
                  risks.
                </AlertDescription>
              </Alert>

              <Card>
                <CardHeader>
                  <CardTitle>Warnings and Precautions</CardTitle>
                </CardHeader>
                <CardContent>
                  {medicine.side_effects && medicine.side_effects.length > 0 ? (
                    <ul className='list-inside list-disc space-y-2'>
                      {medicine.side_effects.map((warning, index) => (
                        <li key={index}>{warning}</li>
                      ))}
                    </ul>
                  ) : (
                    <ul className='list-inside list-disc space-y-2'>
                      <li>Do not exceed the recommended dose</li>
                      <li>Consult a doctor if symptoms persist or worsen</li>
                      <li>Discuss with your doctor if you have existing health conditions</li>
                      <li>Tell your doctor about all medications you are taking</li>
                    </ul>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Special Populations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <div>
                      <h3 className='mb-2 font-semibold'>Pregnancy and Breastfeeding:</h3>
                      <p className='text-muted-foreground'>
                        Consult a healthcare professional before using this medication if you are pregnant, planning to
                        become pregnant, or breastfeeding.
                      </p>
                    </div>

                    <div>
                      <h3 className='mb-2 font-semibold'>Elderly:</h3>
                      <p className='text-muted-foreground'>
                        Older adults may be more sensitive to side effects. Dosage adjustments may be necessary.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Related Products */}
      <div className='mt-16'>
        <h2 className='mb-8 text-2xl font-bold tracking-tight'>Related Products</h2>
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4'>
          {[
            { id: '2', name: 'Ibuprofen 200mg', category: 'Pain Relief', price: 6.99 },
            { id: '3', name: 'Aspirin 300mg', category: 'Pain Relief', price: 4.99 },
            { id: '4', name: 'Paracetamol Syrup', category: 'Pain Relief', price: 7.99 },
            { id: '5', name: 'Cold & Flu Relief', category: 'Cough & Cold', price: 8.99 }
          ].map((relatedMedicine) => (
            <Card key={relatedMedicine.id} className='flex flex-col group hover:shadow-md transition-all'>
              <CardHeader className='pb-3'>
                <CardTitle className='line-clamp-2 text-base'>{relatedMedicine.name}</CardTitle>
                <CardDescription>{relatedMedicine.category}</CardDescription>
              </CardHeader>
              <CardContent className='flex-1'>
                <div className='mb-4 h-20 rounded-md bg-muted flex items-center justify-center'>
                  <Pill className='h-8 w-8 text-gray-400 group-hover:text-primary transition-colors' />
                </div>
                <div className='font-medium text-lg text-primary'>${relatedMedicine.price.toFixed(2)}</div>
              </CardContent>
              <CardFooter className='border-t pt-4'>
                <Button
                  variant='ghost'
                  className='w-full group-hover:bg-primary/10 group-hover:text-primary'
                  onClick={() => navigate(`${path.medicines}/${relatedMedicine.id}`)}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MedicineDetailPage
