import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  ShoppingCart,
  Search,
  Package,
  Truck,
  CheckCircle,
  AlertTriangle,
  Loader2,
  X,
  Eye,
  Calendar
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import { useUserOrders, useCancelOrder } from '@/hooks/useMedicine'
import path from '@/constants/path'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'

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
      return <AlertTriangle className='h-5 w-5 text-yellow-500' />
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

const OrdersPage = () => {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  const { data, isLoading, error } = useUserOrders(currentPage, 10)
  const cancelOrder = useCancelOrder()

  const filteredOrders =
    data?.orders.filter((order) => {
      if (selectedStatus && order.status !== selectedStatus) return false

      if (searchQuery) {
        const orderId = order._id.toLowerCase()
        const query = searchQuery.toLowerCase()
        return orderId.includes(query)
      }

      return true
    }) || []

  const handleCancelOrder = (orderId: string) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      cancelOrder.mutate(orderId, {
        onSuccess: () => {
          toast.success('Order cancelled successfully')
        },
        onError: () => {
          toast.error('Failed to cancel order')
        }
      })
    }
  }

  return (
    <div className='container py-10'>
      <div className='mb-8 flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>My Orders</h1>
        <Button onClick={() => navigate(path.medicines)}>
          <ShoppingCart className='mr-2 h-4 w-4' />
          Continue Shopping
        </Button>
      </div>

      <div className='mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div className='flex flex-1 items-center gap-2'>
          <div className='relative flex-1'>
            <Search className='absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground' />
            <Input
              type='search'
              placeholder='Search orders...'
              className='pl-10'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className='w-40'>
            <Select value={selectedStatus || ''} onValueChange={(value) => setSelectedStatus(value || null)}>
              <SelectTrigger>
                <SelectValue placeholder='Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=''>All Statuses</SelectItem>
                <SelectItem value='pending'>Pending</SelectItem>
                <SelectItem value='processing'>Processing</SelectItem>
                <SelectItem value='shipped'>Shipped</SelectItem>
                <SelectItem value='delivered'>Delivered</SelectItem>
                <SelectItem value='cancelled'>Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className='space-y-4'>
          {[...Array(3)].map((_, index) => (
            <Card key={index} className='w-full overflow-hidden'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 bg-muted/50 px-6 py-4'>
                <div>
                  <Skeleton className='h-4 w-32' />
                  <Skeleton className='mt-2 h-4 w-24' />
                </div>
                <Skeleton className='h-8 w-24' />
              </CardHeader>
              <CardContent className='px-6 py-4'>
                <div className='space-y-4'>
                  <div className='flex items-center gap-3'>
                    <Skeleton className='h-12 w-12 rounded-md' />
                    <div className='flex-1'>
                      <Skeleton className='h-4 w-32' />
                      <Skeleton className='mt-2 h-3 w-24' />
                    </div>
                    <Skeleton className='h-4 w-16' />
                  </div>
                  <div className='flex items-center gap-3'>
                    <Skeleton className='h-12 w-12 rounded-md' />
                    <div className='flex-1'>
                      <Skeleton className='h-4 w-40' />
                      <Skeleton className='mt-2 h-3 w-24' />
                    </div>
                    <Skeleton className='h-4 w-16' />
                  </div>
                </div>
              </CardContent>
              <CardFooter className='border-t px-6 py-4'>
                <div className='flex w-full items-center justify-between'>
                  <Skeleton className='h-5 w-20' />
                  <div className='flex gap-2'>
                    <Skeleton className='h-9 w-24' />
                    <Skeleton className='h-9 w-24' />
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className='border-destructive'>
          <CardHeader>
            <CardTitle className='text-destructive'>Error Loading Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p>There was a problem loading your orders. Please try again later.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardFooter>
        </Card>
      ) : filteredOrders.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className='text-center'>No Orders Found</CardTitle>
          </CardHeader>
          <CardContent className='text-center'>
            <p className='mb-6 text-muted-foreground'>
              {selectedStatus
                ? `You don't have any ${selectedStatus} orders.`
                : searchQuery
                  ? `No orders match "${searchQuery}".`
                  : "You haven't placed any orders yet."}
            </p>
            <Button onClick={() => navigate(path.medicines)}>Start Shopping</Button>
          </CardContent>
        </Card>
      ) : (
        <div className='space-y-4'>
          {filteredOrders.map((order) => (
            <Card key={order._id} className='overflow-hidden transition-all hover:shadow-sm'>
              <CardHeader className='bg-muted/50 px-6 py-4'>
                <div className='flex flex-wrap items-center justify-between gap-4'>
                  <div>
                    <p className='text-sm text-muted-foreground'>
                      Order ID: <span className='font-medium'>{order._id}</span>
                    </p>
                    <div className='flex items-center gap-2 mt-1'>
                      <Calendar className='h-3.5 w-3.5 text-muted-foreground' />
                      <p className='text-sm text-muted-foreground'>
                        Placed on: {format(new Date(order.created_at), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-3'>
                    <Badge variant={getStatusBadgeVariant(order.status)} className='py-1'>
                      {getStatusIcon(order.status)}
                      <span className='ml-1'>{getStatusText(order.status)}</span>
                    </Badge>
                    <Button variant='outline' size='sm' onClick={() => navigate(`${path.orders}/${order._id}`)}>
                      <Eye className='mr-2 h-4 w-4' />
                      Details
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='px-6 py-4'>
                <div className='space-y-4'>
                  {order.medicines.slice(0, 3).map((medicine) => (
                    <div key={medicine.medicine_id} className='flex items-center justify-between gap-4'>
                      <div className='flex items-center gap-3'>
                        <Avatar className='h-12 w-12 rounded-md'>
                          <AvatarFallback className='rounded-md bg-primary/10 text-primary'>
                            <Pill className='h-6 w-6' />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className='font-medium'>{medicine.medicine_details?.name || 'Medication'}</p>
                          <p className='text-sm text-muted-foreground'>Qty: {medicine.quantity}</p>
                        </div>
                      </div>
                      <p className='font-medium'>
                        ${((medicine.medicine_details?.price || 0) * medicine.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}

                  {order.medicines.length > 3 && (
                    <p className='text-sm text-muted-foreground'>+ {order.medicines.length - 3} more item(s)</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className='flex justify-between border-t px-6 py-4'>
                <div>
                  <p className='text-sm font-medium'>Total Amount:</p>
                  <p className='text-lg font-bold'>${order.total_price.toFixed(2)}</p>
                </div>
                <div className='flex gap-2'>
                  {order.status === 'pending' && (
                    <Button
                      variant='destructive'
                      size='sm'
                      onClick={() => handleCancelOrder(order._id)}
                      disabled={cancelOrder.isPending}
                    >
                      {cancelOrder.isPending && cancelOrder.variables === order._id ? (
                        <>
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          Cancelling...
                        </>
                      ) : (
                        'Cancel Order'
                      )}
                    </Button>
                  )}
                  <Button variant='default' size='sm' onClick={() => navigate(`${path.orders}/${order._id}`)}>
                    View Details
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {data?.pagination && data.pagination.totalPages > 1 && (
        <Pagination className='mt-8'>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                aria-disabled={currentPage === 1 || isLoading}
              />
            </PaginationItem>

            {Array.from({ length: Math.min(5, data.pagination.totalPages) }, (_, i) => {
              const pageToShow =
                currentPage <= 3
                  ? i + 1
                  : currentPage >= data.pagination.totalPages - 2
                    ? data.pagination.totalPages - 4 + i
                    : currentPage - 2 + i

              return pageToShow > 0 && pageToShow <= data.pagination.totalPages ? (
                <PaginationItem key={pageToShow}>
                  <PaginationLink isActive={currentPage === pageToShow} onClick={() => setCurrentPage(pageToShow)}>
                    {pageToShow}
                  </PaginationLink>
                </PaginationItem>
              ) : null
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, data.pagination.totalPages))}
                aria-disabled={currentPage === data.pagination.totalPages || isLoading}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}

export default OrdersPage
