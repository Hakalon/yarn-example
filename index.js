'use strict';
var Alexa = require('alexa-sdk');
var fs = require('fs');
var bodyParser = require('body-parser');
var reqSender = require("request");
var mqtt = require('mqtt');
var aws4 = require('aws4');
var async = require('async');

exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {

    'HelloWorld': function () {
        this.emit(':tell', 'Hello World!');
    },
    'Airconditioner': function () {
        var mqttHost = 'a25s70e2j1bk94.iot.ap-northeast-1.amazonaws.com';
        var mqttPort = '8883';
        var mqttKey = fs.readFileSync('Cert/aws-private.pem.key');
        var mqttCert = fs.readFileSync('Cert/aws-certificate.pem.crt');
        var mqttCA = [fs.readFileSync('Cert/rootCA.pem')];
        var opt = {
            protocol: "mqtts",
            host: mqttHost,
            port: mqttPort,
            ca: mqttCA,
            key: mqttKey,
            cert: mqttCert
        };
        var client = mqtt.connect(opt);
        client.publish('7697/ac_ir', new Buffer('00FD807F'));

        var dt = new Date();
        var hours = (dt.getUTCHours() + 8);
        if (hours > 12)
            hours = (hours - 12) + " pm ";
        else
            hours = hours + " am ";
        var time = hours + dt.getMinutes() + " and " + dt.getSeconds();
        var that = this;

        setTimeout(function () {
            that.emit(':tell', `Signal has been sended at ${time}`);
        }, 1000);

    },
    'ACCondition': function () {
        // AWS Signature & Get shadow data
        var awsOpts = { service: 'iotdata', region: 'ap-northeast-1', host: 'a25s70e2j1bk94.iot.ap-northeast-1.amazonaws.com', path: '/things/esp8266/shadow' };
        aws4.sign(awsOpts, { accessKeyId: 'AKIAICGPKBZPCN4NHIPQ', secretAccessKey: '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' });

        var options = {
            url: "https://" + awsOpts.host + awsOpts.path,
            headers: awsOpts.headers
        };

        var that = this;

        async.waterfall([
            function (next) {
                reqSender(options, function (error, response, body) {
                    var iotdata = JSON.parse(body);
                    //lab_temp = iotdata.state.reported.temperature;
                    //lab_hum = iotdata.state.reported.humidity;
                    //ac_status = iotdata.state.reported.ac_status;
                    next(null, iotdata.state.reported.temperature, iotdata.state.reported.humidity, iotdata.state.reported.ac_status);
                });
            },
            function (lab_temp, lab_hum, ac_status, next) {
                var msg = 'Tempture is ' + lab_temp;
                msg = msg + '. humidity is ' + lab_hum;
                if (ac_status != 1)
                    msg = msg + '. AC is closed.';
                else
                    msg = msg + '. AC is opend.';

                that.emit(':tell', msg);
            }
        ]);
    }
};