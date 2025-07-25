import { Button } from "../ui/button";

export function AjudaScreen() {
    return (
        <div className="ppm:space-y-4">
            <h2 className="ppm:text-lg ppm:font-bold">Ajuda</h2>
            <p className="ppm:text-sm">Aqui vão informações de ajuda.</p>
            <Button variant="outline" size="sm" onClick={() => window.history.back()}>Voltar</Button>
        </div>
    );
}