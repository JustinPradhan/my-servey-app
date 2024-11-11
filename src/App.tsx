import { useEffect } from "react";
import { UserRepository } from "./api/repo/UserRepository";

import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/DashboardForm";
import { Navigate, Route, Routes } from "react-router-dom";
import SurveyForm from "./pages/SurveyForm";
import QuestionEntryForm from "./pages/setup/QuestionEntryForm";
import QuestionComponent from "./components/QuestionComponent";
import SurveyTypesetup from "./pages/setup/SurveyTypesetup";
import TextEditor from "./pages/TextEditor";
import Notepad from "./pages/Notepad";



function App() {

  useEffect(()=>{
    UserRepository.getPublicIpAddress().then(ip => console.log('My public IP address is:', ip));

  },[])
  return (
    <div className="p-6">
      <Toaster
        position="top-right"
        reverseOrder={false}
        containerClassName="overflow-auto"
      />
          <Routes>
          <Route path="/" element={<TextEditor />} />
          <Route path="/survey" element={<SurveyForm />} />
          <Route path="/question" element={<QuestionEntryForm />} />
          <Route path="/type" element={<SurveyTypesetup />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
    </div>
   
  )
}

export default App
