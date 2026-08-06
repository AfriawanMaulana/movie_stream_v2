import Script from "next/script";


export default function Adsbanner() {
    return (
        <div className="flex justify-center items-center">
            <Script>
                {`
                    atOptions = {
                    'key' : '11dc30a983c4986cbec90d0d54c60371',
                    'format' : 'iframe',
                    'height' : 90,
                    'width' : 728,
                    'params' : {}
                    };
                `}
            </Script>
            <Script src="https://www.highperformanceformat.com/11dc30a983c4986cbec90d0d54c60371/invoke.js"></Script>
        </div>
    )
}