import type { StorageConfig } from '../types/storage';

// 设置cookie的函数
export function setConfigCookie(configs: StorageConfig[]): void {
  // 确保在客户端执行
  if (typeof document === 'undefined') {
    return;
  }

  try {
    const configJson = JSON.stringify(configs);
    // 设置cookie过期时间为30天
    const expires = new Date();
    expires.setTime(expires.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30天

    // 对配置进行编码以处理特殊字符
    const encodedConfig = encodeURIComponent(configJson);

    // 设置cookie
    document.cookie = `storageConfigs=${encodedConfig}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
  } catch (error) {
    console.error('Failed to set config cookie:', error);
  }
}

// 获取cookie的函数
export function getConfigCookie(): StorageConfig[] | null {
  // 确保在客户端执行
  if (typeof document === 'undefined') {
    return null;
  }

  try {
    const name = "storageConfigs=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');

    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        const configJson = c.substring(name.length, c.length);
        return JSON.parse(configJson);
      }
    }
    return null;
  } catch (error) {
    console.error('Failed to get config cookie:', error);
    return null;
  }
}

// 更新cookie过期时间的函数（续期）
export function renewConfigCookie(): void {
  // 确保在客户端执行
  if (typeof document === 'undefined') {
    return;
  }

  try {
    // 先获取现有的配置
    const configs = getConfigCookie();
    if (configs) {
      // 重新设置cookie，更新过期时间
      setConfigCookie(configs);
    }
  } catch (error) {
    console.error('Failed to renew config cookie:', error);
  }
}

// 删除配置cookie的函数
export function removeConfigCookie(): void {
  // 确保在客户端执行
  if (typeof document === 'undefined') {
    return;
  }

  try {
    // 设置过期时间为过去，以删除cookie
    const expires = new Date(0);
    document.cookie = `storageConfigs=; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
  } catch (error) {
    console.error('Failed to remove config cookie:', error);
  }
}