import type { ReactNode } from "react";

type Props = {
  title?: string;
  children: ReactNode;
  className?: string;
};

export default function Page({ title, children, className = "" }: Props) {
  return (
    <main className={`mx-auto w-full max-w-screen-sm px-4 pb-20 pt-4 ${className}`}>
      {title ? <h1 className="mb-4 text-lg font-semibold">{title}</h1> : null}
      {children}
    </main>
  );
}
