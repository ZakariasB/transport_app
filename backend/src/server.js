import express from 'express'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { router } from './routes/router.js'
import { container, TYPES } from './config/inversify.config.js'

/**
 * Main file.
 */
try {
  const app = express()
  const isProduction = process.env.NODE_ENV === 'production'

  if (isProduction) {
    app.set('trust proxy', 1)
  }

  const directoryFullName = dirname(fileURLToPath(import.meta.url))

  app.use(express.urlencoded({ extended: false }))
  app.use(express.static(join(directoryFullName, '../public')))
  app.use(express.json())

  app.use('/', router)

  app.get('*', (req, res) => {
    console.log(directoryFullName)
    res.sendFile(join(directoryFullName, '../public/index.html'))
  })

  app.use((err, req, res, next) => {
    if (isProduction) {
      res.status(err.status || 500).send('An error occurred')
    } else {
      res.status(err.status || 500).send(err.message)
      console.log(err.message)
    }
  })

  app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`)
    console.log('Press Ctrl-C to terminate...')
  })
  container.get(TYPES.LoadDataService).loadDatasets()
} catch (error) {
  console.error(error)
  process.exitCode = 1
}
