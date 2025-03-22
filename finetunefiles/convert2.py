import pandas as pd
import json

# Load the JSON file (assumed to be a list of objects)
df = pd.read_json("combined_output.json")

# Function to convert each row to the desired message format
def convert_row(row):
    return {
        "messages": [
            {"role": "User", "content": row["instruction"]},
            {"role": "Chatbot", "content": row["output"]}
        ]
    }

# Apply the conversion to each row
converted = df.apply(convert_row, axis=1)

# Write the converted rows to a JSONL file (one JSON object per line)
with open("output.jsonl", "w", encoding="utf-8") as f:
    for entry in converted:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")
