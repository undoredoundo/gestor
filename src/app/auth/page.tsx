"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/server/auth/auth-client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod/v4";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

const registerSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export default function AuthPage() {
  const { data } = authClient.useSession();
  const router = useRouter();

  if (data?.session) {
    router.replace("/");
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Card className="w-full max-w-xs">
        <CardContent>
          <Tabs defaultValue="login" className="w-full gap-4">
            <TabsList className="w-full">
              <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="register">Registrarse</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function LoginForm() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() =>
          authClient.signIn.email({
            email: form.getValues("email"),
            password: form.getValues("password"),
            callbackURL: "/",
          }),
        )}
        className="space-y-8"
      >
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input placeholder="E-mail" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <Input placeholder="Contraseña" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-4">
          <Button type="submit" className="w-full">
            Iniciar Sesión
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={() =>
              authClient.signIn.social({ provider: "google", callbackURL: "/" })
            }
          >
            Ingresar con Google
          </Button>
        </div>
      </form>
    </Form>
  );
}

function RegisterForm() {
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });
  const [error, setError] = useState<{ code: string; message: string }>();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async () => {
          const response = await authClient.signUp.email({
            name: form.getValues("name"),
            email: form.getValues("email"),
            password: form.getValues("password"),
            callbackURL: "/",
          });

          if (response.error) {
            setError({
              code: response.error.code ?? "",
              message: response.error.message ?? "",
            });
          }
        })}
        className="space-y-8"
      >
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input placeholder="E-mail" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <Input placeholder="Contraseña" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error?.code === "USER_ALREADY_EXISTS" ? (
            <p className="text-destructive">El usuario ya existe</p>
          ) : error?.code && error?.message ? (
            <p className="text-destructive">{error.message}</p>
          ) : null}
        </div>
        <Button type="submit" className="w-full">
          Registrarse
        </Button>
      </form>
    </Form>
  );
}
