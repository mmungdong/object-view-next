import { NextRequest } from 'next/server';
import OSS from 'ali-oss';

// 配置此路由为动态路由，不进行静态导出
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bucket, region, accessType, accessKey, secretKey, key, expires = 3600 } = body;

    if (!bucket || !region || !key) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: bucket, region, and key' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 对于公有读存储桶，不需要签名
    if (accessType === 'public') {
      const url = `https://${bucket}.${region}.aliyuncs.com/${key}`;
      return new Response(
        JSON.stringify({ url }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 创建 OSS 客户端
    const client = new OSS({
      region,
      accessKeyId: accessKey,
      accessKeySecret: secretKey,
      bucket,
    });

    // 生成签名 URL
    // 添加超时机制防止请求长时间挂起
    const signedUrl = client.signatureUrl(key, { expires });
    const signaturePromise = Promise.resolve(signedUrl);

    // 创建一个超时 Promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('OSS 签名请求超时')), 30000); // 30秒超时
    });

    const resultUrl = await Promise.race([signaturePromise, timeoutPromise]);

    return new Response(
      JSON.stringify({ url: resultUrl }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error generating signature URL:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to generate signature URL' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}