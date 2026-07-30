import { beforeEach, describe, expect, it } from 'bun:test';
import type { Photo, PhotoSource, PhotoSourceCache } from '@models/photo.model';
import PhotoService from './photo.service';

describe('Photo Service', () => {
  const CACHE_KEY = 'pen_photos_service';

  const createMockPhotoSource = (overrides: Partial<PhotoSource<any>> = {}): PhotoSource<any> => ({
    name: 'TEST',
    label: 'Test Source',
    url: 'https://api.test.com/search',
    headers: { 'Authorization': 'test-key' },
    params: { query: 'nature', per_page: 20, page: 0 },
    extractPhotos: (response) => response.photos,
    ...overrides
  });

  const createMockResponse = (photos: Photo[] = []) => ({
    photos
  });

  beforeEach(() => {
    localStorage.clear();
  });

  describe('cache', () => {
    it('should write data to cache', () => {
      const photoSource = createMockPhotoSource();
      const service = new PhotoService(photoSource);
      const cacheData: PhotoSourceCache<any> = {
        photoSource,
        response: createMockResponse(),
        date: new Date(),
        state: {}
      };

      service.writeToCache(cacheData);

      const stored = localStorage.getItem(CACHE_KEY);
      expect(stored).not.toBeNull();
      expect(JSON.parse(stored!).response).toEqual(cacheData.response);
    });

    it('should read data from cache', () => {
      const photoSource = createMockPhotoSource();
      const service = new PhotoService(photoSource);
      const cacheData: PhotoSourceCache<any> = {
        photoSource,
        response: createMockResponse([{ id: 1 } as any]),
        date: new Date(),
        state: {}
      };

      service.writeToCache(cacheData);
      const readData = service.readFromCache();

      expect(readData).not.toBeNull();
      expect(readData!.response).toEqual(cacheData.response);
    });

    it('should return null when reading from empty cache', () => {
      const service = new PhotoService(createMockPhotoSource());
      expect(service.readFromCache()).toBeNull();
    });

    it('should clear cache', () => {
      const service = new PhotoService(createMockPhotoSource());
      service.writeToCache({
        photoSource: createMockPhotoSource(),
        response: createMockResponse(),
        date: new Date(),
        state: {}
      });

      service.clearCache();
      expect(localStorage.getItem(CACHE_KEY)).toBeNull();
    });
  });

  describe('loadPhotos', () => {
    it('should fetch fresh photos when cache is empty', async () => {
      const photoSource = createMockPhotoSource({
        params: { query: 'nature', per_page: 20, page: 0 }
      });
      const service = new PhotoService(photoSource);

      const mockPhotos = [{ id: 1 } as any];
      const mockResponse = createMockResponse(mockPhotos);

      global.fetch = async () => ({
        ok: true,
        json: async () => mockResponse
      } as any);

      const result = await service.loadPhotos();

      expect(result.photos).toEqual(mockPhotos);
      expect(result.originalResponse).toEqual(mockResponse);
    });

    it('should return cached photos when cache is fresh', async () => {
      const photoSource = createMockPhotoSource({
        params: { query: 'nature', per_page: 20, page: 0 }
      });
      const service = new PhotoService(photoSource);

      const mockPhotos = [{ id: 1 } as any];
      const mockResponse = createMockResponse(mockPhotos);
      const cacheData: PhotoSourceCache<any> = {
        photoSource,
        response: mockResponse,
        date: new Date(),
        state: {}
      };

      service.writeToCache(cacheData);
      service.updateState(mockResponse);

      const fetchSpy = global.fetch;
      let fetchCalled = false;
      global.fetch = async () => {
        fetchCalled = true;
        throw new Error('fetch should not be called when cache is fresh');
      };

      const result = await service.loadPhotos();

      expect(fetchCalled).toBe(false);
      expect(result.photos).toEqual(mockPhotos);

      global.fetch = fetchSpy;
    });

    it('should fetch fresh photos when cache is stale', async () => {
      const photoSource = createMockPhotoSource({
        params: { query: 'nature', per_page: 20, page: 0 }
      });
      const service = new PhotoService(photoSource);

      const oldResponse = createMockResponse([{ id: 1 } as any]);
      const cacheData: PhotoSourceCache<any> = {
        photoSource,
        response: oldResponse,
        date: new Date(Date.now() - 31 * 60 * 1000),
        state: {}
      };

      service.writeToCache(cacheData);

      const newPhotos = [{ id: 2 } as any];
      const newResponse = createMockResponse(newPhotos);

      global.fetch = async () => ({
        ok: true,
        json: async () => newResponse
      } as any);

      const result = await service.loadPhotos();

      expect(result.photos).toEqual(newPhotos);
      expect(result.originalResponse).toEqual(newResponse);
    });
  });
});
