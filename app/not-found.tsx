import Link from "next/link";
import Navbar from "./components/Navbar";


export default function Page() {
    return (
        <div className="flex flex-col">
            <Navbar />
            <section className="flex flex-col space-y-4 w-full h-screen justify-center items-center">
                <h1 className="font-black text-8xl">Oops!</h1>
                <div className="flex flex-col space-y-2 items-center justify-center">
                    <p className="font-semibold text-lg">404 - PAGE NOT FOUND</p>
                    <Link href={'/'} className="bg-red-500 hover:bg-red-600 py-1 px-4 rounded-md flex gap-2 items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>
                        <p>Home</p>
                    </Link>
                </div>
            </section>
        </div>
    )
}