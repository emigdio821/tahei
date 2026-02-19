import { getSession } from '@/api/server-functions/session'
import { createSEOTitle } from '@/lib/seo'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useId, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { authClient } from '@/lib/auth/client'
import { appName } from '@/lib/config'
import { Frame, FrameDescription, FrameHeader, FrameTitle } from '@/components/ui/frame'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Footer } from '@/components/footer'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { IconAlertOctagon } from '@tabler/icons-react'
import { LoaderIcon, TaheiIcon } from '@/components/icons'
import {z} from 'zod'
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, DEFAULT_ERROR } from '@/lib/constants'
import { InputPassword } from '@/components/ui/input-password'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await getSession()

    if (session) {
      throw redirect({ to: '/' })
    }
  },
  head: () => ({
    meta: [{ title: createSEOTitle('Login') }],
  }),
})

const loginSchema = z.object({
  email: z.email().min(1, 'Email is required'),
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
    .max(PASSWORD_MAX_LENGTH, `Password must be less than ${PASSWORD_MAX_LENGTH} characters`),
})

type LoginFormData = z.infer<typeof loginSchema>

function RouteComponent() {
  const loginFormId = useId()
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: LoginFormData) {
    setLoading(true)
    setError('')

    try {
      const { error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: '/',
      })

      if (error) {
        setLoading(false)
        console.error('login error:', error)

        setError(error.status === 401 ? 'Invalid credentials, please try again.' : DEFAULT_ERROR)
      }
    } catch {
      setLoading(false)
      setError(DEFAULT_ERROR)
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-6 px-2 py-6">
        <div className="flex items-center gap-2 self-center">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <TaheiIcon className="size-4" />
          </div>
          <span className="font-medium text-base text-foreground">{appName}</span>
        </div>

        <Frame className="w-full max-w-sm">
          <FrameHeader>
            <FrameTitle>Login</FrameTitle>
            <FrameDescription>Enter your credentials to access your account.</FrameDescription>
          </FrameHeader>
          <Card>
            <CardContent>
              <form
                className="space-y-4"
                id={loginFormId}
                aria-label="Login form"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FieldGroup>
                  <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          Email <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          autoComplete="email"
                          disabled={isLoading}
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          Password <span className="text-destructive">*</span>
                        </FieldLabel>
                        <InputPassword
                          {...field}
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                          disabled={isLoading}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  {error && (
                    <Alert variant="error">
                      <IconAlertOctagon className="size-4" />
                      <AlertTitle>Something went wrong</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                </FieldGroup>
              </form>
            </CardContent>

            <CardFooter className="pt-4 text-center">
              <Button type="submit" form={loginFormId} className="w-full" disabled={isLoading}>
                {isLoading && <LoaderIcon />}
                Login
              </Button>
            </CardFooter>
          </Card>
        </Frame>
      </div>

      <Footer />
    </div>
  )
}
