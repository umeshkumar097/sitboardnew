export default function BrandLogo({ className = "w-8 h-8", textClassName = "text-xl" }: { className?: string, textClassName?: string }) {
    return (
        <div className="flex items-center gap-2">
            <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={className}
            >
                {/* Pin Shape */}
                <path
                    d="M16 28L12.0001 20.2858C8.54546 18.5584 6 15.2208 6 11.5714C6 6.28571 10.4772 2 16 2C21.5229 2 26 6.28571 26 11.5714C26 15.2208 23.4545 18.5584 20.0001 20.2858L16 28Z"
                    stroke="#0056D2"
                    strokeWidth="2.5"
                    fill="white"
                />

                {/* Inner Grid */}
                <rect x="10.5" y="6.5" width="4" height="4" fill="#E2E8F0" rx="0.5" />
                <rect x="15.5" y="6.5" width="4" height="4" fill="#E2E8F0" rx="0.5" />
                <rect x="20.5" y="6.5" width="4" height="4" fill="#22C55E" rx="0.5" /> {/* Green */}

                <rect x="10.5" y="11.5" width="4" height="4" fill="#E2E8F0" rx="0.5" />
                <rect x="15.5" y="11.5" width="4" height="4" fill="#F59E0B" rx="0.5" /> {/* Orange/Yellow */}
                <rect x="20.5" y="11.5" width="4" height="4" fill="#E2E8F0" rx="0.5" />

                <rect x="10.5" y="16.5" width="4" height="4" fill="#EF4444" rx="0.5" /> {/* Red */}
                <rect x="15.5" y="16.5" width="4" height="4" fill="#E2E8F0" rx="0.5" />
                <rect x="20.5" y="16.5" width="4" height="4" fill="#E2E8F0" rx="0.5" />
            </svg>
            <div className="flex flex-col justify-center">
                <span className={`font-bold tracking-tight text-[#0056D2] leading-none ${textClassName}`}>
                    SiteBoard
                </span>
                <span className="text-[8px] text-gray-400 font-medium tracking-wide uppercase leading-none mt-0.5">Your Project. One Board.</span>
            </div>
        </div>
    );
}
