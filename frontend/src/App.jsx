//import "./App.css";
import { useState } from "react";
import Chart from "./Chart";
//import Chatbox from "./Chatbox";
import ExpenseOverview from "./ExpenseOverview";
import FileUpload from "./FileUpload";

function App() {
    const [chartData, setChartData] = useState([
        { name: "Groceries", value: 400 },
        { name: "Eating Out", value: 400 },
        { name: "Transport", value: 300 },
        { name: "Rent", value: 800 },
        { name: "Others", value: 400 },
        { name: "Entertainment", value: 200 },
    ]);

    //some api call, fetch, and then affect setChartData
    return (
        <div className="flex flex-col h-screen w-screen">
            <div className="flex flex-row h-[10%] w-full">
                <div className="h-full w-[60%] flex items-center justify-center">
                    Anson's Personal Financial Diary
                </div>
                <div className="h-full w-[40%] flex items-center justify-center">
                    <FileUpload />
                </div>
            </div>

            <div className="flex flex-row w-full">
                <div>
                    <div className="h-[50%] w-full flex flex-column items-center justify-center">
                        <Chart data={chartData} />
                    </div>
                    <div className="h-[50%] w-full flex flex-column items-center justify-center">
                        For Comments, not yet done
                    </div>
                </div>
                <div className="h-full w-[50%] flex items-center justify-center">
                    <ExpenseOverview data={chartData} />
                </div>
            </div>
        </div>
    );
}

export default App;
