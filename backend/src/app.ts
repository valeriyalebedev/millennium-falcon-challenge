import express from 'express'
import router from './modules/odds/odds.router'

const app = express()
app.use(express.json())

app.use('/api/odds', router)

export default app