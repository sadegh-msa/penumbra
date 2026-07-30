import { describe, expect, it } from 'bun:test';
import pexelsPhotoSource from './pexels';

describe('Pexels Photo Source', () => {
  const mockResponse = {
    photos: [
      {
        id: 1,
        src: {
          original: 'https://example.com/photo1.jpg'
        },
        avg_color: '#ff0000',
        photographer_id: 123,
        photographer: 'Test Photographer',
        photographer_url: 'https://example.com/photographer1'
      },
      {
        id: 2,
        src: {
          original: 'https://example.com/photo2.jpg'
        },
        avg_color: '#00ff00',
        photographer_id: 456,
        photographer: 'Another Photographer',
        photographer_url: 'https://example.com/photographer2'
      }
    ]
  };

  it('should extract photos from a valid response', () => {
    const photos = pexelsPhotoSource.extractPhotos(mockResponse);
    expect(photos).toHaveLength(2);
  });

  it('should generate correct tinyUrl', () => {
    const photos = pexelsPhotoSource.extractPhotos(mockResponse);
    expect(photos[0].tinyUrl()).toContain('https://example.com/photo1.jpg');
    expect(photos[0].tinyUrl()).toContain('auto=compress');
    expect(photos[0].tinyUrl()).toContain('h=54');
    expect(photos[0].tinyUrl()).toContain('w=96');
  });

  it('should generate correct largeUrl with current window dimensions', () => {
    const photos = pexelsPhotoSource.extractPhotos(mockResponse);
    const expectedUrl = `https://example.com/photo1.jpg?fit=crop&h=${window.innerHeight}&w=${window.innerWidth}`;
    expect(photos[0].largeUrl()).toBe(expectedUrl);
  });

  it('should return correct average color', () => {
    const photos = pexelsPhotoSource.extractPhotos(mockResponse);
    expect(photos[0].averageColor()).toBe('#ff0000');
    expect(photos[1].averageColor()).toBe('#00ff00');
  });

  it('should return correct photographer data', () => {
    const photos = pexelsPhotoSource.extractPhotos(mockResponse);
    expect(photos[0].photographer()).toEqual({
      id: 123,
      name: 'Test Photographer',
      url: 'https://example.com/photographer1'
    });
  });

  it('should return an empty array for empty photos', () => {
    const photos = pexelsPhotoSource.extractPhotos({ photos: [] } as any);
    expect(photos).toHaveLength(0);
  });
});
