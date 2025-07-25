import React, { useState } from "react";
import "./App.css";
import { Button } from "@/components/ui/button";
import { Cellphone } from "@/components/Cellphone";

/**
 * Componente principal da aplicação
 * Demonstra o uso do shadcn/ui com componentes Button e o mockup de smartphone
 */
function App() {
    const [isCellphoneOpen, setIsCellphoneOpen] = useState(false);

    /**
     * Função para abrir o mockup do smartphone
     */
    const handleOpenCellphone = () => {
        setIsCellphoneOpen(true);
    };

    /**
     * Função para fechar o mockup do smartphone
     */
    const handleCloseCellphone = () => {
        setIsCellphoneOpen(false);
    };

    return (
        <>
            {/* Botão fixo no canto esquerdo da tela */}
            <Button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleOpenCellphone();
                }}
                className="ppm:fixed ppm:top-4 ppm:left-4 ppm:z-50"
                variant="default"
                size="sm"
            >
                Celular
            </Button>

            {/* Componente do mockup de smartphone */}
            <Cellphone 
                isOpen={isCellphoneOpen} 
                onClose={handleCloseCellphone} 
            />
        </>
    );
}

export default App;
