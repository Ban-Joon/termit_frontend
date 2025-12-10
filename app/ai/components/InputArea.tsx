import React, { useState, useRef, useEffect } from 'react';
import { SendIcon } from './Icons';

interface InputAreaProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    onSendMessage(input.trim());
    setInput('');
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  return (
    <div className="border-t border-slate-200 bg-white/90 backdrop-blur-md p-4 pb-6 md:pb-6 sticky bottom-0 z-10">
      <div className="max-w-4xl mx-auto relative">
        <form onSubmit={handleSubmit} className="relative flex items-end gap-2 p-2 bg-slate-50 border border-slate-300 rounded-3xl shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="도시정비법에 대해 궁금한 점을 물어보세요..."
              className="w-full bg-transparent border-none text-slate-800 placeholder-slate-400 resize-none focus:ring-0 max-h-32 py-3 px-4 rounded-xl outline-none"
              rows={1}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`p-3 rounded-full flex-shrink-0 transition-all duration-200 ${
                !input.trim() || isLoading
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md transform hover:scale-105 active:scale-95'
              }`}
            >
              <SendIcon className="w-5 h-5" />
            </button>
        </form>
        <p className="text-center text-xs text-slate-400 mt-3">
          AI는 실수를 할 수 있으며, 본 답변은 법적 효력이 없습니다.
        </p>
      </div>
    </div>
  );
};

export default InputArea;
