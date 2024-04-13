//pages
import { Route, Routes, Navigate } from "react-router-dom";
import Authentication from "./pages/Authentication";
import Quiz from "./pages/Quiz";

//components
import LoginForm from "./components/LoginForm";
import QuizAnswer from "./components/QuizAnswer";
import QuizHome from "./components/QuizHome";
import QuizReview from "./components/QuizReview";
import QuizSearchDetail from "./components/QuizSearchDetail";
import QuizDetailReview from "./components/QuizDetailReview";
import QuizSearch from "./components/QuizSearch";
import RegisterUser from "./components/RegisterUser";
import EditUser from "./components/EditUser";

export default function App() {
  return (
    <Routes>
      <Route index element={<Navigate to="/quiz-app/login" replace />} />
      <Route path="quiz-app/login" element={<LoginForm />} />
      <Route path="/register/user" element={<RegisterUser />} />

      <Route path="/*" element={<Authentication />}>
        <Route path="/*" element={<Quiz />}>
          <Route path="quiz/home" element={<QuizHome />} />
          <Route path="quiz/answer/:genreId/:num" element={<QuizAnswer />} />
          <Route path="quiz/review" element={<QuizReview />} />
          <Route path="quiz/detail/review" element={<QuizDetailReview />} />
          <Route path="quiz/search" element={<QuizSearch />} />
          <Route path="quiz/search/detail" element={<QuizSearchDetail />} />
          <Route path="edit/user" element={<EditUser />} />
        </Route>
      </Route>
    </Routes>
  );
}
