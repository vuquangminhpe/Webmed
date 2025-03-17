import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle, Package, Clock, Calendar, Pill, ChevronRight, Loader2, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { useOrder } from '@/hooks/useMedicine'
import { format } from 'date-fns'
import path from '@/constants/path'

const PaymentSuccessPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('orderId')

  const { data: order, isLoading, error } = useOrder(orderId || '')
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    if (!orderId) {
      const timer = setTimeout(() => {
        navigate(path.orders)
      }, 3000)

      return () => clearTimeout(timer)
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          navigate(path.orders)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [navigate, orderId])

  if (!orderId) {
    return (
      <div className='container flex h-[calc(100vh-200px)] flex-col items-center justify-center'>
        <div className='mx-auto max-w-md text-center'>
          <div className='mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mx-auto'>
            <CheckCircle className='h-10 w-10 text-green-600' />
          </div>
          <h1 className='text-2xl font-bold'>Payment Successful!</h1>
          <p className='mt-2 text-muted-foreground'>
            Your order has been placed successfully. Redirecting to your orders page...
          </p>
          <div className='mt-6 flex justify-center space-x-4'>
            <Button onClick={() => navigate(path.orders)}>View Orders</Button>
            <Button variant='outline' onClick={() => navigate(path.medicines)}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className='container flex h-[calc(100vh-200px)] items-center justify-center'>
        <div className='flex flex-col items-center gap-2'>
          <Loader2 className='h-8 w-8 animate-spin text-primary' />
          <p>Loading order details...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className='container py-10'>
        <div className='mx-auto max-w-md space-y-4 text-center'>
          <div className='relative mx-auto h-20 w-20'>
            <div className='absolute inset-0 flex items-center justify-center rounded-full bg-green-100'>
              <CheckCircle className='h-10 w-10 text-green-600' />
            </div>
          </div>
          <h1 className='text-2xl font-bold'>Payment Successful!</h1>
          <p className='text-muted-foreground'>
            Your order has been placed successfully, but we couldn't load the details right now.
          </p>
          <Alert variant='destructive'>
            <AlertTitle>Error loading order details</AlertTitle>
            <AlertDescription>
              Don't worry, your order was processed. You can view all your orders in the orders page.
            </AlertDescription>
          </Alert>
          <div className='flex justify-center space-x-4'>
            <Button onClick={() => navigate(path.orders)}>View Orders</Button>
            <Button variant='outline' onClick={() => navigate(path.medicines)}>
              Continue Shopping
            </Button>
          </div>
          <p className='text-sm text-muted-foreground'>Redirecting to orders page in {countdown} seconds...</p>
        </div>
      </div>
    )
  }

  const orderDate = new Date(order.created_at)
  const minDeliveryDate = new Date(orderDate)
  minDeliveryDate.setDate(orderDate.getDate() + 5)
  const maxDeliveryDate = new Date(orderDate)
  maxDeliveryDate.setDate(orderDate.getDate() + 7)

  return (
    <div className='container py-10'>
      <div className='mx-auto max-w-3xl space-y-8'>
        <div className='flex flex-col items-center space-y-4 text-center'>
          <div className='relative h-24 w-24'>
            <div className='absolute inset-0 flex items-center justify-center rounded-full bg-green-100'>
              <CheckCircle className='h-12 w-12 text-green-600' />
            </div>
          </div>
          <div>
            <h1 className='text-3xl font-bold'>Order Confirmed!</h1>
            <p className='mt-2 text-muted-foreground'>
              Thank you for your order. Your payment was successful and your order is being processed.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader className='pb-2'>
            <div className='flex items-center justify-between'>
              <div>
                <CardTitle>Order #{order._id}</CardTitle>
                <CardDescription>Placed on {format(new Date(order.created_at), 'MMMM dd, yyyy')}</CardDescription>
              </div>
              <Button variant='outline' onClick={() => navigate(`${path.orders}/${order._id}`)}>
                Order Details
              </Button>
            </div>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              <div className='flex flex-col items-center rounded-lg border p-4 text-center'>
                <Package className='mb-2 h-8 w-8 text-primary' />
                <h3 className='font-medium'>Order Status</h3>
                <p className='text-muted-foreground'>Processing</p>
              </div>

              <div className='flex flex-col items-center rounded-lg border p-4 text-center'>
                <Clock className='mb-2 h-8 w-8 text-primary' />
                <h3 className='font-medium'>Estimated Delivery</h3>
                <p className='text-muted-foreground'>
                  {format(minDeliveryDate, 'MMM dd')} - {format(maxDeliveryDate, 'MMM dd')}
                </p>
              </div>

              <div className='flex flex-col items-center rounded-lg border p-4 text-center'>
                <Calendar className='mb-2 h-8 w-8 text-primary' />
                <h3 className='font-medium'>Payment Method</h3>
                <p className='text-muted-foreground capitalize'>{order.payment_method}</p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className='mb-3 font-medium'>Order Summary</h3>
              <div className='space-y-3'>
                {order.medicines.slice(0, 3).map((medicine) => (
                  <div key={medicine.medicine_id} className='flex items-center space-x-4'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-md bg-muted'>
                      <Pill className='h-6 w-6 text-muted-foreground' />
                    </div>
                    <div className='flex-1'>
                      <p className='font-medium'>{medicine.medicine_details?.name || 'Medication'}</p>
                      <p className='text-sm text-muted-foreground'>
                        Qty: {medicine.quantity} x ${medicine.medicine_details?.price.toFixed(2) || '0.00'}
                      </p>
                    </div>
                  </div>
                ))}

                {order.medicines.length > 3 && (
                  <p className='text-sm text-muted-foreground'>+ {order.medicines.length - 3} more items</p>
                )}
              </div>

              <div className='mt-4 flex justify-between'>
                <span className='font-medium'>Total</span>
                <span className='font-bold'>${order.total_price.toFixed(2)}</span>
              </div>
            </div>

            <Alert>
              <Info className='h-4 w-4' />
              <AlertTitle>Shipping to:</AlertTitle>
              <AlertDescription>{order.shipping_address}</AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className='flex flex-col space-y-4'>
            <div className='w-full text-center text-sm text-muted-foreground'>
              A confirmation email has been sent to your registered email address.
            </div>

            <div className='flex w-full flex-col justify-between gap-4 sm:flex-row'>
              <Button variant='outline' onClick={() => navigate(path.medicines)}>
                Continue Shopping
              </Button>
              <Button onClick={() => navigate(path.orders)}>
                View All Orders <ChevronRight className='ml-2 h-4 w-4' />
              </Button>
            </div>

            <p className='text-center text-sm text-muted-foreground'>
              Redirecting to orders page in {countdown} seconds...
            </p>
          </CardFooter>
        </Card>

        <div className='rounded-lg bg-muted p-6'>
          <h2 className='mb-4 text-xl font-semibold'>What's Next?</h2>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='space-y-2'>
              <h3 className='font-medium'>Order Processing</h3>
              <p className='text-sm text-muted-foreground'>
                Our pharmacy team will review your order and prepare your medications. If any prescriptions are
                required, our team will contact you.
              </p>
            </div>

            <div className='space-y-2'>
              <h3 className='font-medium'>Delivery</h3>
              <p className='text-sm text-muted-foreground'>
                Your medications will be carefully packaged and shipped to your address. You'll receive tracking
                information via email once your order is dispatched.
              </p>
            </div>

            <div className='space-y-2'>
              <h3 className='font-medium'>Need Help?</h3>
              <p className='text-sm text-muted-foreground'>
                If you have any questions about your order, please contact our customer support team at
                support@webmed.com or call us at (555) 123-4567.
              </p>
            </div>

            <div className='space-y-2'>
              <h3 className='font-medium'>Medication Guidance</h3>
              <p className='text-sm text-muted-foreground'>
                For information about your medications, dosage instructions, or potential side effects, please visit our
                Medications section or consult with one of our healthcare professionals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccessPage
