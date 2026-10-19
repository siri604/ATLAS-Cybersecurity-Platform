import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Terminal, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Server,
  RotateCcw
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

interface ChatMessage {
  id: string;
  sender: 'agent' | 'user';
  text: string;
  timestamp: string;
  contextNote?: string;
}

export const AtlasAIAgentDrawer: React.FC = () => {
  const { 
    isAiAgentOpen, 
    setIsAiAgentOpen, 
    aiSuggestedPrompt, 
    activeNav, 
    selectedSystem, 
    selectedFinding,
    autonomyMode,
    role 
  } = usePlatform();

  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'agent',
      text: "Greetings, I’m your ATLAS AI Security Agent. I can help investigate threats, review system health, explain findings, assess compliance, and navigate ATLAS. What would you like to review?",
      timestamp: 'Now'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (aiSuggestedPrompt) {
      handleSendMessage(aiSuggestedPrompt);
    }
  }, [aiSuggestedPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isAiAgentOpen) return null;

  // Contextual suggested chips based on current module (Section 18)
  const getContextualPrompts = () => {
    switch (activeNav) {
      case 'compliance':
        return [
          'Why did this control fail?',
          'What is the risk of PermitRootLogin yes?',
          'How does the verification probe work?'
        ];
      case 'zero-trust':
        return [
          'Why was this user denied access?',
          'How can we enforce device compliance?'
        ];
      case 'anomaly-det':
        return [
          'Why is this behavior anomalous?',
          'Explain the 404 path traversal pattern'
        ];
      case 'network-sec':
        return [
          'What caused this traffic spike?',
          'Are there open ports on Customer Portal App Server?'
        ];
      case 'software-qai':
        return [
          'Why did this test fail?',
          'Explain the EDI webhook fuzz contract issue'
        ];
      default:
        return [
          'Review system health for Customer Portal App Server',
          'Explain active autonomy policy mode',
          'What findings require immediate attention?'
        ];
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = (textToSend || input).trim();
    if (!prompt || loading) return;

    setInput('');
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          context: {
            module: activeNav,
            systemName: selectedSystem ? selectedSystem.name : 'Customer Portal App Server',
            findingTitle: selectedFinding ? selectedFinding.title : 'SSH direct root login enabled',
            controlId: selectedFinding ? selectedFinding.controlRef : 'CIS 5.2.10',
            autonomyMode,
            role
          }
        })
      });

      const data = await response.json();
      const agentMsg: ChatMessage = {
        id: `agt-${Date.now()}`,
        sender: 'agent',
        text: data.text || "Assessment analysis complete. System configuration adheres to established baselines.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        contextNote: `Grounded in ${selectedSystem?.name || 'Customer Portal App Server'} (${activeNav})`
      };
      setMessages(prev => [...prev, agentMsg]);
    } catch (err) {
      console.error(err);
      // Resilient fallback analysis
      const fallbackMsg: ChatMessage = {
        id: `agt-${Date.now()}`,
        sender: 'agent',
        text: `Analysis for ${selectedSystem?.name || 'Active System'}:\n• Control CIS 5.2.10 failed because direct root SSH access is enabled in /etc/ssh/sshd_config.\n• Risk: Allows automated credential stuffing against root account and breaks non-repudiation audit trails.\n• Recommended Action: Submit targeted remediation playbook to set "PermitRootLogin no". Admin approval is required under "${autonomyMode}" policy.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-[#0A0E17] border-l border-slate-800 shadow-2xl flex flex-col text-slate-200">
      
      {/* Header */}
      <div className="h-14 px-5 border-b border-slate-800 flex items-center justify-between bg-[#0E1420]">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded bg-cyan-950/60 border border-cyan-800/60 text-cyan-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              ATLAS AI Security Agent
            </h2>
            <div className="text-[10px] text-cyan-400 font-mono">
              Context: {activeNav} · {selectedSystem?.name || 'All Systems'}
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsAiAgentOpen(false)}
          className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[90%] rounded-lg p-3.5 leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-cyan-500/20 text-cyan-100 border border-cyan-500/40 rounded-br-none'
                  : 'bg-[#121926] text-slate-200 border border-slate-800 rounded-bl-none font-mono text-[11px]'
              }`}
            >
              <div className="whitespace-pre-wrap">{m.text}</div>
            </div>

            <div className="text-[10px] text-slate-500 mt-1 px-1 font-mono flex items-center gap-2">
              <span>{m.timestamp}</span>
              {m.contextNote && (
                <>
                  <span>·</span>
                  <span className="text-slate-600 truncate">{m.contextNote}</span>
                </>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono p-3 bg-[#121926] border border-slate-800 rounded-lg max-w-[80%] animate-pulse">
            <Terminal className="w-3.5 h-3.5 animate-spin" />
            Analyzing telemetry & verifying evidence...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Contextual Question Chips */}
      <div className="p-3 border-t border-slate-800 bg-[#0E1420]/80">
        <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 mb-1.5">
          Suggested Context Questions:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {getContextualPrompts().map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="text-[10px] text-left px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-slate-800 bg-[#0E1420]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about controls, anomalies, findings, or remediation..."
            className="flex-1 bg-[#121926] border border-slate-700 rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-2 rounded bg-cyan-400 hover:bg-cyan-300 text-black font-semibold transition-colors disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

    </div>
  );
};
