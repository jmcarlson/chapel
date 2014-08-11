# Import label data
# into MongoDB
mongoimport -h localhost -d chapel -c labels --type csv --upsert --file labels.csv --headerline
