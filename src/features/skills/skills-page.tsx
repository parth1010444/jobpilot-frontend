import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage } from "@/shared/api/client";
import { skillsApi } from "@/shared/api/endpoints";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/ui/empty-state";
import { ErrorBanner } from "@/shared/ui/error-banner";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { PageHeader } from "@/shared/ui/page-header";
import { Skeleton } from "@/shared/ui/skeleton";

export function SkillsPage() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const skills = useQuery({ queryKey: ["skills"], queryFn: skillsApi.list });

  const create = useMutation({
    mutationFn: () => skillsApi.create(name.trim()),
    onSuccess: () => {
      setName("");
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      queryClient.invalidateQueries({ queryKey: ["match"] });
      toast.success("Skill added");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const remove = useMutation({
    mutationFn: skillsApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      toast.success("Skill removed");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <div>
      <PageHeader
        title="Skills"
        description="Normalized lowercase names, unique per user. These drive JD match coverage."
      />

      <form
        className="mb-6 flex max-w-xl flex-col gap-3 sm:flex-row sm:items-end"
        onSubmit={(event) => {
          event.preventDefault();
          if (name.trim()) create.mutate();
        }}
      >
        <div className="flex-1">
          <Label htmlFor="skill">Add a skill</Label>
          <Input
            id="skill"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Java, Kafka, system design…"
          />
        </div>
        <Button type="submit" loading={create.isPending}>
          Add skill
        </Button>
      </form>

      {skills.error ? (
        <div className="mb-4">
          <ErrorBanner error={skills.error} />
        </div>
      ) : null}

      {skills.isLoading ? (
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 8 }, (_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-full" />
          ))}
        </div>
      ) : skills.data && skills.data.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {skills.data.map((skill) => (
            <li
              key={skill.id}
              className="inline-flex items-center gap-1.5 rounded-full bg-elevated px-3 py-1.5 text-sm ring-1 ring-line"
            >
              <span className="capitalize">{skill.name}</span>
              <button
                type="button"
                aria-label={`Remove ${skill.name}`}
                className="rounded-full p-0.5 text-ink-faint hover:bg-white/8 hover:text-ink"
                onClick={() => remove.mutate(skill.id)}
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          icon={<Sparkles className="size-5" />}
          title="No skills yet"
          description="Add the stack you actually have. Match scores are coverage of JD requirements, not hiring probability."
        />
      )}
    </div>
  );
}
