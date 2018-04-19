'use strict';

const fs = require('fs-extra');
const argv = {};
let tjmFunctions = require('../cmds/cmd_functions/functions')(argv, 'localhost');
const Promise = require('bluebird');
const path = require('path');

let jobContents;
let someJobId;
const _teraslice = {
    jobs: {
        wrap: (jobContents) => {
                return { spec: () => {
                    return Promise.resolve({
                        job_id: someJobId
                    })
                }
            }
        }
    }
};

describe('teraslice job manager testing', () => {
    it('check that cluster name starts with http', () => {
        expect(tjmFunctions.httpClusterNameCheck('localhost')).toBe('http://localhost');
        expect(tjmFunctions.httpClusterNameCheck('http://localhost')).toBe('http://localhost');
        expect(tjmFunctions.httpClusterNameCheck('https://localhost')).toBe('https://localhost');
    });

    it('check that job files do not have to end in json', () => {
        fs.writeFileSync(`${process.cwd()}/tfile.prod.json`, JSON.stringify({ test: 'test' }));
        let jobFileFunctions = require('../cmds/cmd_functions/json_data_functions')('tfile.prod.json');
        let jobData = jobFileFunctions.jobFileHandler();
        expect((jobData[1]).test).toBe('test');
        jobFileFunctions = require('../cmds/cmd_functions/json_data_functions')('tfile.prod');
        jobData = jobFileFunctions.jobFileHandler();
        expect((jobData[1]).test).toBe('test');
        fs.unlinkSync(`${process.cwd()}/tfile.prod.json`);
    });

    it('registered jobs return true, unregistered jobs return false', () => {
        jobContents = {
            tjm: {
                cluster: 'http://localhost',
                job_id: 'jobYouAreLookingFor'
            }
        };

        someJobId = 'jobYouAreLookingFor';

        tjmFunctions.__testContext(_teraslice);
        tjmFunctions.alreadyRegisteredCheck(jobContents)
            .then(alreadyRegistered => {
                expect(alreadyRegistered).toBe(true);
            });

        someJobId = 'notTheJobYouAreLookingFor';
        tjmFunctions.alreadyRegisteredCheck(jobContents)
        .then(alreadyRegistered => {
            expect(alreadyRegistered).toBe(false);
        });

        jobContents = {}
        someJobId = 'jobYouAreLookingFor';
        tjmFunctions.alreadyRegisteredCheck(jobContents)
        .then(alreadyRegistered => {
            expect(alreadyRegistered).toBe(false);
        });

    })

    it('meta data is being written to assets.json ', () => {
        const assetJson = {
            name: 'testing 123',
            version: '0.0.01',
            description: 'dummy asset.json for testing'
        }

        const assetPath = path.join(process.cwd(), 'asset/asset.json');
        
        argv.c = 'http://localhost';
        tjmFunctions = require('../cmds/cmd_functions/functions')(argv, 'localhost');
        fs.emptyDir(path.join(process.cwd(), 'asset'))
            .then(() => fs.writeJson(assetPath, assetJson, {spaces: 4}))
            .then(() => tjmFunctions.updateAssetsMetadata())
            .then((assetJson) => {
                expect(assetJson.tjm).toBeDefined();
                expect(assetJson.tjm.clusters[0]).toBe('http://localhost');
            })
            .catch(err => console.log(err));
    })

    it('cluster is added to array in asset.json if a new cluster', () => {
        const assetJson = {
            name: 'testing 123',
            version: '0.0.01',
            description: 'dummy asset.json for testing',
            tjm: {
                clusters: [ 'http://localhost' ]
            }
        }

        const assetPath = path.join(process.cwd(), 'asset/asset.json');
        
        argv.c = 'http://newCluster';
        tjmFunctions = require('../cmds/cmd_functions/functions')(argv);
        fs.emptyDir(path.join(process.cwd(), 'asset'))
            .then(() => fs.writeJson(assetPath, assetJson, {spaces: 4}))
            .then(() => tjmFunctions.updateAssetsMetadata())
            .then((assetJson) => {
                expect(assetJson.tjm).toBeDefined();
                expect(assetJson.tjm.clusters[0]).toBe('http://localhost');
                expect(assetJson.tjm.clusters[1]).toBe('http://newCluster');
            })
            .catch(err => console.log(err));
    })

    fit('no asset.json throw error', () => {
        const assetPath = path.join(process.cwd(), 'asset/asset.json');
        argv.c = 'http://newCluster';

        tjmFunctions = require('../cmds/cmd_functions/functions')(argv);
        fs.emptyDir(path.join(process.cwd(), 'asset'))
            .then(() => expect(tjmFunctions.updateAssetsMetadata).toThrow());
    })

    fit('if cluster already in metadata throw error', () => {
        const assetJson = {
            name: 'testing 123',
            version: '0.0.01',
            description: 'dummy asset.json for testing',
            tjm: {
                clusters: [ 'http://localhost', 'http://newCluster', 'http://anotherCluster' ]
            }
        }

        const assetPath = path.join(process.cwd(), 'asset/asset.json');
        argv.c = 'http://localhost';
        tjmFunctions = require('../cmds/cmd_functions/functions')(argv);
        fs.emptyDir(path.join(process.cwd(), 'asset'))
            .then(() => fs.writeJson(assetPath, assetJson, {spaces: 4}))
            .then(() => {
                expect(tjmFunctions.updateAssetsMetadata).toThrow('Assets have already been deployed to http://localhost, use update')});
    })
    
});