import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Files,
  ShieldCheck,
  UsersRound,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useDemoData } from '../demo/useDemoData'

export type AuthMode = 'login' | 'register' | 'recovery'

function createAuthSchema(mode: AuthMode) {
  return z
    .object({
      fullName: z.string(),
      email: z.string().trim().email('Enter a valid email address.'),
      password: z.string(),
    })
    .superRefine((values, context) => {
      if (mode === 'register' && values.fullName.trim().length < 2) {
        context.addIssue({
          code: 'custom',
          path: ['fullName'],
          message: 'Enter at least two characters.',
        })
      }
      if (mode !== 'recovery' && values.password.length < 8) {
        context.addIssue({
          code: 'custom',
          path: ['password'],
          message: 'Use at least 8 characters.',
        })
      }
    })
}

type AuthFormValues = z.infer<ReturnType<typeof createAuthSchema>>

export function AuthScreen({ mode }: { mode: AuthMode }) {
  const [showPassword, setShowPassword] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [loginError, setLoginError] = useState('')
  const { signIn } = useDemoData()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(createAuthSchema(mode)),
    defaultValues: { fullName: '', email: '', password: '' },
  })
  const heading =
    mode === 'login'
      ? 'Welcome back'
      : mode === 'register'
        ? 'Create your account'
        : 'Reset your password'
  const description =
    mode === 'login'
      ? 'Sign in to continue to your workspace.'
      : mode === 'register'
        ? 'Set up your Alfresco workspace account.'
        : 'We’ll help you get back into your account.'

  const submit = (values: AuthFormValues) => {
    setLoginError('')
    if (mode === 'login') {
      if (!signIn(values.email, values.password)) {
        setLoginError('The email or password you entered is incorrect.')
        return
      }
      navigate('/overview')
      return
    }
    if (mode === 'register') {
      setFeedback(
        'Registration is a frontend preview. Account creation will be enabled when Supabase Auth is connected.',
      )
      return
    }
    setFeedback(
      'Password recovery is a frontend preview. Recovery emails will be enabled when Supabase Auth is connected.',
    )
  }

  return (
    <main className="auth-page">
      <section className="auth-brand-panel">
        <Link to="/login" className="auth-brand">
          <span className="brand-mark">
            <Files size={19} strokeWidth={2.2} />
          </span>
          <span>alfresco</span>
        </Link>
        <div className="auth-brand-message">
          <span className="auth-kicker">NORTHSTAR STUDIO</span>
          <h1>
            Every document.
            <br />
            In its right place.
          </h1>
          <p>
            A thoughtful workspace for your organization’s most important work.
          </p>
          <div className="auth-feature-row">
            <span>
              <ShieldCheck size={15} /> Secure by design
            </span>
            <span>
              <UsersRound size={15} /> Built for teams
            </span>
          </div>
        </div>
        <div className="auth-brand-footer">
          <span>© 2026 Alfresco Workspace</span>
          <span>
            Privacy <span>·</span> Terms
          </span>
        </div>
      </section>
      <section className="auth-form-panel">
        <div className="auth-form-wrap">
          {mode !== 'login' && (
            <Link to="/login" className="auth-back-link">
              <ArrowLeft size={15} />
              Back to sign in
            </Link>
          )}
          <span className="auth-mobile-brand">
            <span className="brand-mark">
              <Files size={18} />
            </span>
            alfresco
          </span>
          <div className="auth-form-heading">
            <span className="auth-form-eyebrow">
              {mode === 'recovery'
                ? 'ACCOUNT RECOVERY'
                : 'YOUR WORKSPACE AWAITS'}
            </span>
            <h2>{heading}</h2>
            <p>{description}</p>
          </div>
          <form
            className="auth-form"
            onSubmit={handleSubmit(submit)}
            noValidate
          >
            {mode === 'register' && (
              <label className="auth-field">
                <span>Full name</span>
                <input
                  autoComplete="name"
                  placeholder="Your name"
                  aria-invalid={Boolean(errors.fullName)}
                  {...register('fullName')}
                />
                {errors.fullName && (
                  <small className="auth-error">
                    {errors.fullName.message}
                  </small>
                )}
              </label>
            )}
            <label className="auth-field">
              <span>Work email</span>
              <input
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                aria-invalid={Boolean(errors.email)}
                {...register('email')}
              />
              {errors.email && (
                <small className="auth-error">{errors.email.message}</small>
              )}
            </label>
            {mode !== 'recovery' && (
              <label className="auth-field">
                <span>Password</span>
                <span className="password-input-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={
                      mode === 'register' ? 'new-password' : 'current-password'
                    }
                    placeholder="At least 8 characters"
                    aria-invalid={Boolean(errors.password)}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    onClick={() => setShowPassword((visible) => !visible)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </span>
                {errors.password && (
                  <small className="auth-error">
                    {errors.password.message}
                  </small>
                )}
              </label>
            )}
            {mode === 'login' && (
              <div className="auth-options">
                <label>
                  <input type="checkbox" /> <span>Remember me</span>
                </label>
                <Link to="/forgot-password">Forgot password?</Link>
              </div>
            )}
            {loginError && (
              <div className="auth-error-box" role="alert">
                {loginError}
              </div>
            )}
            {feedback && (
              <div className="auth-demo-notice" role="status">
                <ShieldCheck size={16} />
                <span>{feedback}</span>
              </div>
            )}
            <button
              type="submit"
              className="auth-submit"
              disabled={isSubmitting}
            >
              {mode === 'login'
                ? 'Sign in'
                : mode === 'register'
                  ? 'Create account'
                  : 'Send recovery link'}
            </button>
          </form>
          {mode === 'login' ? (
            <p className="auth-switch">
              New to Alfresco? <Link to="/register">Create an account</Link>
            </p>
          ) : mode === 'register' ? (
            <p className="auth-switch">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          ) : (
            <p className="auth-switch">
              <Link to="/login">Return to sign in</Link>
            </p>
          )}
          <div className="auth-security-note">
            <ShieldCheck size={14} />
            <span>
              Your credentials are kept secure and never shared.
            </span>
          </div>
        </div>
      </section>
    </main>
  )
}
