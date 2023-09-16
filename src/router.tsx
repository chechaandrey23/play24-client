import {ErrorPage} from './pages/ErrorPage';
import {LoginPage} from './pages/LoginPage';
import {RegistrationPage} from './pages/RegistrationPage';
import {HomePage} from './pages/HomePage';

import {UserQuizsPage} from './pages/UserQuizsPage';
import {UserQuizQuestionsPage} from './pages/UserQuizQuestionsPage';
import {UserQuestionItemPage} from './pages/UserQuestionItemPage';
import {UserQuizResultsPage} from './pages/UserQuizResultsPage';
import {AdminQuizsPage} from './pages/AdminQuizsPage';
import {AdminQuizQuestionsPage} from './pages/AdminQuizQuestionsPage';
import {AdminQuizResultsPage} from './pages/AdminQuizResultsPage';
import {UserQuizStartPage} from './pages/UserQuizStartPage';
import {UserQuizFinishPage} from './pages/UserQuizFinishPage';

export const router = [
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: '/registration',
    element: <RegistrationPage />
  },

  {
    path: 'user/quizs',
    element: <UserQuizsPage />
  },
  {
    path: 'user/quiz/:quizId/start',
    element: <UserQuizStartPage />
  },
  {
    path: 'user/quiz/:quizId/finish/:attemptId',
    element: <UserQuizFinishPage />
  },
  //{
  //  path: 'user/quiz-questions/:quizId/:attemptId',
  //  element: <UserQuizQuestionsPage />
  //},
  {
    path: 'user/quiz-questions/:quizId/:questionId/:attemptId',
    element: <UserQuestionItemPage />
  },
  {
    path: 'user/quiz-results/:quizId',
    element: <UserQuizResultsPage />
  },

  {
    path: 'admin/quizs',
    element: <AdminQuizsPage />
  },
  {
    path: 'admin/quiz-questions/:quizId',
    element: <AdminQuizQuestionsPage />
  },
  {
    path: 'admin/quiz-results/:quizId',
    element: <AdminQuizResultsPage />
  },
];
