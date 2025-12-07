import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useState, useEffect } from "react";
import { GripVertical } from "lucide-react";

/**
 * props:
 * - options: масив { label, value }
 * - onChange: callback, повертає новий масив у відсортованому порядку
 * - testId: id тесту (наприклад "luscher")
 */
export default function OrderingQuestion({ options, onChange, testId }) {
    const [items, setItems] = useState(options);

    useEffect(() => {
        setItems(options);
    }, [options]);

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const newItems = Array.from(items);
        const [moved] = newItems.splice(result.source.index, 1);
        newItems.splice(result.destination.index, 0, moved);

        setItems(newItems);
        if (onChange) onChange(newItems.map((item) => item.value));
    };

    const colorMap = {
        blue: "#0074D9",
        green: "#2ECC40",
        red: "#FF4136",
        yellow: "#FFDC00",
        purple: "#B10DC9",
        brown: "#8B4513",
        black: "#111111",
        gray: "#AAAAAA",
    };

    return (
        <div className="w-full">
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="ordering">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-2"
                        >
                            {items.map((item, index) => (
                                <Draggable
                                    key={item.value}
                                    draggableId={item.value}
                                    index={index}
                                >
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={`p-3 rounded-xl shadow-md cursor-grab bg-[var(--surface-1)] border border-[var(--border)]
                        ${
                                                snapshot.isDragging
                                                    ? "bg-blue-100 dark:bg-blue-900"
                                                    : ""
                                            }`}
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-2">
                                                    {testId === "luscher" && (
                                                        <div
                                                            className="w-6 h-6 rounded-[30%] border"
                                                            style={{
                                                                backgroundColor: colorMap[item.value],
                                                                borderColor: item.value === "black" ? "#FFFFFF" : "#E0E0E0",
                                                            }}
                                                        />
                                                    )}

                                                    {testId === "geometric-delinger" && (
                                                        <>
                                                            {item.value === "square" && (
                                                                <div className="w-6 h-6 bg-gray-700 rounded-sm" />
                                                            )}
                                                            {item.value === "rectangle" && (
                                                                <div className="w-8 h-4 bg-gray-700 rounded-sm" />
                                                            )}
                                                            {item.value === "triangle" && (
                                                                <div
                                                                    className="w-0 h-0"
                                                                    style={{
                                                                        borderLeft: "8px solid transparent",
                                                                        borderRight: "8px solid transparent",
                                                                        borderBottom: "14px solid #555",
                                                                    }}
                                                                />
                                                            )}
                                                            {item.value === "circle" && (
                                                                <div className="w-6 h-6 bg-gray-700 rounded-full" />
                                                            )}
                                                            {item.value === "zigzag" && (
                                                                <svg
                                                                    className="w-6 h-6 text-gray-700"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                >
                                                                    <polyline
                                                                        points="0,18 6,6 12,18 18,6 24,18"
                                                                        strokeWidth="2"
                                                                    />
                                                                </svg>
                                                            )}
                                                        </>
                                                    )}

                                                    <span className="font-medium">{item.label}</span>
                                                </div>


                                                {["luscher", "geometric-delinger"].includes(testId) && (
                                                    <GripVertical className="w-4 h-4 text-gray-400" />
                                                )}
                                            </div>


                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
}
