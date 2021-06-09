import os
import openai

openai.api_key = os.getenv("OPENAI_API_KEY")

questions = [
    "Who did Tutankhamun marry?",
    "How old was Tutankhamun when he rose to the throne?",
    "Who restored the Ancient Egyptian religion?",
    "Where did King Tut move his father's remains?",
    "Who funded Howard Carter's discovery of Tutankhamun's tomb?",
    "What was the status of King Tut's tomb when it was found?",
    "What is the curse of the pharaohs?",
    "How tall was King Tut?",
    "How tall was King Tut in feet?",
    "How did King Tut die?",
]

# models = ["curie", "davinci"]
# models = ["davinci"]
# models = ["curie"]
models = ["ada"]

def doAnswer(model, question):

    response = openai.Answer.create(
      search_model=model,
      model=model,
      question=question,
      file="file-BW3Opoe0JbJJzto76qSn7wOp",
      examples_context="In 2017, U.S. life expectancy was 78.6 years.",
      examples=[
        ["What is human life expectancy in the United States?","78 years."]
      ],
      max_tokens=25,
      stop=["\n", "<|endoftext|>"],
    )

    print("%-10s %-70s %s" % (model, question, response.answers))

for model in models:
    print(model)
    print("====")
    for question in questions:
        doAnswer(model, question)

#
# response = openai.Answer.create(
#   search_model="davinci",
#   model="davinci",
#   question="How did King Tut die?",
#   file="file-BW3Opoe0JbJJzto76qSn7wOp",
#   examples_context="In 2017, U.S. life expectancy was 78.6 years.",
#   examples=[
#     ["What is human life expectancy in the United States?","78 years."]
#   ],
#   max_tokens=25,
#   stop=["\n", "<|endoftext|>"],
# )
#
# print(response.answers)
#
# print("====")
# print(response)
