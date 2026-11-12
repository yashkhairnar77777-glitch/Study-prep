import { EducationBoard, SubjectCategory } from '../../types';

export interface SyllabusChapter {
  id: string;
  name: string;
  textbookRef: string;
  syllabusTopics: string[];
  learningObjectives: string[];
  coreFormulas?: string[];

  // Scalable NCERT learning engine fields
  textbookName?: string;
  edition?: string;
  mode?: 'foundation' | 'secondary' | 'standard';
  overviewSummary?: string;
  importantDefinitions?: string[];
  keyConcepts?: string[];
  competencyQuestions?: string[];
  caseBasedQuestions?: string[];
  mentalMathTips?: string[];
  vocabularyWords?: { word: string; meaning: string; example?: string }[];
  sourceAvailable?: boolean;
}

export interface SyllabusSubjectInfo {
  id: string;
  name: SubjectCategory | string;
  category: SubjectCategory;
  curricula: string[];
  textbookName?: string;
  edition?: string;
  subjectCode?: string;
  sourceAvailable?: boolean;
  chapters: SyllabusChapter[];
}

export interface SyllabusClassInfo {
  id: string;
  name: string;
  gradeEquivalent: string;
  mode?: 'foundation' | 'secondary';
  subjects: SyllabusSubjectInfo[];
}

export interface SyllabusBoardInfo {
  id: EducationBoard;
  name: string;
  shortName: string;
  jurisdiction: string;
  academicYears: string[];
  classes: SyllabusClassInfo[];
}
