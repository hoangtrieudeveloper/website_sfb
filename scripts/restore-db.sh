#!/bin/bash

# Script restore database
# Usage: ./scripts/restore-db.sh <backup-file.sql.gz>

set -e

if [ -z "$1" ]; then
  echo "❌ Please provide backup file"
  echo "Usage: ./scripts/restore-db.sh <backup-file.sql.gz>"
  exit 1
fi

BACKUP_FILE=$1

if [ ! -f "$BACKUP_FILE" ]; then
  echo "❌ Backup file not found: $BACKUP_FILE"
  exit 1
fi

echo "⚠️  WARNING: This will overwrite the current database!"
read -p "Are you sure? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
  echo "❌ Restore cancelled"
  exit 1
fi

echo "📥 Restoring database from $BACKUP_FILE..."

# Restore database
gunzip -c $BACKUP_FILE | docker-compose exec -T postgres psql -U postgres sfb_db

if [ $? -eq 0 ]; then
  echo "✅ Database restored successfully!"
else
  echo "❌ Restore failed!"
  exit 1
fi

