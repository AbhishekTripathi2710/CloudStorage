import { useState, useRef, useEffect } from "react";

export default function ActionMenu({ options }) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    
    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div 
            className="relative" 
            ref={menuRef}
            onClick={(e) => e.stopPropagation()}
        >
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setOpen(!open);
                }}
                className="text-gray-600 hover:text-black text-xl"
            >
                ⋮
            </button>

            {open && (
                <div 
                    className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border z-50"
                    onClick={(e) => e.stopPropagation()}
                >
                    {options.map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpen(false);
                                opt.onClick();
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
