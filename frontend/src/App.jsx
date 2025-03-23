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

    useEffect(() => {
        if (isButtonClicked) {
            if (file == null) {
                alert("file not uploaded!");
            } else {
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
                    })
                    .catch((error) => console.error(error));
            }
        }
    }, [isButtonClicked, file]);

    //some api call, fetch, and then affect setChartData
    return (
        <div className="flex flex-col h-screen w-screen">
            <div className="flex flex-row h-[10%] w-full">
                <div className="h-full w-[60%] flex items-center justify-center">
                    Anson's Personal Financial Diary
                </div>
                <div className="h-full w-[40%] flex items-center justify-center">
                    <FileUpload file={file} isButtonClicked={isButtonClicked} setFile={setFile} setIsButtonClicked={setIsButtonClicked}/>
                </div>
            </div>

            <div className="flex flex-row w-full">
                <div>
                    <div className="h-[50%] w-full flex flex-column items-center justify-center">
                        <Chart data={chartData} />
                    </div>
                    <div className="h-[50%] w-full flex flex-column items-center justify-center">
                        <Chat message={message} />
                    </div>
                </div>
                <div className="h-full w-[50%] flex items-center justify-center">
                    <ExpenseOverview transactions={expenseData} />
                </div>
            </div>
        </div>
    );
}

export default App;