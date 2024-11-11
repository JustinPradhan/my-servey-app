import React, { useRef, useEffect, ChangeEvent, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Define types for the data structure
interface VitalSigns {
    temperature: string;
    bloodPressure: string;
    heartRate: string;
    respiratoryRate: string;
}

interface SystemicExamination {
    cardiovascular: string;
    respiratory: string;
    neurological: string;
}

interface PhysicalExamination {
    generalAppearance: string;
    vitalSigns: VitalSigns;
    systemicExamination: SystemicExamination;
}

interface PersonInform {
    fullName: string;
    dateOfBirth: string;
    gender: string;
    nationality: string;
    maritalStatus: string;
    physicalExamination: PhysicalExamination;
    other:string;
}

// Initial data
const personInform: PersonInform = {
    "fullName": "John Doe",
    "dateOfBirth": "1990-01-15",
    "gender": "Male",
    "nationality": "American",
    "maritalStatus": "Single",
    "physicalExamination": {
        "generalAppearance": "Alert and oriented",
        "vitalSigns": {
            "temperature": "98.6°F",
            "bloodPressure": "120/80 mmHg",
            "heartRate": "72 bpm",
            "respiratoryRate": "16 bpm"
        },
        "systemicExamination": {
            "cardiovascular": "No murmurs",
            "respiratory": "Clear to auscultation",
            "neurological": "No focal deficits"
        }
    },
    "other":"",
};

// Flatten the nested object into a single level object
const flattenObject = (obj: any, prefix = ''): Record<string, string> => {
    let result: Record<string, string> = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            const newKey = prefix ? `${prefix}.${key}` : key;
            if (typeof value === 'object' && value !== null) {
                Object.assign(result, flattenObject(value, newKey));
            } else {
                result[newKey] = value;
            }
        }
    }
    return result;
};

// Unflatten the object back to its nested form
const unflattenObject = (data: Record<string, string>): any => {
    const result: any = {};
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const value = data[key];
            const keys = key.split('.');
            keys.reduce((acc, part, index) => {
                if (index === keys.length - 1) {
                    acc[part] = value;
                } else {
                    acc[part] = acc[part] || {};
                }
                return acc[part];
            }, result);
        }
    }
    return result;
};

const AutoSuggestTextarea: React.FC<{ value: string, onChange: (value: string) => void }> = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const [caretPosition, setCaretPosition] = useState<number>(0);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Dummy suggestions data for demonstration
    const cardiovascularSuggestions = [
        "Normal",
        "Abnormal",
        "Murmurs",
        "No murmurs",
        "Irregular",
        "Regular"
    ];

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const inputValue = e.target.value;
        setCaretPosition(e.target.selectionStart || 0);
        onChange(inputValue);

        // Filtering suggestions based on input
        setFilteredSuggestions(cardiovascularSuggestions.filter(suggestion =>
            suggestion.toLowerCase().includes(inputValue.toLowerCase())
        ));
        setIsOpen(true);
    };

    const handleSuggestionClick = (suggestion: string) => {
        if (textareaRef.current) {
            const currentValue = textareaRef.current.value;
            const beforeCaret = currentValue.substring(0, caretPosition);
            const afterCaret = currentValue.substring(caretPosition);
            onChange(`${beforeCaret}${suggestion}${afterCaret}`);
            setIsOpen(false);
            textareaRef.current.focus();
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
     
        if (e.key === ' ') {
           
            // Re-filter suggestions when space key is pressed
            const currentValue = textareaRef.current?.value || '';

            setFilteredSuggestions(cardiovascularSuggestions.filter(suggestion =>
                suggestion.toLowerCase().includes(currentValue.toLowerCase())
            ));
            setIsOpen(true);
        }
    };

    return (
        <div className="relative">
            <textarea
                value={value}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                ref={textareaRef}
                className="w-full min-h-[2.5rem] p-2 pl-4 text-black border-none bg-transparent outline-none resize-none"
            />
            {isOpen && filteredSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-sm shadow-lg">
                    {filteredSuggestions.map((suggestion, index) => (
                        <div
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="p-2 hover:bg-gray-200 cursor-pointer"
                        >
                            {suggestion}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


function TextEditor() {

    const componentRef = useRef<HTMLDivElement>(null);

    const printPDF = async () => {
      if (componentRef.current) {
        // Capture the component as an image
        const canvas = await html2canvas(componentRef.current);
        const imgData = canvas.toDataURL('image/png');
  
        // Create a PDF and add the captured image
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('screenshot.pdf');
      }
    };
    // Create a ref map to handle multiple textareas
    const textareaRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>({});

    const [editorContent, setEditorContent] = useState<Record<string, string>>(
        flattenObject(personInform)
    );

    const adjustHeight = (key: string) => {
        const textarea = textareaRefs.current[key];
        if (textarea) {
            textarea.style.height = 'auto'; // Reset height to auto
            textarea.style.height = `${textarea.scrollHeight}px`; // Set height based on content
        }
    };

    // Handle change event for textareas
    const handleChange = (key: string) => (event: ChangeEvent<HTMLTextAreaElement>) => {
        setEditorContent(prevContent => ({
            ...prevContent,
            [key]: event.target.value
        }));
        adjustHeight(key);
    };

    useEffect(() => {
        // Adjust the height for all textareas on mount
        Object.keys(editorContent).forEach(key => {
            adjustHeight(key);
        });
    }, [editorContent]);

    const renderTextAreas = (prefix: string, obj: Record<string, any>) => {
        return Object.keys(obj).map(key => {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            const value = obj[key];
            if (typeof value === 'object' && value !== null) {
                return (
                    <div key={fullKey} className="ml-4">
                        <h3 className="font-medium text-black mr-4 w-32">
                            {key.charAt(0).toUpperCase() + key.slice(1)}:
                        </h3>
                        {renderTextAreas(fullKey, value)}
                    </div>
                );
            } else if (fullKey.endsWith('cardiovascular')) {
                return (
                    <div key={fullKey} className="flex items-center mb-2 ml-4">
                        <label
                            htmlFor={fullKey}
                            className="mr-4 w-32 text-gray-700 font-medium"
                        >
                            {fullKey.split('.').pop()?.charAt(0).toUpperCase() + fullKey.split('.').pop()?.slice(1)}:
                        </label>
                        <AutoSuggestTextarea
                            value={editorContent[fullKey] || ''}
                            onChange={(value) => setEditorContent(prevContent => ({
                                ...prevContent,
                                [fullKey]: value
                            }))}
                        />
                    </div>
                );
            } else {
                return (
                    <div key={fullKey} className="flex items-center mb-2 ml-4">
                        <label
                            htmlFor={fullKey}
                            className="mr-4 w-32 text-black font-medium"
                        >
                            {fullKey.split('.').pop()?.charAt(0).toUpperCase() + fullKey.split('.').pop()?.slice(1)}:
                        </label>
                        <textarea
                            id={fullKey}
                            name={fullKey}
                            value={editorContent[fullKey] || ''}
                            ref={el => (textareaRefs.current[fullKey] = el)}
                            onChange={handleChange(fullKey)}
                            rows={1}  // Initial number of rows
                            className="w-full min-h-[2.5rem] p-2 pl-4 text-black border-none bg-transparent  outline-none resize-none"
                        />
                    </div>
                );
            }
        });
    };

    const handleSave = () => {
        const nestedData = unflattenObject(editorContent);
        downloadJSON(nestedData);
    };

    return (
        <div className="flex flex-col min-h-screen">
        <form className="flex-grow space-y-4" >
            <div  ref={componentRef} className="border-2 border-gray-300 p-4 rounded-sm" style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
                <div className="flex items-center text-center justify-center mb-4">
                    <h1 className="text-black font-semibold text-center flex-1"><u> OPDss BOOK </u></h1>
                    <p className="text-right items-end justify-end">
                        <span>Date :</span> <span className="text-black">2024-05-01</span>
                    </p>
                </div>
                {renderTextAreas('', unflattenObject(editorContent))}
            </div>
            <div className="flex justify-end mt-4">
                    <button
                        type="button"
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded-sm"
                    >
                        Save JSON
                    </button>
                </div>
        </form>
    </div>
    );
}

const downloadJSON = (data: any) => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'personInform.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export default TextEditor;
