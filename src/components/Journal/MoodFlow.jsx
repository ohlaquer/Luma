import { useState } from "react";
import MoodPanel from "./MoodPanel";

export default function MoodFlow({ onComplete }) {
    const [step, setStep] = useState(1);
    const [mood, setMood] = useState({ index: 3 });
    const [tags, setTags] = useState([]);
    const [influence, setInfluence] = useState([]);
    const [panelVisible, setPanelVisible] = useState(true);
    const [moodMeta, setMoodMeta] = useState(null);

    return (
        <div className="w-full bg-[var(--block)] rounded-xl p-4 transition-all duration-300 flex flex-col justify-between">
            {step >= 1 && step <= 3 && (
                <MoodPanel
                    step={step}
                    setStep={setStep}
                    show={panelVisible}
                    mood={mood}
                    setMood={setMood}
                    selectedTags={tags}
                    setSelectedTags={setTags}
                    selectedReasons={influence}
                    setSelectedReasons={setInfluence}
                    onSliderNext={() => setStep(2)}
                    onTagsNext={() => setStep(3)}
                    onInfluenceNext={(payload) => {
                        setPanelVisible(false);
                        setTimeout(() => {
                            onComplete({
                                mood,
                                tags,
                                influence,
                                gradient: payload?.gradient,   // ← градієнт
                                moodEmoji: payload?.emoji,     // ← емодзі (на випадок якщо треба)
                                moodLabel: payload?.label,     // ← назва настрою (якщо треба)
                                colors: payload?.colors,
                            });
                            setPanelVisible(true);
                        }, 300);
                    }}


                />
            )}
        </div>
    );
}
