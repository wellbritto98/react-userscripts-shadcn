import React from "react";
import "./App.css";
import { Button } from "@/components/ui/button";

/**
 * Componente principal da aplicação
 * Demonstra o uso do shadcn/ui com componentes Button
 */
function App() {
    return (
        <div className="flex min-h-screen w-100 flex-col items-center justify-center gap-4 p-8">
            <h1 className="text-4xl font-bold text-foreground mb-8">
                React Userscript com shadcn/ui
            </h1>
            
            <div className="flex flex-wrap gap-4 items-center justify-center">
                <Button variant="default">
                    Botão Padrão
                </Button>
                
                <Button variant="secondary">
                    Botão Secundário
                </Button>
                
                <Button variant="outline">
                    Botão Outline
                </Button>
                
                <Button variant="destructive">
                    Botão Destrutivo
                </Button>
                
                <Button variant="ghost">
                    Botão Ghost
                </Button>
                
                <Button variant="link">
                    Botão Link
                </Button>
            </div>
            
            <div className="flex gap-4 items-center justify-center mt-4">
                <Button size="sm">
                    Pequeno
                </Button>
                
                <Button size="default">
                    Padrão
                </Button>
                
                <Button size="lg">
                    Grande
                </Button>
            </div>
            
            <p className="text-muted-foreground text-center max-w-md mt-8">
                Este é um exemplo de React userscript usando shadcn/ui. 
                Os componentes estão funcionando corretamente com Tailwind CSS.
            </p>
        </div>
    );
}

export default App;
