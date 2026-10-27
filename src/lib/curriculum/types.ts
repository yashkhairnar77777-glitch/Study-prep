import { EducationBoard, SubjectCategory } from '../../types';

export interface SyllabusChapter {
  id: string;
  name: string;
  textbookRef: string;
  syllabusTopics: string[];
  learningObjectives: string[];
  coreFormulas?: string[];
}

export interface SyllabusSubjectInfo {
  id: string;
  name: SubjectCategory | string;
  category: SubjectCategory;
  curricula: string[];
  chapters: SyllabusChapter[];
}

export interface SyllabusClassInfo {
  id: string;
  name: string;
  gradeEquivalent: string;
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
