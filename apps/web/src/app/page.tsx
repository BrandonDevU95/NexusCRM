import {
  foundationDescription,
  foundationHeadline,
  foundationModules,
} from "./foundation";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-10">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
          NexusCRM
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950">
          {foundationHeadline}
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          {foundationDescription}
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {foundationModules.map((module) => (
          <article
            key={module}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <h2 className="font-semibold text-slate-900">{module}</h2>
            <p className="mt-2 text-sm text-slate-500">
              Feature preparada para implementación.
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
