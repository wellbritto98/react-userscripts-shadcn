import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMigration } from "@/lib/migrate-search-fields";

export function AdminScreen() {
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<{
    success?: boolean;
    error?: any;
  } | null>(null);
  
  const { runMigration } = useMigration();

  const handleMigration = async () => {
    setIsMigrating(true);
    setMigrationResult(null);
    
    try {
      const result = await runMigration();
      setMigrationResult(result);
    } catch (error) {
      setMigrationResult({ success: false, error });
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="ppm:p-4 ppm:space-y-6">
      <h1 className="ppm:text-2xl ppm:font-bold ppm:text-center ppm:mb-6">
        Administração
      </h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Migração dos Campos de Busca</CardTitle>
        </CardHeader>
        <CardContent className="ppm:space-y-4">
          <p className="ppm:text-sm ppm:text-gray-600">
            Este processo atualiza todos os usuários existentes para incluir campos de busca otimizados (n-grams).
            Execute apenas uma vez para migrar todos os usuários.
          </p>
          
          <div className="ppm:space-y-2">
            <h3 className="ppm:font-semibold">O que será feito:</h3>
            <ul className="ppm:text-sm ppm:text-gray-600 ppm:list-disc ppm:list-inside ppm:space-y-1">
              <li>Gerar n-grams (2-gram e 3-gram) para username e displayName</li>
              <li>Normalizar texto (minúsculas, sem acentos)</li>
              <li>Adicionar campos searchGrams2, searchGrams3 e searchText</li>
              <li>Atualizar todos os usuários existentes</li>
            </ul>
          </div>
          
          <Button 
            onClick={handleMigration}
            disabled={isMigrating}
            className="ppm:w-full"
          >
            {isMigrating ? "Migrando..." : "Executar Migração"}
          </Button>
          
          {migrationResult && (
            <div className={`ppm:p-3 ppm:rounded ppm:text-sm ${
              migrationResult.success 
                ? "ppm:bg-green-100 ppm:text-green-800" 
                : "ppm:bg-red-100 ppm:text-red-800"
            }`}>
              {migrationResult.success ? (
                <div>
                  <p className="ppm:font-semibold">✅ Migração concluída com sucesso!</p>
                  <p>Os campos de busca foram atualizados para todos os usuários.</p>
                </div>
              ) : (
                <div>
                  <p className="ppm:font-semibold">❌ Erro na migração</p>
                  <p>{migrationResult.error?.message || "Erro desconhecido"}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 