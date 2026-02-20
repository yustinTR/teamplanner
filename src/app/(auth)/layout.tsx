import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700">
      {/* Football pitch pattern overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]">
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white" />
        <div className="absolute inset-x-0 top-1/2 h-px bg-white" />
        <div className="absolute inset-y-[15%] left-0 w-[25%] border-[3px] border-l-0 border-white" />
        <div className="absolute inset-y-[15%] right-0 w-[25%] border-[3px] border-r-0 border-white" />
      </div>

      <div className="relative z-10 w-full max-w-sm px-4">
        {/* Logo / Brand */}
        <div className="mb-8 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icons/icon-192x192.svg"
            alt="MyTeamPlanner logo"
            width={64}
            height={64}
            className="mx-auto mb-3 rounded-2xl"
          />
          <h1 className="text-2xl font-bold text-white">MyTeamPlanner</h1>
          <p className="mt-1 text-sm text-white/60">
            De teamplanner voor amateurvoetbal
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-2xl bg-white p-6 shadow-xl">
          {children}
        </div>
      </div>
    </main>
  );
}
