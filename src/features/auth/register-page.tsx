import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
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
  name: z.string().max(255),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormValues = z.infer<typeof schema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const setSession = useSession((s) => s.setSession);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      authApi.register({
        email: values.email,
        password: values.password,
        name: values.name || undefined,
      }),
    onSuccess: (data) => {
      setSession(data.accessToken, data.user);
      toast.success("Account created");
      navigate("/", { replace: true });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Unable to register"));
    },
  });

  return (
    <AuthLayout
      title="Create your workspace"
      subtitle="Registers against POST /api/auth/register. Duplicate emails return 409."
    >
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        noValidate
      >
        <Field error={form.formState.errors.name?.message}>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            autoComplete="name"
            placeholder="Ada Lovelace"
            {...form.register("name")}
          />
        </Field>
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
            autoComplete="new-password"
            placeholder="At least 8 characters"
            {...form.register("password")}
          />
        </Field>
        {mutation.error ? (
          <p className="text-sm text-danger" role="alert">
            {getErrorMessage(mutation.error)}
          </p>
        ) : null}
        <Button type="submit" className="w-full" loading={mutation.isPending}>
          Create account
        </Button>
      </form>
      <p className="mt-6 text-sm text-ink-muted">
        Already flying?{" "}
        <Link to="/login" className="text-accent hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
