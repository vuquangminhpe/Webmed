import { useParams, Link } from 'react-router-dom'
import { Heart, ArrowLeft, AlertCircle, Pill, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useDisease } from '@/hooks/useHealth'
import { Skeleton } from '@/components/ui/skeleton'
import path from '@/constants/path'

const DiseaseDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const { data: disease, isLoading, error } = useDisease(id || '')

  if (isLoading) {
    return (
      <div className='container px-4 py-8 md:py-12'>
        <div className='flex items-center space-x-4'>
          <Button variant='ghost' size='icon' asChild>
            <Link to={path.healthAZ}>
              <ArrowLeft className='h-5 w-5' />
            </Link>
          </Button>
          <Skeleton className='h-9 w-72' />
        </div>

        <div className='mt-8 space-y-8'>
          <Skeleton className='h-40 w-full' />
          <Skeleton className='h-64 w-full' />
          <Skeleton className='h-64 w-full' />
        </div>
      </div>
    )
  }

  if (error || !disease) {
    return (
      <div className='container px-4 py-8 md:py-12'>
        <div className='flex items-center space-x-4'>
          <Button variant='ghost' size='icon' asChild>
            <Link to={path.healthAZ}>
              <ArrowLeft className='h-5 w-5' />
            </Link>
          </Button>
          <h1 className='text-2xl font-bold'>Error Loading Disease Information</h1>
        </div>

        <div className='mt-8 flex items-center justify-center rounded-lg border border-destructive p-8 text-center text-destructive'>
          <AlertCircle className='mr-2 h-6 w-6' />
          <p>
            There was an error loading the disease information. Please try again later or return to{' '}
            <Link to={path.healthAZ} className='font-medium underline'>
              Health A-Z
            </Link>
            .
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='container px-4 py-8 md:py-12'>
      <div className='flex items-center space-x-4'>
        <Button variant='ghost' size='icon' asChild>
          <Link to={path.healthAZ}>
            <ArrowLeft className='h-5 w-5' />
          </Link>
        </Button>
        <h1 className='text-2xl font-bold md:text-3xl'>{disease.name}</h1>
      </div>

      <div className='mt-8'>
        <Tabs defaultValue='overview'>
          <TabsList className='mb-6'>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='symptoms'>Symptoms</TabsTrigger>
            <TabsTrigger value='treatment'>Treatment</TabsTrigger>
            <TabsTrigger value='prevention'>Prevention</TabsTrigger>
          </TabsList>

          <TabsContent value='overview' className='space-y-6'>
            <div className='rounded-lg bg-muted p-6'>
              <h2 className='mb-4 text-xl font-semibold'>About {disease.name}</h2>
              <p className='text-muted-foreground'>{disease.description}</p>
            </div>

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <Card>
                <CardHeader>
                  <div className='flex items-center space-x-2'>
                    <Heart className='h-5 w-5 text-primary' />
                    <CardTitle>Key Facts</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className='list-inside list-disc space-y-2'>
                    <li>Affects approximately X% of the population</li>
                    <li>Most common in [age group/demographic]</li>
                    <li>Can be [acute/chronic] in nature</li>
                    <li>May require [type of treatment] for management</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className='flex items-center space-x-2'>
                    <AlertCircle className='h-5 w-5 text-primary' />
                    <CardTitle>When to See a Doctor</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className='list-inside list-disc space-y-2'>
                    <li>If you experience severe symptoms</li>
                    <li>When symptoms persist for more than [time period]</li>
                    <li>If you have underlying health conditions</li>
                    <li>For proper diagnosis and treatment plan</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
              <Card className='flex flex-col items-center p-6 text-center'>
                <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10'>
                  <Pill className='h-6 w-6 text-primary' />
                </div>
                <CardTitle className='mb-2'>Find Medications</CardTitle>
                <CardDescription>
                  Browse available medications for treating {disease.name.toLowerCase()}
                </CardDescription>
                <Button variant='ghost' className='mt-4' asChild>
                  <Link to={path.medicines}>Explore Medicines</Link>
                </Button>
              </Card>

              <Card className='flex flex-col items-center p-6 text-center'>
                <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10'>
                  <User className='h-6 w-6 text-primary' />
                </div>
                <CardTitle className='mb-2'>Consult a Specialist</CardTitle>
                <CardDescription>
                  Find healthcare professionals who specialize in {disease.name.toLowerCase()}
                </CardDescription>
                <Button variant='ghost' className='mt-4' asChild>
                  <Link to={path.doctors}>Find Doctors</Link>
                </Button>
              </Card>

              <Card className='flex flex-col items-center p-6 text-center'>
                <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10'>
                  <Heart className='h-6 w-6 text-primary' />
                </div>
                <CardTitle className='mb-2'>Support Resources</CardTitle>
                <CardDescription>
                  Access support groups and additional resources for {disease.name.toLowerCase()}
                </CardDescription>
                <Button variant='ghost' className='mt-4'>
                  View Resources
                </Button>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='symptoms' className='space-y-6'>
            <div className='rounded-lg bg-muted p-6'>
              <h2 className='mb-4 text-xl font-semibold'>Common Symptoms of {disease.name}</h2>
              <p className='text-muted-foreground'>
                {disease.symptoms && disease.symptoms.length > 0
                  ? 'The following symptoms are commonly associated with this condition. Symptoms may vary in intensity and not all individuals will experience all symptoms.'
                  : 'Information on specific symptoms for this condition is currently being updated.'}
              </p>
            </div>

            {disease.symptoms && disease.symptoms.length > 0 && (
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <Card>
                  <CardHeader>
                    <div className='flex items-center space-x-2'>
                      <AlertCircle className='h-5 w-5 text-primary' />
                      <CardTitle>Primary Symptoms</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className='list-inside list-disc space-y-2'>
                      {disease.symptoms.slice(0, Math.ceil(disease.symptoms.length / 2)).map((symptom, index) => (
                        <li key={index}>{symptom}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {disease.symptoms.length > 1 && (
                  <Card>
                    <CardHeader>
                      <div className='flex items-center space-x-2'>
                        <AlertCircle className='h-5 w-5 text-primary' />
                        <CardTitle>Additional Symptoms</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className='list-inside list-disc space-y-2'>
                        {disease.symptoms.slice(Math.ceil(disease.symptoms.length / 2)).map((symptom, index) => (
                          <li key={index}>{symptom}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            <Card>
              <CardHeader>
                <div className='flex items-center space-x-2'>
                  <AlertCircle className='h-5 w-5 text-destructive' />
                  <CardTitle>When to Seek Emergency Care</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className='mb-4 text-muted-foreground'>
                  Seek immediate medical attention if you experience any of the following:
                </p>
                <ul className='list-inside list-disc space-y-2'>
                  <li>Severe difficulty breathing</li>
                  <li>Persistent chest pain</li>
                  <li>Sudden severe headache</li>
                  <li>Sudden numbness or weakness</li>
                  <li>Severe abdominal pain</li>
                  <li>High fever with severe symptoms</li>
                </ul>
              </CardContent>
            </Card>

            <div className='mt-8 flex justify-center'>
              <Button asChild>
                <Link to={`${path.healthAZ}/symptoms`}>Use Symptom Checker</Link>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value='treatment' className='space-y-6'>
            <div className='rounded-lg bg-muted p-6'>
              <h2 className='mb-4 text-xl font-semibold'>Treatment Options for {disease.name}</h2>
              <p className='text-muted-foreground'>
                {disease.treatments && disease.treatments.length > 0
                  ? 'The following treatment approaches are commonly used for this condition. The specific treatment plan will depend on individual factors and should be determined by a healthcare professional.'
                  : 'Information on specific treatments for this condition is currently being updated.'}
              </p>
            </div>

            {disease.treatments && disease.treatments.length > 0 && (
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <Card>
                  <CardHeader>
                    <div className='flex items-center space-x-2'>
                      <Pill className='h-5 w-5 text-primary' />
                      <CardTitle>Medical Treatments</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className='list-inside list-disc space-y-2'>
                      {disease.treatments.map((treatment, index) => (
                        <li key={index}>{treatment}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className='flex items-center space-x-2'>
                      <Heart className='h-5 w-5 text-primary' />
                      <CardTitle>Lifestyle Recommendations</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className='list-inside list-disc space-y-2'>
                      <li>Dietary modifications</li>
                      <li>Regular physical activity as appropriate</li>
                      <li>Stress management techniques</li>
                      <li>Adequate rest and sleep</li>
                      <li>Avoiding triggers (if applicable)</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}

            <Card>
              <CardHeader>
                <div className='flex items-center space-x-2'>
                  <User className='h-5 w-5 text-primary' />
                  <CardTitle>Working With Your Healthcare Provider</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className='mb-4 text-muted-foreground'>
                  A comprehensive treatment plan for {disease.name.toLowerCase()} typically involves:
                </p>
                <ul className='list-inside list-disc space-y-2'>
                  <li>Regular check-ups to monitor condition</li>
                  <li>Adjusting medications as needed</li>
                  <li>Managing side effects of treatments</li>
                  <li>Addressing complications if they arise</li>
                  <li>Coordinating care with specialists if needed</li>
                </ul>
              </CardContent>
            </Card>

            <div className='mt-8 flex justify-center space-x-4'>
              <Button asChild>
                <Link to={path.medicines}>Browse Medications</Link>
              </Button>
              <Button variant='outline' asChild>
                <Link to={path.doctors}>Find a Specialist</Link>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value='prevention' className='space-y-6'>
            <div className='rounded-lg bg-muted p-6'>
              <h2 className='mb-4 text-xl font-semibold'>Prevention Strategies for {disease.name}</h2>
              <p className='text-muted-foreground'>
                {disease.prevention && disease.prevention.length > 0
                  ? 'The following preventive measures may help reduce the risk or severity of this condition. Not all conditions can be completely prevented, but these strategies may be beneficial.'
                  : 'Information on specific prevention strategies for this condition is currently being updated.'}
              </p>
            </div>

            {disease.prevention && disease.prevention.length > 0 && (
              <Card>
                <CardHeader>
                  <div className='flex items-center space-x-2'>
                    <Heart className='h-5 w-5 text-primary' />
                    <CardTitle>Preventive Measures</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className='list-inside list-disc space-y-2'>
                    {disease.prevention.map((prevention, index) => (
                      <li key={index}>{prevention}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <Card>
                <CardHeader>
                  <div className='flex items-center space-x-2'>
                    <AlertCircle className='h-5 w-5 text-primary' />
                    <CardTitle>Risk Factors</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className='mb-4 text-muted-foreground'>
                    Understanding risk factors can help with prevention efforts. Common risk factors include:
                  </p>
                  <ul className='list-inside list-disc space-y-2'>
                    <li>Family history and genetic factors</li>
                    <li>Age and gender considerations</li>
                    <li>Lifestyle factors (diet, exercise, etc.)</li>
                    <li>Environmental exposures</li>
                    <li>Pre-existing health conditions</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className='flex items-center space-x-2'>
                    <User className='h-5 w-5 text-primary' />
                    <CardTitle>Screening and Early Detection</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className='mb-4 text-muted-foreground'>
                    Regular health check-ups and screenings may help with early detection:
                  </p>
                  <ul className='list-inside list-disc space-y-2'>
                    <li>Regular physical examinations</li>
                    <li>Recommended screening tests</li>
                    <li>Monitoring for early symptoms</li>
                    <li>Discussing family history with healthcare providers</li>
                    <li>Following age-appropriate health guidelines</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className='mt-8 flex justify-center'>
              <Button asChild>
                <Link to='/resources/health-calculator'>Access Health Calculator</Link>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default DiseaseDetailPage
