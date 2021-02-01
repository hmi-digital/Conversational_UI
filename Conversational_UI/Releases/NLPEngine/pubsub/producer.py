import json
from config import nluConfig
from kafka import KafkaProducer
from pubsub import utils
import logging

producer = None


def initialise():
    global producer
    producer = KafkaProducer(bootstrap_servers=nluConfig.getParameter('KAFKA_BROKERS').split(","),
                             client_id=nluConfig.getParameter('CLIENT_ID'),
                             value_serializer=lambda x: json.dumps(x).encode('utf-8'),
                             linger_ms=1000,
                             retries=1
                             )


def sendMessgae(topicName, key, value):
    global producer
    pNum = utils.getPartition(key, int(nluConfig.getParameter('PARTITIONS')))
    msg = json.loads(value)
    producer.send(topicName, value=msg, key=key.encode('utf-8'), partition=pNum)
    producer.flush()
    logging.info("[INTENT_ENGINE] sending message: \"{}\"".format(value))
    logging.info("[INTENT_ENGINE] message sent with key: \"{}\" to partition \"{}\"!".format(key, pNum))
