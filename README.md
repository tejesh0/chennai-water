# fov-chennai-water

1. Install Anaconda from https://www.anaconda.com/distribution/#download-section
2. Install Nodejs (binaries from nodesource https://github.com/nodesource/distributions)
3. Create a Conda environment
`conda create -n <environment_name> anaconda pip`
4. Activate the environment 
`conda activate <environment_name>`
5. pip install gramex
6. run `gramex setup --all`

## To run the app
1. Activate the environment
2. Run 
`git clone git@github.com:tejesh95/fov-chennai-water.git`
`cd fov-chennai-water/app && gramex`


Apps runs on port :9988

Visit http://localhost:9988/