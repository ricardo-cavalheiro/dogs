import { withSentry } from '@sentry/nextjs'

// types
import type { NextApiRequest, NextApiResponse } from 'next'

type Modes = 'verifyEmail' | 'recoverEmail' | 'resetPassword'

function handler(req: NextApiRequest, res: NextApiResponse) {
  const mode = req.query['mode'] as Modes
  const oobCode = req.query['oobCode'] as string

  switch (mode) {
    case 'verifyEmail':
      return res.status(307).redirect(`/account/verifyemail?oobCode=${oobCode}`)
    case 'resetPassword':
      return res
        .status(307)
        .redirect(`/account/recovery/password?oobCode=${oobCode}`)
    default:
      return res.status(500)
  }
}

export default withSentry(handler)
