#!/bin/bash

docker compose up --detach

json_content='{
    "development": {
      "username": "ch",
      "password": "ch",
      "database": "chdb",
      "host": "localhost",
      "dialect": "mariadb",
      "port": 3306,
      "define": {
        "timestamps": false
      }
    }
}'

if [ ! -e ./config/config.json ]; then
	echo "$json_content" > config/config.json
fi

