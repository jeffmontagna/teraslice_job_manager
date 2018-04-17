# teraslice_job_manager
Command line job management helper.

Teraslice job manager uses data in the job file for the cluster and job id associated with a job.  Once a job is registed using tjm metadata is added to the job file as tjm: { job_id: jobid, cluster: clusterName, version: verssion}.  The tjm data is then referenced by the teraslice job manager for other functions.


## Installation
- clone/download repository
- npm install -g

## CLI Commands and Usage
For all commands that accept -c, if -c is missing default is http://localhost

**ASSET** - Compresses files in currentWorkingDirectory/asset and creates a zip file in currentWorkingDir/builds/processors.zip.  Once the asset has been deployed with tjm the cluster data is stored in currentWorkingDir/asset/asset.json
- tjm asset deploy -c clusterName *Deploys assets to the cluster*
- tjm asset update *Updates asset to the cluster(s) in asset.json*
- tjm asset status *Shows the latest asset version in the cluster(s) in asset.json*

**ERRORS** - Logs to the terminal errors for a job.  Cluster and job id data must be in the jobsFile.json
- tjm errors jobFile.json

**PAUSE** - Pauses a job.  Cluster and job id must be in the jobsFile.json
- tjm pause jobFile.json

**REGISTER** - Registers a job to a cluster with an option to deploy assets.  Updates the jobFile.json with the cluster and job id data.  Use -a to deploy assets
- tjm register -c clustername jobFile.json
- tjm register -c clustername -a jobFile.json

**RESUME** - Resumes a paused or a stopped job. Cluster and job id data must be in the jobsFile.json
- tjm resume jobFile.json

**RUN** - Registers and runs a job with an options to deploy assets.  Updates the jobFile.json with the cluster and job id data.  Use -a to deploy assets.
- tjm run -c clustername jobFile.json
- tjm run -c clustername -a jobFile.json

**START** - Starts a job.  Cluster and job id data must be in the jobsFile.json
- tjm start jobFile.json

**STATUS** - Reports the status of a job.  Cluster and job id data must be in the jobsFile.json
- tjm status jobFile.json

**STOP** - Stops a job.  Cluster and job id data must be in the jobsFile.json
- tjm stop jobFile.json

**UPDATE** - Updates a job.  Cluster and job id data must be in the jobsFile.json
- tjm update jobFile.json

**WORKERS** - Adds to or removes workers from a job.  Cluster and job id data must be in the jobsFile.json
- tjm workers add 10 jobFile.json
- tjm workers remove 5 jobFile.json

