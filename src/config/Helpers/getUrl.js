import Common from '../Common';

export const getUrl = videoUrl => {
  if (!videoUrl) return null;

  // Check if it's already a full URL (S3 or any http link)
  if (videoUrl.startsWith('http://') || videoUrl.startsWith('https://')) {
    return videoUrl;
  }

  // Otherwise prepend assetURL
  return `${Common?.assetURL}${videoUrl}`;
};
