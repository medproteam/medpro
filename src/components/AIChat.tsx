import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Send, Bot, User, Sparkles } from 'lucide-react';
import { useAccount } from 'wagmi';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function AIChat() {
  const { isConnected } = useAccount();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your MEDPRO AI assistant. I can help you with medication reminders, interpret test results, and answer health-related questions. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || !isConnected) {
      if (!isConnected) {
        toast.error('Please connect your wallet to use AI chat');
      }
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response (in production, this would call Lovable AI or your AI service)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAIResponse(input),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const generateAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('medication') || lowerQuery.includes('pill') || lowerQuery.includes('medicine')) {
      return "I can help you track your medications! To set up reminders, tell me: 1) Medication name, 2) Dosage, 3) Frequency (e.g., twice daily), and 4) Time(s) to take it. Your medication schedule will be securely stored on the blockchain.";
    }
    
    if (lowerQuery.includes('test') || lowerQuery.includes('result') || lowerQuery.includes('lab')) {
      return "I can help interpret your test results. Please share your test results (blood work, imaging, etc.), and I'll provide a clear explanation of what the values mean and any recommendations. Remember, this doesn't replace professional medical advice.";
    }
    
    if (lowerQuery.includes('symptom') || lowerQuery.includes('pain') || lowerQuery.includes('sick')) {
      return "I understand you're experiencing symptoms. While I can provide general health information, it's important to consult with a healthcare professional for proper diagnosis. However, I can help you track your symptoms over time. Would you like to log your symptoms?";
    }
    
    if (lowerQuery.includes('reminder') || lowerQuery.includes('schedule') || lowerQuery.includes('appointment')) {
      return "I can set up smart reminders for you! You'll receive SMS notifications and app alerts for: medications, appointments, health checkups, and daily health activities. What would you like me to remind you about?";
    }
    
    return "I'm here to help with your health management! I can assist with: ✓ Medication tracking & reminders ✓ Test result interpretation ✓ Health activity logging ✓ Symptom tracking ✓ Appointment reminders. What would you like to do?";
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-muted/20 to-background" />
      
      <div className="container relative z-10 px-4 mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 backdrop-blur-sm mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">AI-Powered Chat</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Chat with Your AI Health Assistant
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Get instant answers to your health questions, 24/7
          </p>
        </motion.div>

        <Card className="border-border/50 shadow-2xl shadow-primary/5 bg-card/80 backdrop-blur-sm overflow-hidden">
          <div className="h-[500px] flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <AnimatePresence mode="popLayout">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-primary to-secondary text-white'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <span className="text-xs opacity-70 mt-2 block">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {message.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-medical-green flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-muted p-4 rounded-2xl">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-border/50 p-4 bg-muted/30">
              <div className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={isConnected ? "Ask me anything about your health..." : "Connect wallet to start chatting..."}
                  disabled={!isConnected}
                  className="resize-none min-h-[60px] bg-background"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading || !isConnected}
                  className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/30"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
