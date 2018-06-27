'use strict';

exports.command = 'stop <jobFile>';
exports.desc = 'stops job on the cluster in the job file\n';
exports.builder = (yargs) => {
    yargs.example('tjm stop jobfile.prod.json');
};
exports.handler = (argv, _testFunctions) => {
    const reply = require('./cmd_functions/reply')();
    const jobData = require('./cmd_functions/json_data_functions')()
        .jobFileHandler(argv.jobFile);

    const jobContents = jobData.contents;
    const tjmFunctions = _testFunctions ||
        require('./cmd_functions/functions')(argv, jobContents.tjm.cluster);
    const jobId = jobContents.tjm.job_id;

    return tjmFunctions.alreadyRegisteredCheck(joContents)
        .then(() => tjmFunctions.teraslice.jobs.wrap(jobId).stop())
        .then((stopResponse) => {
            if (!stopResponse.status.status === 'stopped') {
                return Promise.reject(new Error('Job could not be stopped'));                
            }
            reply.green(`Stopped job ${jobId} on ${jobContents.tjm.cluster}`);
                return stopResponse;
        })
        .catch(err => reply.fatal(err));
};
