import React, { useEffect, useState } from "react";

export function StatusBar() {
    const [currentTime, setCurrentTime] = useState("9:41");

    useEffect(() => {
        const extractTime = (text: string): string => {
            const timeMatch = text.match(/(\d{1,2}:\d{2})/);
            return timeMatch ? timeMatch[1] : "9:41";
        };
        const updateTimeFromElement = () => {
            const timeElement = document.getElementById("character-tools-location");
            if (timeElement && timeElement.textContent) {
                const extractedTime = extractTime(timeElement.textContent);
                setCurrentTime(extractedTime);
            }
        };
        updateTimeFromElement();
        const timeElement = document.getElementById("character-tools-location");
        if (timeElement) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === "childList" || mutation.type === "characterData") {
                        updateTimeFromElement();
                    }
                });
            });
            observer.observe(timeElement, {
                childList: true,
                subtree: true,
                characterData: true
            });
            return () => {
                observer.disconnect();
            };
        }
    }, []);

    return (
        <div className="ppm:h-12 ppm:bg-gray-50 ppm:flex ppm:items-center ppm:justify-between ppm:px-6 ppm:pt-6">
            <span className="ppm:text-sm ppm:font-medium">{currentTime}</span>
            <div className="ppm:flex ppm:items-center ppm:gap-1">
                <div className="ppm:w-4 ppm:h-2 ppm:bg-green-500 ppm:rounded-sm">100%</div>
            </div>
        </div>
    );
} 