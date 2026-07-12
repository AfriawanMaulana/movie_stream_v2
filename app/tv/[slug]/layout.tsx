import TrakteerPopup from "@/app/components/TrakteerPopup";

export default function TVLayout({ children }: { children: React.ReactNode }) {
  return (
    <div suppressHydrationWarning>
      <TrakteerPopup />
      {children}
    </div>
  );
}
