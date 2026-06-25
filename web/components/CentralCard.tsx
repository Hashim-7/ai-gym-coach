import type { ReactNode } from "react";

interface CentralCardProps {
  heading: string;
  children: ReactNode;
}

export default function CentralCard({ heading, children }: CentralCardProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-300 card-body">
        <h2 className="card-title justify-center mb-6 text-3xl font-semibold tracking-tight">
          {heading}
        </h2>
        {children}
      </div>
    </div>
  );
}
