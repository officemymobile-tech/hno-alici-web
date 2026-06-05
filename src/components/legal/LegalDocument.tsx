import type { LegalDocument as LegalDocumentType } from "@/content/legal/types";

type Props = {
  document: LegalDocumentType;
};

export function LegalDocument({ document }: Props) {
  return (
    <article className="space-y-10">
      <p className="text-sm text-text-muted">
        Stand: {document.updated}
      </p>
      {document.sections.map((section) => (
        <section key={section.id ?? section.title} id={section.id}>
          <h2 className="font-display text-2xl font-semibold text-petrol">{section.title}</h2>
          <div className="mt-4 space-y-4 text-text-muted">
            {section.paragraphs.map((p) => (
              <p key={p.slice(0, 40)} dangerouslySetInnerHTML={{ __html: p }} />
            ))}
            {section.list && (
              <ul className="list-disc space-y-2 pl-5">
                {section.list.map((item) => (
                  <li key={item} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ul>
            )}
          </div>
        </section>
      ))}
    </article>
  );
}
