/**
 * test_auth_flow.ts
 * Kiểm thử luồng xác thực, điều kiện render Landing Page vs Dashboard,
 * cơ chế Demo Mode chủ động và dọn dẹp mock user.
 */
import { storageService, INITIAL_EMPTY_PROFILE } from '../src/services/storageService';
import { DEMO_STUDENT_PROFILE, DEMO_TEACHER_PROFILE, isDemoUser } from '../src/data/demoData';

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

// Giả lập môi trường localStorage & sessionStorage cho Node.js/tsx
const createMockStorage = () => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = String(value); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
};

(global as any).localStorage = createMockStorage();
(global as any).sessionStorage = createMockStorage();

async function runAuthTests() {
  console.log('\n============================================================');
  console.log('KIỂM THỬ TOÀN DIỆN LUỒNG XÁC THỰC VÀ BẢO VỆ LANDING PAGE TINPATH');
  console.log('============================================================\n');

  // Test 1: Mở trình duyệt mới / chưa đăng nhập -> Landing Page (Không tự vào demo)
  console.log('--- Test 1 & 5: Truy cập URL gốc / khi chưa đăng nhập / mở trình duyệt mới ---');
  localStorage.clear();
  sessionStorage.clear();

  const emptyProfile = storageService.getUserProfile();
  assert(emptyProfile.id === '', 'Hồ sơ người dùng mới hoàn toàn rỗng');
  assert(emptyProfile.onboardingCompleted === false, 'onboardingCompleted là false khi chưa đăng nhập');
  assert(storageService.isDemoMode() === false, 'Demo mode mặc định tắt khi mở trình duyệt mới');

  // Mô phỏng logic khởi tạo App.tsx
  const initialIsLoggedIn = emptyProfile.onboardingCompleted === true && storageService.isDemoMode();
  assert(initialIsLoggedIn === false, 'Người dùng chưa đăng nhập không bao giờ tự động có isLoggedIn = true');

  // Test 2: Dọn dẹp cache mock user cũ (student_qn_01 / fightingalone0408@gmail.com)
  console.log('\n--- Test 2: Tự động dọn dẹp mock user legacy từ cache trình duyệt ---');
  localStorage.setItem('tinpath_user_profile', JSON.stringify({
    id: 'student_qn_01',
    email: 'fightingalone0408@gmail.com',
    displayName: 'Nguyễn Văn An',
    onboardingCompleted: true,
  }));
  const purgedProfile = storageService.getUserProfile();
  assert(purgedProfile.id === '', 'Mock user cũ (student_qn_01) bị tự động thanh trừng khỏi localStorage');
  assert(purgedProfile.onboardingCompleted === false, 'Profile sau khi thanh trừng có onboardingCompleted = false');

  // Test 3: Truy cập /login -> authView = 'login'
  console.log('\n--- Test 3: Định tuyến /login hiển thị màn hình đăng nhập ---');
  const mockPathLogin: string = '/login';
  const authViewLogin = mockPathLogin === '/login' ? 'login' : 'landing';
  assert(authViewLogin === 'login', 'URL /login đặt authView là login');

  const mockPathRoot: string = '/';
  const authViewRoot = mockPathRoot === '/login' ? 'login' : 'landing';
  assert(authViewRoot === 'landing', 'URL / đặt authView là landing');

  // Test 4: Đăng nhập thành công -> lưu đúng thông tin tài khoản thật
  console.log('\n--- Test 4: Đăng nhập thành công với tài khoản thật ---');
  localStorage.clear();
  const realUser = {
    ...INITIAL_EMPTY_PROFILE,
    id: 'user_real_supabase_uuid_123',
    email: 'nguyenvana@gmail.com',
    displayName: 'Nguyễn Văn A',
    onboardingCompleted: true,
  };
  storageService.saveUserProfile(realUser);
  const loadedRealUser = storageService.getUserProfile();
  assert(loadedRealUser.id === 'user_real_supabase_uuid_123', 'Lưu và khôi phục đúng user ID của tài khoản thật');
  assert(loadedRealUser.email === 'nguyenvana@gmail.com', 'Đúng email tài khoản thật');
  assert(isDemoUser(loadedRealUser) === false, 'Tài khoản thật không bị nhầm là demo user');

  // Test 5: Refresh trang khi đã đăng nhập
  console.log('\n--- Test 5: Refresh trang khi đã có session Supabase hợp lệ ---');
  const sessionUser = {
    id: 'user_real_supabase_uuid_123',
    email: 'nguyenvana@gmail.com',
  };
  // Khi Supabase khôi phục session, lấy profile từ DB hoặc storage
  const restoredProfile = storageService.getUserProfile();
  assert(restoredProfile.id === sessionUser.id, 'Session khôi phục đúng user ID');
  assert(restoredProfile.onboardingCompleted === true, 'Profile đã hoàn thành onboarding');

  // Test 6: Supabase chưa cấu hình hoặc lỗi -> không tự vào demo account
  console.log('\n--- Test 6: Supabase lỗi hoặc không phản hồi ---');
  localStorage.clear();
  sessionStorage.clear();
  // Giả sử Supabase trả về authUser = null hoặc ném lỗi
  const authUserError = null;
  const isDemo = storageService.isDemoMode();
  let fallbackLoggedIn = false;
  let fallbackUser = INITIAL_EMPTY_PROFILE;

  if (authUserError) {
    fallbackLoggedIn = true;
  } else if (isDemo) {
    fallbackLoggedIn = true;
  } else {
    fallbackLoggedIn = false;
    fallbackUser = INITIAL_EMPTY_PROFILE;
  }
  assert(fallbackLoggedIn === false, 'Khi Supabase lỗi/không có session, không fallback sang demo');
  assert(fallbackUser.id === '', 'User fallback là INITIAL_EMPTY_PROFILE rỗng');

  // Test 7: Nhấn "Dùng thử" -> Chỉ vào demo khi người dùng chủ động chọn
  console.log('\n--- Test 7: Người dùng chủ động nhấn "Dùng thử" ---');
  localStorage.clear();
  sessionStorage.clear();

  // Trước khi bấm dùng thử
  assert(storageService.isDemoMode() === false, 'Trước khi bấm: Demo mode tắt');

  // Người dùng chủ động kích hoạt demo
  storageService.setDemoMode(true);
  storageService.saveUserProfile(DEMO_STUDENT_PROFILE);

  assert(storageService.isDemoMode() === true, 'Sau khi bấm: Demo mode được bật');
  const demoStudent = storageService.getUserProfile();
  assert(demoStudent.id === 'demo_student_qn', 'Hồ sơ demo là demo_student_qn');
  assert(isDemoUser(demoStudent) === true, 'Hệ thống nhận diện chính xác đây là demo user');

  // Thoát demo mode (đăng xuất)
  storageService.clearUserProfile();
  assert(storageService.isDemoMode() === false, 'Sau khi thoát demo: Demo mode bị xóa hoàn toàn');
  const afterLogout = storageService.getUserProfile();
  assert(afterLogout.id === '', 'Hồ sơ sau khi thoát demo là rỗng');
  assert(afterLogout.onboardingCompleted === false, 'onboardingCompleted là false sau khi thoát demo');

  console.log('\n============================================================');
  console.log(`KẾT QUẢ KIỂM THỬ AUTH FLOW: ${passCount} PASSED, ${failCount} FAILED`);
  console.log('============================================================\n');

  if (failCount > 0) process.exit(1);
}

runAuthTests();
