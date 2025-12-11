import React, { useState, useEffect } from 'react';
import { Message, Role } from '../types';
import { UserIcon, BotIcon, WarningIcon } from './Icons';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === Role.USER;
  const [formattedTime, setFormattedTime] = useState<string>('');

  // 클라이언트에서만 시간 포맷팅
  useEffect(() => {
    setFormattedTime(
      message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
  }, [message.timestamp]);

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-sm ${
          isUser ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-blue-600'
        }`}>
          {isUser ? <UserIcon className="w-5 h-5 md:w-6 md:h-6" /> : <BotIcon className="w-5 h-5 md:w-6 md:h-6" />}
        </div>

        {/* Message Bubble */}
        <div className={`relative px-5 py-4 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed overflow-hidden ${
          isUser 
            ? 'bg-blue-600 text-white rounded-tr-none' 
            : message.isError 
              ? 'bg-red-50 text-red-800 border border-red-200 rounded-tl-none'
              : 'bg-white text-slate-700 border border-gray-100 rounded-tl-none'
        }`}>
          {message.isError && (
             <div className="flex items-center gap-2 font-bold mb-1">
                <WarningIcon className="w-4 h-4" />
                <span>오류 발생</span>
             </div>
          )}
          <div className="whitespace-pre-wrap break-words">
            {message.text}
          </div>
          
          {/* Timestamp */}
          {formattedTime && (
            <div className={`text-[10px] md:text-xs mt-2 text-right opacity-70 ${isUser ? 'text-blue-100' : 'text-slate-400'}`}>
              {formattedTime}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
