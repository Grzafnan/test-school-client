import React from "react";

interface Props {
  score: number;
  level: string;
}

const Certification: React.FC<Props> = ({ score, level }) => {
  console.log("Certification component rendered with score:", score, "and level:", level);
  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-4">Certification Result</h1>
      <p className="text-xl mb-2">Your Score: {score.toFixed(2)}%</p>
      <p className="text-xl mb-6">Certified Level: {level}</p>

      <button
        onClick={() => alert("Download PDF feature coming soon!")}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Download Certificate (PDF)
      </button>
    </div>
  );
};

export default Certification;
