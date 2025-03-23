import React, { useState } from "react";

export default function ExpenseOverview({ transactions = [] }) {
    return (
        <div className="flex flex-col h-full w-full p-4 gap-y-6">
            {transactions.map((transaction, index) => (
                <div key={index}>
                    <ExpenseOverviewCard
					    date={transaction.date}
                        description={transaction.description}
                        price={transaction.price}
                        category={transaction.category}
						type={transaction.type}
						advice={transaction.advice}
                    />
                </div>
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
    return (
        <div className="flex flex-col h-full w-full bg-[#B0C4B1]">
            <div className="flex flex-row h-full w-full justify-around text-xl">
                <div>{date}</div>
                <div>{category}</div>
                <div>{price}</div>
            </div>
            <div className="flex flex-row h-full w-full justify-around text-xl">
                <div>{type}</div>
                <div>{description}</div>
            </div>
        </div>
    );
}
