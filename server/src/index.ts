import express from 'express'

import healthRouter from './routes/health.routes'
import medicineRouter from './routes/medicine.routes'
import feedbackRouter from './routes/feedback.routes'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { envConfig } from './constant/config'
import databaseService from './services/database.services'
import usersRouter from './routes/user.routes'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import doctorRouter from './routes/doctor.routes'

const app = express()
const PORT = envConfig.port || 5000

databaseService.connect()

app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(morgan('dev'))

app.use('/api/users', usersRouter)
app.use('/api/health', healthRouter)
app.use('/api/medicine', medicineRouter)
app.use('/api/feedback', feedbackRouter)
app.use('/api/doctors', doctorRouter)
app.use(defaultErrorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
