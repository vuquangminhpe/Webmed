/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import {
  Filter,
  Search,
  MapPin,
  Star,
  Calendar,
  Activity,
  User,
  ArrowRight,
  Loader2,
  CheckCircle,
  MessageCircle,
  Heart,
  Clock,
  BadgeCheck,
  ChevronDown,
  ArrowUpDown
} from 'lucide-react'
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
    <div className='min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white'>
      <div className='container px-4 py-12 md:py-16 mx-auto max-w-7xl'>
        {/* Hero Section */}
        <div className='flex flex-col items-center justify-center space-y-6 text-center mb-12'>
          <div className='relative'>
            <div className='absolute inset-0 bg-indigo-500 blur-xl opacity-20 rounded-full'></div>
            <div className='relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg'>
              <User className='h-10 w-10 text-white' />
            </div>
          </div>
          <h1 className='text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
            Find a Doctor
          </h1>
          <p className='mx-auto max-w-[700px] text-slate-600 text-lg md:text-xl'>
            Connect with qualified healthcare professionals based on your needs and preferences.
          </p>
        </div>

        {/* Search and Sort */}
        <div className='mt-8 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 bg-white rounded-xl shadow-md p-4 mb-8'>
          <form onSubmit={handleSearch} className='flex items-center space-x-3 md:w-1/2'>
            <div className='relative flex-1'>
              <Search className='absolute left-4 top-3.5 h-5 w-5 text-indigo-500' />
              <Input
                type='search'
                placeholder='Search by doctor name...'
                className='pl-12 py-6 border-slate-200 bg-slate-50 hover:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all rounded-lg'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              type='submit'
              className='bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all py-6 px-8 rounded-lg'
            >
              Search
            </Button>
          </form>

          <div className='flex items-center space-x-3'>
            <span className='text-sm font-medium text-slate-700'>Sort by:</span>
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className='w-[220px] border-slate-200 bg-slate-50 hover:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all rounded-lg py-6'>
                <div className='flex items-center'>
                  <ArrowUpDown className='mr-2 h-4 w-4 text-indigo-500' />
                  <SelectValue placeholder='Sort by' />
                </div>
              </SelectTrigger>
              <SelectContent className='rounded-lg border-slate-200 shadow-xl'>
                <SelectItem value='rating'>Highest Rated</SelectItem>
                <SelectItem value='experience'>Most Experienced</SelectItem>
                <SelectItem value='name'>Name (A-Z)</SelectItem>
                <SelectItem value='-name'>Name (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        <div className='lg:hidden mb-4'>
          <Button
            variant='outline'
            className='w-full flex items-center justify-center space-x-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 py-3 rounded-lg'
          >
            <Filter className='h-4 w-4' />
            <span>Filters</span>
            <ChevronDown className={`h-4 w-4 transition-transform `} />
          </Button>
        </div>

        <div className='mt-8 flex flex-col lg:flex-row lg:space-x-8'>
          {/* Filters */}
          <div className={`${'hidden lg:block'} mb-8 rounded-xl border-none shadow-lg bg-white p-6 lg:mb-0 lg:w-1/4`}>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-xl font-bold text-slate-800 flex items-center'>
                <Filter className='mr-2 h-5 w-5 text-indigo-500' />
                Filters
              </h2>
              <Button
                variant='outline'
                size='sm'
                onClick={handleResetFilters}
                className='text-xs border-slate-200 hover:bg-slate-50 text-slate-600'
              >
                Reset All
              </Button>
            </div>

            <div className='space-y-8'>
              {/* Specialization */}
              <div>
                <h3 className='mb-4 font-semibold text-slate-700 flex items-center'>
                  <BadgeCheck className='mr-2 h-4 w-4 text-indigo-500' />
                  Specialization
                </h3>
                <div className='space-y-2 max-h-40 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-slate-50'>
                  {specializations.map((specialization) => (
                    <div key={specialization} className='flex items-center space-x-3 py-1'>
                      <Checkbox
                        id={`specialization-${specialization}`}
                        checked={filters.specializations.includes(specialization)}
                        onCheckedChange={() => toggleSpecialization(specialization)}
                        className='text-indigo-500 focus:ring-indigo-500'
                      />
                      <Label
                        htmlFor={`specialization-${specialization}`}
                        className='text-sm font-medium text-slate-600 cursor-pointer hover:text-indigo-600 transition-colors'
                      >
                        {specialization}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className='bg-slate-100' />

              {/* Location */}
              <div>
                <h3 className='mb-4 font-semibold text-slate-700 flex items-center'>
                  <MapPin className='mr-2 h-4 w-4 text-indigo-500' />
                  Location
                </h3>
                <div className='space-y-2 max-h-40 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-slate-50'>
                  {locations.map((location) => (
                    <div key={location} className='flex items-center space-x-3 py-1'>
                      <Checkbox
                        id={`location-${location}`}
                        checked={filters.locations.includes(location)}
                        onCheckedChange={() => toggleLocation(location)}
                        className='text-indigo-500 focus:ring-indigo-500'
                      />
                      <Label
                        htmlFor={`location-${location}`}
                        className='text-sm font-medium text-slate-600 cursor-pointer hover:text-indigo-600 transition-colors'
                      >
                        {location}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className='bg-slate-100' />

              {/* Availability */}
              <div>
                <h3 className='mb-4 font-semibold text-slate-700 flex items-center'>
                  <Clock className='mr-2 h-4 w-4 text-indigo-500' />
                  Availability
                </h3>
                <div className='space-y-2'>
                  {availabilityOptions.map((day) => (
                    <div key={day} className='flex items-center space-x-3 py-1'>
                      <Checkbox
                        id={`day-${day}`}
                        checked={filters.availability.includes(day)}
                        onCheckedChange={() => toggleAvailability(day)}
                        className='text-indigo-500 focus:ring-indigo-500'
                      />
                      <Label
                        htmlFor={`day-${day}`}
                        className='text-sm font-medium text-slate-600 cursor-pointer hover:text-indigo-600 transition-colors'
                      >
                        {day}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className='pt-4'>
                <Button
                  className='w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all rounded-lg py-6'
                  onClick={handleApplyFilters}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Doctors List */}
          <div className='flex-1'>
            {isLoading ? (
              <div className='space-y-6'>
                {[...Array(3)].map((_, index) => (
                  <Card key={index} className='w-full border-none shadow-md rounded-xl overflow-hidden'>
                    <CardContent className='p-0'>
                      <div className='flex flex-col sm:flex-row animate-pulse'>
                        <div className='bg-slate-100 p-6 flex items-center justify-center sm:w-48'>
                          <div className='flex-shrink-0 h-24 w-24 bg-slate-200 rounded-full'></div>
                        </div>
                        <div className='flex-1 p-6 space-y-4'>
                          <div className='h-5 bg-slate-200 rounded w-3/4'></div>
                          <div className='h-4 bg-slate-200 rounded w-1/2'></div>
                          <div className='h-4 bg-slate-200 rounded w-5/6'></div>
                          <div className='h-10 bg-slate-200 rounded w-32 mt-4'></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <div className='flex justify-center py-8'>
                  <div className='relative'>
                    <div className='absolute inset-0 bg-indigo-400 blur-md opacity-20 rounded-full'></div>
                    <Loader2 className='relative h-12 w-12 animate-spin text-indigo-600' />
                  </div>
                </div>
              </div>
            ) : error ? (
              <Card className='border-none shadow-lg rounded-xl overflow-hidden bg-white'>
                <CardContent className='p-0'>
                  <div className='bg-red-50 p-8 flex flex-col items-center justify-center text-center'>
                    <div className='bg-white rounded-full p-4 shadow-md mb-4'>
                      <Activity className='h-12 w-12 text-red-500' />
                    </div>
                    <h3 className='text-xl font-bold mb-2 text-slate-800'>Error Loading Doctors</h3>
                    <p className='text-slate-600 max-w-md mb-6'>
                      There was a problem loading the doctor data. Please try again later.
                    </p>
                    <Button
                      className='bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-md hover:shadow-lg transition-all'
                      onClick={() => refetch()}
                    >
                      Try Again
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : data?.data?.result.doctors.length === 0 ? (
              <Card className='border-none shadow-lg rounded-xl overflow-hidden bg-white'>
                <CardContent className='p-0'>
                  <div className='bg-indigo-50 p-8 flex flex-col items-center justify-center text-center'>
                    <div className='bg-white rounded-full p-4 shadow-md mb-4'>
                      <User className='h-12 w-12 text-indigo-500' />
                    </div>
                    <h3 className='text-xl font-bold mb-2 text-slate-800'>No Doctors Found</h3>
                    <p className='text-slate-600 max-w-md mb-6'>
                      We couldn't find any doctors matching your criteria. Try adjusting your filters or search terms.
                    </p>
                    <Button
                      className='bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all'
                      onClick={handleResetFilters}
                    >
                      Reset Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className='space-y-6'>
                {data?.data?.result.doctors.map((doctor) => (
                  <Card
                    key={doctor._id}
                    className='w-full border-none rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden'
                  >
                    <CardContent className='p-0'>
                      <div className='flex flex-col md:flex-row'>
                        <div className='w-full md:w-48 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 flex flex-col items-center justify-center text-center'>
                          <Avatar className='h-24 w-24 mb-3 ring-4 ring-white shadow-md'>
                            <AvatarImage src={doctor.avatar} alt={doctor.name} />
                            <AvatarFallback className='bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-bold text-xl'>
                              {doctor.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className='flex items-center justify-center mt-2 space-x-1'>
                            {renderStars(doctor.rating)}
                            <span className='ml-1 font-medium text-indigo-600'>({doctor.rating})</span>
                          </div>
                          <Button
                            variant='outline'
                            size='sm'
                            className='mt-3 border-indigo-200 text-indigo-600 hover:bg-indigo-50 rounded-full w-full'
                          >
                            <Heart className='h-4 w-4 mr-1' />
                            Favorite
                          </Button>
                        </div>

                        <div className='p-6 flex-1 bg-white'>
                          <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between'>
                            <div className='mb-4 sm:mb-0'>
                              <div className='flex items-center'>
                                <h3 className='text-xl font-bold text-slate-800'>Dr. {doctor.name}</h3>
                                <Badge
                                  variant='outline'
                                  className='ml-2 bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200 px-2 py-0.5 rounded-full'
                                >
                                  {doctor.specialization}
                                </Badge>
                              </div>
                              <div className='grid grid-cols-1 md:grid-cols-2 gap-3 mt-4'>
                                <div className='flex items-center text-slate-600'>
                                  <Briefcase className='mr-2 h-4 w-4 text-indigo-500' />
                                  <span className='text-sm font-medium'>{doctor.experience} years experience</span>
                                </div>
                                <div className='flex items-center text-slate-600'>
                                  <MapPin className='mr-2 h-4 w-4 text-indigo-500' />
                                  <span className='text-sm font-medium'>{doctor.location}</span>
                                </div>
                                <div className='flex items-center text-slate-600 col-span-1 md:col-span-2'>
                                  <Calendar className='mr-2 h-4 w-4 text-indigo-500' />
                                  <span className='text-sm font-medium'>
                                    Available: {doctor.availability.join(', ')}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className='mt-4 bg-slate-50 rounded-lg p-4 border border-slate-100'>
                            <h4 className='text-sm font-semibold text-slate-700 mb-2'>About Dr. {doctor.name}</h4>
                            <p className='text-slate-600 text-sm'>
                              Dr. {doctor.name} is a {doctor.specialization} specialist with {doctor.experience} years
                              of experience.
                              {doctor.contact ||
                                ` Specializing in various ${doctor.specialization.toLowerCase()} conditions and treatments.`}
                            </p>
                          </div>

                          <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-6'>
                            <div className='flex space-x-3'>
                              <Badge className='bg-emerald-100 text-emerald-800 border-emerald-200 px-3 py-1 flex items-center'>
                                <CheckCircle className='h-3 w-3 mr-1' />
                                Verified
                              </Badge>
                              <Badge className='bg-blue-100 text-blue-800 border-blue-200 px-3 py-1 flex items-center'>
                                <MessageCircle className='h-3 w-3 mr-1' />
                                Chat Available
                              </Badge>
                            </div>
                            <Button
                              className='bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all rounded-lg'
                              onClick={() => navigate(`${path.doctors}/${doctor._id}`)}
                            >
                              View Profile
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Pagination */}
                {data?.data?.result.pagination && data?.data?.result.pagination.totalPages > 1 && (
                  <div className='mt-10 flex justify-center'>
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            className={`rounded-lg border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 transition-all ${
                              currentPage === 1 || isLoading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
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
                                className={`rounded-lg ${
                                  currentPage === pageToShow
                                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none shadow-md'
                                    : 'border-indigo-200 text-indigo-600 hover:bg-indigo-50'
                                } transition-all`}
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
                            className={`rounded-lg border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 transition-all ${
                              currentPage === data?.data?.result.pagination.totalPages || isLoading
                                ? 'opacity-50 cursor-not-allowed'
                                : ''
                            }`}
                            aria-disabled={currentPage === data?.data?.result.pagination.totalPages || isLoading}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className='mt-16 rounded-xl overflow-hidden shadow-lg bg-gradient-to-r from-indigo-600 to-purple-700'>
          <div className='relative px-6 py-12 md:p-12'>
            {/* Background Pattern */}
            <div className='absolute inset-0 opacity-10'>
              <svg className='h-full w-full' viewBox='0 0 800 800'>
                <path
                  d='M435.5,141.7C441.5,177.2,447.5,212.8,441.3,240.8C435.2,268.8,416.8,289.2,390.2,319.2C363.5,349.2,328.5,388.8,305.8,422.8C283.2,456.8,273,485.2,251.7,513.3C230.3,541.5,197.8,569.5,157.5,572.7C117.2,575.8,69,554,41.5,519C14,484,7.2,435.7,11.5,386.3C15.8,337,31.2,286.7,64.2,249.2C97.2,211.7,147.8,187,195.5,157.5C243.2,128,288,93.7,334.2,82.2C380.3,70.7,427.8,82,436.7,98.7C445.5,115.3,429.5,106.2,435.5,141.7Z'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                ></path>
                <path
                  d='M491.5,262.2C522.8,306.3,554.2,350.5,570.2,402.3C586.2,454.2,586.8,513.7,563.3,547.3C540,581,492.5,588.8,447.5,602.7C402.5,616.5,360,636.2,310.8,647.3C261.5,658.3,205.5,660.7,165.7,640.7C126,620.8,102.5,578.5,79.5,532.3C56.5,486.2,34,436.2,41.8,392.3C49.5,348.5,87.5,310.8,125.7,274.2C163.8,237.5,202.2,201.8,248.3,177.5C294.5,153.2,348.5,140.3,395,147.3C441.5,154.3,480.5,181.2,493.7,212.3C506.8,243.5,460,255.5,491.5,262.2Z'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                ></path>
              </svg>
            </div>
            <div className='relative flex flex-col items-center justify-center space-y-6 text-center md:space-y-8 text-white'>
              <div className='bg-white/20 p-3 rounded-full backdrop-blur-sm'>
                <User className='h-8 w-8' />
              </div>
              <h2 className='text-2xl font-bold tracking-tight md:text-3xl max-w-xl'>
                Need help finding the right specialist for your health concerns?
              </h2>
              <p className='mx-auto max-w-[700px] text-white/80 text-lg'>
                Our healthcare team can help match you with the right doctor based on your needs and preferences.
              </p>
              <div className='flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0'>
                <Button
                  onClick={() => navigate('/health-a-z/symptoms')}
                  className='bg-white text-indigo-700 hover:bg-indigo-50 shadow-md hover:shadow-lg transition-all rounded-lg px-8 py-6'
                >
                  Use Symptom Checker
                </Button>
                <Button
                  variant='outline'
                  onClick={() => navigate('/help/find-doctor')}
                  className='border-white text-white hover:bg-white/20 rounded-lg px-8 py-6'
                >
                  Get Personalized Help
                </Button>
              </div>
            </div>
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
