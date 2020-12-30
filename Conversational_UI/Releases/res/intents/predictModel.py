# -*- coding: utf-8 -*-
import os
import re
import sys
from modules import processQuery as pq

domain = sys.argv[1]
locale = sys.argv[2]
userUtterance = sys.argv[3]

scriptDir = os.path.dirname(__file__)
if locale == 'en':
    utter = re.sub(r'[^a-zA-Z ]', '', userUtterance)
else:
    utter = userUtterance

combinations = pq.genUtterances(utter)
jResult = pq.processUtterance(combinations)
newjResult = str(jResult).replace("'", '"').strip()
sys.stdout.buffer.write(newjResult.encode('utf8'))
