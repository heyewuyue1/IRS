# 文本预处理
import re
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.stem.porter import PorterStemmer
from nltk.stem.wordnet import WordNetLemmatizer
from nltk.corpus import stopwords
from stop_words import get_stop_words
import json

# 停用词
stop_words = set(get_stop_words('en'))
new_words = ["using", "show", "result", "large", "also",
             "iv", "one", "two", "new", "previously", "shown", "based"]
stop_words = stop_words.union(new_words)
# Stemming
ps = PorterStemmer()
# Lemmatisation
lem = WordNetLemmatizer()

corpus = []

raw_corpus = []

clean_corpus = []

for i in range(1000):
    with open("papers/%d.txt" % i) as f:
        text = f.readlines()
        text = text[0] + text[4]
        # 去除标点符号
        text = re.sub("[^a-zA-Z]", " ", text)
        # 转换成小写
        text = text.lower()
        # 去除标签
        text = re.sub("&lt;/?.*?&gt", " &lt;&gt; ", text)
        # 去除特殊符号和数字
        text = re.sub("(\\d|\\W)+", " ", text)
        # 字符串转为List
        raw_text = text.split()
        text = [lem.lemmatize(word) for word in raw_text if not word in stop_words]
        clean_corpus.append(text)
        raw_text = [lem.lemmatize(word) for word in raw_text]
        text = " ".join(text)
        raw_corpus.append(raw_text)
        corpus.append(text)

vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(corpus)

data = {'word': vectorizer.get_feature_names_out(),
        'tfidf': X.toarray().sum(axis=0).tolist()}
df = pd.DataFrame(data)
df.sort_values(by="tfidf", ascending=False, inplace=True)
key_words = df.head(500)['word'].to_list()
with open('key_words.json', 'x') as f:
    f.write(json.dumps(key_words))

# rev_index = {}
# for i in range(1000):
#     for j in range(len(raw_corpus[i])):
#         word = raw_corpus[i][j]
#         if word in key_words:
#             if not rev_index.get(word):
#                 rev_index[word] = {}
#             word_index = rev_index[word]
#             if not word_index.get(i):
#                 word_index[i] = []
#             word_index[i].append(j)
#             rev_index[word] = word_index

text_vector = []

for i in range(1000):
    text_vector.append([])
    for j in range(500):
        if key_words[j] in clean_corpus[i]:
            text_vector[i].append(1)
        else:
            text_vector[i].append(0)

# with open('text_vector.json', 'x') as f:
#     f.write(json.dumps(text_vector))
            
        
# with open("rev_index.json", "x") as f:
#     f.write(json.dumps(rev_index, indent=4))