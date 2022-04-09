FROM node:16 

WORKDIR /usr/src/flatc

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get --assume-yes install git cmake build-essential

RUN git clone https://github.com/google/flatbuffers.git

WORKDIR /usr/src/flatc/flatbuffers

RUN cmake -G "Unix Makefiles"
RUN make

RUN chmod +x flatc

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

RUN FLATCPATH=/usr/src/flatc/flatbuffers/flatc npm run fb

RUN npm run build


CMD [ "ENVIRONMENT=production","node", "dist/index.js" ]