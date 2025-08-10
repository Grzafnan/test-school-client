import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Step from '../../components/Step/Step';
import Certification from '../../components/Certification/Certification';
import { useGetAllAssessmentQuery } from '../../redux/api/assessmentApi/assessment.api';

const MemoizedStep = React.memo(Step);

const Assessment = () => {
  const [step, setStep] = useState(1);
  const [score, setScore] = useState<number>(0);
  const [certifiedLevel, setCertifiedLevel] = useState<string>("fail");
  const [noRetake, setNoRetake] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: assessments, isLoading } = useGetAllAssessmentQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const selectedAssessment = useMemo(() => {
    if (!selectedId || !assessments?.data) return null;
    return assessments.data.find(a => a._id === selectedId) || null;
  }, [selectedId, assessments?.data]);

  const handleStepComplete = useCallback((stepScore: number, level: string, failNoRetake: boolean) => {
    setScore(stepScore);
    setCertifiedLevel(level);
    setNoRetake(failNoRetake);

    if (!failNoRetake && step < 3 && stepScore >= 75) {
      setStep(prev => prev + 1);
    }
  }, [step]);

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  useEffect(() => {
    if (selectedAssessment) {
      setScore(selectedAssessment.score ?? 0);
      setCertifiedLevel(selectedAssessment.level ?? "fail");
      setNoRetake(selectedAssessment.noRetake ?? false);
    }
  }, [selectedAssessment]);

  if (noRetake) {
    return <div><h2>Test Failed at Step 1 — No Retake Allowed.</h2></div>;
  }

  if (step >= 3) {
    return <Certification score={score!} level={certifiedLevel!} />;
  }
  
  return (
    <div>
      <h2>Assessment in Progress - Step {step}</h2>

      {!isLoading && assessments && assessments.data?.length > 0 && (
        <div>
          <h3>Previous Assessments</h3>
          <div className="flex flex-wrap gap-4">
            {assessments.data.map((assessment) => {
              const isSelected = selectedId === assessment._id;
              return (
                <div
                  key={assessment._id}
                  onClick={() => handleSelect(assessment._id)}
                  className={`p-3 rounded border cursor-pointer transition-all ${
                    isSelected ? 'border-blue-500 shadow-lg bg-blue-50' : 'border-gray-300 bg-white'
                  }`}
                  tabIndex={0}
                >
                  <h4 className="text-primary text-xl font-bold">{assessment.name}</h4>
                  <p className="m-0 font-medium">{assessment.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selectedAssessment?.questionsByLevel  && selectedAssessment.questionsByLevel?.length > 0 && (
        <MemoizedStep
          step={step}
          onComplete={handleStepComplete}
        />
      )}
    </div>
  );
};

export default Assessment;