import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { getErrorMessage } from "@/shared/api/client";
import { authApi } from "@/shared/api/endpoints";
import { AuthLayout } from "@/features/auth/auth-layout";
import { useSession } from "@/shared/store/session";
import { Button } from "@/shared/ui/button";
import { Field } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useSession((s) => s.setSession);
  const from =
    (location.state as { from?: string } | null)?.from &&
    (location.state as { from?: string }).from !== "/login"
      ? (location.state as { from: string }).from
      : "/";

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setSession(data.accessToken, data.user);
      toast.success("Welcome back");
      navigate(from, { replace: true });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Unable to sign in"));
    },
  });

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Use the same email you registered with the JobPilot API."
    >
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        noValidate
      >
        <Field error={form.formState.errors.email?.message}>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            {...form.register("email")}
          />
        </Field>
        <Field error={form.formState.errors.password?.message}>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            {...form.register("password")}
          />
        </Field>
        {mutation.error ? (
          <p className="text-sm text-danger" role="alert">
            {getErrorMessage(mutation.error)}
          </p>
        ) : null}
        <Button type="submit" className="w-full" loading={mutation.isPending}>
          Continue
        </Button>
      </form>
      <p className="mt-6 text-sm text-ink-muted">
        New here?{" "}
        <Link to="/register" className="text-accent hover:underline">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
