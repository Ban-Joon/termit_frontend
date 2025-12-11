'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Message, Role, SUGGESTED_QUESTIONS } from './types';
import { sendMessageToGemini, resetChatSession } from './services/geminiService';
import ChatMessage from './components/ChatMessage';
import InputArea from './components/InputArea';
import { LightBulbIcon, InfoIcon } from './components/Icons';

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 클라이언트에서만 초기 메시지 설정
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        role: Role.MODEL,
        text: "안녕하세요! 도시정비 관련 궁금증을 시원하게 해결해 드리는 '도시정비 해결사'입니다. \n재개발, 재건축 절차나 복잡한 법령에 대해 궁금한 점이 있으시면 편하게 물어보세요.",
        timestamp: new Date(),
      }
    ]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      text: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(text);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.MODEL,
        text: responseText,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.MODEL,
        text: "죄송합니다. 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        timestamp: new Date(),
        isError: true
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("대화 내용을 초기화하시겠습니까?")) {
      resetChatSession();
      setMessages([{
        id: Date.now().toString(),
        role: Role.MODEL,
        text: "대화가 초기화되었습니다. 새로운 궁금증이 있다면 언제든 물어봐 주세요!",
        timestamp: new Date(),
      }]);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-50">
      {/* Header */}
      <header className="flex-shrink-0 bg-white border-b border-slate-200 shadow-sm z-20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
               <LightBulbIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 leading-none">도시정비 해결사</h1>
              <p className="text-xs text-slate-500 mt-1">궁금한 재개발·재건축의 모든 것</p>
            </div>
          </div>
          <button 
            onClick={handleReset}
            className="text-xs font-medium text-slate-500 hover:text-blue-600 hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors"
          >
            대화 초기화
          </button>
        </div>
      </header>

      {/* Main Chat Area */}
      <main 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth"
      >
        <div className="max-w-3xl mx-auto">
            {/* Disclaimer Banner */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8 flex gap-3 text-sm text-blue-800">
                <InfoIcon className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-600" />
                <div>
                    <span className="font-semibold block mb-1">이용 안내</span>
                    본 서비스는 '도시 및 주거환경정비법'에 대한 일반적인 정보를 제공합니다. 
                    AI의 답변은 법적 자문이 아니며, 구체적인 분쟁 해결을 위해서는 반드시 법률 전문가의 조력을 받으시기 바랍니다.
                </div>
            </div>

            {/* Messages */}
            {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
            ))}

            {/* Loading Indicator */}
            {isLoading && (
                <div className="flex justify-start mb-6">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                             <LightBulbIcon className="w-5 h-5 text-blue-600 animate-pulse" />
                        </div>
                        <div className="bg-white border border-gray-100 px-5 py-4 rounded-2xl rounded-tl-none shadow-sm">
                            <div className="flex space-x-2">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                     </div>
                </div>
            )}
            
            <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Suggested Chips (Only visible when few messages or user might need help) */}
      {!isLoading && messages.length < 5 && (
        <div className="bg-slate-50 border-t border-slate-100 py-2">
           <div className="max-w-4xl mx-auto px-4 overflow-x-auto no-scrollbar">
              <div className="flex gap-2 whitespace-nowrap">
                {SUGGESTED_QUESTIONS.map((q, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleSendMessage(q)}
                        className="text-sm bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-300 px-4 py-2 rounded-full shadow-sm transition-colors"
                    >
                        {q}
                    </button>
                ))}
              </div>
           </div>
        </div>
      )}

      {/* Input Area */}
      <InputArea onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}
