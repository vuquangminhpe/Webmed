/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// client/src/pages/MedicinesPage/MedicinesPage.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Pill, Search, Filter, ArrowRight, ShoppingCart, AlertCircle, Heart, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import path from '@/constants/path'
import { toast } from 'sonner'
import medicineApi from '@/apis/medicine.api'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAddToCart } from '@/hooks/useCart' // Import the useAddToCart hook
import { Label } from '@/Components/ui/label'

interface FilterState {
  categories: string[]
  priceRange: string[]
  prescription: string[]
}

const MedicinesPage = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortOption, setSortOption] = useState('name')
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [],
    prescription: []
  })

  // Use the proper hook
  const addToCart = useAddToCart()

  // Generate query parameters based on current filters
  const getQueryParams = () => {
    const queryParams: Record<string, any> = {
      page: currentPage,
      limit: 9,
      search: searchQuery
    }

    if (sortOption) {
      queryParams.sort = sortOption
    }

    if (filters.categories.length > 0) {
      queryParams.category = filters.categories.join(',')
    }

    if (filters.priceRange.length > 0) {
      // Example: transform 'price-0-10' to min=0&max=10
      const priceRanges = filters.priceRange.map((range) => {
        const [_, min, max] = range.split('-')
        return { min, max }
      })

      const minPrice = Math.min(...priceRanges.map((r) => Number(r.min)))
      const maxPrice = Math.max(...priceRanges.map((r) => Number(r.max === '100+' ? '1000' : r.max)))

      queryParams.minPrice = minPrice
      queryParams.maxPrice = maxPrice === 1000 ? undefined : maxPrice
    }

    if (filters.prescription.length > 0) {
      queryParams.requiresPrescription = filters.prescription.includes('prescription-required')
    }

    return queryParams
  }

  // Fetch medicines with the current filters
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['medicines', currentPage, searchQuery, sortOption, filters],
    queryFn: () => {
      const params = getQueryParams()
      return medicineApi.getMedicines(params.page, params.limit, params as any)
    }
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    refetch()
  }

  const toggleCategoryFilter = (categoryId: string) => {
    setFilters((prev) => {
      const categories = prev.categories.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId)
        : [...prev.categories, categoryId]

      return { ...prev, categories }
    })
  }

  const togglePriceFilter = (priceRange: string) => {
    setFilters((prev) => {
      const priceRanges = prev.priceRange.includes(priceRange)
        ? prev.priceRange.filter((range) => range !== priceRange)
        : [...prev.priceRange, priceRange]

      return { ...prev, priceRange: priceRanges }
    })
  }

  const togglePrescriptionFilter = (prescriptionType: string) => {
    setFilters((prev) => {
      const prescription = prev.prescription.includes(prescriptionType)
        ? prev.prescription.filter((type) => type !== prescriptionType)
        : [...prev.prescription, prescriptionType]

      return { ...prev, prescription }
    })
  }

  const handleAddToCart = (medicineId: string, requiresPrescription: boolean) => {
    if (requiresPrescription) {
      toast.error('This medication requires a prescription')
      return
    }

    // Use the proper addToCart hook
    addToCart.mutate({ medicineId, quantity: 1 })
  }

  const handleResetFilters = () => {
    setFilters({
      categories: [],
      priceRange: [],
      prescription: []
    })
    setSearchQuery('')
    setSortOption('name')
    setCurrentPage(1)
  }

  const handleApplyFilters = () => {
    setCurrentPage(1)
    refetch()
  }

  const categoryFilters = [
    { id: 'pain-relief', label: 'Pain Relief' },
    { id: 'allergy', label: 'Allergy & Sinus' },
    { id: 'cough-cold', label: 'Cough & Cold' },
    { id: 'digestion', label: 'Digestion & Nausea' },
    { id: 'diabetes', label: 'Diabetes Care' },
    { id: 'first-aid', label: 'First Aid' },
    { id: 'vitamins', label: 'Vitamins & Supplements' }
  ]

  return (
    <div className='container px-4 py-8 md:py-12'>
      {/* Header with improved styling */}
      <div className='flex flex-col items-center justify-center space-y-4 text-center mb-12'>
        <div className='flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-primary/80 to-primary'>
          <Pill className='h-10 w-10 text-white' />
        </div>
        <h1 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent'>
          Drugs & Supplements
        </h1>
        <p className='mx-auto max-w-[700px] text-muted-foreground md:text-xl'>
          Browse and order medications, vitamins, and wellness products.
        </p>
      </div>

      {/* Search and Sort */}
      <div className='mt-8 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 bg-muted/30 p-4 rounded-lg'>
        <form onSubmit={handleSearch} className='flex items-center space-x-2 md:w-1/2'>
          <div className='relative flex-1'>
            <Search className='absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground' />
            <Input
              type='search'
              placeholder='Search medications...'
              className='pl-10 bg-white'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type='submit' variant='default'>
            Search
          </Button>
        </form>

        <div className='flex items-center space-x-2'>
          <span className='text-sm text-muted-foreground'>Sort by:</span>
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className='w-[180px] bg-white'>
              <SelectValue placeholder='Sort by' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='name'>Name (A-Z)</SelectItem>
              <SelectItem value='-name'>Name (Z-A)</SelectItem>
              <SelectItem value='price'>Price: Low to High</SelectItem>
              <SelectItem value='-price'>Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='mt-8 flex flex-col lg:flex-row lg:space-x-8'>
        {/* Filters */}
        <div className='mb-8 rounded-lg border shadow-sm p-4 lg:mb-0 lg:w-1/4 lg:sticky lg:top-20 lg:self-start'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-lg font-semibold flex items-center'>
              <Filter className='h-4 w-4 mr-2 text-primary' />
              Filters
            </h2>

            <Button variant='ghost' size='sm' onClick={handleResetFilters} className='text-xs h-8'>
              Reset All
            </Button>
          </div>

          <div className='space-y-6'>
            <div>
              <h3 className='mb-3 font-medium text-sm text-muted-foreground'>CATEGORIES</h3>
              <div className='space-y-2'>
                {categoryFilters.map((filter) => (
                  <div key={filter.id} className='flex items-center space-x-2'>
                    <Checkbox
                      id={filter.id}
                      checked={filters.categories.includes(filter.id)}
                      onCheckedChange={() => toggleCategoryFilter(filter.id)}
                    />
                    <Label htmlFor={filter.id} className='text-sm font-normal'>
                      {filter.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className='mb-3 font-medium text-sm text-muted-foreground'>PRICE RANGE</h3>
              <div className='space-y-2'>
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='price-0-10'
                    checked={filters.priceRange.includes('price-0-10')}
                    onCheckedChange={() => togglePriceFilter('price-0-10')}
                  />
                  <Label htmlFor='price-0-10' className='text-sm font-normal'>
                    $0 - $10
                  </Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='price-10-25'
                    checked={filters.priceRange.includes('price-10-25')}
                    onCheckedChange={() => togglePriceFilter('price-10-25')}
                  />
                  <Label htmlFor='price-10-25' className='text-sm font-normal'>
                    $10 - $25
                  </Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='price-25-50'
                    checked={filters.priceRange.includes('price-25-50')}
                    onCheckedChange={() => togglePriceFilter('price-25-50')}
                  />
                  <Label htmlFor='price-25-50' className='text-sm font-normal'>
                    $25 - $50
                  </Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='price-50-100'
                    checked={filters.priceRange.includes('price-50-100')}
                    onCheckedChange={() => togglePriceFilter('price-50-100')}
                  />
                  <Label htmlFor='price-50-100' className='text-sm font-normal'>
                    $50 - $100
                  </Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='price-100+'
                    checked={filters.priceRange.includes('price-100+')}
                    onCheckedChange={() => togglePriceFilter('price-100+')}
                  />
                  <Label htmlFor='price-100+' className='text-sm font-normal'>
                    $100+
                  </Label>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className='mb-3 font-medium text-sm text-muted-foreground'>PRESCRIPTION TYPE</h3>
              <div className='space-y-2'>
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='prescription-required'
                    checked={filters.prescription.includes('prescription-required')}
                    onCheckedChange={() => togglePrescriptionFilter('prescription-required')}
                  />
                  <Label htmlFor='prescription-required' className='text-sm font-normal'>
                    Prescription Required
                  </Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='over-the-counter'
                    checked={filters.prescription.includes('over-the-counter')}
                    onCheckedChange={() => togglePrescriptionFilter('over-the-counter')}
                  />
                  <Label htmlFor='over-the-counter' className='text-sm font-normal'>
                    Over-the-Counter
                  </Label>
                </div>
              </div>
            </div>

            <Separator />

            <Button className='w-full' onClick={handleApplyFilters}>
              Apply Filters
            </Button>
          </div>
        </div>

        {/* Medicine Cards */}
        <div className='flex-1'>
          {isLoading ? (
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              {[...Array(6)].map((_, index) => (
                <Card key={index} className='flex flex-col h-[400px]'>
                  <CardHeader>
                    <Skeleton className='h-6 w-3/4' />
                    <Skeleton className='h-4 w-1/2' />
                  </CardHeader>
                  <CardContent className='flex-1'>
                    <Skeleton className='mb-4 h-40 w-full rounded-md' />
                    <div className='space-y-2'>
                      <Skeleton className='h-4 w-full' />
                      <Skeleton className='h-4 w-full' />
                    </div>
                  </CardContent>
                  <CardFooter className='flex justify-between'>
                    <Skeleton className='h-9 w-20' />
                    <Skeleton className='h-9 w-28' />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className='flex flex-col items-center justify-center rounded-lg border border-destructive p-8 text-center text-destructive'>
              <AlertCircle className='mb-2 h-10 w-10' />
              <h3 className='mb-2 text-lg font-semibold'>Error Loading Medications</h3>
              <p>There was a problem loading the medication data. Please try again later.</p>
              <Button variant='outline' className='mt-4' onClick={() => refetch()}>
                Try Again
              </Button>
            </div>
          ) : data?.data?.result.medicines && data.data.result.medicines.length > 0 ? (
            <>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-lg font-medium'>Showing {data.data.result.medicines.length} products</h2>
                <p className='text-sm text-muted-foreground'>
                  Page {currentPage} of {data.data.result.pagination?.totalPages || 1}
                </p>
              </div>

              <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                {data.data.result.medicines.map((medicine) => (
                  <Card
                    key={medicine._id}
                    className='flex flex-col transition-all hover:shadow-md group relative overflow-hidden border-gray-200'
                  >
                    {/* Prescription badge */}
                    <div className='absolute top-3 right-3 z-10'>
                      {medicine.requires_prescription ? (
                        <Badge className='font-medium bg-red-100 text-red-700 hover:bg-red-200'>
                          Prescription Required
                        </Badge>
                      ) : (
                        <Badge className='font-medium bg-green-100 text-green-700 hover:bg-green-200'>
                          Over-the-Counter
                        </Badge>
                      )}
                    </div>

                    <CardHeader className='p-6'>
                      <div className='h-36 flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 rounded-md mb-4'>
                        <Pill className='h-16 w-16 text-primary/80' />
                      </div>
                      <CardTitle className='line-clamp-1 text-lg font-medium'>{medicine.name}</CardTitle>
                      <CardDescription className='line-clamp-1'>{medicine.manufacturer}</CardDescription>
                    </CardHeader>

                    <CardContent className='px-6 pb-4 flex-1'>
                      <div className='space-y-1'>
                        <div className='flex items-center justify-between'>
                          <span className='text-sm text-muted-foreground'>Dosage:</span>
                          <span className='text-sm font-medium'>{medicine.dosage}</span>
                        </div>
                        <div className='flex items-center justify-between'>
                          <span className='text-sm text-muted-foreground'>Price:</span>
                          <span className='text-xl font-bold text-primary'>${medicine.price.toFixed(2)}</span>
                        </div>
                        <div className='flex items-center justify-between'>
                          <span className='text-sm text-muted-foreground'>Status:</span>
                          <Badge variant='outline' className='bg-green-50 text-green-700 hover:bg-green-100'>
                            <Check className='h-3 w-3 mr-1' /> In Stock
                          </Badge>
                        </div>
                      </div>

                      <p className='text-sm text-muted-foreground line-clamp-2 mt-4'>
                        {medicine.description.substring(0, 90)}...
                      </p>
                    </CardContent>

                    <CardFooter className='px-6 py-4 border-t flex justify-between mt-auto'>
                      <Button
                        variant='outline'
                        onClick={() => navigate(`${path.medicines}/${medicine._id}`)}
                        className='flex-1 mr-2'
                      >
                        Details
                      </Button>

                      <Button
                        onClick={() => handleAddToCart(medicine._id, medicine.requires_prescription)}
                        disabled={medicine.requires_prescription || addToCart.isPending}
                        className={`flex-1 ${!medicine.requires_prescription ? 'bg-primary hover:bg-primary/90' : ''}`}
                      >
                        {addToCart.isPending && addToCart.variables?.medicineId === medicine._id ? (
                          <span className='flex items-center'>
                            <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                            Adding...
                          </span>
                        ) : (
                          <span className='flex items-center'>
                            <ShoppingCart className='mr-2 h-4 w-4' />
                            Add to Cart
                          </span>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <div className='flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center'>
              <Pill className='mb-2 h-10 w-10 text-muted-foreground' />
              <h3 className='mb-2 text-lg font-semibold'>No Medications Found</h3>
              <p className='text-muted-foreground'>
                We couldn't find any medications matching your criteria. Try adjusting your filters or search terms.
              </p>
              <Button variant='outline' className='mt-4' onClick={handleResetFilters}>
                Reset Filters
              </Button>
            </div>
          )}

          {/* Pagination */}
          {data?.data?.result.pagination && data.data.result.pagination.totalPages > 1 && (
            <Pagination className='mt-8'>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    aria-disabled={currentPage === 1 || isLoading}
                  />
                </PaginationItem>

                {Array.from({ length: Math.min(5, data.data.result.pagination.totalPages) }, (_, i) => {
                  const pageToShow =
                    currentPage <= 3
                      ? i + 1
                      : currentPage >= data.data.result.pagination.totalPages - 2
                        ? data.data.result.pagination.totalPages - 4 + i
                        : currentPage - 2 + i

                  return pageToShow > 0 && pageToShow <= data.data.result.pagination.totalPages ? (
                    <PaginationItem key={pageToShow}>
                      <PaginationLink isActive={currentPage === pageToShow} onClick={() => setCurrentPage(pageToShow)}>
                        {pageToShow}
                      </PaginationLink>
                    </PaginationItem>
                  ) : null
                })}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, data.data.result.pagination.totalPages))}
                    aria-disabled={currentPage === data.data.result.pagination.totalPages || isLoading}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>

      {/* Featured Categories */}
      <div className='mt-16'>
        <h2 className='mb-8 text-2xl font-bold tracking-tight'>Featured Categories</h2>
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {[
            {
              id: 'diabetes',
              name: 'Diabetes Care',
              icon: <Pill className='h-6 w-6' />,
              color: 'bg-blue-50 text-blue-600'
            },
            { id: 'heart', name: 'Heart Health', icon: <Heart className='h-6 w-6' />, color: 'bg-red-50 text-red-600' },
            {
              id: 'vitamins',
              name: 'Vitamins & Supplements',
              icon: <Pill className='h-6 w-6' />,
              color: 'bg-green-50 text-green-600'
            },
            {
              id: 'first-aid',
              name: 'First Aid',
              icon: <Pill className='h-6 w-6' />,
              color: 'bg-orange-50 text-orange-600'
            }
          ].map((category) => (
            <Card key={category.id} className='hover:shadow-md transition-all overflow-hidden group cursor-pointer'>
              <CardHeader>
                <div className='flex items-center space-x-2'>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${category.color}`}>
                    {category.icon}
                  </div>
                  <CardTitle>{category.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>Browse our selection of {category.name.toLowerCase()} products.</CardDescription>
              </CardContent>
              <CardFooter className='border-t pt-4'>
                <Button
                  variant='ghost'
                  className='w-full group-hover:bg-primary/10 group-hover:text-primary'
                  onClick={() => {
                    setFilters((prev) => ({
                      ...prev,
                      categories: [category.id]
                    }))
                    setCurrentPage(1)
                    refetch()
                  }}
                >
                  Explore <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className='mt-16 rounded-lg bg-gradient-to-r from-primary/10 to-blue-50 p-8'>
        <div className='flex flex-col items-center justify-center space-y-4 text-center md:space-y-6'>
          <h2 className='text-2xl font-bold tracking-tight md:text-3xl'>Need advice on medications?</h2>
          <p className='mx-auto max-w-[700px] text-muted-foreground'>
            Our healthcare professionals can help you understand your medications, potential side effects, and how to
            take them properly.
          </p>
          <div className='flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0'>
            <Button onClick={() => navigate(path.doctors)}>Consult a Pharmacist</Button>
            <Button variant='outline' onClick={() => navigate(path.healthAZ)}>
              Medication Guide
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MedicinesPage
