FROM node:9.11.1 as node

# set working directory
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY package.json /usr/src/app/package.json

RUN npm install
RUN npm install -g @angular/cli@latest

COPY . /usr/src/app

EXPOSE 4200

CMD ng serve --host 0.0.0.0 --disableHostCheck true
#RUN npm run build


#==================== Setting up stage ==================== 
# Create image based on the official nginx - Alpine image
#FROM nginx:1.13.7-alpine

#COPY --from=node /usr/src/app/dist/ /usr/share/nginx/html

#COPY ./nginx-app.conf /etc/nginx/conf.d/default.conf
