import pandas as pd

# Load JSON
df = pd.read_json('Cleaned_date.json')

# Combine two fields into one (with space or any custom separator)
df['instruction'] = df['instruction'] + ' ' + df['input']

# Optional: drop original columns
df = df.drop(columns=['input', 'text'])

# Swap the first two rows (assuming they exist)
df.iloc[[0, 1]] = df.iloc[[1, 0]].values

# Save to new JSON file as a single JSON array
df.to_json('combined_output.json', orient='records', force_ascii=False, indent=2)