import { useState, useEffect } from 'react';
import type { StorageConfig } from '../types/storage';
import { setConfigCookie, getConfigCookie } from '../utils/cookieUtils';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigChange: (config: StorageConfig | null) => void;
  initialConfigs?: StorageConfig[];
  currentConfigId?: string;
}

export default function ConfigModal({
  isOpen,
  onClose,
  onConfigChange,
  initialConfigs = [],
  currentConfigId: externalCurrentConfigId
}: ConfigModalProps) {
  const [configs, setConfigs] = useState<StorageConfig[]>(() => {
    // 首先尝试从cookie中获取配置
    const cookieConfigs = getConfigCookie();
    if (cookieConfigs) {
      return cookieConfigs;
    }
    // 如果cookie中没有配置，则使用初始配置
    return initialConfigs;
  });

  const [currentConfigId, setCurrentConfigId] = useState<string>(() => {
    // 在客户端检查localStorage是否可用
    if (typeof window !== 'undefined') {
      // 从localStorage中获取当前配置ID（保持原有逻辑）
      return localStorage.getItem('currentConfigId') || externalCurrentConfigId || '';
    }
    return externalCurrentConfigId || '';
  });
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Omit<StorageConfig, 'id'> & { id?: string }>({
    name: '',
    type: 'oss', // 只支持OSS类型
    accessType: 'private',
    accessKey: '',
    secretKey: '',
    bucket: '',
    region: ''
  });

  // 当 configs 或 currentConfigId 改变时，通知父组件
  useEffect(() => {
    const config = configs.find(c => c.id === currentConfigId) || null;
    onConfigChange(config);
  }, [configs, currentConfigId, onConfigChange]);

  // 当 configs 改变时，如果只有一个配置，则自动选择它
  useEffect(() => {
    if (configs.length === 1 && currentConfigId !== configs[0].id) {
      setCurrentConfigId(configs[0].id);
    }
  }, [configs, currentConfigId]);

  const handleSaveConfig = () => {
    if (!formData.name || !formData.bucket || !formData.region) {
      alert('请填写所有必填字段');
      return;
    }

    // 对于私有存储桶，需要填写 AK/SK
    if (formData.accessType === 'private' && (!formData.accessKey || !formData.secretKey)) {
      alert('私有存储桶需要填写 AccessKey 和 SecretKey');
      return;
    }

    const newConfig: StorageConfig = {
      id: formData.id || Date.now().toString(),
      name: formData.name,
      type: formData.type,
      accessType: formData.accessType,
      accessKey: formData.accessKey,
      secretKey: formData.secretKey,
      bucket: formData.bucket,
      region: formData.region
    };

    let updatedConfigs;
    if (isEditing && formData.id) {
      // 更新现有配置
      updatedConfigs = configs.map(config =>
        config.id === formData.id ? newConfig : config
      );
    } else {
      // 添加新配置
      updatedConfigs = [...configs, newConfig];
    }

    setConfigs(updatedConfigs);

    // 同时保存到cookie中
    setConfigCookie(updatedConfigs);

    // 如果这是唯一的配置或者没有当前配置，则设为当前配置
    if (updatedConfigs.length === 1 || !currentConfigId) {
      setCurrentConfigId(newConfig.id);
    }

    // 重置表单
    setFormData({
      name: '',
      type: 'oss', // 只支持OSS类型
      accessType: 'private',
      accessKey: '',
      secretKey: '',
      bucket: '',
      region: ''
    });
    setShowForm(false);
    setIsEditing(false);
  };

  const handleEditConfig = (config: StorageConfig) => {
    setFormData({
      id: config.id,
      name: config.name,
      type: config.type,
      accessType: config.accessType,
      accessKey: config.accessKey,
      secretKey: config.secretKey,
      bucket: config.bucket,
      region: config.region
    });
    setShowForm(true);
    setIsEditing(true);
  };

  const handleDeleteConfig = (id: string) => {
    if (configs.length <= 1) {
      alert('至少需要保留一个配置');
      return;
    }

    const updatedConfigs = configs.filter(config => config.id !== id);
    setConfigs(updatedConfigs);

    // 同时更新cookie
    setConfigCookie(updatedConfigs);

    // 如果删除的是当前配置，则切换到第一个配置
    if (id === currentConfigId) {
      const newCurrentConfig = updatedConfigs[0];
      setCurrentConfigId(newCurrentConfig.id);
    }
  };

  const handleAddNew = () => {
    setFormData({
      name: '',
      type: 'oss', // 只支持OSS类型
      accessType: 'private',
      accessKey: '',
      secretKey: '',
      bucket: '',
      region: ''
    });
    setShowForm(true);
    setIsEditing(false);
  };

  // 如果模态框未打开，不渲染任何内容
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* 头部 */}
        <div className="flex justify-between items-center border-b border-neutral-200 p-4">
          <h2 className="text-xl font-bold text-neutral-800">存储配置管理</h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-auto p-4">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">配置列表</h3>
              <button
                onClick={handleAddNew}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                添加配置
              </button>
            </div>

            {configs.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">选择配置:</label>
                <select
                  value={currentConfigId}
                  onChange={(e) => setCurrentConfigId(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {configs.map(config => (
                    <option key={config.id} value={config.id}>
                      {config.name} ({config.type.toUpperCase()}) - {config.accessType === 'public' ? '公有读' : '私有'}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {showForm && (
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="text-lg font-semibold mb-3">
                  {isEditing ? '编辑配置' : '新增配置'}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">配置名称 *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="例如：我的阿里云存储"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">存储类型 *</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value as 'oss'})}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled // 只支持OSS类型，所以禁用选择
                    >
                      <option value="oss">阿里云 OSS</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">访问类型 *</label>
                    <select
                      value={formData.accessType}
                      onChange={(e) => setFormData({...formData, accessType: e.target.value as 'private' | 'public'})}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="private">私有（需要 AK/SK）</option>
                      <option value="public">公有读</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">存储桶名称 (Bucket) *</label>
                    <input
                      type="text"
                      value={formData.bucket}
                      onChange={(e) => setFormData({...formData, bucket: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="例如：my-bucket-name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">地域 (Region) *</label>
                    <input
                      type="text"
                      value={formData.region}
                      onChange={(e) => setFormData({...formData, region: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="例如：oss-cn-hangzhou"
                    />
                  </div>

                  {formData.accessType === 'private' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-1">AccessKey *</label>
                        <input
                          type="password"
                          value={formData.accessKey}
                          onChange={(e) => setFormData({...formData, accessKey: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="请输入 AccessKey"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">SecretKey *</label>
                        <input
                          type="password"
                          value={formData.secretKey}
                          onChange={(e) => setFormData({...formData, secretKey: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="请输入 SecretKey"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveConfig}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    保存配置
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    取消
                  </button>
                </div>
              </div>
            )}

            {configs.length > 0 && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">名称</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">类型</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">访问类型</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">存储桶</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">地域</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {configs.map(config => (
                      <tr key={config.id}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                          {config.name}
                          {config.id === currentConfigId && (
                            <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              当前
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 uppercase">
                          {config.type}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                          {config.accessType === 'public' ? '公有读' : '私有'}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                          {config.bucket}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                          {config.region}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEditConfig(config)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => handleDeleteConfig(config.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            删除
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {configs.length === 0 && !showForm && (
              <div className="text-center py-8 text-gray-500">
                <p>暂无配置，请添加第一个存储配置</p>
              </div>
            )}
          </div>
        </div>

        {/* 底部操作按钮 */}
        <div className="border-t border-neutral-200 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-neutral-500 hover:bg-neutral-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}