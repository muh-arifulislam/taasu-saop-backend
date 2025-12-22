import { rateLimit } from 'express-rate-limit';
import httpStatus from 'http-status';

export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    statusCode: httpStatus.TOO_MANY_REQUESTS,
    success: false,
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
});
