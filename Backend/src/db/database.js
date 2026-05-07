import mongoose from 'mongoose'

export const connectionDatabase = () => {
	const uri =
		'mongodb+srv://slavka0042004_db_user:gfXbUcRRKUfwyx2H@cluster322.jsez4kj.mongodb.net/test?appName=Cluster322'

	return mongoose.connect(uri)
}
