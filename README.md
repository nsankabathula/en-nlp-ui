## Prequestive
1. Node
2. Angular Client:  npm install -g @angular/cli

## First Time:
npm install


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

For running locally, you would need server.json file in src/environments/ which includes the elasticsearch and webserver configs (sample:src/environments/server.json.sample). Fet the configs by running the below command on server after running ng-rok. ng-rok should be running esearch(9200) and ws(8000)

curl http://localhost:4040/api/tunnels > server.json
cat server.json

Copy paste the cat result into server.json.



# Docker

### Build Image
Build using local repo => ./docker_build.sh
Build using remote repo, pull the latest code from git repo and runs docker_build => ./build.sh


### Run Image (using docker-compose)
./start.sh

### Stop Image (using docker-compose)
./stop.sh


### Enter the container
docker exec -it container_id /bin/bash



