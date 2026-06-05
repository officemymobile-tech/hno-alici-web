type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
};

export function PageHeader({ eyebrow, title, subtitle }: PageHeaderProps) {
  return (
    <header className="gradient-hero px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {eyebrow && (
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gold">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-3 font-display text-4xl font-semibold text-white sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-lg text-white/75">{subtitle}</p>
        )}
      </div>
    </header>
  );
}
