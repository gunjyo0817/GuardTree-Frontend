import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
const Index: React.FC = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-guardian-soft-green to-white py-24 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-guardian-green mb-6">
            守護樹
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">專為仁愛基金會打造的數位助手，支援長期個案追蹤與智慧分析</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" onClick={() => navigate("/login")} className="bg-guardian-green hover:bg-guardian-light-green">
              立即登入
            </Button>
            <Button size="lg" variant="outline" onClick={() => window.scrollTo({
            top: document.getElementById('features')?.offsetTop,
            behavior: 'smooth'
          })}>
              了解更多
            </Button>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">系統功能</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-guardian-soft-green rounded-lg p-6">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-guardian-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">表單系統</h3>
              <p className="text-gray-700">支援複雜評估表單設計與填寫，使用JSON格式靈活儲存資料</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-guardian-soft-blue rounded-lg p-6">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-guardian-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">個案管理</h3>
              <p className="text-gray-700">完整的個案資料庫，支援時間軸追蹤與歷史記錄查詢</p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-guardian-soft-purple rounded-lg p-6">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-guardian-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">智慧分析</h3>
              <p className="text-gray-700">使用AI技術分析個案資料，生成摘要報告與發展趨勢</p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-guardian-peach rounded-lg p-6">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">表單模板管理</h3>
              <p className="text-gray-700">靈活建立和管理表單模板，支援版本控制與權限設定</p>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-gray-100 rounded-lg p-6">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">人員管理</h3>
              <p className="text-gray-700">管理員與教保員角色分離，完整的權限控制與帳號管理</p>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-guardian-soft-gray rounded-lg p-6">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-guardian-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">多設備支援</h3>
              <p className="text-gray-700">響應式設計，支援電腦、平板與手機等多種設備使用</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-guardian-green py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">立即開始使用守護樹</h2>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            為您的偏鄉照護機構導入數位化管理工具，提升工作效率與服務質量
          </p>
          <Button size="lg" onClick={() => navigate("/login")} className="bg-white text-guardian-green hover:bg-gray-100">
            登入系統
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-100 py-8 px-4">
        <div className="container mx-auto text-center">
          <p className="text-gray-600">© 2025 守護樹 - 偏鄉照護數位助手</p>
        </div>
      </footer>
    </div>;
};
export default Index;