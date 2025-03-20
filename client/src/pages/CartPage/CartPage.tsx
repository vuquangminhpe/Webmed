import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Loader2, AlertCircle, Pill } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useCart, useRemoveFromCart, useUpdateCartItem, useClearCart } from '@/hooks/useCart'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import path from '@/constants/path'
import { useState } from 'react'

const CartPage = () => {
  const navigate = useNavigate()
  const { data: cart, isLoading, error } = useCart()
  const removeFromCart = useRemoveFromCart()
  const updateCartItem = useUpdateCartItem()
  const clearCart = useClearCart()

  const [quantities, setQuantities] = useState<Record<string, number>>({})

  // Initialize quantities from cart data when it loads
  useState(() => {
    if (cart?.items) {
      const newQuantities: Record<string, number> = {}
      cart.items.forEach((item) => {
        newQuantities[item.medicine._id] = item.quantity
      })
      setQuantities(newQuantities)
    }
  })

  const handleRemoveItem = (medicineId: string) => {
    removeFromCart.mutate(medicineId)
  }

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart.mutate()
    }
  }

  const handleQuantityChange = (medicineId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setQuantities((prev) => ({
      ...prev,
      [medicineId]: newQuantity
    }))

    // Debounce the API call
    const timeoutId = setTimeout(() => {
      updateCartItem.mutate({ medicineId, quantity: newQuantity })
    }, 500)

    return () => clearTimeout(timeoutId)
  }

  const handleIncrement = (medicineId: string, currentQuantity: number) => {
    handleQuantityChange(medicineId, currentQuantity + 1)
  }

  const handleDecrement = (medicineId: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      handleQuantityChange(medicineId, currentQuantity - 1)
    }
  }

  return (
    <div className='container py-10'>
      <div className='mb-8 flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Shopping Cart</h1>
        <Button variant='outline' onClick={() => navigate(path.medicines)}>
          Continue Shopping
        </Button>
      </div>

      {isLoading ? (
        <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
          <div className='md:col-span-2'>
            <Card>
              <CardHeader>
                <Skeleton className='h-6 w-24' />
              </CardHeader>
              <CardContent className='space-y-4'>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className='flex items-center gap-4 py-3'>
                    <Skeleton className='h-16 w-16 rounded-md' />
                    <div className='flex-1'>
                      <Skeleton className='h-5 w-32 mb-1' />
                      <Skeleton className='h-4 w-20' />
                    </div>
                    <div className='flex items-center gap-2'>
                      <Skeleton className='h-9 w-24' />
                      <Skeleton className='h-9 w-9' />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <Skeleton className='h-6 w-32' />
              </CardHeader>
              <CardContent className='space-y-4'>
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-full' />
              </CardContent>
              <CardFooter>
                <Skeleton className='h-10 w-full' />
              </CardFooter>
            </Card>
          </div>
        </div>
      ) : error ? (
        <Card className='p-6 text-center'>
          <CardContent className='pt-6'>
            <AlertCircle className='mx-auto h-12 w-12 text-destructive' />
            <h2 className='mt-4 text-xl font-semibold'>Error Loading Cart</h2>
            <p className='mt-2 text-muted-foreground'>There was a problem loading your cart. Please try again later.</p>
            <Button className='mt-4' onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : !cart?.items.length ? (
        <Card className='p-6 text-center'>
          <CardContent className='pt-6'>
            <ShoppingCart className='mx-auto h-12 w-12 text-muted-foreground' />
            <h2 className='mt-4 text-xl font-semibold'>Your Cart is Empty</h2>
            <p className='mt-2 text-muted-foreground'>Add some products to your cart and they will appear here</p>
            <Button className='mt-4' onClick={() => navigate(path.medicines)}>
              Browse Products
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
          <div className='md:col-span-2'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between py-4'>
                <CardTitle className='text-xl'>Cart Items ({cart.items.length})</CardTitle>
                <Button variant='ghost' size='sm' onClick={handleClearCart}>
                  <Trash2 className='mr-2 h-4 w-4' />
                  Clear Cart
                </Button>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {cart.items.map((item) => (
                    <div
                      key={item.medicine._id}
                      className='flex flex-col sm:flex-row sm:items-center gap-4 py-4 border-b last:border-0'
                    >
                      <div className='flex items-center gap-4'>
                        <Avatar className='h-16 w-16 rounded-md'>
                          <AvatarFallback className='rounded-md bg-primary/10 text-primary'>
                            <Pill className='h-8 w-8' />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className='font-medium'>{item.medicine.name}</h3>
                          <p className='text-sm text-muted-foreground'>${item.medicine.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className='flex items-center gap-4 mt-4 sm:mt-0 sm:ml-auto'>
                        <div className='flex items-center'>
                          <Button
                            variant='outline'
                            size='icon'
                            className='h-8 w-8 rounded-r-none'
                            onClick={() => handleDecrement(item.medicine._id, item.quantity)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className='h-3 w-3' />
                          </Button>
                          <Input
                            type='number'
                            value={quantities[item.medicine._id] || item.quantity}
                            onChange={(e) => {
                              const value = parseInt(e.target.value)
                              if (!isNaN(value) && value > 0) {
                                handleQuantityChange(item.medicine._id, value)
                              }
                            }}
                            className='h-8 w-14 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                          />
                          <Button
                            variant='outline'
                            size='icon'
                            className='h-8 w-8 rounded-l-none'
                            onClick={() => handleIncrement(item.medicine._id, item.quantity)}
                          >
                            <Plus className='h-3 w-3' />
                          </Button>
                        </div>
                        <div className='ml-4 w-20 text-right font-medium'>
                          ${(item.medicine.price * item.quantity).toFixed(2)}
                        </div>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8 text-destructive'
                          onClick={() => handleRemoveItem(item.medicine._id)}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className='sticky top-4'>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex justify-between'>
                  <span>Subtotal</span>
                  <span>${cart.total.toFixed(2)}</span>
                </div>
                <div className='flex justify-between'>
                  <span>Shipping</span>
                  <span className='text-green-600'>Free</span>
                </div>
                {cart.total > 100 && (
                  <div className='flex justify-between text-green-600'>
                    <span>Discount (10%)</span>
                    <span>-${(cart.total * 0.1).toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className='flex justify-between font-bold'>
                  <span>Total</span>
                  <span>${cart.total > 100 ? (cart.total * 0.9).toFixed(2) : cart.total.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className='w-full'
                  onClick={() => navigate(path.checkout)}
                  disabled={cart.items.length === 0 || updateCartItem.isPending}
                >
                  {updateCartItem.isPending ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Updating...
                    </>
                  ) : (
                    <>
                      Proceed to Checkout <ArrowRight className='ml-2 h-4 w-4' />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

export default CartPage
