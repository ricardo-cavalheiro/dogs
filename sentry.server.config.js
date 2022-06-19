import { init } from '@sentry/nextjs'

init({
  dsn:
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_SENTRY_DSN
      : '',
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
})
