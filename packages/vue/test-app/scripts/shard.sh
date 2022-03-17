#!/bin/bash

# Splits test files into shards
# to be run in parallel
# Usage: ./scripts/shard.sh [Current Shard] [Total Number of Shards]
# Example: ./scripts/shard.sh 1 2
# If shards are not provided it will
# assume 1 total shard.

CURRENT_SHARD="${2:-1}"
TOTAL_SHARDS="${3:-1}"
SHARD_TO_INDEX=$((CURRENT_SHARD - 1))

# Find all spec files and order alphabetically
paths=($(find ${1} -name '*.js' | sort))
finalPaths=()

# Loop through each file
# and assign a shard for each test.
# If the shard number matches the current
# test runner's shard, add it to the final
# paths array
for index in "${!paths[@]}"; do
  chunk=$((index % TOTAL_SHARDS))
  if [ $chunk == $SHARD_TO_INDEX ]; then
    finalPaths+=(${paths[$index]})
  fi
done

# Echo the final paths.
# This will be passed to the
# test runner command to make
# sure specific tests run.
IFS=$','
echo "${finalPaths[*]}"
unset IFS
