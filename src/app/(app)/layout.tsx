import AppShell from "@/components/layout/app-shell";
import AuthSync from "@/components/layout/auth-sync";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthSync />
      <AppShell>{children}</AppShell>
    </>
  );
}
