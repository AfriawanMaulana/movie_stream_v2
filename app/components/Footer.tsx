import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="flex w-full h-auto border-t border-white/20 px-5 lg:px-14 py-10">
            <div className="flex flex-col space-y-3 w-96">
                <Link href={"/"} className="font-black text-2xl text-red-500">
                    <Image src={'/logo.png'} alt="logo.png" width={200} height={200} />
                </Link>
                <p className="text-[13px] text-white/80">TERFLIX adalah platform streaming film, series, anime, dengan berbagai subtitle tersedia dan menyediakan kualitas terbaik yang ada dipasaran Indonesia secara gratis, namun tidak seperti platform streaming lainnya, TERFLIX ingin menyediakan layanan nonton film dengan kualitas bagus dan tidak ada bayaran apapun untuk menikmati film atau series yang ada disitus TERFLIX ini, karena tidak semua wilayah di Indonesia memiliki bioskop untuk menonton film-film terbaru.</p>
            </div>
        </footer>
    )
}