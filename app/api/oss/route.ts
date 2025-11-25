import { NextRequest } from 'next/server';
import OSS from 'ali-oss';

// 由于 Next.js App Router 在服务器组件中不能直接访问环境变量，
// 我们需要通过请求参数传递配置信息

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bucket = searchParams.get('bucket');
    const region = searchParams.get('region');
    const accessType = searchParams.get('accessType') as 'private' | 'public';
    const prefix = searchParams.get('prefix') || '';
    const accessKey = searchParams.get('accessKey') || '';
    const secretKey = searchParams.get('secretKey') || '';

    if (!bucket || !region) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: bucket and region' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 创建 OSS 客户端
    const client = new OSS({
      region,
      accessKeyId: accessKey,
      accessKeySecret: secretKey,
      bucket,
    });

    // 列出文件
    // 添加超时机制防止请求长时间挂起
    const listPromise = client.list({
      prefix,
      delimiter: '/',
      'max-keys': 1000
    });

    // 创建一个超时 Promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('OSS 请求超时')), 30000); // 30秒超时
    });

    const result = await Promise.race([listPromise, timeoutPromise]);

    // 处理文件和文件夹
    const files = [];

    // 处理文件夹
    if (result.prefixes) {
      for (const prefix of result.prefixes) {
        if (prefix !== '/') {
          files.push({
            key: prefix,
            name: prefix.split('/').filter(p => p !== '').pop() || '',
            isFolder: true,
            size: 0,
            lastModified: new Date()
          });
        }
      }
    }

    // 处理文件
    if (result.objects) {
      for (const obj of result.objects) {
        // 跳过当前目录本身
        if (obj.name === prefix) continue;

        // 检查是否为文件夹（以 / 结尾）
        const isFolder = obj.name.endsWith('/');
        const name = isFolder
          ? obj.name.split('/').filter(p => p !== '').pop() || ''
          : obj.name.split('/').pop() || obj.name;

        files.push({
          key: obj.name,
          name: name,
          isFolder: isFolder,
          size: obj.size || 0,
          lastModified: obj.lastModified ? new Date(obj.lastModified) : new Date()
        });
      }
    }

    return new Response(
      JSON.stringify({ files }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error listing OSS files:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to list files' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}