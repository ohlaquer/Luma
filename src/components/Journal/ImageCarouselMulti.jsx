import React, { useEffect, useMemo, useRef, useState } from "react";

// + нові пропси:
export default function ImageCarouselMulti({
                                               images = [],
                                               className = "",
                                               height = "h-32",
                                               onSlideClick,
                                               initialIndex = 0,
                                               itemsPerViewDesktop = 4,
                                               itemsPerViewTablet = 3,
                                               itemsPerViewMobile = 2,
                                               showArrows = true,          // ⬅ нове
                                               removable = false,          // ⬅ нове
                                               onRemove,                   // ⬅ нове (idx у вихідному масиві)
                                           }) {

    const pickSrc = (it) =>
        typeof it === "string"
            ? it
            : it?.url || it?.src || it?.uri || it?.image?.url || "";

    const normalized = useMemo(
        () => images.map(pickSrc).filter(Boolean),
        [images]
    );

    // responsive itemsPerView
    const [itemsPerView, setItemsPerView] = useState(itemsPerViewDesktop);
    useEffect(() => {
        const update = () => {
            const w = window.innerWidth;
            if (w < 640) setItemsPerView(itemsPerViewMobile);
            else if (w < 1024) setItemsPerView(itemsPerViewTablet);
            else setItemsPerView(itemsPerViewDesktop);
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, [itemsPerViewDesktop, itemsPerViewTablet, itemsPerViewMobile]);

    if (normalized.length === 0) return null;

    // Клони для безшовного циклу
    const makeLoopSlides = (arr, k) => {
        if (arr.length <= k) {
            return { slides: arr, head: 0, tail: 0, loop: false };
        }
        const head = arr.slice(-k);
        const tail = arr.slice(0, k);
        return { slides: [...head, ...arr, ...tail], head: k, tail: k, loop: true };
    };
    const { slides, head, loop } = useMemo(
        () => makeLoopSlides(normalized, itemsPerView),
        [normalized, itemsPerView]
    );

    const trackRef = useRef(null);
    const [index, setIndex] = useState(head + initialIndex);

    const cardWidthPct = 100 / itemsPerView;
    const totalWidthPct = (slides.length * 100) / itemsPerView;

    const goTo = (i, withTransition = true) => {
        if (!trackRef.current) return;
        trackRef.current.style.transition = withTransition ? "transform 300ms ease" : "none";
        setIndex(i);
    };

    const pageRight = () => goTo(index + 1, true);
    const pageLeft  = () => goTo(index - 1, true);

    // після анімації переставляємо індекс із клонів на реальні
    useEffect(() => {
        if (!loop) return;
        const tr = trackRef.current;
        if (!tr) return;
        const onEnd = () => {
            const realLen = normalized.length;
            const leftBound = head;
            const rightBound = head + realLen - 1;
            if (index < leftBound) {
                const diff = (leftBound - index) % realLen;
                const target = rightBound - diff + 1;
                goTo(target, false);
            } else if (index > rightBound) {
                const diff = (index - rightBound - 1) % realLen;
                const target = leftBound + diff;
                goTo(target, false);
            }
            if (index <= head - 1) {
                goTo(index + realLen, false);
            } else if (index >= head + realLen) {
                goTo(index - realLen, false);
            }
        };
        tr.addEventListener("transitionend", onEnd);
        return () => tr.removeEventListener("transitionend", onEnd);
    }, [index, loop, normalized.length, head]);

    // ------- drag vs click guard -------
    const startX = useRef(0);
    const deltaX = useRef(0);
    const maxAbsMove = useRef(0);
    const dragging = useRef(false);
    const allowClick = useRef(true); // якщо під час жесту був рух > threshold — клік ігноруємо

    const thresholdPx = 6; // чутливість "клік чи свайп"

    const onDown = (e) => {
        dragging.current = true;
        const x = ("touches" in e ? e.touches[0].clientX : e.clientX) ?? 0;
        startX.current = x;
        deltaX.current = 0;
        maxAbsMove.current = 0;
        allowClick.current = true;
        if (trackRef.current) trackRef.current.style.transition = "none";
        // на мобілці не даємо сторінці скролитись під час горизонтального свайпу
        if ("touches" in e) e.preventDefault?.();
    };

    const onMove = (e) => {
        if (!dragging.current || !trackRef.current) return;
        const x = ("touches" in e ? e.touches[0].clientX : e.clientX) ?? 0;
        deltaX.current = x - startX.current;
        maxAbsMove.current = Math.max(maxAbsMove.current, Math.abs(deltaX.current));
        if (maxAbsMove.current > thresholdPx) allowClick.current = false;

        const trackW = trackRef.current.getBoundingClientRect().width;
        const offsetPx = - (index * (trackW / slides.length)) + deltaX.current;
        trackRef.current.style.transform = `translate3d(${offsetPx}px,0,0)`;

        if ("touches" in e) e.preventDefault?.(); // блочимо вертикальний скрол під час жесту
    };

    const onUp = (e) => {
        if (!dragging.current) return;
        dragging.current = false;

        const threshold = 50; // “перегортаємо сторінку” якщо жест достатньо довгий
        if (deltaX.current > threshold) pageLeft();
        else if (deltaX.current < -threshold) pageRight();
        else goTo(index, true);
    };
    // -----------------------------------

    const logicalIndex = (i) => {
        const realLen = normalized.length;
        let j = (i - head) % realLen;
        if (j < 0) j += realLen;
        return j;
    };

    const handleSlideClick = (i) => (e) => {
        // якщо був свайп — клік ігноруємо
        if (!allowClick.current) {
            e.preventDefault?.();
            e.stopPropagation?.();
            return;
        }
        onSlideClick?.(logicalIndex(i));
    };

    if (normalized.length <= itemsPerView) {
        return (
            <div className={`relative ${className}`}>
                <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${normalized.length}, minmax(0,1fr))` }}>
                    {normalized.map((src, i) => (
                        <div key={i} className="rounded-xl overflow-hidden border border-[var(--hover)] aspect-square">
                            <img
                                src={src}
                                alt=""
                                className="w-full h-full object-cover"
                                loading="lazy"
                                onClick={handleSlideClick(i)}
                                draggable={false}
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={`relative select-none ${className}`} onMouseLeave={onUp}>
            {/* стрілки */}
            {showArrows && (
                <>
                    <button
                        type="button"
                        aria-label="Назад"
                        onClick={pageLeft}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full
                 bg-white/80 dark:bg-black/40 backdrop-blur border border-[var(--hover)]
                 px-2 py-1 hover:scale-105"
                    >‹</button>

                    <button
                        type="button"
                        aria-label="Вперед"
                        onClick={pageRight}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full
                 bg-white/80 dark:bg-black/40 backdrop-blur border border-[var(--hover)]
                 px-2 py-1 hover:scale-105"
                    >›</button>
                </>
            )}


            {/* трек */}
            <div
                className="overflow-hidden rounded-2xl "
                onMouseDown={onDown}
                onMouseMove={onMove}
                onMouseUp={onUp}
                onTouchStart={onDown}
                onTouchMove={onMove}
                onTouchEnd={onUp}
            >
                <div
                    ref={trackRef}
                    className="flex items-center"
                    style={{
                        width: `${totalWidthPct}%`,
                        transform: `translate3d(${-index * cardWidthPct}%,0,0)`,
                        transition: "transform 300ms ease",
                    }}
                >
                    {slides.map((src, i) => (
                        <div
                            key={`${i}-${src}`}
                            style={{ flex: `0 0 ${cardWidthPct}%` }}
                            className="p-1"
                            onClick={handleSlideClick(i)}
                        >
                            <div className="rounded-xl overflow-hidden aspect-square cursor-pointer
                transition-transform transform hover:scale-[1.02] hover:shadow-lg
                duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]">
                                <img
                                    src={src}
                                    alt=""
                                    className="w-full h-full object-cover"
                                    draggable={false}
                                    loading="lazy"
                                />
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
