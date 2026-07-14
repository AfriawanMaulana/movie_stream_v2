import TrakteerPopup from "@/app/components/TrakteerPopup";

export default function MovieLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div suppressHydrationWarning>
      <TrakteerPopup />
      {children}
    </div>
  );
}
