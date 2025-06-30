import Fuse from 'fuse.js';

export class SearchService {
  private static instance: SearchService;
  private videoFuse: Fuse<any> | null = null;
  private courseFuse: Fuse<any> | null = null;
  private userFuse: Fuse<any> | null = null;
  private communityFuse: Fuse<any> | null = null;

  private constructor() {}

  static getInstance(): SearchService {
    if (!SearchService.instance) {
      SearchService.instance = new SearchService();
    }
    return SearchService.instance;
  }

  async initializeSearch(data?: {
    videos?: any[];
    courses?: any[];
    users?: any[];
    communities?: any[];
  }) {
    try {
      // Initialize with provided data or empty arrays
      const { videos = [], courses = [], users = [], communities = [] } = data || {};

      // Initialize video search
      this.videoFuse = new Fuse(videos, {
        keys: [
          { name: 'title', weight: 0.4 },
          { name: 'description', weight: 0.3 },
          { name: 'tags', weight: 0.2 },
          { name: 'author.name', weight: 0.1 }
        ],
        threshold: 0.3,
        includeScore: true
      });

      // Initialize course search
      this.courseFuse = new Fuse(courses, {
        keys: [
          { name: 'title', weight: 0.4 },
          { name: 'description', weight: 0.3 },
          { name: 'tags', weight: 0.2 },
          { name: 'instructor.name', weight: 0.1 }
        ],
        threshold: 0.3,
        includeScore: true
      });

      // Initialize user search
      this.userFuse = new Fuse(users, {
        keys: [
          { name: 'name', weight: 0.5 },
          { name: 'bio', weight: 0.3 },
          { name: 'subjects', weight: 0.2 }
        ],
        threshold: 0.3,
        includeScore: true
      });

      // Initialize community search
      this.communityFuse = new Fuse(communities, {
        keys: [
          { name: 'name', weight: 0.4 },
          { name: 'description', weight: 0.3 },
          { name: 'tags', weight: 0.3 }
        ],
        threshold: 0.3,
        includeScore: true
      });

    } catch (error) {
      console.error('Error initializing search:', error);
    }
  }

  async searchVideos(query: string, filters?: { category?: string; author?: string }) {
    if (!this.videoFuse) {
      console.warn('Video search not initialized. Call initializeSearch() first.');
      return [];
    }
    
    let results = this.videoFuse.search(query) || [];
    
    // Apply filters
    if (filters?.category) {
      results = results.filter(result => result.item.category === filters.category);
    }
    
    if (filters?.author) {
      results = results.filter(result => 
        result.item.author?.name?.toLowerCase().includes(filters.author!.toLowerCase())
      );
    }

    return results.map(result => ({
      ...result.item,
      score: result.score
    }));
  }

  async searchCourses(query: string, filters?: { category?: string; level?: string; priceRange?: [number, number] }) {
    if (!this.courseFuse) {
      console.warn('Course search not initialized. Call initializeSearch() first.');
      return [];
    }
    
    let results = this.courseFuse.search(query) || [];
    
    // Apply filters
    if (filters?.category) {
      results = results.filter(result => result.item.category === filters.category);
    }
    
    if (filters?.level) {
      results = results.filter(result => result.item.level === filters.level);
    }
    
    if (filters?.priceRange) {
      const [min, max] = filters.priceRange;
      results = results.filter(result => 
        result.item.price >= min && result.item.price <= max
      );
    }

    return results.map(result => ({
      ...result.item,
      score: result.score
    }));
  }

  async searchTeachers(query: string, filters?: { subject?: string }) {
    if (!this.userFuse) {
      console.warn('User search not initialized. Call initializeSearch() first.');
      return [];
    }
    
    let results = this.userFuse.search(query) || [];
    
    if (filters?.subject) {
      results = results.filter(result => 
        result.item.subjects?.includes(filters.subject)
      );
    }

    return results.map(result => ({
      ...result.item,
      score: result.score
    }));
  }

  async searchCommunities(query: string, filters?: { category?: string }) {
    if (!this.communityFuse) {
      console.warn('Community search not initialized. Call initializeSearch() first.');
      return [];
    }
    
    let results = this.communityFuse.search(query) || [];
    
    if (filters?.category) {
      results = results.filter(result => result.item.category === filters.category);
    }

    return results.map(result => ({
      ...result.item,
      score: result.score
    }));
  }

  async searchNotes(notes: any[], query: string) {
    const noteFuse = new Fuse(notes, {
      keys: [
        { name: 'content', weight: 0.7 },
        { name: 'tags', weight: 0.3 }
      ],
      threshold: 0.3,
      includeScore: true
    });

    const results = noteFuse.search(query);
    return results.map(result => ({
      ...result.item,
      score: result.score
    }));
  }

  async getGlobalSearchResults(query: string) {
    const [videos, courses, teachers, communities] = await Promise.all([
      this.searchVideos(query),
      this.searchCourses(query),
      this.searchTeachers(query),
      this.searchCommunities(query)
    ]);

    return {
      videos: videos.slice(0, 10),
      courses: courses.slice(0, 5),
      teachers: teachers.slice(0, 5),
      communities: communities.slice(0, 5)
    };
  }
}

export const searchService = SearchService.getInstance();