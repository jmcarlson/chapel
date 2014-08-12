# Import label data
# into MongoDB
mongoimport -h localhost -d chapel -c preferences --type csv --upsert --file prefs.csv --headerline --drop
