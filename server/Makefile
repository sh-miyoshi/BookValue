appName=bookvalue_server
appVersion=1.0

all: build run

build:
	docker build -t $(appName):$(appVersion) .

run:
	docker run --name $(appName) -e SUBSCRIPTION_KEY=$(SUBSCRIPTION_KEY) -d --restart=always -p 80:4567 $(appName):$(appVersion)

rm:
	docker stop $(appName)
	docker rm $(appName)

log:
	docker logs $(appName)