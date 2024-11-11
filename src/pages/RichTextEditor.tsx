import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichTextEditor: React.FC<{ value: string; onChange: (value: string) => void }> = ({ value, onChange }) => {
    return (
        <ReactQuill
            value={value}
            onChange={onChange}
            modules={{
                toolbar: [
                    [{ header: '1' }, { header: '2' }],
                    ['bold', 'italic', 'underline'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['clean']
                ]
            }}
            className="w-full min-h-[2.5rem] p-2 text-black bg-transparent border-none outline-none"
        />
    );
};

export default RichTextEditor;
