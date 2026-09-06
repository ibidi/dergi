import Link from "next/link";

export default function SectionHeading({
  title,
  href,
  action = "Tümü",
}: {
  title: string;
  href: string;
  action?: string;
}) {
  return (
    <div className="flex items-end justify-between mb-6 border-b-2 border-neutral-950 pb-3">
      <h2 className="text-2xl md:text-3xl font-black tracking-tight">{title}</h2>
      <Link href={href} className="text-xs font-bold uppercase tracking-widest text-brand-500 hover:text-brand-600">
        {action} →
      </Link>
    </div>
  );
}
