import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Video, FileText, TrendingUp, DollarSign, PiggyBank, CreditCard, Target, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const articles = [
  {
    id: 1,
    title: 'Understanding the 50/30/20 Budget Rule',
    category: 'Budgeting',
    icon: '💰',
    readTime: '5 min',
    content: 'The 50/30/20 rule is a simple budgeting framework: 50% of income for needs, 30% for wants, and 20% for savings and debt repayment.',
  },
  {
    id: 2,
    title: 'Building Your Emergency Fund',
    category: 'Savings',
    icon: '🏦',
    readTime: '7 min',
    content: 'An emergency fund should cover 3-6 months of expenses. Start small and automate your savings to build this crucial financial cushion.',
  },
  {
    id: 3,
    title: 'Debt Snowball vs Avalanche Method',
    category: 'Debt',
    icon: '💳',
    readTime: '6 min',
    content: 'Snowball focuses on smallest debts first for motivation, while Avalanche targets highest interest rates to save money.',
  },
  {
    id: 4,
    title: 'Introduction to Index Funds',
    category: 'Investing',
    icon: '📈',
    readTime: '8 min',
    content: 'Index funds offer diversified, low-cost investing by tracking market indices. Perfect for long-term wealth building.',
  },
  {
    id: 5,
    title: 'Tax-Saving Investments in India',
    category: 'Tax',
    icon: '📋',
    readTime: '10 min',
    content: 'Section 80C allows deductions up to ₹1.5 lakh through ELSS, PPF, EPF, and more. Plan early to maximize savings.',
  },
  {
    id: 6,
    title: 'Understanding Credit Scores',
    category: 'Credit',
    icon: '⭐',
    readTime: '6 min',
    content: 'Credit scores range from 300-900. Pay on time, keep utilization low, and maintain old accounts for a healthy score.',
  },
];

const faqs = [
  {
    question: 'How much should I save each month?',
    answer: 'Aim to save at least 20% of your income. Start with what you can afford and gradually increase. The key is consistency.',
  },
  {
    question: 'When should I start investing?',
    answer: 'Start as early as possible! Even small amounts benefit from compound interest. Begin after building a basic emergency fund.',
  },
  {
    question: 'What is a good credit score?',
    answer: 'In India, 750+ is considered excellent. 700-749 is good, 650-699 is fair, and below 650 needs improvement.',
  },
  {
    question: 'How do I create a budget?',
    answer: 'Track all income and expenses for a month, categorize them, set limits for each category, and review regularly.',
  },
  {
    question: 'Should I pay off debt or invest?',
    answer: 'Pay off high-interest debt (>10%) first. For lower rates, you can balance both. Always maintain an emergency fund.',
  },
  {
    question: 'What is the best investment for beginners?',
    answer: 'Index funds and mutual funds are great for beginners. They offer diversification and professional management at low costs.',
  },
];

const tips = [
  { icon: '💡', tip: 'Automate your savings to pay yourself first before spending on anything else.' },
  { icon: '🎯', tip: 'Set specific financial goals with deadlines to stay motivated and focused.' },
  { icon: '📊', tip: 'Review your budget weekly to catch overspending early and adjust as needed.' },
  { icon: '🔄', tip: 'Rebalance your investment portfolio annually to maintain your target allocation.' },
  { icon: '💳', tip: 'Use credit cards responsibly - pay full balance monthly to avoid interest charges.' },
  { icon: '📱', tip: 'Unsubscribe from marketing emails to reduce impulse buying temptations.' },
  { icon: '🏪', tip: 'Wait 24 hours before making non-essential purchases over ₹1000.' },
  { icon: '📈', tip: 'Invest in yourself through courses and skills that can increase your income.' },
];

export function EducationPage() {
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-green-500 via-teal-500 to-blue-500 rounded-2xl p-8 text-white shadow-xl"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Financial Education</h1>
            <p className="text-white/90 mt-1">
              Learn and grow your financial knowledge
            </p>
          </div>
        </div>
      </motion.div>

      {/* Daily Tip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <div className="flex items-center gap-3">
            <div className="text-4xl">💡</div>
            <div>
              <h3 className="font-bold text-lg">Tip of the Day</h3>
              <p className="text-gray-700">{tips[new Date().getDate() % tips.length].tip}</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6">
          <Tabs defaultValue="articles">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="articles">Articles</TabsTrigger>
              <TabsTrigger value="tips">Quick Tips</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>

            {/* Articles Tab */}
            <TabsContent value="articles" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {articles.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
                      <div className="text-4xl mb-3">{article.icon}</div>
                      <div className="mb-2">
                        <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">
                          {article.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold mb-2">{article.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{article.content}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{article.readTime} read</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Tips Tab */}
            <TabsContent value="tips" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tips.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Card className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">{item.icon}</div>
                        <p className="text-gray-700">{item.tip}</p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* FAQ Tab */}
            <TabsContent value="faq" className="mt-6">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-gray-600">{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          </Tabs>
        </Card>
      </motion.div>

      {/* Learning Resources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold mb-4">Learning Paths</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <PiggyBank className="w-10 h-10 text-blue-600 mb-3" />
            <h3 className="text-lg font-bold mb-2">Beginner</h3>
            <p className="text-sm text-gray-600 mb-4">
              Learn the basics of budgeting, saving, and financial planning.
            </p>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• Creating your first budget</li>
              <li>• Building emergency fund</li>
              <li>• Understanding expenses</li>
            </ul>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <TrendingUp className="w-10 h-10 text-purple-600 mb-3" />
            <h3 className="text-lg font-bold mb-2">Intermediate</h3>
            <p className="text-sm text-gray-600 mb-4">
              Dive into investing, debt management, and tax optimization.
            </p>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• Investment basics</li>
              <li>• Debt payoff strategies</li>
              <li>• Tax-saving options</li>
            </ul>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <Target className="w-10 h-10 text-orange-600 mb-3" />
            <h3 className="text-lg font-bold mb-2">Advanced</h3>
            <p className="text-sm text-gray-600 mb-4">
              Master portfolio management, real estate, and wealth building.
            </p>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• Portfolio diversification</li>
              <li>• Real estate investing</li>
              <li>• Retirement planning</li>
            </ul>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
