import React, { useState } from 'react';
import { ANSWER } from '../types/answer';
import { SummitSurvey } from '../api/model/data';

interface AnswerComponentProps {
  index:number;
  questionId: string;
  surveyTypeId:number;
  onSelect: (index:number, rating: SummitSurvey) => void;
}

const AnswerComponent: React.FC<AnswerComponentProps> = ({  index,questionId,surveyTypeId, onSelect }) => {
  const [selectedRating, setSelectedRating] = useState<SummitSurvey | null>(null);

  const ratings = [
    { value: 1, label: 'အလွန်ညံ့' },
    { value: 2, label: 'ညံ့' },
    { value: 3, label: 'ပုံမှန်' },
    { value: 4, label: 'ကောင်း' },
    { value: 5, label: 'အလွန်ကောင်း' },
  ] as ANSWER[];

  const handleSelect = (answer:ANSWER) => {
    let summitSurvey = {
      id : null,
      questionId : questionId,
      surveyTypeId :surveyTypeId,
      answerId:answer.value,
      answer: answer.label

    }
    answer.questionId = questionId;
    setSelectedRating(summitSurvey);
    onSelect(index, summitSurvey);
  };

  return (
    <div className="grid grid-cols-3 items-center  md:grid-cols-5">
      {ratings.map((rating) => (
        <label key={rating.value} className="flex items-center mb-2 cursor-pointer">
          <input
            type="radio"
            name={`rating-${questionId}`}
            value={rating.value}
            checked={selectedRating?.answerId === rating.value}
            onChange={() => handleSelect(rating)}
            className="mr-2 form-radio h-6 w-6 text-blue-500"
          />
          <span className={`px-4 py-2 text-lg font-medium transition-colors duration-200 ease-in-out ${
            selectedRating?.answerId === rating.value ? 'text-blue-500' : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-blue-100 hover:border-blue-500'
          }`}>
            {rating.label}
          </span>
        </label>
      ))}
    </div>
  );
};

export default AnswerComponent;
