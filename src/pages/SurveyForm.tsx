import { useEffect, useState } from "react";
import QuestionComponent from "../components/QuestionComponent";
import { ANSWER } from "../types/answer";
import thankYouImage from '../images/thank.gif';
import { Autocomplete, TextField } from "@mui/material";
import { Question, SummitSurvey, SurveyType } from "../api/model/data";
import { UserRepository } from "../api/repo/UserRepository";
import toast from "react-hot-toast";



function SurveyForm() {
    const [surveyTypes, setsurveyTypes] = useState<SurveyType[]>([]);
    const [selectSurveyTypes, setselectSurveyTypes] = useState<SurveyType | null>(null);
    const [answers, setAnswers] = useState<SummitSurvey[]>([]);
    const [surveyCompleted, setSurveyCompleted] = useState<boolean>(false);
    const [questions, setQuestions] = useState<Question[]>([]);
    useEffect(() => {
        UserRepository.getSurveyActive().then(res => {
            setsurveyTypes(res.data);
        }).catch(err => {
            toast.error(err.message);
        })
    }, [])
    useEffect(() => {
        if (selectSurveyTypes != null) {
            UserRepository.getQuestion(selectSurveyTypes.id).then(res => {
                setQuestions(res.data);
            }).catch(err => {
                toast.error(err.message);
            })
        }
    }, [selectSurveyTypes?.id])

    const handleAnswer = (index:number, rating: SummitSurvey) => {
        const updatedAnswers = [...answers];
        updatedAnswers[index] = rating;
        setAnswers(updatedAnswers);
        // if (updatedAnswers.length === questions.length && !updatedAnswers != undefined) {
        //     setSurveyCompleted(true); // Set answers completion status
        // }
    };

    const handleSubmit = () => {
        // Implement submission logic here   
        UserRepository.summitSurvey(answers).then(res => {
            if(res.data != null){
                toast.success("Success");
          
                setSurveyCompleted(true);
            }
        
        }).catch(err => {
            toast.error(err.message);
        });
       
        // You can send the answers to your backend or perform any other action
    };

    const handleSelectServey = (value: SurveyType | null) => {
        setselectSurveyTypes(value);
    }

    const handleReset = () => {
        setSurveyCompleted(false);
        setAnswers([]);
        // You can send the answers to your backend or perform any other action
    };
    const allQuestionsAnswered = answers.length === questions.length && answers.every(answer => answer !== undefined);
    return (
        <div className="w-full min-h-screen bg-gray-100 p-3">
            <div className="flex flex-col w-full">
            <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">Servey Type</label>
                    <Autocomplete
                        size='small'
                        disablePortal
                        id="combo-box-demo-d"
                        value={selectSurveyTypes}
                        options={surveyTypes}
                        getOptionLabel={(option) => option.description}
                        onChange={(event, value) => handleSelectServey(value)}
                        sx={{ width: '100%' }}
                        renderInput={(params) => <TextField {...params} label="Servey" />}
                    />
                </div>
                {surveyCompleted ? (
                    <div className="text-center">
                        <img src={thankYouImage} alt="Thank You" className="mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Thank you for answering the survey!</h2>
                        <button onClick={handleReset} className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-md">
                                Reset
                            </button>
                        {/* You can display any additional message or action buttons here */}
                    </div>
                ) : (
                    <>{questions.map((question, index) => (
                    
                        <QuestionComponent
                            key={index}
                            index={index}
                            questionId={question.id ?? ""}
                            question={question.question}
                            surveyTypeId={Number(selectSurveyTypes?.id)}
                            onAnswer={(index, rating) => handleAnswer(index, rating as SummitSurvey)}
                        />    
                         ))}
                        {allQuestionsAnswered && (
                            <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-md">
                                Submit
                            </button>
                        )}
                    </>

                    )}
           
            </div>

        </div>
    )
}

export default SurveyForm