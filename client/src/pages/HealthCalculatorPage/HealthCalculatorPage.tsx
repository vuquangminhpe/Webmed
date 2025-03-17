/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react'
import { Activity, Calculator, Heart, Weight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/Components/ui/label'

const HealthCalculatorPage = () => {
  const [bmiData, setBmiData] = useState({
    height: '',
    weight: '',
    result: null as number | null,
    category: ''
  })

  const [heartRateData, setHeartRateData] = useState({
    age: '',
    restingHeartRate: '',
    maxHeartRate: null as number | null,
    targetMin: null as number | null,
    targetMax: null as number | null
  })

  const [calorieData, setCalorieData] = useState({
    age: '',
    weight: '',
    height: '',
    gender: 'male',
    activityLevel: 'moderate',
    result: null as number | null
  })

  const calculateBMI = () => {
    const height = parseFloat(bmiData.height) / 100
    const weight = parseFloat(bmiData.weight)

    if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
      return
    }

    const bmi = weight / (height * height)
    let category = ''

    if (bmi < 18.5) category = 'Underweight'
    else if (bmi >= 18.5 && bmi < 25) category = 'Normal weight'
    else if (bmi >= 25 && bmi < 30) category = 'Overweight'
    else category = 'Obesity'

    setBmiData({
      ...bmiData,
      result: parseFloat(bmi.toFixed(1)),
      category
    })
  }

  const calculateHeartRate = () => {
    const age = parseInt(heartRateData.age)
    const restingHeartRate = parseInt(heartRateData.restingHeartRate)

    if (isNaN(age) || age <= 0 || age > 120) {
      return
    }

    const maxHeartRate = 220 - age
    const targetMin = Math.round(maxHeartRate * 0.5)
    const targetMax = Math.round(maxHeartRate * 0.85)

    setHeartRateData({
      ...heartRateData,
      maxHeartRate,
      targetMin,
      targetMax
    })
  }

  const calculateCalories = () => {
    const age = parseInt(calorieData.age)
    const weight = parseFloat(calorieData.weight)
    const height = parseFloat(calorieData.height)
    const gender = calorieData.gender
    const activityLevel = calorieData.activityLevel

    if (isNaN(age) || isNaN(weight) || isNaN(height) || age <= 0 || weight <= 0 || height <= 0) {
      return
    }

    let bmr = 0
    if (gender === 'male') {
      bmr = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age
    } else {
      bmr = 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age
    }

    let calories = 0
    switch (activityLevel) {
      case 'sedentary':
        calories = bmr * 1.2
        break
      case 'light':
        calories = bmr * 1.375
        break
      case 'moderate':
        calories = bmr * 1.55
        break
      case 'active':
        calories = bmr * 1.725
        break
      case 'veryActive':
        calories = bmr * 1.9
        break
      default:
        calories = bmr * 1.55
    }

    setCalorieData({
      ...calorieData,
      result: Math.round(calories)
    })
  }

  return (
    <div className='container py-10'>
      <div className='mx-auto max-w-4xl space-y-8'>
        <div className='flex flex-col items-center space-y-2 text-center'>
          <Calculator className='h-12 w-12 text-primary' />
          <h1 className='text-3xl font-bold'>Health Calculator</h1>
          <p className='text-muted-foreground'>
            Use these calculators to estimate important health metrics for your personal wellness journey.
          </p>
        </div>

        <Tabs defaultValue='bmi' className='w-full'>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='bmi'>BMI Calculator</TabsTrigger>
            <TabsTrigger value='heart-rate'>Heart Rate Zones</TabsTrigger>
            <TabsTrigger value='calories'>Calorie Needs</TabsTrigger>
          </TabsList>

          <TabsContent value='bmi' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Weight className='h-5 w-5 text-primary' />
                  Body Mass Index (BMI) Calculator
                </CardTitle>
                <CardDescription>
                  Calculate your Body Mass Index to assess if your weight is in a healthy range for your height.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                  <div className='space-y-2'>
                    <Label htmlFor='height'>Height (cm)</Label>
                    <Input
                      id='height'
                      type='number'
                      placeholder='e.g. 175'
                      value={bmiData.height}
                      onChange={(e) => setBmiData({ ...bmiData, height: e.target.value, result: null, category: '' })}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='weight'>Weight (kg)</Label>
                    <Input
                      id='weight'
                      type='number'
                      placeholder='e.g. 70'
                      value={bmiData.weight}
                      onChange={(e) => setBmiData({ ...bmiData, weight: e.target.value, result: null, category: '' })}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className='flex flex-col items-center'>
                <Button onClick={calculateBMI} className='mb-4'>
                  Calculate BMI
                </Button>

                {bmiData.result !== null && (
                  <div className='mt-4 text-center'>
                    <div className='mb-2 text-2xl font-bold'>{bmiData.result}</div>
                    <div
                      className={`text-lg font-semibold ${
                        bmiData.category === 'Normal weight'
                          ? 'text-green-500'
                          : bmiData.category === 'Underweight'
                            ? 'text-amber-500'
                            : 'text-red-500'
                      }`}
                    >
                      {bmiData.category}
                    </div>
                    <p className='mt-2 text-sm text-muted-foreground'>
                      {bmiData.category === 'Normal weight'
                        ? 'Your BMI is within the healthy weight range.'
                        : bmiData.category === 'Underweight'
                          ? 'Your BMI indicates you may be underweight. Consider consulting a healthcare professional.'
                          : bmiData.category === 'Overweight'
                            ? 'Your BMI indicates you may be overweight. Consider healthy lifestyle changes.'
                            : 'Your BMI indicates obesity. Consider consulting a healthcare professional.'}
                    </p>
                  </div>
                )}
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>About BMI</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground'>
                  BMI is a measurement that uses your height and weight to determine if your weight is healthy. BMI
                  ranges are:
                </p>
                <ul className='mt-2 list-inside list-disc space-y-1 text-muted-foreground'>
                  <li>Underweight: BMI less than 18.5</li>
                  <li>Normal weight: BMI 18.5-24.9</li>
                  <li>Overweight: BMI 25-29.9</li>
                  <li>Obesity: BMI 30 or greater</li>
                </ul>
                <p className='mt-4 text-sm text-muted-foreground'>
                  Note: BMI doesn't directly measure body fat and doesn't account for factors like muscle mass, bone
                  density, or overall body composition. Athletes may have a high BMI due to increased muscle mass.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='heart-rate' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Heart className='h-5 w-5 text-primary' />
                  Heart Rate Zone Calculator
                </CardTitle>
                <CardDescription>
                  Calculate your maximum heart rate and target heart rate zones for exercise.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                  <div className='space-y-2'>
                    <Label htmlFor='age'>Age (years)</Label>
                    <Input
                      id='age'
                      type='number'
                      placeholder='e.g. 35'
                      value={heartRateData.age}
                      onChange={(e) =>
                        setHeartRateData({
                          ...heartRateData,
                          age: e.target.value,
                          maxHeartRate: null,
                          targetMin: null,
                          targetMax: null
                        })
                      }
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='resting-heart-rate'>Resting Heart Rate (optional)</Label>
                    <Input
                      id='resting-heart-rate'
                      type='number'
                      placeholder='e.g. 70'
                      value={heartRateData.restingHeartRate}
                      onChange={(e) =>
                        setHeartRateData({
                          ...heartRateData,
                          restingHeartRate: e.target.value
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className='flex flex-col items-center'>
                <Button onClick={calculateHeartRate} className='mb-4'>
                  Calculate Heart Rate Zones
                </Button>

                {heartRateData.maxHeartRate !== null && (
                  <div className='mt-4 w-full'>
                    <div className='mb-4 text-center'>
                      <div className='text-lg font-semibold'>Maximum Heart Rate</div>
                      <div className='text-2xl font-bold'>{heartRateData.maxHeartRate} BPM</div>
                    </div>

                    <div className='mt-4 text-center'>
                      <div className='text-lg font-semibold'>Target Heart Rate Zone (50-85%)</div>
                      <div className='text-2xl font-bold'>
                        {heartRateData.targetMin} - {heartRateData.targetMax} BPM
                      </div>
                    </div>

                    <Separator className='my-4' />

                    <div className='grid grid-cols-1 gap-2 sm:grid-cols-3'>
                      <div className='rounded-md bg-muted p-3 text-center'>
                        <div className='text-sm font-medium'>Light Intensity</div>
                        <div className='text-md font-semibold'>
                          {Math.round(heartRateData.maxHeartRate * 0.5)} -{' '}
                          {Math.round(heartRateData.maxHeartRate * 0.6)} BPM
                        </div>
                        <div className='text-xs text-muted-foreground'>50-60% of max</div>
                      </div>
                      <div className='rounded-md bg-muted p-3 text-center'>
                        <div className='text-sm font-medium'>Moderate Intensity</div>
                        <div className='text-md font-semibold'>
                          {Math.round(heartRateData.maxHeartRate * 0.6)} -{' '}
                          {Math.round(heartRateData.maxHeartRate * 0.7)} BPM
                        </div>
                        <div className='text-xs text-muted-foreground'>60-70% of max</div>
                      </div>
                      <div className='rounded-md bg-muted p-3 text-center'>
                        <div className='text-sm font-medium'>High Intensity</div>
                        <div className='text-md font-semibold'>
                          {Math.round(heartRateData.maxHeartRate * 0.7)} -{' '}
                          {Math.round(heartRateData.maxHeartRate * 0.85)} BPM
                        </div>
                        <div className='text-xs text-muted-foreground'>70-85% of max</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Understanding Heart Rate Zones</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground'>
                  Heart rate zones help you optimize your workout based on your fitness goals:
                </p>
                <ul className='mt-2 list-inside list-disc space-y-1 text-muted-foreground'>
                  <li>
                    <span className='font-medium'>50-60% (Light):</span> Ideal for beginners and warm-ups. Improves
                    overall health and helps with recovery.
                  </li>
                  <li>
                    <span className='font-medium'>60-70% (Moderate):</span> Improves cardiovascular fitness and fat
                    burning. Good for longer, sustainable workouts.
                  </li>
                  <li>
                    <span className='font-medium'>70-85% (Hard):</span> Improves cardiovascular endurance and
                    performance. Builds aerobic power.
                  </li>
                  <li>
                    <span className='font-medium'>85-95% (Maximum):</span> Develops maximum performance and speed.
                    Suitable for short intervals.
                  </li>
                </ul>
                <p className='mt-4 text-sm text-muted-foreground'>
                  Note: These are estimates based on age. For more personalized zones, consider fitness testing with a
                  healthcare professional.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='calories' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Activity className='h-5 w-5 text-primary' />
                  Daily Calorie Needs Calculator
                </CardTitle>
                <CardDescription>
                  Estimate how many calories you need each day based on your personal characteristics and activity
                  level.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                  <div className='space-y-2'>
                    <Label htmlFor='calorie-age'>Age (years)</Label>
                    <Input
                      id='calorie-age'
                      type='number'
                      placeholder='e.g. 35'
                      value={calorieData.age}
                      onChange={(e) => setCalorieData({ ...calorieData, age: e.target.value, result: null })}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label>Gender</Label>
                    <RadioGroup
                      value={calorieData.gender}
                      onValueChange={(value) => setCalorieData({ ...calorieData, gender: value, result: null })}
                      className='flex'
                    >
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='male' id='male' />
                        <Label htmlFor='male'>Male</Label>
                      </div>
                      <div className='flex items-center space-x-2 ml-4'>
                        <RadioGroupItem value='female' id='female' />
                        <Label htmlFor='female'>Female</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                  <div className='space-y-2'>
                    <Label htmlFor='calorie-height'>Height (cm)</Label>
                    <Input
                      id='calorie-height'
                      type='number'
                      placeholder='e.g. 175'
                      value={calorieData.height}
                      onChange={(e) => setCalorieData({ ...calorieData, height: e.target.value, result: null })}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='calorie-weight'>Weight (kg)</Label>
                    <Input
                      id='calorie-weight'
                      type='number'
                      placeholder='e.g. 70'
                      value={calorieData.weight}
                      onChange={(e) => setCalorieData({ ...calorieData, weight: e.target.value, result: null })}
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='activity-level'>Activity Level</Label>
                  <RadioGroup
                    id='activity-level'
                    value={calorieData.activityLevel}
                    onValueChange={(value) => setCalorieData({ ...calorieData, activityLevel: value, result: null })}
                    className='grid gap-2'
                  >
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem value='sedentary' id='sedentary' />
                      <Label htmlFor='sedentary'>Sedentary (little to no exercise)</Label>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem value='light' id='light' />
                      <Label htmlFor='light'>Light Activity (light exercise 1-3 days/week)</Label>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem value='moderate' id='moderate' />
                      <Label htmlFor='moderate'>Moderate Activity (moderate exercise 3-5 days/week)</Label>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem value='active' id='active' />
                      <Label htmlFor='active'>Very Active (hard exercise 6-7 days/week)</Label>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem value='veryActive' id='veryActive' />
                      <Label htmlFor='veryActive'>Extremely Active (hard daily exercise & physical job)</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
              <CardFooter className='flex flex-col items-center'>
                <Button onClick={calculateCalories} className='mb-4'>
                  Calculate Calorie Needs
                </Button>

                {calorieData.result !== null && (
                  <div className='mt-4 text-center'>
                    <div className='mb-2 text-lg font-semibold'>Estimated Daily Calories</div>
                    <div className='text-3xl font-bold'>{calorieData.result} calories</div>
                    <p className='mt-2 text-sm text-muted-foreground'>
                      This is an estimate of how many calories you need to maintain your current weight.
                    </p>

                    <div className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2'>
                      <div className='rounded-md border p-4 text-center'>
                        <div className='text-sm font-medium'>Weight Loss</div>
                        <div className='text-lg font-semibold'>{calorieData.result - 500} calories</div>
                        <div className='text-xs text-muted-foreground'>Moderate 0.5 kg/week loss</div>
                      </div>
                      <div className='rounded-md border p-4 text-center'>
                        <div className='text-sm font-medium'>Weight Gain</div>
                        <div className='text-lg font-semibold'>{calorieData.result + 500} calories</div>
                        <div className='text-xs text-muted-foreground'>Moderate 0.5 kg/week gain</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Understanding Calorie Needs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground'>Your daily calorie needs are based on several factors:</p>
                <ul className='mt-2 list-inside list-disc space-y-1 text-muted-foreground'>
                  <li>
                    <span className='font-medium'>Basal Metabolic Rate (BMR):</span> Calories your body needs at rest to
                    maintain basic functions.
                  </li>
                  <li>
                    <span className='font-medium'>Activity Level:</span> Physical activity increases calorie needs
                    beyond your BMR.
                  </li>
                  <li>
                    <span className='font-medium'>Weight Goals:</span> Reducing intake by about 500 calories/day
                    typically results in 0.5 kg/week weight loss.
                  </li>
                </ul>
                <p className='mt-4 text-sm text-muted-foreground'>
                  Note: This calculator provides estimates based on the Harris-Benedict Equation. Individual needs may
                  vary based on genetics, medical conditions, and other factors.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default HealthCalculatorPage
