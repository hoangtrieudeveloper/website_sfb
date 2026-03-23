"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * Radix Select sinh aria-controls từ useId(); với Next SSR + Turbopack đôi khi
 * ID server ≠ client → hydration mismatch. Chỉ mount Select sau khi client sẵn sàng.
 */
export function SelectMountGuard({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return <>{fallback}</>;
  return <>{children}</>;
}
