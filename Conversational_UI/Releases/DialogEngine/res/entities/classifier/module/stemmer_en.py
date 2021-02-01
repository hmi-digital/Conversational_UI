# -*- coding: utf-8 -*-
from nltk import word_tokenize
from nltk.stem import PorterStemmer
from nltk.stem import SnowballStemmer
def stemTokenize_1(text):
 stemmer=SnowballStemmer('english')
 return[stemmer.stem(w)for w in word_tokenize(text)]
def stemTokenize_2(text):
 stemmer=PorterStemmer()
 return[stemmer.stem(w)for w in word_tokenize(text)]
# Created by pyminifier (https://github.com/liftoff/pyminifier)
