#!/bin/bash
#date
#author
#purpose

mkdir ./dynamolocal
wget http://dynamodb-local.s3-website-us-west-2.amazonaws.com/dynamodb_local_latest.tar.gz
tar xzf dynamodb_local_latest.tar.gz
rm -f dynamodb_local_latest.tar.gz
java -Djava.library.path=./DynamoDBLocal_lib/ -jar DynamoDBLocal.jar

#END