import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Search, AlertCircle, ArrowRight } from 'lucide-react'
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
import path from '@/constants/path'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

const HealthAZPage = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)
  const { data, isLoading, error } = useDiseases(currentPage, 10, selectedLetter ? `^${selectedLetter}` : searchQuery)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSelectedLetter(null)
    setCurrentPage(1)
  }

  const handleLetterClick = (letter: string) => {
    setSearchQuery('')
    setSelectedLetter(letter === selectedLetter ? null : letter)
    setCurrentPage(1)
  }

  const commonConditions = [
    { name: 'Diabetes', letter: 'D' },
    { name: 'Hypertension', letter: 'H' },
    { name: 'Asthma', letter: 'A' },
    { name: 'Arthritis', letter: 'A' },
    { name: 'Depression', letter: 'D' },
    { name: 'Anxiety', letter: 'A' }
  ]

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
            className='h-10 w-10 p-0'
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
              <Card key={condition.name} className='flex flex-col'>
                <CardHeader>
                  <CardTitle>{condition.name}</CardTitle>
                </CardHeader>
                <CardContent className='flex-1'>
                  <CardDescription>
                    Learn about symptoms, causes, treatment, and prevention of {condition.name.toLowerCase()}.
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <Button
                    variant='ghost'
                    className='w-full'
                    onClick={() => navigate(`${path.healthAZ}/${condition.name.toLowerCase()}`)}
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
            <div className='flex items-center justify-center rounded-lg border border-destructive p-4 text-destructive'>
              <AlertCircle className='mr-2 h-5 w-5' />
              <p>Error loading diseases. Please try again later.</p>
            </div>
          )}

          {!isLoading && data?.diseases && data.diseases.length === 0 && (
            <div className='flex items-center justify-center rounded-lg border p-8 text-center'>
              <div>
                <p className='mb-2 text-lg font-medium'>No diseases found</p>
                <p className='text-muted-foreground'>Try different search terms or browse by letter.</p>
              </div>
            </div>
          )}

          {!isLoading && data?.diseases && data.diseases.length > 0 && (
            <>
              <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                {data.diseases.map((disease) => (
                  <Card key={disease._id} className='flex flex-col'>
                    <CardHeader>
                      <CardTitle>{disease.name}</CardTitle>
                    </CardHeader>
                    <CardContent className='flex-1'>
                      <CardDescription className='line-clamp-3'>{disease.description}</CardDescription>
                      {disease.symptoms.length > 0 && (
                        <div className='mt-4'>
                          <p className='font-medium'>Common symptoms:</p>
                          <p className='line-clamp-2 text-sm text-muted-foreground'>
                            {disease.symptoms.slice(0, 3).join(', ')}
                            {disease.symptoms.length > 3 && '...'}
                          </p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant='ghost'
                        className='w-full'
                        onClick={() => navigate(`${path.healthAZ.replace(':id', disease._id)}`)}
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
                          if (currentPage < data.pagination.totalPages) {
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
          <div className='mt-4 flex flex-wrap justify-center gap-4'>
            <Button variant='outline' onClick={() => navigate(`${path.healthAZ}/symptoms`)}>
              Symptom Checker
            </Button>
            <Button variant='outline' onClick={() => navigate('/resources/health-calculator')}>
              Health Calculator
            </Button>
            <Button variant='outline' onClick={() => navigate(path.doctors)}>
              Find a Doctor
            </Button>
            <Button variant='outline' onClick={() => navigate('/resources/insurance-guide')}>
              Insurance Guide
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HealthAZPage
