import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface SmartphoneFrameProps {
    onClose: () => void;
    children: React.ReactNode;
}

/**
 * Componente responsável pela estrutura visual do mockup do smartphone
 * @param onClose - Função para fechar o smartphone
 * @param children - Conteúdo a ser renderizado dentro da tela do smartphone
 */
export function SmartphoneFrame({ onClose, children }: SmartphoneFrameProps) {
    return (
        <div className="ppm:fixed ppm:inset-0 ppm:bg-black/50 ppm:flex ppm:items-center ppm:justify-center ppm:z-50">
            {/* Mockup do Smartphone */}
            <div className="ppm:relative ppm:w-[300px] ppm:h-[600px] ppm:bg-gray-900 ppm:rounded-[3rem] ppm:p-2 ppm:shadow-2xl">
                {/* Botão de fechar */}
                <Button
                    onClick={onClose}
                    variant="ghost"
                    size="sm"
                    className="ppm:absolute ppm:-top-2 ppm:-right-2 ppm:bg-white ppm:rounded-full ppm:w-8 ppm:h-8 ppm:p-0 ppm:z-10"
                >
                    <X className="ppm:w-4 ppm:h-4" />
                </Button>

                {/* Tela do smartphone */}
                <div className="ppm:w-full ppm:h-full ppm:bg-white ppm:rounded-[2.5rem] ppm:overflow-hidden ppm:relative">
                    {/* Notch */}
                    <div className="ppm:absolute ppm:top-0 ppm:left-1/2 ppm:transform ppm:-translate-x-1/2 ppm:w-32 ppm:h-6 ppm:bg-black ppm:rounded-b-2xl ppm:z-10"></div>
                    
                    {/* Conteúdo da tela */}
                    <div className="ppm:flex-1 ppm:h-full ppm:flex ppm:flex-col">
                        {children}
                    </div>

                    {/* Home indicator */}
                    <div className="ppm:absolute ppm:bottom-2 ppm:left-1/2 ppm:transform ppm:-translate-x-1/2 ppm:w-32 ppm:h-1 ppm:bg-gray-400 ppm:rounded-full"></div>
                </div>
            </div>
        </div>
    );
}