import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function Chart() {
    const [data, setData] = useState([
        { name: "Groceries", value: 400 },
        { name: "Eating Out", value: 400 },
        { name: "Transport", value: 300 },
        { name: "Rent", value: 800 },
        { name: "Others", value: 400 },
        { name: "Entertainment", value: 200 }
      ]);
    
      const COLORS = ["#FF5733",  // Groceries (Red)
          "#33FF57",  // Eating Out (Green)
          "#3357FF",  // Transport (Blue)
          "#FF33A1",  // Rent (Pink)
          "#FF9F33",  // Others (Orange)
          "#9C33FF",  // Savings (Purple)
          ];
    
      return (
        <PieChart width={300} height={300}>
          <Pie 
            data={data} 
            cx="50%" 
            cy="50%" 
            labelLine={false}
            outerRadius={75} 
            fill="#8884d8" 
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      );

}