import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface CloseButtonProps {
    onClose: () => void;
}

export function CloseButton({ onClose }: CloseButtonProps) {
    return (
        <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="ppm:absolute ppm:-top-2 ppm:-right-2 ppm:bg-white ppm:rounded-full ppm:w-8 ppm:h-8 ppm:p-0 ppm:z-10"
        >
            <X className="ppm:w-4 ppm:h-4" />
        </Button>
    );
} 