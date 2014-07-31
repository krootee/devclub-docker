FROM kroot/devclub-nodejs

ADD ./server.js /opt/devclub-rest/
ADD ./node_modules/ /opt/devclub-rest/node_modules/

CMD sudo node /opt/devclub-rest/server.js

RUN mkdir /var/log/devclub -p

EXPOSE 6001
