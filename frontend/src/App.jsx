import "./App.css";
import { useState } from "react";
import Chart from "./Chart";
import Chatbox from "./Chatbox";
import ExpenseTracker from "./ExpenseTracker";
import FileUpload from "./FileUpload";

function App() {
    const [chartData, setChartData] = useState([
        { name: "Groceries", value: 400 },
        { name: "Eating Out", value: 400 },
        { name: "Transport", value: 300 },
        { name: "Rent", value: 800 },
        { name: "Others", value: 400 },
        { name: "Entertainment", value: 200 },
    ])

    //some api call, fetch, and then affect setChartData
    return (
        <div>
            <div>
                <FileUpload/>
                <Chart data={chartData}/>
            </div>
        </div>
    );
}

export default App;
