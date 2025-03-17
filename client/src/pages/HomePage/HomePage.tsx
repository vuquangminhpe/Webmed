import { useNavigate } from 'react-router-dom'
import { Heart, Pill, Search, User, ArrowRight, BookOpen, MessageCircle, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import path from '@/constants/path'

const HomePage = () => {
  const navigate = useNavigate()

  return (
    <div className='flex flex-col'>
      <div className='bg-gradient-to-r from-primary/20 to-primary/5 py-16 md:py-24'>
        <div className='container flex flex-col items-center px-4 text-center md:px-6'>
          <h1 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>Your Health, Our Priority</h1>
          <p className='mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl'>
            WebMed provides instant medical assistance, online doctors, medicine delivery, and health awareness
            resources.
          </p>
          <div className='mt-8 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0'>
            <Button size='lg' onClick={() => navigate(path.healthAZ)}>
              Explore Health A-Z
            </Button>
            <Button size='lg' variant='outline' onClick={() => navigate(path.medicines)}>
              Browse Medicines
            </Button>
          </div>
        </div>
      </div>

      <div className='py-16 md:py-24'>
        <div className='container px-4 md:px-6'>
          <div className='flex flex-col items-center justify-center space-y-4 text-center'>
            <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>Key Features</h2>
            <p className='mx-auto max-w-[700px] text-muted-foreground md:text-xl'>
              WebMed offers comprehensive healthcare services designed to meet your needs.
            </p>
          </div>

          <div className='mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            <Card className='flex flex-col items-center text-center'>
              <CardHeader>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary/10'>
                  <Heart className='h-6 w-6 text-primary' />
                </div>
                <CardTitle className='mt-4'>Health A-Z</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Comprehensive information about diseases, symptoms, treatments, and prevention.
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button variant='ghost' onClick={() => navigate(path.healthAZ)}>
                  Explore <ArrowRight className='ml-2 h-4 w-4' />
                </Button>
              </CardFooter>
            </Card>

            <Card className='flex flex-col items-center text-center'>
              <CardHeader>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary/10'>
                  <Pill className='h-6 w-6 text-primary' />
                </div>
                <CardTitle className='mt-4'>Drugs & Supplements</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Online medicine delivery with detailed information about dosage and side effects.
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button variant='ghost' onClick={() => navigate(path.medicines)}>
                  Explore <ArrowRight className='ml-2 h-4 w-4' />
                </Button>
              </CardFooter>
            </Card>

            <Card className='flex flex-col items-center text-center'>
              <CardHeader>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary/10'>
                  <User className='h-6 w-6 text-primary' />
                </div>
                <CardTitle className='mt-4'>Find a Doctor</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Connect with qualified healthcare professionals based on your location and needs.
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button variant='ghost' onClick={() => navigate(path.doctors)}>
                  Explore <ArrowRight className='ml-2 h-4 w-4' />
                </Button>
              </CardFooter>
            </Card>

            <Card className='flex flex-col items-center text-center'>
              <CardHeader>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary/10'>
                  <Search className='h-6 w-6 text-primary' />
                </div>
                <CardTitle className='mt-4'>Symptom Checker</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Identify potential conditions based on your symptoms and get guidance on next steps.
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button variant='ghost' onClick={() => navigate(`${path.healthAZ}/symptoms`)}>
                  Explore <ArrowRight className='ml-2 h-4 w-4' />
                </Button>
              </CardFooter>
            </Card>

            <Card className='flex flex-col items-center text-center'>
              <CardHeader>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary/10'>
                  <BookOpen className='h-6 w-6 text-primary' />
                </div>
                <CardTitle className='mt-4'>Health Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Access health calculators, insurance guides, and educational materials.
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button variant='ghost' onClick={() => navigate('/resources')}>
                  Explore <ArrowRight className='ml-2 h-4 w-4' />
                </Button>
              </CardFooter>
            </Card>

            <Card className='flex flex-col items-center text-center'>
              <CardHeader>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary/10'>
                  <MessageCircle className='h-6 w-6 text-primary' />
                </div>
                <CardTitle className='mt-4'>Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Share your experience and help us improve our services to serve you better.
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button variant='ghost' onClick={() => navigate(path.feedback)}>
                  Explore <ArrowRight className='ml-2 h-4 w-4' />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {/* Latest Health News Section */}
      <div className='bg-muted py-16 md:py-24'>
        <div className='container px-4 md:px-6'>
          <div className='flex flex-col items-center justify-center space-y-4 text-center'>
            <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>Latest Health News</h2>
            <p className='mx-auto max-w-[700px] text-muted-foreground md:text-xl'>
              Stay informed with the latest health news and developments.
            </p>
          </div>

          <div className='mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {[1, 2, 3].map((i) => (
              <Card key={i} className='overflow-hidden'>
                <div className='aspect-video w-full bg-muted-foreground/20'></div>
                <CardHeader>
                  <CardTitle className='line-clamp-2'>Latest Health Research Reveals New Discoveries</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className='line-clamp-3'>
                    Recent studies have identified promising new approaches to treating common conditions, offering hope
                    for improved patient outcomes.
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <Button variant='ghost' className='w-full'>
                    Read more <ArrowRight className='ml-2 h-4 w-4' />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className='mt-12 flex justify-center'>
            <Button variant='outline' size='lg'>
              View all news
            </Button>
          </div>
        </div>
      </div>

      <div className='py-16 md:py-24'>
        <div className='container px-4 md:px-6'>
          <div className='flex flex-col items-center justify-center space-y-4 text-center'>
            <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>Our Impact</h2>
            <p className='mx-auto max-w-[700px] text-muted-foreground md:text-xl'>
              WebMed is committed to improving healthcare accessibility and outcomes.
            </p>
          </div>

          <div className='mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4'>
            <div className='flex flex-col items-center space-y-2 text-center'>
              <div className='flex h-16 w-16 items-center justify-center rounded-full bg-primary/10'>
                <Activity className='h-8 w-8 text-primary' />
              </div>
              <h3 className='text-3xl font-bold'>10K+</h3>
              <p className='text-muted-foreground'>Patients Served</p>
            </div>

            <div className='flex flex-col items-center space-y-2 text-center'>
              <div className='flex h-16 w-16 items-center justify-center rounded-full bg-primary/10'>
                <User className='h-8 w-8 text-primary' />
              </div>
              <h3 className='text-3xl font-bold'>500+</h3>
              <p className='text-muted-foreground'>Qualified Doctors</p>
            </div>

            <div className='flex flex-col items-center space-y-2 text-center'>
              <div className='flex h-16 w-16 items-center justify-center rounded-full bg-primary/10'>
                <Pill className='h-8 w-8 text-primary' />
              </div>
              <h3 className='text-3xl font-bold'>5K+</h3>
              <p className='text-muted-foreground'>Medicines Delivered</p>
            </div>

            <div className='flex flex-col items-center space-y-2 text-center'>
              <div className='flex h-16 w-16 items-center justify-center rounded-full bg-primary/10'>
                <Heart className='h-8 w-8 text-primary' />
              </div>
              <h3 className='text-3xl font-bold'>95%</h3>
              <p className='text-muted-foreground'>Customer Satisfaction</p>
            </div>
          </div>
        </div>
      </div>

      <div className='bg-primary py-16 text-primary-foreground md:py-24'>
        <div className='container px-4 md:px-6'>
          <div className='flex flex-col items-center justify-center space-y-4 text-center'>
            <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
              Ready to take control of your health?
            </h2>
            <p className='mx-auto max-w-[700px] md:text-xl'>
              Join WebMed today and access comprehensive healthcare services from anywhere.
            </p>
            <div className='mt-4 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0'>
              <Button size='lg' variant='secondary' onClick={() => navigate(path.register)}>
                Create an Account
              </Button>
              <Button size='lg' variant='outline' onClick={() => navigate(path.login)}>
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
