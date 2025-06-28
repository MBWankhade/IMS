import rateLimit from 'express-rate-limit';

export const createPostLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3, // limit each user to 3 post submissions per 10 minutes
  keyGenerator: (req) => req.user?._id || req.ip, // prioritize user ID, fallback to IP
  message: {
    message: "Too many posts submitted in a short time. Please try again later.",
  },
});
