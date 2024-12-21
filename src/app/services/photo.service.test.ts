import makeGetPhotoService from '@app/services/photo.service';
import type { Photo, PhotoResponse, PhotoService, PhotoSource } from '@models/photo.model';
import { beforeEach, describe, expect, it, mock } from 'bun:test';
import type { PexelsResponse } from 'src/app/models/pexels-response.model';

describe('Photo Service', () => {
  let photoSource: PhotoSource<PexelsResponse>;
  let getPhotoService: PhotoService<PexelsResponse>;

  beforeEach(() => {
    photoSource = {
      name: 'testSource',
      label: 'Test Source',
      url: 'https://api.example.com/photos',
      headers: { 'Authorization': 'Bearer test-token' },
      params: { query: 'test', page: 1 },
      extractPhotos: mock().mockReturnValue([{
        tinyUrl: () => 'tiny.jpg',
        largeUrl: () => 'large.jpg',
        averageColor: () => '#000000',
        photographer: () => ({
          id: 123,
          name: 'John Doe',
          url: 'https://api.example.com/photographer/john_doe'
        })
      } as Photo])
    };

    getPhotoService = makeGetPhotoService<PexelsResponse>()(photoSource);
  });

  it('should load photos and cache the response', async () => {
    const mockResponse = { photos: [{ id: 1, url: 'photo.jpg' }] };
    global.fetch = mock().mockResolvedValue({
      json: mock().mockResolvedValue(mockResponse)
    });

    const result: PhotoResponse<PexelsResponse> = await getPhotoService.loadPhotos();

    expect(result.photos).toHaveLength(1);
    expect(result.photos[0].tinyUrl()).toBe('tiny.jpg');
    expect(result.photos[0].largeUrl()).toBe('large.jpg');
    expect(result.photos[0].averageColor()).toBe('#000000');
    expect(result.photos[0].photographer()).toMatchObject({
      id: 123,
      name: 'John Doe',
      url: 'https://api.example.com/photographer/john_doe'
    });
    expect(localStorage.getItem('pen_photos_service')).toBeTruthy();
  });

  it('should clear the cache', () => {
    localStorage.setItem('pen_photos_service', JSON.stringify({}));
    getPhotoService.clearCache();
    expect(localStorage.getItem('pen_photos_service')).toBeNull();
  });

  it('should read from cache if available and valid', async () => {
    const cachedData = {
      photoSource,
      response: { photos: [{ id: 1, url: 'photo.jpg' }] },
      date: new Date(),
      state: {}
    };
    localStorage.setItem('pen_photos_service', JSON.stringify(cachedData));

    const result: PhotoResponse<PexelsResponse> = await getPhotoService.loadPhotos();

    expect(result.photos).toHaveLength(1);
    expect(result.photos[0].tinyUrl()).toBe('tiny.jpg');
    expect(result.photos[0].largeUrl()).toBe('large.jpg');
    expect(result.photos[0].averageColor()).toBe('#000000');
    expect(result.photos[0].photographer()).toMatchObject({
      id: 123,
      name: 'John Doe',
      url: 'https://api.example.com/photographer/john_doe'
    });
  });
});
