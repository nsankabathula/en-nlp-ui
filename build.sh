git checkout src/environments/server.json
git pull
curl http://localhost:4040/api/tunnels >> ./src/environments/server.json
./docker_build.sh
