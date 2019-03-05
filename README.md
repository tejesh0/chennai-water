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
`cd fov-chennai-water/app && gramex --listen.port=9988`


Apps runs on port :9988

Visit http://localhost:9988/


Note: Scraping scripts are in scraping folder. Datasets stored inside scraping/data folder


## Usage (Video Link)

[![Watch the video](https://user-images.githubusercontent.com/6937958/53812957-89b2b700-3f82-11e9-811c-8298f9b86c19.png)](https://youtu.be/GU4p5wEdSic)


## List of dependencies
- [Gramex](https://github.com/gramener/gramex/blob/master/LICENSE): [MIT license][MIT]
- [Python](https://www.python.org/): [PSF license][PSF]
  - [Anaconda](https://docs.anaconda.com/anaconda/) distribution: [BSD license][BSD]
- [node.js](https://github.com/nodejs/node/blob/master/LICENSE): [MIT license][MIT]
