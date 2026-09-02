import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { createOrganization } from "../api/organization.api";
import { useAuth } from "../context/AuthContext";

const organizationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Organization name must be at least 3 characters"),
  slug: z
    .string()
    .trim()
    .min(3, "Slug must be at least 3 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    ),
});

const CreateOrganization = () => {
  const navigate = useNavigate();
  const { setActiveOrganizationId } = useAuth();

  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const generateSlug = (value) => {
    const slug = value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    setValue("slug", slug, {
      shouldValidate: true,
    });
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);

      const response = await createOrganization(data);

      const organization = response.data;

      localStorage.setItem(
        "activeOrganizationId",
        organization.id
      );

      setActiveOrganizationId(organization.id);

      toast.success("Organization created successfully.");

      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to create organization."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
              <Building2 className="h-6 w-6 text-blue-400" />
            </div>

            <h1 className="text-2xl font-semibold text-white">
              Create your organization
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Set up your workspace to start using SupportSphere.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Organization Name
              </label>

              <input
                id="name"
                type="text"
                {...register("name", {
                  onChange: (event) => {
                    generateSlug(event.target.value);
                  },
                })}
                placeholder="Acme Support"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
              />

              {errors.name && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="slug"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Organization Slug
              </label>

              <input
                id="slug"
                type="text"
                {...register("slug")}
                placeholder="acme-support"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
              />

              {errors.slug && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.slug.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              {submitting
                ? "Creating organization..."
                : "Create Organization"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            You will automatically become the organization owner.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateOrganization;