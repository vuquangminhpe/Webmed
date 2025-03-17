import { Collection, Db, MongoClient } from 'mongodb'
import User from '~/models/schemas/User.schema'
import Insurance from '~/models/schemas/Insurance.schema'
import Disease from '~/models/schemas/Disease.schema'
import Doctor from '~/models/schemas/Doctor.schema'
import Medicine from '~/models/schemas/Medicine.schema'
import Order from '~/models/schemas/Order.schema'
import Feedback from '~/models/schemas/Feedback.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { envConfig } from '~/constant/config'

class DatabaseService {
  private client: MongoClient
  private db: Db

  constructor() {
    this.client = new MongoClient(envConfig.dbUri as string)
    this.db = this.client.db(envConfig.dbName)
  }

  async connect() {
    try {
      await this.client.connect()
      console.log('Connected successfully to MongoDB')
    } catch (error) {
      console.error('Error connecting to MongoDB:', error)
      throw error
    }
  }

  get users(): Collection<User> {
    return this.db.collection('users')
  }

  get refreshToken(): Collection<RefreshToken> {
    return this.db.collection('refresh_tokens')
  }

  get insurances(): Collection<Insurance> {
    return this.db.collection('insurances')
  }

  get diseases(): Collection<Disease> {
    return this.db.collection('diseases')
  }

  get doctors(): Collection<Doctor> {
    return this.db.collection('doctors')
  }

  get medicines(): Collection<Medicine> {
    return this.db.collection('medicines')
  }

  get orders(): Collection<Order> {
    return this.db.collection('orders')
  }

  get feedbacks(): Collection<Feedback> {
    return this.db.collection('feedbacks')
  }
}

const databaseService = new DatabaseService()
export default databaseService
