# -*- coding: utf-8 -*-
import json
from config import nluConfig
from coreNLP import trainModel
from coreNLP import predictModel
from pubsub import utils
from pubsub import producer


def process(message):
    utils.loginfomsg(
        '[BROKER]: message received with key: ' + message.key.decode('utf-8') + ' message: ' + str(message.value))
    key = message.key.decode('utf-8')
    # check if the message is for training the NLP
    if utils.parseKey(key) == 0 and key.find('DUMMY') != -1:
        if 'messageId' in message.value and message.value['messageId'] == 'TRAIN':
            domain = message.value['domain']
            locale = message.value['locale']
            utils.loginfomsg('[INTENT_ENGINE] training the NLP for domain:{} and locale:{}'.format(domain, locale))
            res = trainModel.train(domain, locale)
            n = int(json.loads(res)["utterances"])
            if n > 0:
                res = {"messageId": "TRAIN_SUCCESS", "domain": domain, "locale": locale, "message": res}
            else:
                res = {"messageId": "TRAIN_FAIL", "domain": domain, "locale": locale, "message": res}
            producer.sendMessgae(nluConfig.getParameter('TOPIC_NLP_TO_BOT'), key, json.dumps(res))
        elif 'messageId' in message.value and message.value['messageId'] == 'PREDICT':
            domain = message.value['domain']
            locale = message.value['locale']
            utterance = message.value['userUtterance']
            utils.loginfomsg(
                '[INTENT_ENGINE] predicting the utterance:{} for domain:{} and locale:{}'.format(utterance, domain,
                                                                                                 locale))
            result = predictModel.predict(domain, locale, utterance)
            res = {"messageId": "PREDICT", "domain": domain, "locale": locale, "userUtterance": utterance,
                   "message": result}
            producer.sendMessgae(nluConfig.getParameter('TOPIC_NLP_TO_BOT'), key, json.dumps(res))
    else:
        domain = message.value['domain']
        locale = message.value['locale']
        utterance = message.value['userUtterance']
        utils.loginfomsg(
            '[INTENT_ENGINE] processing the utterance:{} for domain:{} and locale:{}'.format(utterance, domain, locale))
        result = predictModel.predict(domain, locale, utterance)
        res = {"messageId": "PREDICT", "domain": domain, "locale": locale, "userUtterance": utterance,
               "message": result}
        producer.sendMessgae(nluConfig.getParameter('TOPIC_NLP_TO_BOT'), key, json.dumps(res))
