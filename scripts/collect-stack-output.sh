#!/usr/bin/env bash

## TODO: Get from samconfig.toml
# Stack name
STACKNAME=${STACKNAME:-"sam-rest-dev-2"}

# Collect stack info and reformat it
aws cloudformation describe-stacks --stack-name $STACKNAME --query 'Stacks[0].Outputs' | \
  jq 'map({ key: .OutputKey, value: .OutputValue }) | from_entries'