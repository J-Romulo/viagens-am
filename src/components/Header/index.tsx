import Image from "next/image";
import AMLogo from "../../assets/am-logo.png";

export function Header() {

    return (
        <div className="flex items-center justify-between w-full h-20 p-4 bg-primary-500 text-white shadow-lg">
            <div></div>
            <div className="flex items-center gap-x-3">
                <p>
                    Olá, usuário
                </p>

                <Image 
                    src={AMLogo}
                    alt="AM Viajens logo"
                    className="rounded-full w-17 h-17 object-contain bg-primary-100"
                    unoptimized
                />
            </div>
        </div>
    )
}