const Schema = require('mongoose').Schema;

const logSchema = new Schema ({
  formCrimeId: String,
  formCrimeDate: String,
  APIRequest: String,
  APIAnswer: Schema.Types.Mixed, //to save the objetc in the DB
  infoShown: [String],
})

module.exports = require('mongoose').model('Log', logSchema);