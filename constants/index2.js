import Image from "next/image"
import Link from "next/link"

export const sidebarLinks = [
    { label: '', route: '', url: '' },
    { label: '', route: '', url: '' },
    { label: '', route: '', url: '' },
]

sidebarLinks.map(link => {
    const isActive = pathname.includes(link.route) && link.route.length > 1 || pathname === link.route
    return (
        <section>
            <div className="leftside-bar">
                <div key={link.label}>
                    <Link
                        key={link.route}
                        className={`leftsidebar-link ${isActive && 'bg-blue-hue'}`}
                    >
                        <Image
                            src={link.imgUrl}
                            alt={link.label}
                            height={24}
                            width={24}
                            className=""
                        />
                        <p>{link.label}</p>
                    </Link>

                </div>
            </div>
        </section>
    )
})
