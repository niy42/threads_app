"use client"

import { sidebarLinks } from "@/constants"
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { SignOutButton, SignedIn, useAuth } from "@clerk/nextjs";

import { useClerk } from '@clerk/clerk-react';

export function CustomSignOutButton() {
    const { signOut } = useClerk();
    const router = useRouter();


    const handleSignOut = async () => {
        await signOut();
        router.push('/sign-in'); // Navigate to the sign-in page after signing out
    };

    return (
        <div className="flex gap-4 p-4 cursor-pointer" onClick={handleSignOut}>
            <Image
                src="/assets/logout.svg"
                alt="logout"
                width={24}
                height={24}
            />
            <p className="text-light-2 max-lg:hidden">Logout</p>
        </div>
    );
}

export default function LeftSidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const { userId } = useAuth();

    return (
        <section className="custom-scrollbar leftsidebar">
            <div className="flex w-full flex-1 flex-col gap-6 px-6">
                {sidebarLinks.map((link) => {

                    const isActive = (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route;
                    if (link.route === '/profile') link.route = `${link.route}/${userId}`
                    return (
                        <div key={link.label}>
                            <Link
                                href={link.route}
                                key={link.label}
                                className={`leftsidebar_link ${isActive && 'bg-primary-500'
                                    }`}>
                                <Image
                                    src={link.imgURL}
                                    alt={link.label}
                                    width={24}
                                    height={24}
                                />
                                <p className="text-light-1 max-lg:hidden">{link.label}</p>

                            </Link>
                        </div>)

                })}
            </div>
            <div className="mt-10 px-6">
                <CustomSignOutButton />
            </div>
        </section>
    );
}