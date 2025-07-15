import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;

export const onboardingSchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  invitationToken: z.string().optional(),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;

export const inviteUserSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  organizationId: z.number().min(1, 'Organization is required'),
  role: z.enum(['admin', 'manager', 'analyst', 'viewer'], {
    required_error: 'Please select a role',
  }),
  position: z.string().min(1, 'Position is required'),
});

export type InviteUserFormData = z.infer<typeof inviteUserSchema>;