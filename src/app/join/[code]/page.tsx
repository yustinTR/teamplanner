interface JoinPageProps {
  params: Promise<{ code: string }>;
}

export default async function JoinPage({ params }: JoinPageProps) {
  const { code } = await params;

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Team joinen</h1>
        <p className="mt-2 text-muted-foreground">Uitnodigingscode: {code}</p>
      </div>
    </main>
  );
}
