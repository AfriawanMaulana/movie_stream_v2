import { Suspense } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>
      {children}
      <Footer />
    </div>
  );
}
