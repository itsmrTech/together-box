/**
 *          .::DATABASE CONFIGURATION::.
 * Connecting to Mongo Server and Database Configuration
 * 
 */
mongoose.Promise = global.Promise;

const {
	DB_USERNAME,
	DB_PASSWORD,
	DB_HOST,
	DB_PORT,
	DB_NAME,
	DB_AUTHSOURCE,
	DB_FULL_URL
} = process.env;

const mongoOptions = {
	useNewUrlParser: true,
	useFindAndModify: false,
	useCreateIndex: true,
	server: {
		reconnectTries: 10,
		reconnectInterval: 3000
	}
};

//GENERATING MONGODB URI
if (DB_FULL_URL) {
	var uri = DB_FULL_URL
}
else {

	var loginInfo = "";
	var authSource = "";
	if (DB_USERNAME) {
		loginInfo = DB_USERNAME + ":" + DB_PASSWORD + "@";
		authSource = "?authSource=" + DB_AUTHSOURCE;
	}
	var uri = "mongodb://" + loginInfo + DB_HOST + ":" + DB_PORT + "/" + DB_NAME + authSource;
}

//CONNECTING TO MONGODB SERVER
mongoose.connect(uri, mongoOptions);
const db = mongoose.connection;

//LOGS
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to mongo server.'));