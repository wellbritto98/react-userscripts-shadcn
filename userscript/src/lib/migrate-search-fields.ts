import { userRepository } from './repositories';

/**
 * Script para migrar usuários existentes para incluir campos de busca
 * Execute este script uma vez para atualizar todos os usuários existentes
 */
export async function migrateSearchFields() {
  try {
    console.log('🚀 Iniciando migração dos campos de busca...');
    
    await userRepository.migrateAllUsersToSearchFields();
    
    console.log('✅ Migração concluída com sucesso!');
    console.log('📝 Agora todos os usuários têm campos de busca otimizados.');
    console.log('🔍 A busca melhorada está pronta para uso.');
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    throw error;
  }
}

// Função para executar a migração (pode ser chamada de um componente ou hook)
export function useMigration() {
  const runMigration = async () => {
    try {
      await migrateSearchFields();
      return { success: true };
    } catch (error) {
      console.error('Erro na migração:', error);
      return { success: false, error };
    }
  };

  return { runMigration };
} 