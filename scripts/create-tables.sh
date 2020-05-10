#!/usr/bin/env bash

# Creates tables in local dynamodb
# For creating tables in AWS, use the SAM template

aws dynamodb create-table \
  --table-name relayers \
  --attribute-definitions AttributeName=tenantId,AttributeType=S AttributeName=relayerId,AttributeType=S \
  --key-schema AttributeName=tenantId,KeyType=HASH AttributeName=relayerId,KeyType=SORT \
  --billing-mode PAY_PER_REQUEST \
  --endpoint-url http://localhost:8000