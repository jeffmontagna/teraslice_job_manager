'use strict';

const fs = require('fs-extra');
const asset = require('../cmds/asset');
const path = require('path');
const Promise = require('bluebird');

let deployMessage = 'default deployed message';
let deployError = null;

const assetJson = {
    name: 'testing_123',
    version: '0.0.01',
    description: 'dummy asset.json for testing'
};

const assetPath = path.join(__dirname, '..', 'asset/asset.json');

const _tjmFunctions = {
    loadAsset: () => {
        if (deployError) {
            return Promise.reject(deployError);
        }
        return Promise.resolve(deployMessage);
    },
    zipAsset: () => Promise.resolve({
        bytes: 1000,
        success: 'very successful'
    })
};

describe('asset command testing', () => {

    beforeEach(() => {
        deployError = null;
        deployMessage = 'default deployed message';
    });
    let argv = {};

    it('deploy triggers load asset', () => {
        argv.c = 'localhost:5678';
        argv.cmd = 'deploy';
        deployMessage = 'deployed';

        return fs.ensureFile(assetPath)
            .then(() => fs.writeJson(assetPath, assetJson, { spaces: 4 }))
            .then(() => asset.handler(argv, _tjmFunctions))
            .then((result) => {
                expect(result).toEqual('deployed');
            })
    });

    it('deploy should respond to a request error', () => {
        argv.c = 'localhost:5678';
        argv.cmd = 'deploy';
        const error = new Error('This is an error');
        error.name = 'RequestError';
        error.message = 'This is an error';

        deployError = error;
        return asset.handler(argv, _tjmFunctions)
            .catch((err) => {
                expect(err).toBe('Could not connect to localhost:5678');
            });
    });

    it('deploy should throw an error if requested cluster already in cluster tjm data', (done) => {
        const testJson = {
            name: 'testing_123',
            version: '0.0.01',
            description: 'dummy asset.json for testing',
            tjm: {
                clusters: [ 
                    'http://localhost:5678', 
                    'http://newCluster:5678',
                    'http://anotherCluster:5678'
                ]
            }
        };
        argv.cmd = 'deploy';
        argv.c = 'http://localhost:5678';
        
        return Promise.resolve()
            .then(() => fs.ensureFile(assetPath))
            .then(() => fs.writeJson(assetPath, testJson, { spaces: 4 }))
            .then(() => asset.handler(argv, _tjmFunctions))
            .catch((err) => {
                expect(err).toBe('Assets have already been deployed to http://localhost:5678, use update');
            })
            .finally(() => done());
    });


    it('asset update should throw an error if no cluster data', () => {
        argv = {};
        argv.cmd = 'update';

        return expect(() => asset.handler(argv, _tjmFunctions))
            .toThrow('Cluster data is missing from asset.json or not specified using -c.');
    });
});
