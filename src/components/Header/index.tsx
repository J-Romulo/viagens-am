"use client";

import Image from "next/image";
import { CustomPopover } from "../Popover";
import { use, useState } from "react";
import { ProfileMenu } from "./ProfileMenu";
import { AuthContext } from "../../Contexts/AuthContext";
import AMLogoDark from "../../assets/am-logo-dark.png"

export function Header() {
    const { user } = use(AuthContext);
    
    const [isProfileMenuOpened, setIsProfileMenuOpened] = useState(false);

    return (
        <div className="flex items-center justify-between w-full h-15 p-4 bg-primary-500 text-white shadow-lg">
            <div>
                <Image src={AMLogoDark} alt="AM Viagens logo" width={100} height={150} unoptimized/>
            </div>
            <div className="flex items-center gap-x-3">
                <p>
                    { user?.name }
                </p>

                <CustomPopover
                    isOpen={isProfileMenuOpened}
					onClose={() => setIsProfileMenuOpened(false)}
                    content={<ProfileMenu />}
                >
                    {user && user.avatar ? (
                        <Image 
                            src={`${process.env.NEXT_PUBLIC_API_URL}/images/avatars/${user.avatar}`}
                            alt="Imagem de perfil"
                            className="rounded-full w-13 h-13 object-contain bg-white cursor-pointer"
                            unoptimized
                            width={13}
                            height={13}
                            onClick={() => setIsProfileMenuOpened(!isProfileMenuOpened)}
                        />
                    ) : (
                        <div className="w-13 h-13 rounded-full bg-primary-100 flex items-center justify-center cursor-pointer" onClick={() => setIsProfileMenuOpened(!isProfileMenuOpened)}>
                            <span className="text-4xl font-bold text-primary-500">
                                {user?.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}
                </CustomPopover>
            </div>
        </div>
    )
}