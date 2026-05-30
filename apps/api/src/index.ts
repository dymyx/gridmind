import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { AppError, errorHandler } from './errorHandler'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(helmet())
app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.get('/health', (_, res) => res.json({ ok: true }))

app.use((req: Request, res: Response, next: NextFunction) => {
	const error: AppError = new Error('Not found')
	error.statusCode = 404

	next(error)
})

app.use(errorHandler)

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`))
