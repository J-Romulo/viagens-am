"use client";

import Image from "next/image";
import AMLogo from "../../assets/am-logo.png";
import { CustomPopover } from "../Popover";
import { useState } from "react";
import { ProfileMenu } from "./ProfileMenu";

export function Header() {
    const [isProfileMenuOpened, setIsProfileMenuOpened] = useState(false);

    return (
        <div className="flex items-center justify-between w-full h-15 p-4 bg-primary-500 text-white shadow-lg">
            <div></div>
            <div className="flex items-center gap-x-3">
                <p>
                    Olá, usuário
                </p>

                <CustomPopover
                    isOpen={isProfileMenuOpened}
					onClose={() => setIsProfileMenuOpened(false)}
                    content={<ProfileMenu />}
                >
                    <Image 
                        src={AMLogo}
                        alt="AM Viajens logo"
                        className="rounded-full w-13 h-13 object-contain bg-primary-100 cursor-pointer"
                        unoptimized
                        onClick={() => setIsProfileMenuOpened(!isProfileMenuOpened)}
                    />
                </CustomPopover>
            </div>
        </div>
    )
}