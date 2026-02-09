'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { IconAlertOctagon, IconLoader } from '@tabler/icons-react'
import { useId, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Footer } from '@/components/footer'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Frame, FrameDescription, FrameHeader, FrameTitle } from '@/components/ui/frame'
import { Input } from '@/components/ui/input'
import { InputPassword } from '@/components/ui/input-password'
import { appName } from '@/lib/config/site'

const _DEFAULT_ERROR = 'Error en el servidor, intenta nuevamente.'

const loginSchema = z.object({
  email: z.email('Correo inválido').min(1, 'El correo es requerido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
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

  async function onSubmit(_data: LoginFormData) {
    setLoading(true)
    setError('')

    // try {
    //   const { error } = await authClient.signIn.email({
    //     email: data.email,
    //     password: data.password,
    //     callbackURL: '/',
    //   })

    //   if (error) {
    //     setLoading(false)
    //     console.error('login error:', error)

    //     setError(error.status === 401 ? 'Crendeciales inválidas, intenta nuevamente.' : DEFAULT_ERROR)
    //   }
    // } catch {
    //   setLoading(false)
    //   setError(DEFAULT_ERROR)
    // }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-6 px-2 py-6">
        <div className="flex items-center gap-2 self-center">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            {/* <ResidoIcon className="size-4" /> */}
          </div>
          <span className="font-medium text-base text-foreground">{appName}</span>
        </div>

        <Frame className="w-full max-w-sm">
          <FrameHeader>
            <FrameTitle>Iniciar sesión</FrameTitle>
            <FrameDescription>Ingresa tus credenciales para acceder a tu cuenta.</FrameDescription>
          </FrameHeader>
          <Card>
            <CardContent>
              <form
                className="space-y-4"
                id={loginFormId}
                aria-label="Iniciar sesión"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FieldGroup>
                  <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          Correo <span className="text-destructive">*</span>
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
                          Contraseña <span className="text-destructive">*</span>
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
                      <AlertTitle>Algo salió mal al iniciar sesión</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                </FieldGroup>
              </form>
            </CardContent>

            <CardFooter className="pt-4 text-center">
              <Button type="submit" form={loginFormId} className="w-full" disabled={isLoading}>
                Iniciar sesión
                {isLoading && <IconLoader className="size-4 animate-spin" />}
              </Button>
            </CardFooter>
          </Card>
        </Frame>
      </div>

      <Footer />
    </div>
  )
}
