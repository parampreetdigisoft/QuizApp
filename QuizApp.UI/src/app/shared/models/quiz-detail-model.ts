export interface QuizDetailModel {
    quizId: number,
    title: string,
    description: string,
    createdBy: number,
    isActive: boolean,
    timeAllowed: number,
    points: number,
    createdAt: Date

}

export interface CreateQuizModel {
    quizId: number,
    title: string,
    description: string,
    timeAllowed: number
}

export interface QuizAttemptsDetailModel {
    id: number,
    quizId: number,
    userId: number,
    attemptAt: Date,
    totalQuestions: number,
    userName: string,
    score: number
}

export interface QuestionDetailModel {
    id: number,
    questionText: string,
    quizId: number,
    points: number,
    answerOptions: AnswerOptionModel[]
}

export interface AnswerOptionModel {
    id: number,
    text: string,
    isCorrect: boolean,
    questionId: number
}

export interface UserAnswerDetailModel {

    questionId: number,
    selectedOptionId: number,
    isCorrect: boolean
}

export interface QuestionDifficulty {
    questionText: string;
    correctPercentage: number;
}

export interface QuizDashboardDetailModel {
    quizId: number,
    title: string,
    totalAttempts: number,
    userCount: number,
    highestScorerName: string,
    highestScore: number,
    averageScore: number,
    mostDifficultQuestion: string,
    difficultQuestionAccuracy: number
}

export interface OptionsDetailModel {
    id: number,
    text: string,
    isCorrect: boolean,
    questionId: number
}


export interface CreateOptionDetialModel {
    id: number,
    optionText: string,
    isCorrect: boolean,
    questionId: number
}


export interface QuizDashboardViewModel {
    quizId: number,
    title: string,
    description: string,
    timeAllowed: number | null,
    points: number | null,
    obtainedScore: number,
    percentage: number,
    totalScore: number,
    userAttempt: QuizAttemptsDetailModel | null | undefined
}

export interface UserAnswerModel {
    questionId: number,
    selectedOptionId: number,
    isCorrect: boolean
}

export interface QuizAttemptModel {
    quizId: number,
    userId: number,
    score: number,
    totalQuestions: number
}