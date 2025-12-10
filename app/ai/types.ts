export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
}

export const SUGGESTED_QUESTIONS = [
  "재개발과 재건축의 차이점이 뭐야?",
  "조합원 자격 요건에 대해 알려줘",
  "관리처분계획인가 절차는?",
  "정비사업전문관리업자의 역할은?",
];
