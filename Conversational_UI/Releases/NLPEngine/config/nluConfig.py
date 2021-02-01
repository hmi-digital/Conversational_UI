# -*- coding: utf-8 -*-
import os

scriptDir = os.path.dirname(__file__)
propertyFile = os.path.join(scriptDir, '', 'nlp.properties')

separator = "="
properties = {}


def loadParameters() -> None:
    global properties
    with open(propertyFile) as f:
        for line in f:
            if separator in line:
                name, value = line.split(separator, 1)
                properties[name.strip()] = value.strip()


def getParameter(param):
    global properties
    res = ""
    if param in properties:
        res = properties[param]
        return res
    else:
        return res
