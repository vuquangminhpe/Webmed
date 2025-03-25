import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  X,
  Map,
  CreditCard,
  Calendar,
  Loader2,
  AlertCircle,
  Download,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useOrder, useCancelOrder } from '@/hooks/useMedicine'
import path from '@/constants/path'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { useState, useEffect } from 'react'

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Package className='h-5 w-5 text-yellow-500' />
    case 'processing':
      return <Truck className='h-5 w-5 text-blue-500' />
    case 'shipped':
      return <Truck className='h-5 w-5 text-indigo-500' />
    case 'delivered':
      return <CheckCircle className='h-5 w-5 text-green-500' />
    case 'cancelled':
      return <X className='h-5 w-5 text-red-500' />
    default:
      return <AlertCircle className='h-5 w-5 text-yellow-500' />
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Pending'
    case 'processing':
      return 'Processing'
    case 'shipped':
      return 'Shipped'
    case 'delivered':
      return 'Delivered'
    case 'cancelled':
      return 'Cancelled'
    default:
      return 'Unknown'
  }
}

const getStatusBadgeVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case 'pending':
      return 'outline'
    case 'processing':
      return 'secondary'
    case 'shipped':
      return 'default'
    case 'delivered':
      return 'default'
    case 'cancelled':
      return 'destructive'
    default:
      return 'outline'
  }
}

const getPaymentMethodText = (method: string) => {
  switch (method) {
    case 'cash':
      return 'Cash on Delivery'
    case 'card':
      return 'Credit/Debit Card'
    case 'insurance':
      return 'Insurance'
    default:
      return 'Unknown'
  }
}

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const cancelOrder = useCancelOrder()
  const [isCancelling, setIsCancelling] = useState(false)

  // Important: Don't use early returns before this hook
  const { data: order, isLoading, error, refetch } = useOrder(id || '')

  // Add a manual refetch on component mount to ensure data is loaded
  useEffect(() => {
    if (id) {
      refetch()
    }
  }, [id, refetch])

  const handleCancelOrder = () => {
    if (!order || order.status !== 'pending') return

    setIsCancelling(true)
    if (window.confirm('Are you sure you want to cancel this order?')) {
      cancelOrder.mutate(order._id, {
        onSuccess: () => {
          toast.success('Order cancelled successfully')
          setIsCancelling(false)
        },
        onError: () => {
          toast.error('Failed to cancel order')
          setIsCancelling(false)
        }
      })
    } else {
      setIsCancelling(false)
    }
  }

  // Show loading state while the order is being fetched
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

  // This is the most important change - we'll only show the error UI if there was
  // a very specific error AND we don't have order data
  if (error && !order) {
    return (
      <div className='container py-10'>
        <div className='flex items-center gap-2'>
          <Button variant='ghost' size='icon' onClick={() => navigate(path.orders)}>
            <ArrowLeft className='h-5 w-5' />
          </Button>
          <h1 className='text-2xl font-bold'>Error Loading Order</h1>
        </div>

        <div className='mt-8 flex flex-col items-center justify-center rounded-lg border border-destructive p-8 text-center text-destructive'>
          <AlertCircle className='mb-2 h-10 w-10' />
          <h3 className='mb-2 text-lg font-semibold'>Failed to Load Order Details</h3>
          <p>
            There was an error loading the order information. Please try again later or return to{' '}
            <button className='font-medium underline' onClick={() => navigate(path.orders)}>
              Your Orders
            </button>
            .
          </p>
          <Button variant='outline' className='mt-4' onClick={() => window.location.reload()}>
            <RefreshCw className='mr-2 h-4 w-4' />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  // Extract the actual order data from the nested structure if it exists
  const orderData = order

  // Only show "not found" if we truly don't have data after checking all possible structures
  if (!orderData) {
    return (
      <div className='container py-10'>
        <div className='flex items-center gap-2'>
          <Button variant='ghost' size='icon' onClick={() => navigate(path.orders)}>
            <ArrowLeft className='h-5 w-5' />
          </Button>
          <h1 className='text-2xl font-bold'>Order Not Found</h1>
        </div>

        <div className='mt-8 flex flex-col items-center justify-center rounded-lg border p-8 text-center'>
          <Package className='mb-2 h-10 w-10 text-muted-foreground' />
          <h3 className='mb-2 text-lg font-semibold'>Order Not Found</h3>
          <p className='text-muted-foreground'>
            We couldn't find the order you're looking for. It may have been removed or the ID is incorrect.
          </p>
          <Button variant='outline' className='mt-4' onClick={() => navigate(path.orders)}>
            View All Orders
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='container py-10'>
      <div className='flex items-center gap-2'>
        <Button variant='ghost' size='icon' onClick={() => navigate(path.orders)}>
          <ArrowLeft className='h-5 w-5' />
        </Button>
        <h1 className='text-2xl font-bold'>Order Details</h1>
      </div>

      <div className='mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3'>
        <div className='lg:col-span-2'>
          <Card>
            <CardHeader className='flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0'>
              <div>
                <CardTitle>Order #{orderData._id}</CardTitle>
                <CardDescription>Placed on {format(new Date(orderData.created_at), 'MMMM dd, yyyy')}</CardDescription>
              </div>
              <Badge variant={getStatusBadgeVariant(orderData.status)} className='w-fit'>
                {getStatusIcon(orderData.status)}
                <span className='ml-1'>{getStatusText(orderData.status)}</span>
              </Badge>
            </CardHeader>
            <CardContent>
              <div className='space-y-6'>
                <div>
                  <h3 className='mb-3 font-medium'>Order Items</h3>
                  <div className='rounded-md border'>
                    {orderData.medicines.map((medicine, index) => (
                      <div
                        key={medicine.medicine_id}
                        className='flex items-center justify-between border-b p-4 last:border-0'
                      >
                        <div className='flex items-center gap-4'>
                          <div className='h-16 w-16 rounded-md bg-muted'></div>
                          <div>
                            <h4 className='font-medium'>
                              {medicine.medicine_details?.name || `Medicine #${index + 1}`}
                            </h4>
                            <p className='text-sm text-muted-foreground'>
                              {medicine.medicine_details?.dosage || 'Standard dosage'}
                            </p>
                          </div>
                        </div>
                        <div className='text-right'>
                          <p className='font-medium'>
                            ${medicine.medicine_details?.price.toFixed(2) || '0.00'} x {medicine.quantity}
                          </p>
                          <p className='font-bold'>
                            ${((medicine.medicine_details?.price || 0) * medicine.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className='flex items-center justify-between'>
                  <h3 className='font-medium'>Subtotal</h3>
                  <p className='font-medium'>${orderData.total_price.toFixed(2)}</p>
                </div>

                <div className='flex items-center justify-between'>
                  <h3 className='font-medium'>Shipping</h3>
                  <p className='font-medium'>Free</p>
                </div>

                <Separator />

                <div className='flex items-center justify-between'>
                  <h3 className='text-lg font-bold'>Total</h3>
                  <p className='text-lg font-bold'>${orderData.total_price.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className='justify-end gap-4'>
              {orderData.status === 'pending' && (
                <Button
                  variant='destructive'
                  onClick={handleCancelOrder}
                  disabled={isCancelling || cancelOrder.isPending}
                >
                  {isCancelling || cancelOrder.isPending ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <X className='mr-2 h-4 w-4' />
                      Cancel Order
                    </>
                  )}
                </Button>
              )}
              <Button variant='outline'>
                <Download className='mr-2 h-4 w-4' />
                Download Invoice
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-start gap-2'>
                <Map className='mt-0.5 h-4 w-4 text-muted-foreground' />
                <div>
                  <p className='font-medium'>Delivery Address</p>
                  <p className='text-muted-foreground'>{orderData.shipping_address}</p>
                </div>
              </div>

              {orderData.status !== 'cancelled' && (
                <div className='rounded-md border p-4'>
                  <h4 className='mb-2 font-medium'>Estimated Delivery</h4>
                  <p>
                    {orderData.status === 'delivered'
                      ? 'Your order has been delivered'
                      : orderData.status === 'shipped'
                        ? 'Your order is on the way'
                        : 'Within 3-5 business days'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-start gap-2'>
                <CreditCard className='mt-0.5 h-4 w-4 text-muted-foreground' />
                <div>
                  <p className='font-medium'>Payment Method</p>
                  <p className='text-muted-foreground'>{getPaymentMethodText(orderData.payment_method)}</p>
                </div>
              </div>

              <div className='flex items-start gap-2'>
                <Calendar className='mt-0.5 h-4 w-4 text-muted-foreground' />
                <div>
                  <p className='font-medium'>Payment Date</p>
                  <p className='text-muted-foreground'>{format(new Date(orderData.created_at), 'MMMM dd, yyyy')}</p>
                </div>
              </div>

              <div className='rounded-md border p-4'>
                <h4 className='mb-2 font-medium'>Payment Status</h4>
                <p className='flex items-center'>
                  <CheckCircle className='mr-2 h-4 w-4 text-green-500' />
                  Paid
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p className='text-muted-foreground'>
                If you have any questions or concerns about your order, our customer service team is here to help.
              </p>
              <Button className='w-full' variant='outline' onClick={() => navigate('/help')}>
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailPage
