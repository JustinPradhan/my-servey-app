import React, { useState } from 'react';
import AnswerComponent from '../components/AnswerComponent';
import { SummitSurvey } from '../api/model/data';

interface QuestionComponentProps {
    index :number
    questionId: string;
    question: string;
    surveyTypeId:number;
    onAnswer: (index:number, rating: SummitSurvey) => void;
}

const QuestionComponent: React.FC<QuestionComponentProps> = ({index, questionId,question,surveyTypeId, onAnswer }) => {
  const [rating, setRating] = useState<SummitSurvey | null>(null);

  const handleAnswer = (i:number,selectedRating: SummitSurvey) => {
    setRating(selectedRating);
    onAnswer(i, selectedRating);
  };

  return (
    <div className="flex flex-col p-6 mb-2 bg-white shadow-lg rounded-lg">
      <h2 className="mb-4 text-xl font-medium text-black">{index+1} {question}</h2>
      <AnswerComponent index={index} questionId={questionId} surveyTypeId={surveyTypeId} onSelect={handleAnswer} />
      {rating !== null && (
        <p className="mt-4 text-lg font-semibold text-gray-600">
          You rated: <span className="text-blue-500">{rating.answer}</span>
        </p>
      )}
    </div>
  );
};

export default QuestionComponent;
