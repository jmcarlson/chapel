# Import label data
# into MongoDB
#mongo ds033679.mongolab.com:33679/heroku_app27786453
mongoimport -h ds033679.mongolab.com:33679 -u chapel -p Chapel2014 -d heroku_app27786453 -c preferences --type csv --upsert --file prefs.csv --headerline
