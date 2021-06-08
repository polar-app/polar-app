import os
import openai
openai.api_key = os.getenv("OPENAI_API_KEY")
response = openai.Answer.create(
  search_model="davinci",
  model="davinci",
  question="How did King Tut die?",
  file="file-BW3Opoe0JbJJzto76qSn7wOp",
  examples_context="In 2017, U.S. life expectancy was 78.6 years.",
  examples=[
    ["What is human life expectancy in the United States?","78 years."]
  ],
  max_tokens=25,
  stop=["\n", "<|endoftext|>"],
)

print(response.answers)

print("====")
print(response)
