/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Search, Activity, User, Heart, Star, MapPin, Calendar, Plus, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import doctorApi from '@/apis/doctors.api'
import healthApi from '@/apis/health.api'
import path from '@/constants/path'
import { toast } from 'sonner'

const SymptomSearchPage = () => {
  const navigate = useNavigate()
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [symptomInput, setSymptomInput] = useState('')
  const [openCommandMenu, setOpenCommandMenu] = useState(false)

  // Get common symptoms
  const { data: commonSymptomsData, isLoading: isLoadingSymptoms } = useQuery({
    queryKey: ['common-symptoms'],
    queryFn: () => healthApi.getCommonSymptoms().then((res) => res.data.result)
  })

  // Search doctors by symptom
  const searchMutation = useMutation({
    mutationFn: (symptom: string) => doctorApi.searchDoctorsBySymptom(symptom),
    onError: () => {
      toast('Failed to search doctors by symptom. Please try again.')
    }
  })

  const handleAddSymptom = (symptom: string) => {
    if (!symptom.trim() || symptoms.includes(symptom.trim())) return
    setSymptoms([...symptoms, symptom.trim()])
    setSymptomInput('')
    setOpenCommandMenu(false)

    // Search doctors when a new symptom is added
    if (symptoms.length === 0) {
      searchMutation.mutate(symptom.trim())
    }
  }

  const handleRemoveSymptom = (symptomToRemove: string) => {
    const updatedSymptoms = symptoms.filter((s) => s !== symptomToRemove)
    setSymptoms(updatedSymptoms)

    // Update search if there are still symptoms left
    if (updatedSymptoms.length > 0) {
      searchMutation.mutate(updatedSymptoms[0])
    } else {
      // Clear results if no symptoms left
      searchMutation.reset()
    }
  }

  const handleSearch = () => {
    if (symptoms.length > 0) {
      searchMutation.mutate(symptoms[0])
    }
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
          <Activity className='h-8 w-8 text-primary' />
        </div>
        <h1 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xlMedicinesPage'>
          Find a Doctor by Symptom
        </h1>
        <p className='mx-auto max-w-[700px] text-muted-foreground md:text-xl'>
          Tell us about your symptoms and we'll help you find the right specialist.
        </p>
      </div>

      <div className='mt-8 max-w-2xl mx-auto'>
        <Card className='mb-8'>
          <CardHeader>
            <CardTitle>What symptoms are you experiencing?</CardTitle>
            <CardDescription>Add your symptoms to find the most appropriate doctors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex flex-wrap gap-2 mb-4'>
              {symptoms.map((symptom) => (
                <Badge key={symptom} variant='secondary' className='flex items-center gap-1 pl-2'>
                  {symptom}
                  <Button
                    variant='ghost'
                    size='sm'
                    className='h-5 w-5 p-0 text-muted-foreground hover:text-foreground'
                    onClick={() => handleRemoveSymptom(symptom)}
                  >
                    <X className='h-3 w-3' />
                    <span className='sr-only'>Remove {symptom}</span>
                  </Button>
                </Badge>
              ))}
              {symptoms.length === 0 && (
                <div className='text-muted-foreground text-sm w-full text-center py-2'>
                  No symptoms added yet. Use the search below to add symptoms.
                </div>
              )}
            </div>

            <div className='flex gap-2'>
              <div className='relative flex-1'>
                <Search className='absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground' />
                <Input
                  type='text'
                  placeholder='Type a symptom...'
                  className='pl-10'
                  value={symptomInput}
                  onChange={(e) => setSymptomInput(e.target.value)}
                  onFocus={() => setOpenCommandMenu(true)}
                />
              </div>
              <Button onClick={() => setOpenCommandMenu(true)}>
                <Plus className='h-4 w-4 mr-2' />
                Add
              </Button>
            </div>

            <CommandDialog open={openCommandMenu} onOpenChange={setOpenCommandMenu}>
              <CommandInput placeholder='Search symptoms...' value={symptomInput} onValueChange={setSymptomInput} />
              <CommandList>
                <CommandEmpty>No symptoms found. Type to add a custom symptom.</CommandEmpty>
                <CommandGroup heading='Common Symptoms'>
                  {isLoadingSymptoms ? (
                    <div className='flex justify-center py-4'>
                      <Loader2 className='h-6 w-6 animate-spin text-primary' />
                    </div>
                  ) : (
                    commonSymptomsData?.map((symptom: string) => (
                      <CommandItem key={symptom} value={symptom} onSelect={handleAddSymptom}>
                        {symptom}
                      </CommandItem>
                    ))
                  )}
                </CommandGroup>
                {symptomInput.trim() && !commonSymptomsData?.includes(symptomInput.trim()) && (
                  <CommandGroup heading='Add Custom Symptom'>
                    <CommandItem value={symptomInput.trim()} onSelect={handleAddSymptom}>
                      <Plus className='h-4 w-4 mr-2' />
                      Add "{symptomInput.trim()}"
                    </CommandItem>
                  </CommandGroup>
                )}
              </CommandList>
            </CommandDialog>
          </CardContent>
          <CardFooter className='flex justify-between border-t px-6 py-4'>
            <Button
              variant='ghost'
              onClick={() => {
                setSymptoms([])
                searchMutation.reset()
              }}
            >
              Clear All
            </Button>
            <Button onClick={handleSearch} disabled={symptoms.length === 0 || searchMutation.isPending}>
              {searchMutation.isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Find Doctors
            </Button>
          </CardFooter>
        </Card>

        <div className='mb-4'>
          {symptoms.length > 0 && searchMutation.data && (
            <h2 className='text-xl font-semibold mb-6'>Recommended Doctors for {symptoms.join(', ')}</h2>
          )}
        </div>

        {searchMutation.isPending ? (
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
        ) : searchMutation.isError ? (
          <div className='flex flex-col items-center justify-center rounded-lg border border-destructive p-8 text-center text-destructive'>
            <Activity className='mb-2 h-10 w-10 text-destructive' />
            <h3 className='mb-2 text-lg font-semibold'>Error Finding Doctors</h3>
            <p>There was a problem searching for doctors. Please try again.</p>
            <Button variant='outline' className='mt-4' onClick={handleSearch}>
              Try Again
            </Button>
          </div>
        ) : searchMutation.isSuccess && searchMutation.data?.data?.result?.length === 0 ? (
          <div className='flex flex-col items-center justify-center rounded-lg border p-8 text-center'>
            <User className='mb-2 h-10 w-10 text-muted-foreground' />
            <h3 className='mb-2 text-lg font-semibold'>No Doctors Found</h3>
            <p className='text-muted-foreground'>
              We couldn't find any specialists for these symptoms. Try adding different symptoms or consult with a
              general practitioner.
            </p>
            <Button variant='outline' className='mt-4' onClick={() => navigate(path.doctors)}>
              Browse All Doctors
            </Button>
          </div>
        ) : searchMutation.data ? (
          <div className='space-y-4'>
            {searchMutation.data.data.result.map((doctor) => (
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
                            <BriefcaseIcon className='mr-1 h-4 w-4' />
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

            <div className='flex justify-center'>
              <Button variant='outline' onClick={() => navigate(path.doctors)}>
                Browse All Doctors
              </Button>
            </div>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center'>
            <Heart className='mb-2 h-10 w-10 text-muted-foreground' />
            <h3 className='mb-2 text-lg font-semibold'>Start by Adding Symptoms</h3>
            <p className='text-muted-foreground max-w-md'>
              Add the symptoms you're experiencing and we'll help you find the right specialist based on your needs.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// Helper component for Briefcase icon
const BriefcaseIcon = (props: any) => (
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

export default SymptomSearchPage
