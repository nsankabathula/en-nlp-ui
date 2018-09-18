docker run -it \
-v ${PWD}:/usr/src/app \
-v /usr/src/app/node_modules \
-p 4200:4200 \
--name nlp-demo-container \
--rm \
nsankabathula/nlp-demo
