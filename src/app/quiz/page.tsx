'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Country } from '@/types/country';
import CountryFlagImage from '@/components/CountryFlagImage';
import { Trophy, ArrowLeft, RefreshCw, CheckCircle2, XCircle, Award, Sparkles } from 'lucide-react';

interface Question {
  type: 'flag' | 'capital';
  country: Country;
  options: string[];
  correctAnswer: string;
}

export default function QuizPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [streak, setStreak] = useState(0);
  const [quizMode, setQuizMode] = useState<'flag' | 'capital'>('flag');

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/countries');
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const valid = json.data.filter(
            (c: Country) => c.capital && c.capital.length > 0 && c.flags?.png
          );
          setCountries(valid);
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadData();
  }, []);

  const generateQuestion = (pool = countries, mode = quizMode) => {
    if (pool.length < 4) return;

    const targetIdx = Math.floor(Math.random() * pool.length);
    const target = pool[targetIdx];

    const optionsSet = new Set<string>();
    const correctAnswer =
      mode === 'flag' ? target.name.common : target.capital?.[0] || 'Unknown';
    optionsSet.add(correctAnswer);

    while (optionsSet.size < 4) {
      const rand = pool[Math.floor(Math.random() * pool.length)];
      const wrongAnswer =
        mode === 'flag' ? rand.name.common : rand.capital?.[0] || 'Unknown';
      if (wrongAnswer && wrongAnswer !== correctAnswer) {
        optionsSet.add(wrongAnswer);
      }
    }

    const shuffledOptions = Array.from(optionsSet).sort(() => Math.random() - 0.5);

    setCurrentQuestion({
      type: mode,
      country: target,
      options: shuffledOptions,
      correctAnswer,
    });
    setSelectedAnswer(null);
  };

  useEffect(() => {
    if (countries.length >= 4 && !currentQuestion) {
      generateQuestion(countries, quizMode);
    }
  }, [countries, quizMode]);

  const handleSelectOption = (option: string) => {
    if (selectedAnswer !== null || !currentQuestion) return;

    setSelectedAnswer(option);
    const isCorrect = option === currentQuestion.correctAnswer;
    setTotalAnswered((prev) => prev + 1);

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    generateQuestion(countries, quizMode);
  };

  const handleModeChange = (mode: 'flag' | 'capital') => {
    setQuizMode(mode);
    generateQuestion(countries, mode);
  };

  const handleResetGame = () => {
    setScore(0);
    setTotalAnswered(0);
    setStreak(0);
    generateQuestion(countries, quizMode);
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-[100px] pt-4 sm:pt-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 mb-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Explorer</span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            <span>World Geography Trivia</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Test your knowledge of world flags, capitals, and nations.
          </p>
        </div>

        {/* Score & Streak */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-md bg-white dark:bg-slate-900 border border-[#e2d5b5] dark:border-slate-800 text-center shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Score</span>
            <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
              {score} / {totalAnswered}
            </span>
          </div>

          <div className="px-3 py-1.5 rounded-md bg-white dark:bg-slate-900 border border-[#e2d5b5] dark:border-slate-800 text-center shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Streak</span>
            <span className="text-sm font-extrabold text-amber-500 flex items-center justify-center gap-0.5">
              <Sparkles className="w-3 h-3" />
              {streak}
            </span>
          </div>

          <button
            onClick={handleResetGame}
            title="Reset score"
            className="p-2 rounded-md border border-[#e2d5b5] dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer bg-white dark:bg-slate-900"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-md bg-white dark:bg-slate-800 border border-[#e2d5b5] dark:border-slate-700 w-fit">
        <button
          onClick={() => handleModeChange('flag')}
          className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer ${
            quizMode === 'flag'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Guess The Flag
        </button>
        <button
          onClick={() => handleModeChange('capital')}
          className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer ${
            quizMode === 'capital'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Guess The Capital
        </button>
      </div>

      {/* Question Card */}
      {currentQuestion ? (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-md border border-[#e2d5b5] dark:border-slate-800 p-5 sm:p-8 shadow-xs space-y-5 text-center">
          {quizMode === 'flag' ? (
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Which country does this flag belong to?
              </span>
              <div className="relative w-56 sm:w-64 h-36 sm:h-40 mx-auto rounded-md overflow-hidden shadow-xs border border-[#e2d5b5] dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                <CountryFlagImage
                  src={currentQuestion.country.flags.png}
                  alt="Flag Question"
                  cca2={currentQuestion.country.cca2}
                  cca3={currentQuestion.country.cca3}
                  flagEmoji={currentQuestion.country.flag}
                  className="object-cover"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                What is the capital city of:
              </span>
              <div className="flex items-center justify-center gap-2">
                <div className="relative w-8 h-5 rounded-xs overflow-hidden border border-[#e2d5b5] dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                  <CountryFlagImage
                    src={currentQuestion.country.flags.png}
                    alt={currentQuestion.country.name.common}
                    cca2={currentQuestion.country.cca2}
                    cca3={currentQuestion.country.cca3}
                    flagEmoji={currentQuestion.country.flag}
                    sizes="40px"
                  />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {currentQuestion.country.name.common}
                </h2>
              </div>
              <p className="text-[11px] text-slate-400">
                Region: {currentQuestion.country.region} • Subregion: {currentQuestion.country.subregion || 'N/A'}
              </p>
            </div>
          )}

          {/* Multiple Choice Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-lg mx-auto pt-1">
            {currentQuestion.options.map((opt) => {
              const isSelected = selectedAnswer === opt;
              const isCorrect = opt === currentQuestion.correctAnswer;
              let btnStyle =
                'bg-slate-50 dark:bg-slate-800 border-[#e2d5b5] dark:border-slate-700 hover:border-blue-400 text-slate-800 dark:text-slate-100';

              if (selectedAnswer !== null) {
                if (isCorrect) {
                  btnStyle =
                    'bg-emerald-600 text-white border-emerald-600 shadow-xs';
                } else if (isSelected) {
                  btnStyle =
                    'bg-rose-600 text-white border-rose-600 shadow-xs';
                } else {
                  btnStyle =
                    'bg-slate-100 dark:bg-slate-800/40 text-slate-400 border-[#e2d5b5]/50 dark:border-slate-800 opacity-50';
                }
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleSelectOption(opt)}
                  disabled={selectedAnswer !== null}
                  className={`p-3 rounded-md border font-bold text-xs sm:text-sm transition-colors flex items-center justify-between text-left cursor-pointer ${btnStyle}`}
                >
                  <span className="truncate">{opt}</span>
                  {selectedAnswer !== null && (
                    <span>
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                      ) : isSelected ? (
                        <XCircle className="w-4 h-4 flex-shrink-0" />
                      ) : null}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {selectedAnswer !== null && (
            <div className="pt-3 space-y-2">
              <div
                className={`text-xs font-bold ${
                  selectedAnswer === currentQuestion.correctAnswer
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {selectedAnswer === currentQuestion.correctAnswer
                  ? '🎉 Correct! Well done!'
                  : `❌ Incorrect! Correct answer: ${currentQuestion.correctAnswer}`}
              </div>

              <button
                onClick={handleNext}
                className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Next Question</span>
                <Award className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-md border border-[#e2d5b5] dark:border-slate-800">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-600 mb-2" />
          <p className="text-xs text-slate-500">Loading trivia question...</p>
        </div>
      )}
    </div>
  );
}
