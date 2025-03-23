from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi.concurrency import run_in_threadpool
import io
import camelot
import pandas as pd, numpy as np

import cohere
import json
import asyncio
import time
from fastapi.responses import JSONResponse
from pydantic import BaseModel, conlist
from config import settings
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # or ["*"] for all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

mode = "PRO"

# MongoDB Setup
from pymongo.mongo_client import MongoClient
uri = settings.database_url
# Create a new client and connect to the server
client = MongoClient(uri)
# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

db = client.transactionsdb
collection = db.transcollection

co = cohere.ClientV2(settings.cohere_key)


@app.post("/getdatafromfile")
async def create_upload_file(file: UploadFile):

    def pdf_to_csv(file):
        # Read tables, extract list
        tables = camelot.read_pdf(file, flavor='stream', pages='all')

        extracted_list = []
        new_table_list = []
        for x in range(0, len(tables)):
            extracted_list.append(tables[x].df)

        for i in range(1, len(extracted_list) - 1):
            # Testing on table 2 - statement
            extracted_list[i] = extracted_list[i].iloc[2:].reset_index(drop=True)
            extracted_list[i].columns = extracted_list[i].iloc[0]
            extracted_list[i] = extracted_list[i].iloc[1:].reset_index(drop=True)

            # Create new table
            new_table = extracted_list[i].filter(['Date', 'Transactions', 'withdrawn ($)', 'deposited ($)', 'Balance ($)'], axis=1)

            # Clean table 2 - drop columns with all NaN
            new_table.replace('', np.nan, inplace=True)
            new_table.dropna(how="all", inplace=True)
            new_table.reset_index(drop=True, inplace=True)

            # Ensure "Transactions" column is string type
            new_table.loc[:, "Transactions"] = new_table["Transactions"].astype(str)

            # Use .iloc for position-based indexing
            for j in range(1, len(new_table)):
                if pd.isna(new_table.iloc[j, new_table.columns.get_loc("Date")]):
                    str1 = new_table.iloc[j - 1, new_table.columns.get_loc("Transactions")]
                    str2 = new_table.iloc[j, new_table.columns.get_loc("Transactions")]

                    # Concatenate strings if both are not NaN
                    if pd.notna(str1) and pd.notna(str2):
                        new_table.iloc[j - 1, new_table.columns.get_loc("Transactions")] = str1 + "-" + str2

            # Remove rows where "Date" is NaN
            new_table = new_table[~new_table["Date"].isna()]

            # Final result
            # print(new_table)
            new_table_list.append(new_table)

        # concat the multiple tables
        result = pd.concat(new_table_list)
        result.reset_index(drop=True)

        # only need date, transactions, withdrawn columns
        result_for_csv = result.filter(['Date', 'Transactions', 'withdrawn ($)'])
        result_for_csv.reset_index(drop=True)

        # remove rows where it's transactions is n/a
        result_for_csv = result_for_csv[~result_for_csv['withdrawn ($)'].isna()]
        result_for_csv.reset_index(drop=True)

        return result_for_csv

    file_content = await file.read()
    file_like_object = io.BytesIO(file_content)
    csv = pdf_to_csv(file_like_object)

    csv_string = csv.to_csv(index=False, header=False)
    # store csv_string into database
    doc = {"content": csv_string}
    collection.insert_one(doc)

    data = csv_string.split("\r\n")
    processed = []
    for row in data:
        processed.append(process_transaction(row))
        time.sleep(0.5)
    plan = {"content" : generate_monthly_plan(csv_string)}
    person = {"content" : greetings(mode)}
    result_arr = [person, plan, processed]
    # Return a regular Response with text content type

    def safe_to_dict(item):
        return item.dict() if isinstance(item, BaseModel) else item

    return JSONResponse(content=[safe_to_dict(item) for item in result_arr])


@app.get("/")
async def root():
    return {"message": "hello world"}

def process_transaction(transaction):
    personality = generate_chatbot_prompt(mode)
    # processed.append(await run_in_threadpool(process_transaction, data[i]))
    prompt = """Classify the given csv transactions into cagetories of spending within the types of rent, groceries, eating out, transportation, entertainment, or other. Here are some examples:
        Rent examples:
        - "rent, $1200"
        - "housing, $1400"
        - "Jan rent, $1000"
        - "monthly lease payment, $950"

        Groceries examples:
        - "weekly groceries, $60"
        - "supermarket shopping, $45"

        Eating out examples:
        - "fast food lunch, $12"
        - "dinner with friends, $35"
        - "coffee shop, $8"

        Transportation examples:
        - "subway pass, $30"
        - "ride share, $20"
        - "gas refill, $50"

        Entertainment examples:
        - "movie ticket, $15"
        - "concert ticket, $80"
        - "gaming subscription, $10"

        Other examples:
        - "phone bill, $40"
        - "gym membership, $25"
        - "bank fee, $5"
        - "gift for friend, $20"

        Then Classify the given csv transactions into rational, irrational, or neutral spending. Then provide a short advice on how the user could have spent that money in a more effective way for better personal finance. Here are some examples:
        Rational examples:
        - "local breakfast, $8"
        - "weekly groceries, $45"
        - "bus fare, $25"
        - "rent payment, $1200"
        - "prescription medication, $20"

        Irrational examples:
        - "gourmet breakfast, $100"
        - "impulse coffee, $50"
        - "designer sneakers, $250"
        - "luxury gadget, $400"
        - "extravagant dinner, $150"

        Neutral examples:
        - "utility bill, $60"
        - "bank fee, $20"
        - "online subscription, $10"
        - "ATM fee, $5"
        - "public parking, $15"

        Transaction to classify:
        {}"""

    response = co.chat(
        model='command-a-03-2025',
        messages=[
            {"role": "user", "content": personality + prompt.format(transaction)}
        ],
        temperature=0.0,
        response_format={
            "type": "json_object",
            "schema": {
                "type": "object",
                "properties": {
                    "date": {
                        "type": "string",
                        "date": "date of the transaction"
                    },
                    "description": {
                        "type": "string",
                        "description": "Summarize in 3 or less words the store from which the tansaction originates"
                    },
                    "price": {
                        "type": "string",
                        "price": "value of the transaction"
                    },
                    "category": {
                        "type": "string",
                        "enum": ["rent", "groceries", "eating out", "transportation", "entertainment", "other"]
                    },
                    "class": {
                        "type": "string",
                        "enum": ["rational", "irrational", "neutral"]
                    },
                    "advice": {
                        "type": "string",
                        "description": "A short advice on how the user could have spent that money in a more effective way for better personal finance."
                    }
                },
                "required": ["date", "description", "price", "category", "class", "advice"]
            }
        }
    )

    return {"date": json.loads(response.message.content[0].text)["date"],"description": json.loads(response.message.content[0].text)["description"],"price": json.loads(response.message.content[0].text)["price"], "category": json.loads(response.message.content[0].text)["category"], "type": json.loads(response.message.content[0].text)["class"], "advice": json.loads(response.message.content[0].text)["advice"]}

def generate_monthly_plan(transactions: str):
    prompt = """Based on the provided transactions below, analyze the user's monthly expenses and create a plan for how they should be spending before the start of next month. Assume the median Canadian after-tax income is approximately $3,500 per month. Consider recurring expenses such as rent, groceries, transportation, and discretionary spending. Use the user's current spending trends to extrapolate their total monthly expenditure and estimate how much money will be left by month-end. Highlight potential areas for savings and suggest budget optimizations. The output should not use any special characters and should be a 250 words paragraph."
    Transactions to consider:
    {}"""

    personality = generate_chatbot_prompt(mode)
    response = co.chat(
        model='command-a-03-2025',
        messages=[
            {"role": "user", "content": prompt.format(transactions)}
        ],        
        temperature=0.2,
    )

    return response.message.content[0].text


def generate_chatbot_prompt(mode):
    # initialize personality
    prompt_pro = """
    You are an expert personal finance advisor. Your role is to provide comprehensive, in-depth, and accurate guidance on a wide range of personal finance topics, including budgeting, savings, investments, debt management, retirement planning, tax strategies, insurance, and overall financial planning.
    
    Your responses should be:

    Expert and In-Depth: Utilize your extensive knowledge of financial principles, market trends, and economic factors to deliver insightful and nuanced advice.

    Clear and Accessible: Break down complex financial concepts into easily understandable and actionable information, ensuring clarity without oversimplification.

    Professional and Objective: Maintain an impartial, respectful, and balanced tone, considering multiple perspectives and tailoring advice to individual circumstances.

    Interactive and Inquisitive: Ask relevant clarifying questions to fully understand each user's unique financial situation and goals, enabling personalized recommendations.

    Accurate and Current: Base your guidance on established best practices and the latest market information. Clearly note any uncertainties or limitations in available data.

    Your objective is to empower users to make informed financial decisions, optimize their financial health, and achieve their long-term financial goals with clarity and confidence."
    """

    prompt_friend = """
    You are a caring friend with a deep understanding of personal finances. Your role is to offer supportive, empathetic, and accurate guidance on topics such as budgeting, saving, investing, debt management, and overall financial planning. Your tone is warm and conversational, making complex financial concepts approachable and easy to understand.

    Your responses should be:

    Empathetic and Supportive: Engage with the user in a friendly and caring manner, showing genuine concern for their financial well-being.

    Accurate and Practical: Provide well-researched, actionable advice that helps the user make informed financial decisions.

    Clear and Relatable: Break down financial jargon into simple terms and use real-life examples that resonate with everyday experiences.

    Encouraging and Uplifting: Empower the user to take control of their finances with positivity, gently guiding them through challenges without judgment.

    Your goal is to help the user navigate their financial journey with warmth, clarity, and practical wisdom—just like a supportive friend who truly cares about their success and well-being.

    """

    prompt_mom = """
    You are a no-nonsense, "angry but not harsh" mom when it comes to personal finances. Your advice is delivered with a mix of tough love and genuine concern, ensuring that the user receives accurate, beneficial, and practical guidance. While you may show frustration at financial missteps or irresponsible habits, your tone remains caring and constructive.

    Your responses should be:

    Direct and Honest: Offer straightforward financial advice without sugarcoating, addressing poor habits firmly while maintaining underlying care.

    Accurate and Beneficial: Provide well-researched, actionable information on topics like budgeting, saving, investing, and debt management.

    Caring Yet Stern: Balance your anger with warmth—be clear about the consequences of financial missteps but always with the goal of helping the user improve.

    Supportive of Change: Encourage better financial decisions by offering practical steps and actionable advice, ensuring the user feels empowered to make positive changes.

    Your goal is to ensure the user takes their financial responsibilities seriously, learns from their mistakes, and moves towards better financial health—all while knowing that your advice comes from a place of deep care and genuine concern.
    """

    prompt = ""

    if(mode == "PRO"):
        prompt = prompt_pro
    elif(mode == "FRIEND"):
        prompt = prompt_friend
    elif(mode == "MOM"):
        prompt = prompt_mom
    else:
        raise HTTPException(status_code=404, detail="invalid personality")

    return prompt


def greetings(m):
    mode = m
    prompt = generate_chatbot_prompt(mode)
    response = co.chat(
        model='command-a-03-2025',
        messages=[
            {"role": "system", "content": prompt },
            {"role": "user", "content": "Please give an one sentence introduction about yourself"}
        ],        
        temperature=0.2,
    )

    return response.message.content[0].text

chat_history = []

@app.post("/chat/{request}")
async def chat(request: str):
    # Send the user's message to Cohere for a response
    if len(chat_history) == 0:
        mode_info =  generate_chatbot_prompt(mode)
        chat_history.append({"role": "system", "content": mode_info})
    chat_history.append({"role": "user", "content": request})

    response = co.chat(
        model='command-a-03-2025',  # You can choose the model
        messages=chat_history
        ,
        temperature=0.5,
    )
    chat_history.append({"role": "assistant", "content": response.message.content[0].text })
    # Extract the text response from Cohere and return it

    return response.message.content[0].text