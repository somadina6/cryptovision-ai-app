#!/bin/bash


# Invoke the function
curl -i --location --request POST \
  "https://$SUPABASE_URL/functions/v1/update-tokens" \
  --header "Authorization: Bearer $SUPABASE_ANON_KEY" \
  --header "Content-Type: application/json"