import React from "react";
import { Cellphone } from "@/components/Cellphone";

/**
 * Componente principal da aplicação dentro do iframe
 * O smartphone fica sempre visível e delega o fechamento via postMessage
 */
function App() {
  return (
    <Cellphone
      isOpen={true}
      onClose={() => {
        // Solicita ao documento pai esconder o iframe
        window.parent.postMessage("closeSmartphone", "*");
      }}
    />
  );
}

export default App;
