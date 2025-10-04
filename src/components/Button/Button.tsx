"use client";

import { ReactNode } from "react";

interface MyButtonProps{
    children: ReactNode;
    onClick: () => void;
    className?: string;
    color?: "buttonPrimary" | "buttonSecondary" | "buttonCategory" | "buttonCategoryActive";
    disabled?: boolean;
}

export default function MyButton({
    children,
    onClick,
    className = "",
    color = "buttonPrimary",
    disabled = false,
}: MyButtonProps) {
    const colorClasses = {
        buttonPrimary: "bg-black-nomad text-white border border-black-nomad rounded-lg text-lg font-bold",
        buttonSecondary: "bg-white text-black-nomad border border-black-nomad rounded-lg text-lg font-bold",
        buttonCategory: "bg-white text-black-nomad border border-black-nomad rounded-lg text-lg font-medium",
        buttonCategoryActive: "bg-black-nomad text-white border border-black-nomad rounded-lg text-lg font-medium",
    };

    return(
        <button type="submit" onClick={onClick} disabled={disabled} className={`${className} ${colorClasses[color]}
         disabled:bg-gray-500 disabled:border disabled:border-gray-500 disabled:text-white disabled:cursor-not-allowed`}
        >{children}</button>
    )
}