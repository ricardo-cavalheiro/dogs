declare namespace NodeJS {
  export interface ProcessEnv {
    // Firebase app config
    NEXT_PUBLIC_FIREBASE_API_KEY: string
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: string
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: string
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string
    NEXT_PUBLIC_FIREBASE_APP_ID: string

    // Firebase service account
    SERVICE_ACCOUNT_PROJECT_ID: string
    SERVICE_ACCOUNT_PRIVATE_KEY: string
    SERVICE_ACCOUNT_CLIENT_EMAIL: string

    // Sentry
    NEXT_PUBLIC_SENTRY_DNS: string
  }
}
