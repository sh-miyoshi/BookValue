FROM ruby:2.5.1-alpine3.7

RUN mkdir -p /myapp
WORKDIR /myapp

RUN gem install sinatra

COPY server.rb server.rb

CMD ["ruby", "server.rb"]