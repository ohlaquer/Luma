import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { moodTags } from "./moodTags";
import { moodReasons } from "./moodReasons";

export default function MoodPanel({
                                      step,
                                      setStep,
                                      mood,
                                      setMood,
                                      selectedTags,
                                      setSelectedTags,
                                      selectedReasons,
                                      setSelectedReasons,
                                      onSliderNext,
                                      onTagsNext,
                                      onInfluenceNext,
                                  }) {
    const gradientsLight = [
        { center: "#DCD8E9", edge: "#BAADD8" },
        { center: "#E2E9F9", edge: "#C5CEEB" },
        { center: "#DCEDFD", edge: "#B9C8DD" },
        { center: "#DFE8ED", edge: "#C3D1D4" },
        { center: "#DFEFC2", edge: "#BBD58C" },
        { center: "#F1EBD2", edge: "#E2D299" },
        { center: "#FFE7C9", edge: "#FEC484" },
    ];


    const reasons = moodReasons;
    const gradients = gradientsLight;

    const [noted, setNoted] = useState(false);

    const moodConfig = [
        { label: "Дуже погано", emoji: "😖" },
        { label: "Погано", emoji: "😔" },
        { label: "Скоріше погано", emoji: "😕" },
        { label: "Нейтрально", emoji: "😐" },
        { label: "Скоріше добре", emoji: "🙂" },
        { label: "Добре", emoji: "😄" },
        { label: "Дуже добре", emoji: "🤩" },
    ];

    const moodIndex = mood?.index ?? 3;
    const roundedIndex = Math.round(moodIndex);
    const { label, emoji } = moodConfig[roundedIndex];
    const norm = (s) => String(s || "").toLowerCase().replace(/\s+/g, " ").trim();
    const labelKey = norm(label);
    const currentMoodGroup = Object.values(moodTags).find((group) =>
           (group.moods || []).some((m) => norm(m) === labelKey)
         );
     const tagsToShow =
           currentMoodGroup?.tags
           ?? moodTags?.default?.tags
           ?? [];

    // інтерполяція градієнта між сусідніми пресетами
    const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
    const getGradientColors = (index) => {
        const lower = clamp(Math.floor(index), 0, gradients.length - 1);
        const upper = clamp(Math.ceil(index), 0, gradients.length - 1);
        const ratio = clamp(index - lower, 0, 1);

        const parse = (hex) =>
            hex
                .replace("#", "")
                .match(/.{1,2}/g)
                .map((x) => parseInt(x, 16));
        const toHex = (rgb) =>
            "#" +
            rgb
                .map((x) => Math.round(x).toString(16).padStart(2, "0"))
                .join("");
        const blend = (c1, c2) => c1.map((c, i) => c + (c2[i] - c) * ratio);

        const centerRGB = blend(
            parse(gradients[lower].center),
            parse(gradients[upper].center)
        );
        const edgeRGB = blend(
            parse(gradients[lower].edge),
            parse(gradients[upper].edge)
        );

        return { center: toHex(centerRGB), edge: toHex(edgeRGB) };
    };

    const grad = getGradientColors(moodIndex);
    const dynamicBgGradient = `radial-gradient(circle at center, ${grad.center} 0%, ${grad.edge} 100%)`;

    const toggleReason = (reason) => {
        setSelectedReasons((prev) =>
            prev.includes(reason)
                ? prev.filter((r) => r !== reason)
                : [...prev, reason]
        );
    };

    const toggleTag = (tag) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    return (
        <div className="px-5">
            <div
                className="relative rounded-2xl p-4 panel-shadow"
                style={{
                    backgroundImage: dynamicBgGradient,
                    zIndex: 10,
                    overflow: "visible",
                }}
            >
                {/* затемнення тільки у dark-темі */}
                <div className="absolute inset-0 dark:bg-black/25 mix-blend-multiply pointer-events-none rounded-2xl" />

                {/* Верхній бар */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2">

                    {(step === 2 || step === 3) && (
                        <button
                            onClick={() => setStep(step - 1)}
                            className="
                px-3 py-1.5
                rounded-full
                bg-black/20
                backdrop-blur-sm
                text-white/90 text-sm font-medium
                flex items-center gap-1
                hover:bg-black/30
                transition
            "
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Назад
                        </button>
                    )}

                </div>


                {step < 3 ? (
                    <div
                        onClick={() => {
                            if (step === 1) {
                                setStep(2);
                                onSliderNext?.();
                            } else if (step === 2) {
                                setStep(3);
                                onTagsNext?.();
                            }
                        }}
                        className="
            absolute top-4 right-4 z-20
            inline-flex items-center gap-1
            px-3 py-1.5 rounded-full
            bg-black/20 backdrop-blur-sm text-white/90 text-sm font-medium
            cursor-pointer select-none hover:bg-black/30 transition
            wave-ping
            w-auto whitespace-nowrap pointer-events-auto
        "
                    >
                        Далі
                        <ChevronRight className="w-4 h-4" />
                    </div>
                ) : (
                    <div
                        onClick={() => {
                            setNoted(true);
                            const payload = {
                                gradient: dynamicBgGradient,
                                label,
                                emoji,
                                moodEmoji: emoji,
                                tags: selectedTags,
                                reasons: selectedReasons,
                                colors: grad,
                                index: moodIndex,
                            };
                            setTimeout(() => {
                                onInfluenceNext?.(payload);
                                setNoted(false);
                            }, 2000);
                        }}
                        className="
            absolute top-4 right-4 z-20
            inline-flex items-center gap-1
            px-3 py-1.5 rounded-full
            bg-black/20 backdrop-blur-sm text-white/90 text-sm font-medium
            cursor-pointer select-none hover:bg-black/30 transition
            wave-ping
            w-auto whitespace-nowrap pointer-events-auto
        "
                    >
                        Готово
                        <ChevronRight className="w-4 h-4" />
                    </div>
                )}


                {noted && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm text-white text-lg flex items-center justify-center rounded-xl z-50 pointer-events-none">
                        <div className="flex items-center gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6 text-green-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                            Занотовано
                        </div>
                    </div>
                )}

                {/* Контент */}
                <div className="relative z-10">
                    <div className="flex flex-col items-center gap-2 pb-2">
                        <div className="text-5xl">{emoji}</div>
                        <div className="text-base font-medium text-[#34495E]">
                            {label}
                        </div>
                    </div>

                    {step === 1 && (
                        <>
                            <h3 className="text-sm font-semibold text-[#34495E] mb-2 text-center">
                                Оберіть, як ви почуваєтеся зараз
                            </h3>
                            <input
                                type="range"
                                min={0}
                                max={6}
                                step={0.01}
                                value={moodIndex}
                                onChange={(e) => setMood({ index: parseFloat(e.target.value) })}
                                className="w-full appearance-none h-2 rounded-full bg-[rgba(255,255,255,0.4)] outline-none cursor-pointer transition"
                                style={{ accentColor: "transparent" }}
                            />
                            <div className="flex justify-between text-xs text-[#7b8386] mt-1">
                                <span>ДУЖЕ ПОГАНО</span>
                                <span>ДУЖЕ ДОБРЕ</span>
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <h3 className="text-sm font-semibold text-[#34495E] mb-2 text-center">
                                Як найкраще описати це почуття?
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {tagsToShow.map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => toggleTag(tag)}
                                        className={`px-3 py-1 rounded-full text-sm transition ${
                                            selectedTags.includes(tag)
                                                ? "bg-[#7b8386] text-white"
                                                : "bg-white text-[#34495E] hover:bg-neutral-100"
                                        }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <h3 className="text-sm font-semibold text-[#34495E] mb-4 text-center">
                                Що вплинуло на ваш стан?
                            </h3>
                            <div className="flex flex-col gap-4 items-start">
                                {reasons.map((row, rowIndex) => (
                                    <div
                                        key={rowIndex}
                                        className="flex flex-wrap gap-2 justify-start w-full"
                                    >
                                        {row.map((reason) => (
                                            <button
                                                key={reason}
                                                onClick={() => toggleReason(reason)}
                                                className={`px-3 py-1 rounded-full text-sm transition ${
                                                    selectedReasons.includes(reason)
                                                        ? "bg-[#7b8386] text-white"
                                                        : "bg-white text-[#34495E] hover:bg-neutral-100"
                                                }`}
                                            >
                                                {reason}
                                            </button>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
}
