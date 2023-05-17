from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
import re
from nltk.stem.wordnet import WordNetLemmatizer
from stop_words import get_stop_words
import json
import numpy as np


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许访问的源
    allow_credentials=True,  # 支持 cookie
    allow_methods=["*"],  # 允许使用的请求方法
    allow_headers=["*"]  # 允许携带的 Headers
)

# 停用词
stop_words = set(get_stop_words('en'))
new_words = ["using", "show", "result", "large", "also",
             "iv", "one", "two", "new", "previously", "shown", "based"]
stop_words = stop_words.union(new_words)

lem = WordNetLemmatizer()

key_words = []

with open('key_words.json') as f:
    key_words = eval(f.read())

with open('rev_index.json') as f:
    index = json.loads(f.read())

with open('text_vector.json') as f:
    text_vec = eval(f.read())

def get_info(v):
    with open('papers/%d.txt' % v) as f:
        title = f.readline()
        author = f.readline()
        ref = f.readline()
        date = f.readline()
        abstract = f.readline()
        url = f.readline()
        return {
            'title': title,
            'author': author,
            'ref': ref,
            'date': date,
            'abstract': abstract,
            'url': url,
            'key': v
        }


def handle_query(message):
        # 去除标点符号
        text = re.sub("[^a-zA-Z]", " ", message)
        # 转换成小写
        text = text.lower()
        # 去除标签
        text = re.sub("&lt;/?.*?&gt", " &lt;&gt; ", text)
        # 去除特殊符号和数字
        text = re.sub("(\\d|\\W)+", " ", text)
        # 字符串转为List
        text = text.split()
        text = [lem.lemmatize(word) for word in text if not word in stop_words]
        vec = []
        ret_list = []
        for i in range(500):
            if key_words[i] in text:
                vec.append(1)
            else:
                vec.append(0)
        ret_info = {}
        sort_md = {}
        for words in text:
            if words in key_words:
                for num in index[words]:
                    i = eval(num)
                    if ret_info.get(i) == None:
                        md = np.dot(np.array(vec), np.array(text_vec[i])) / (np.linalg.norm(vec) * np.linalg.norm(text_vec[i]))
                        ret_info[i] = {
                            'md': round(md, 2),
                            'match': ""
                        }
                        sort_md[i] = md
                    ret_info[i]['match'] += ' ' + words
        sort_md = list(sort_md.items())
        sort_md = sorted(sort_md, key=lambda x: x[1], reverse=True)
        print(sort_md)
        for t in sort_md:
            ret_obj = ret_info[t[0]]
            ret_obj.update(get_info(t[0]))
            print(ret_obj)
            ret_list.append(ret_obj)
        return ret_list
        

@app.get("/irs")
def give_response(message: str):
    return handle_query(message)


if __name__ == "__main__":
    uvicorn.run(app='main:app', host="127.0.0.1",
                port=8000, reload=True)
