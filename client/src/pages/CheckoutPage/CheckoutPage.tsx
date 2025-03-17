import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, ShoppingCart, MapPin, CreditCard, Info, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useCreateOrder } from '@/hooks/useMedicine'
import path from '@/constants/path'
import { toast } from 'sonner'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

const mockCartItems = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    price: 8.99,
    quantity: 2,
    image: ''
  },
  {
    id: '2',
    name: 'Ibuprofen 200mg',
    price: 6.99,
    quantity: 1,
    image: ''
  },
  {
    id: '3',
    name: 'Vitamin C 1000mg',
    price: 12.99,
    quantity: 1,
    image: ''
  }
]

const formSchema = z.object({
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(5, 'ZIP code is required'),
  phoneNumber: z.string().min(10, 'Please enter a valid phone number'),
  paymentMethod: z.enum(['cash', 'card', 'insurance']),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCVC: z.string().optional(),
  insuranceProvider: z.string().optional(),
  insuranceNumber: z.string().optional(),
  notes: z.string().optional()
})

type CheckoutFormValues = z.infer<typeof formSchema>

const CheckoutPage = () => {
  const navigate = useNavigate()
  const createOrder = useCreateOrder()
  const [isProcessing, setIsProcessing] = useState(false)

  // Calculate totals
  const subtotal = mockCartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const shippingFee = 0 // Free shipping
  const total = subtotal + shippingFee

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: '',
      city: '',
      state: '',
      zipCode: '',
      phoneNumber: '',
      paymentMethod: 'cash',
      notes: ''
    }
  })

  const watchPaymentMethod = form.watch('paymentMethod')

  const onSubmit = (data: CheckoutFormValues) => {
    setIsProcessing(true)

    // Create complete shipping address
    const shippingAddress = `${data.address}, ${data.city}, ${data.state} ${data.zipCode}`

    // Format order data
    const orderData = {
      medicines: mockCartItems.map((item) => ({ medicine_id: item.id, quantity: item.quantity })),
      shipping_address: shippingAddress,
      payment_method: data.paymentMethod
    }

    // Submit order
    createOrder.mutate(orderData, {
      onError: () => {
        toast.error('There was an error processing your order')
        setIsProcessing(false)
      }
    })
  }

  return (
    <div className='container py-10'>
      <div className='flex flex-col items-center space-y-2 text-center'>
        <ShoppingCart className='h-12 w-12 text-primary' />
        <h1 className='text-3xl font-bold'>Checkout</h1>
        <p className='text-muted-foreground'>Complete your order to get your medications delivered.</p>
      </div>

      <div className='mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3'>
        <div className='lg:col-span-2'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <MapPin className='h-5 w-5 text-primary' />
                    Shipping Information
                  </CardTitle>
                  <CardDescription>Enter your address where you want your order delivered.</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='address'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder='Street address, apartment, suite, unit, etc.' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
                    <FormField
                      control={form.control}
                      name='city'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder='City' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='state'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input placeholder='State' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='zipCode'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ZIP Code</FormLabel>
                          <FormControl>
                            <Input placeholder='ZIP Code' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name='phoneNumber'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input type='tel' placeholder='For delivery notifications' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <CreditCard className='h-5 w-5 text-primary' />
                    Payment Method
                  </CardTitle>
                  <CardDescription>Select how you would like to pay for your order.</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='paymentMethod'
                    render={({ field }) => (
                      <FormItem className='space-y-3'>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className='space-y-3'>
                            <FormItem className='flex items-center space-x-3 space-y-0'>
                              <FormControl>
                                <RadioGroupItem value='cash' />
                              </FormControl>
                              <FormLabel className='font-normal'>Cash on Delivery</FormLabel>
                            </FormItem>
                            <FormItem className='flex items-center space-x-3 space-y-0'>
                              <FormControl>
                                <RadioGroupItem value='card' />
                              </FormControl>
                              <FormLabel className='font-normal'>Credit/Debit Card</FormLabel>
                            </FormItem>
                            <FormItem className='flex items-center space-x-3 space-y-0'>
                              <FormControl>
                                <RadioGroupItem value='insurance' />
                              </FormControl>
                              <FormLabel className='font-normal'>Insurance</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {watchPaymentMethod === 'card' && (
                    <div className='space-y-4 rounded-md border p-4'>
                      <FormField
                        control={form.control}
                        name='cardNumber'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Card Number</FormLabel>
                            <FormControl>
                              <Input placeholder='1234 5678 9012 3456' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className='grid grid-cols-2 gap-4'>
                        <FormField
                          control={form.control}
                          name='cardExpiry'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Expiry Date</FormLabel>
                              <FormControl>
                                <Input placeholder='MM/YY' {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name='cardCVC'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CVC</FormLabel>
                              <FormControl>
                                <Input placeholder='123' {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {watchPaymentMethod === 'insurance' && (
                    <div className='space-y-4 rounded-md border p-4'>
                      <FormField
                        control={form.control}
                        name='insuranceProvider'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Insurance Provider</FormLabel>
                            <FormControl>
                              <Input placeholder='Provider name' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='insuranceNumber'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Insurance Policy Number</FormLabel>
                            <FormControl>
                              <Input placeholder='Policy number' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Alert>
                        <Info className='h-4 w-4' />
                        <AlertTitle>Insurance Coverage Verification</AlertTitle>
                        <AlertDescription>
                          Our team will verify coverage with your provider before processing your order. Additional
                          payment may be required if not fully covered.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name='notes'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Order Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='Special delivery instructions or additional information'
                            className='min-h-[100px]'
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          E.g., delivery time preferences, building access information, etc.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <div className='flex justify-between'>
                <Button type='button' variant='outline' onClick={() => navigate(path.medicines)}>
                  Continue Shopping
                </Button>
                <Button type='submit' disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className='mr-2 h-4 w-4' />
                      Complete Order
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        <div>
          <Card className='sticky top-20'>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='max-h-[300px] overflow-auto'>
                {mockCartItems.map((item) => (
                  <div key={item.id} className='flex items-center gap-4 py-2'>
                    <div className='h-12 w-12 rounded-md bg-muted'></div>
                    <div className='flex-1'>
                      <p className='font-medium'>{item.name}</p>
                      <p className='text-sm text-muted-foreground'>Qty: {item.quantity}</p>
                    </div>
                    <p className='font-medium'>${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <Separator />

              <div className='space-y-2'>
                <div className='flex justify-between'>
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className='flex justify-between'>
                  <span>Shipping</span>
                  <span>{shippingFee === 0 ? 'Free' : `$${(shippingFee as number).toFixed(2)}`}</span>
                </div>
                <Separator />
                <div className='flex justify-between text-lg font-bold'>
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <Alert className='mt-4'>
                <Info className='h-4 w-4' />
                <AlertTitle>Prescription Required</AlertTitle>
                <AlertDescription>
                  Some medications in your cart may require a valid prescription. Our pharmacist will contact you if
                  needed.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
