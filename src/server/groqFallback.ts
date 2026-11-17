/**
 * groqFallback.ts — Groq AI Fallback khi Gemini 503/429
 *
 * Model: llama-3.3-70b-versatile (miễn phí, ~300 tok/s, không bị overload)
 * Tự động được gọi từ gemini.ts khi gặp lỗi 503/429
 */
import Groq from 'groq-sdk';

let groqClient: Groq | null = null;

function getGroqClient(): Groq | null {
  const apiKey = (process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY)?.trim();
  if (!apiKey) return null;
  if (!groqClient) {
    groqClient = new Groq({ apiKey });
  }
  return groqClient;
}

export function isGroqAvailable(): boolean {
  return !!(process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY);
}

/**
 * Groq Tutor — Thay thế Gemini khi 503
 */
export async function askGroqTutor(params: {
  topicTitle: string;
  userQuestion: string;
  studentContext?: string;
  sgkContext?: string;
}): Promise<{ text: string; modelUsed: string }> {
  const client = getGroqClient();
  if (!client) throw new Error('GROQ_API_KEY chua duoc cau hinh');

  const hasContext = params.sgkContext && params.sgkContext.trim().length > 0;

  const systemPrompt = `Ban la Gia su AI Tin hoc chuyen trach chuong trinh GDPT 2018 cua nen tang TinPath (Viet Nam).
Nhiem vu: Giai thich chi tiet, chinh xac theo dung sach giao khoa va chuong trinh Bo GD&DT.
Phong cach: Tung buoc ro rang, vi du thuc te, code Python/SQL chuan, dong vien hoc sinh.
Luon tra loi bang tieng Viet chuan muc, day du.
${hasContext ? 'QUAN TRONG: Chi tra loi dua tren tai lieu SGK da cung cap, trich dan ro nguon.' : ''}`;

  const contextSection = hasContext
    ? '\n\nTAI LIEU SGK THAM KHAO:\n' + params.sgkContext + '\n\n---'
    : '';

  const userPrompt = `Chu de hoc tap: ${params.topicTitle}
${params.studentContext ? 'Boi canh hoc sinh: ' + params.studentContext : ''}${contextSection}

Cau hoi hoc sinh:
${params.userQuestion}`;

  const completion = await client.chat.completions.create({
    model: 'openai/gpt-oss-20b',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 1500,
  });

  const text = completion.choices[0]?.message?.content || 'Khong co phan hoi tu AI.';
  return { text, modelUsed: 'Groq GPT-OSS 20B (Fallback)' };
}

/**
 * Groq Fast Hint
 */
export async function askGroqFastHint(
  questionContent: string,
  currentOptions: string
): Promise<{ hint: string; modelUsed: string }> {
  const client = getGroqClient();
  if (!client) throw new Error('GROQ_API_KEY chua duoc cau hinh');

  const completion = await client.chat.completions.create({
    model: 'openai/gpt-oss-20b',
    messages: [
      {
        role: 'system',
        content: 'Ban la tro ly goi y nhanh trong phong thi Tin hoc. Dua ra goi y tu duy ngan gon (duoi 60 tu), suc tich, khong dua thang dap an. Tra loi bang tieng Viet.',
      },
      {
        role: 'user',
        content: `Hay goi y manh moi tu duy ngan gon (duoi 60 tu) KHONG tiet lo dap an A/B/C/D:\nCau hoi: ${questionContent}\nCac lua chon:\n${currentOptions}`,
      },
    ],
    temperature: 0.5,
    max_tokens: 120,
  });

  return {
    hint: completion.choices[0]?.message?.content || '',
    modelUsed: 'Groq GPT-OSS 20B (Fallback)',
  };
}

/**
 * Groq Study Plan
 */
export async function askGroqStudyPlan(prompt: string): Promise<{ rawJson: string; modelUsed: string }> {
  const client = getGroqClient();
  if (!client) throw new Error('GROQ_API_KEY chua duoc cau hinh');

  const completion = await client.chat.completions.create({
    model: 'openai/gpt-oss-20b',
    messages: [
      {
        role: 'system',
        content: 'Ban la chuyen gia co van hoc tap mon Tin hoc THPT. Luon tra ve dinh dang JSON hop le, khong co text ngoai JSON.',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.3,
    max_tokens: 2000,
    response_format: { type: 'json_object' },
  });

  return {
    rawJson: completion.choices[0]?.message?.content || '{}',
    modelUsed: 'Groq GPT-OSS 20B (Fallback)',
  };
}

/**
 * Groq Diagnostic Analysis
 */
export async function askGroqDiagnosticAnalysis(prompt: string): Promise<{ rawJson: string; modelUsed: string }> {
  const client = getGroqClient();
  if (!client) throw new Error('GROQ_API_KEY chua duoc cau hinh');

  const completion = await client.chat.completions.create({
    model: 'openai/gpt-oss-20b',
    messages: [
      {
        role: 'system',
        content: 'Ban la chuyen gia su pham va khao thi mon Tin hoc THPT. Luon tra ve JSON hop le, khong co text ngoai JSON.',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.3,
    max_tokens: 2000,
    response_format: { type: 'json_object' },
  });

  return {
    rawJson: completion.choices[0]?.message?.content || '{}',
    modelUsed: 'Groq GPT-OSS 20B (Fallback)',
  };
}
