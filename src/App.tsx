import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { StudentDashboard } from './components/student/StudentDashboard';
import { TopicLearning } from './components/student/TopicLearning';
import { ExamPractice } from './components/student/ExamPractice';
import { ExamTakingModal } from './components/student/ExamTakingModal';
import { PersonalizedAI } from './components/student/PersonalizedAI';
import { Leaderboard } from './components/student/Leaderboard';
import { UserProfileView } from './components/student/UserProfileView';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { GoogleToolsHub } from './components/google/GoogleToolsHub';
import { CodeStudioHub } from './components/code_studio/CodeStudioHub';
import { AuthModal } from './components/auth/AuthModal';
import { RegisterModal } from './components/auth/RegisterModal';
import { LoginPage } from './components/auth/LoginPage';
import { LandingPage } from './components/landing/LandingPage';
import { FloatingAiBot } from './components/common/FloatingAiBot';

import {
  UserProfile,
  UserRole,
  SubjectTopicId,
  Exam,
  ExamAttempt,
} from './types';
import { storageService, INITIAL_EMPTY_PROFILE } from './services/storageService';
import { DEMO_STUDENT_PROFILE, DEMO_TEACHER_PROFILE, isDemoUser } from './data/demoData';
import { OFFICIAL_EXAMS, DAILY_CHALLENGE_POOL } from './data/officialExamsData';
import { initAuth, googleSignIn, logout } from './services/firebaseAuth';
import { verifyServerXP } from './services/geminiClient';
import {
  getProfile,
  saveExamAttempt,
  updateProfile,
  saveClassroom,
  saveAssignment,
  recordDailyChallengeAttempt,
} from './services/supabaseDbService';
import { onAuthStateChange, getInitialSession, signOut } from './services/supabaseAuthService';
import { isSupabaseConfigured } from './services/supabaseClient';

export default function App() {
  // Theme state (mặc định giao diện sáng)
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => storageService.getThemeMode());

  // User & role state
  const [user, setUser] = useState<UserProfile>(() => storageService.getUserProfile());

  // Trạng thái kiểm tra session lúc khởi động ứng dụng
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);

  // Demo mode: Chỉ bật khi người dùng chủ động bấm "Dùng thử"
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => storageService.isDemoMode());

  // Auth state: Chỉ true khi có session Supabase hợp lệ HOẶC đang trong chế độ demo chủ động
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Auth view: 'landing' | 'login'
  const [authView, setAuthView] = useState<'landing' | 'login'>(() => {
    if (typeof window !== 'undefined' && window.location.pathname === '/login') {
      return 'login';
    }
    return 'landing';
  });

  // Register/Auth modal state
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('register');

  const handleOpenAuth = (mode: 'login' | 'register' = 'register') => {
    if (mode === 'login') {
      setAuthView('login');
      setIsRegisterModalOpen(false);
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.history.pushState(null, '', '/login');
      }
    } else {
      setAuthModalMode(mode);
      setIsRegisterModalOpen(true);
    }
  };

  const handleBackToLanding = () => {
    setAuthView('landing');
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      window.history.pushState(null, '', '/');
    }
  };

  // Navigation state (Hỗ trợ mở trực tiếp tab ?tab=code_studio trong tab mới)
  const [currentTab, setCurrentTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('tab') === 'code_studio' || window.location.pathname === '/code') {
        return 'code_studio';
      }
    }
    return 'home';
  });
  const [activeTopicId, setActiveTopicId] = useState<SubjectTopicId>('12B');

  // Completed topics record
  const [completedTopics, setCompletedTopics] = useState<Record<SubjectTopicId, boolean>>(() =>
    storageService.getCompletedTopics()
  );

  // Classrooms and assignments for teacher/student
  const [classrooms, setClassrooms] = useState(() => storageService.getClassrooms());
  const [assignments, setAssignments] = useState(() => storageService.getAssignments());
  const [examAttempts, setExamAttempts] = useState<ExamAttempt[]>(() =>
    storageService.getExamAttempts()
  );

  // Modals state
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [isExamPracticeMode, setIsExamPracticeMode] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isGoogleHubOpen, setIsGoogleHubOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  // Google Firebase Auth state (cho Google Workspace Hub)
  const [isGoogleLoggedIn, setIsGoogleLoggedIn] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Initialize theme
  useEffect(() => {
    storageService.setThemeMode(themeMode);
  }, [themeMode]);

  // Synchronize browser history / URL path
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/login') {
        setAuthView('login');
      } else {
        setAuthView('landing');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Khôi phục session Supabase và kiểm tra trạng thái xác thực
  useEffect(() => {
    let isMounted = true;

    async function initializeAuthSession() {
      try {
        if (isSupabaseConfigured()) {
          const authUser = await getInitialSession();
          if (!isMounted) return;

          if (authUser) {
            // Đã có phiên đăng nhập Supabase hợp lệ từ trước
            const saved = storageService.getUserProfile();
            let profile = await getProfile(authUser.id);
            if (!profile) {
              // Bảo toàn displayName đã được cập nhật trước đó (không reset về email prefix)
              const preservedDisplayName = saved.displayName && saved.displayName !== 'Học sinh TinPath'
                ? saved.displayName
                : (authUser.displayName || '');
              profile = {
                ...saved,
                id: authUser.id,
                email: authUser.email,
                displayName: preservedDisplayName,
                avatarUrl: authUser.avatarUrl || saved.avatarUrl,
                role: saved.role || 'student',
                onboardingCompleted: true,
              };
              await updateProfile(authUser.id, profile).catch(console.warn);
            } else {
              // Phân giải trường học: không để placeholder 'Chưa cập nhật trường' ghi đè trường thật đã lưu
              const candidateSchools = [
                profile.schoolName,
                saved.schoolName,
              ].filter((s) => s && s.trim() !== '' && s !== 'Chưa cập nhật trường');
              const preservedSchoolName = candidateSchools.length > 0 ? candidateSchools[0] : (profile.schoolName || 'Chưa cập nhật trường');

              // Phân giải tên hiển thị: không để placeholder 'Học sinh TinPath' ghi đè tên thật đã lưu
              const candidateNames = [
                profile.displayName,
                saved.displayName,
                authUser.displayName,
              ].filter((n) => n && n.trim() !== '' && n.trim() !== 'Học sinh TinPath');
              const preservedDisplayName = candidateNames.length > 0 ? candidateNames[0] : (profile.displayName || 'Học sinh TinPath');

              profile = {
                ...saved,
                ...profile,
                displayName: preservedDisplayName,
                username: profile.username || saved.username || '',
                bio: profile.bio || saved.bio || '',
                schoolId: profile.schoolId || saved.schoolId || '',
                schoolName: preservedSchoolName,
                district: profile.district || saved.district || '',
              };
            }
            storageService.setDemoMode(false);
            storageService.saveUserProfile(profile);
            setUser(profile);
            setIsLoggedIn(true);
            setIsDemoMode(false);
            setIsAuthChecking(false);
            return;
          }
        }

        // Nếu chưa đăng nhập qua Supabase: Kiểm tra xem người dùng có đang chủ động dùng Demo Mode không
        if (storageService.isDemoMode()) {
          const saved = storageService.getUserProfile();
          if (isDemoUser(saved)) {
            setUser(saved);
            setIsLoggedIn(true);
            setIsDemoMode(true);
            setIsAuthChecking(false);
            return;
          } else {
            storageService.clearUserProfile();
          }
        }

        // Mặc định: Người dùng chưa đăng nhập -> Hiển thị Landing Page, KHÔNG tự động vào demo
        storageService.setDemoMode(false);
        setUser(INITIAL_EMPTY_PROFILE);
        setIsLoggedIn(false);
        setIsDemoMode(false);
      } catch (err) {
        console.error('Lỗi khi khôi phục session:', err);
        storageService.setDemoMode(false);
        setUser(INITIAL_EMPTY_PROFILE);
        setIsLoggedIn(false);
        setIsDemoMode(false);
      } finally {
        if (isMounted) {
          setIsAuthChecking(false);
        }
      }
    }

    initializeAuthSession();

    // Lắng nghe thay đổi trạng thái xác thực Supabase
    if (isSupabaseConfigured()) {
      const cleanup = onAuthStateChange(async (authUser) => {
        if (!isMounted) return;
        if (authUser) {
          const saved = storageService.getUserProfile();
          let profile = await getProfile(authUser.id);
          if (!profile) {
            // Bảo toàn displayName đã được cập nhật trước đó (không reset về email prefix)
            const preservedDisplayName = saved.displayName && saved.displayName !== 'Học sinh TinPath'
              ? saved.displayName
              : (authUser.displayName || '');
            profile = {
              ...saved,
              id: authUser.id,
              email: authUser.email,
              displayName: preservedDisplayName,
              avatarUrl: authUser.avatarUrl || saved.avatarUrl,
              role: saved.role || 'student',
              onboardingCompleted: true,
            };
          } else {
            // Phân giải trường học: không để placeholder 'Chưa cập nhật trường' ghi đè trường thật đã lưu
            const candidateSchools = [
              profile.schoolName,
              saved.schoolName,
            ].filter((s) => s && s.trim() !== '' && s !== 'Chưa cập nhật trường');
            const preservedSchoolName = candidateSchools.length > 0 ? candidateSchools[0] : (profile.schoolName || 'Chưa cập nhật trường');

            // Phân giải tên hiển thị: không để placeholder 'Học sinh TinPath' ghi đè tên thật đã lưu
            const candidateNames = [
              profile.displayName,
              saved.displayName,
              authUser.displayName,
            ].filter((n) => n && n.trim() !== '' && n.trim() !== 'Học sinh TinPath');
            const preservedDisplayName = candidateNames.length > 0 ? candidateNames[0] : (profile.displayName || 'Học sinh TinPath');

            profile = {
              ...saved,
              ...profile,
              displayName: preservedDisplayName,
              username: profile.username || saved.username || '',
              bio: profile.bio || saved.bio || '',
              schoolId: profile.schoolId || saved.schoolId || '',
              schoolName: preservedSchoolName,
              district: profile.district || saved.district || '',
            };
          }
          storageService.setDemoMode(false);
          storageService.saveUserProfile(profile);
          setUser(profile);
          setIsLoggedIn(true);
          setIsDemoMode(false);
        } else {
          // Người dùng đăng xuất Supabase
          if (!storageService.isDemoMode()) {
            setUser(INITIAL_EMPTY_PROFILE);
            setIsLoggedIn(false);
            setIsDemoMode(false);
          }
        }
      });
      return () => {
        isMounted = false;
        cleanup();
      };
    } else {
      return () => {
        isMounted = false;
      };
    }
  }, []);

  // Initialize Firebase Auth listener (cho Google Workspace Hub)
  useEffect(() => {
    const unsubscribe = initAuth(
      (firebaseUser, token) => {
        setIsGoogleLoggedIn(true);
        if (firebaseUser.email) {
          setUser((prev) => {
            const updated = {
              ...prev,
              email: firebaseUser.email || prev.email,
              displayName: firebaseUser.displayName || prev.displayName,
            };
            if (!isDemoMode && !isDemoUser(prev)) {
              storageService.saveUserProfile(updated);
            }
            return updated;
          });
        }
      },
      () => {
        setIsGoogleLoggedIn(false);
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [isDemoMode]);

  // Theme toggle
  const handleToggleTheme = () => {
    const next = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(next);
  };

  // Google sign in trigger
  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      const res = await googleSignIn();
      if (res) {
        setIsGoogleLoggedIn(true);
        setUser((prev) => {
          const updated = {
            ...prev,
            email: res.user.email || prev.email,
            displayName: res.user.displayName || prev.displayName,
          };
          if (!isDemoMode && !isDemoUser(prev)) {
            storageService.saveUserProfile(updated);
          }
          return updated;
        });
      }
    } catch (err: any) {
      alert(`Đăng nhập Google thất bại: ${err.message || 'Lỗi không xác định'}`);
    } finally {
      setIsSigningIn(false);
    }
  };

  // Kích hoạt chế độ Dùng thử (Chỉ khi người dùng chủ động chọn)
  const handleStartDemo = (role: UserRole = 'student') => {
    const demoProfile = role === 'teacher' ? DEMO_TEACHER_PROFILE : DEMO_STUDENT_PROFILE;
    storageService.setDemoMode(true);
    storageService.saveUserProfile(demoProfile);
    setUser(demoProfile);
    setIsDemoMode(true);
    setIsLoggedIn(true);
    setAuthView('landing');
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      window.history.pushState(null, '', '/');
    }
    if (role === 'student') setCurrentTab('home');
    else setCurrentTab('teacher_overview');
  };

  // Handle successful login/registration from RegisterModal or LoginPage
  const handleLoginSuccess = (loggedInUser: UserProfile) => {
    setIsDemoMode(false);
    storageService.setDemoMode(false);
    setUser(loggedInUser);
    setIsLoggedIn(true);
    setAuthView('landing');
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      window.history.pushState(null, '', '/');
    }
    if (loggedInUser.role === 'student') setCurrentTab('home');
    else if (loggedInUser.role === 'teacher') setCurrentTab('teacher_overview');
  };

  // Handle logout - return to landing
  const handleLogout = async () => {
    try {
      if (isSupabaseConfigured()) {
        await signOut();
      }
      await logout();
    } catch (err) {
      console.warn('Lỗi khi đăng xuất:', err);
    }
    setIsGoogleLoggedIn(false);
    setIsLoggedIn(false);
    setIsDemoMode(false);
    storageService.clearUserProfile();
    setUser(INITIAL_EMPTY_PROFILE);
    setAuthView('landing');
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      window.history.pushState(null, '', '/');
    }
  };

  // Role switch handler
  const handleSwitchRole = (newRole: UserRole) => {
    const updated = storageService.updateRole(newRole);
    setUser(updated);
    if (newRole === 'student') setCurrentTab('home');
    else if (newRole === 'teacher') setCurrentTab('teacher_overview');
  };

  // Save profile — ghi vào Supabase nếu là tài khoản thật
  const handleSaveProfile = async (updated: UserProfile) => {
    setUser(updated);
    storageService.saveUserProfile(updated);
    if (isSupabaseConfigured() && !isDemoMode && !isDemoUser(updated)) {
      await updateProfile(updated.id, updated);
    }
  };

  // Toggle completed topic
  const handleToggleCompleteTopic = (topicId: SubjectTopicId) => {
    storageService.toggleTopicCompleted(topicId);
    setCompletedTopics(storageService.getCompletedTopics());
    setUser(storageService.getUserProfile());
  };

  // Start Exam by ID
  const handleStartExam = (examId: string, isRetake?: boolean) => {
    const found = OFFICIAL_EXAMS.find((e) => e.id === examId) || OFFICIAL_EXAMS[0];
    setIsExamPracticeMode(Boolean(isRetake));
    setActiveExam(found);
  };

  // Start Custom Generated Exam (AI Remedial / Topic)
  const handleStartCustomExam = (customExam: Exam) => {
    setIsExamPracticeMode(true);
    setActiveExam(customExam);
  };

  // Start Daily 10 Challenge
  const handleStartDailyChallenge = () => {
    const dailyExam: Exam = {
      id: `daily_${new Date().toISOString().split('T')[0]}`,
      title: 'Thử thách 10 câu trắc nghiệm hằng ngày',
      source: 'Ngân hàng câu hỏi TinPath GDPT 2018',
      durationMinutes: 15,
      year: 2025,
      difficulty: 'Trung bình',
      description: 'Luyện 10 câu trắc nghiệm mỗi ngày để nhận điểm thưởng XP và bảo vệ chuỗi ngày học liên tục.',
      totalScore: 10,
      baseXP: 30,
      part1Questions: DAILY_CHALLENGE_POOL,
      part2Questions: [], // Daily challenge focuses on Part 1
    };
    setIsExamPracticeMode(true);
    setActiveExam(dailyExam);
  };

  // Start Topic Custom Quiz
  const handleStartTopicQuiz = (topicId: SubjectTopicId, count: number = 10, level: string = 'all') => {
    const allQuestions = OFFICIAL_EXAMS.flatMap((e) => e.part1Questions);
    const pool = allQuestions.filter((q) => q.topicId === topicId);
    const questionsToUse = pool.length > 0 ? pool.slice(0, count) : allQuestions.slice(0, count);

    const topicQuiz: Exam = {
      id: `quiz_${topicId}_${Date.now()}`,
      title: `Bài luyện tập chuyên đề: ${topicId}`,
      source: 'Ngân hàng chuyên đề TinPath GDPT 2018',
      durationMinutes: Math.round(count * 1.5),
      year: 2025,
      difficulty: 'Cơ bản',
      description: `Luyện tập chuyên sâu ${count} câu hỏi chủ đề ${topicId}.`,
      totalScore: 10,
      baseXP: 40,
      part1Questions: questionsToUse,
      part2Questions: [],
    };
    setIsExamPracticeMode(true);
    setActiveExam(topicQuiz);
  };

  // Submit Exam Attempt — ghi vào Supabase nếu là tài khoản thật
  const handleSubmitAttempt = async (attempt: ExamAttempt) => {
    if (attempt.examId.startsWith('daily_')) {
      try {
        const verifyRes = await verifyServerXP({
          type: 'daily_challenge',
          correctCount: attempt.correctPart1Count,
          totalQuestions: 10,
        });
        const awardedXP = verifyRes.awardedXP || 80;
        storageService.recordDailyChallengeCompleted(attempt.correctPart1Count, awardedXP);
        if (isSupabaseConfigured() && !isDemoMode && !isDemoUser(user)) {
          recordDailyChallengeAttempt({
            userId: user.id,
            score: attempt.totalScore,
            totalQuestions: 10,
            correctCount: attempt.correctPart1Count,
            xpAwarded: awardedXP,
          }).catch(console.error);
        }
      } catch {
        storageService.recordDailyChallengeCompleted(attempt.correctPart1Count, 80);
      }
    } else {
      // Ghi vào Supabase nếu là tài khoản thật
      storageService.saveExamAttempt(attempt);
      if (isSupabaseConfigured() && !isDemoMode && !isDemoUser(user)) {
        saveExamAttempt(attempt).catch(console.error);
        // Cập nhật XP trong profile Supabase
        const currentUser = storageService.getUserProfile();
        updateProfile(currentUser.id, { xp: currentUser.xp }).catch(console.error);
      }
    }

    setExamAttempts(storageService.getExamAttempts());
    setUser(storageService.getUserProfile());
  };

  // Continue topic from dashboard
  const handleContinueTopic = (topicId: string) => {
    setActiveTopicId(topicId as SubjectTopicId);
    setCurrentTab('learning');
  };

  // Màn hình chờ trong lúc kiểm tra session Supabase ban đầu
  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#071626] text-white select-none">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 animate-pulse flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.5)]">
            <img
              src="/images/logo/tinpath_logo.png"
              alt="TinPath Logo"
              className="w-10 h-10 object-contain drop-shadow"
            />
          </div>
          <div className="flex items-center gap-2 text-cyan-200 text-sm font-medium">
            <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
            <span>Đang tải TinPath GDPT 2018...</span>
          </div>
        </div>
      </div>
    );
  }

  const isDirectEditorMode = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('mode') === 'editor';

  // Nếu người dùng mở trực tiếp link editor trong tab mới, hiển thị thẳng Editor
  if (isDirectEditorMode) {
    return <CodeStudioHub onNavigateTab={setCurrentTab} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f8fa] dark:bg-[#121212] text-[#202020] dark:text-[#E0E0E0] transition-colors">
      {/* ── UNAUTHENTICATED: Show Landing Page or Login Page ── */}
      {!isLoggedIn && (
        <>
          {/* Landing Page always visible underneath */}
          <LandingPage
            user={user}
            onNavigateTab={setCurrentTab}
            onOpenAuth={handleOpenAuth}
            onStartDailyChallenge={() => handleOpenAuth('register')}
            onTakeExam={() => handleOpenAuth('register')}
            onStartDemo={handleStartDemo}
          />

          {/* Login Modal Overlay */}
          {authView === 'login' && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center">
              {/* Blurred backdrop of landing page */}
              <div
                className="absolute inset-0 backdrop-blur-sm bg-black/40"
                onClick={handleBackToLanding}
              />
              {/* Login Card */}
              <div className="relative z-10 w-full max-w-[480px] mx-4">
                <LoginPage
                  onBackToHome={handleBackToLanding}
                  onLoginSuccess={(loggedInUser) => {
                    handleLoginSuccess(loggedInUser);
                  }}
                  onSwitchToRegister={() => {
                    handleBackToLanding();
                    handleOpenAuth('register');
                  }}
                  onStartDemo={handleStartDemo}
                />
              </div>
            </div>
          )}

          {/* Register Modal */}
          <RegisterModal
            isOpen={isRegisterModalOpen}
            onClose={() => setIsRegisterModalOpen(false)}
            onLoginSuccess={handleLoginSuccess}
            initialMode={authModalMode}
            onSwitchToLogin={() => {
              setIsRegisterModalOpen(false);
              setAuthView('login');
              if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
                window.history.pushState(null, '', '/login');
              }
            }}
          />
        </>
      )}

      {/* ── AUTHENTICATED: Show App Shell ── */}
      {isLoggedIn && (
        <>
          {/* Top Navigation */}
          <Navbar
            currentTab={currentTab}
            onSelectTab={setCurrentTab}
            user={user}
            themeMode={themeMode}
            onToggleTheme={handleToggleTheme}
            onOpenProfile={() => setCurrentTab('profile')}
            onSwitchRole={handleSwitchRole}
            onOpenGoogleHub={() => setIsGoogleHubOpen(true)}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            isGoogleAuthenticated={isGoogleLoggedIn}
            onSignOut={handleLogout}
            isDemoMode={isDemoMode}
            onExitDemo={handleLogout}
          />

      {/* Main View Area: Tràn rộng sang 2 bên trái phải, đồng bộ mép với navbar */}
      <main className="flex-1 w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-6 xl:px-8 pt-4 sm:pt-6 pb-14 sm:pb-16">
        {/* STUDENT VIEWS */}
        {(user.role === 'student' || !user.role) && (
          <>
            {currentTab === 'home' && (
              <StudentDashboard
                user={user}
                assignments={assignments}
                examAttempts={examAttempts}
                onStartDailyChallenge={handleStartDailyChallenge}
                onContinueTopic={handleContinueTopic}
                onTakeExam={handleStartExam}
                onNavigateTab={setCurrentTab}
                onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
              />
            )}

            {currentTab === 'learning' && (
              <TopicLearning
                initialTopicId={activeTopicId}
                completedTopics={completedTopics}
                onToggleCompleteTopic={handleToggleCompleteTopic}
                onPracticeTopicQuiz={(tId) => handleStartTopicQuiz(tId, 10, 'all')}
                onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
              />
            )}

            {currentTab === 'practice' && (
              <ExamPractice
                onStartExam={handleStartExam}
                onStartCustomExam={handleStartCustomExam}
                onStartDailyChallenge={handleStartDailyChallenge}
                onStartTopicQuiz={handleStartTopicQuiz}
                completedDailyToday={user.completedDailyToday}
                streakDays={user.streakDays}
                examAttempts={examAttempts}
              />
            )}

            {currentTab === 'personalized_ai' && (
              <PersonalizedAI
                user={user}
                examAttempts={examAttempts}
                onUpdateUser={handleSaveProfile}
                onNavigateTopic={handleContinueTopic}
                onStartExam={handleStartExam}
                onStartTopicQuiz={handleStartTopicQuiz}
                onStartDailyChallenge={handleStartDailyChallenge}
                onNavigateTab={setCurrentTab}
              />
            )}

            {currentTab === 'leaderboard' && (
              <Leaderboard currentUser={user} onClose={() => setCurrentTab('home')} />
            )}

            {currentTab === 'profile' && (
              <UserProfileView
                user={user}
                examAttempts={examAttempts}
                completedTopics={completedTopics}
                onUpdateUser={handleSaveProfile}
                onNavigateTab={setCurrentTab}
              />
            )}

            {currentTab === 'code_studio' && (
              <CodeStudioHub onNavigateTab={setCurrentTab} />
            )}
          </>
        )}

        {/* TEACHER VIEWS */}
        {user.role === 'teacher' && (
          <TeacherDashboard
            currentTab={currentTab}
            user={user}
            classrooms={classrooms}
            assignments={assignments}
            onAddClassroom={(cls) => {
              storageService.addClassroom(cls);
              setClassrooms(storageService.getClassrooms());
              if (isSupabaseConfigured() && !isDemoMode && !isDemoUser(user)) {
                saveClassroom(cls).catch(console.error);
              }
            }}
            onAddAssignment={(assign) => {
              storageService.addAssignment(assign);
              setAssignments(storageService.getAssignments());
              if (isSupabaseConfigured() && !isDemoMode && !isDemoUser(user)) {
                saveAssignment(assign).catch(console.error);
              }
            }}
          />
        )}
      </main>

      <Footer
        onOpenGoogleHub={() => setIsGoogleHubOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
      />

      {/* MODALS */}

      {/* 1. Exam Taking Workspace */}
      {activeExam && (
        <ExamTakingModal
          isOpen={Boolean(activeExam)}
          onClose={() => {
            setActiveExam(null);
            setIsExamPracticeMode(false);
          }}
          exam={activeExam}
          track={user.track}
          onSubmitAttempt={handleSubmitAttempt}
          userId={user.id}
          isPracticeMode={isExamPracticeMode}
        />
      )}

      {/* 2. Profile & Quảng Ngãi School Selection Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        user={user}
        onSaveProfile={handleSaveProfile}
        onGoogleSignIn={handleGoogleSignIn}
        isSigningIn={isSigningIn}
        isLoggedIn={isGoogleLoggedIn}
      />

      {/* 3. Google Ecosystem Hub Modal */}
      <GoogleToolsHub
        isOpen={isGoogleHubOpen}
        onClose={() => setIsGoogleHubOpen(false)}
        user={user}
        isLoggedIn={isGoogleLoggedIn}
        onGoogleSignIn={handleGoogleSignIn}
      />

      {/* 4. Privacy & Terms Modal */}
      {isPrivacyOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-xl max-w-lg w-full p-6 sm:p-7 border border-gray-200 dark:border-[#333] shadow-2xl text-sm space-y-4">
            <h3 className="font-bold text-base text-gray-900 dark:text-white">
              Chính sách Quyền riêng tư & Bảo vệ Dữ liệu TinPath
            </h3>
            <div className="space-y-2.5 text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
              <p>
                1. <strong>Bảo mật thông tin:</strong> TinPath cam kết không chia sẻ địa chỉ email, số điện thoại hay kết quả bài kiểm tra riêng tư của học sinh cho bên thứ ba.
              </p>
              <p>
                2. <strong>Bảng xếp hạng công khai:</strong> Chỉ hiển thị tên gọi, trường THPT, điểm XP và chuỗi ngày học để tạo động lực thi đua học tập lành mạnh.
              </p>
              <p>
                3. <strong>Tích hợp Google:</strong> Mọi thao tác lưu trữ Google Drive, xuất Google Sheets hay gửi Gmail đều chỉ thực hiện khi có sự xác nhận rõ ràng của người dùng.
              </p>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsPrivacyOpen(false)}
                className="px-5 py-2 rounded-lg bg-[#2878C8] hover:bg-[#2068B0] text-white font-bold text-sm shadow-xs transition-colors"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Detailed Ranking & Organization Modal */}
      {isLeaderboardOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl w-full max-w-7xl 2xl:max-w-[95vw] p-4 sm:p-6 md:p-8 border border-gray-200 dark:border-[#333] shadow-2xl max-h-[94vh] overflow-y-auto">
            <Leaderboard
              currentUser={user}
              onClose={() => setIsLeaderboardOpen(false)}
              isModal={true}
            />
          </div>
        </div>
      )}

      {/* Floating AI Bot in bottom-right corner: Bot Tin Học TQT */}
      {!activeExam && (
        <FloatingAiBot user={user} currentTopicId={activeTopicId} />
      )}
        </>
      )}
    </div>
  );
}
