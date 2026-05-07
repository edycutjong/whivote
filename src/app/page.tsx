"use client";

import { StatusBar } from "@/components/StatusBar";
import { Footer } from "@/components/Footer";

import { useState, useEffect } from "react";
import { magicBlockService } from "@/lib/magicblock";

// Initial data
const INITIAL_POLL = {
  id: "poll_1",
  title: "Proposal 42: Increase Dev Fund Allocation by 5%",
  options: [
    { id: "opt_1", text: "Yes, increase 5%" },
    { id: "opt_2", text: "No, keep current" },
    { id: "opt_3", text: "Abstain" }
  ],
  deadline: new Date(Date.now() + 30000), // 30 seconds from now
  totalVotes: 124,
  isRevealed: false
};

const INITIAL_RESULTS = {
  "opt_1": 84,
  "opt_2": 32,
  "opt_3": 8
};

export default function WhivoteDashboard() {
  const [view, setView] = useState<'polls' | 'create' | 'reveal'>('polls');
  const [timeLeft, setTimeLeft] = useState(30);
  const [hasVoted, setHasVoted] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [sessionKeyActive, setSessionKeyActive] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isRevealed) {
      // Simulate calling SDK to reveal when timer hits 0
      const authorityPubkey = "11111111111111111111111111111111"; // System program
      magicBlockService.revealResults("poll_1", authorityPubkey).then(() => {
        setIsRevealed(true);
      });
    }
  }, [timeLeft, isRevealed]);

  const handleVote = async () => {
    if (!sessionKeyActive) {
      alert("Please activate Session Key first for 1-click voting.");
      return;
    }
    const voterPubkey = "11111111111111111111111111111111"; // System program
    await magicBlockService.submitEncryptedVote("poll_1", "0x8a92f00b91e_mock", voterPubkey);
    setHasVoted(true);
  };

  const toggleSessionKey = async () => {
    if (!sessionKeyActive) {
      await magicBlockService.activateSessionKey("DemoWallet111111111111111111111");
      setSessionKeyActive(true);
    } else {
      setSessionKeyActive(false);
    }
  };

  const renderExplorerProof = () => (
    <>
      <StatusBar />
    <div className="p-4 rounded-lg bg-brand-surface border border-brand-border font-mono text-xs text-brand-muted space-y-2 h-full">
      <div className="flex justify-between items-center pb-2 border-b border-brand-border">
        <span className="text-white font-bold">SOLANA EXPLORER</span>
        <span className="text-brand-primary">LIVE VIEW</span>
      </div>
      {hasVoted ? (
        <>
          <div className="text-status-success">✓ Tx Confirmed (MagicBlock Rollup)</div>
          <div>Program: MgcBLk...</div>
          <div>Instruction: CastEncryptedVote</div>
          <div className="text-status-warning break-all">Data: 0x8a92f00b91e... (Encrypted Payload)</div>
          <div className="mt-4 pt-2 border-t border-brand-border">
            <span className="text-white">Note:</span> Vote choice remains hidden in Private State until the reveal ceremony.
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-32 opacity-50">
          Waiting for transaction...
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto space-y-8">
      <header className="flex justify-between items-center pb-6 border-b border-brand-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <span className="text-brand-primary">W</span>hivote
          </h1>
          <p className="text-brand-muted mt-1 text-sm">Private DAO Polling via MagicBlock</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={toggleSessionKey}
            className={`px-4 py-2 rounded-lg font-mono text-sm border transition-all ${
              sessionKeyActive 
                ? 'bg-status-success/20 text-status-success border-status-success/50' 
                : 'bg-brand-surface text-brand-muted border-brand-border hover:bg-brand-surface/80'
            }`}
          >
            {sessionKeyActive ? 'SESSION KEY ACTIVE' : 'ACTIVATE SESSION KEY'}
          </button>
          <button 
            onClick={() => setView(view === 'create' ? 'polls' : 'create')}
            className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-lg font-medium transition-colors"
          >
            {view === 'create' ? 'Back to Polls' : 'Create Poll'}
          </button>
        </div>
      </header>

      <main>
        {view === 'create' && (
          <div className="glass-panel p-8 rounded-xl max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Create Private Poll</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-muted mb-1">Proposal Title</label>
                <input type="text" className="w-full bg-brand-bg border border-brand-border rounded p-3 text-white focus:outline-none focus:border-brand-primary" placeholder="Enter proposal title..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-muted mb-1">Options</label>
                <input type="text" className="w-full bg-brand-bg border border-brand-border rounded p-3 text-white mb-2 focus:outline-none focus:border-brand-primary" placeholder="Option 1" />
                <input type="text" className="w-full bg-brand-bg border border-brand-border rounded p-3 text-white mb-2 focus:outline-none focus:border-brand-primary" placeholder="Option 2" />
                <button className="text-brand-primary text-sm font-medium hover:underline">+ Add Option</button>
              </div>
              <button onClick={() => setView('polls')} className="w-full py-3 mt-4 bg-brand-primary text-white rounded font-bold shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all">
                Launch to Ephemeral Rollup
              </button>
            </div>
          </div>
        )}

        {view === 'polls' && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-panel p-8 rounded-xl flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">{INITIAL_POLL.title}</h2>
                <div className="px-3 py-1 rounded bg-brand-primary/20 text-brand-primary border border-brand-primary/30 font-mono text-sm">
                  {isRevealed ? 'REVEALED' : 'PRIVATE STATE'}
                </div>
              </div>
              
              {!isRevealed ? (
                <>
                  <div className="text-center p-6 bg-brand-surface/50 rounded-lg border border-brand-border mb-6">
                    <div className="text-brand-muted text-sm uppercase tracking-widest mb-2">Ceremony Countdown</div>
                    <div className="text-4xl font-mono font-light text-white">00:00:{timeLeft.toString().padStart(2, '0')}</div>
                  </div>

                  <div className="space-y-3 mb-8 flex-grow">
                    {INITIAL_POLL.options.map(opt => (
                      <button 
                        key={opt.id}
                        onClick={handleVote}
                        disabled={hasVoted || !sessionKeyActive}
                        className={`w-full p-4 rounded border text-left transition-all ${
                          hasVoted 
                            ? 'bg-brand-surface/50 border-brand-border text-brand-muted cursor-not-allowed opacity-50'
                            : 'bg-brand-surface border-brand-border hover:border-brand-primary hover:bg-brand-primary/10'
                        }`}
                      >
                        {opt.text}
                      </button>
                    ))}
                  </div>

                  {hasVoted && (
                    <div className="p-4 rounded bg-status-success/10 border border-status-success/30 text-status-success text-sm flex items-center justify-center gap-2">
                      <span className="text-xl">🔒</span> Vote encrypted & submitted via Ephemeral Rollup
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-4 flex-grow flex flex-col justify-center">
                  <h3 className="text-center text-status-success mb-4 font-mono font-bold tracking-wider">RESULTS REVEALED</h3>
                  {INITIAL_POLL.options.map(opt => {
                    const votes = INITIAL_RESULTS[opt.id as keyof typeof INITIAL_RESULTS];
                    const percent = (votes / INITIAL_POLL.totalVotes) * 100;
                    return (
                      <div key={opt.id} className="relative p-4 rounded border border-brand-border bg-brand-bg overflow-hidden">
                        <div 
                          className="absolute inset-y-0 left-0 bg-brand-primary/20"
                          style={{ width: `${percent}%` }}
                        ></div>
                        <div className="relative flex justify-between items-center z-10">
                          <span className="font-medium">{opt.text}</span>
                          <span className="font-mono text-brand-primary">{votes} votes ({percent.toFixed(1)}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Split Screen Explorer Proof */}
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-brand-muted">On-Chain Verification</h3>
              {renderExplorerProof()}
            </div>
          </div>
        )}
      </main>
    </div>
      <Footer />
    </>
  );
}
