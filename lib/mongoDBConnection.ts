import { config } from 'dotenv';
import { MongoClient, Db, Collection } from 'mongodb';
config();

class MongoDB {
  private uri: string;
  private dbName: string;
  private client: MongoClient;
  private db: Db | null;
  private maxPoolSize: number;

  constructor() {
    const username = process.env.MONGO_USERNAME;
    const password = encodeURIComponent(process.env.MONGO_PASSWORD || '');
    const host = process.env.MONGO_HOST;
    const dbName = process.env.MONGO_DB_NAME || 'test';
    const options = process.env.MONGO_OPTIONS || '';
    this.uri = `mongodb+srv://${username}:${password}@${host}/${dbName}?${options}`;
    this.dbName = dbName;
    this.maxPoolSize = parseInt(process.env.MONGO_MAX_POOL_SIZE || '10', 10);
    this.client = new MongoClient(this.uri, {
      maxPoolSize: this.maxPoolSize,
    });

    this.db = null;
  }

  /**
   * Establish a connection to the MongoDB database.
   */
  async connect(): Promise<Db> {
    if (!this.db) {
      try {
        await this.client.connect();
        console.log('Connected to MongoDB');
        this.db = this.client.db(this.dbName);
      } catch (error) {
        console.error('Error connecting to MongoDB', error);
        throw new Error(`Failed to connect to MongoDB: ${error}`);
      }
    }
    return this.db;
  }

  /**
   * Check if a collection exists.
   */
  async collectionExists(collectionName: string): Promise<boolean> {
    if (!collectionName) {
      throw new Error('Collection name is required');
    }
    try {
      const db = await this.connect();
      const collections = await db.listCollections().toArray();
      return collections.some(
        (collection: { name: string }) => collection.name === collectionName,
      );
    } catch (error) {
      throw new Error(`Error checking if collection exists: ${error}`);
    }
  }

  /**
   * Close the MongoDB connection.
   */
  async close(): Promise<void> {
    try {
      await this.client.close();
      console.log('Closed MongoDB connection');
    } catch (error) {
      console.error('Error closing MongoDB connection', error);
      throw new Error(`Failed to close MongoDB connection: ${error}`);
    }
  }

  /**
   * Create a new collection if it does not exist.
   */
  async createCollection(collectionName: string): Promise<void> {
    if (!collectionName) {
      throw new Error('Collection name is required');
    }

    try {
      const db = await this.connect();
      const exists = await this.collectionExists(collectionName);
      if (exists) {
        console.log(`Collection ${collectionName} already exists`);
        return;
      }
      await db.createCollection(collectionName);
      console.log(`Collection ${collectionName} created`);
    } catch (error) {
      throw new Error(`Error creating collection: ${error}`);
    }
  }

  /**
   * Insert a single document into a collection.
   */
  async insertOne(
    collectionName: string,
    document: object,
    options: object = {},
  ): Promise<void> {
    if (!collectionName) {
      throw new Error('Collection name is required');
    }
    if (!document) {
      throw new Error('Document is required');
    }

    try {
      const db = await this.connect();
      const collection: Collection = db.collection(collectionName);
      const result = await collection.insertOne(document, options);
      console.log(`Inserted document with id ${result.insertedId}`);
    } catch (error) {
      throw new Error(`Error inserting document: ${error}`);
    }
  }

  /**
   * Insert multiple documents into a collection.
   */
  async insertMany(
    collectionName: string,
    documents: object[],
    options: object = { ordered: false },
  ): Promise<void> {
    if (!collectionName || !documents || documents.length === 0) {
      throw new Error(
        'Collection name and non-empty documents array are required',
      );
    }

    try {
      const db = await this.connect();
      const collection: Collection = db.collection(collectionName);
      const result = await collection.insertMany(documents, options);
      console.log(`Inserted ${result.insertedCount} documents`);
    } catch (error) {
      throw new Error(`Error inserting documents: ${error}`);
    }
  }

  /**
   * Find a single document in a collection.
   */
  async findOne(
    collectionName: string,
    query: object = {},
    projection: object = {},
  ): Promise<object | null> {
    if (!collectionName) {
      throw new Error('Collection name is required');
    }

    try {
      const db = await this.connect();
      const collection: Collection = db.collection(collectionName);
      return await collection.findOne(query, { projection });
    } catch (error) {
      throw new Error(`Error finding document: ${error}`);
    }
  }

  /**
   * Find multiple documents in a collection.
   */
  async findAll(
    collectionName: string,
    query: object = {},
    projection: object = {},
  ): Promise<object[]> {
    if (!collectionName) {
      throw new Error('Collection name is required');
    }

    try {
      const db = await this.connect();
      const collection: Collection = db.collection(collectionName);
      return await collection.find(query, { projection }).toArray();
    } catch (error) {
      throw new Error(`Error finding documents: ${error}`);
    }
  }

  /**
   * Update a single document in a collection.
   */
  async updateOne(
    collectionName: string,
    filter: object,
    update: object,
    options: object = { returnDocument: 'after' },
  ): Promise<object | null> {
    if (!collectionName || !filter || !update) {
      throw new Error('Collection name, filter, and update are required');
    }

    try {
      const db = await this.connect();
      const collection: Collection = db.collection(collectionName);
      const result = await collection.findOneAndUpdate(filter, update, options);
      if (result && result.value) {
        console.log('Updated one document');
        return result.value;
      }
      return null;
    } catch (error) {
      throw new Error(`Error updating document: ${error}`);
    }
  }

  /**
   * Delete a single document in a collection.
   */
  async deleteOne(
    collectionName: string,
    filter: object,
    options: object = {},
  ): Promise<void> {
    if (!collectionName || !filter) {
      throw new Error('Collection name and filter are required');
    }

    try {
      const db = await this.connect();
      const collection: Collection = db.collection(collectionName);
      const result = await collection.deleteOne(filter, options);
      console.log(`Deleted ${result.deletedCount} document`);
    } catch (error) {
      throw new Error(`Error deleting document: ${error}`);
    }
  }

  /**
   * Delete multiple documents in a collection.
   */
  async deleteMany(
    collectionName: string,
    filter: object,
    options: object = {},
  ): Promise<void> {
    if (!collectionName || !filter) {
      throw new Error('Collection name and filter are required');
    }

    try {
      const db = await this.connect();
      const collection: Collection = db.collection(collectionName);
      const result = await collection.deleteMany(filter, options);
      console.log(`Deleted ${result.deletedCount} documents`);
    } catch (error) {
      throw new Error(`Error deleting documents: ${error}`);
    }
  }

  async aggregate(
    collectionName: string,
    pipeline: object[],
    options: object = {},
  ): Promise<object[]> {
    if (!collectionName || !pipeline || pipeline.length === 0) {
      throw new Error('Collection name and non-empty pipeline are required');
    }

    try {
      const db = await this.connect();
      const collection: Collection = db.collection(collectionName);
      return await collection.aggregate(pipeline, options).toArray();
    } catch (error) {
      throw new Error(`Error aggregating documents: ${error}`);
    }
  }
}

export default MongoDB;
