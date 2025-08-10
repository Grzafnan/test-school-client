export interface IAssessment {
    _id: string;
    name: string;
    description: string;
    score?: number;
    level?: string;
    noRetake?: boolean;
    questionsByLevel?: {
        level: string;
        questions: {
            _id: string;
            questionText: string;
            options: { _id: string; text: string; isCorrect: boolean }[];
            timeLimitSeconds: number;
        }[];
    }[];
        __v?: number;
    createdAt?: string; // ISO date
    updatedAt?: string; // ISO date
}



export interface IQuestion {
    _id: string;
    competencyId?: string;
    questionText: string;
    level?: string; // e.g. "A1"
    options: IOption[];
    timeLimitSeconds: number;
    correctAnswer?: string;
    createdAt?: string; // ISO date
    updatedAt?: string; // ISO date
    userId?: string;
    __v?: number;
}


export interface IOption {
    _id: string;
    userId?: string;
    questionId?: string;
    text: string;
    isCorrect: boolean;
    createdAt?: string; // ISO date
    updatedAt?: string; // ISO date
    __v?: number;
}