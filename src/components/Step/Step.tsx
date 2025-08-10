import React, { useEffect, useState, useRef, useCallback } from "react";
import { IQuestion } from "../../interfaces/common"; // Adjust the import path as needed
import { useGetSingleAssessmentQuery } from "../../redux/api/assessmentApi/assessment.api";

interface Props {
  step: number;
  selectedAssessmentId: string | null;
  onComplete: (score: number, certifiedLevel: string, noRetake: boolean) => void;
}



// Levels mapping per step
const stepLevels: Record<number, string[]> = {
  1: ["A1", "A2"],
  2: ["B1", "B2"],
  3: ["C1", "C2"],
};

const Step: React.FC<Props> = ({step, onComplete }) => {
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(60); // default 60 seconds per question

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { data: questionsData, isLoading } = useGetSingleAssessmentQuery(stepLevels[step][0]);

useEffect(() => {
  if (!isLoading && questionsData) {
    const questionsForLevel = questionsData.data.questionsByLevel && questionsData.data.questionsByLevel[0]?.questions || [];

    setQuestions(questionsForLevel.length ? questionsForLevel : []);
    setCurrentIndex(0);
    setTimeLeft(questionsForLevel[0]?.timeLimitSeconds || 60);
    setAnswers({});
  }
}, [questionsData, isLoading]);

  const finishTest = useCallback((): void => {
    if (timerRef.current) clearInterval(timerRef.current);

    if(!questions?.length) return;

    let correctCount = 0;
    questions.forEach((q) => {
      if (answers[q._id] && q.options.find(opt => opt._id === answers[q._id] && opt.isCorrect)) {
        correctCount++;
      }
    });
    const score = (correctCount / questions.length) * 100;

    // Determine certification and noRetake based on step and score
    let certifiedLevel = "fail";
    let noRetake = false;

    if (step === 1) {
      if (score < 25) noRetake = true;
      else if (score < 50) certifiedLevel = "A1";
      else if (score < 75) certifiedLevel = "A2";
      else certifiedLevel = "A2";
    } else if (step === 2) {
      if (score < 25) certifiedLevel = "A2";
      else if (score < 50) certifiedLevel = "B1";
      else if (score < 75) certifiedLevel = "B2";
      else certifiedLevel = "B2";
    } else if (step === 3) {
      if (score < 25) certifiedLevel = "B2";
      else if (score < 50) certifiedLevel = "C1";
      else certifiedLevel = "C2";
    }

    onComplete(score, certifiedLevel, noRetake);
  }, [answers, questions, step, onComplete]);

  const handleNext = useCallback((): void => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setTimeLeft(questions[currentIndex + 1].timeLimitSeconds || 60);
    } else {
      finishTest();
    }
  }, [currentIndex, questions, finishTest]);

  // Timer countdown logic
  useEffect(() => {
    if (questions?.length === 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          handleNext();
          return questions[currentIndex + 1]?.timeLimitSeconds || 60;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, handleNext, questions, questions?.length]);

  const handleAnswerSelect = (option: string) => {
    setAnswers({ ...answers, [questions[currentIndex]?._id]: option });
  };

    if (isLoading) return <div>Loading questions...</div>;

  if (questions?.length === 0) return <div>NO QUESTIONS AVAILABLE!!!</div>;

  const q = questions[currentIndex];

  return (
    <div className="p-4 max-w-3xl" style={{margin: "0 auto"}}>
      <h2 className="text-xl font-semibold mb-2">Step {step} Test</h2>
      <div className="mb-4">
        <div key={q._id} className="mb-4">
          <h3 className="font-medium"> {q.questionText}</h3>
          <div className="mt-2 grid grid-cols-2 gap-3">
            {q?.options?.map((opt) => (
              <button
                    key={opt._id}
                    onClick={() => handleAnswerSelect(opt._id)}
                    className={`p-2 border rounded ${
                      answers[q._id] === opt._id ? "bg-blue-500 text-white" : "bg-white"
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
      </div>

      <div className="flex justify-between items-center" style={{marginTop: "1rem"}}>
        <div className="mb-4">
          <span>Time left: {timeLeft}s</span>
        </div>

        <button
          onClick={handleNext}
          disabled={!answers[q?._id]}
          className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {currentIndex + 1 === questions?.length ? "Finish Test" : "Next Question"}
        </button>
      </div>
    </div>
  );
};

export default Step;
