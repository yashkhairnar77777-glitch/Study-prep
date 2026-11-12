import { EducationBoard } from '../types';
import {
  SyllabusChapter,
  SyllabusSubjectInfo,
  SyllabusClassInfo,
  SyllabusBoardInfo,
} from './curriculum/types';

import { cbseClass5 } from './curriculum/cbseClass5';
import { cbseClass6 } from './curriculum/cbseClass6';
import { cbseClass7 } from './curriculum/cbseClass7';
import { cbseClass8 } from './curriculum/cbseClass8';
import { cbseClass9 } from './curriculum/cbseClass9';
import { cbseClass10 } from './curriculum/cbseClass10';
import { cbseClass11 } from './curriculum/cbseClass11';
import { cbseClass12 } from './curriculum/cbseClass12';
import { boardJEE, boardNEET, boardUPSC, boardMSBSHSE } from './curriculum/competitiveExams';
import { otherBoards } from './curriculum/otherBoards';

export type {
  SyllabusChapter,
  SyllabusSubjectInfo,
  SyllabusClassInfo,
  SyllabusBoardInfo,
};

export const SYLLABUS_REGISTRY: SyllabusBoardInfo[] = [
  // 1. CBSE / NCERT (Classes 5 to 12)
  {
    id: 'CBSE',
    name: 'CBSE / NCERT (National Board — Classes 5 to 12)',
    shortName: 'CBSE / NCERT',
    jurisdiction: 'National (India & International Affiliated Schools)',
    academicYears: ['2025–2026', '2026–2027'],
    classes: [
      cbseClass5,
      cbseClass6,
      cbseClass7,
      cbseClass8,
      cbseClass9,
      cbseClass10,
      cbseClass11,
      cbseClass12,
    ],
  },
  // 2. Competitive Examinations
  boardJEE,
  boardNEET,
  boardUPSC,
  // 3. State Board (MSBSHSE Balbharati)
  boardMSBSHSE,
  // 4. ICSE, 5. Cambridge, 6. IB, 7. Custom
  ...otherBoards,
];

export function getSyllabusBoard(boardId: EducationBoard): SyllabusBoardInfo | undefined {
  return SYLLABUS_REGISTRY.find(b => b.id === boardId) || SYLLABUS_REGISTRY[0];
}

export function getAllBoards(): { id: EducationBoard; name: string; shortName: string }[] {
  return SYLLABUS_REGISTRY.map(b => ({
    id: b.id,
    name: b.name,
    shortName: b.shortName,
  }));
}
