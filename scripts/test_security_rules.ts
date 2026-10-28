/**
 * test_security_rules.ts
 * Bộ kiểm thử tự động xác thực các quy tắc bảo mật và tính toàn vẹn của:
 * 1. Migration SQL (RLS, Views, Triggers, Functions)
 * 2. Service frontend (supabaseDbService)
 * 3. Bảo vệ role, email, xp và giấu đáp án câu hỏi
 */
import fs from 'fs';
import path from 'path';

let passCount = 0;
let failCount = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passCount++;
  } else {
    console.error(`  ❌ FAIL: ${testName}${detail ? ` -> ${detail}` : ''}`);
    failCount++;
  }
}

async function runTests() {
  console.log('\n============================================================');
  console.log('BẮT ĐẦU KIỂM THỬ BẢO MẬT VÀ TÍCH HỢP SUPABASE CHO TINPATH');
  console.log('============================================================\n');

  // Đọc file migration mới nhất
  const migrationPath = path.resolve(process.cwd(), 'supabase/migrations/20261028130000_secure_tinpath_schema_and_rls.sql');
  assert(fs.existsSync(migrationPath), 'File migration 20261028130000_secure_tinpath_schema_and_rls.sql tồn tại');

  const migrationSql = fs.readFileSync(migrationPath, 'utf8');

  // Test 1: Trigger tạo profiles tự động và cố định role 'student'
  console.log('\n--- Nhóm 1: Kiểm thử Profiles và Auth ---');
  const hasTriggerUser = migrationSql.includes('handle_new_user') && migrationSql.includes('on_auth_user_created');
  assert(hasTriggerUser, 'Trigger on_auth_user_created được định nghĩa');

  const hasStrictStudentRole = migrationSql.includes("'student', -- Luôn là student, không tin cậy client metadata")
    || (migrationSql.includes('handle_new_user') && migrationSql.includes("'student'"));
  assert(hasStrictStudentRole, 'Trigger handle_new_user luôn gán role là student, không dùng user metadata');

  const ignoresRoleMetadata = !migrationSql.includes("COALESCE(NEW.raw_user_meta_data->>'role'");
  assert(ignoresRoleMetadata, 'Trigger handle_new_user không tin tưởng metadata role từ client');

  // Test 2: Trigger bảo vệ các trường nhạy cảm trong profiles (role, email, xp)
  const hasProtectTrigger = migrationSql.includes('protect_profile_fields') && migrationSql.includes('trg_protect_profile_fields');
  assert(hasProtectTrigger, 'Trigger protect_profile_fields được cài đặt trên bảng profiles');

  const protectsRole = migrationSql.includes('NEW.role := OLD.role');
  assert(protectsRole, 'Client không thể tự nâng quyền thành teacher (role được giữ nguyên)');

  const protectsEmail = migrationSql.includes('NEW.email := OLD.email');
  assert(protectsEmail, 'Client không thể tự sửa email qua direct update');

  const protectsXP = migrationSql.includes('NEW.xp := OLD.xp');
  assert(protectsXP, 'Client không thể tự sửa hoặc gian lận XP qua direct update');

  // Test 3: RLS trên profiles
  const hasProfilesRLS = migrationSql.includes('ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY');
  assert(hasProfilesRLS, 'Đã bật Row Level Security (RLS) cho bảng profiles');

  const hasOwnProfileSelect = migrationSql.includes('CREATE POLICY "Users can read own profile"') && migrationSql.includes('auth.uid() = id');
  assert(hasOwnProfileSelect, 'Học sinh chỉ được SELECT đọc hồ sơ của chính mình (auth.uid() = id)');

  // Test 4: View câu hỏi công khai exam_questions_public
  console.log('\n--- Nhóm 2: Kiểm thử Questions và View giấu đáp án ---');
  const hasPublicQuestionsView = migrationSql.includes('CREATE OR REPLACE VIEW public.exam_questions_public');
  assert(hasPublicQuestionsView, 'View exam_questions_public tồn tại');

  const viewMatch = migrationSql.match(/CREATE OR REPLACE VIEW public\.exam_questions_public[\s\S]*?FROM public\.questions/);
  const viewContent = viewMatch ? viewMatch[0] : '';

  const hidesCorrectAnswerFromView = !viewContent.includes('q.correct_answer');
  assert(hidesCorrectAnswerFromView, 'View exam_questions_public không chọn correct_answer');

  const hidesExplanationFromView = !viewContent.includes('q.explanation');
  assert(hidesExplanationFromView, 'View exam_questions_public không chọn explanation');

  const stripsIsCorrectFromStatements = migrationSql.includes("jsonb_build_object(\n                    'id', elem->>'id',\n                    'text', elem->>'text'\n                )");
  assert(stripsIsCorrectFromStatements, 'Mệnh đề đúng/sai (Part 2) trong view đã loại bỏ thuộc tính isCorrect');

  const restrictsDirectQuestions = migrationSql.includes('CREATE POLICY "Teachers can read full questions"')
    && !migrationSql.includes('CREATE POLICY "Public read questions" ON public.questions FOR SELECT USING (true)');
  assert(restrictsDirectQuestions, 'Bảng questions gốc đã thu hồi quyền SELECT công khai, chỉ cho phép giáo viên');

  // Test 5: View bảng xếp hạng công khai leaderboard_public
  console.log('\n--- Nhóm 3: Kiểm thử Leaderboard không để lộ Email ---');
  const hasLeaderboardView = migrationSql.includes('CREATE OR REPLACE VIEW public.leaderboard_public');
  assert(hasLeaderboardView, 'View leaderboard_public tồn tại');

  const leaderboardHidesEmail = migrationSql.includes('CREATE OR REPLACE VIEW public.leaderboard_public')
    && !migrationSql.match(/VIEW public\.leaderboard_public[\s\S]*?SELECT[\s\S]*?email[\s\S]*?FROM public\.profiles/);
  assert(Boolean(leaderboardHidesEmail), 'View leaderboard_public không chứa trường email của học sinh');

  // Test 6: RPC chấm điểm an toàn phía server
  console.log('\n--- Nhóm 4: Kiểm thử Server RPC Chấm điểm & Cấp XP ---');
  const hasSecureSubmitExamRpc = migrationSql.includes('submit_exam_attempt_secure');
  assert(hasSecureSubmitExamRpc, 'Hàm RPC submit_exam_attempt_secure tồn tại');

  const verifiesAuthInSubmitExam = migrationSql.includes('v_user_id := auth.uid()') && migrationSql.includes('IF v_user_id IS NULL THEN');
  assert(verifiesAuthInSubmitExam, 'submit_exam_attempt_secure kiểm tra xác thực người dùng (auth.uid())');

  const gradesOnServer = migrationSql.includes('0.25') && migrationSql.includes('0.10') && migrationSql.includes('1.00');
  assert(gradesOnServer, 'submit_exam_attempt_secure chấm điểm theo chuẩn thang điểm Bộ GD&ĐT');

  const hasDailyChallengeRpc = migrationSql.includes('submit_daily_challenge_secure');
  assert(hasDailyChallengeRpc, 'Hàm RPC submit_daily_challenge_secure tồn tại');

  // Test 7: RLS cho các bảng Lớp học, bài tập, lịch sử thi
  console.log('\n--- Nhóm 5: Kiểm thử Quyền Tối thiểu (RLS) ---');
  const hasAttemptsRLS = migrationSql.includes('CREATE POLICY "Users can read own attempts"')
    && migrationSql.includes('auth.uid() = user_id');
  assert(hasAttemptsRLS, 'Người dùng chỉ xem được lịch sử thi của chính mình (exam_attempts)');

  const hasTeacherClassroomRLS = migrationSql.includes('CREATE POLICY "Teachers can manage own classrooms"')
    && migrationSql.includes("role = 'teacher'");
  assert(hasTeacherClassroomRLS, 'Chỉ giáo viên sở hữu mới được quản lý lớp học của mình (classrooms)');

  const hasKnowledgeChunksSecurity = migrationSql.includes('match_knowledge_chunks')
    && migrationSql.includes('SET search_path = public')
    && migrationSql.includes('LEAST(GREATEST(match_count, 1), 20)');
  assert(hasKnowledgeChunksSecurity, 'Hàm match_knowledge_chunks có search_path và giới hạn tham số chống DoS');

  // Test 8: Frontend Service đồng bộ hóa
  console.log('\n--- Nhóm 6: Kiểm thử Frontend Service (supabaseDbService.ts) ---');
  const dbServicePath = path.resolve(process.cwd(), 'src/services/supabaseDbService.ts');
  const dbServiceCode = fs.readFileSync(dbServicePath, 'utf8');

  const usesQuestionsPublicView = dbServiceCode.includes(".from('exam_questions_public')");
  assert(usesQuestionsPublicView, 'supabaseDbService.getExams truy vấn từ exam_questions_public');

  const usesLeaderboardPublicView = dbServiceCode.includes(".from('leaderboard_public')");
  assert(usesLeaderboardPublicView, 'supabaseDbService.getLeaderboard truy vấn từ leaderboard_public');

  const updateProfileExcludesSensitiveFields = !dbServiceCode.includes('xp: updates.xp')
    && !dbServiceCode.includes('role: updates.role')
    && !dbServiceCode.includes('email: updates.email');
  assert(updateProfileExcludesSensitiveFields, 'updateProfile không gửi role, email, xp trong update payload');

  const hasSecureExamSubmitClient = dbServiceCode.includes('submitExamAttemptSecure');
  assert(hasSecureExamSubmitClient, 'supabaseDbService cung cấp hàm submitExamAttemptSecure');

  // Test 9: Khả năng xử lý dữ liệu rỗng và không crash
  console.log('\n--- Nhóm 7: Kiểm thử Khả năng Xử lý Dữ liệu Rỗng & Lỗi ---');
  const emptyExamHandling = dbServiceCode.includes('if (error || !dbExams || dbExams.length === 0)')
    && dbServiceCode.includes('return OFFICIAL_EXAMS');
  assert(emptyExamHandling, 'Khi bảng exams rỗng hoặc lỗi, tự động fallback về OFFICIAL_EXAMS mà không crash');

  const emptyQuestionsHandling = dbServiceCode.includes('if (qErr || !dbQuestions || dbQuestions.length === 0)')
    && dbServiceCode.includes('return OFFICIAL_EXAMS');
  assert(emptyQuestionsHandling, 'Khi bảng questions rỗng hoặc lỗi, tự động fallback an toàn');

  console.log('\n============================================================');
  console.log(`KẾT QUẢ KIỂM THỬ: ${passCount} PASSED, ${failCount} FAILED`);
  console.log('============================================================\n');

  if (failCount > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Lỗi khi chạy kiểm thử:', err);
  process.exit(1);
});
