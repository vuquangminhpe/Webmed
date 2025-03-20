import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Heart, Search, AlertCircle, Info, ArrowRight, Stethoscope, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useDiseases } from '@/hooks/useHealth'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import path from '@/constants/path'
import { Badge } from '@/components/ui/badge'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

const HealthAZPage = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)

  // Get diseases with parameters
  const { data, isLoading, error, refetch } = useDiseases(
    currentPage,
    10,
    selectedLetter ? `^${selectedLetter}` : searchQuery
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSelectedLetter(null)
    setCurrentPage(1)
    refetch()
  }

  const handleLetterClick = (letter: string) => {
    setSearchQuery('')
    setSelectedLetter(letter === selectedLetter ? null : letter)
    setCurrentPage(1)
  }

  const commonConditions = [
    {
      id: 'diabetes',
      name: 'Diabetes',
      description: 'A chronic condition affecting how your body processes blood sugar',
      letter: 'D'
    },
    {
      id: 'hypertension',
      name: 'Hypertension',
      description: 'High blood pressure that can lead to serious health problems',
      letter: 'H'
    },
    {
      id: 'asthma',
      name: 'Asthma',
      description: 'A condition causing breathing difficulty due to narrowed airways',
      letter: 'A'
    },
    {
      id: 'arthritis',
      name: 'Arthritis',
      description: 'Inflammation of one or more joints causing pain and stiffness',
      letter: 'A'
    },
    {
      id: 'depression',
      name: 'Depression',
      description: 'A mental health disorder characterized by persistently depressed mood',
      letter: 'D'
    },
    {
      id: 'anxiety',
      name: 'Anxiety',
      description: 'A feeling of worry, nervousness, or unease about something',
      letter: 'A'
    }
  ]

  // Navigate to disease detail page
  const handleDiseaseClick = (diseaseId: string) => {
    navigate(`/health-a-z/${diseaseId}`)
  }

  return (
    <div className='container px-4 py-8 md:py-12'>
      <div className='flex flex-col items-center justify-center space-y-4 text-center'>
        <div className='flex h-16 w-16 items-center justify-center rounded-full bg-primary/10'>
          <Heart className='h-8 w-8 text-primary' />
        </div>
        <h1 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>Health A-Z</h1>
        <p className='mx-auto max-w-[700px] text-muted-foreground md:text-xl'>
          Learn about diseases, symptoms, treatments, and prevention.
        </p>
      </div>

      <div className='mx-auto mt-8 max-w-xl'>
        <form onSubmit={handleSearch} className='flex items-center space-x-2'>
          <div className='relative flex-1'>
            <Search className='absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground' />
            <Input
              type='search'
              placeholder='Search diseases...'
              className='pl-10'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type='submit'>Search</Button>
        </form>
      </div>

      <div className='mt-8 flex flex-wrap justify-center gap-2'>
        {ALPHABET.map((letter) => (
          <Button
            key={letter}
            variant={selectedLetter === letter ? 'default' : 'outline'}
            className='h-10 w-10 p-0 font-medium'
            onClick={() => handleLetterClick(letter)}
          >
            {letter}
          </Button>
        ))}
      </div>

      {!searchQuery && !selectedLetter && (
        <div className='mt-12'>
          <h2 className='mb-6 text-2xl font-bold tracking-tight'>Common Health Conditions</h2>
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {commonConditions.map((condition) => (
              <Card
                key={condition.id}
                className='flex h-full flex-col transition-all hover:shadow-md cursor-pointer'
                onClick={() => navigate(`${path.healthAZ}/${condition.id}`)}
              >
                <CardHeader>
                  <div className='flex items-center justify-between'>
                    <CardTitle>{condition.name}</CardTitle>
                    <Badge variant='outline'>{condition.letter}</Badge>
                  </div>
                </CardHeader>
                <CardContent className='flex-1'>
                  <CardDescription className='text-base'>{condition.description}</CardDescription>
                </CardContent>
                <CardFooter>
                  <Button
                    variant='ghost'
                    className='w-full'
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`${path.healthAZ}/${condition.id}`)
                    }}
                  >
                    Learn more <ArrowRight className='ml-2 h-4 w-4' />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      {(searchQuery || selectedLetter) && (
        <div className='mt-12'>
          <h2 className='mb-6 text-2xl font-bold tracking-tight'>
            {isLoading
              ? 'Searching...'
              : `Search Results ${data?.pagination.totalDiseases ? `(${data.pagination.totalDiseases})` : ''}`}
          </h2>

          {error && (
            <Alert variant='destructive'>
              <AlertCircle className='mr-2 h-5 w-5' />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>Error loading diseases. Please try again later.</AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              {[...Array(6)].map((_, index) => (
                <Card key={index} className='flex flex-col'>
                  <CardHeader>
                    <Skeleton className='h-7 w-2/3' />
                  </CardHeader>
                  <CardContent className='flex-1'>
                    <Skeleton className='h-24 w-full' />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className='h-9 w-full' />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : !data?.diseases || data.diseases.length === 0 ? (
            <div className='flex flex-col items-center justify-center rounded-lg border p-8 text-center'>
              <Info className='mb-2 h-10 w-10 text-muted-foreground' />
              <h3 className='mb-2 text-lg font-semibold'>No diseases found</h3>
              <p className='text-muted-foreground'>Try different search terms or browse by letter.</p>
            </div>
          ) : (
            <>
              <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                {data.diseases.map((disease) => (
                  <Card
                    key={disease._id}
                    className='flex h-full flex-col transition-all hover:shadow-md cursor-pointer'
                    onClick={() => handleDiseaseClick(disease._id)}
                  >
                    <CardHeader>
                      <CardTitle>{disease.name}</CardTitle>
                    </CardHeader>
                    <CardContent className='flex-1'>
                      <CardDescription className='line-clamp-3 text-base'>{disease.description}</CardDescription>
                      {disease.symptoms && disease.symptoms.length > 0 && (
                        <div className='mt-4'>
                          <p className='font-medium'>Common symptoms:</p>
                          <div className='mt-2 flex flex-wrap gap-1'>
                            {disease.symptoms.slice(0, 3).map((symptom, idx) => (
                              <Badge key={idx} variant='outline' className='bg-primary/5'>
                                {symptom}
                              </Badge>
                            ))}
                            {disease.symptoms.length > 3 && (
                              <Badge variant='outline'>+{disease.symptoms.length - 3}</Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant='ghost'
                        className='w-full'
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDiseaseClick(disease._id)
                        }}
                      >
                        Learn more <ArrowRight className='ml-2 h-4 w-4' />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {data.pagination.totalPages > 1 && (
                <Pagination className='mt-8'>
                  <PaginationContent>
                    <PaginationItem>
                      {currentPage > 1 && (
                        <PaginationPrevious onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} />
                      )}
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
                        onClick={() => {
                          if (currentPage < (data.pagination.totalPages || 1)) {
                            setCurrentPage((prev) => Math.min(prev + 1, data.pagination.totalPages))
                          }
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </div>
      )}

      <div className='mt-16 rounded-lg bg-muted p-8'>
        <div className='flex flex-col items-center justify-center space-y-4 text-center'>
          <h2 className='text-2xl font-bold tracking-tight'>Health Resources</h2>
          <p className='mx-auto max-w-[600px] text-muted-foreground'>
            Access additional tools and resources to help you understand and manage your health.
          </p>
          <div className='mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            <Button
              variant='outline'
              className='h-auto flex flex-col py-6 gap-2'
              onClick={() => navigate(`${path.healthAZ}/symptoms`)}
            >
              <Stethoscope className='h-6 w-6 text-primary' />
              <span>Symptom Checker</span>
            </Button>
            <Button
              variant='outline'
              className='h-auto flex flex-col py-6 gap-2'
              onClick={() => navigate('/resources/health-calculator')}
            >
              <Calculator className='h-6 w-6 text-primary' />
              <span>Health Calculator</span>
            </Button>
            <Button
              variant='outline'
              className='h-auto flex flex-col py-6 gap-2'
              onClick={() => navigate(path.doctors)}
            >
              <UserMd className='h-6 w-6 text-primary' />
              <span>Find a Doctor</span>
            </Button>
            <Button
              variant='outline'
              className='h-auto flex flex-col py-6 gap-2'
              onClick={() => navigate('/resources/insurance-guide')}
            >
              <BookOpen className='h-6 w-6 text-primary' />
              <span>Insurance Guide</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper components for icons
const Calculator = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    {...props}
  >
    <rect x='4' y='2' width='16' height='20' rx='2' />
    <line x1='8' x2='16' y1='6' y2='6' />
    <line x1='16' x2='16' y1='14' y2='18' />
    <path d='M16 10h.01' />
    <path d='M12 10h.01' />
    <path d='M8 10h.01' />
    <path d='M12 14h.01' />
    <path d='M8 14h.01' />
    <path d='M12 18h.01' />
    <path d='M8 18h.01' />
  </svg>
)

const UserMd = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    {...props}
  >
    <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
    <circle cx='9' cy='7' r='4' />
    <path d='M19 8V6a2 2 0 0 0-2-2h-1' />
    <path d='M15 10h5' />
    <path d='M17.5 8v5' />
  </svg>
)

export default HealthAZPage
