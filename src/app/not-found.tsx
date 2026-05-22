import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-[1360px] flex-col items-center justify-center px-6 py-24 text-center md:px-14">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
        Error 404
      </p>
      <h1 className="mt-5 font-serif text-6xl uppercase leading-[0.95] tracking-tight md:text-8xl">
        Page Not Found
      </h1>
      <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-muted">
        The page you are looking for has moved, or never existed.
      </p>
      <ButtonLink href="/" variant="primary" className="mt-10">
        Back to Home
      </ButtonLink>
    </section>
  );
}
