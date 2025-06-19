"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
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
import z from "zod";
import { Button } from "@/components/ui/button";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const registerSchema = z.object({
  name: z.string().min(6),
  email: z.string().email(),
  password: z.string().min(8),
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
        <CardHeader>
          <CardTitle>Iniciar Sesión</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
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
        className="space-y-4"
      >
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
        <Button type="submit">Iniciar Sesión</Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => authClient.signIn.social({ provider: "google" })}
        >
          Ingresar con Google
        </Button>
      </form>
    </Form>
  );
}
