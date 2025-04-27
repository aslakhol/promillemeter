import { Toaster } from "@/components/ui/toaster";
import { PromillemeterForm } from "@/components/promillemeter-form";

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Promillemeter</h1>
        </header>

        <PromillemeterForm />
      </div>
      <Toaster />
    </main>
  );
}
