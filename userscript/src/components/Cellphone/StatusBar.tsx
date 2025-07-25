import React, { useState, useEffect } from "react";

interface StatusBarProps {
    currentTime: string;
}

/**
 * Componente responsável pela barra de status do smartphone
 * @param currentTime - Horário atual a ser exibido
 */
export function StatusBar({ currentTime }: StatusBarProps) {
    return (
        <div className="ppm:flex ppm:justify-between ppm:items-center ppm:px-6 ppm:py-2 ppm:bg-white ppm:text-black ppm:text-sm ppm:font-medium">
            <div className="ppm:flex ppm:items-center ppm:space-x-1">
                <span>{currentTime}</span>
            </div>
            <div className="ppm:flex ppm:items-center ppm:space-x-1">
                <div className="ppm:flex ppm:space-x-1">
                    <div className="ppm:w-1 ppm:h-1 ppm:bg-black ppm:rounded-full"></div>
                    <div className="ppm:w-1 ppm:h-1 ppm:bg-black ppm:rounded-full"></div>
                    <div className="ppm:w-1 ppm:h-1 ppm:bg-black ppm:rounded-full"></div>
                    <div className="ppm:w-1 ppm:h-1 ppm:bg-gray-300 ppm:rounded-full"></div>
                </div>
                <div className="ppm:w-6 ppm:h-3 ppm:border ppm:border-black ppm:rounded-sm ppm:relative">
                    <div className="ppm:w-4 ppm:h-2 ppm:bg-black ppm:rounded-sm ppm:absolute ppm:top-0.5 ppm:left-0.5"></div>
                    <div className="ppm:w-0.5 ppm:h-1 ppm:bg-black ppm:absolute ppm:-right-0.5 ppm:top-1"></div>
                </div>
            </div>
        </div>
    );
}