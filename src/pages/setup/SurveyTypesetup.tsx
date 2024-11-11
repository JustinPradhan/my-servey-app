import React, { useEffect, useState } from 'react';
import { SurveyType } from '../../api/model/data';
import { UserRepository } from '../../api/repo/UserRepository';
import toast from 'react-hot-toast';

const SurveyTypesetup: React.FC = () => {
    const [surveyTypes, setSurveyTypes] = useState<SurveyType[]>([]);
    const [description, setDescription] = useState<string>('');
    const [isChecked, setIsChecked] = useState<boolean>(true);
    const [isEdit, setEdit] = useState<boolean>(true);
    const [editingSurvey, setEditingSurvey] = useState<SurveyType | null>(null);

    useEffect(() => {
        UserRepository.getSurvey().then(res => {
            setSurveyTypes(res.data);
        }).catch(err => {
            toast.error(err.message);
        })
    }, [])

    const handleAddServey = () => {

        if (editingSurvey) {
            const newSurvey: SurveyType = {
                id: editingSurvey.id, // Simple ID generation
                description,
                active: isChecked,
                deleted: true,
                isEdit: true
            };
            publishToApi(newSurvey);

        } else {
            const newSurvey: SurveyType = {
                id: null, // Simple ID generation
                description,
                active: isChecked,
                deleted: false,
                isEdit: true
            };
            publishToApi(newSurvey);
            // setSurveyTypes([...surveyTypes, newServey]);
        }

    };

    const publishToApi = (serveyType: SurveyType) => {
        UserRepository.setSurvey(serveyType).then(res => {
            if (editingSurvey) {
                setSurveyTypes(surveyTypes.map(survey =>
                    survey.id === res.data.id
                        ? { ...res.data }
                        : survey
                ));
                setEditingSurvey(null);
            } else {
                setSurveyTypes([...surveyTypes, res.data]);
            }

            setDescription('');
            setIsChecked(true);
            toast.success("Success");
        }).catch(err => {
            toast.error(err.message);
        });
    }

    const handleEdit = (survey: SurveyType) => {
        setEdit(survey.isEdit??true);
        setEditingSurvey(survey);
        setDescription(survey.description);
        setIsChecked(survey.active);
    }

    const handleDelete = (survey: SurveyType) =>{
        const confirmed = window.confirm(`Are you sure you want to delete the survey: ${survey.description}?`);
        
        if (confirmed) {
            UserRepository.deleteSurvey(survey.id).then(res =>{
                
                  if(res.data == "Success"){
                    toast.success(res.data)
                    setSurveyTypes(prevSurveyTypes => prevSurveyTypes.filter(s => s.id !== survey.id));
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
                <h1 className="mb-4 text-2xl text-center font-semibold text-black">Servey Type Entry Form</h1>
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
                    <input
                        type="text"
                        value={description}
                        disabled={!isEdit}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    {editingSurvey != null && <label className="block mb-1 text-sm font-semibold text-green-500">Edit -{editingSurvey.description} </label>}
                    {editingSurvey != null && !isEdit && <label className="block mb-1 text-sm font-semibold text-warning">Not allow to change description</label>}
             
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
                    onClick={handleAddServey}
                    className="bg-blue-500 text-white px-4 py-2 mb-4 rounded-md"
                >
                    Add/Edit ServeyType
                </button>

                <h2 className="mb-2 text-xl font-semibold text-black">Servey</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="w-1/12 px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                                    ID
                                </th>
                                <th scope="col" className="w-8/12 px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                                    Description
                                </th>
                                <th scope="col" className="w-1/12 px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                                    Active
                                </th>
                                <th scope="col" className="w-1/12 px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {surveyTypes.length != 0 ? surveyTypes.map((survey) => (
                                <tr key={survey.id}>
                                    <td className="w-1/12 px-6 py-4 whitespace-nowrap text-sm font-medium text-black">{survey.id}</td>
                                    <td className="w-8/12 px-6 py-4 whitespace-nowrap text-sm text-black">{survey.description}</td>
                                    <td className="w-1/12 px-6 py-4 whitespace-nowrap text-sm text-black">{String(survey.active)}</td>
                                    <td className="w-1/12 px-6 py-4 whitespace-nowrap text-sm text-black">
                                        <button className="hover:text-primary" onClick={(e) => handleEdit(survey)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                            </svg>
                                        </button>
                                        <button className="hover:text-primary ms-2" onClick={(e) => handleDelete(survey)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>

                                        </button>
                                    </td>
                                </tr>
                            )) : <tr><td colSpan={12} className='p-6 text-center font-semibold'>No Result</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SurveyTypesetup;
