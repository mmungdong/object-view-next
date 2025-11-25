/**
 * 判断文件是否为图片文件
 * @param fileName 文件名
 * @returns 是否为图片文件
 */
export function isImageFile(fileName: string): boolean {
  return /\.(jpe?g|png|gif|webp|bmp|tiff|svg)$/i.test(fileName);
}

/**
 * 判断文件是否为文本文件
 * @param fileName 文件名
 * @returns 是否为文本文件
 */
export function isTextFile(fileName: string): boolean {
  const textExtensions = ['txt', 'md', 'js', 'ts', 'jsx', 'tsx', 'css', 'html', 'json', 'xml'];
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  return textExtensions.includes(extension);
}

/**
 * 判断文件是否为PDF文件
 * @param fileName 文件名
 * @returns 是否为PDF文件
 */
export function isPdfFile(fileName: string): boolean {
  return /\.pdf$/i.test(fileName);
}