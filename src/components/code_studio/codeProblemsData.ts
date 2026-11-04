export type SupportedLanguage = 'cpp' | 'python' | 'web';

export interface CodeProblem {
  id: string;
  code: string;
  title: string;
  language: SupportedLanguage;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  timeLimit: string;
  category: string;
  acRate: number;
  submissions: number;
  isSolved?: boolean;
  status?: 'ac' | 'attempted' | 'unsolved';
  description: string;
  inputDesc?: string;
  outputDesc?: string;
  sampleInput?: string;
  sampleOutput?: string;
  starterCode: {
    cpp?: string;
    python?: string;
    html?: string;
    css?: string;
  };
}

export const CODE_PROBLEMS: CodeProblem[] = [
  {
    id: 'p-1',
    code: 'CP-ALG-042',
    title: 'Dãy con liên tiếp có tổng lớn nhất',
    language: 'cpp',
    difficulty: 'medium',
    points: 200,
    timeLimit: '1.0s / 128MB',
    category: 'Quy hoạch động (Kadane)',
    acRate: 74.5,
    submissions: 1240,
    isSolved: true,
    status: 'ac',
    description: 'Cho dãy số nguyên A gồm n phần tử. Hãy tìm một dãy con gồm các phần tử liên tiếp sao cho tổng các phần tử của dãy con này là lớn nhất.',
    inputDesc: 'Dòng đầu tiên chứa số nguyên dương n (1 ≤ n ≤ 10^5). Dòng thứ hai chứa n số nguyên a1, a2, ..., an (-10^9 ≤ ai ≤ 10^9).',
    outputDesc: 'In ra một số nguyên duy nhất là tổng lớn nhất của dãy con liên tiếp tìm được.',
    sampleInput: '5\n-2 1 -3 4 -1 2 1 -5 4',
    sampleOutput: '6',
    starterCode: {
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

// Thuật toán Kadane - Dãy con liên tiếp có tổng lớn nhất
long long maxSubArraySum(const vector<long long>& a) {
    long long max_so_far = a[0];
    long long curr_max = a[0];

    for (size_t i = 1; i < a.size(); i++) {
        curr_max = max(a[i], curr_max + a[i]);
        max_so_far = max(max_so_far, curr_max);
    }
    return max_so_far;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    if (!(cin >> n)) {
        // Dữ liệu mẫu mặc định
        vector<long long> demo = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
        cout << "Tổng dãy con lớn nhất: " << maxSubArraySum(demo) << "\\n";
        return 0;
    }

    vector<long long> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];

    cout << maxSubArraySum(a) << "\\n";
    return 0;
}`
    }
  },
  {
    id: 'p-2',
    code: 'PY-STR-104',
    title: 'Đếm số nguyên âm và đảo ngược xâu',
    language: 'python',
    difficulty: 'easy',
    points: 100,
    timeLimit: '0.5s / 64MB',
    category: 'Mảng & Xâu ký tự',
    acRate: 89.2,
    submissions: 1583,
    isSolved: true,
    status: 'ac',
    description: 'Cho một chuỗi văn bản s. Hãy đếm số lượng nguyên âm (a, e, i, o, u) không phân biệt hoa thường và in ra xâu sau khi đảo ngược.',
    inputDesc: 'Một dòng duy nhất chứa chuỗi văn bản s (độ dài không quá 10^4).',
    outputDesc: 'Dòng 1: Số lượng nguyên âm. Dòng 2: Xâu ký tự sau khi đảo ngược.',
    sampleInput: 'TinPath Python',
    sampleOutput: '4\nnohtyP htaPniT',
    starterCode: {
      python: `# Online Python 3 Compiler (TinPath Editor)
# Viết và chạy mã nguồn Python trực tuyến

def tinh_giai_thua(n):
    if n <= 1:
        return 1
    return n * tinh_giai_thua(n - 1)

# Thực thi in kết quả ra màn hình
print("Xin chào từ TinPath Python!")
so = 5
ket_qua = tinh_giai_thua(so)
print(f"Giai thừa của {so} là: {ket_qua}")

# Thử nghiệm với chuỗi văn bản
van_ban = "TinPath 2026"
nguyen_am = sum(1 for c in van_ban.lower() if c in 'aeiou')
print(f"Số nguyên âm trong '{van_ban}': {nguyen_am}")
print(f"Đảo ngược chuỗi: {van_ban[::-1]}")`
    }
  },
  {
    id: 'p-3',
    code: 'WEB-CARD-004',
    title: 'Xây dựng Thẻ Sản phẩm Responsive & Hover Box',
    language: 'web',
    difficulty: 'easy',
    points: 100,
    timeLimit: 'HTML5 Semantic',
    category: 'Flexbox • CSS Hover UI',
    acRate: 84.5,
    submissions: 1120,
    isSolved: false,
    status: 'unsolved',
    description: 'Xây dựng một Card giao diện hiển thị khóa học lập trình Tin học 12 với hiệu ứng hover bóng đổ, nút đăng ký bo góc và thẻ tag badge.',
    starterCode: {
      html: `<h1>Xin chào!</h1>
<p>Hãy sửa code HTML ở đây và xem kết quả bên phải.</p>

<div class="card">
  <div class="badge">TIN HỌC 12</div>
  <h2>Chinh Phục Tin Học 2026</h2>
  <p>Học lập trình C++, Python và thiết kế Web chuẩn kỳ thi Tốt Nghiệp THPT Bộ GD&ĐT.</p>
  <button class="btn">Bắt Đầu Học Ngay</button>
</div>`,
      css: `body {
  font-family: system-ui, -apple-system, sans-serif;
  padding: 24px;
  background: #f8fafc;
  color: #1e293b;
}

h1 {
  color: #0f172a;
  margin-bottom: 8px;
}

.card {
  max-width: 360px;
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  margin-top: 20px;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 20px -3px rgb(0 0 0 / 0.15);
}

.badge {
  display: inline-block;
  background: #eff6ff;
  color: #2563eb;
  font-weight: 700;
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 9999px;
  margin-bottom: 12px;
}

h2 {
  font-size: 18px;
  margin: 0 0 8px 0;
}

p {
  color: #64748b;
  font-size: 14px;
  line-height: 1.5;
}

.btn {
  background: #2563eb;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 16px;
  transition: background 0.15s;
}

.btn:hover {
  background: #1d4ed8;
}`
    }
  },
  {
    id: 'p-4',
    code: 'CP-BIN-022',
    title: 'Chặt nhị phân tìm kiếm khoảng giá trị tối ưu',
    language: 'cpp',
    difficulty: 'hard',
    points: 300,
    timeLimit: '1.0s / 256MB',
    category: 'Binary Search • HSG Tỉnh',
    acRate: 31.8,
    submissions: 874,
    isSolved: false,
    status: 'attempted',
    description: 'Áp dụng thuật toán tìm kiếm nhị phân trên tập kết quả (Binary Search on Answer) để tìm giá trị cực đại thoả mãn điều kiện cho trước.',
    starterCode: {
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

// Tìm kiếm nhị phân giá trị lớn nhất thỏa mãn điều kiện
bool check(long long mid, const vector<int>& a, int k) {
    int count = 1;
    long long current_sum = 0;
    for (int x : a) {
        if (x > mid) return false;
        if (current_sum + x > mid) {
            count++;
            current_sum = x;
        } else {
            current_sum += x;
        }
    }
    return count <= k;
}

int main() {
    cout << "Thuật toán Chặt nhị phân tối ưu (Binary Search) - TinPath C++\\n";
    vector<int> a = {1, 2, 3, 4, 5, 6, 7, 8, 9};
    int k = 3;
    long long left = *max_element(a.begin(), a.end());
    long long right = 0;
    for (int x : a) right += x;

    long long ans = right;
    while (left <= right) {
        long long mid = left + (right - left) / 2;
        if (check(mid, a, k)) {
            ans = mid;
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }

    cout << "Giá trị cực tiểu của tổng lớn nhất: " << ans << "\\n";
    return 0;
}`
    }
  },
  {
    id: 'p-5',
    code: 'WEB-GRID-015',
    title: 'Bố cục Trang Báo Điện Tử Đa Cột với CSS Grid',
    language: 'web',
    difficulty: 'hard',
    points: 300,
    timeLimit: 'CSS Grid 12 cột',
    category: 'Responsive • Holy Grail Layout',
    acRate: 48.6,
    submissions: 650,
    isSolved: false,
    status: 'unsolved',
    description: 'Thiết kế bố cục layout báo điện tử 12 cột responsive chuẩn CSS Grid với bài viết tiêu điểm lớn và danh sách tin phụ bên cạnh.',
    starterCode: {
      html: `<div class="news-container">
  <header class="news-header">
    <h1>Tin Tức Công Nghệ TinPath</h1>
  </header>
  <main class="news-grid">
    <article class="featured-story">
      <span class="tag">TIÊU ĐIỂM</span>
      <h2>Trí Tuệ Nhân Tạo và Cuộc Cách Mạng Giáo Dục THPT</h2>
      <p>Các mô hình AI đang thay đổi cách học sinh tiếp cận kiến thức thuật toán và lập trình...</p>
    </article>
    <aside class="sidebar-stories">
      <div class="story-item">C++20: Những cải tiến cho lập trình thi đấu</div>
      <div class="story-item">Bí quyết đạt 10 điểm Tin học Tốt Nghiệp 2026</div>
      <div class="story-item">CSS Grid vs Flexbox: Khi nào nên dùng?</div>
    </aside>
  </main>
</div>`,
      css: `.news-container {
  max-width: 720px;
  margin: 0 auto;
  font-family: sans-serif;
}
.news-header {
  border-bottom: 2px solid #0f172a;
  margin-bottom: 16px;
}
.news-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
}
.featured-story {
  background: #f1f5f9;
  padding: 16px;
  border-radius: 12px;
}
.tag {
  background: #ef4444;
  color: white;
  font-size: 11px;
  font-weight: bold;
  padding: 2px 8px;
  border-radius: 4px;
}
.sidebar-stories {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.story-item {
  padding: 10px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
}`
    }
  },
  {
    id: 'p-6',
    code: 'PY-ARR-003',
    title: 'Tìm phần tử lớn thứ nhì trong mảng số nguyên',
    language: 'python',
    difficulty: 'easy',
    points: 100,
    timeLimit: '0.5s / 64MB',
    category: 'Mảng & Xâu ký tự',
    acRate: 91.4,
    submissions: 1991,
    isSolved: false,
    status: 'unsolved',
    description: 'Cho mảng n số nguyên. Hãy tìm giá trị lớn thứ nhì khác biệt trong mảng trong thời gian O(n).',
    starterCode: {
      python: `def tim_so_lon_thu_nhi(arr):
    # Loại bỏ phần tử trùng lặp và tìm số lớn thứ hai
    tap_hop = set(arr)
    if len(tap_hop) < 2:
        return None
    tap_hop.remove(max(tap_hop))
    return max(tap_hop)

# Thử nghiệm với mảng mẫu
mang_so = [12, 35, 1, 10, 34, 1, 35]
ket_qua = tim_so_lon_thu_nhi(mang_so)
print(f"Mảng ban đầu: {mang_so}")
print(f"Phần tử lớn thứ nhì là: {ket_qua}")`
    }
  },
  {
    id: 'p-7',
    code: 'CP-NUM-018',
    title: 'Sàng nguyên tố Eratosthenes và phân tích thừa số',
    language: 'cpp',
    difficulty: 'medium',
    points: 200,
    timeLimit: '0.8s / 128MB',
    category: 'Số học & Toán rời rạc',
    acRate: 68.3,
    submissions: 1420,
    isSolved: false,
    status: 'unsolved',
    description: 'Sử dụng thuật toán sàng Eratosthenes để tìm tất cả các số nguyên tố không vượt quá N và phân tích một số thành tích các thừa số nguyên tố.',
    starterCode: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

const int MAXN = 100000;
bool is_prime[MAXN + 1];

void sieve() {
    fill(is_prime, is_prime + MAXN + 1, true);
    is_prime[0] = is_prime[1] = false;
    for (int p = 2; p * p <= MAXN; p++) {
        if (is_prime[p]) {
            for (int i = p * p; i <= MAXN; i += p)
                is_prime[i] = false;
        }
    }
}

int main() {
    sieve();
    int count = 0;
    for (int i = 2; i <= 100; i++) {
        if (is_prime[i]) count++;
    }
    cout << "Số lượng số nguyên tố <= 100: " << count << "\\n";
    cout << "Các số nguyên tố đầu tiên: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29...\\n";
    return 0;
}`
    }
  },
  {
    id: 'p-8',
    code: 'WEB-NAV-008',
    title: 'Thanh Điều Hướng Navbar Dropdown Đa Cấp',
    language: 'web',
    difficulty: 'medium',
    points: 200,
    timeLimit: 'HTML/CSS UI',
    category: 'Navigation • Dropdown Menu',
    acRate: 77.1,
    submissions: 890,
    isSolved: false,
    status: 'unsolved',
    description: 'Thiết kế thanh điều hướng Navbar hiện đại với hiệu ứng dropdown mượt mà khi hover chuột.',
    starterCode: {
      html: `<nav class="navbar">
  <div class="logo">TinPath</div>
  <ul class="nav-links">
    <li><a href="#">Trang chủ</a></li>
    <li class="dropdown">
      <a href="#">Khóa học ▾</a>
      <ul class="dropdown-menu">
        <li><a href="#">C++ Nâng Cao</a></li>
        <li><a href="#">Python Cơ Bản</a></li>
        <li><a href="#">Thiết Kế Web</a></li>
      </ul>
    </li>
    <li><a href="#">Luyện Đề</a></li>
  </ul>
</nav>`,
      css: `.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1e293b;
  padding: 12px 24px;
  border-radius: 12px;
}
.logo {
  color: #38bdf8;
  font-weight: 800;
  font-size: 20px;
}
.nav-links {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 20px;
}
.nav-links a {
  color: #e2e8f0;
  text-decoration: none;
  font-size: 14px;
}
.dropdown {
  position: relative;
}
.dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background: #0f172a;
  list-style: none;
  padding: 8px 0;
  border-radius: 8px;
  min-width: 160px;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.5);
}
.dropdown:hover .dropdown-menu {
  display: block;
}
.dropdown-menu li a {
  display: block;
  padding: 8px 16px;
}
.dropdown-menu li a:hover {
  background: #334155;
}`
    }
  }
];

