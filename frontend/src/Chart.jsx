import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function Chart({data}) {

    const COLORS = [
		"#FF5733", // Outer layer - Vibrant red-orange
		"#FF8C33", // Light orange
		"#FFB733", // Amber/gold
		"#FFE033", // Yellow
		"#B7FF33", // Lime green
		"#33FFA8", // Turquoise
	];

    return (
        <PieChart width={600} height={600}>
            <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
            >
                {data.map((entry, index) => (
                    <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index]}
                    />
                ))}
            </Pie>
            {/*<Tooltip />*/}
            <Legend verticalAlign="bottom" height={15}/>
        </PieChart>
    );
}
