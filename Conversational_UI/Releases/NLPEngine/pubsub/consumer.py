# -*- coding: utf-8 -*-
import json
from config import nluConfig
from kafka import KafkaConsumer, TopicPartition

consumer = None


def initialise(topic):
    global consumer
    consumer = KafkaConsumer(bootstrap_servers=nluConfig.getParameter('KAFKA_BROKERS').split(","),
                             group_id=nluConfig.getParameter('GROUP_ID'),
                             value_deserializer=lambda x: json.loads(x.decode('utf-8')),
                             max_poll_records=int(nluConfig.getParameter('MAX_POLL_RECORDS')),
                             auto_offset_reset=nluConfig.getParameter('OFFSET_RESET'),
                             enable_auto_commit=True)
    consumer.subscribe(topic)
    # dummy poll to discard old messages
    consumer.poll()
    consumer.seek_to_end()
    return consumer


def readMessages(topic):
    global consumer
    consumer.subscribe(topic)
    for msg in consumer:
        print(msg)
