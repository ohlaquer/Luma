import React from "react";
import { Type, Pencil, Image, SmilePlus } from "lucide-react";

export default function BottomToolbar({
                                          onToggleFormatPanel,
                                          onToggleQuestionPanel,
                                          onToggleMoodPanel,
                                          onImageUploadClick,
                                          mood,
                                          setMood,
                                      }) {
    return (
        <div className="flex justify-center items-center px-4 py-3 text-[var(--muted)] text-xl gap-6">
            <Type
                className="w-5 h-5 hover:text-[var(--primary)] cursor-pointer"
                onClick={onToggleFormatPanel}
            />

            <Pencil
                className="w-5 h-5 hover:text-[var(--primary)] cursor-pointer"
                onClick={onToggleQuestionPanel}
            />

            <Image
                className="w-5 h-5 hover:text-[var(--primary)] cursor-pointer"
                onClick={onImageUploadClick}
            />

            <SmilePlus
                className="w-5 h-5 hover:text-[var(--primary)] cursor-pointer"
                onClick={onToggleMoodPanel}
            />
        </div>
    );
}
