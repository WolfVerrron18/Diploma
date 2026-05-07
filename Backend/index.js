/** @module Express - Библиотека express */
import express from 'express'

/** @module Cors - Кросс доменные запросы */
import cors from 'cors'

/** @module Env - Кросс доменные запросы */
import 'dotenv/config'

/** @module Logger - Логирование приложения */
import logger from './src/logger/logger.js'

/** @module Database - База данных */
import { connectionDatabase } from './src/db/database.js'

import UserRouter from './src/router/UserRouter.js'
import AuthRouter from './src/router/AuthRouter.js'
import PurposeRouter from './src/router/PurposeRouter.js'
import BankAccountRouter from './src/router/BankAccountRouter.js'
import TransactionRouter from './src/router/TransactionRouter.js'
import ReflectionRouter from './src/router/ReflectionRouter.js'
import TagsRouter from './src/router/TagsRouter.js'
import ArtifactRouter from './src/router/ArtifactRouter.js'
import RetrospectiveRouter from './src/router/RetrospectiveRouter.js'

const app = express()

const port = 3000

app.use(cors())
app.use(express.json())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

app.use('/', AuthRouter)
app.use('/api', UserRouter)
app.use('/api', PurposeRouter)
app.use('/api', BankAccountRouter)
app.use('/api', TransactionRouter)
app.use('/api', ReflectionRouter)
app.use('/api', TagsRouter)
app.use('/api', ArtifactRouter)
app.use('/api', RetrospectiveRouter)

connectionDatabase()
	.then(() => {
		app.listen(port, () => {
			logger.info(`The application is running on port ${port} and connected to the database`)
		})
	})
	.catch((e) => logger.error(e))
