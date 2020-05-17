#!/usr/bin/env bash
set -euo pipefail

# User info
USERNAME=sample3@example.com
PASSWORD=password
REGION=us-west-2

# Load stack name
STACKNAME=${STACKNAME:-$(./scripts/get-sam-config.js stack_name)}

# Get user pool id
USERPOOL=$(aws cloudformation describe-stacks --region $REGION --stack-name $STACKNAME --query 'Stacks[0].Outputs[?OutputKey=='\''UserPoolId'\''].OutputValue' --output text)

# Create a sample user
aws cognito-idp admin-create-user \
  --region $REGION \
  --user-pool-id $USERPOOL \
  --username $USERNAME \
  --message-action SUPPRESS \
  --temporary-password $PASSWORD \
  --user-attributes \
    Name=email,Value=$USERNAME \
    Name=email_verified,Value=True \
    Name=phone_number,Value="+15555551212" \
    Name=custom:tenantId,Value="TEST_TENANT_ID"

# Set password to permanent so no need to change it on first sign in
aws cognito-idp admin-set-user-password \
  --region $REGION \
  --user-pool-id $USERPOOL \
  --username $USERNAME \
  --password $PASSWORD \
  --permanent