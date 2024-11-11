// src/components/QuestionEntryForm.tsx
import React, { useEffect, useState } from 'react';
import { Question, SurveyType } from '../../api/model/data';
import { UserRepository } from '../../api/repo/UserRepository';
import toast from 'react-hot-toast';
import { Autocomplete, TextField } from '@mui/material';

const QuestionEntryForm: React.FC = () => {

    const [questions, setQuestions] = useState<Question[]>([]);
    const [description, setDescription] = useState<string>('');
    const [isEdit, setEdit] = useState<boolean>(true);
    const [surveyTypes, setsurveyTypes] = useState<SurveyType[]>([]);
    const [selectSurveyTypes, setselectSurveyTypes] = useState<SurveyType | null>(null);
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
    const [isChecked, setIsChecked] = useState<boolean>(true);

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

    const dragItem = React.useRef<any>(null);
    const dragOverItem = React.useRef<any>(null);
    const handleAddQuestion = () => {
        if (selectSurveyTypes == null) {
            return
        }
        if (editingQuestion) {
            const newQuestion: Question = {
                id: editingQuestion.id, // Simple ID generation
                question: description,
                surveyTypeId: selectSurveyTypes.id ?? "0",
                serialNo: editingQuestion.serialNo,
                active: isChecked,
                createdDate: editingQuestion.createdDate,
                updatedDate: null,
                surveyTypeName: selectSurveyTypes.description
            };
            publishToApi(newQuestion);

        } else {
            const newQuestion: Question = {
                id: null, // Simple ID generation
                question: description,
                surveyTypeId: selectSurveyTypes?.id ?? "0",
                serialNo: questions.length + 1,
                active: isChecked,
                createdDate: null,
                updatedDate: null,
                surveyTypeName: selectSurveyTypes.description

            };
            publishToApi(newQuestion);

        }
    };

    const publishToApi = (question: Question, resetState = true) => {
        UserRepository.setQuestion(question).then(res => {
            if (editingQuestion) {
                setQuestions(questions.map(qes =>
                    qes.id === res.data.id
                        ? { ...res.data }
                        : qes
                ));
                setEditingQuestion(null);
            } else {
                setQuestions([...questions, res.data]);
            }
            if (resetState) {
                setDescription('');
                setIsChecked(true);
                toast.success("Success");
            }
        }).catch(err => {
            toast.error(err.message);
        });
    };

    const handleSort = () => {
        let _questions = [...questions];
        const draggedItemContent = _questions.splice(dragItem.current!, 1)[0];
        _questions.splice(dragOverItem.current!, 0, draggedItemContent);
        dragItem.current = null;
        dragOverItem.current = null;
        setQuestions(_questions);

        const reorderedQuestions = [];
        for (let i = 0; i < _questions.length; i++) {
            if (_questions[i].serialNo !== i + 1) {
                _questions[i].serialNo = i + 1;
                reorderedQuestions.push(_questions[i]);
                publishQuestionToApi(_questions[i]);
            }
        }
        setQuestions(_questions);

        //publishQuestionToApi(reorderedQuestions)
    };


    const publishQuestionToApi = (question: Question) => {
        UserRepository.setQuestion(question).then(res => {

            toast.success("Questions reordered successfully!");
        }).catch(err => {
            toast.error(err.message);
        });
    };


    const handleSelectServey = (value: SurveyType | null) => {
        setselectSurveyTypes(value);
    }

    const handleEdit = (question: Question) => {
        setEdit(question.isEdit??true);
        setEditingQuestion(question);
        setDescription(question.question);
        setIsChecked(question.active);
    }
    const handleDelete = (question: Question) => {
        const confirmed = window.confirm(`Are you sure you want to delete the question: ${question.question}?`);
        
        if (confirmed) {
            UserRepository.deleteQuestion(question.id).then(res =>{
                
                  if(res.data == "Success"){
                    toast.success(res.data)
                    setQuestions(prevSurveyTypes => prevSurveyTypes.filter(s => s.id !== question.id));
                  }else{
                     toast.error(res.data)
                  }
            }).catch(error => {
                toast.error(error.message);
                // Handle the error, e.g., show error notification, etc.
            });

          
        }
    }



    return (
        <div className="w-full min-h-screen bg-gray-100 p-3">
            <div className="flex flex-col w-full">
                <h1 className="mb-4 text-2xl text-center font-semibold text-black">Question Entry Form</h1>

                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
                    <input
                        type="text"
                        value={description}
                        disabled={!isEdit}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    {editingQuestion != null && <label className="block mb-1 text-sm font-semibold text-green-500">Edit -{editingQuestion.question} </label>}
                    {editingQuestion != null && !isEdit && <label className="block mb-1 text-sm font-semibold text-warning">Not allow to change description</label>}
                </div>

                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">Servey Type</label>
                    <Autocomplete
                        size='small'
                        disablePortal
                        disabled={editingQuestion != null}
                        id="combo-box-demo-d"
                        value={selectSurveyTypes}
                        options={surveyTypes}
                        getOptionLabel={(option) => option.description}
                        onChange={(event, value) => handleSelectServey(value)}
                        sx={{ width: '100%' }}
                        renderInput={(params) => <TextField {...params} label="Servey" />}
                    />
                </div>
                <div className='mb-4'>
                    <label
                        htmlFor="checkboxLabelTwo"
                        className="flex cursor-pointer select-none items-center"
                    >
                        <div className="relative">
                            <input
                                type="checkbox"
                                id="checkboxLabelTwo"
                                className="sr-only"
                                onChange={() => setIsChecked(!isChecked)}
                                checked={isChecked}
                            />
                            <div
                                className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${isChecked ? 'border-primary bg-gray dark:bg-transparent' : ''}`}
                            >
                                <span className={`opacity-0 ${isChecked ? '!opacity-100' : ''}`}>
                                    <svg
                                        width="11"
                                        height="8"
                                        viewBox="0 0 11 8"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                                            fill="#3056D3"
                                            stroke="#3056D3"
                                            strokeWidth="0.4"
                                        ></path>
                                    </svg>
                                </span>
                            </div>
                        </div>
                        Active
                    </label>
                </div>
                <button
                    onClick={handleAddQuestion}
                    className="bg-blue-500 text-white px-4 py-2 mb-4 rounded-md"
                >
                    Add Question
                </button>

                <h2 className="mb-2 text-xl font-semibold text-black">Questions:</h2>
                <ul>
                    {questions.map((question, index) => (
                        <li key={index} className="mb-2 p-2 border-b border-gray-300 cursor-move"
                            draggable
                            onDragStart={(e) => dragItem.current = index}
                            onDragEnter={(e) => dragOverItem.current = index}
                            onDragEnd={handleSort}
                            onDragOver={(e) => e.preventDefault()}>
                            <div className='flex flex-col'>
                                <div className='flex flex-row'>
                                    <span className="font-medium flex-1">No: {index + 1}</span>
                                    <button className="hover:text-primary" onClick={(e) => handleEdit(question)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                        </svg>
                                    </button>
                                    <button className="hover:text-primary ms-2" onClick={(e) => handleDelete(question)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>

                                        </button>
                                </div>
                                <span className="font-medium">Description:  {question.question}</span>
                                <span className="font-medium">Servey: {question.surveyTypeName}</span>
                            </div>

                        </li>
                    ))}
                </ul>


            </div>
        </div>
    );
};

export default QuestionEntryForm;
