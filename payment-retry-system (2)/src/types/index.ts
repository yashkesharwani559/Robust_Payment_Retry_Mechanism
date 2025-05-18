// Auth Types
export interface User {
  id?: number
  name: string
  email: string
  phone: string
  role: string
  enabled?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  phone: string
  password: string
  role?: string
}

export interface AuthResponse {
  token: string
  name: string
  email: string
  phone: string
  role: string
}

// Transaction Types
export interface Transaction {
  id: number
  amount: number
  currency: string
  status: TransactionStatus
  gateway: string
  externalReferenceId?: string
  paymentMethod?: PaymentMethod
  retryConfig?: RetryConfig
  user?: User
  createdAt: string
  updatedAt?: string
  completedAt?: string
}

export enum TransactionStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  RETRY_SCHEDULED = "RETRY_SCHEDULED",
  RETRY_IN_PROGRESS = "RETRY_IN_PROGRESS",
}

export interface TransactionRequest {
  amount: number
  currency: string
  paymentMethodId: number
  allowRetry: boolean
}

// Payment Method Types
export interface PaymentMethod {
  id: number
  methodName: string
  details: string
  priority: number
  isDefault: boolean
  createdAt?: string
  updatedAt?: string
}

export interface PaymentMethodRequest {
  methodName: string
  details: string
  priority: number
  default: boolean
}

// Retry Configuration Types
export interface RetryConfig {
  id?: number
  maxRetries: number
  retryInterval: number
  strategy: RetryStrategy
  currentAttempts?: number
  nextRetryTime?: string
}

export enum RetryStrategy {
  FIXED = "FIXED",
  EXPONENTIAL = "EXPONENTIAL",
}

export interface RetryConfigRequest {
  maxRetries: number
  retryInterval: number
  strategy: RetryStrategy
}

// Error Log Types
export interface ErrorLog {
  id: number
  transactionId: number
  errorCode: string
  errorMessage: string
  retryEligible: boolean
  retryAttempt: number
  createdAt: string
}

// Pagination Types
export interface PagedResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  last: boolean
}

// API Response Types
export interface CustomApiResponse<T> {
  success: boolean
  status: string
  message: string
  data: T
}

export interface MessageResponse {
  message: string
}
