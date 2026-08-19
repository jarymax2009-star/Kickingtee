import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
      <Image
        src="/brand/mark.png"
        alt=""
        width={584}
        height={248}
        className="h-16 w-auto opacity-90"
      />
      <p className="mt-8 font-display text-sm font-bold uppercase tracking-wide text-brand-blue">
        404
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold text-brand-navy sm:text-4xl">
        That kick went wide
      </h1>
      <p className="mt-3 max-w-md text-brand-grey">
        We couldn&apos;t find the page you&apos;re looking for. It may have
        moved, or the link might be off by a mile.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/shop"
          className="rounded-md bg-brand-blue px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-navy"
        >
          Shop all tees
        </Link>
        <Link
          href="/"
          className="rounded-md border border-brand-silver px-6 py-3 text-sm font-bold text-brand-navy transition hover:border-brand-blue hover:text-brand-blue"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
