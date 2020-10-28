const MongoLib = require('../lib/mongo');

class ApiKeysService {
  constructor() {
    this.collection = 'api-keys';
    this.mongoDB = new MongoLib();
  }

  async getApiKey({ token }) {
    const [apiKey] = await this.mongoDB.getAll(this.collection, { token });
    console.log(['API KEY Service'], [apiKey]);
    return apiKey;
  }
}

module.exports = ApiKeysService;
