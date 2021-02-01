# -*- coding: utf-8 -*-
import logging
import re
import sys

root = logging.getLogger()
root.setLevel(logging.INFO)
handler = logging.StreamHandler(sys.stdout)
handler.setLevel(logging.INFO)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
root.addHandler(handler)


# return partition number based on key value for proper distribution of topic records across partitions
def getPartition(key, partitionCount):
    return parseKey(key) % partitionCount


def parseKey(key):
    pNumber = 0
    p = re.compile("d(.*?)-")
    m = p.match(key)
    if m:
        pNumber = m.group(0)[1:-1]
    return int(pNumber)


def loginfomsg(msg):
    logging.info(msg)


def logerrormsg(msg):
    logging.error(msg)
