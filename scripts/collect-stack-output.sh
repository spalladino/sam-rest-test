#!/usr/bin/env bash

# Load stack name
STACKNAME=${STACKNAME:-$(./scripts/get-sam-config.js stack_name)}

# Collect stack info and reformat it
aws cloudformation describe-stacks --stack-name $STACKNAME --query 'Stacks[0].Outputs' | \
  jq 'map({ key: .OutputKey, value: .OutputValue }) | from_entries'