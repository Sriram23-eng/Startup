import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden">
      <div className="mesh pointer-events-none absolute inset-0 opacity-60" />
      <div className="container-x relative grid min-h-[60vh] place-items-center py-20 text-center">
        <div>
          <div className="text-7xl font-black text-gradient">404</div>
          <h1 className="mt-4 text-2xl font-extrabold text-navy-800">
            This circuit leads nowhere
          </h1>
          <p className="mt-2 text-navy-700/60">
            The page you’re looking for doesn’t exist or was moved.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button href="/">Back home</Button>
            <Button href="/projects" variant="outline">
              Browse projects
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
