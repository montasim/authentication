const configuration = {
    env: process.env.NEXT_PUBLIC_NODE_ENV,
    github: {
        repository: process.env.NEXT_PUBLIC_GITHUB_REPOSITORY,
    },
    port: process.env.NEXT_PUBLIC_PORT,
    version: process.env.NEXT_PUBLIC_VERSION,
    mongoose: {
        url: process.env.NEXT_PUBLIC_MONGODB_URL,
    },
    redis: {
        url: process.env.NEXT_PUBLIC_REDIS_URL,
    },
    blob: {
        url: process.env.NEXT_PUBLIC_REDIS_URL,
    },
    jwt: {
        secret: process.env.NEXT_PUBLIC_JWT_SECRET,
        accessExpirationMinutes:
            process.env.NEXT_PUBLIC_JWT_ACCESS_EXPIRATION_MINUTES,
        refreshExpirationDays:
            process.env.NEXT_PUBLIC_JWT_REFRESH_EXPIRATION_DAYS,
        resetPasswordExpirationMinutes:
            process.env.NEXT_PUBLIC_JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
        verifyEmailExpirationMinutes:
            process.env.NEXT_PUBLIC_JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
    },
    auth: {
        basicToken: process.env.NEXT_PUBLIC_BASIC_TOKEN,
        loginAttempts: process.env.NEXT_PUBLIC_MAXIMUM_LOGIN_ATTEMPTS,
        resetPasswordAttempts:
            process.env.NEXT_PUBLIC_MAXIMUM_RESET_PASSWORD_ATTEMPTS,
        verifyEmailAttempts:
            process.env.NEXT_PUBLIC_MAXIMUM_VERIFY_EMAIL_ATTEMPTS,
        changeEmailAttempts:
            process.env.NEXT_PUBLIC_MAXIMUM_CHANGE_EMAIL_ATTEMPTS,
        changePasswordAttempts:
            process.env.NEXT_PUBLIC_MAXIMUM_CHANGE_PASSWORD_ATTEMPTS,
        activeSessions: process.env.NEXT_PUBLIC_MAXIMUM_ACTIVE_SESSIONS,
        lockDuration: process.env.NEXT_PUBLIC_LOCK_DURATION_HOUR,
    },
    timeout: process.env.NEXT_PUBLIC_TIMEOUT_IN_SECONDS,
    cache: {
        timeout: process.env.NEXT_PUBLIC_CACHE_TTL_IN_SECONDS,
    },
    jsonPayloadLimit: process.env.NEXT_PUBLIC_JSON_PAYLOAD_LIMIT,
    cors: {
        origin: process.env.NEXT_PUBLIC_CORS_ORIGIN,
        methods: process.env.NEXT_PUBLIC_CORS_METHODS,
    },
    rateLimit: {
        windowMs: process.env.NEXT_PUBLIC_RATE_LIMIT_WINDOW_MS,
        max: process.env.NEXT_PUBLIC_RATE_LIMIT_MAX,
    },
    email: {
        smtp: {
            host: process.env.NEXT_PUBLIC_SMTP_HOST,
            port: process.env.NEXT_PUBLIC_SMTP_PORT,
            auth: {
                user: process.env.NEXT_PUBLIC_SMTP_USERNAME,
                pass: process.env.NEXT_PUBLIC_SMTP_PASSWORD,
            },
            maxConnectionAttempts:
                process.env.NEXT_PUBLIC_SMTP_MAX_CONNECTION_RETRY_ATTEMPTS,
        },
        from: process.env.NEXT_PUBLIC_EMAIL_FROM,
    },
    admin: {
        email: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
        password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD,
    },
    googleDrive: {
        scope: process.env.NEXT_PUBLIC_GOOGLE_DRIVE_SCOPE,
        client: process.env.NEXT_PUBLIC_GOOGLE_DRIVE_CLIENT_EMAIL,
        privateKey: process.env.NEXT_PUBLIC_GOOGLE_DRIVE_PRIVATE_KEY,
        folderKey: process.env.NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_KEY,
    },
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    userAccount: {
        confirmationTextForAccountDeletion:
            process.env.NEXT_PUBLIC_CONFIRMATION_TEXT_FOR_ACCOUNT_DELETION,
    },
    service: {
        sendEmail: process.env.NEXT_PUBLIC_SEND_EMAIL_SERVICE,
    },
};

export default configuration;
