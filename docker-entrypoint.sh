#!/bin/sh

echo "Running Prisma migrations..."
npx prisma db push

echo "Starting server..."
exec node dist/server.js
