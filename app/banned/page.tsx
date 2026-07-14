// app/banned/page.tsx
export default function BannedPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <h1 className="text-3xl font-bold text-red-500">Akun Kamu Diblokir</h1>
      <p className="opacity-60 mt-2 max-w-md">
        Akun kamu telah dinonaktifkan karena melanggar ketentuan penggunaan.
        Hubungi admin jika kamu merasa ini adalah kesalahan.
      </p>
    </div>
  );
}
