import React, { useState, useCallback, useEffect } from 'react';
import Step from '../../components/Step/Step';
import Certification from '../../components/Certification/Certification';
import { useGetAllAssessmentQuery } from '../../redux/api/assessmentApi/assessment.api';
import { IAssessment } from '../../interfaces/common';

const MemoizedStep = React.memo(Step);

const Assessment = () => {
  const [step, setStep] = useState(1);
  const [score, setScore] = useState<number>(0);
  const [certifiedLevel, setCertifiedLevel] = useState<string>("fail");
  const [noRetake, setNoRetake] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<IAssessment | null>(null);

  const { data: assessments, isLoading } = useGetAllAssessmentQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });


  const handleStepComplete = useCallback((stepScore: number, level: string, failNoRetake: boolean) => {
    setScore(stepScore);
    setCertifiedLevel(level);
    setNoRetake(failNoRetake);

    if (!failNoRetake && step < 3 && stepScore >= 75) {
      setStep(prev => prev + 1);
    }
  }, [step]);

  const handleSelect = useCallback((assessment: IAssessment) => {
    setSelectedAssessment(assessment);
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
    {selectedAssessment?._id ? (
      <MemoizedStep
        step={step}
        selectedAssessmentId={selectedAssessment._id}
        onComplete={handleStepComplete}
      />
    ) : (
      !isLoading && assessments && assessments.data?.length > 0 && (
        <div>
          <h2>Assessment in Progress - Step {step}</h2>
          <div className="flex flex-wrap gap-4">
            {assessments.data.map((assessment) => {
              const isSelected = selectedAssessment?._id === assessment._id;
              return (
                <div
                  key={assessment._id}
                  onClick={() => handleSelect(assessment)}
                  className={`p-3 rounded border cursor-pointer transition-all ${
                    isSelected ? "border-blue-500 shadow-lg bg-blue-50" : "border-gray-300 bg-white"
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
      )
    )}
  </div>
);

};

export default Assessment;