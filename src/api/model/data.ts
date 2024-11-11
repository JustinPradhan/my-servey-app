// src/types/question.ts
export interface Question {
    id: string|null;
    question: string;
    surveyTypeId: string;
    serialNo:number;
    active:boolean;
    updatedDate:string|null;
    createdDate:string|null;
    surveyTypeName:string|null;
    isEdit:boolean|null;
}

export interface SurveyType {
    id: string|null;
    description:string;
    active:boolean;
    deleted:boolean|null;
    isEdit:boolean|null;
}

export interface SummitSurvey {
    id: string|null;
    questionId:string;
    surveyTypeId:number;
    answerId:number;
    answer:string;
}


export interface Dashboard {
    surveyTypeId:number;
    description:string;
    totalAnswerUser:number;
    rating:number;
    color:string;
  }