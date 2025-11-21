import { useState } from "react";

export default function RoleSelector({ mode, setMode }) {
    const [isOpen, setIsOpen] = useState(false);

    const modes = [
        { value: "PRO", label: "Professional Advisor", icon: "💼" },
        { value: "FRIEND", label: "Supportive Friend", icon: "🤝" },
        { value: "MOM", label: "Tough-Love Mom", icon: "👩" },
    ];

    const currentMode = modes.find((m) => m.value === mode) || modes[0];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-[#C5A059] hover:bg-gray-50 transition-all duration-200 shadow-sm"
            >
                <span className="text-lg">{currentMode.icon}</span>
                <span className="text-sm font-medium text-gray-700">{currentMode.label}</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[200px] overflow-hidden">
                        {modes.map((m) => (
                            <button
                                key={m.value}
                                onClick={() => {
                                    setMode(m.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 ${
                                    mode === m.value ? "bg-[#C5A059]/10 border-l-2 border-[#C5A059]" : ""
                                }`}
                            >
                                <span className="text-lg">{m.icon}</span>
                                <span className={`text-sm font-medium ${mode === m.value ? "text-[#C5A059]" : "text-gray-700"}`}>
                                    {m.label}
                                </span>
                                {mode === m.value && (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 text-[#C5A059] ml-auto"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

