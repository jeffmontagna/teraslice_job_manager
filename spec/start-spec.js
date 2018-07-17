'use strict';

const Promise = require('bluebird');
const start = require('../cmds/start');

const argv = {
    job_file: 'spec/fixtures/test_job_file.json'
};

let registeredCheck;
let startResponse;
const _tjmTestFunctions = {
    alreadyRegisteredCheck: () => registeredCheck,
    terasliceClient: {
        jobs: {
            wrap: () => {
                const functions = {
                    start: () => startResponse
                };
                return functions;
            }
        }
    }
};

describe('start should start a job', () => {
    it('should throw an error if alreadyRegisteredCheck fails', (done) => {
        registeredCheck = Promise.reject(new Error('Job is not on the cluster'));
        return start.handler(argv, _tjmTestFunctions)
            .then(done.fail)
            .catch(() => done());
    });

    it('should start job', (done) => {
        registeredCheck = Promise.resolve();
        startResponse = { job_id: 'success' };
        return start.handler(argv, _tjmTestFunctions)
            .then(response => expect(response.job_id).toEqual('success'))
            .catch(() => done.fail)
            .finally(() => done());
    });

    it('should throw error if start response does not have the job_id', (done) => {
        registeredCheck = Promise.resolve();
        startResponse = { };
        return start.handler(argv, _tjmTestFunctions)
            .then(done.fail)
            .catch(() => done());
    });
});
