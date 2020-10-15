const MongoLib = require('../lib/mongo');

class ContentService {
  constructor() {
    this.collection = 'content';
    this.mongoDB = new MongoLib();
  }

  async getContent({ tags }) {
    const query = tags && { tags: { $in: tags } };
    const content = await this.mongoDB.getAll(this.collection, query);
    return content || [];
  }

  async getContent({ contentId }) {
    const content = await this.mongoDB.get(this.collection, contentId);
    return content || {};
  }

  async createContent({ content }) {
    const createContentId = await this.mongoDB.create(this.collection, content);
    return createContentId;
  }

  async updateContent({ contentId, content } = {}) {
    const updatedContentId = await this.mongoDB.update(
      this.collection,
      contentId,
      content
    );
    return updatedContentId;
  }

  async deleteContent({ contentId }) {
    const deletedContentId = await this.mongoDB.delete(this.collection, contentId);
    return deletedContentId;
  }
}

module.exports = ContentService;
