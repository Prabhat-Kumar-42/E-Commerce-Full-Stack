import { unlink } from 'fs/promises';

// /src/utils/helpers.util.ts
export async function deleteOldImage(filePath: string) {
  try {
    await unlink(filePath);
    console.log('File deleted successfully');
  } catch (err) {
    console.error('Failed to delete old image:', err);
  }
}