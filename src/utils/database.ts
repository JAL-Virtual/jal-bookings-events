// MongoDB aggregation pipeline types
interface LookupStage {
  from: string;
  localField?: string;
  foreignField?: string;
  as: string;
  pipeline?: Array<Record<string, unknown>>;
}

interface AggregationStage {
  $match?: Record<string, unknown>;
  $lookup?: LookupStage;
  [key: string]: unknown;
}

// MongoDB collection interface
interface MongoCollection {
  find(query: Record<string, unknown>, options?: Record<string, unknown>): {
    limit(count: number): {
      toArray(): Promise<unknown[]>;
    };
  };
  findOne(query: Record<string, unknown>, options?: Record<string, unknown>): Promise<unknown>;
  insertMany(docs: Record<string, unknown>[], options?: Record<string, unknown>): Promise<unknown>;
}

// Database optimization utilities
export class DatabaseOptimizer {
  // Connection pooling configuration
  static readonly CONNECTION_POOL_SIZE = 10;
  static readonly MAX_IDLE_TIME = 30000; // 30 seconds
  
  // Query optimization helpers
  static optimizeQuery(query: Record<string, unknown>, options: {
    hint?: Record<string, unknown>;
    projection?: Record<string, unknown>;
    sort?: Record<string, unknown>;
    limit?: number;
  } = {}) {
    return {
      ...query,
      // Add indexes hints if needed
      hint: options.hint,
      // Limit fields for better performance
      projection: options.projection,
      // Use proper sorting
      sort: options.sort || { createdAt: -1 },
      // Limit results
      limit: options.limit || 100,
    };
  }

  // Batch operations for better performance
  static async batchInsert(collection: MongoCollection, documents: Record<string, unknown>[], batchSize = 100) {
    const batches = [];
    for (let i = 0; i < documents.length; i += batchSize) {
      batches.push(documents.slice(i, i + batchSize));
    }

    const results = [];
    for (const batch of batches) {
      const result = await collection.insertMany(batch, { ordered: false });
      results.push(result);
    }
    return results;
  }

  // Optimized aggregation pipeline
  static createOptimizedPipeline(stages: AggregationStage[]) {
    return stages.map(stage => {
      // Optimize $match stages
      if (stage.$match) {
        return {
          $match: {
            ...stage.$match,
            // Add compound indexes hints
          }
        };
      }
      
      // Optimize $lookup stages
      if (stage.$lookup) {
        return {
          $lookup: {
            ...stage.$lookup,
            // Use let and pipeline for better performance
            pipeline: stage.$lookup.pipeline || []
          }
        };
      }
      
      return stage;
    });
  }

  // Index recommendations
  static getIndexRecommendations(collectionName: string, queries: Array<Record<string, unknown>>) {
    const recommendations = [];
    
    // Analyze common query patterns
    const commonFields = new Map();
    queries.forEach(query => {
      Object.keys(query).forEach(field => {
        commonFields.set(field, (commonFields.get(field) || 0) + 1);
      });
    });

    // Recommend compound indexes for frequently used field combinations
    const sortedFields = Array.from(commonFields.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([field]) => field);

    if (sortedFields.length > 1) {
      recommendations.push({
        type: 'compound',
        fields: sortedFields,
        collection: collectionName
      });
    }

    return recommendations;
  }

  // Cache warming strategies
  static async warmCache(collection: MongoCollection, commonQueries: Array<Record<string, unknown>>) {
    const cachePromises = commonQueries.map(async (query) => {
      try {
        await collection.find(query).limit(1).toArray();
      } catch (error) {
        console.warn('Cache warming failed for query:', query, error);
      }
    });

    await Promise.allSettled(cachePromises);
  }

  // Connection health check
  static async checkConnectionHealth(collection: MongoCollection) {
    try {
      const start = Date.now();
      await collection.findOne({}, { projection: { _id: 1 } });
      const latency = Date.now() - start;
      
      return {
        healthy: latency < 100, // Less than 100ms is healthy
        latency,
        timestamp: new Date().toISOString()
      };
    } catch (error: unknown) {
      return {
        healthy: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
    }
  }
}

// Query result caching
export class QueryCache {
  private cache = new Map<string, { data: unknown; timestamp: number; ttl: number }>();
  private readonly DEFAULT_TTL = 300000; // 5 minutes

  set(key: string, data: unknown, ttl = this.DEFAULT_TTL) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string) {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > cached.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  clear() {
    this.cache.clear();
  }

  // Generate cache key from query parameters
  static generateKey(query: Record<string, unknown>, collection: string): string {
    return `${collection}:${JSON.stringify(query)}`;
  }
}
