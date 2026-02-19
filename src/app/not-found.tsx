import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { FileQuestion } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <FileQuestion className="mb-4 size-12 text-muted-foreground" />
      <h1 className="text-xl font-semibold">Pagina niet gevonden</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        De pagina die je zoekt bestaat niet of is verplaatst.
      </p>
      <Link href="/" className="mt-4">
        <Button>Naar home</Button>
      </Link>
    </div>
  );
}
