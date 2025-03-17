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

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Package className="h-5 w-5 text-yellow-500" />
    case 'processing':
      return <Truck className="h-5 w-5 text-blue-500" />
    case 'shipped':
      return <Truck className="h-5 w-5 text-indigo-500" />
    case 'delivered':
      return <CheckCircle className="h-5 w-5 text-green-500" />
    case 'cancelled':
      return <X className="h-5 w-5 text-red-500" />
    default:
      return <AlertCircle className="h-5 w-5 text-yellow-500" />
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
  const { data: order, isLoading, error } = useOrder(id || '')
  const cancelOrder = useCancelOrder()

  const handleCancelOrder = () => {
    if (!order || order.status !== 'pending') return

    if (window.confirm('Are you sure you want to cancel this order?')) {
      cancelOrder.mutate(order._id, {
        onSuccess: () => {
          toast.success('Order cancelled successfully')
        },
        onError: () => {
          toast.error('Failed to cancel order')
        }
      })
    }
  }

  if (isLoading) {
    return (
      <div className="container flex h-[calc(100vh-200px)] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Loading order details...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="container py-10">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(path.orders)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Error Loading Order</h1>
        </div>
        
        <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-destructive p-8 text-center text-destructive">
          <AlertCircle className="mb-2 h-10 w-10" />
          <h3 className="mb-2 text-lg font-semibold">Failed to Load Order Details</h3>
          <p>
            There was an error loading the order information. Please try again later or return to{' '}
            <button className="font-medium underline" onClick={() => navigate(path.orders)}>
              Your Orders
            </button>
            .
          </p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(path.orders)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Order Details</h1>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div>
                <CardTitle>Order #{order._id}</CardTitle>
                <CardDescription>
                  Placed on {format(new Date(order.created_at), 'MMMM dd, yyyy')}
                </CardDescription>
              </div>
              <Badge variant={getStatusBadgeVariant(order.status)} className="w-fit">
                {getStatusIcon(order.status)}
                <span className="ml-1">{getStatusText(order.status)}</span>
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 font-medium">Order Items</h3>
                  <div className="rounded-md border">
                    {order.medicines.map((medicine, index) => (
                      <div key={medicine.medicine_id} className="flex items-center justify-between border-b p-4 last:border-0">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 rounded-md bg-muted"></div>
                          <div>
                            <h4 className="font-medium">
                              {medicine.medicine_details?.name || `Medicine #${index + 1}`}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {medicine.medicine_details?.dosage || 'Standard dosage'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            ${medicine.medicine_details?.price.toFixed(2) || '0.00'} x {medicine.quantity}
                          </p>
                          <p className="font-bold">
                            ${((medicine.medicine_details?.price || 0) * medicine.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Subtotal</h3>
                  <p className="font-medium">${order.total_price.toFixed(2)}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Shipping</h3>
                  <p className="font-medium">Free</p>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Total</h3>
                  <p className="text-lg font-bold">${order.total_price.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-end gap-4">
              {order.status === 'pending' && (
                <Button 
                  variant="destructive" 
                  onClick={handleCancelOrder}
                  disabled={cancelOrder.isPending}
                >
                  {cancelOrder.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <X className="mr-2 h-4 w-4" />
                      Cancel Order
                    </>
                  )}
                </Button>
              )}
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download Invoice
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2">
                <Map className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Delivery Address</p>
                  <p className="text-muted-foreground">{order.shipping_address}</p>
                </div>
              </div>
              
              {order.status !== 'cancelled' && (
                <div className="rounded-md border p-4">
                  <h4 className="mb-2 font-medium">Estimated Delivery</h4>
                  <p>
                    {order.status === 'delivered'
                      ? 'Your order has been delivered'
                      : order.status === 'shipped'
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
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2">
                <CreditCard className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Payment Method</p>
                  <p className="text-muted-foreground">
                    {getPaymentMethodText(order.payment_method)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Payment Date</p>
                  <p className="text-muted-foreground">
                    {format(new Date(order.created_at), 'MMMM dd, yyyy')}
                  </p>
                </div>
              </div>
              
              <div className="rounded-md border p-4">
                <h4 className="mb-2 font-medium">Payment Status</h4>
                <p className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Paid
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                If you have any questions or concerns about your order, our customer service team is here to help.
              </p>
              <Button className="w-full" variant="outline" onClick={() => navigate('/help')}>
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