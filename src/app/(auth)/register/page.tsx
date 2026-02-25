import { RegisterForm } from "@/components/molecules/RegisterForm";

interface RegisterPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const { next } = await searchParams;
  return <RegisterForm next={next} />;
}
