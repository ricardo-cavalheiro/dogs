import { applyActionCode } from 'firebase/auth'
import { withSentry } from '@sentry/nextjs'

// firebase services
import { auth } from '../../services/firebase/auth'

// types
import type { NextApiRequest, NextApiResponse } from 'next'

type Modes = 'verifyEmail' | 'recoverEmail' | 'resetPassword'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const mode = req.query['mode'] as Modes
  const oobCode = req.query['oobCode'] as string

  switch (mode) {
    case 'verifyEmail':
      try {
        await applyActionCode(auth, oobCode)
      } catch (err) {
        console.log({ err })
      } finally {
        res.status(307).redirect('/')
      }
    case 'resetPassword':
      return res
        .status(307)
        .redirect(`/account/recovery/password?oobCode=${oobCode}`)
    default:
      return res.status(500)
  }
}

export default withSentry(handler)
