import { useState, useEffect } from "react";

/**
 * Hook personalizado para sincronizar o horário com elementos da página
 * Monitora mudanças no DOM e extrai o horário de elementos específicos
 * @returns currentTime - Horário atual formatado
 */
export function useTimeSync() {
    const [currentTime, setCurrentTime] = useState("9:41");

    useEffect(() => {
        /**
         * Função para extrair o horário de elementos da página
         */
        const updateTimeFromPage = () => {
            // Procura por elementos que podem conter horário
            const timeSelectors = [
                '[data-time]',
                '.time',
                '.clock',
                '[class*="time"]',
                '[class*="clock"]'
            ];

            for (const selector of timeSelectors) {
                const timeElement = document.querySelector(selector);
                if (timeElement && timeElement.textContent) {
                    const timeText = timeElement.textContent.trim();
                    // Regex para capturar horário no formato HH:MM
                    const timeMatch = timeText.match(/\b([0-1]?[0-9]|2[0-3]):[0-5][0-9]\b/);
                    if (timeMatch) {
                        setCurrentTime(timeMatch[0]);
                        return;
                    }
                }
            }

            // Fallback: usar horário atual do sistema
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            setCurrentTime(`${hours}:${minutes}`);
        };

        // Atualiza o horário inicialmente
        updateTimeFromPage();

        // Configura o MutationObserver para monitorar mudanças no DOM
        const observer = new MutationObserver((mutations) => {
            let shouldUpdate = false;
            
            mutations.forEach((mutation) => {
                // Verifica se houve mudanças no texto de elementos
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    shouldUpdate = true;
                }
                
                // Verifica mudanças em atributos relacionados ao tempo
                if (mutation.type === 'attributes' && 
                    (mutation.attributeName === 'data-time' || 
                     mutation.attributeName?.includes('time'))) {
                    shouldUpdate = true;
                }
            });
            
            if (shouldUpdate) {
                updateTimeFromPage();
            }
        });

        // Inicia a observação do documento
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true,
            attributeFilter: ['data-time', 'class']
        });

        // Atualiza o horário a cada minuto como fallback
        const interval = setInterval(updateTimeFromPage, 60000);

        // Cleanup
        return () => {
            observer.disconnect();
            clearInterval(interval);
        };
    }, []);

    return { currentTime };
}