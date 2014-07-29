'use strict';

var hapi = require('hapi'),
    bunyan = require('bunyan'),
    joi = require('joi'),
    logger = bunyan.createLogger({
        name: 'devclub-rest-1',
        streams: [
            {
                type: 'file',
                level: 'debug',
                path: '/var/log/devclub/nodejs-devclub-rest-1.log'
            },
            {
                level: 'trace',
                stream: process.stdout
            }
        ],
        serializers: bunyan.stdSerializers
    }),
    server;

server = hapi.createServer('0.0.0.0', 6001, {});

function getData (request, reply) {
    return reply({
        success: true,
        message: 'Hello ' + request.params.magic
    });
}

server.route([
    {
        method: 'GET',
        path: '/data/{magic}',
        handler: getData,
        config: {
            description: 'Get out data',
            validate: {
                params: {
                    'magic': joi.string().min(3).max(20).alphanum().required()
                }
            }
        }
    }
]);

server.on('response', function (request) {
    var requestTiming = Date.now() - request.info.received;
    logger.info({ id: request.id, processingDuration: requestTiming + 'ms', statusCode: request.response.statusCode, httpHeaders: request.response.headers, httpBody: request.response._payload._data},
        'Response for request');
});

server.ext('onRequest', function (request, next) {
    logger.info({ url: request.url.path, method: request.method, id: request.id, remoteIP: request.info.remoteAddress, remotePort: request.info.remotePort, referrer: request.info.referrer, httpHeaders: request.headers },
        'Incoming request');
    next();
});

server.start(function () {
    logger.info({ uri: server.info.uri }, 'Server started');
});
