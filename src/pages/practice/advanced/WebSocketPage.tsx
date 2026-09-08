import { useState, useEffect, useRef, useCallback } from 'react';
import { Wifi, WifiOff, Send, RefreshCw, Activity } from 'lucide-react';
import PageLayout from '../../../components/layout/PageLayout';

interface Message { id: string; type: 'system' | 'chat' | 'notification' | 'counter'; content: string; ts: number; from?: string; }

// Simulated WebSocket using a local event-based system (no real WS needed for client-only demo)
// In the full app this connects to ws://localhost:4000/ws
function useSimulatedWS(enabled: boolean) {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [counter, setCounter] = useState(0);
  const [notifications, setNotifications] = useState(0);
  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([]);

  const addMessage = useCallback((msg: Omit<Message, 'id' | 'ts'>) => {
    setMessages((prev) => [{ ...msg, id: `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`, ts: Date.now() }, ...prev].slice(0, 50));
  }, []);

  useEffect(() => {
    if (!enabled) { setConnected(false); intervalsRef.current.forEach(clearInterval); return; }

    const connectTimer = setTimeout(() => {
      setConnected(true);
      addMessage({ type: 'system', content: 'Connected to live feed' });
      console.log('[ClickAndVerify] WebSocket (simulated) connected');

      // Counter ticker
      const counterInt = setInterval(() => {
        setCounter((c) => { const next = c + Math.floor(Math.random() * 3) + 1; return next; });
      }, 1000);

      // Random chat messages
      const users = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve'];
      const msgs = ['Just deployed the fix!', 'Tests are passing ✓', 'Found a flaky test', 'CI pipeline complete', 'New PR is up for review', 'Regression suite done'];
      const chatInt = setInterval(() => {
        const user = users[Math.floor(Math.random() * users.length)];
        addMessage({ type: 'chat', content: msgs[Math.floor(Math.random() * msgs.length)], from: user });
      }, 2500);

      // Random notifications
      const notifMessages = ['Build #42 passed', 'Deployment to staging complete', 'Test coverage dropped below 80%', 'New issue assigned to you', 'Security scan complete'];
      const notifInt = setInterval(() => {
        setNotifications((n) => n + 1);
        addMessage({ type: 'notification', content: notifMessages[Math.floor(Math.random() * notifMessages.length)] });
      }, 5000);

      intervalsRef.current = [counterInt, chatInt, notifInt];
    }, 800);

    return () => {
      clearTimeout(connectTimer);
      intervalsRef.current.forEach(clearInterval);
      setConnected(false);
    };
  }, [enabled, addMessage]);

  const sendMessage = useCallback((text: string) => {
    if (!connected) return;
    addMessage({ type: 'chat', content: text, from: 'You' });
    // Echo back after 300ms
    setTimeout(() => addMessage({ type: 'chat', content: `Echo: ${text}`, from: 'Server' }), 300);
    console.log('[ClickAndVerify] WS message sent:', text);
  }, [connected, addMessage]);

  const disconnect = useCallback(() => {
    intervalsRef.current.forEach(clearInterval);
    setConnected(false);
    addMessage({ type: 'system', content: 'Disconnected from live feed' });
    console.log('[ClickAndVerify] WebSocket disconnected');
  }, [addMessage]);

  return { connected, messages, counter, notifications, sendMessage, disconnect };
}

export default function WebSocketPage() {
  const [wsEnabled, setWsEnabled] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { connected, messages, counter, notifications, sendMessage, disconnect } = useSimulatedWS(wsEnabled);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleConnect = () => setWsEnabled(true);
  const handleDisconnect = () => { setWsEnabled(false); disconnect(); };

  const handleSend = () => {
    if (!chatInput.trim()) return;
    sendMessage(chatInput.trim());
    setChatInput('');
  };

  const msgTypeStyle: Record<string, string> = {
    system: 'text-gray-400 italic text-xs',
    chat: 'text-gray-700 dark:text-gray-300 text-sm',
    notification: 'text-blue-600 dark:text-blue-400 text-xs font-medium',
  };

  return (
    <PageLayout
      title="WebSocket Live Feed"
      description="Real-time data feed using WebSocket. Practice asserting on live-updating elements."
      difficulty="advanced"
      testId="websocket-page"
      onReset={() => { setWsEnabled(false); setChatInput(''); }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Connection status */}
        <div className="card p-4 flex items-center justify-between flex-wrap gap-3" data-testid="ws-status-bar">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-gray-300 dark:bg-gray-600'}`} data-testid="ws-status-dot" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300" data-testid="ws-status-text">
              {connected ? 'Connected' : 'Disconnected'}
            </span>
            <span className="text-xs text-gray-400 font-mono" data-testid="ws-endpoint">ws://localhost:4000/ws</span>
          </div>
          <div className="flex gap-2">
            <button onClick={handleConnect} disabled={connected} className="btn-primary text-xs gap-1.5 disabled:opacity-50" data-testid="btn-ws-connect">
              <Wifi size={13} /> Connect
            </button>
            <button onClick={handleDisconnect} disabled={!connected} className="btn-danger text-xs gap-1.5 disabled:opacity-50" data-testid="btn-ws-disconnect">
              <WifiOff size={13} /> Disconnect
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Live counter */}
          <div className="card p-5 text-center" data-testid="ws-counter-panel">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Activity size={16} className="text-blue-500" />
              <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Live Counter</h3>
            </div>
            <div className="text-4xl font-black text-blue-600 dark:text-blue-400 font-mono mb-1" data-testid="ws-counter-value">
              {counter.toLocaleString()}
            </div>
            <p className="text-xs text-gray-400">increments per second</p>
          </div>

          {/* Notifications */}
          <div className="card p-5 text-center" data-testid="ws-notifications-panel">
            <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">Notifications</h3>
            <div className="text-4xl font-black text-orange-500 font-mono mb-1" data-testid="ws-notification-count">
              {notifications}
            </div>
            <p className="text-xs text-gray-400">received since connect</p>
          </div>

          {/* Message count */}
          <div className="card p-5 text-center" data-testid="ws-messages-panel">
            <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">Total Messages</h3>
            <div className="text-4xl font-black text-green-600 dark:text-green-400 font-mono mb-1" data-testid="ws-message-count">
              {messages.length}
            </div>
            <p className="text-xs text-gray-400">in the feed</p>
          </div>
        </div>

        {/* Chat feed */}
        <div className="card overflow-hidden" data-testid="ws-feed-container">
          <div className="p-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Live Feed</span>
            {connected && <RefreshCw size={12} className="animate-spin text-blue-400" />}
          </div>
          <div className="h-64 overflow-y-auto p-4 space-y-2 bg-gray-50 dark:bg-gray-900/50" data-testid="ws-message-list" aria-live="polite" aria-label="Live feed messages">
            {messages.length === 0 ? (
              <p className="text-xs text-gray-400 text-center mt-8" data-testid="ws-feed-empty">Connect to start receiving messages…</p>
            ) : (
              [...messages].reverse().map((msg) => (
                <div key={msg.id} className={`flex items-start gap-2 ${msgTypeStyle[msg.type]}`} data-testid={`ws-message-${msg.id}`} data-msg-type={msg.type}>
                  <span className="text-gray-300 dark:text-gray-600 font-mono text-xs shrink-0 mt-0.5">{new Date(msg.ts).toLocaleTimeString()}</span>
                  {msg.from && <span className="font-semibold shrink-0 text-xs">{msg.from}:</span>}
                  <span data-testid={`ws-msg-content-${msg.id}`}>{msg.content}</span>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          {/* Send */}
          <div className="p-3 border-t border-gray-100 dark:border-gray-800 flex gap-2" data-testid="ws-send-form">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="input text-sm flex-1"
              placeholder="Type a message and press Enter…"
              data-testid="ws-chat-input"
              disabled={!connected}
            />
            <button onClick={handleSend} disabled={!connected || !chatInput.trim()} className="btn-primary text-sm gap-1.5 disabled:opacity-50" data-testid="btn-ws-send">
              <Send size={14} /> Send
            </button>
          </div>
        </div>

        {/* Testing tips */}
        <div className="card p-5" data-testid="ws-testing-tips">
          <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3">Testing WebSocket Elements</h3>
          <div className="grid sm:grid-cols-2 gap-3 text-xs text-gray-600 dark:text-gray-400">
            {[
              { tool: 'Playwright', tip: 'page.waitForResponse() or waitForEvent("websocket"). Assert on text content updates with polling.' },
              { tool: 'Cypress', tip: 'cy.intercept() WebSocket is limited. Use cy.waitUntil() from cypress-wait-until to poll for element text changes.' },
              { tool: 'Selenium', tip: 'Use explicit waits (ExpectedConditions.textToBePresentInElement) to poll for counter value changes.' },
              { tool: 'General', tip: 'Avoid fixed sleeps. Poll with a condition: wait until counter > N or until a specific message appears in the feed.' },
            ].map((t) => (
              <div key={t.tool} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3" data-testid={`ws-tip-${t.tool.toLowerCase()}`}>
                <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">{t.tool}</p>
                <p>{t.tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
