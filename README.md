# fov-chennai-water

## Build Instructions (linux/ubuntu)

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
3. Run 
`cd fov-chennai-water/app && gramex`


Apps runs on port :9988

Visit http://localhost:9988/


## Usage

[![Watch the video](https://user-images.githubusercontent.com/6937958/53541131-64ffaf00-3b3e-11e9-85d3-ce39826ef125.png)](https://youtu.be/AnxC2_p_BFE)


## List of dependencies
- [Gramex](https://github.com/gramener/gramex/blob/master/LICENSE): [MIT license][MIT]
- [Python](https://www.python.org/): [PSF license][PSF]
  - [Anaconda](https://docs.anaconda.com/anaconda/) distribution: [BSD license][BSD]
- [node.js](https://github.com/nodejs/node/blob/master/LICENSE): [MIT license][MIT]
