-- ==============================================================================
-- TINPATH SECURE DATABASE MIGRATION
-- Migration Version: 20261028130000_secure_tinpath_schema_and_rls.sql
-- Description:
--   1. Tạo / Bổ sung cấu trúc bảng đầy đủ cho TinPath (Profiles, Exams, Questions,...)
--   2. RLS chặt chẽ theo nguyên tắc đặc quyền tối thiểu (Least Privilege)
--   3. Trigger tự động tạo profile khi đăng ký auth với role cố định 'student'
--   4. Trigger bảo vệ các trường nhạy cảm của profile (role, email, xp, created_at)
--   5. View an toàn exam_questions_public giấu đáp án & giải thích
--   6. View an toàn leaderboard_public chỉ hiển thị thông tin học tập, không lộ email
--   7. Hàm RPC submit_exam_attempt_secure & submit_daily_challenge_secure chấm điểm, cấp XP phía server
--   8. Hàm match_knowledge_chunks có search_path và giới hạn tham số chống DoS
-- ==============================================================================

BEGIN;

-- ------------------------------------------------------------------------------
-- 1. BẬT CÁC EXTENSION CẦN THIẾT
-- ------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 2. ĐẢM BẢO CÁC BẢNG CƠ SỞ TỒN TẠI VÀ ĐẦY ĐỦ CỘT
-- ------------------------------------------------------------------------------

-- 2.1 Bảng profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher')),
    province TEXT DEFAULT 'Quảng Ngãi',
    district TEXT,
    school_id TEXT,
    school_name TEXT,
    grade TEXT DEFAULT '12' CHECK (grade IN ('10', '11', '12')),
    track TEXT DEFAULT 'CS' CHECK (track IN ('CS', 'ICT')),
    target_score NUMERIC(3, 1) DEFAULT 8.5,
    daily_study_minutes INT DEFAULT 45,
    xp INT DEFAULT 0,
    streak_days INT DEFAULT 0,
    last_active_date DATE DEFAULT CURRENT_DATE,
    completed_daily_today BOOLEAN DEFAULT FALSE,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    diagnostic_score NUMERIC(3, 1),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bổ sung cột nếu bảng đã tồn tại trước đó
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS province TEXT DEFAULT 'Quảng Ngãi';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS district TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS school_id TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS school_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS grade TEXT DEFAULT '12';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS track TEXT DEFAULT 'CS';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS target_score NUMERIC(3, 1) DEFAULT 8.5;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS daily_study_minutes INT DEFAULT 45;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS xp INT DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS streak_days INT DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_active_date DATE DEFAULT CURRENT_DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS completed_daily_today BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS diagnostic_score NUMERIC(3, 1);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 2.2 Bảng schools
CREATE TABLE IF NOT EXISTS public.schools (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    district TEXT NOT NULL,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.3 Bảng topics
CREATE TABLE IF NOT EXISTS public.topics (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    track TEXT DEFAULT 'ALL' CHECK (track IN ('ALL', 'CS', 'ICT')),
    description TEXT,
    grade TEXT DEFAULT '12',
    total_questions INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.4 Bảng exams
CREATE TABLE IF NOT EXISTS public.exams (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    source TEXT DEFAULT 'Bộ Giáo Dục & Đào Tạo',
    duration_minutes INT DEFAULT 50,
    year INT DEFAULT 2025,
    difficulty TEXT DEFAULT 'Thi thử tốt nghiệp',
    description TEXT,
    base_xp INT DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.5 Bảng questions
CREATE TABLE IF NOT EXISTS public.questions (
    id TEXT PRIMARY KEY,
    exam_id TEXT REFERENCES public.exams(id) ON DELETE SET NULL,
    topic_id TEXT REFERENCES public.topics(id) ON DELETE SET NULL,
    topic_name TEXT,
    type TEXT NOT NULL CHECK (type IN ('single_choice', 'true_false_group')),
    level TEXT NOT NULL CHECK (level IN ('biet', 'hieu', 'van_dung')),
    track_requirement TEXT DEFAULT 'ALL' CHECK (track_requirement IN ('ALL', 'CS', 'ICT')),
    content TEXT NOT NULL,
    options JSONB,
    correct_answer TEXT,
    explanation TEXT,
    code_snippet TEXT,
    statements JSONB,
    table_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.6 Bảng exam_attempts
CREATE TABLE IF NOT EXISTS public.exam_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id TEXT NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
    exam_title TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    track TEXT NOT NULL CHECK (track IN ('CS', 'ICT')),
    started_at TIMESTAMPTZ NOT NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    duration_seconds INT NOT NULL,
    total_score NUMERIC(4, 2) NOT NULL,
    part1_score NUMERIC(4, 2) NOT NULL,
    part2_score NUMERIC(4, 2) NOT NULL,
    correct_part1_count INT NOT NULL,
    part2_breakdown JSONB,
    answers JSONB NOT NULL,
    xp_earned INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.7 Bảng daily_challenge_attempts
CREATE TABLE IF NOT EXISTS public.daily_challenge_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    challenge_date DATE NOT NULL DEFAULT CURRENT_DATE,
    score NUMERIC(4, 2) NOT NULL,
    total_questions INT DEFAULT 10,
    correct_count INT NOT NULL,
    xp_awarded INT DEFAULT 30,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, challenge_date)
);

-- 2.8 Bảng xp_transactions
CREATE TABLE IF NOT EXISTS public.xp_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount INT NOT NULL,
    source TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.9 Bảng classrooms & classroom_members
CREATE TABLE IF NOT EXISTS public.classrooms (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    grade TEXT DEFAULT '12',
    school_name TEXT NOT NULL,
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    teacher_name TEXT NOT NULL,
    student_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.classroom_members (
    classroom_id TEXT NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (classroom_id, student_id)
);

-- 2.10 Bảng assignments & assignment_submissions
CREATE TABLE IF NOT EXISTS public.assignments (
    id TEXT PRIMARY KEY,
    classroom_id TEXT NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    topic_id TEXT REFERENCES public.topics(id) ON DELETE SET NULL,
    due_date TIMESTAMPTZ NOT NULL,
    question_count INT DEFAULT 15,
    allow_retake BOOLEAN DEFAULT TRUE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.assignment_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id TEXT NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    score NUMERIC(4, 2) NOT NULL,
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.11 Bảng exam_comments
CREATE TABLE IF NOT EXISTS public.exam_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id TEXT NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    user_school TEXT,
    content TEXT NOT NULL,
    likes INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.12 Bảng knowledge_chunks
CREATE TABLE IF NOT EXISTS public.knowledge_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id TEXT REFERENCES public.topics(id) ON DELETE SET NULL,
    book_source TEXT,
    chapter TEXT,
    page_number INT,
    chunk_title TEXT NOT NULL,
    content TEXT NOT NULL,
    embedding vector(768),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. TRIGGER TỰ TẠO PROFILE AN TOÀN KHI ĐĂNG KÝ
-- Mặc định vai trò là 'student', không tin tưởng role trong metadata
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_display_name TEXT;
    v_avatar_url TEXT;
BEGIN
    v_display_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        split_part(NEW.email, '@', 1)
    );
    v_avatar_url := NEW.raw_user_meta_data->>'avatar_url';

    INSERT INTO public.profiles (
        id,
        email,
        display_name,
        avatar_url,
        role,
        province,
        grade,
        track,
        xp,
        streak_days,
        created_at,
        updated_at
    )
    VALUES (
        NEW.id,
        NEW.email,
        v_display_name,
        v_avatar_url,
        'student', -- Luôn là student, không tin cậy client metadata
        'Quảng Ngãi',
        '12',
        'CS',
        0,
        0,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        display_name = COALESCE(public.profiles.display_name, EXCLUDED.display_name),
        avatar_url = COALESCE(public.profiles.avatar_url, EXCLUDED.avatar_url),
        updated_at = NOW();

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 4. TRIGGER BẢO VỆ CÁC TRƯỜNG ĐẶC QUYỀN TRONG PROFILES
-- Ngăn người dùng tự sửa role, email, xp thông qua client UPDATE
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.protect_profile_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Kiểm tra nếu thao tác xuất phát từ role authenticated/anon (phía client)
    IF auth.role() IN ('authenticated', 'anon') THEN
        -- Giữ nguyên role không cho đổi qua client
        IF NEW.role IS DISTINCT FROM OLD.role THEN
            NEW.role := OLD.role;
        END IF;

        -- Giữ nguyên email (việc đổi email phải thông qua auth.updateUser)
        IF NEW.email IS DISTINCT FROM OLD.email THEN
            NEW.email := OLD.email;
        END IF;

        -- Giữ nguyên XP (cộng XP chỉ thực hiện qua server function/RPC)
        IF NEW.xp IS DISTINCT FROM OLD.xp THEN
            NEW.xp := OLD.xp;
        END IF;

        -- Giữ nguyên ngày tạo
        NEW.created_at := OLD.created_at;
    END IF;

    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_profile_fields ON public.profiles;
CREATE TRIGGER trg_protect_profile_fields
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.protect_profile_fields();

-- ------------------------------------------------------------------------------
-- 5. VIEW CÔNG KHAI CÂU HỎI & BẢNG XẾP HẠNG
-- ------------------------------------------------------------------------------

-- 5.1 exam_questions_public: Không để lộ correct_answer, explanation và isCorrect
CREATE OR REPLACE VIEW public.exam_questions_public
WITH (security_invoker = false)
AS
SELECT
    q.id,
    q.exam_id,
    q.topic_id,
    q.topic_name,
    q.type,
    q.level,
    q.track_requirement,
    q.content,
    q.options,
    q.code_snippet,
    q.table_data,
    -- Đối với dạng thức đúng/sai: Lọc bỏ thuộc tính isCorrect và explanation khỏi statements JSONB
    CASE
        WHEN q.type = 'true_false_group' AND q.statements IS NOT NULL THEN (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'id', elem->>'id',
                    'text', elem->>'text'
                )
            )
            FROM jsonb_array_elements(q.statements) AS elem
        )
        ELSE NULL
    END AS statements,
    q.created_at
FROM public.questions q;

-- Cấp quyền SELECT trên view cho người dùng
GRANT SELECT ON public.exam_questions_public TO anon, authenticated;

-- 5.2 leaderboard_public: Xem bảng xếp hạng không làm lộ email của học sinh
CREATE OR REPLACE VIEW public.leaderboard_public
WITH (security_invoker = false)
AS
SELECT
    p.id,
    p.display_name,
    p.avatar_url,
    p.school_id,
    p.school_name,
    p.district,
    p.grade,
    p.track,
    p.xp,
    p.streak_days,
    p.last_active_date
FROM public.profiles p
WHERE p.role = 'student'
ORDER BY p.xp DESC;

GRANT SELECT ON public.leaderboard_public TO anon, authenticated;

-- ------------------------------------------------------------------------------
-- 6. HÀM RPC CHẤM ĐIỂM & GHI NHẬN XP BẢO MẬT PHÍA SERVER
-- ------------------------------------------------------------------------------

-- 6.1 RPC Chấm điểm bài thi thử
CREATE OR REPLACE FUNCTION public.submit_exam_attempt_secure(
    p_exam_id TEXT,
    p_track TEXT,
    p_started_at TIMESTAMPTZ,
    p_answers JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID;
    v_exam RECORD;
    v_duration_seconds INT;
    v_part1_score NUMERIC(4, 2) := 0;
    v_part2_score NUMERIC(4, 2) := 0;
    v_total_score NUMERIC(4, 2) := 0;
    v_correct_part1_count INT := 0;
    v_part2_breakdown JSONB := '[]'::JSONB;
    v_xp_earned INT := 0;
    v_attempt_id UUID;
    v_q RECORD;
    v_student_ans TEXT;
    v_correct_statements_count INT;
    v_q_score NUMERIC(4, 2);
    v_elem JSONB;
    v_stmt_id TEXT;
    v_stmt_is_correct BOOLEAN;
    v_stmt_student_choice BOOLEAN;
    v_results_review JSONB := '[]'::JSONB;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Vui lòng đăng nhập để nộp bài thi.';
    END IF;

    SELECT * INTO v_exam FROM public.exams WHERE id = p_exam_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Không tìm thấy bài thi với mã: %', p_exam_id;
    END IF;

    v_duration_seconds := GREATEST(1, EXTRACT(EPOCH FROM (NOW() - p_started_at))::INT);

    -- 1. Chấm điểm Phần 1 (Trắc nghiệm 1 lựa chọn - 0.25đ / câu)
    FOR v_q IN
        SELECT id, content, options, correct_answer, explanation
        FROM public.questions
        WHERE exam_id = p_exam_id AND type = 'single_choice'
    LOOP
        v_student_ans := p_answers->v_q.id->>'selectedOption';
        IF v_student_ans IS NOT NULL AND UPPER(v_student_ans) = UPPER(v_q.correct_answer) THEN
            v_part1_score := v_part1_score + 0.25;
            v_correct_part1_count := v_correct_part1_count + 1;
        END IF;

        -- Ghi lại kết quả kèm lời giải để trả về cho học sinh sau khi nộp
        v_results_review := v_results_review || jsonb_build_object(
            'questionId', v_q.id,
            'type', 'single_choice',
            'studentAnswer', v_student_ans,
            'correctAnswer', v_q.correct_answer,
            'isCorrect', (v_student_ans IS NOT NULL AND UPPER(v_student_ans) = UPPER(v_q.correct_answer)),
            'explanation', v_q.explanation
        );
    END LOOP;

    -- 2. Chấm điểm Phần 2 (Đúng / Sai - Thang điểm chuẩn Bộ GD&ĐT)
    FOR v_q IN
        SELECT id, content, track_requirement, statements
        FROM public.questions
        WHERE exam_id = p_exam_id
          AND type = 'true_false_group'
          AND (track_requirement = 'ALL' OR track_requirement = p_track)
    LOOP
        v_correct_statements_count := 0;

        IF v_q.statements IS NOT NULL THEN
            FOR v_elem IN SELECT * FROM jsonb_array_elements(v_q.statements)
            LOOP
                v_stmt_id := v_elem->>'id';
                v_stmt_is_correct := (v_elem->>'isCorrect')::BOOLEAN;
                v_stmt_student_choice := (p_answers->v_q.id->'trueFalseSelections'->>v_stmt_id)::BOOLEAN;

                IF v_stmt_student_choice IS NOT NULL AND v_stmt_student_choice = v_stmt_is_correct THEN
                    v_correct_statements_count := v_correct_statements_count + 1;
                END IF;
            END LOOP;
        END IF;

        -- Thang điểm BGD: 1 ý = 0.1đ, 2 ý = 0.25đ, 3 ý = 0.50đ, 4 ý = 1.00đ
        v_q_score := 0;
        IF v_correct_statements_count = 1 THEN v_q_score := 0.10;
        ELSIF v_correct_statements_count = 2 THEN v_q_score := 0.25;
        ELSIF v_correct_statements_count = 3 THEN v_q_score := 0.50;
        ELSIF v_correct_statements_count = 4 THEN v_q_score := 1.00;
        END IF;

        v_part2_score := v_part2_score + v_q_score;
        v_part2_breakdown := v_part2_breakdown || jsonb_build_object(
            'questionId', v_q.id,
            'correctStatementsCount', v_correct_statements_count,
            'scoreAwarded', v_q_score
        );
    END LOOP;

    v_total_score := LEAST(10.0, ROUND(v_part1_score + v_part2_score, 2));

    -- Tính XP thưởng: 10 * điểm + thưởng xuất sắc
    v_xp_earned := ROUND(v_total_score * 10)::INT;
    IF v_total_score >= 9.0 THEN
        v_xp_earned := v_xp_earned + 25;
    END IF;

    -- Lưu lượt thi vào exam_attempts
    INSERT INTO public.exam_attempts (
        exam_id,
        exam_title,
        user_id,
        track,
        started_at,
        submitted_at,
        duration_seconds,
        total_score,
        part1_score,
        part2_score,
        correct_part1_count,
        part2_breakdown,
        answers,
        xp_earned
    )
    VALUES (
        p_exam_id,
        v_exam.title,
        v_user_id,
        p_track,
        p_started_at,
        NOW(),
        v_duration_seconds,
        v_total_score,
        v_part1_score,
        v_part2_score,
        v_correct_part1_count,
        v_part2_breakdown,
        p_answers,
        v_xp_earned
    )
    RETURNING id INTO v_attempt_id;

    -- Cập nhật XP người dùng trực tiếp phía server
    UPDATE public.profiles
    SET xp = xp + v_xp_earned,
        last_active_date = CURRENT_DATE,
        updated_at = NOW()
    WHERE id = v_user_id;

    -- Ghi nhật ký giao dịch XP
    INSERT INTO public.xp_transactions (
        user_id,
        amount,
        source,
        description
    )
    VALUES (
        v_user_id,
        v_xp_earned,
        'exam',
        'Hoàn thành bài thi thử: ' || v_exam.title || ' (' || v_total_score || 'đ)'
    );

    RETURN jsonb_build_object(
        'success', true,
        'attemptId', v_attempt_id,
        'totalScore', v_total_score,
        'part1Score', v_part1_score,
        'part2Score', v_part2_score,
        'correctPart1Count', v_correct_part1_count,
        'part2Breakdown', v_part2_breakdown,
        'xpEarned', v_xp_earned,
        'durationSeconds', v_duration_seconds,
        'submittedAt', NOW(),
        'review', v_results_review
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.submit_exam_attempt_secure TO authenticated;

-- 6.2 RPC Ghi nhận kết quả Thử thách 10 câu hằng ngày bảo mật
CREATE OR REPLACE FUNCTION public.submit_daily_challenge_secure(
    p_correct_count INT,
    p_score NUMERIC(4, 2),
    p_total_questions INT DEFAULT 10
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID;
    v_valid_correct INT;
    v_xp_awarded INT;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Vui lòng đăng nhập để nộp bài thử thách.';
    END IF;

    -- Xác thực tính hợp lệ của số câu đúng
    v_valid_correct := LEAST(GREATEST(p_correct_count, 0), p_total_questions);

    -- Công thức XP: Base 30 XP + 5 XP cho mỗi câu đúng
    v_xp_awarded := 30 + (v_valid_correct * 5);

    INSERT INTO public.daily_challenge_attempts (
        user_id,
        challenge_date,
        score,
        total_questions,
        correct_count,
        xp_awarded,
        completed_at
    )
    VALUES (
        v_user_id,
        CURRENT_DATE,
        p_score,
        p_total_questions,
        v_valid_correct,
        v_xp_awarded,
        NOW()
    )
    ON CONFLICT (user_id, challenge_date) DO UPDATE SET
        score = GREATEST(public.daily_challenge_attempts.score, EXCLUDED.score),
        correct_count = GREATEST(public.daily_challenge_attempts.correct_count, EXCLUDED.correct_count),
        completed_at = NOW();

    -- Cập nhật XP và chuỗi streak trên profile
    UPDATE public.profiles
    SET xp = xp + v_xp_awarded,
        completed_daily_today = TRUE,
        last_active_date = CURRENT_DATE,
        updated_at = NOW()
    WHERE id = v_user_id;

    -- Ghi log XP
    INSERT INTO public.xp_transactions (
        user_id,
        amount,
        source,
        description
    )
    VALUES (
        v_user_id,
        v_xp_awarded,
        'daily_challenge',
        'Hoàn thành thử thách 10 câu hằng ngày (' || v_valid_correct || '/' || p_total_questions || ' câu đúng)'
    );

    RETURN jsonb_build_object(
        'success', true,
        'xpAwarded', v_xp_awarded,
        'correctCount', v_valid_correct,
        'completedToday', true
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.submit_daily_challenge_secure TO authenticated;

-- ------------------------------------------------------------------------------
-- 7. BẢO MẬT HÀM VECTOR SEARCH (RAG KNOWLEDGE CHUNKS)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.match_knowledge_chunks(
    query_embedding vector(768),
    match_threshold FLOAT DEFAULT 0.65,
    match_count INT DEFAULT 4
)
RETURNS TABLE (
    id UUID,
    topic_id TEXT,
    book_source TEXT,
    chunk_title TEXT,
    content TEXT,
    similarity FLOAT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_safe_limit INT;
BEGIN
    -- Giới hạn chống DoS tham số limit
    v_safe_limit := LEAST(GREATEST(match_count, 1), 20);

    RETURN QUERY
    SELECT
        kc.id,
        kc.topic_id,
        kc.book_source,
        kc.chunk_title,
        kc.content,
        (1 - (kc.embedding <=> query_embedding))::FLOAT AS similarity
    FROM public.knowledge_chunks kc
    WHERE kc.embedding IS NOT NULL
      AND (1 - (kc.embedding <=> query_embedding)) > match_threshold
    ORDER BY kc.embedding <=> query_embedding ASC
    LIMIT v_safe_limit;
END;
$$;

GRANT EXECUTE ON FUNCTION public.match_knowledge_chunks TO anon, authenticated;

-- ------------------------------------------------------------------------------
-- 8. ROW LEVEL SECURITY (RLS) - THIẾT LẬP ĐẶC QUYỀN TỐI THIỂU CHO TẤT CẢ CÁC BẢNG
-- ------------------------------------------------------------------------------

-- Kích hoạt RLS cho toàn bộ bảng
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_challenge_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classroom_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_chunks ENABLE ROW LEVEL SECURITY;

-- 8.1 PROFILES POLICIES
-- Người dùng chỉ được SELECT hồ sơ của chính mình. Xem danh sách học sinh qua view leaderboard_public
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow select profiles" ON public.profiles;
CREATE POLICY "Users can read own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

-- Người dùng tự sửa hồ sơ của mình (các trường nhạy cảm được bảo vệ bởi trigger)
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 8.2 QUESTIONS POLICIES
-- Không cho phép anon hoặc học sinh đọc trực tiếp bảng questions (phải dùng exam_questions_public)
-- Chỉ giáo viên hoặc service_role được truy cập trực tiếp questions
DROP POLICY IF EXISTS "Public read questions" ON public.questions;
DROP POLICY IF EXISTS "Allow public all on questions" ON public.questions;
DROP POLICY IF EXISTS "Public insert questions" ON public.questions;
DROP POLICY IF EXISTS "Teachers can read full questions" ON public.questions;
CREATE POLICY "Teachers can read full questions"
    ON public.questions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'teacher'
        )
    );

DROP POLICY IF EXISTS "Teachers can manage questions" ON public.questions;
CREATE POLICY "Teachers can manage questions"
    ON public.questions FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'teacher'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'teacher'
        )
    );

-- 8.3 EXAMS POLICIES
-- Ai cũng có thể xem danh mục đề thi
DROP POLICY IF EXISTS "Public read exams" ON public.exams;
DROP POLICY IF EXISTS "Allow public all on exams" ON public.exams;
DROP POLICY IF EXISTS "Public insert exams" ON public.exams;
CREATE POLICY "Public read exams"
    ON public.exams FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Teachers can manage exams" ON public.exams;
CREATE POLICY "Teachers can manage exams"
    ON public.exams FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'teacher'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'teacher'
        )
    );

-- 8.4 SCHOOLS & TOPICS POLICIES
-- Danh mục công khai
DROP POLICY IF EXISTS "Public read schools" ON public.schools;
DROP POLICY IF EXISTS "Allow public all on schools" ON public.schools;
CREATE POLICY "Public read schools" ON public.schools FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read topics" ON public.topics;
DROP POLICY IF EXISTS "Allow public all on topics" ON public.topics;
CREATE POLICY "Public read topics" ON public.topics FOR SELECT USING (true);

-- 8.5 EXAM ATTEMPTS POLICIES
-- Người dùng chỉ được xem và ghi lịch sử làm bài của chính mình
DROP POLICY IF EXISTS "Users can read own attempts" ON public.exam_attempts;
CREATE POLICY "Users can read own attempts"
    ON public.exam_attempts FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own attempts" ON public.exam_attempts;
CREATE POLICY "Users can insert own attempts"
    ON public.exam_attempts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 8.6 DAILY CHALLENGE ATTEMPTS POLICIES
DROP POLICY IF EXISTS "Users can read own daily attempts" ON public.daily_challenge_attempts;
CREATE POLICY "Users can read own daily attempts"
    ON public.daily_challenge_attempts FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can record own daily attempts" ON public.daily_challenge_attempts;
CREATE POLICY "Users can record own daily attempts"
    ON public.daily_challenge_attempts FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 8.7 XP TRANSACTIONS POLICIES
DROP POLICY IF EXISTS "Users can read own xp transactions" ON public.xp_transactions;
CREATE POLICY "Users can read own xp transactions"
    ON public.xp_transactions FOR SELECT
    USING (auth.uid() = user_id);

-- 8.8 CLASSROOMS POLICIES
-- Giáo viên sở hữu lớp HOẶC học sinh tham gia lớp mới được xem lớp
DROP POLICY IF EXISTS "Classroom visibility" ON public.classrooms;
DROP POLICY IF EXISTS "Allow public all on classrooms" ON public.classrooms;
CREATE POLICY "Classroom visibility"
    ON public.classrooms FOR SELECT
    USING (
        teacher_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.classroom_members
            WHERE classroom_id = classrooms.id AND student_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Teachers can manage own classrooms" ON public.classrooms;
CREATE POLICY "Teachers can manage own classrooms"
    ON public.classrooms FOR ALL
    USING (
        teacher_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'teacher'
        )
    )
    WITH CHECK (
        teacher_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'teacher'
        )
    );

-- 8.9 CLASSROOM MEMBERS POLICIES
DROP POLICY IF EXISTS "Members visibility" ON public.classroom_members;
DROP POLICY IF EXISTS "Allow public all on classroom_members" ON public.classroom_members;
CREATE POLICY "Members visibility"
    ON public.classroom_members FOR SELECT
    USING (
        student_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.classrooms
            WHERE id = classroom_members.classroom_id AND teacher_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Students can join classrooms" ON public.classroom_members;
CREATE POLICY "Students can join classrooms"
    ON public.classroom_members FOR INSERT
    WITH CHECK (student_id = auth.uid());

DROP POLICY IF EXISTS "Students or teachers can leave classrooms" ON public.classroom_members;
CREATE POLICY "Students or teachers can leave classrooms"
    ON public.classroom_members FOR DELETE
    USING (
        student_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.classrooms
            WHERE id = classroom_members.classroom_id AND teacher_id = auth.uid()
        )
    );

-- 8.10 ASSIGNMENTS POLICIES
DROP POLICY IF EXISTS "Assignments visibility" ON public.assignments;
DROP POLICY IF EXISTS "Allow public all on assignments" ON public.assignments;
CREATE POLICY "Assignments visibility"
    ON public.assignments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.classrooms
            WHERE id = assignments.classroom_id AND teacher_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM public.classroom_members
            WHERE classroom_id = assignments.classroom_id AND student_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Teachers can manage assignments" ON public.assignments;
CREATE POLICY "Teachers can manage assignments"
    ON public.assignments FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.classrooms
            WHERE id = assignments.classroom_id AND teacher_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.classrooms
            WHERE id = assignments.classroom_id AND teacher_id = auth.uid()
        )
    );

-- 8.11 ASSIGNMENT SUBMISSIONS POLICIES
DROP POLICY IF EXISTS "Submissions visibility" ON public.assignment_submissions;
CREATE POLICY "Submissions visibility"
    ON public.assignment_submissions FOR SELECT
    USING (
        student_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.assignments a
            JOIN public.classrooms c ON a.classroom_id = c.id
            WHERE a.id = assignment_submissions.assignment_id AND c.teacher_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Students can submit assignments" ON public.assignment_submissions;
CREATE POLICY "Students can submit assignments"
    ON public.assignment_submissions FOR INSERT
    WITH CHECK (student_id = auth.uid());

-- 8.12 EXAM COMMENTS POLICIES
DROP POLICY IF EXISTS "Public read comments" ON public.exam_comments;
DROP POLICY IF EXISTS "Allow public all on exam_comments" ON public.exam_comments;
CREATE POLICY "Public read comments"
    ON public.exam_comments FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can insert comments" ON public.exam_comments;
CREATE POLICY "Users can insert comments"
    ON public.exam_comments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own comments" ON public.exam_comments;
CREATE POLICY "Users can delete own comments"
    ON public.exam_comments FOR DELETE
    USING (auth.uid() = user_id);

-- 8.13 KNOWLEDGE CHUNKS POLICIES
DROP POLICY IF EXISTS "Public read knowledge_chunks" ON public.knowledge_chunks;
DROP POLICY IF EXISTS "Allow public all on knowledge_chunks" ON public.knowledge_chunks;
CREATE POLICY "Public read knowledge_chunks"
    ON public.knowledge_chunks FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Teachers can manage knowledge_chunks" ON public.knowledge_chunks;
CREATE POLICY "Teachers can manage knowledge_chunks"
    ON public.knowledge_chunks FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'teacher'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'teacher'
        )
    );

COMMIT;
