import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Chart({ data }) {

    const COLORS = [
        "#C5A059", // Gold
        "#2D2D2D", // Dark Gray
        "#E5E7EB", // Light Gray
        "#9CA3AF", // Medium Gray
        "#FCD34D", // Light Gold
        "#4B5563", // Gray-600
    ];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-lg">
                    <p className="text-sm font-semibold text-gray-700">{`${payload[0].name}`}</p>
                    <p className="text-sm text-indigo-600">{`$${payload[0].value}`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                            stroke="none"
                        />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    formatter={(value) => <span className="text-gray-600 text-sm font-medium ml-1">{value}</span>}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}
