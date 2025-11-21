//import "./App.css";
import { useState, useEffect } from "react";
import Chart from "./Chart";
import Chat from "./Chat";
import ExpenseOverview from "./ExpenseOverview";
import FileUpload from "./FileUpload";

function convertPriceToNumber(priceString) {
    // Specifically for dollar format
    return parseFloat(priceString.replace('$', ''));
}


function App() {
    const [chartData, setChartData] = useState([
        { name: "Groceries", value: 400 },
        { name: "Eating Out", value: 400 },
        { name: "Transport", value: 300 },
        { name: "Rent", value: 800 },
        { name: "Others", value: 400 },
        { name: "Entertainment", value: 200 },
    ]);
    const [expenseData, setExpenseData] = useState([])
    const [file, setFile] = useState(null);
    const [isButtonClicked, setIsButtonClicked] = useState(0);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isButtonClicked) {
            if (file == null) {
                alert("file not uploaded!");
            } else {
                setIsLoading(true);
                const formData = new FormData();
                formData.append("file", file);
                fetch("http://localhost:8000/getdatafromfile", {
                    method: "POST",
                    body: formData,
                })
                    .then((response) => response.json())
                    .then((data) => {
                        console.log(data);
                        console.log(data[2])
                        setExpenseData(data[2]);

                        function processData(records) {
                            const dict = {}
                            records.forEach(record => {
                                if (!(record["category"] in dict)) {
                                    dict[record["category"]] = convertPriceToNumber(record["price"])
                                }
                                else {
                                    dict[record["category"]] += convertPriceToNumber(record["price"])
                                }
                            })
                            const chartData = Object.entries(dict).map(([name, value]) => ({
                                name,
                                value
                            }));
                            return chartData
                        }
                        console.log(processData(data[2]))
                        setChartData(processData(data[2]));
                        setMessage([data[0], data[1]])
                        setIsLoading(false);
                    })
                    .catch((error) => {
                        console.error(error);
                        setIsLoading(false);
                    });
            }
        }
    }, [isButtonClicked, file]);

    //some api call, fetch, and then affect setChartData
    return (
        <div className="flex flex-col h-screen w-full bg-white text-black font-sans overflow-hidden relative">
            {/* Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-6 min-w-[300px]">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-[#C5A059]/20 border-t-[#C5A059] rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#C5A059]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-black mb-2 font-serif">Processing PDF</h3>
                            <p className="text-sm text-gray-600">Analyzing your transactions...</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <header className="flex items-center justify-between px-8 py-6 bg-white border-b border-gray-100 z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#C5A059] rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-black tracking-tight font-serif">Insight Wallet</h1>
                </div>
                <div className="w-1/3">
                    <FileUpload file={file} isButtonClicked={isButtonClicked} setFile={setFile} setIsButtonClicked={setIsButtonClicked} />
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-hidden bg-[#F9F9F9] min-h-0">
                <div className="grid grid-cols-12 gap-8 h-full min-h-0">
                    {/* Left Column: Charts & Chat */}
                    <div className="col-span-8 flex flex-col gap-8 h-full min-h-0">
                        {/* Chart Section */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex-1 flex flex-col min-h-0 overflow-hidden">
                            <h2 className="text-xl font-bold text-black mb-6 font-serif">Spending Breakdown</h2>
                            <div className="flex-1 w-full flex items-center justify-center min-h-0 overflow-hidden">
                                <Chart data={chartData} />
                            </div>
                        </div>

                        {/* Chat Section */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex-shrink-0 h-[280px] flex flex-col overflow-hidden">
                            <h2 className="text-xl font-bold text-black mb-4 font-serif">Financial Assistant</h2>
                            <div className="flex-1 overflow-hidden min-h-0">
                                <Chat message={message} />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Transactions */}
                    <div className="col-span-4 h-full min-h-0 flex flex-col">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 h-full flex flex-col min-h-0 overflow-hidden">
                            <h2 className="text-xl font-bold text-black mb-6 font-serif flex-shrink-0">Recent Transactions</h2>
                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0">
                                <ExpenseOverview transactions={expenseData} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default App;