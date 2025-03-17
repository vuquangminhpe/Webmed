import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, Search, AlertCircle, Loader2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useSearchDiseasesBySymptoms } from '@/hooks/useHealth'
import { Disease } from '@/types/Disease.type'
import path from '@/constants/path'
import { toast } from 'sonner'
import { Label } from '@/Components/ui/label'

const commonSymptoms = [
  'Fever',
  'Headache',
  'Cough',
  'Fatigue',
  'Nausea',
  'Dizziness',
  'Sore throat',
  'Muscle pain',
  'Shortness of breath',
  'Chest pain',
  'Runny nose',
  'Vomiting',
  'Diarrhea',
  'Loss of taste or smell',
  'Rash'
]

const SymptomCheckerPage = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [customSymptom, setCustomSymptom] = useState<string>('')
  const [results, setResults] = useState<Disease[] | null>(null)

  const searchDiseases = useSearchDiseasesBySymptoms()

  const filteredSymptoms = commonSymptoms.filter((symptom) => symptom.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleSymptomToggle = (symptom: string) => {
    setSelectedSymptoms((prev) => (prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]))
  }

  const handleAddCustomSymptom = () => {
    if (customSymptom.trim() === '') return

    if (!selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms((prev) => [...prev, customSymptom.trim()])
      setCustomSymptom('')
    } else {
      toast.error('This symptom is already in your list')
    }
  }

  const handleSearch = () => {
    if (selectedSymptoms.length === 0) {
      toast.error('Please select at least one symptom')
      return
    }

    searchDiseases.mutate(selectedSymptoms, {
      onSuccess: (data) => {
        setResults(data.data.result)
      },
      onError: () => {
        toast.error('Failed to analyze symptoms')
      }
    })
  }

  const handleClear = () => {
    setSelectedSymptoms([])
    setResults(null)
  }

  return (
    <div className='container py-10'>
      <div className='mx-auto max-w-4xl space-y-8'>
        <div className='flex flex-col items-center space-y-2 text-center'>
          <Activity className='h-12 w-12 text-primary' />
          <h1 className='text-3xl font-bold'>Symptom Checker</h1>
          <p className='text-muted-foreground'>
            Select your symptoms to get possible conditions and treatment suggestions.
          </p>
          <Alert variant='destructive' className='mt-4'>
            <AlertCircle className='h-4 w-4' />
            <AlertTitle>Medical Disclaimer</AlertTitle>
            <AlertDescription>
              This tool is for informational purposes only and not a substitute for professional medical advice. Always
              consult with a healthcare professional for medical concerns.
            </AlertDescription>
          </Alert>
        </div>

        <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Select Your Symptoms</CardTitle>
                <CardDescription>Choose all symptoms you are experiencing</CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='space-y-2'>
                  <Label htmlFor='symptom-search'>Search Symptoms</Label>
                  <div className='relative'>
                    <Search className='absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground' />
                    <Input
                      id='symptom-search'
                      placeholder='Type to search symptoms...'
                      className='pl-10'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <h3 className='mb-2 font-medium'>Common Symptoms</h3>
                  <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
                    {filteredSymptoms.map((symptom) => (
                      <div key={symptom} className='flex items-center space-x-2'>
                        <Checkbox
                          id={`symptom-${symptom}`}
                          checked={selectedSymptoms.includes(symptom)}
                          onCheckedChange={() => handleSymptomToggle(symptom)}
                        />
                        <Label htmlFor={`symptom-${symptom}`} className='text-sm font-normal'>
                          {symptom}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className='space-y-2'>
                  <Label>Add Custom Symptom</Label>
                  <div className='flex space-x-2'>
                    <Input
                      placeholder='Enter another symptom...'
                      value={customSymptom}
                      onChange={(e) => setCustomSymptom(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddCustomSymptom()
                        }
                      }}
                    />
                    <Button
                      type='button'
                      variant='secondary'
                      onClick={handleAddCustomSymptom}
                      disabled={!customSymptom.trim()}
                    >
                      <Plus className='h-4 w-4' />
                    </Button>
                  </div>
                </div>

                {selectedSymptoms.length > 0 && (
                  <div>
                    <h3 className='mb-2 font-medium'>Your Selected Symptoms:</h3>
                    <div className='flex flex-wrap gap-2'>
                      {selectedSymptoms.map((symptom) => (
                        <Badge
                          key={symptom}
                          variant='secondary'
                          className='cursor-pointer'
                          onClick={() => handleSymptomToggle(symptom)}
                        >
                          {symptom} &times;
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className='flex justify-between'>
                <Button variant='outline' onClick={handleClear} disabled={selectedSymptoms.length === 0}>
                  Clear All
                </Button>
                <Button onClick={handleSearch} disabled={selectedSymptoms.length === 0 || searchDiseases.isPending}>
                  {searchDiseases.isPending ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Analyzing...
                    </>
                  ) : (
                    'Check Symptoms'
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Possible Conditions</CardTitle>
                <CardDescription>Based on the symptoms you've selected</CardDescription>
              </CardHeader>
              <CardContent className='min-h-[300px]'>
                {searchDiseases.isPending ? (
                  <div className='flex h-[300px] items-center justify-center'>
                    <div className='flex flex-col items-center gap-2'>
                      <Loader2 className='h-8 w-8 animate-spin text-primary' />
                      <p>Analyzing your symptoms...</p>
                    </div>
                  </div>
                ) : !results ? (
                  <div className='flex h-[300px] flex-col items-center justify-center text-center'>
                    <Activity className='mb-2 h-10 w-10 text-muted-foreground' />
                    <h3 className='text-lg font-medium'>No Results Yet</h3>
                    <p className='text-muted-foreground'>
                      Select your symptoms and click "Check Symptoms" to see possible conditions.
                    </p>
                  </div>
                ) : results.length === 0 ? (
                  <div className='flex h-[300px] flex-col items-center justify-center text-center'>
                    <AlertCircle className='mb-2 h-10 w-10 text-muted-foreground' />
                    <h3 className='text-lg font-medium'>No Matching Conditions</h3>
                    <p className='text-muted-foreground'>
                      No conditions were found matching your selected symptoms. Try adding more symptoms or consult a
                      healthcare provider.
                    </p>
                  </div>
                ) : (
                  <div className='space-y-4'>
                    <p className='text-sm text-muted-foreground'>
                      Found {results.length} possible condition(s) matching your symptoms:
                    </p>
                    {results.map((disease) => (
                      <Card key={disease._id} className='cursor-pointer hover:bg-accent/50'>
                        <CardHeader className='pb-2'>
                          <CardTitle>{disease.name}</CardTitle>
                        </CardHeader>
                        <CardContent className='pb-2'>
                          <p className='text-sm text-muted-foreground line-clamp-2'>{disease.description}</p>
                          <div className='mt-2 flex flex-wrap gap-1'>
                            {disease.symptoms.slice(0, 3).map((symptom) => (
                              <Badge key={symptom} variant='outline'>
                                {symptom}
                              </Badge>
                            ))}
                            {disease.symptoms.length > 3 && (
                              <Badge variant='outline'>+{disease.symptoms.length - 3} more</Badge>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button
                            variant='ghost'
                            className='w-full'
                            onClick={() => navigate(`${path.healthAZ.replace(':id', disease._id)}`)}
                          >
                            View Details
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <div className='w-full text-center text-sm text-muted-foreground'>
                  For emergency medical situations, please call emergency services immediately.
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SymptomCheckerPage
