import React, { useState } from "react";

export default function ExpenseOverview({ transactions = [] }) {
    if (!transactions || transactions.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3">
                <div className="p-4 bg-gray-50 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <p className="text-sm font-medium">No transactions found</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {transactions.map((transaction, index) => (
                <ExpenseOverviewCard
                    key={index}
                    date={transaction.date}
                    description={transaction.description}
                    price={transaction.price}
                    category={transaction.category}
                    type={transaction.type}
                    advice={transaction.advice}
                />
            ))}
        </div>
    );
}

function ExpenseOverviewCard({
    date,
    description,
    price,
    category,
    type,
    advice,
}) {
    const isRational = type?.toLowerCase() === 'rational';
    const isIrrational = type?.toLowerCase() === 'irrational';

    return (
        <div className="group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-[#C5A059]">
            <div className="flex justify-between items-start mb-2">
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">{date}</span>
                    <h3 className="font-bold text-black text-sm">{description}</h3>
                </div>
                <div className="flex flex-col items-end">
                    <span className="font-bold text-black">{price}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold mt-1 uppercase tracking-wide
                        ${isRational ? 'bg-gray-100 text-gray-600' :
                            isIrrational ? 'bg-black text-white' :
                                'bg-gray-50 text-gray-400'}`}>
                        {type}
                    </span>
                </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-[#C5A059] bg-[#C5A059]/10 px-2 py-1 rounded">
                        {category}
                    </span>
                </div>
                {advice && (
                    <div className="flex items-start gap-1.5 text-xs text-gray-500 mt-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 flex-shrink-0 text-[#C5A059] mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium leading-relaxed break-words">{advice}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
