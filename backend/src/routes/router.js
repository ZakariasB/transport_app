import express from 'express'
import { router as movieRouter } from './movieRouter.js'
import { router as userRouter } from './userRouter.js'

export const router = express.Router()

router.use('/movies', movieRouter)
router.use('/users', userRouter)

router.use('*', (req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
