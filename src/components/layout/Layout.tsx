import { AppShell } from '@/components/layout/AppShell';

export function Layout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
