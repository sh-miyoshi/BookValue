FROM ruby:2.5.3-alpine3.8

RUN mkdir /myapp
WORKDIR /myapp

COPY Gemfile Gemfile
RUN bundle install

COPY . .

CMD ruby dev_server.rb