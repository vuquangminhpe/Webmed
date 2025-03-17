import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pill, Search, Filter, ArrowRight, ShoppingCart, AlertCircle, Heart } from 'lucide-react'
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
import { useMedicines } from '@/hooks/useMedicine'
import path from '@/constants/path'
import { Label } from '@/Components/ui/label'

const MedicinesPage = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const { data, isLoading, error } = useMedicines(currentPage, 9, searchQuery)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
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

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId)
    setCurrentPage(1)
  }

  return (
    <div className='container px-4 py-8 md:py-12'>
      <div className='flex flex-col items-center justify-center space-y-4 text-center'>
        <div className='flex h-16 w-16 items-center justify-center rounded-full bg-primary/10'>
          <Pill className='h-8 w-8 text-primary' />
        </div>
        <h1 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>Drugs & Supplements</h1>
        <p className='mx-auto max-w-[700px] text-muted-foreground md:text-xl'>
          Browse and order medications, vitamins, and wellness products.
        </p>
      </div>

      <div className='mt-8 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0'>
        <form onSubmit={handleSearch} className='flex items-center space-x-2 md:w-1/2'>
          <div className='relative flex-1'>
            <Search className='absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground' />
            <Input
              type='search'
              placeholder='Search medications...'
              className='pl-10'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type='submit'>Search</Button>
        </form>

        <div className='flex items-center space-x-2'>
          <span className='text-sm text-muted-foreground'>Sort by:</span>
          <select className='rounded-md border border-input bg-background px-3 py-2 text-sm'>
            <option value='name'>Name</option>
            <option value='price-low'>Price: Low to High</option>
            <option value='price-high'>Price: High to Low</option>
            <option value='popular'>Popularity</option>
          </select>
          <Button variant='outline' size='icon'>
            <Filter className='h-4 w-4' />
          </Button>
        </div>
      </div>

      <div className='mt-8 flex flex-col lg:flex-row lg:space-x-8'>
        <div className='mb-8 rounded-lg border p-4 lg:mb-0 lg:w-1/4'>
          <h2 className='mb-4 text-lg font-semibold'>Filters</h2>

          <div className='space-y-6'>
            <div>
              <h3 className='mb-3 font-medium'>Categories</h3>
              <div className='space-y-2'>
                {categoryFilters.map((filter) => (
                  <div key={filter.id} className='flex items-center space-x-2'>
                    <Checkbox
                      id={filter.id}
                      checked={filter.id === selectedCategory}
                      onCheckedChange={() => handleCategoryChange(filter.id)}
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
              <h3 className='mb-3 font-medium'>Price Range</h3>
              <div className='space-y-2'>
                <div className='flex items-center space-x-2'>
                  <Checkbox id='price-0-10' />
                  <Label htmlFor='price-0-10' className='text-sm font-normal'>
                    $0 - $10
                  </Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <Checkbox id='price-10-25' />
                  <Label htmlFor='price-10-25' className='text-sm font-normal'>
                    $10 - $25
                  </Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <Checkbox id='price-25-50' />
                  <Label htmlFor='price-25-50' className='text-sm font-normal'>
                    $25 - $50
                  </Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <Checkbox id='price-50-100' />
                  <Label htmlFor='price-50-100' className='text-sm font-normal'>
                    $50 - $100
                  </Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <Checkbox id='price-100+' />
                  <Label htmlFor='price-100+' className='text-sm font-normal'>
                    $100+
                  </Label>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className='mb-3 font-medium'>Prescription</h3>
              <div className='space-y-2'>
                <div className='flex items-center space-x-2'>
                  <Checkbox id='prescription-required' />
                  <Label htmlFor='prescription-required' className='text-sm font-normal'>
                    Prescription Required
                  </Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <Checkbox id='over-the-counter' />
                  <Label htmlFor='over-the-counter' className='text-sm font-normal'>
                    Over-the-Counter
                  </Label>
                </div>
              </div>
            </div>

            <Separator />

            <Button className='w-full'>Apply Filters</Button>
            <Button
              variant='outline'
              className='w-full'
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory(null)
                setCurrentPage(1)
              }}
            >
              Reset
            </Button>
          </div>
        </div>

        <div className='flex-1'>
          {isLoading ? (
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              {[...Array(6)].map((_, index) => (
                <Card key={index} className='flex flex-col'>
                  <CardHeader>
                    <Skeleton className='h-6 w-3/4' />
                    <Skeleton className='h-4 w-1/2' />
                  </CardHeader>
                  <CardContent className='flex-1'>
                    <Skeleton className='mb-4 h-20 w-full' />
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
              <Button variant='outline' className='mt-4' onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : data?.medicines && data.medicines.length > 0 ? (
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              {data.medicines.map((medicine) => (
                <Card key={medicine._id} className='flex flex-col'>
                  <CardHeader>
                    <div className='flex justify-between'>
                      <CardTitle className='line-clamp-1'>{medicine.name}</CardTitle>
                      {medicine.requires_prescription ? (
                        <Badge variant='outline'>Prescription Required</Badge>
                      ) : (
                        <Badge variant='outline' className='bg-primary/10'>
                          Over-the-Counter
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{medicine.manufacturer}</CardDescription>
                  </CardHeader>
                  <CardContent className='flex-1'>
                    <div className='mb-4 h-20 rounded-md bg-muted'></div>
                    <div className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <span className='font-medium'>Price:</span>
                        <span>${medicine.price.toFixed(2)}</span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='font-medium'>Availability:</span>
                        <span className='text-green-500'>In Stock</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className='flex justify-between'>
                    <Button
                      variant='outline'
                      onClick={() => navigate(`${path.medicines.replace(':id', medicine._id)}`)}
                    >
                      Details
                    </Button>
                    <Button disabled={medicine.requires_prescription}>
                      <ShoppingCart className='mr-2 h-4 w-4' />
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center rounded-lg border p-8 text-center'>
              <Pill className='mb-2 h-10 w-10 text-muted-foreground' />
              <h3 className='mb-2 text-lg font-semibold'>No Medications Found</h3>
              <p className='text-muted-foreground'>
                We couldn't find any medications matching your criteria. Try adjusting your filters or search terms.
              </p>
              <Button
                variant='outline'
                className='mt-4'
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory(null)
                  setCurrentPage(1)
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}

          {data?.pagination && data.pagination.totalPages > 1 && (
            <Pagination className='mt-8'>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    isActive={currentPage === 1 || isLoading}
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
                    isActive={currentPage === data.pagination.totalPages || isLoading}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>

      <div className='mt-16'>
        <h2 className='mb-8 text-2xl font-bold tracking-tight'>Featured Categories</h2>
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {[
            { id: 'diabetes', name: 'Diabetes Care', icon: <Pill className='h-6 w-6' /> },
            { id: 'heart', name: 'Heart Health', icon: <Heart className='h-6 w-6' /> },
            { id: 'vitamins', name: 'Vitamins & Supplements', icon: <Pill className='h-6 w-6' /> },
            { id: 'first-aid', name: 'First Aid', icon: <Pill className='h-6 w-6' /> }
          ].map((category) => (
            <Card key={category.id} className='hover:bg-accent/50 hover:shadow-md'>
              <CardHeader>
                <div className='flex items-center space-x-2'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10'>
                    {category.icon}
                  </div>
                  <CardTitle>{category.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>Browse our selection of {category.name.toLowerCase()} products.</CardDescription>
              </CardContent>
              <CardFooter>
                <Button
                  variant='ghost'
                  className='w-full'
                  onClick={() => {
                    setSelectedCategory(category.id)
                    setCurrentPage(1)
                  }}
                >
                  Explore <ArrowRight className='ml-2 h-4 w-4' />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <div className='mt-16 rounded-lg bg-muted p-8'>
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
