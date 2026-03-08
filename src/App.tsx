/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Trophy,
  ArrowRight,
  Calculator
} from 'lucide-react';

type Difficulty = 'satuan' | 'puluhan' | 'ratusan' | 'campuran_sat_pul' | 'campuran_sat_rat';

interface Question {
  num1: number;
  num2: number;
  operator: '+' | '-';
  answer: number;
}

export default function App() {
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'result'>('setup');
  const [difficulty, setDifficulty] = useState<Difficulty>('satuan');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const getRandomNumber = (diff: Difficulty) => {
    switch (diff) {
      case 'satuan':
        return Math.floor(Math.random() * 9) + 1;
      case 'puluhan':
        return Math.floor(Math.random() * 90) + 10;
      case 'ratusan':
        return Math.floor(Math.random() * 900) + 100;
      case 'campuran_sat_pul':
        return Math.floor(Math.random() * 99) + 1;
      case 'campuran_sat_rat':
        return Math.floor(Math.random() * 999) + 1;
      default:
        return 1;
    }
  };

  const generateQuestions = useCallback(() => {
    const newQuestions: Question[] = [];
    for (let i = 0; i < questionCount; i++) {
      let n1 = getRandomNumber(difficulty);
      let n2 = getRandomNumber(difficulty);
      const op = Math.random() > 0.5 ? '+' : '-';
      
      // Ensure no negative results for simplicity
      if (op === '-' && n1 < n2) {
        [n1, n2] = [n2, n1];
      }
      
      newQuestions.push({
        num1: n1,
        num2: n2,
        operator: op as '+' | '-',
        answer: op === '+' ? n1 + n2 : n1 - n2
      });
    }
    setQuestions(newQuestions);
  }, [difficulty, questionCount]);

  const startGame = () => {
    generateQuestions();
    setCurrentQuestionIndex(0);
    setScore({ correct: 0, incorrect: 0 });
    setGameState('playing');
    setUserAnswer('');
    setFeedback(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userAnswer === '' || feedback !== null) return;

    const isCorrect = parseInt(userAnswer) === questions[currentQuestionIndex].answer;
    
    if (isCorrect) {
      setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
      setFeedback('correct');
    } else {
      setScore(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
      setFeedback('incorrect');
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setUserAnswer('');
        setFeedback(null);
      } else {
        setGameState('result');
      }
    }, 1000);
  };

  const resetGame = () => {
    setGameState('setup');
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-emerald-100">
      <div className="max-w-md mx-auto px-6 py-12">
        
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 text-white rounded-2xl shadow-lg mb-4">
            <Calculator size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">Aritmatika Dasar</h1>
          <p className="text-stone-500 mt-2 italic serif">Latih kemampuan berhitungmu setiap hari</p>
        </header>

        <AnimatePresence mode="wait">
          {gameState === 'setup' && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-stone-200"
            >
              <div className="flex items-center gap-2 mb-6 text-emerald-700 font-semibold uppercase tracking-wider text-xs">
                <Settings size={16} />
                <span>Pengaturan Latihan</span>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-3">Pilih Tingkat Kesulitan</label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { id: 'satuan', label: 'Satuan (1-9)' },
                      { id: 'puluhan', label: 'Puluhan (10-99)' },
                      { id: 'ratusan', label: 'Ratusan (100-999)' },
                      { id: 'campuran_sat_pul', label: 'Campuran Satuan & Puluhan' },
                      { id: 'campuran_sat_rat', label: 'Campuran Satuan & Ratusan' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setDifficulty(opt.id as Difficulty)}
                        className={`text-left px-4 py-3 rounded-xl border transition-all ${
                          difficulty === opt.id 
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-1 ring-emerald-500' 
                            : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-3">Jumlah Pertanyaan: {questionCount}</label>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="5"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                    className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                </div>

                <button
                  onClick={startGame}
                  className="w-full bg-stone-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-stone-800 transition-colors shadow-lg mt-4"
                >
                  <Play size={20} fill="currentColor" />
                  Mulai Latihan
                </button>
              </div>
            </motion.div>
          )}

          {gameState === 'playing' && questions.length > 0 && (
            <motion.div
              key="playing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-stone-200 relative overflow-hidden"
            >
              {/* Progress Bar */}
              <div className="absolute top-0 left-0 w-full h-1 bg-stone-100">
                <motion.div 
                  className="h-full bg-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                  Pertanyaan {currentQuestionIndex + 1} / {questions.length}
                </span>
                <div className="flex gap-4">
                  <span className="text-emerald-600 font-mono text-sm font-bold flex items-center gap-1">
                    <CheckCircle2 size={14} /> {score.correct}
                  </span>
                  <span className="text-rose-500 font-mono text-sm font-bold flex items-center gap-1">
                    <XCircle size={14} /> {score.incorrect}
                  </span>
                </div>
              </div>

              <div className="text-center py-12">
                <div className="text-6xl font-black tracking-tighter text-stone-900 flex items-center justify-center gap-4">
                  <span>{questions[currentQuestionIndex].num1}</span>
                  <span className="text-emerald-500">{questions[currentQuestionIndex].operator}</span>
                  <span>{questions[currentQuestionIndex].num2}</span>
                </div>
                <div className="mt-4 text-stone-400 text-2xl font-light">= ?</div>
              </div>

              <form onSubmit={handleSubmit} className="relative">
                <input
                  autoFocus
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Jawaban..."
                  disabled={feedback !== null}
                  className={`w-full text-center text-3xl font-bold py-6 rounded-2xl border-2 outline-none transition-all ${
                    feedback === 'correct' 
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                      : feedback === 'incorrect'
                      ? 'border-rose-500 bg-rose-50 text-rose-700'
                      : 'border-stone-100 bg-stone-50 focus:border-emerald-500 focus:bg-white'
                  }`}
                />
                
                <AnimatePresence>
                  {feedback && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -bottom-12 left-0 w-full text-center"
                    >
                      {feedback === 'correct' ? (
                        <span className="text-emerald-600 font-bold flex items-center justify-center gap-1">
                          <CheckCircle2 size={18} /> Luar biasa!
                        </span>
                      ) : (
                        <span className="text-rose-600 font-bold flex items-center justify-center gap-1">
                          <XCircle size={18} /> Ups, kurang tepat.
                        </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={feedback !== null || userAnswer === ''}
                  className="w-full mt-8 bg-stone-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-stone-800 disabled:opacity-50 transition-all"
                >
                  Jawab <ArrowRight size={20} />
                </button>
              </form>
            </motion.div>
          )}

          {gameState === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-stone-200 text-center"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 text-amber-600 rounded-full mb-6">
                <Trophy size={40} />
              </div>
              
              <h2 className="text-2xl font-bold text-stone-900">Latihan Selesai!</h2>
              <p className="text-stone-500 mt-1">Berikut adalah ringkasan hasilmu:</p>

              <div className="grid grid-cols-2 gap-4 my-8">
                <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                  <div className="text-emerald-600 font-black text-4xl">{score.correct}</div>
                  <div className="text-emerald-700 text-xs font-bold uppercase tracking-wider mt-1">Benar</div>
                </div>
                <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
                  <div className="text-rose-600 font-black text-4xl">{score.incorrect}</div>
                  <div className="text-rose-700 text-xs font-bold uppercase tracking-wider mt-1">Salah</div>
                </div>
              </div>

              <div className="bg-stone-50 p-4 rounded-xl mb-8 flex justify-between items-center">
                <span className="text-stone-500 text-sm">Akurasi</span>
                <span className="font-bold text-stone-900">
                  {Math.round((score.correct / questions.length) * 100)}%
                </span>
              </div>

              <button
                onClick={resetGame}
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors shadow-lg"
              >
                <RotateCcw size={20} />
                Coba Lagi
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Info */}
        <footer className="mt-12 text-center text-stone-400 text-xs uppercase tracking-widest font-medium">
          Dibuat untuk melatih ketajaman otak
        </footer>
      </div>
    </div>
  );
}
