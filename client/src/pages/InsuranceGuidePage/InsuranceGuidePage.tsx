import { FileText, Shield, Search, DollarSign, HelpCircle, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'

const InsuranceGuidePage = () => {
  return (
    <div className='container py-10'>
      <div className='mx-auto max-w-4xl space-y-8'>
        <div className='flex flex-col items-center space-y-2 text-center'>
          <Shield className='h-12 w-12 text-primary' />
          <h1 className='text-3xl font-bold'>Health Insurance Guide</h1>
          <p className='text-muted-foreground'>
            Understanding health insurance can be complex. Use this guide to learn about coverage options, terms, and
            how to maximize your benefits.
          </p>
        </div>

        <div className='relative'>
          <div className='absolute inset-0 flex items-center'>
            <Separator />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background px-2 text-muted-foreground'>Quick Search</span>
          </div>
        </div>

        <div className='flex items-center space-x-2'>
          <div className='relative flex-1'>
            <Search className='absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground' />
            <Input type='search' placeholder='Search health insurance topics...' className='pl-10' />
          </div>
          <Button>Search</Button>
        </div>

        <Tabs defaultValue='basics' className='w-full'>
          <TabsList className='grid w-full grid-cols-3 lg:grid-cols-5'>
            <TabsTrigger value='basics'>Basics</TabsTrigger>
            <TabsTrigger value='plans'>Plan Types</TabsTrigger>
            <TabsTrigger value='terms'>Key Terms</TabsTrigger>
            <TabsTrigger value='coverage'>Coverage</TabsTrigger>
            <TabsTrigger value='faq'>FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value='basics' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Health Insurance Basics</CardTitle>
                <CardDescription>An overview of how health insurance works and why it's important.</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <p>
                  Health insurance is a contract between you and an insurance company. You pay premiums, and the company
                  agrees to pay some or all of your healthcare costs when you get sick or injured.
                </p>

                <div className='rounded-lg bg-muted p-4'>
                  <h3 className='mb-2 font-medium'>Why Health Insurance Matters</h3>
                  <ul className='ml-6 list-disc space-y-2'>
                    <li>
                      <span className='font-medium'>Financial Protection:</span> Guards against high medical costs from
                      unexpected illnesses or injuries
                    </li>
                    <li>
                      <span className='font-medium'>Preventive Care:</span> Many plans cover preventive services at no
                      cost
                    </li>
                    <li>
                      <span className='font-medium'>Negotiated Rates:</span> Insurance companies negotiate lower rates
                      with healthcare providers
                    </li>
                    <li>
                      <span className='font-medium'>Peace of Mind:</span> Knowing you have coverage if something happens
                    </li>
                  </ul>
                </div>

                <h3 className='font-medium'>How Insurance Works</h3>
                <ol className='ml-6 list-decimal space-y-2'>
                  <li>
                    <span className='font-medium'>You choose and enroll in a plan</span>, either through your employer,
                    marketplace, or directly with an insurer
                  </li>
                  <li>
                    <span className='font-medium'>You pay monthly premiums</span> to keep your coverage active
                  </li>
                  <li>
                    <span className='font-medium'>When you need care</span>, you present your insurance card at the
                    provider's office
                  </li>
                  <li>
                    <span className='font-medium'>The provider bills your insurance</span> for covered services
                  </li>
                  <li>
                    <span className='font-medium'>You pay your share</span> of the costs (deductible, copay, or
                    coinsurance)
                  </li>
                  <li>
                    <span className='font-medium'>Your insurance pays its share</span> according to your plan's benefits
                  </li>
                </ol>
              </CardContent>
            </Card>

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <DollarSign className='h-5 w-5 text-primary' />
                    Cost Sharing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='mb-4'>
                    Most health insurance plans involve some form of cost sharing between you and the insurance company:
                  </p>
                  <ul className='space-y-3'>
                    <li className='flex items-start'>
                      <Badge className='mt-1 mr-2'>Premium</Badge>
                      <span>The amount you pay for your health insurance every month</span>
                    </li>
                    <li className='flex items-start'>
                      <Badge className='mt-1 mr-2'>Deductible</Badge>
                      <span>The amount you pay before your insurance begins to pay</span>
                    </li>
                    <li className='flex items-start'>
                      <Badge className='mt-1 mr-2'>Copayment</Badge>
                      <span>A fixed amount you pay for a covered service (e.g., $25 per doctor visit)</span>
                    </li>
                    <li className='flex items-start'>
                      <Badge className='mt-1 mr-2'>Coinsurance</Badge>
                      <span>The percentage of costs you pay after meeting your deductible (e.g., 20%)</span>
                    </li>
                    <li className='flex items-start'>
                      <Badge className='mt-1 mr-2'>Out-of-pocket maximum</Badge>
                      <span>The most you'll pay during a policy period (usually one year)</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Shield className='h-5 w-5 text-primary' />
                    Coverage Types
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='mb-4'>Health insurance typically covers several types of care:</p>
                  <ul className='space-y-3'>
                    <li className='flex items-start'>
                      <CheckCircle className='mt-0.5 mr-2 h-4 w-4 text-green-500' />
                      <span>
                        <span className='font-medium'>Preventive care:</span> Regular check-ups, screenings, and
                        vaccinations
                      </span>
                    </li>
                    <li className='flex items-start'>
                      <CheckCircle className='mt-0.5 mr-2 h-4 w-4 text-green-500' />
                      <span>
                        <span className='font-medium'>Medical care:</span> Doctor visits, specialists, and treatments
                      </span>
                    </li>
                    <li className='flex items-start'>
                      <CheckCircle className='mt-0.5 mr-2 h-4 w-4 text-green-500' />
                      <span>
                        <span className='font-medium'>Emergency care:</span> ER visits and ambulance services
                      </span>
                    </li>
                    <li className='flex items-start'>
                      <CheckCircle className='mt-0.5 mr-2 h-4 w-4 text-green-500' />
                      <span>
                        <span className='font-medium'>Hospital stays:</span> Room, board, and related services
                      </span>
                    </li>
                    <li className='flex items-start'>
                      <CheckCircle className='mt-0.5 mr-2 h-4 w-4 text-green-500' />
                      <span>
                        <span className='font-medium'>Prescription drugs:</span> Medications prescribed by a healthcare
                        provider
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='plans' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Types of Health Insurance Plans</CardTitle>
                <CardDescription>
                  There are several types of health insurance plans, each with different provider networks, costs, and
                  benefits.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='rounded-lg border p-4'>
                  <h3 className='mb-3 text-lg font-medium'>Health Maintenance Organization (HMO)</h3>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-5'>
                    <div className='md:col-span-3'>
                      <p className='mb-2'>
                        HMOs require you to choose a primary care physician (PCP) who coordinates your care. You
                        generally need referrals from your PCP to see specialists.
                      </p>

                      <div className='mt-4 space-y-2'>
                        <div className='flex items-start'>
                          <CheckCircle className='mt-0.5 mr-2 h-4 w-4 text-green-500' />
                          <span>Lower out-of-pocket costs and premiums</span>
                        </div>
                        <div className='flex items-start'>
                          <CheckCircle className='mt-0.5 mr-2 h-4 w-4 text-green-500' />
                          <span>Less paperwork</span>
                        </div>
                        <div className='flex items-start'>
                          <AlertCircle className='mt-0.5 mr-2 h-4 w-4 text-red-500' />
                          <span>Less flexibility in choosing healthcare providers</span>
                        </div>
                        <div className='flex items-start'>
                          <AlertCircle className='mt-0.5 mr-2 h-4 w-4 text-red-500' />
                          <span>No coverage for out-of-network care (except emergencies)</span>
                        </div>
                      </div>
                    </div>
                    <div className='md:col-span-2'>
                      <div className='rounded-md bg-muted p-3'>
                        <h4 className='mb-2 font-medium'>Best For</h4>
                        <ul className='list-inside list-disc space-y-1 text-sm'>
                          <li>Individuals looking for lower premiums</li>
                          <li>Those who don't mind using a PCP as a coordinator</li>
                          <li>People who primarily need preventive care</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='rounded-lg border p-4'>
                  <h3 className='mb-3 text-lg font-medium'>Preferred Provider Organization (PPO)</h3>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-5'>
                    <div className='md:col-span-3'>
                      <p className='mb-2'>
                        PPOs give you more flexibility in choosing healthcare providers. You don't need a primary care
                        physician, and you can see specialists without referrals.
                      </p>

                      <div className='mt-4 space-y-2'>
                        <div className='flex items-start'>
                          <CheckCircle className='mt-0.5 mr-2 h-4 w-4 text-green-500' />
                          <span>More flexibility in choosing providers</span>
                        </div>
                        <div className='flex items-start'>
                          <CheckCircle className='mt-0.5 mr-2 h-4 w-4 text-green-500' />
                          <span>No referrals needed for specialists</span>
                        </div>
                        <div className='flex items-start'>
                          <CheckCircle className='mt-0.5 mr-2 h-4 w-4 text-green-500' />
                          <span>Some coverage for out-of-network care</span>
                        </div>
                        <div className='flex items-start'>
                          <AlertCircle className='mt-0.5 mr-2 h-4 w-4 text-red-500' />
                          <span>Higher premiums and out-of-pocket costs</span>
                        </div>
                      </div>
                    </div>
                    <div className='md:col-span-2'>
                      <div className='rounded-md bg-muted p-3'>
                        <h4 className='mb-2 font-medium'>Best For</h4>
                        <ul className='list-inside list-disc space-y-1 text-sm'>
                          <li>Those who want flexibility in provider choice</li>
                          <li>People who see specialists frequently</li>
                          <li>Individuals willing to pay higher premiums for more options</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='rounded-lg border p-4'>
                  <h3 className='mb-3 text-lg font-medium'>Exclusive Provider Organization (EPO)</h3>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-5'>
                    <div className='md:col-span-3'>
                      <p className='mb-2'>
                        EPOs combine elements of HMOs and PPOs. You don't need a primary care physician or referrals,
                        but you must use providers in the network except in emergencies.
                      </p>

                      <div className='mt-4 space-y-2'>
                        <div className='flex items-start'>
                          <CheckCircle className='mt-0.5 mr-2 h-4 w-4 text-green-500' />
                          <span>No referrals needed for specialists</span>
                        </div>
                        <div className='flex items-start'>
                          <CheckCircle className='mt-0.5 mr-2 h-4 w-4 text-green-500' />
                          <span>Lower premiums than PPOs</span>
                        </div>
                        <div className='flex items-start'>
                          <AlertCircle className='mt-0.5 mr-2 h-4 w-4 text-red-500' />
                          <span>No coverage for out-of-network care (except emergencies)</span>
                        </div>
                      </div>
                    </div>
                    <div className='md:col-span-2'>
                      <div className='rounded-md bg-muted p-3'>
                        <h4 className='mb-2 font-medium'>Best For</h4>
                        <ul className='list-inside list-disc space-y-1 text-sm'>
                          <li>Those who want lower premiums than a PPO</li>
                          <li>People who don't want to coordinate care through a PCP</li>
                          <li>Individuals who are comfortable staying in-network</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='rounded-lg border p-4'>
                  <h3 className='mb-3 text-lg font-medium'>High-Deductible Health Plan (HDHP) with HSA</h3>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-5'>
                    <div className='md:col-span-3'>
                      <p className='mb-2'>
                        HDHPs have higher deductibles but lower premiums. They're often paired with Health Savings
                        Accounts (HSAs), which allow you to save pre-tax money for healthcare expenses.
                      </p>

                      <div className='mt-4 space-y-2'>
                        <div className='flex items-start'>
                          <CheckCircle className='mt-0.5 mr-2 h-4 w-4 text-green-500' />
                          <span>Lower monthly premiums</span>
                        </div>
                        <div className='flex items-start'>
                          <CheckCircle className='mt-0.5 mr-2 h-4 w-4 text-green-500' />
                          <span>Tax-advantaged HSA for healthcare expenses</span>
                        </div>
                        <div className='flex items-start'>
                          <AlertCircle className='mt-0.5 mr-2 h-4 w-4 text-red-500' />
                          <span>Higher deductibles before insurance coverage kicks in</span>
                        </div>
                      </div>
                    </div>
                    <div className='md:col-span-2'>
                      <div className='rounded-md bg-muted p-3'>
                        <h4 className='mb-2 font-medium'>Best For</h4>
                        <ul className='list-inside list-disc space-y-1 text-sm'>
                          <li>Healthy individuals who rarely need medical care</li>
                          <li>Those who want to save on premiums</li>
                          <li>People who can afford to pay higher costs if they need care</li>
                          <li>Individuals looking for tax advantages through HSAs</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Choosing the Right Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='mb-4'>
                  When selecting a health insurance plan, consider these key factors to find the best match for your
                  needs:
                </p>

                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div className='rounded-md border p-3'>
                    <h4 className='mb-2 font-medium'>Your Health Needs</h4>
                    <ul className='list-inside list-disc text-sm text-muted-foreground'>
                      <li>Current health conditions</li>
                      <li>Prescription medications</li>
                      <li>Frequency of doctor visits</li>
                      <li>Planned procedures or treatments</li>
                    </ul>
                  </div>

                  <div className='rounded-md border p-3'>
                    <h4 className='mb-2 font-medium'>Preferred Providers</h4>
                    <ul className='list-inside list-disc text-sm text-muted-foreground'>
                      <li>Current doctors and hospitals</li>
                      <li>Specialists you may need</li>
                      <li>Convenient locations</li>
                    </ul>
                  </div>

                  <div className='rounded-md border p-3'>
                    <h4 className='mb-2 font-medium'>Financial Considerations</h4>
                    <ul className='list-inside list-disc text-sm text-muted-foreground'>
                      <li>Monthly premium costs</li>
                      <li>Deductible amount</li>
                      <li>Potential out-of-pocket expenses</li>
                      <li>Budgetary constraints</li>
                    </ul>
                  </div>

                  <div className='rounded-md border p-3'>
                    <h4 className='mb-2 font-medium'>Plan Benefits</h4>
                    <ul className='list-inside list-disc text-sm text-muted-foreground'>
                      <li>Covered services</li>
                      <li>Prescription drug coverage</li>
                      <li>Mental health services</li>
                      <li>Additional perks (telemedicine, wellness programs)</li>
                    </ul>
                  </div>
                </div>

                <Alert className='mt-6'>
                  <HelpCircle className='h-4 w-4' />
                  <AlertTitle>Need help comparing plans?</AlertTitle>
                  <AlertDescription>
                    Our insurance specialists can help you understand your options and choose the best plan for your
                    needs. Contact us for a personalized consultation.
                  </AlertDescription>
                </Alert>
              </CardContent>
              <CardFooter>
                <Button className='w-full' onClick={() => (window.location.href = '/consultation')}>
                  Schedule a Consultation
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value='terms' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Key Insurance Terms</CardTitle>
                <CardDescription>
                  Understanding these common terms will help you navigate your health insurance policy.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div className='rounded-md border p-4'>
                    <h3 className='mb-2 font-medium'>Premium</h3>
                    <p className='text-muted-foreground'>
                      The amount you pay to your insurance company for your plan, usually monthly. You pay this even if
                      you don't use medical services.
                    </p>
                  </div>

                  <div className='rounded-md border p-4'>
                    <h3 className='mb-2 font-medium'>Deductible</h3>
                    <p className='text-muted-foreground'>
                      The amount you pay for covered healthcare services before your insurance plan starts to pay.
                      Higher deductible plans typically have lower premiums.
                    </p>
                  </div>

                  <div className='rounded-md border p-4'>
                    <h3 className='mb-2 font-medium'>Copayment</h3>
                    <p className='text-muted-foreground'>
                      A fixed amount you pay for a covered healthcare service, usually when you receive the service
                      (e.g., $20 for a doctor visit).
                    </p>
                  </div>

                  <div className='rounded-md border p-4'>
                    <h3 className='mb-2 font-medium'>Coinsurance</h3>
                    <p className='text-muted-foreground'>
                      The percentage of costs you pay for a covered health service after you've met your deductible
                      (e.g., 20% of the allowed amount).
                    </p>
                  </div>

                  <div className='rounded-md border p-4'>
                    <h3 className='mb-2 font-medium'>Out-of-Pocket Maximum</h3>
                    <p className='text-muted-foreground'>
                      The most you could pay during a policy period (usually one year) for covered services. After you
                      reach this limit, the insurance company pays 100% of covered costs.
                    </p>
                  </div>

                  <div className='rounded-md border p-4'>
                    <h3 className='mb-2 font-medium'>Network</h3>
                    <p className='text-muted-foreground'>
                      The facilities, providers, and suppliers your insurance company has contracted with to provide
                      healthcare services at negotiated rates.
                    </p>
                  </div>

                  <div className='rounded-md border p-4'>
                    <h3 className='mb-2 font-medium'>In-Network Provider</h3>
                    <p className='text-muted-foreground'>
                      A healthcare provider who has a contract with your insurance company. You'll typically pay less
                      when using in-network providers.
                    </p>
                  </div>

                  <div className='rounded-md border p-4'>
                    <h3 className='mb-2 font-medium'>Out-of-Network Provider</h3>
                    <p className='text-muted-foreground'>
                      A provider who doesn't have a contract with your insurance company. You'll usually pay more when
                      using out-of-network providers.
                    </p>
                  </div>

                  <div className='rounded-md border p-4'>
                    <h3 className='mb-2 font-medium'>Prior Authorization</h3>
                    <p className='text-muted-foreground'>
                      Approval from your insurance company required before you receive certain services, treatments, or
                      prescriptions for them to be covered.
                    </p>
                  </div>

                  <div className='rounded-md border p-4'>
                    <h3 className='mb-2 font-medium'>Explanation of Benefits (EOB)</h3>
                    <p className='text-muted-foreground'>
                      A statement from your insurance company explaining what costs they will cover for a medical
                      service you received. An EOB is not a bill.
                    </p>
                  </div>

                  <div className='rounded-md border p-4'>
                    <h3 className='mb-2 font-medium'>Formulary</h3>
                    <p className='text-muted-foreground'>
                      A list of prescription drugs covered by your insurance plan, often divided into tiers that
                      determine how much you pay.
                    </p>
                  </div>

                  <div className='rounded-md border p-4'>
                    <h3 className='mb-2 font-medium'>Open Enrollment Period</h3>
                    <p className='text-muted-foreground'>
                      The annual period when you can enroll in or change your health insurance plan. Outside this
                      period, you need a qualifying life event to make changes.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant='outline' className='w-full' onClick={() => (window.location.href = '/glossary')}>
                  <FileText className='mr-2 h-4 w-4' />
                  View Complete Glossary
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value='coverage' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>What's Covered</CardTitle>
                <CardDescription>
                  Most health insurance plans cover a range of services, but specifics can vary by plan.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-6'>
                  <div className='rounded-lg bg-muted p-4'>
                    <h3 className='mb-3 text-lg font-medium'>Essential Health Benefits</h3>
                    <p className='mb-2'>
                      Under the Affordable Care Act, all marketplace plans and many other plans must cover these
                      essential health benefits:
                    </p>
                    <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                      <div className='flex items-start'>
                        <CheckCircle className='mt-0.5 mr-2 h-4 w-4 text-green-500' />
                        <span>Ambulatory patient services (outpatient care)</span>
                      </div>
                      <div className='flex items-start'>
                        <CheckCircle className='mt-0.5 mr-2 h-4 w-4 text-green-500' />
                        <span>Emergency services</span>
                      </div>
                      <div className='flex items-start'>
                        <CheckCircle className='mt-0.5 mr-2 h-4 w-4 text-green-500' />
                        <span>Hospitalization</span>
                      </div>
                      <div className='flex items-start'>
                        <CheckCircle className='mt-0.5 mr-2 h-4 w-4 text-green-500' />
                        <span>Maternity and newborn care</span>
                      </div>
                      <div className='flex items-start'>
                        <CheckCircle className='mt-0.5 mr-2 h-4 w-4 text-green-500' />
                        <span>Mental health and substance use disorder services</span>
                      </div>
                      <div className='flex items-start'>
                        <CheckCircle className='mt-0.5 mr-2 h-4 w-4 text-green-500' />
                        <span>Prescription drugs</span>
                      </div>
                      <div className='flex items-start'>
                        <CheckCircle className='mt-0.5 mr-2 h-4 w-4 text-green-500' />
                        <span>Rehabilitative services and devices</span>
                      </div>
                      <div className='flex items-start'>
                        <CheckCircle className='mt-0.5 mr-2 h-4 w-4 text-green-500' />
                        <span>Laboratory services</span>
                      </div>
                      <div className='flex items-start'>
                        <CheckCircle className='mt-0.5 mr-2 h-4 w-4 text-green-500' />
                        <span>Preventive and wellness services</span>
                      </div>
                      <div className='flex items-start'>
                        <CheckCircle className='mt-0.5 mr-2 h-4 w-4 text-green-500' />
                        <span>Pediatric services, including dental and vision</span>
                      </div>
                    </div>
                  </div>

                  <div className='rounded-lg border p-4'>
                    <h3 className='mb-3 text-lg font-medium'>Preventive Services</h3>
                    <p className='mb-2'>
                      Most health plans must cover preventive services at no cost to you when delivered by an in-network
                      provider. This includes:
                    </p>
                    <div className='space-y-3'>
                      <div>
                        <h4 className='font-medium'>Adults</h4>
                        <ul className='ml-6 list-disc text-muted-foreground'>
                          <li>Blood pressure, cholesterol, and diabetes screenings</li>
                          <li>Immunizations for flu, pneumonia, and more</li>
                          <li>Cancer screenings (colorectal, breast, lung)</li>
                          <li>Depression screenings</li>
                          <li>Diet counseling</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className='font-medium'>Women</h4>
                        <ul className='ml-6 list-disc text-muted-foreground'>
                          <li>Well-woman visits</li>
                          <li>Contraception and contraceptive counseling</li>
                          <li>Mammograms and cervical cancer screenings</li>
                          <li>Osteoporosis screening</li>
                          <li>Prenatal care</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className='font-medium'>Children</h4>
                        <ul className='ml-6 list-disc text-muted-foreground'>
                          <li>Well-baby and well-child visits</li>
                          <li>Immunizations</li>
                          <li>Vision and hearing screenings</li>
                          <li>Developmental assessments</li>
                          <li>Autism screening</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Alert>
                    <AlertCircle className='h-4 w-4' />
                    <AlertTitle>Important Note</AlertTitle>
                    <AlertDescription>
                      Coverage details can vary by plan. Always check your specific plan's summary of benefits or call
                      your insurer to confirm what's covered before receiving care.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Common Coverage Exceptions</CardTitle>
                <CardDescription>
                  Services that are often limited or not covered by standard health insurance plans.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <div className='flex items-start'>
                    <AlertCircle className='mt-0.5 mr-2 h-4 w-4 text-red-500' />
                    <div>
                      <h3 className='font-medium'>Cosmetic Procedures</h3>
                      <p className='text-sm text-muted-foreground'>
                        Procedures performed for aesthetic reasons rather than medical necessity are typically not
                        covered (e.g., cosmetic surgery, Botox).
                      </p>
                    </div>
                  </div>

                  <div className='flex items-start'>
                    <AlertCircle className='mt-0.5 mr-2 h-4 w-4 text-red-500' />
                    <div>
                      <h3 className='font-medium'>Dental and Vision Care</h3>
                      <p className='text-sm text-muted-foreground'>
                        Most health plans don't include routine dental or vision care for adults. Separate dental and
                        vision plans are available.
                      </p>
                    </div>
                  </div>

                  <div className='flex items-start'>
                    <AlertCircle className='mt-0.5 mr-2 h-4 w-4 text-red-500' />
                    <div>
                      <h3 className='font-medium'>Alternative Therapies</h3>
                      <p className='text-sm text-muted-foreground'>
                        Treatments such as acupuncture, chiropractic care, and massage therapy may have limited coverage
                        or none at all.
                      </p>
                    </div>
                  </div>

                  <div className='flex items-start'>
                    <AlertCircle className='mt-0.5 mr-2 h-4 w-4 text-red-500' />
                    <div>
                      <h3 className='font-medium'>Weight Loss Programs</h3>
                      <p className='text-sm text-muted-foreground'>
                        Most diet programs and non-medical weight loss treatments aren't covered, though medically
                        necessary obesity treatment might be.
                      </p>
                    </div>
                  </div>

                  <div className='flex items-start'>
                    <AlertCircle className='mt-0.5 mr-2 h-4 w-4 text-red-500' />
                    <div>
                      <h3 className='font-medium'>Experimental Treatments</h3>
                      <p className='text-sm text-muted-foreground'>
                        Treatments, procedures, or drugs that are considered experimental or investigational are often
                        excluded from coverage.
                      </p>
                    </div>
                  </div>

                  <div className='flex items-start'>
                    <AlertCircle className='mt-0.5 mr-2 h-4 w-4 text-red-500' />
                    <div>
                      <h3 className='font-medium'>Long-Term Care</h3>
                      <p className='text-sm text-muted-foreground'>
                        Custodial care, nursing home care, and other long-term services are typically not covered by
                        standard health insurance.
                      </p>
                    </div>
                  </div>

                  <div className='flex items-start'>
                    <AlertCircle className='mt-0.5 mr-2 h-4 w-4 text-red-500' />
                    <div>
                      <h3 className='font-medium'>Out-of-Network Care</h3>
                      <p className='text-sm text-muted-foreground'>
                        Services from providers who aren't in your plan's network may have limited coverage or none at
                        all, particularly with HMO plans.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className='text-center text-sm text-muted-foreground'>
                  Always check your specific plan documents for detailed information about exclusions and limitations.
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value='faq' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Common questions about health insurance coverage and policies.</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type='single' collapsible className='w-full'>
                  <AccordionItem value='item-1'>
                    <AccordionTrigger>What happens if I miss the open enrollment period?</AccordionTrigger>
                    <AccordionContent>
                      <p>
                        If you miss the annual open enrollment period, you generally cannot enroll in or change health
                        insurance until the next open enrollment period unless you experience a qualifying life event.
                        These events include:
                      </p>
                      <ul className='mt-2 ml-6 list-disc text-muted-foreground'>
                        <li>Marriage, divorce, or death of a spouse</li>
                        <li>Having a baby or adopting a child</li>
                        <li>Moving to a new area with different health plan options</li>
                        <li>Losing other health coverage (e.g., losing job-based coverage)</li>
                        <li>Changes in income that affect coverage eligibility</li>
                      </ul>
                      <p className='mt-2'>
                        If you experience a qualifying event, you can enroll during a Special Enrollment Period,
                        typically 60 days from the event.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value='item-2'>
                    <AccordionTrigger>Can I keep my current doctor when I switch insurance plans?</AccordionTrigger>
                    <AccordionContent>
                      <p>
                        Whether you can keep your current doctor when switching insurance plans depends on whether your
                        doctor is in the new plan's network. To ensure continuity of care:
                      </p>
                      <ul className='mt-2 ml-6 list-disc text-muted-foreground'>
                        <li>Check the new plan's provider directory before enrolling</li>
                        <li>
                          Call your doctor's office to confirm they accept the specific plan you're considering
                          (provider directories aren't always up-to-date)
                        </li>
                        <li>
                          Consider a PPO plan if provider choice is important to you, as these plans offer more
                          flexibility
                        </li>
                        <li>
                          If your doctor isn't in-network, check if the plan offers any out-of-network coverage and what
                          your costs would be
                        </li>
                      </ul>
                      <p className='mt-2'>
                        Some plans may also offer transition-of-care provisions that allow you to continue seeing your
                        current doctor for a limited time even if they're not in-network, especially for ongoing
                        treatments.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value='item-3'>
                    <AccordionTrigger>What's the difference between an HSA, FSA, and HRA?</AccordionTrigger>
                    <AccordionContent>
                      <p>
                        HSAs, FSAs, and HRAs are all tax-advantaged accounts for healthcare expenses, but they have
                        important differences:
                      </p>
                      <div className='mt-2 space-y-3'>
                        <div>
                          <h4 className='font-medium'>Health Savings Account (HSA)</h4>
                          <ul className='ml-6 list-disc text-sm text-muted-foreground'>
                            <li>Only available with High-Deductible Health Plans (HDHPs)</li>
                            <li>Both you and your employer can contribute</li>
                            <li>Funds roll over year to year</li>
                            <li>Account is portable (you own it even if you change jobs)</li>
                            <li>
                              Triple tax advantage: tax-deductible contributions, tax-free growth, tax-free withdrawals
                              for qualified expenses
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h4 className='font-medium'>Flexible Spending Account (FSA)</h4>
                          <ul className='ml-6 list-disc text-sm text-muted-foreground'>
                            <li>Available with most health plans</li>
                            <li>Typically funded by pre-tax payroll deductions</li>
                            <li>Limited rollover ($610 in 2023) or grace period for unused funds</li>
                            <li>Not portable (you lose it if you leave your job)</li>
                            <li>"Use it or lose it" - most funds must be used within the plan year</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className='font-medium'>Health Reimbursement Arrangement (HRA)</h4>
                          <ul className='ml-6 list-disc text-sm text-muted-foreground'>
                            <li>Funded solely by the employer</li>
                            <li>Reimburses you for qualified medical expenses</li>
                            <li>Employer decides if funds roll over</li>
                            <li>Not portable (employer owns the account)</li>
                            <li>Tax-free for both employer and employee</li>
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value='item-4'>
                    <AccordionTrigger>What should I do if my claim is denied?</AccordionTrigger>
                    <AccordionContent>
                      <p>If your insurance claim is denied, don't panic. Follow these steps to appeal the decision:</p>
                      <ol className='mt-2 ml-6 list-decimal space-y-2 text-muted-foreground'>
                        <li>
                          <span className='font-medium'>Understand the denial:</span> Review the Explanation of Benefits
                          (EOB) to understand why the claim was denied. Common reasons include services not covered,
                          out-of-network providers, or missing information.
                        </li>
                        <li>
                          <span className='font-medium'>Contact your insurance company:</span> Call the customer service
                          number on your insurance card to get more information about the denial and the appeals
                          process.
                        </li>
                        <li>
                          <span className='font-medium'>Gather documentation:</span> Collect all relevant medical
                          records, doctor's notes, and any communications with your provider or insurance company.
                        </li>
                        <li>
                          <span className='font-medium'>File an internal appeal:</span> Submit a formal appeal to your
                          insurance company. This must typically be done within a specific timeframe (often 180 days
                          from the denial).
                        </li>
                        <li>
                          <span className='font-medium'>Get help if needed:</span> Your doctor's office may be able to
                          help with the appeal, especially if it's a medical necessity issue. You can also contact your
                          state's insurance department for assistance.
                        </li>
                        <li>
                          <span className='font-medium'>Consider an external review:</span> If your internal appeal is
                          denied, you may be able to request an external review by an independent third party.
                        </li>
                      </ol>
                      <p className='mt-2'>
                        Remember to keep detailed records of all communications and follow all deadlines in the appeals
                        process.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value='item-5'>
                    <AccordionTrigger>How do prescription drug tiers work?</AccordionTrigger>
                    <AccordionContent>
                      <p>
                        Insurance plans typically categorize prescription drugs into tiers, with different cost-sharing
                        requirements for each tier:
                      </p>
                      <div className='mt-2 space-y-3'>
                        <div>
                          <h4 className='font-medium'>Tier 1: Generic Drugs</h4>
                          <p className='text-sm text-muted-foreground'>
                            Lowest cost medications, usually generic versions of brand-name drugs. These typically have
                            the lowest copays (often $5-$15).
                          </p>
                        </div>
                        <div>
                          <h4 className='font-medium'>Tier 2: Preferred Brand-Name Drugs</h4>
                          <p className='text-sm text-muted-foreground'>
                            Brand-name medications that don't have generic equivalents but are preferred by your
                            insurance plan. These have moderate copays (often $25-$50).
                          </p>
                        </div>
                        <div>
                          <h4 className='font-medium'>Tier 3: Non-Preferred Brand-Name Drugs</h4>
                          <p className='text-sm text-muted-foreground'>
                            Brand-name drugs with generic alternatives or more expensive options within a drug class.
                            These have higher copays (often $50-$100).
                          </p>
                        </div>
                        <div>
                          <h4 className='font-medium'>Tier 4: Specialty Drugs</h4>
                          <p className='text-sm text-muted-foreground'>
                            High-cost medications used to treat complex conditions like cancer, rheumatoid arthritis, or
                            multiple sclerosis. These often require coinsurance (you pay a percentage of the cost,
                            sometimes 20-50%) rather than a flat copay.
                          </p>
                        </div>
                      </div>
                      <p className='mt-2'>
                        To save on prescription costs, ask your doctor about generic alternatives, check if your
                        insurance offers a mail-order pharmacy program, and look into manufacturer assistance programs
                        for high-cost medications.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
              <CardFooter>
                <Button variant='outline' className='w-full'>
                  <HelpCircle className='mr-2 h-4 w-4' />
                  Ask a Question
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default InsuranceGuidePage
