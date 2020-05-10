#!/usr/bin/env bash

# Stack name
STACKNAME=${STACKNAME:-"sam-rest-test"}

# Collect stack info and reformat it
aws cloudformation describe-stacks --stack-name $STACKNAME --query 'Stacks[0].Outputs' | \
  jq 'map({ key: .OutputKey, value: .OutputValue }) | from_entries'