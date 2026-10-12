import { studyService } from '../../server/studyService.js';
import { orchestrator } from '../../server/providers/orchestrator.js';

interface HandlerEvent {
  path: string;
  httpMethod: string;
  headers: Record<string, string>;
  body: string | null;
}

export const handler = async (event: HandlerEvent) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  // Parse path (e.g. /api/chat or /.netlify/functions/api/chat)
  const cleanPath = event.path.replace(/^\/\.netlify\/functions\/api/, '').replace(/^\/api/, '');

  try {
    if (event.httpMethod === 'GET' && (cleanPath === '/providers/status' || cleanPath === 'providers/status')) {
      const status = orchestrator.getStatus();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, status }),
      };
    }

    if (event.httpMethod === 'GET' && (cleanPath === '/health' || cleanPath === 'health')) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ status: 'ok', name: 'ORYQEN STUDY AI Netlify Function' }),
      };
    }

    const payload = event.body ? JSON.parse(event.body) : {};

    if (event.httpMethod === 'POST') {
      if (cleanPath === '/chat' || cleanPath === 'chat') {
        const response = await studyService.chat(payload);
        return { statusCode: 200, headers, body: JSON.stringify({ success: true, data: response }) };
      }

      if (cleanPath === '/solve-photo' || cleanPath === 'solve-photo') {
        const response = await studyService.solvePhoto(payload);
        return { statusCode: 200, headers, body: JSON.stringify({ success: true, data: response }) };
      }

      if (cleanPath === '/generate-exam' || cleanPath === 'generate-exam') {
        const response = await studyService.generateExamPaper(payload);
        return { statusCode: 200, headers, body: JSON.stringify({ success: true, data: response }) };
      }

      if (cleanPath === '/evaluate-answer' || cleanPath === 'evaluate-answer') {
        const response = await studyService.evaluateSubjectiveAnswer(payload);
        return { statusCode: 200, headers, body: JSON.stringify({ success: true, data: response }) };
      }

      if (cleanPath === '/analyze-doc' || cleanPath === 'analyze-doc') {
        const response = await studyService.analyzeDocument(payload);
        return { statusCode: 200, headers, body: JSON.stringify({ success: true, data: response }) };
      }
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ success: false, error: `Endpoint not found: ${cleanPath}` }),
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Netlify Function Error';
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: message }),
    };
  }
};
