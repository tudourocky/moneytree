import { useState, useEffect, useRef } from "react";

export default function Chat({ message = [] }) {
    const scrollRef = useRef(null);
    const hasScrolledToTop = useRef(false);

    useEffect(() => {
        if (scrollRef.current && message && message.length > 0) {
            // Scroll to top when content is first loaded
            if (!hasScrolledToTop.current) {
                // Use requestAnimationFrame to ensure DOM is updated
                requestAnimationFrame(() => {
                    if (scrollRef.current) {
                        scrollRef.current.scrollTop = 0;
                    }
                });
                hasScrolledToTop.current = true;
            }
        }
        
        // Reset the flag when message becomes empty (new file upload)
        if (!message || message.length === 0) {
            hasScrolledToTop.current = false;
        }
    }, [message]);

    if (!message || message.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3">
                <div className="p-4 bg-gray-50 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                </div>
                <p className="text-sm font-medium">AI Assistant is ready to help</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full space-y-4 overflow-y-auto custom-scrollbar pr-2" ref={scrollRef}>
            {/* User Message */}
            {message[0] && (
                <div className="flex justify-end">
                    <div className="bg-[#1F2937] text-white px-5 py-3 rounded-2xl rounded-tr-sm max-w-[80%] shadow-sm">
                        <p className="text-sm leading-relaxed font-medium">{message[0].content}</p>
                    </div>
                </div>
            )}

            {/* AI Response */}
            {message[1] && (
                <div className="flex justify-start">
                    <div className="bg-[#F3F4F6] text-black px-5 py-3 rounded-2xl rounded-tl-sm max-w-[80%] shadow-sm">
                        <p className="text-sm leading-relaxed font-medium">{message[1].content}</p>
                    </div>
                </div>
            )}
        </div>
    )
}