/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Filter, Search, MapPin, Star, Calendar, Activity, User, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import doctorApi from '@/apis/doctors.api'
import path from '@/constants/path'
import { Label } from '@/Components/ui/label'

interface FilterState {
  specializations: string[]
  locations: string[]
  availability: string[]
}

const specializations = [
  'Cardiology',
  'Dermatology',
  'Endocrinology',
  'Gastroenterology',
  'Neurology',
  'Oncology',
  'Pediatrics',
  'Psychiatry',
  'Surgery'
]

const locations = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami', 'Boston', 'San Francisco']

const availabilityOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const DoctorsListPage = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortOption, setSortOption] = useState('rating')
  const [filters, setFilters] = useState<FilterState>({
    specializations: [],
    locations: [],
    availability: []
  })

  // Generate query parameters based on current filters and search
  const getQueryParams = (): any => {
    const queryParams: any = {
      page: currentPage,
      limit: 10
    }

    if (searchQuery) {
      queryParams.name = searchQuery
    }

    if (sortOption) {
      queryParams.sort = sortOption
    }

    if (filters.specializations.length > 0) {
      queryParams.specialization = filters.specializations.join(',')
    }

    if (filters.locations.length > 0) {
      queryParams.location = filters.locations.join(',')
    }

    if (filters.availability.length > 0) {
      queryParams.availability = filters.availability.join(',')
    }

    return queryParams
  }

  // Query to fetch doctors based on filters and search
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['doctors', currentPage, searchQuery, sortOption, filters],
    queryFn: () => doctorApi.getDoctors(getQueryParams()),
    placeholderData: keepPreviousData
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    refetch()
  }

  const toggleSpecialization = (specialization: string) => {
    setFilters((prev) => {
      const newSpecializations = prev.specializations.includes(specialization)
        ? prev.specializations.filter((s) => s !== specialization)
        : [...prev.specializations, specialization]

      return { ...prev, specializations: newSpecializations }
    })
  }

  const toggleLocation = (location: string) => {
    setFilters((prev) => {
      const newLocations = prev.locations.includes(location)
        ? prev.locations.filter((l) => l !== location)
        : [...prev.locations, location]

      return { ...prev, locations: newLocations }
    })
  }

  const toggleAvailability = (day: string) => {
    setFilters((prev) => {
      const newAvailability = prev.availability.includes(day)
        ? prev.availability.filter((d) => d !== day)
        : [...prev.availability, day]

      return { ...prev, availability: newAvailability }
    })
  }

  const handleApplyFilters = () => {
    setCurrentPage(1)
    refetch()
  }

  const handleResetFilters = () => {
    setFilters({
      specializations: [],
      locations: [],
      availability: []
    })
    setSearchQuery('')
    setSortOption('rating')
    setCurrentPage(1)
    refetch()
  }

  const renderStars = (rating: number) => {
    return (
      <div className='flex'>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < Math.round(rating) ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'}`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className='container px-4 py-8 md:py-12'>
      <div className='flex flex-col items-center justify-center space-y-4 text-center'>
        <div className='flex h-16 w-16 items-center justify-center rounded-full bg-primary/10'>
          <User className='h-8 w-8 text-primary' />
        </div>
        <h1 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xlMedicinesPage '>Find a Doctor</h1>
        <p className='mx-auto max-w-[700px] text-muted-foreground md:text-xl'>
          Connect with qualified healthcare professionals based on your needs and preferences.
        </p>
      </div>

      <div className='mt-8 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0'>
        <form onSubmit={handleSearch} className='flex items-center space-x-2 md:w-1/2'>
          <div className='relative flex-1'>
            <Search className='absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground' />
            <Input
              type='search'
              placeholder='Search by doctor name...'
              className='pl-10'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type='submit'>Search</Button>
        </form>

        <div className='flex items-center space-x-2'>
          <span className='text-sm text-muted-foreground'>Sort by:</span>
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Sort by' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='rating'>Highest Rated</SelectItem>
              <SelectItem value='experience'>Most Experienced</SelectItem>
              <SelectItem value='name'>Name (A-Z)</SelectItem>
              <SelectItem value='-name'>Name (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='mt-8 flex flex-col lg:flex-row lg:space-x-8'>
        <div className='mb-8 rounded-lg border p-4 lg:mb-0 lg:w-1/4'>
          <h2 className='mb-4 text-lg font-semibold'>Filters</h2>

          <div className='space-y-6'>
            <div>
              <h3 className='mb-3 font-medium'>Specialization</h3>
              <div className='space-y-2 max-h-40 overflow-y-auto pr-2'>
                {specializations.map((specialization) => (
                  <div key={specialization} className='flex items-center space-x-2'>
                    <Checkbox
                      id={`specialization-${specialization}`}
                      checked={filters.specializations.includes(specialization)}
                      onCheckedChange={() => toggleSpecialization(specialization)}
                    />
                    <Label htmlFor={`specialization-${specialization}`} className='text-sm font-normal'>
                      {specialization}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className='mb-3 font-medium'>Location</h3>
              <div className='space-y-2 max-h-40 overflow-y-auto pr-2'>
                {locations.map((location) => (
                  <div key={location} className='flex items-center space-x-2'>
                    <Checkbox
                      id={`location-${location}`}
                      checked={filters.locations.includes(location)}
                      onCheckedChange={() => toggleLocation(location)}
                    />
                    <Label htmlFor={`location-${location}`} className='text-sm font-normal'>
                      {location}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className='mb-3 font-medium'>Availability</h3>
              <div className='space-y-2'>
                {availabilityOptions.map((day) => (
                  <div key={day} className='flex items-center space-x-2'>
                    <Checkbox
                      id={`day-${day}`}
                      checked={filters.availability.includes(day)}
                      onCheckedChange={() => toggleAvailability(day)}
                    />
                    <Label htmlFor={`day-${day}`} className='text-sm font-normal'>
                      {day}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <Button className='w-full' onClick={handleApplyFilters}>
              Apply Filters
            </Button>
            <Button variant='outline' className='w-full' onClick={handleResetFilters}>
              Reset
            </Button>
          </div>
        </div>

        <div className='flex-1'>
          {isLoading ? (
            <div className='space-y-4'>
              {[...Array(3)].map((_, index) => (
                <Card key={index} className='w-full'>
                  <CardContent className='p-6'>
                    <div className='flex flex-col sm:flex-row animate-pulse'>
                      <div className='flex-shrink-0 h-24 w-24 bg-slate-200 rounded-full mb-4 sm:mb-0 sm:mr-6'></div>
                      <div className='flex-1 space-y-4'>
                        <div className='h-4 bg-slate-200 rounded w-3/4'></div>
                        <div className='h-4 bg-slate-200 rounded w-1/2'></div>
                        <div className='h-4 bg-slate-200 rounded w-5/6'></div>
                      </div>
                      <div className='w-24 h-10 bg-slate-200 rounded mt-4 sm:mt-0'></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <div className='flex justify-center'>
                <Loader2 className='h-8 w-8 animate-spin text-primary' />
              </div>
            </div>
          ) : error ? (
            <div className='flex flex-col items-center justify-center rounded-lg border border-destructive p-8 text-center text-destructive'>
              <Activity className='mb-2 h-10 w-10 text-destructive' />
              <h3 className='mb-2 text-lg font-semibold'>Error Loading Doctors</h3>
              <p>There was a problem loading the doctor data. Please try again later.</p>
              <Button variant='outline' className='mt-4' onClick={() => refetch()}>
                Try Again
              </Button>
            </div>
          ) : data?.data?.result.doctors.length === 0 ? (
            <div className='flex flex-col items-center justify-center rounded-lg border p-8 text-center'>
              <User className='mb-2 h-10 w-10 text-muted-foreground' />
              <h3 className='mb-2 text-lg font-semibold'>No Doctors Found</h3>
              <p className='text-muted-foreground'>
                We couldn't find any doctors matching your criteria. Try adjusting your filters or search terms.
              </p>
              <Button variant='outline' className='mt-4' onClick={handleResetFilters}>
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className='space-y-4'>
              {data?.data?.result.doctors.map((doctor) => (
                <Card key={doctor._id} className='w-full hover:shadow-md transition-all'>
                  <CardContent className='p-6'>
                    <div className='flex flex-col sm:flex-row sm:items-center'>
                      <div className='flex flex-col items-center sm:items-start sm:flex-row mb-4 sm:mb-0'>
                        <Avatar className='h-20 w-20 mb-2 sm:mb-0 sm:mr-4'>
                          <AvatarImage src={doctor.avatar} alt={doctor.name} />
                          <AvatarFallback>{doctor.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className='text-lg font-bold'>{doctor.name}</h3>
                          <div className='flex items-center mt-1 mb-2'>
                            <Badge variant='outline' className='mr-2'>
                              {doctor.specialization}
                            </Badge>
                            <div className='flex items-center'>
                              {renderStars(doctor.rating)}
                              <span className='ml-1 text-sm text-muted-foreground'>({doctor.rating})</span>
                            </div>
                          </div>
                          <div className='flex flex-col space-y-1 text-sm text-muted-foreground'>
                            <div className='flex items-center'>
                              <Briefcase className='mr-1 h-4 w-4' />
                              <span>{doctor.experience} years experience</span>
                            </div>
                            <div className='flex items-center'>
                              <MapPin className='mr-1 h-4 w-4' />
                              <span>{doctor.location}</span>
                            </div>
                            <div className='flex items-center'>
                              <Calendar className='mr-1 h-4 w-4' />
                              <span>{doctor.availability.join(', ')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='flex-1'></div>
                      <div className='flex mt-4 sm:mt-0'>
                        <Button onClick={() => navigate(`${path.doctors}/${doctor._id}`)}>View Profile</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {data?.data?.result.pagination && data?.data?.result.pagination.totalPages > 1 && (
                <Pagination className='mt-8'>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        aria-disabled={currentPage === 1 || isLoading}
                      />
                    </PaginationItem>

                    {Array.from({ length: Math.min(5, data?.data?.result.pagination.totalPages) }, (_, i) => {
                      const pageToShow =
                        currentPage <= 3
                          ? i + 1
                          : currentPage >= data?.data?.result.pagination.totalPages - 2
                            ? data?.data?.result.pagination.totalPages - 4 + i
                            : currentPage - 2 + i

                      return pageToShow > 0 && pageToShow <= data?.data?.result.pagination.totalPages ? (
                        <PaginationItem key={pageToShow}>
                          <PaginationLink
                            isActive={currentPage === pageToShow}
                            onClick={() => setCurrentPage(pageToShow)}
                          >
                            {pageToShow}
                          </PaginationLink>
                        </PaginationItem>
                      ) : null
                    })}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((prev) => Math.min(prev + 1, data?.data?.result.pagination.totalPages))
                        }
                        aria-disabled={currentPage === data?.data?.result.pagination.totalPages || isLoading}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          )}
        </div>
      </div>

      <div className='mt-16 rounded-lg bg-muted p-8'>
        <div className='flex flex-col items-center justify-center space-y-4 text-center md:space-y-6'>
          <h2 className='text-2xl font-bold tracking-tight md:text-3xl'>Need help finding the right specialist?</h2>
          <p className='mx-auto max-w-[700px] text-muted-foreground'>
            Our healthcare team can help match you with the right doctor based on your needs and preferences.
          </p>
          <div className='flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0'>
            <Button onClick={() => navigate('/health-a-z/symptoms')}>Use Symptom Checker</Button>
            <Button variant='outline' onClick={() => navigate('/help/find-doctor')}>
              Get Personalized Help
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper component for Briefcase icon that wasn't imported above
const Briefcase = (props: any) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    {...props}
  >
    <rect width='20' height='14' x='2' y='7' rx='2' ry='2' />
    <path d='M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16' />
  </svg>
)

export default DoctorsListPage
