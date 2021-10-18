// export type FilterQuestionType = 'none' | 'stopwords' | 'part-of-speech' | 'part-of-speech-noun' | 'part-of-speech-noun-adj';

The following properties can be set:

// model controls how the answer is calculated
model: ada | babbage | currie | davinci

// search_model ranks the selected documents to show context
search_model: ada | babbage | currie | davinci

// filter_question converts the question to text to find documents via elasticsearch  
// part-of-speech is the same as part-of-speech-noun-adj
// stopwords just filters out common stopwords like 'this', 'and', 'if', etc
filter_question: 'none' | 'stopwords' | 'part-of-speech' | 'part-of-speech-noun' | 'part-of-speech-noun-adj'

// rerank_elasticsearch: turns re-ranking on
rerank_elasticsearch: true | false

// rerank_elasticsearch_size: the number of documents to search in elasticsearch to re-rank. Max = 10000
rerank_elasticsearch_size: number

// rerank_elasticsearch_model: AI model to use for re-ranking.  CAN any AI model
// from OpenAI but DO NOT set it to anything other than ada unless you really want
// to spend money!!! ada is already $0.10 per query for large queries.  

rerank_elasticsearch_model: ada | babbage | currie | davinci

You can set the parameters below and these are the defaults.

```javascript
localStorage.setItem("CoreAnswerExecutorRequest", JSON.stringify({
    model: 'currie',
    search_model: 'currie',
    filter_question: 'part-of-speech',
    rerank_elasticsearch: false,
    rerank_elasticsearch_size: 10000,
    rerank_elasticsearch_model: 'ada'
}))
```

... to remove these you can type.

```javascript
localStorage.removeItem("CoreAnswerExecutorRequest");
```
