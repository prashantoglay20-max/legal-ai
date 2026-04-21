'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const FOOD_DATABASE: Record<string, number> = {
  '鸡胸肉': 165, '鸡蛋': 155, '牛奶': 61, '面条': 138, '米饭': 130,
  '面包': 265, '苹果': 52, '香蕉': 89, '橙子': 47, '葡萄': 67,
  '草莓': 32, '西瓜': 30, '西兰花': 34, '胡萝卜': 41, '番茄': 18,
  '黄瓜': 16, '洋葱': 40, '生菜': 15, '土豆': 77, '红薯': 86,
  '豆腐': 76, '鱼': 206, '猪肉': 242, '牛肉': 250, '羊肉': 203,
  '大豆': 446, '花生': 567, '坚果': 600, '黄油': 717, '油': 884,
  '蜂蜜': 304, '糖': 387, '盐': 0, '咖啡': 0, '茶': 0,
  '牛奶咖啡': 120, '果汁': 43, '可乐': 42, '啤酒': 43, '红酒': 82,
  '豆浆': 54, '酸奶': 100, '奶酪': 402, '黑巧克力': 539, '牛奶巧克力': 535,
  '饼干': 430, '薯片': 536, '爆米花': 386, '披萨': 285, '汉堡': 354,
  '炸鸡': 320, '麻辣烫': 150, '火锅': 200,
};

interface FoodItem {
  name: string;
  calories: number;
}

interface DailyData {
  meals: {
    breakfast: FoodItem[];
    lunch: FoodItem[];
    dinner: FoodItem[];
  };
  exercises: FoodItem[];
  weight: number | null;
}

export default function HealthDiary({ userId }: { userId: string }) {
  const [currentMeal, setCurrentMeal] = useState<'breakfast' | 'lunch' | 'dinner'>('breakfast');
  const [data, setData] = useState<DailyData>({
    meals: { breakfast: [], lunch: [], dinner: [] },
    exercises: [],
    weight: null,
  });
  const [foodName, setFoodName] = useState('');
  const [foodCalories, setFoodCalories] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseCalories, setExerciseCalories] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);

  const storageKey = `health-diary-${userId}`;

  // 加载数据
  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      setData(JSON.parse(stored));
    }
  }, [storageKey]);

  // 保存数据
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(data));
  }, [data, storageKey]);

  // 食物建议
  const handleFoodNameChange = (value: string) => {
    setFoodName(value);
    if (value.trim().length > 0) {
      const matches = Object.keys(FOOD_DATABASE).filter(food =>
        food.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  // 选择食物建议
  const selectFood = (food: string) => {
    setFoodName(food);
    setFoodCalories(String(FOOD_DATABASE[food]));
    setSuggestions([]);
  };

  // 添加食物
  const addFood = () => {
    if (!foodName || !foodCalories) return;
    const newMeals = { ...data.meals };
    newMeals[currentMeal].push({
      name: foodName,
      calories: parseInt(foodCalories),
    });
    setData({ ...data, meals: newMeals });
    setFoodName('');
    setFoodCalories('');
  };

  // 添加运动
  const addExercise = () => {
    if (!exerciseName || !exerciseCalories) return;
    setData({
      ...data,
      exercises: [
        ...data.exercises,
        { name: exerciseName, calories: parseInt(exerciseCalories) },
      ],
    });
    setExerciseName('');
    setExerciseCalories('');
  };

  // 记录体重
  const addWeight = () => {
    if (!weight) return;
    const w = parseFloat(weight);
    setData({ ...data, weight: w });
    const height = 1.75;
    const bmiValue = w / (height * height);
    setBmi(parseFloat(bmiValue.toFixed(1)));
  };

  // 删除食物
  const deleteFood = (meal: 'breakfast' | 'lunch' | 'dinner', index: number) => {
    const newMeals = { ...data.meals };
    newMeals[meal].splice(index, 1);
    setData({ ...data, meals: newMeals });
  };

  // 删除运动
  const deleteExercise = (index: number) => {
    const exercises = data.exercises.filter((_, i) => i !== index);
    setData({ ...data, exercises });
  };

  // 计算卡路里合计
  const calculateMealTotal = (meal: 'breakfast' | 'lunch' | 'dinner') => {
    return data.meals[meal].reduce((sum, item) => sum + item.calories, 0);
  };

  const dailyTotal = calculateMealTotal('breakfast') + calculateMealTotal('lunch') + calculateMealTotal('dinner');

  const mealLabels = { breakfast: '早餐', lunch: '中餐', dinner: '晚餐' };
  const mealEmojis = { breakfast: '🌅', lunch: '🌞', dinner: '🌙' };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📔 每日健康日记</h1>
          <p className="text-gray-600">记录每日饮食、运动和体重</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 饮食记录 */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
                <CardTitle className="text-xl">🍽️ 饮食记录</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {/* 餐次标签 */}
                <div className="flex gap-2 mb-4">
                  {(['breakfast', 'lunch', 'dinner'] as const).map(meal => (
                    <button
                      key={meal}
                      onClick={() => setCurrentMeal(meal)}
                      className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-all ${
                        currentMeal === meal
                          ? 'bg-green-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {mealEmojis[meal]} {mealLabels[meal]}
                    </button>
                  ))}
                </div>

                {/* 食物输入 */}
                <div className="space-y-3 mb-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={foodName}
                      onChange={(e) => handleFoodNameChange(e.target.value)}
                      placeholder="食物名称（如：鸡胸肉）"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    {suggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10">
                        {suggestions.map(food => (
                          <div
                            key={food}
                            onClick={() => selectFood(food)}
                            className="px-4 py-2 hover:bg-green-100 cursor-pointer border-b last:border-b-0"
                          >
                            {food} ({FOOD_DATABASE[food]} kcal)
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <input
                    type="number"
                    value={foodCalories}
                    onChange={(e) => setFoodCalories(e.target.value)}
                    placeholder="热量 (kcal)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    onClick={addFood}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    添加 {mealLabels[currentMeal]}
                  </button>
                </div>

                {/* 食物列表 */}
                <div className="space-y-4">
                  {(['breakfast', 'lunch', 'dinner'] as const).map(meal => (
                    <div key={meal} className={currentMeal === meal ? 'block' : 'hidden'}>
                      <ul className="space-y-2">
                        {data.meals[meal].map((item, idx) => (
                          <li
                            key={idx}
                            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <span className="font-medium">{item.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-green-600 font-semibold">{item.calories} kcal</span>
                              <button
                                onClick={() => deleteFood(meal, idx)}
                                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm transition-colors"
                              >
                                删除
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                      {data.meals[meal].length === 0 && (
                        <p className="text-gray-400 text-center py-4">暂无{mealLabels[meal]}记录</p>
                      )}
                      <div className="mt-3 p-3 bg-green-100 rounded-lg">
                        <p className="font-semibold text-green-700">
                          {mealLabels[meal]}合计: {calculateMealTotal(meal)} kcal
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 每日总计 */}
                <div className="mt-4 p-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg">
                  <p className="text-lg font-bold">📊 每日饮食合计: {dailyTotal} kcal</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右侧栏 */}
          <div className="space-y-6">
            {/* 运动记录 */}
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
                <CardTitle>🏃 运动记录</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <input
                    type="text"
                    value={exerciseName}
                    onChange={(e) => setExerciseName(e.target.value)}
                    placeholder="运动项目"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <input
                    type="number"
                    value={exerciseCalories}
                    onChange={(e) => setExerciseCalories(e.target.value)}
                    placeholder="消耗热量"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    onClick={addExercise}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    添加运动
                  </button>
                </div>

                <ul className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                  {data.exercises.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-sm font-medium">{item.name}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-orange-600 font-semibold text-sm">{item.calories} kcal</span>
                        <button
                          onClick={() => deleteExercise(idx)}
                          className="bg-red-500 hover:bg-red-600 text-white px-1.5 py-0.5 rounded text-xs transition-colors"
                        >
                          删除
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                {data.exercises.length === 0 && (
                  <p className="text-gray-400 text-center py-4 text-sm">暂无运动记录</p>
                )}
                <div className="mt-3 p-3 bg-orange-100 rounded-lg">
                  <p className="font-semibold text-orange-700 text-sm">
                    消耗热量: {data.exercises.reduce((sum, item) => sum + item.calories, 0)} kcal
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 体重记录 */}
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
                <CardTitle>⚖️ 体重记录</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="今日体重 (kg)"
                    step="0.1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={addWeight}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    记录体重
                  </button>
                </div>

                {data.weight && (
                  <div className="mt-4 space-y-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <p className="font-semibold text-blue-700">
                        当前体重: {data.weight} kg
                      </p>
                    </div>
                    {bmi && (
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <p className="font-semibold text-purple-700">
                          BMI: {bmi}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
