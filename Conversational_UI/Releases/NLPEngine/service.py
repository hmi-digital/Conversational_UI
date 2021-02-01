# -*- coding: utf-8 -*-
import json
import os
import re
import threading
from warnings import simplefilter

import flask
from flask import request, jsonify, make_response, abort

from config import nluConfig
from coreNLP import trainModel, predictModel
from pubsub import consumer
from pubsub import processMessage
# ignore all warnings
from pubsub import producer as pr
from pubsub import utils

scriptDir = os.path.dirname(__file__)

simplefilter(action='ignore')

# load all the config parameters
nluConfig.loadParameters()

if re.search(nluConfig.getParameter('USE_BROKER'), 'true', re.IGNORECASE):
    utils.loginfomsg("Broker based NLPEngine enabled")
    # initialise the producer
    pr.initialise()
    # Run consumer listener to process all the NLP_TO_BOT messages
    consumer_ = consumer.initialise(nluConfig.getParameter('TOPIC_BOT_TO_NLP'))
    for msg in consumer_:
        utils.loginfomsg(msg)
        t = threading.Thread(target=processMessage.process, args=(msg,))
        t.start()
else:
    utils.loginfomsg("REST API based NLPEngine enabled")
    app = flask.Flask(__name__)
    scriptDir = os.path.dirname(__file__)
    SERVER_HOST = '0.0.0.0'
    SERVER_PORT = nluConfig.getParameter('PORT')


    @app.route('/train', methods=['POST'])
    def trainDomain():
        if not (request.args.get('domain')):
            utils.logerrormsg("missing domain parameter")
            abort(404)
        if request.args.get('locale'):
            locale = request.args.get('locale')
        else:
            locale = 'en'
        domain = request.args.get('domain')
        res = trainModel.train(domain, locale)
        n = int(json.loads(res)["utterances"])
        if n > 0:
            response = {"messageId": "TRAIN_SUCCESS", "domain": domain, "locale": locale, "message": res}
        else:
            response = {"messageId": "TRAIN_FAIL", "domain": domain, "locale": locale, "message": res}
        return make_response(jsonify(response), 200,
                             {'Content-Type': 'application/json; charset=utf-8'})


    @app.route('/predict', methods=['POST'])
    def predict_query():
        if not (request.args.get('domain') or request.args.get('userUtterance')):
            utils.logerrormsg("missing parameters")
            abort(404)
        if request.args.get('locale'):
            locale = request.args.get('locale')
        else:
            locale = 'en'
        utter = request.args.get('userUtterance')
        if locale == 'en':
            utterance = re.sub(r'[^a-zA-Z ]', '', utter)
        domain = request.args.get('domain')
        res = {"messageId": "PREDICT", "domain": domain, "locale": locale, "userUtterance": utterance,
               "message": predictModel.predict(domain, locale, utterance)}
        return make_response(jsonify(res), 200,
                             {'Content-Type': 'application/json; charset=utf-8'})


    @app.errorhandler(404)
    def not_found(error):
        return make_response(jsonify({'response': 'ERROR: Please check your query parameter'}), 404,
                             {'Content-Type': 'application/json; charset=utf-8'})


    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return response


    if __name__ == '__main__':
        if re.search(nluConfig.getParameter('HTTPS'), 'true', re.IGNORECASE):
            context_ = ('keys/nlp.crt', 'keys/nlp.pem')
            app.run(debug=False, host=SERVER_HOST, port=SERVER_PORT, threaded=True, ssl_context=context_)
        else:
            app.run(debug=False, host=SERVER_HOST, port=SERVER_PORT, threaded=True)

# result = predictModel.predict("trip", "en", "I want to book a ticket")
# res = {"messageId": "PREDICT", "domain": "trip", "locale": "en", "userUtterance": "I want to book a ticket ","message": result}
# producer.sendMessgae(constants.topicName_2, "d9-DUMMY", json.dumps(res))
# producer.sendMessgae(constants.topicName_2, 'd13-GWP7LBRW2PR1', json.dumps(m1))
