from fastapi import FastAPI, HTTPException
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import io
import camelot
import pandas as pd, numpy as np

import cohere
import json
from pydantic import BaseModel, conlist
from config import settings

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    # Allow requests from your frontend origin
    allow_origins=["http://localhost:5173"],
    # Optionally allow requests from additional origins
    # allow_origins=["*"],  # Use this to allow all origins (less secure)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

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

        result = pd.concat(new_table_list)
        result.reset_index(drop=True)

        result_for_csv = result.filter(['Date', 'Transactions', 'withdrawn ($)'])
        result_for_csv.reset_index(drop=True)

        return result_for_csv

    file_content = await file.read()
    file_like_object = io.BytesIO(file_content)
    csv = pdf_to_csv(file_like_object)

    csv_string = csv.to_csv(index=False, header=False)

    # Return a regular Response with text content type
    return JSONResponse({"csv_data": csv_string})


@app.get("/")
async def root():
    return {"message": "hello world"}

@app.get("/cohere")
async def process_transaction():
    return {"message": "Process Transaction"}

@app.post("/init_chat/{personality}")
async def initialize_chatbot(personality):
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

    if(personality == "PRO"):
        prompt = prompt_pro
    elif(personality == "FRIEND"):
        prompt = prompt_friend
    elif(personality == "MOM"):
        prompt = prompt_mom
    else:
        raise HTTPException(status_code=404, detail="invalid personality")
    response = co.chat(
        model='16c03f0f-ed9c-48da-a391-7b6487c58bcc-ft',
        messages=[
            {"role": "system", "content": prompt },
            {"role": "user", "content": "Please give an one sentence introduction about yourself"}
        ],
        temperature=0.2
    )

    # return json.loads(response.message.content[0].text)["intro"]
    # return response.message.content[0].text)["text"]
    return response