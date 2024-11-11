#!/bin/bash
for i in {1..5}; do
    echo "=== Batch $i ==="
    curl "http://localhost:3000/calculate?number=5" & \
    curl "http://localhost:3000/calculate?number=10" & \
    curl "http://localhost:3000/calcu