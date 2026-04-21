'use client';

import React, { useState, useEffect } from 'react';
import HealthDiary from '@/components/HealthDiary';
import { Card, CardContent } from '@/components/ui/card';

export default function HealthDiaryPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // 检查本地是否已登录
  useEffect(() => {
    const stored = localStorage.getItem('health-diary-user');
    if (stored) {
      const user = JSON.parse(stored);
      setUserId(user.id);
      setUsername(user.username);
    }
    setLoading(false);
  }, []);

  const handleAuth = () => {
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('用户名和密码不能为空');
      return;
    }

    if (isLogin) {
      // 登录
      const users = JSON.parse(localStorage.getItem('health-diary-users') || '{}');
      if (users[username] && users[username].password === password) {
        const user = users[username];
        localStorage.setItem('health-diary-user', JSON.stringify(user));
        setUserId(user.id);
        setUsername(user.username);
        setPassword('');
      } else {
        setError('用户名或密码错误');
      }
    } else {
      // 注册
      const users = JSON.parse(localStorage.getItem('health-diary-users') || '{}');
      if (users[username]) {
        setError('用户名已存在');
        return;
      }
      const newUser = {
        id: Date.now().toString(),
        username,
        password, // 仅用于演示，生产环境应使用加密
      };
      users[username] = newUser;
      localStorage.setItem('health-diary-users', JSON.stringify(users));
      localStorage.setItem('health-diary-user', JSON.stringify(newUser));
      setUserId(newUser.id);
      setPassword('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('health-diary-user');
    setUserId(null);
    setUsername('');
    setPassword('');
    setError('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">加载中...</div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="pt-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">📔 健康日记</h1>
              <p className="text-gray-600">记录您的健康生活每一天</p>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="用户名"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="密码"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
              />

              {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

              <button
                onClick={handleAuth}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                {isLogin ? '登录' : '注册'}
              </button>

              <div className="text-center">
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                    setPassword('');
                  }}
                  className="text-sm text-gray-600 hover:text-green-600 transition-colors"
                >
                  {isLogin ? '没有账号？点击注册' : '已有账号？点击登录'}
                </button>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-gray-600">
                <p className="font-semibold text-gray-800 mb-2">💡 演示账号：</p>
                <p>用户名: demo</p>
                <p>密码: demo123</p>
                <p className="mt-2 text-xs text-gray-500">或直接注册新账号</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {/* 导航栏 */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">📔 健康日记</h1>
            <p className="text-green-100">欢迎, {username}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-white text-green-600 hover:bg-gray-100 font-bold py-2 px-4 rounded-lg transition-colors"
          >
            登出
          </button>
        </div>
      </div>

      {/* 主内容 */}
      <HealthDiary userId={userId} />
    </div>
  );
}
