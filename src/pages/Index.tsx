import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

interface Message {
  id: number;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface Chat {
  id: number;
  title: string;
  messages: Message[];
  lastMessage: Date;
}

const Index = () => {
  const [chats, setChats] = useState<Chat[]>([
    {
      id: 1,
      title: "Новый чат",
      messages: [
        { id: 1, content: "Привет! Как дела?", isUser: true, timestamp: new Date() },
        { id: 2, content: "Привет! Всё отлично, спасибо за вопрос. Как дела у тебя? Чем могу помочь?", isUser: false, timestamp: new Date() }
      ],
      lastMessage: new Date()
    },
    {
      id: 2,
      title: "Разработка сайта",
      messages: [
        { id: 3, content: "Помоги создать сайт", isUser: true, timestamp: new Date() }
      ],
      lastMessage: new Date()
    },
    {
      id: 3,
      title: "Изучение React",
      messages: [
        { id: 4, content: "Объясни хуки в React", isUser: true, timestamp: new Date() }
      ],
      lastMessage: new Date()
    }
  ]);

  const [currentChatId, setCurrentChatId] = useState(1);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const currentChat = chats.find(chat => chat.id === currentChatId);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setChats(prev => prev.map(chat => 
      chat.id === currentChatId 
        ? { ...chat, messages: [...chat.messages, newMessage], lastMessage: new Date() }
        : chat
    ));

    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        content: "Это ответ от ИИ помощника. Я готов помочь вам с любыми вопросами!",
        isUser: false,
        timestamp: new Date()
      };

      setChats(prev => prev.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, messages: [...chat.messages, aiResponse], lastMessage: new Date() }
          : chat
      ));
      setIsTyping(false);
    }, 1500);
  };

  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now(),
      title: "Новый чат",
      messages: [],
      lastMessage: new Date()
    };
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
  };

  return (
    <div className="h-screen bg-[#343541] flex">
      {/* Боковая панель */}
      <div className="w-64 bg-[#202123] flex flex-col">
        {/* Кнопка нового чата */}
        <div className="p-4">
          <Button 
            onClick={handleNewChat}
            className="w-full bg-transparent border border-[#4d4d4f] text-white hover:bg-[#2a2b32] flex items-center gap-2 justify-start"
          >
            <Icon name="Plus" size={16} />
            Новый чат
          </Button>
        </div>

        {/* История чатов */}
        <ScrollArea className="flex-1 px-2">
          <div className="space-y-1">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 group hover:bg-[#2a2b32] cursor-pointer ${
                  currentChatId === chat.id ? 'bg-[#2a2b32]' : ''
                }`}
                onClick={() => setCurrentChatId(chat.id)}
              >
                <Icon name="MessageCircle" size={16} className="text-gray-400" />
                <span className="text-gray-300 truncate flex-1">{chat.title}</span>
                <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                  <button 
                    className="p-1 hover:bg-[#4d4d4f] rounded"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Icon name="Edit" size={12} className="text-gray-400" />
                  </button>
                  <button 
                    className="p-1 hover:bg-[#4d4d4f] rounded"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Icon name="Trash2" size={12} className="text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Пользователь */}
        <div className="p-4 border-t border-[#4d4d4f]">
          <div className="flex items-center gap-2 text-gray-300">
            <div className="w-8 h-8 bg-[#10a37f] rounded-full flex items-center justify-center">
              <Icon name="User" size={16} className="text-white" />
            </div>
            <span className="text-sm">Пользователь</span>
          </div>
        </div>
      </div>

      {/* Основная область */}
      <div className="flex-1 flex flex-col">
        {/* Область сообщений */}
        <ScrollArea className="flex-1 px-4">
          <div className="max-w-3xl mx-auto py-6">
            {currentChat?.messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 p-4 ${
                  message.isUser ? 'bg-[#343541]' : 'bg-[#444654]'
                }`}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                  {message.isUser ? (
                    <div className="w-8 h-8 bg-[#10a37f] rounded-full flex items-center justify-center">
                      <Icon name="User" size={16} className="text-white" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-[#19c37d] rounded-full flex items-center justify-center">
                      <Icon name="Bot" size={16} className="text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 text-white leading-7">
                  {message.content}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-4 p-4 bg-[#444654]">
                <div className="w-8 h-8 bg-[#19c37d] rounded-full flex items-center justify-center">
                  <Icon name="Bot" size={16} className="text-white" />
                </div>
                <div className="flex-1 text-white">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Панель ввода */}
        <div className="p-4 bg-[#343541]">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-2 bg-[#40414f] rounded-lg p-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Отправить сообщение..."
                className="flex-1 border-none bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-0"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="bg-[#10a37f] hover:bg-[#0d8f69] text-white p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon name="Send" size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;