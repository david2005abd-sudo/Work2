export const APP_ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  chat: (id?: string) => (id ? `/chat/${id}` : '/chat/new'),
  search: '/search',
  library: '/library',
  notifications: '/notifications',
  usage: '/usage',
  apiKeys: '/api-keys',
  settings: '/settings',
  admin: {
    root: '/admin',
    users: '/admin/users',
    usage: '/admin/usage',
    models: '/admin/models',
    contact: '/admin/contact',
    notifications: '/admin/notifications',
    securityLogs: '/admin/security-logs',
    system: '/admin/system',
  },
} as const;

export const PAGINATION = {
  conversationsPerPage: 20,
  messagesPerPage: 50,
  usersPerPage: 25,
  auditLogsPerPage: 50,
} as const;

export const LIMITS = {
  conversationTitleMaxLength: 120,
  messageMaxLength: 32_000,
  apiKeyNameMaxLength: 60,
  bioMaxLength: 280,
  usernameMinLength: 3,
  usernameMaxLength: 32,
} as const;

export const FREE_TIER = {
  dailyMessages: 50,
  dailyTokens: 20_000,
} as const;
