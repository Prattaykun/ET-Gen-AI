"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ChevronRight, CheckCircle2 } from 'lucide-react';
import { personalityQuestions, PersonalityProfile } from '@/data/personalityQuestions';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/context/AuthContext';

export default function PersonalityAssessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<PersonalityProfile>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClient();

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    }
  }, [user, router]);

  const handleAnswer = (traitKey: string, value: string) => {
    setAnswers(prev => {
      if (traitKey === 'investment_goals' || traitKey === 'preferred_industries' || traitKey === 'news_categories') {
        // Array type traits
        const currentArray = (prev[traitKey as keyof PersonalityProfile] as string[]) || [];
        return {
          ...prev,
          [traitKey]: currentArray.includes(value)
            ? currentArray.filter(v => v !== value)
            : [...currentArray, value]
        };
      } else {
        // Single value traits
        return {
          ...prev,
          [traitKey]: value
        };
      }
    });
  };

  const goToNextQuestion = () => {
    if (currentQuestion < personalityQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    
    if (!user?.id) {
      setError('User not authenticated');
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('Saving personality assessment...', { userId: user.id, answers });

      // Try to insert or update user record
      const { error: upsertError } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email,
          personality_traits: answers,
          personality_completed: true,
          investment_style: answers.investment_style || '',
          risk_tolerance: answers.risk_tolerance || '',
          investment_goals: answers.investment_goals || [],
          preferred_industries: answers.preferred_industries || [],
          news_categories: answers.news_categories || []
        });

      if (upsertError) {
        console.error('Upsert error:', upsertError);
        throw new Error(`Database error: ${upsertError.message}`);
      }

      console.log('Assessment saved successfully!');
      setShowCompletion(true);
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error) {
      console.error('Error saving personality assessment:', error);
      setError(error instanceof Error ? error.message : 'Failed to save assessment. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return null;
  }

  const question = personalityQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / personalityQuestions.length) * 100;

  if (showCompletion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-[#fdf2f2] to-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="mb-6 flex justify-center">
            <div className="bg-et-red p-4 rounded-full">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="font-serif font-black text-3xl text-et-grey-dark mb-3">
            Assessment Complete!
          </h1>
          <p className="text-et-grey-medium font-serif text-lg mb-6">
            Your personality profile has been created. We're personalizing your feed...
          </p>
          <div className="flex justify-center">
            <Loader2 className="w-6 h-6 text-et-red animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#fdf2f2] to-white">
      {/* Progress Bar */}
      <div className="w-full h-1 bg-et-border fixed top-0 left-0 z-40 pointer-events-none">
        <div
          className="h-full bg-et-red transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full pt-8">
          {/* Question Counter */}
          <div className="text-center mb-12">
            <span className="text-et-grey-medium font-bold uppercase tracking-widest text-[12px]">
              Question {currentQuestion + 1} of {personalityQuestions.length}
            </span>
          </div>

          {/* Question */}
          <div className="mb-12">
            <h1 className="font-serif font-black text-4xl lg:text-5xl text-et-grey-dark text-center leading-tight mb-2">
              {question.question}
            </h1>
          </div>

          {/* Options */}
          <div className="space-y-4 mb-12">
            {error && (
              <div className="bg-red-50 border border-red-300 rounded-sm p-4 mb-6">
                <p className="text-red-700 font-serif text-sm">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="text-red-600 underline text-xs mt-2 hover:text-red-800"
                >
                  Dismiss
                </button>
              </div>
            )}
            {question.options.map((option, idx) => {
              const isSelected =
                Array.isArray(answers[option.trait as keyof PersonalityProfile])
                  ? (answers[option.trait as keyof PersonalityProfile] as string[]).includes(option.value)
                  : answers[option.trait as keyof PersonalityProfile] === option.value;

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option.trait, option.value)}
                  className={`w-full p-5 text-left rounded-sm border-2 transition-all duration-200 font-serif text-lg ${ isSelected
                    ? 'border-et-red bg-[#fdf2f2] text-et-red font-bold'
                    : 'border-et-border bg-white text-et-grey-dark hover:border-et-red hover:bg-[#fdf2f2]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option.text}</span>
                    <div
                      className={`w-6 h-6 rounded-full border-2 transition-all ${ isSelected
                        ? 'border-et-red bg-et-red'
                        : 'border-et-grey-medium'
                      }`}
                    >
                      {isSelected && (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex gap-4 justify-between items-center">
            <button
              onClick={goToPreviousQuestion}
              disabled={currentQuestion === 0}
              className="px-8 py-3 text-sm font-bold uppercase tracking-widest text-et-grey-dark border border-et-border rounded-sm hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>

            <div className="flex gap-2">
              {personalityQuestions.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 w-2 rounded-full transition-all ${
                    idx < currentQuestion ? 'bg-et-red' : idx === currentQuestion ? 'bg-et-red w-8' : 'bg-et-border'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={goToNextQuestion}
              disabled={isSubmitting}
              className="px-8 py-3 text-sm font-bold uppercase tracking-widest text-white bg-et-red rounded-sm hover:bg-red-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : currentQuestion === personalityQuestions.length - 1 ? (
                'Complete'
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
