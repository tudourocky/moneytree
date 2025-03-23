import React, { useState } from "react";

export default function ExpenseOverview({ transactions }) {
    return (
        <div>
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
        <div>
            <div>
                <div>{date}</div>
                <div>{category}</div>
                <div>{price}</div>
            </div>
            <div>
                <div>{type}</div>
                <div>{description}</div>
            </div>
        </div>
    );
}
