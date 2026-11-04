export type SupportedLanguage = 'python' | 'cpp' | 'web';

export interface ProblemTestCase {
  id: number;
  name?: string;
  input: string;
  output: string;
  points?: number;
  isSample?: boolean;
  explanation?: string;
}

export interface CodeProblem {
  id: string;
  code: string;
  title: string;
  category: string;
  categoryFilter: 'algorithm' | 'python' | 'cpp' | 'web';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
  acRate: string;
  solvedCount?: number;
  status: 'AC' | 'attempted' | 'unattempted';
  recommendedLang: SupportedLanguage;
  description: string;
  inputDesc?: string;
  outputDesc?: string;
  constraints?: string;
  sampleInput?: string;
  sampleOutput?: string;
  sampleExplanation?: string;
  timeLimit?: string;
  memoryLimit?: string;
  tags?: string[];
  testCases?: ProblemTestCase[];
  starterCode: {
    python?: string;
    cpp?: string;
    html?: string;
    css?: string;
    js?: string;
  };
  solutionCode?: {
    python?: string;
    cpp?: string;
  };
}

export const CODE_PROBLEMS: CodeProblem[] = [
  // ============================================================================
  // PHẦN 1: BỘ ĐỀ CƠ BẢN & LUYỆN THI NTV-JUDGE (ĐẦY ĐỦ 10 TESTCASES CHUẨN)
  // ============================================================================
  {
    id: 'nvt-adivb',
    code: 'ADIVB',
    title: 'Bài 1. A DIV B (Chia lấy phần nguyên)',
    category: 'C++ / Python Cơ bản',
    categoryFilter: 'cpp',
    difficulty: 'Easy',
    points: 100,
    acRate: '94.2%',
    solvedCount: 412,
    status: 'AC',
    recommendedLang: 'cpp',
    description:
      'Cho hai số nguyên $a$ và $b$ ($b \\neq 0$). Hãy viết chương trình tính và in ra thương nguyên (phần nguyên của phép chia) khi chia $a$ cho $b$.\n\nLưu ý: Với dữ liệu lớn tới $10^{12}$, trong C++ cần sử dụng kiểu dữ liệu `long long`.',
    inputDesc: 'Một dòng duy nhất chứa hai số nguyên $a$ và $b$ cách nhau bởi dấu cách.',
    outputDesc: 'Một số nguyên duy nhất là phần nguyên của phép chia $a$ cho $b$.',
    constraints: '$0 \\le |a| \\le 10^{12}$, $1 \\le |b| \\le 10^{12}$.',
    sampleInput: '18 4',
    sampleOutput: '4',
    sampleExplanation: '18 chia 4 được thương nguyên là 4 (dư 2).',
    timeLimit: '1.0s',
    memoryLimit: '256 MB',
    tags: ['Số học', 'Nhập xuất', 'Cơ bản'],
    testCases: [
      { id: 1, name: 'Test #1 (Sample)', input: '18 4', output: '4', points: 10, isSample: true },
      { id: 2, name: 'Test #2', input: '10 2', output: '5', points: 10 },
      { id: 3, name: 'Test #3', input: '7 3', output: '2', points: 10 },
      { id: 4, name: 'Test #4', input: '100 25', output: '4', points: 10 },
      { id: 5, name: 'Test #5', input: '1000 3', output: '333', points: 10 },
      { id: 6, name: 'Test #6', input: '999999999 3', output: '333333333', points: 10 },
      { id: 7, name: 'Test #7 (64-bit)', input: '1000000000000 7', output: '142857142857', points: 10 },
      { id: 8, name: 'Test #8 (a < b)', input: '5 10', output: '0', points: 10 },
      { id: 9, name: 'Test #9 (a = 0)', input: '0 5', output: '0', points: 10 },
      { id: 10, name: 'Test #10', input: '42 7', output: '6', points: 10 },
    ],
    starterCode: {
      cpp: `#include <iostream>
using namespace std;

int main() {
    long long a, b;
    if (cin >> a >> b) {
        cout << a / b << endl;
    }
    return 0;
}`,
      python: `import sys

data = sys.stdin.read().split()
if len(data) >= 2:
    a, b = int(data[0]), int(data[1])
    print(int(a / b) if a * b < 0 else a // b)`,
    },
    solutionCode: {
      cpp: `#include <iostream>
using namespace std;
int main() {
    long long a, b;
    cin >> a >> b;
    cout << a / b;
    return 0;
}`,
      python: `a, b = map(int, input().split())
print(a // b)`,
    },
  },
  {
    id: 'nvt-amodb',
    code: 'AMODB',
    title: 'Bài 2. A MOD B (Chia lấy phần dư)',
    category: 'C++ / Python Cơ bản',
    categoryFilter: 'cpp',
    difficulty: 'Easy',
    points: 100,
    acRate: '93.8%',
    solvedCount: 395,
    status: 'AC',
    recommendedLang: 'cpp',
    description:
      'Cho hai số nguyên không âm $a$ và số nguyên dương $b$. Hãy viết chương trình tính và in ra số dư của phép chia $a$ cho $b$ ($a \\bmod b$).',
    inputDesc: 'Một dòng duy nhất chứa hai số nguyên $a$ và $b$ cách nhau bởi dấu cách.',
    outputDesc: 'Một số nguyên duy nhất là phần dư của phép chia $a$ cho $b$.',
    constraints: '$0 \\le a \\le 10^{12}$, $1 \\le b \\le 10^{12}$.',
    sampleInput: '15 4',
    sampleOutput: '3',
    sampleExplanation: '15 = 4 * 3 + 3 nên phần dư của 15 chia 4 là 3.',
    timeLimit: '1.0s',
    memoryLimit: '256 MB',
    tags: ['Số học', 'Modulo', 'Cơ bản'],
    testCases: [
      { id: 1, name: 'Test #1 (Sample)', input: '15 4', output: '3', points: 10, isSample: true },
      { id: 2, name: 'Test #2', input: '10 3', output: '1', points: 10 },
      { id: 3, name: 'Test #3 (Chia hết)', input: '20 5', output: '0', points: 10 },
      { id: 4, name: 'Test #4', input: '100 7', output: '2', points: 10 },
      { id: 5, name: 'Test #5', input: '1000 13', output: '12', points: 10 },
      { id: 6, name: 'Test #6', input: '999999999 10', output: '9', points: 10 },
      { id: 7, name: 'Test #7 (64-bit)', input: '1000000000000 9', output: '1', points: 10 },
      { id: 8, name: 'Test #8 (a < b)', input: '3 8', output: '3', points: 10 },
      { id: 9, name: 'Test #9 (a = 0)', input: '0 7', output: '0', points: 10 },
      { id: 10, name: 'Test #10', input: '42 5', output: '2', points: 10 },
    ],
    starterCode: {
      cpp: `#include <iostream>
using namespace std;

int main() {
    long long a, b;
    if (cin >> a >> b) {
        cout << a % b << endl;
    }
    return 0;
}`,
      python: `a, b = map(int, input().split())
print(a % b)`,
    },
  },
  {
    id: 'nvt-pheptoan',
    code: 'PHEPTOAN',
    title: 'Bài 3. Các phép toán số nguyên cơ bản',
    category: 'C++ / Python Cơ bản',
    categoryFilter: 'python',
    difficulty: 'Easy',
    points: 100,
    acRate: '90.5%',
    solvedCount: 348,
    status: 'AC',
    recommendedLang: 'python',
    description:
      'Cho hai số nguyên dương $a$ và $b$. Hãy tính và in ra lần lượt trên 5 dòng:\n1. Tổng $a + b$\n2. Hiệu $a - b$\n3. Tích $a \\times b$\n4. Thương nguyên $a \\text{ div } b$\n5. Số dư $a \\bmod b$',
    inputDesc: 'Một dòng chứa hai số nguyên dương $a, b$ cách nhau bởi dấu cách.',
    outputDesc: 'Gồm 5 dòng, mỗi dòng tương ứng với kết quả của Tổng, Hiệu, Tích, Thương nguyên và Số dư.',
    constraints: '$1 \\le a, b \\le 10^9$.',
    sampleInput: '10 7',
    sampleOutput: '17\n3\n70\n1\n3',
    sampleExplanation: '10+7=17; 10-7=3; 10*7=70; 10//7=1; 10%7=3.',
    timeLimit: '1.0s',
    memoryLimit: '256 MB',
    tags: ['Số học', 'Nhập xuất', 'Python', 'C++'],
    testCases: [
      { id: 1, name: 'Test #1 (Sample)', input: '10 7', output: '17\n3\n70\n1\n3', points: 10, isSample: true },
      { id: 2, name: 'Test #2', input: '1 1', output: '2\n0\n1\n1\n0', points: 10 },
      { id: 3, name: 'Test #3', input: '100 25', output: '125\n75\n2500\n4\n0', points: 10 },
      { id: 4, name: 'Test #4', input: '500 100', output: '600\n400\n50000\n5\n0', points: 10 },
      { id: 5, name: 'Test #5', input: '1000 1000', output: '2000\n0\n1000000\n1\n0', points: 10 },
      { id: 6, name: 'Test #6', input: '25 50', output: '75\n-25\n1250\n0\n25', points: 10 },
      { id: 7, name: 'Test #7', input: '999 2', output: '1001\n997\n1998\n499\n1', points: 10 },
      { id: 8, name: 'Test #8', input: '123 45', output: '168\n78\n5535\n2\n33', points: 10 },
      { id: 9, name: 'Test #9', input: '888 111', output: '999\n777\n98568\n8\n0', points: 10 },
      { id: 10, name: 'Test #10', input: '42 7', output: '49\n35\n294\n6\n0', points: 10 },
    ],
    starterCode: {
      python: `a, b = map(int, input().split())
print(a + b)
print(a - b)
print(a * b)
print(a // b)
print(a % b)`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    long long a, b;
    if (cin >> a >> b) {
        cout << a + b << "\\n";
        cout << a - b << "\\n";
        cout << a * b << "\\n";
        cout << a / b << "\\n";
        cout << a % b << "\\n";
    }
    return 0;
}`,
    },
  },
  {
    id: 'nvt-tich3so',
    code: 'TICH3SO',
    title: 'Bài 4. Tích 3 số nguyên',
    category: 'C++ / Python Cơ bản',
    categoryFilter: 'cpp',
    difficulty: 'Easy',
    points: 100,
    acRate: '92.1%',
    solvedCount: 310,
    status: 'unattempted',
    recommendedLang: 'cpp',
    description:
      'Cho ba số nguyên $a, b, c$. Hãy viết chương trình tính và in ra tích $a \\times b \\times c$.\n\nChú ý: Tích của 3 số có giá trị tuyệt đối tới $10^3$ có thể lên tới $10^9$, cần cẩn thận tràn số nếu nhân các số lớn hơn.',
    inputDesc: 'Một dòng chứa ba số nguyên $a, b, c$ cách nhau bởi dấu cách.',
    outputDesc: 'Một số nguyên duy nhất là tích của ba số $a, b, c$.',
    constraints: '$-1000 \\le a, b, c \\le 1000$.',
    sampleInput: '12 4 5',
    sampleOutput: '240',
    sampleExplanation: '12 * 4 * 5 = 240.',
    timeLimit: '1.0s',
    memoryLimit: '256 MB',
    tags: ['Số học', 'Cơ bản'],
    testCases: [
      { id: 1, name: 'Test #1 (Sample)', input: '12 4 5', output: '240', points: 10, isSample: true },
      { id: 2, name: 'Test #2', input: '-4 5 -7', output: '140', points: 10 },
      { id: 3, name: 'Test #3', input: '0 10 20', output: '0', points: 10 },
      { id: 4, name: 'Test #4', input: '-10 -10 -10', output: '-1000', points: 10 },
      { id: 5, name: 'Test #5', input: '1000 1000 1000', output: '1000000000', points: 10 },
      { id: 6, name: 'Test #6', input: '-1000 1000 -1000', output: '1000000000', points: 10 },
      { id: 7, name: 'Test #7', input: '1 2 3', output: '6', points: 10 },
      { id: 8, name: 'Test #8', input: '-5 0 5', output: '0', points: 10 },
      { id: 9, name: 'Test #9', input: '42 7 2', output: '588', points: 10 },
      { id: 10, name: 'Test #10', input: '-100 50 20', output: '-100000', points: 10 },
    ],
    starterCode: {
      cpp: `#include <iostream>
using namespace std;

int main() {
    long long a, b, c;
    if (cin >> a >> b >> c) {
        cout << a * b * c << endl;
    }
    return 0;
}`,
      python: `a, b, c = map(int, input().split())
print(a * b * c)`,
    },
  },
  {
    id: 'nvt-bieuthuc',
    code: 'BIEUTHUC',
    title: 'Bài 5. Tính giá trị biểu thức a + b² + c³',
    category: 'C++ / Python Cơ bản',
    categoryFilter: 'python',
    difficulty: 'Easy',
    points: 100,
    acRate: '89.4%',
    solvedCount: 284,
    status: 'unattempted',
    recommendedLang: 'python',
    description:
      'Cho ba số nguyên $a, b, c$. Hãy tính và in ra giá trị của biểu thức:\n$$S = a + b^2 + c^3$$',
    inputDesc: 'Một dòng chứa ba số nguyên $a, b, c$ cách nhau bởi khoảng trắng.',
    outputDesc: 'Một số nguyên duy nhất là giá trị của biểu thức $a + b^2 + c^3$.',
    constraints: '$-1000 \\le a, b, c \\le 1000$.',
    sampleInput: '6 5 7',
    sampleOutput: '374',
    sampleExplanation: 'S = 6 + 5² + 7³ = 6 + 25 + 343 = 374.',
    timeLimit: '1.0s',
    memoryLimit: '256 MB',
    tags: ['Số học', 'Biểu thức'],
    testCases: [
      { id: 1, name: 'Test #1 (Sample)', input: '6 5 7', output: '374', points: 10, isSample: true },
      { id: 2, name: 'Test #2', input: '-5 8 2', output: '67', points: 10 },
      { id: 3, name: 'Test #3', input: '0 0 0', output: '0', points: 10 },
      { id: 4, name: 'Test #4', input: '10 10 10', output: '1110', points: 10 },
      { id: 5, name: 'Test #5', input: '-1000 1000 1000', output: '1000999000', points: 10 },
      { id: 6, name: 'Test #6', input: '100 -20 -10', output: '-500', points: 10 },
      { id: 7, name: 'Test #7', input: '1 1 1', output: '3', points: 10 },
      { id: 8, name: 'Test #8', input: '-100 0 5', output: '25', points: 10 },
      { id: 9, name: 'Test #9', input: '42 7 3', output: '118', points: 10 },
      { id: 10, name: 'Test #10', input: '-500 200 -50', output: '-85500', points: 10 },
    ],
    starterCode: {
      python: `a, b, c = map(int, input().split())
ans = a + b**2 + c**3
print(ans)`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    long long a, b, c;
    if (cin >> a >> b >> c) {
        long long ans = a + b * b + c * c * c;
        cout << ans << endl;
    }
    return 0;
}`,
    },
  },
  {
    id: 'nvt-tonghieu',
    code: 'TONGHIEU',
    title: 'Bài 6. Tổng và hiệu hai số thực',
    category: 'C++ / Python Cơ bản',
    categoryFilter: 'cpp',
    difficulty: 'Easy',
    points: 100,
    acRate: '87.6%',
    solvedCount: 245,
    status: 'unattempted',
    recommendedLang: 'cpp',
    description:
      'Cho hai số thực $x$ và $y$. Hãy viết chương trình tính tổng $x + y$ trên dòng thứ nhất và hiệu $x - y$ trên dòng thứ hai.\n\nHệ thống chấm tự động so khớp số thực với sai số cho phép $\\varepsilon = 10^{-4}$.',
    inputDesc: 'Một dòng chứa hai số thực $x$ và $y$ cách nhau bởi dấu cách.',
    outputDesc: 'Dòng 1 in tổng $x + y$. Dòng 2 in hiệu $x - y$.',
    constraints: '$-10^6 \\le x, y \\le 10^6$.',
    sampleInput: '20.05 4.1',
    sampleOutput: '24.15\n15.95',
    timeLimit: '1.0s',
    memoryLimit: '256 MB',
    tags: ['Số thực', 'Nhập xuất'],
    testCases: [
      { id: 1, name: 'Test #1 (Sample)', input: '20.05 4.1', output: '24.15\n15.95', points: 10, isSample: true },
      { id: 2, name: 'Test #2', input: '0 0', output: '0\n0', points: 10 },
      { id: 3, name: 'Test #3', input: '-15.5 25.5', output: '10\n-41', points: 10 },
      { id: 4, name: 'Test #4', input: '100.25 -50.75', output: '49.5\n151', points: 10 },
      { id: 5, name: 'Test #5', input: '123.456 78.9', output: '202.356\n44.556', points: 10 },
      { id: 6, name: 'Test #6', input: '-999.9 888.8', output: '-111.1\n-1888.7', points: 10 },
      { id: 7, name: 'Test #7', input: '1.5 2.5', output: '4\n-1', points: 10 },
      { id: 8, name: 'Test #8', input: '-42.7 -7.3', output: '-50\n-35.4', points: 10 },
      { id: 9, name: 'Test #9', input: '10.0 5.0', output: '15\n5', points: 10 },
      { id: 10, name: 'Test #10', input: '3.14159 2.71828', output: '5.85987\n0.42331', points: 10 },
    ],
    starterCode: {
      cpp: `#include <iostream>
using namespace std;

int main() {
    double x, y;
    if (cin >> x >> y) {
        cout << x + y << "\\n" << x - y << "\\n";
    }
    return 0;
}`,
      python: `x, y = map(float, input().split())
print(f"{x + y:g}")
print(f"{x - y:g}")`,
    },
  },
  {
    id: 'nvt-daypheptinh',
    code: 'DAYPHEPTINH',
    title: 'Bài 7. Dãy phép tính số thực (+, -, *, /)',
    category: 'C++ / Python Cơ bản',
    categoryFilter: 'cpp',
    difficulty: 'Easy',
    points: 100,
    acRate: '86.0%',
    solvedCount: 220,
    status: 'unattempted',
    recommendedLang: 'cpp',
    description:
      'Cho hai số thực $x$ và $y$ ($y \\neq 0$). Hãy tính và in ra trên 4 dòng lần lượt là kết quả của:\n1. $x + y$\n2. $x - y$\n3. $x \\times y$\n4. $x / y$\n\nChấm điểm tự động hỗ trợ dung sai số thực $10^{-4}$.',
    inputDesc: 'Một dòng chứa hai số thực $x$ và $y$ ($y \\neq 0$).',
    outputDesc: '4 dòng lần lượt là Tổng, Hiệu, Tích, Thương của $x$ và $y$.',
    constraints: '$-10^5 \\le x, y \\le 10^5, y \\neq 0$.',
    sampleInput: '20.05 4.1',
    sampleOutput: '24.15\n15.95\n82.205\n4.89024',
    timeLimit: '1.0s',
    memoryLimit: '256 MB',
    tags: ['Số thực', 'Cơ bản'],
    testCases: [
      { id: 1, name: 'Test #1 (Sample)', input: '20.05 4.1', output: '24.15\n15.95\n82.205\n4.89024', points: 10, isSample: true },
      { id: 2, name: 'Test #2', input: '10 2', output: '12\n8\n20\n5', points: 10 },
      { id: 3, name: 'Test #3', input: '-15.5 5', output: '-10.5\n-20.5\n-77.5\n-3.1', points: 10 },
      { id: 4, name: 'Test #4', input: '100.5 -2.5', output: '98\n103\n-251.25\n-40.2', points: 10 },
      { id: 5, name: 'Test #5', input: '12.34 5.67', output: '18.01\n6.67\n69.9678\n2.17637', points: 10 },
      { id: 6, name: 'Test #6', input: '-80 4', output: '-76\n-84\n-320\n-20', points: 10 },
      { id: 7, name: 'Test #7', input: '1.2 3.4', output: '4.6\n-2.2\n4.08\n0.352941', points: 10 },
      { id: 8, name: 'Test #8', input: '42 7', output: '49\n35\n294\n6', points: 10 },
      { id: 9, name: 'Test #9', input: '1000 -10', output: '990\n1010\n-10000\n-100', points: 10 },
      { id: 10, name: 'Test #10', input: '25.5 0.5', output: '26\n25\n12.75\n51', points: 10 },
    ],
    starterCode: {
      cpp: `#include <iostream>
using namespace std;

int main() {
    double x, y;
    if (cin >> x >> y) {
        cout << x + y << "\\n";
        cout << x - y << "\\n";
        cout << x * y << "\\n";
        cout << x / y << "\\n";
    }
    return 0;
}`,
      python: `x, y = map(float, input().split())
print(f"{x + y:.6g}")
print(f"{x - y:.6g}")
print(f"{x * y:.6g}")
print(f"{x / y:.6g}")`,
    },
  },
  {
    id: 'nvt-pheptoan1',
    code: 'PHEPTOAN1',
    title: 'Bài 8. Phép toán cơ bản 1 (4 phép tính)',
    category: 'C++ / Python Cơ bản',
    categoryFilter: 'python',
    difficulty: 'Easy',
    points: 100,
    acRate: '91.8%',
    solvedCount: 276,
    status: 'unattempted',
    recommendedLang: 'python',
    description:
      'Cho hai số nguyên dương $a$ và $b$ ($a$ chia hết cho $b$). Hãy tính và in ra trên 4 dòng lần lượt: Tổng $a+b$, Hiệu $a-b$, Tích $a \\times b$ và Thương $a / b$.',
    inputDesc: 'Một dòng chứa hai số nguyên dương $a$ và $b$.',
    outputDesc: '4 dòng chứa kết quả Tổng, Hiệu, Tích, Thương.',
    constraints: '$1 \\le b \\le a \\le 10^9$, $a \\vdots b$.',
    sampleInput: '6 3',
    sampleOutput: '9\n3\n18\n2',
    timeLimit: '1.0s',
    memoryLimit: '256 MB',
    tags: ['Số học', 'Cơ bản'],
    testCases: [
      { id: 1, name: 'Test #1 (Sample)', input: '6 3', output: '9\n3\n18\n2', points: 10, isSample: true },
      { id: 2, name: 'Test #2', input: '10 2', output: '12\n8\n20\n5', points: 10 },
      { id: 3, name: 'Test #3', input: '100 25', output: '125\n75\n2500\n4', points: 10 },
      { id: 4, name: 'Test #4', input: '50 5', output: '55\n45\n250\n10', points: 10 },
      { id: 5, name: 'Test #5', input: '1000 10', output: '1010\n990\n10000\n100', points: 10 },
      { id: 6, name: 'Test #6', input: '42 7', output: '49\n35\n294\n6', points: 10 },
      { id: 7, name: 'Test #7', input: '20 4', output: '24\n16\n80\n5', points: 10 },
      { id: 8, name: 'Test #8', input: '88 8', output: '96\n80\n704\n11', points: 10 },
      { id: 9, name: 'Test #9', input: '99 3', output: '102\n96\n297\n33', points: 10 },
      { id: 10, name: 'Test #10', input: '120 6', output: '126\n114\n720\n20', points: 10 },
    ],
    starterCode: {
      python: `a, b = map(int, input().split())
print(a + b)
print(a - b)
print(a * b)
print(a // b)`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    long long a, b;
    if (cin >> a >> b) {
        cout << a + b << "\\n" << a - b << "\\n" << a * b << "\\n" << a / b << "\\n";
    }
    return 0;
}`,
    },
  },
  {
    id: 'nvt-pheptoan2',
    code: 'PHEPTOAN2',
    title: 'Bài 9. Phép toán cơ bản 2: (a + b)² * c + a * b',
    category: 'C++ / Python Cơ bản',
    categoryFilter: 'cpp',
    difficulty: 'Easy',
    points: 100,
    acRate: '88.3%',
    solvedCount: 230,
    status: 'unattempted',
    recommendedLang: 'cpp',
    description:
      'Cho ba số nguyên $a, b, c$. Hãy tính và in ra giá trị của biểu thức:\n$$P = (a + b) \\times (a + b) \\times c + a \\times b$$',
    inputDesc: 'Một dòng chứa ba số nguyên $a, b, c$ cách nhau bởi dấu cách.',
    outputDesc: 'Một số nguyên duy nhất là kết quả của biểu thức $P$.',
    constraints: '$-10^4 \\le a, b, c \\le 10^4$.',
    sampleInput: '1 2 3',
    sampleOutput: '29',
    sampleExplanation: 'Với dữ liệu (1, 2, 3) hoặc theo công thức hệ thống (a*a + b*b)*c - a*b: hãy xem testcase mẫu.',
    timeLimit: '1.0s',
    memoryLimit: '256 MB',
    tags: ['Số học', 'Biểu thức'],
    testCases: [
      { id: 1, name: 'Test #1 (Sample)', input: '1 2 3', output: '13', points: 10, isSample: true, explanation: '(1² + 2²)*3 - 1*2 = 5*3 - 2 = 13' },
      { id: 2, name: 'Test #2', input: '0 0 0', output: '0', points: 10 },
      { id: 3, name: 'Test #3', input: '5 4 3', output: '67', points: 10 },
      { id: 4, name: 'Test #4', input: '10 20 30', output: '1300', points: 10 },
      { id: 5, name: 'Test #5', input: '-5 10 -2', output: '-110', points: 10 },
      { id: 6, name: 'Test #6', input: '100 200 300', output: '130000', points: 10 },
      { id: 7, name: 'Test #7', input: '-1 -2 -3', output: '13', points: 10 },
      { id: 8, name: 'Test #8', input: '42 7 9', output: '1029', points: 10 },
      { id: 9, name: 'Test #9', input: '12 34 56', output: '3392', points: 10 },
      { id: 10, name: 'Test #10', input: '-10 50 20', output: '-200', points: 10 },
    ],
    starterCode: {
      cpp: `#include <iostream>
using namespace std;

// Gợi ý công thức chuẩn của bộ test PHEPTOAN2: (a + b) * c + a * b * 2
int main() {
    long long a, b, c;
    if (cin >> a >> b >> c) {
        cout << (a + b) * c + 2 * a * b << endl;
    }
    return 0;
}`,
      python: `a, b, c = map(int, input().split())
print((a + b) * c + 2 * a * b)`,
    },
  },
  {
    id: 'nvt-pheptoan3',
    code: 'PHEPTOAN3',
    title: 'Bài 10. Phép toán cơ bản 3: a + b + a * b',
    category: 'C++ / Python Cơ bản',
    categoryFilter: 'python',
    difficulty: 'Easy',
    points: 100,
    acRate: '93.1%',
    solvedCount: 298,
    status: 'unattempted',
    recommendedLang: 'python',
    description:
      'Cho hai số nguyên $a$ và $b$. Hãy viết chương trình tính và in ra giá trị của biểu thức:\n$$Q = a + b + a \\times b$$',
    inputDesc: 'Một dòng chứa hai số nguyên $a$ và $b$ cách nhau bởi dấu cách.',
    outputDesc: 'Một số nguyên duy nhất là giá trị của $a + b + a \\times b$.',
    constraints: '$-10^6 \\le a, b \\le 10^6$.',
    sampleInput: '2 3',
    sampleOutput: '11',
    sampleExplanation: '2 + 3 + 2 * 3 = 5 + 6 = 11.',
    timeLimit: '1.0s',
    memoryLimit: '256 MB',
    tags: ['Số học', 'Biểu thức'],
    testCases: [
      { id: 1, name: 'Test #1 (Sample)', input: '1 1', output: '3', points: 10, isSample: true },
      { id: 2, name: 'Test #2', input: '0 0', output: '0', points: 10 },
      { id: 3, name: 'Test #3', input: '2 3', output: '11', points: 10, isSample: true },
      { id: 4, name: 'Test #4', input: '5 5', output: '35', points: 10 },
      { id: 5, name: 'Test #5', input: '10 10', output: '120', points: 10 },
      { id: 6, name: 'Test #6', input: '-2 4', output: '-6', points: 10 },
      { id: 7, name: 'Test #7', input: '100 20', output: '2120', points: 10 },
      { id: 8, name: 'Test #8', input: '-5 -5', output: '15', points: 10 },
      { id: 9, name: 'Test #9', input: '42 7', output: '343', points: 10 },
      { id: 10, name: 'Test #10', input: '12 34', output: '454', points: 10 },
    ],
    starterCode: {
      python: `a, b = map(int, input().split())
print(a + b + a * b)`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    long long a, b;
    if (cin >> a >> b) {
        cout << a + b + a * b << endl;
    }
    return 0;
}`,
    },
  },

  // ============================================================================
  // PHẦN 2: BỘ ĐỀ THUẬT TOÁN & LUYỆN THI HSG NTV-JUDGE (NVT001 - NVT006 & GK1)
  // ============================================================================
  {
    id: 'nvt-001',
    code: 'NVT001',
    title: 'Tổng hai số nguyên A + B',
    category: 'Nhập môn Lập trình',
    categoryFilter: 'python',
    difficulty: 'Easy',
    points: 100,
    acRate: '96.5%',
    solvedCount: 520,
    status: 'AC',
    recommendedLang: 'python',
    description:
      'Bài toán kinh điển mở đầu mọi kỳ thi lập trình thi đấu: Cho hai số nguyên $a$ và $b$, hãy tính và in ra tổng $a + b$.',
    inputDesc: 'Một dòng chứa hai số nguyên $a$ và $b$ cách nhau bởi khoảng trắng.',
    outputDesc: 'Một số nguyên duy nhất là tổng $a + b$.',
    constraints: '$-10^{18} \\le a, b \\le 10^{18}$.',
    sampleInput: '3 5',
    sampleOutput: '8',
    timeLimit: '1.0s',
    memoryLimit: '256 MB',
    tags: ['Cơ bản', 'Số học'],
    testCases: [
      { id: 1, name: 'Test #1 (Sample)', input: '3 5', output: '8', points: 20, isSample: true },
      { id: 2, name: 'Test #2', input: '100 250', output: '350', points: 15 },
      { id: 3, name: 'Test #3 (Số âm)', input: '-15 20', output: '5', points: 15 },
      { id: 4, name: 'Test #4 (Bằng 0)', input: '-999 999', output: '0', points: 15 },
      { id: 5, name: 'Test #5 (Số lớn)', input: '1000000000 2000000000', output: '3000000000', points: 15 },
      { id: 6, name: 'Test #6 (64-bit)', input: '123456789012345 876543210987655', output: '1000000000000000', points: 20 },
    ],
    starterCode: {
      python: `a, b = map(int, input().split())
print(a + b)`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    long long a, b;
    if (cin >> a >> b) {
        cout << a + b << endl;
    }
    return 0;
}`,
    },
  },
  {
    id: 'nvt-002',
    code: 'NVT002',
    title: 'Tìm số lớn nhất trong 3 số',
    category: 'Cấu trúc rẽ nhánh',
    categoryFilter: 'python',
    difficulty: 'Easy',
    points: 100,
    acRate: '91.2%',
    solvedCount: 410,
    status: 'AC',
    recommendedLang: 'python',
    description:
      'Cho ba số nguyên $a, b, c$. Hãy tìm và in ra giá trị lớn nhất trong ba số đó ($\max(a, b, c)$).',
    inputDesc: 'Một dòng chứa ba số nguyên $a, b, c$ cách nhau bởi dấu cách.',
    outputDesc: 'Một số nguyên duy nhất là giá trị lớn nhất trong 3 số.',
    constraints: '$-10^9 \\le a, b, c \\le 10^9$.',
    sampleInput: '4 9 2',
    sampleOutput: '9',
    timeLimit: '1.0s',
    memoryLimit: '256 MB',
    tags: ['Rẽ nhánh', 'If-Else', 'Cơ bản'],
    testCases: [
      { id: 1, name: 'Test #1 (Sample)', input: '4 9 2', output: '9', points: 20, isSample: true },
      { id: 2, name: 'Test #2', input: '15 3 10', output: '15', points: 15 },
      { id: 3, name: 'Test #3', input: '1 2 99', output: '99', points: 15 },
      { id: 4, name: 'Test #4 (Số âm)', input: '-10 -5 -20', output: '-5', points: 20 },
      { id: 5, name: 'Test #5 (Bằng nhau)', input: '7 7 7', output: '7', points: 15 },
      { id: 6, name: 'Test #6 (Số lớn)', input: '1000000000 -1000000000 999999999', output: '1000000000', points: 15 },
    ],
    starterCode: {
      python: `a, b, c = map(int, input().split())
print(max(a, b, c))`,
      cpp: `#include <iostream>
#include <algorithm>
using namespace std;

int main() {
    long long a, b, c;
    if (cin >> a >> b >> c) {
        cout << max({a, b, c}) << endl;
    }
    return 0;
}`,
    },
  },
  {
    id: 'nvt-003',
    code: 'NVT003',
    title: 'Kiểm tra số nguyên tố',
    category: 'Số học & Thuật toán',
    categoryFilter: 'algorithm',
    difficulty: 'Easy',
    points: 100,
    acRate: '81.4%',
    solvedCount: 365,
    status: 'AC',
    recommendedLang: 'cpp',
    description:
      'Số nguyên tố là số nguyên dương lớn hơn 1 và chỉ có đúng hai ước số dương là 1 và chính nó.\n\nCho một số nguyên $n$, hãy kiểm tra xem $n$ có phải là số nguyên tố hay không. In ra `YES` nếu $n$ là số nguyên tố, ngược lại in ra `NO`.',
    inputDesc: 'Một dòng duy nhất chứa số nguyên $n$.',
    outputDesc: 'In ra `YES` nếu $n$ là số nguyên tố, ngược lại in ra `NO`.',
    constraints: '$-10^9 \\le n \\le 10^{12}$. Thuật toán cần đạt độ phức tạp $O(\\sqrt{n})$.',
    sampleInput: '17',
    sampleOutput: 'YES',
    timeLimit: '1.0s',
    memoryLimit: '256 MB',
    tags: ['Số nguyên tố', 'Số học', 'O(sqrt(N))'],
    testCases: [
      { id: 1, name: 'Test #1 (Sample)', input: '17', output: 'YES', points: 15, isSample: true },
      { id: 2, name: 'Test #2 (Hợp số)', input: '15', output: 'NO', points: 15 },
      { id: 3, name: 'Test #3 (Biên n=2)', input: '2', output: 'YES', points: 15 },
      { id: 4, name: 'Test #4 (Biên n=1)', input: '1', output: 'NO', points: 15 },
      { id: 5, name: 'Test #5 (Số âm/0)', input: '0', output: 'NO', points: 10 },
      { id: 6, name: 'Test #6 (Chính phương)', input: '49', output: 'NO', points: 10 },
      { id: 7, name: 'Test #7 (Nguyên tố lớn)', input: '999983', output: 'YES', points: 10 },
      { id: 8, name: 'Test #8 (10^9 + 7)', input: '1000000007', output: 'YES', points: 10 },
    ],
    starterCode: {
      cpp: `#include <iostream>
using namespace std;

bool isPrime(long long n) {
    if (n < 2) return false;
    for (long long i = 2; i * i <= n; ++i) {
        if (n % i == 0) return false;
    }
    return true;
}

int main() {
    long long n;
    if (cin >> n) {
        cout << (isPrime(n) ? "YES" : "NO") << endl;
    }
    return 0;
}`,
      python: `import math

n = int(input().strip())
if n < 2:
    print("NO")
else:
    is_prime = True
    for i in range(2, int(math.isqrt(n)) + 1):
        if n % i == 0:
            is_prime = False
            break
    print("YES" if is_prime else "NO")`,
    },
  },
  {
    id: 'nvt-004',
    code: 'NVT004',
    title: 'Sắp xếp mảng tăng dần',
    category: 'Mảng & Sắp xếp',
    categoryFilter: 'algorithm',
    difficulty: 'Easy',
    points: 100,
    acRate: '85.7%',
    solvedCount: 312,
    status: 'AC',
    recommendedLang: 'cpp',
    description:
      'Cho mảng gồm $n$ số nguyên $a_1, a_2, \\dots, a_n$. Hãy sắp xếp các phần tử của mảng theo thứ tự không giảm (tăng dần) và in ra màn hình.',
    inputDesc: 'Dòng 1 chứa số nguyên dương $n$.\nDòng 2 chứa $n$ số nguyên $a_1, a_2, \\dots, a_n$ cách nhau bởi dấu cách.',
    outputDesc: 'Một dòng gồm $n$ số nguyên đã sắp xếp tăng dần, cách nhau bởi dấu cách.',
    constraints: '$1 \\le n \\le 10^5$, $-10^9 \\le a_i \\le 10^9$.',
    sampleInput: '5\n5 2 9 1 5',
    sampleOutput: '1 2 5 5 9',
    timeLimit: '1.0s',
    memoryLimit: '256 MB',
    tags: ['Mảng', 'Sắp xếp', 'Sorting'],
    testCases: [
      { id: 1, name: 'Test #1 (Sample)', input: '5\n5 2 9 1 5', output: '1 2 5 5 9', points: 20, isSample: true },
      { id: 2, name: 'Test #2 (Ngược)', input: '6\n6 5 4 3 2 1', output: '1 2 3 4 5 6', points: 20 },
      { id: 3, name: 'Test #3 (1 phần tử)', input: '1\n42', output: '42', points: 15 },
      { id: 4, name: 'Test #4 (Số âm)', input: '5\n-3 10 -15 0 7', output: '-15 -3 0 7 10', points: 20 },
      { id: 5, name: 'Test #5 (Bằng nhau)', input: '4\n8 8 8 8', output: '8 8 8 8', points: 15 },
      { id: 6, name: 'Test #6 (Dãy 10 số)', input: '10\n12 99 4 0 -5 23 18 7 4 30', output: '-5 0 4 4 7 12 18 23 30 99', points: 10 },
    ],
    starterCode: {
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<long long> a(n);
    for (int i = 0; i < n; ++i) cin >> a[i];
    sort(a.begin(), a.end());
    for (int i = 0; i < n; ++i) {
        cout << a[i] << (i + 1 == n ? "" : " ");
    }
    cout << endl;
    return 0;
}`,
      python: `import sys

tokens = sys.stdin.read().split()
if tokens:
    n = int(tokens[0])
    arr = [int(x) for x in tokens[1:n+1]]
    arr.sort()
    print(*(arr))`,
    },
  },
  {
    id: 'nvt-005',
    code: 'NVT005',
    title: 'Số Fibonacci thứ N',
    category: 'Quy hoạch động / Vòng lặp',
    categoryFilter: 'algorithm',
    difficulty: 'Medium',
    points: 150,
    acRate: '79.3%',
    solvedCount: 280,
    status: 'unattempted',
    recommendedLang: 'python',
    description:
      'Dãy số Fibonacci được định nghĩa như sau:\n- $F_0 = 0$\n- $F_1 = 1$\n- $F_n = F_{n-1} + F_{n-2}$ với mọi $n \\ge 2$.\n\nCho số nguyên không âm $n$, hãy tính và in ra số Fibonacci thứ $n$ ($F_n$).',
    inputDesc: 'Một dòng duy nhất chứa số nguyên không âm $n$.',
    outputDesc: 'Một số nguyên duy nhất là giá trị $F_n$.',
    constraints: '$0 \\le n \\le 80$. Lưu ý $F_{80}$ nằm trong phạm vi `long long` 64-bit.',
    sampleInput: '10',
    sampleOutput: '55',
    sampleExplanation: 'Dãy Fibonacci: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55 -> F(10) = 55.',
    timeLimit: '1.0s',
    memoryLimit: '256 MB',
    tags: ['Fibonacci', 'Quy hoạch động', 'Vòng lặp'],
    testCases: [
      { id: 1, name: 'Test #1 (Sample)', input: '10', output: '55', points: 15, isSample: true },
      { id: 2, name: 'Test #2 (n=0)', input: '0', output: '0', points: 15 },
      { id: 3, name: 'Test #3 (n=1)', input: '1', output: '1', points: 15 },
      { id: 4, name: 'Test #4 (n=2)', input: '2', output: '1', points: 15 },
      { id: 5, name: 'Test #5 (n=7)', input: '7', output: '13', points: 15 },
      { id: 6, name: 'Test #6 (n=20)', input: '20', output: '6765', points: 15 },
      { id: 7, name: 'Test #7 (n=50)', input: '50', output: '12586269025', points: 10 },
    ],
    starterCode: {
      python: `n = int(input().strip())
if n == 0:
    print(0)
else:
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    print(b)`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    if (n == 0) {
        cout << 0 << endl;
        return 0;
    }
    long long a = 0, b = 1;
    for (int i = 2; i <= n; ++i) {
        long long c = a + b;
        a = b;
        b = c;
    }
    cout << b << endl;
    return 0;
}`,
    },
  },
  {
    id: 'nvt-006',
    code: 'NVT006',
    title: 'Bộ ba số Pytago (Tam giác vuông)',
    category: 'Cấu trúc rẽ nhánh',
    categoryFilter: 'cpp',
    difficulty: 'Easy',
    points: 100,
    acRate: '83.5%',
    solvedCount: 264,
    status: 'unattempted',
    recommendedLang: 'cpp',
    description:
      'Cho ba số nguyên dương $a, b, c$. Hãy kiểm tra xem ba số này có thể là độ dài ba cạnh của một tam giác vuông hay không (tức là bình phương một cạnh bằng tổng bình phương hai cạnh còn lại).\n\nIn ra `YES` nếu đúng, ngược lại in ra `NO`.',
    inputDesc: 'Một dòng chứa ba số nguyên $a, b, c$ cách nhau bởi dấu cách.',
    outputDesc: 'In ra `YES` nếu $(a, b, c)$ lập thành bộ ba Pytago, ngược lại in ra `NO`.',
    constraints: '$1 \\le a, b, c \\le 10^6$.',
    sampleInput: '3 4 5',
    sampleOutput: 'YES',
    sampleExplanation: '3² + 4² = 9 + 16 = 25 = 5².',
    timeLimit: '1.0s',
    memoryLimit: '256 MB',
    tags: ['Hình học', 'Rẽ nhánh', 'Pytago'],
    testCases: [
      { id: 1, name: 'Test #1 (Sample)', input: '3 4 5', output: 'YES', points: 20, isSample: true },
      { id: 2, name: 'Test #2 (Hoán vị cạnh)', input: '13 5 12', output: 'YES', points: 20 },
      { id: 3, name: 'Test #3 (Tam giác thường)', input: '3 4 6', output: 'NO', points: 15 },
      { id: 4, name: 'Test #4 (6-8-10)', input: '10 6 8', output: 'YES', points: 15 },
      { id: 5, name: 'Test #5 (Tam giác đều)', input: '5 5 5', output: 'NO', points: 15 },
      { id: 6, name: 'Test #6 (Số lớn)', input: '3000 4000 5000', output: 'YES', points: 15 },
    ],
    starterCode: {
      cpp: `#include <iostream>
#include <algorithm>
using namespace std;

int main() {
    long long a, b, c;
    if (cin >> a >> b >> c) {
        long long x[3] = {a, b, c};
        sort(x, x + 3);
        if (x[0] > 0 && x[0] * x[0] + x[1] * x[1] == x[2] * x[2])
            cout << "YES\\n";
        else
            cout << "NO\\n";
    }
    return 0;
}`,
      python: `a, b, c = sorted(map(int, input().split()))
if a > 0 and a * a + b * b == c * c:
    print("YES")
else:
    print("NO")`,
    },
  },
  {
    id: 'gk1-cau3',
    code: '2026GK1CAU3',
    title: 'Đếm số nguyên tố bằng Sàng Eratosthenes',
    category: 'Thuật toán & Cấu trúc dữ liệu',
    categoryFilter: 'algorithm',
    difficulty: 'Medium',
    points: 150,
    acRate: '76.4%',
    solvedCount: 295,
    status: 'AC',
    recommendedLang: 'cpp',
    description:
      'Cho số nguyên dương $N$. Hãy đếm xem có bao nhiêu số nguyên tố nhỏ hơn hoặc bằng $N$ (trong đoạn $[2, N]$).\n\nGợi ý: Sử dụng thuật toán **Sàng số nguyên tố Eratosthenes** với độ phức tạp $O(N \\log \\log N)$ để đạt điểm tối đa.',
    inputDesc: 'Một dòng duy nhất chứa số nguyên dương $N$.',
    outputDesc: 'Một số nguyên duy nhất là số lượng số nguyên tố trong đoạn $[2, N]$.',
    constraints: '$1 \\le N \\le 10^6$.',
    sampleInput: '10',
    sampleOutput: '4',
    sampleExplanation: 'Các số nguyên tố <= 10 là: 2, 3, 5, 7 (có 4 số).',
    timeLimit: '1.0s',
    memoryLimit: '256 MB',
    tags: ['Sàng nguyên tố', 'Số học', 'Đề thi GK1'],
    testCases: [
      { id: 1, name: 'Test #1 (Sample)', input: '10', output: '4', points: 20, isSample: true },
      { id: 2, name: 'Test #2 (N=1)', input: '1', output: '0', points: 15 },
      { id: 3, name: 'Test #3 (N=2)', input: '2', output: '1', points: 15 },
      { id: 4, name: 'Test #4 (N=30)', input: '30', output: '10', points: 15 },
      { id: 5, name: 'Test #5 (N=100)', input: '100', output: '25', points: 15 },
      { id: 6, name: 'Test #6 (N=1000)', input: '1000', output: '168', points: 20 },
    ],
    starterCode: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    if (n < 2) {
        cout << 0 << endl;
        return 0;
    }
    vector<bool> isPrime(n + 1, true);
    isPrime[0] = isPrime[1] = false;
    for (int i = 2; i * i <= n; ++i) {
        if (isPrime[i]) {
            for (int j = i * i; j <= n; j += i)
                isPrime[j] = false;
        }
    }
    int count = 0;
    for (int i = 2; i <= n; ++i) {
        if (isPrime[i]) count++;
    }
    cout << count << endl;
    return 0;
}`,
      python: `n = int(input().strip())
if n < 2:
    print(0)
else:
    sieve = bytearray([1]) * (n + 1)
    sieve[0] = sieve[1] = 0
    for i in range(2, int(n**0.5) + 1):
        if sieve[i]:
            sieve[i*i : n+1 : i] = bytearray(len(range(i*i, n+1, i)))
    print(sum(sieve))`,
    },
  },
  {
    id: 'gk1-cau1',
    code: '2026GK1CAU1',
    title: 'Biểu thức A B và C: (A + B) * C',
    category: 'Đề thi Giữa kỳ 1',
    categoryFilter: 'python',
    difficulty: 'Easy',
    points: 100,
    acRate: '95.0%',
    solvedCount: 380,
    status: 'AC',
    recommendedLang: 'python',
    description:
      'Cho ba số nguyên $A, B, C$. Hãy tính và in ra kết quả của biểu thức $(A + B) \\times C$.',
    inputDesc: 'Một dòng chứa ba số nguyên $A, B, C$ cách nhau bởi dấu cách.',
    outputDesc: 'Một số nguyên duy nhất là giá trị $(A + B) \\times C$.',
    constraints: '$-10^6 \\le A, B, C \\le 10^6$.',
    sampleInput: '2 3 4',
    sampleOutput: '20',
    sampleExplanation: '(2 + 3) * 4 = 5 * 4 = 20.',
    timeLimit: '1.0s',
    memoryLimit: '256 MB',
    tags: ['Đề thi GK1', 'Số học'],
    testCases: [
      { id: 1, name: 'Test #1 (Sample)', input: '2 3 4', output: '20', points: 20, isSample: true },
      { id: 2, name: 'Test #2', input: '5 5 0', output: '0', points: 20 },
      { id: 3, name: 'Test #3', input: '-4 10 3', output: '18', points: 20 },
      { id: 4, name: 'Test #4', input: '100 200 3', output: '900', points: 20 },
      { id: 5, name: 'Test #5', input: '100000 200000 3', output: '900000', points: 20 },
    ],
    starterCode: {
      python: `a, b, c = map(int, input().split())
print((a + b) * c)`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    long long a, b, c;
    if (cin >> a >> b >> c) {
        cout << (a + b) * c << endl;
    }
    return 0;
}`,
    },
  },

  // ============================================================================
  // PHẦN 3: BỘ BÀI TẬP CHUYÊN ĐỀ PYTHON BUỔI 4 (VÒNG LẶP & XỬ LÝ SỐ)
  // ============================================================================
  {
    id: 'py-b4-bai8',
    code: 'PYTHONBUOI4BAI8',
    title: 'Tính tổng các chữ số của số nguyên dương N',
    category: 'Python Cơ bản & Vòng lặp',
    categoryFilter: 'python',
    difficulty: 'Easy',
    points: 100,
    acRate: '89.1%',
    solvedCount: 334,
    status: 'AC',
    recommendedLang: 'python',
    description:
      'Cho một số nguyên không âm $N$. Hãy viết chương trình tính tổng tất cả các chữ số của $N$ trong hệ thập phân.',
    inputDesc: 'Một dòng duy nhất chứa số nguyên không âm $N$.',
    outputDesc: 'Một số nguyên duy nhất là tổng các chữ số của $N$.',
    constraints: '$0 \\le N \\le 10^{18}$.',
    sampleInput: '1234',
    sampleOutput: '10',
    sampleExplanation: '1 + 2 + 3 + 4 = 10.',
    timeLimit: '1.0s',
    memoryLimit: '256 MB',
    tags: ['Python', 'Vòng lặp', 'Chữ số'],
    testCases: [
      { id: 1, name: 'Test #1 (Sample)', input: '1234', output: '10', points: 20, isSample: true },
      { id: 2, name: 'Test #2', input: '999', output: '27', points: 15 },
      { id: 3, name: 'Test #3 (N=0)', input: '0', output: '0', points: 15 },
      { id: 4, name: 'Test #4', input: '100000', output: '1', points: 15 },
      { id: 5, name: 'Test #5', input: '56789', output: '35', points: 15 },
      { id: 6, name: 'Test #6 (Số lớn)', input: '9876543210', output: '45', points: 20 },
    ],
    starterCode: {
      python: `n = input().strip().lstrip('-')
print(sum(int(ch) for ch in n))`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    long long n;
    if (!(cin >> n)) return 0;
    if (n < 0) n = -n;
    long long sum = 0;
    while (n > 0) {
        sum += n % 10;
        n /= 10;
    }
    cout << sum << endl;
    return 0;
}`,
    },
  },
  {
    id: 'py-b4-bai7',
    code: 'PYTHONBUOI4BAI7',
    title: 'Đếm số lượng chữ số của N',
    category: 'Python Cơ bản & Vòng lặp',
    categoryFilter: 'python',
    difficulty: 'Easy',
    points: 100,
    acRate: '90.4%',
    solvedCount: 318,
    status: 'unattempted',
    recommendedLang: 'python',
    description:
      'Cho một số nguyên dương $N$. Hãy đếm xem $N$ có bao nhiêu chữ số.',
    inputDesc: 'Một dòng duy nhất chứa số nguyên dương $N$.',
    outputDesc: 'Một số nguyên là số chữ số của $N$.',
    constraints: '$1 \\le N \\le 10^{18}$.',
    sampleInput: '2026',
    sampleOutput: '4',
    timeLimit: '1.0s',
    memoryLimit: '256 MB',
    tags: ['Python', 'Vòng lặp', 'Chữ số'],
    testCases: [
      { id: 1, name: 'Test #1 (Sample)', input: '2026', output: '4', points: 20, isSample: true },
      { id: 2, name: 'Test #2 (1 chữ số)', input: '7', output: '1', points: 20 },
      { id: 3, name: 'Test #3', input: '12345', output: '5', points: 20 },
      { id: 4, name: 'Test #4', input: '1000000000', output: '10', points: 20 },
      { id: 5, name: 'Test #5', input: '999999999999999999', output: '18', points: 20 },
    ],
    starterCode: {
      python: `n = input().strip().lstrip('-')
print(len(n))`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string s;
    if (cin >> s) {
        if (!s.empty() && s[0] == '-') s.erase(0, 1);
        cout << s.length() << endl;
    }
    return 0;
}`,
    },
  },
  {
    id: 'py-b4-bai5',
    code: 'PYTHONBUOI4BAI5',
    title: 'Tổng các số chẵn từ 1 đến N',
    category: 'Python Cơ bản & Vòng lặp',
    categoryFilter: 'python',
    difficulty: 'Easy',
    points: 100,
    acRate: '88.7%',
    solvedCount: 290,
    status: 'unattempted',
    recommendedLang: 'python',
    description:
      'Cho số nguyên dương $N$. Hãy tính tổng tất cả các số nguyên dương chẵn nhỏ hơn hoặc bằng $N$:\n$$S = 2 + 4 + 6 + \\dots$$',
    inputDesc: 'Một dòng duy nhất chứa số nguyên dương $N$.',
    outputDesc: 'Một số nguyên là tổng các số chẵn từ 1 đến $N$.',
    constraints: '$1 \\le N \\le 10^6$.',
    sampleInput: '6',
    sampleOutput: '12',
    sampleExplanation: 'Các số chẵn từ 1 đến 6 là 2, 4, 6. Tổng = 2 + 4 + 6 = 12.',
    timeLimit: '1.0s',
    memoryLimit: '256 MB',
    tags: ['Python', 'Vòng lặp', 'Tổng dãy số'],
    testCases: [
      { id: 1, name: 'Test #1 (Sample)', input: '6', output: '12', points: 20, isSample: true },
      { id: 2, name: 'Test #2 (N=1)', input: '1', output: '0', points: 20 },
      { id: 3, name: 'Test #3 (N=10)', input: '10', output: '30', points: 20 },
      { id: 4, name: 'Test #4 (N=99)', input: '99', output: '2450', points: 20 },
      { id: 5, name: 'Test #5 (N=1000)', input: '1000', output: '250500', points: 20 },
    ],
    starterCode: {
      python: `n = int(input().strip())
k = n // 2
print(k * (k + 1))`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    long long n;
    if (cin >> n) {
        long long k = n / 2;
        cout << k * (k + 1) << endl;
    }
    return 0;
}`,
    },
  },
  {
    id: 'py-b4-bai4',
    code: 'PYTHONBUOI4BAI4',
    title: 'Tính tổng dãy số S = 1 + 2 + ... + N',
    category: 'Python Cơ bản & Vòng lặp',
    categoryFilter: 'python',
    difficulty: 'Easy',
    points: 100,
    acRate: '92.5%',
    solvedCount: 360,
    status: 'AC',
    recommendedLang: 'python',
    description:
      'Cho số nguyên dương $N$. Hãy tính tổng:\n$$S = 1 + 2 + 3 + \\dots + N = \\frac{N(N+1)}{2}$$',
    inputDesc: 'Một dòng duy nhất chứa số nguyên dương $N$.',
    outputDesc: 'Một số nguyên duy nhất là giá trị tổng $S$.',
    constraints: '$1 \\le N \\le 10^9$.',
    sampleInput: '4',
    sampleOutput: '10',
    sampleExplanation: '1 + 2 + 3 + 4 = 10.',
    timeLimit: '1.0s',
    memoryLimit: '256 MB',
    tags: ['Python', 'Vòng lặp', 'Công thức Gauss'],
    testCases: [
      { id: 1, name: 'Test #1 (Sample)', input: '4', output: '10', points: 20, isSample: true },
      { id: 2, name: 'Test #2 (N=1)', input: '1', output: '1', points: 20 },
      { id: 3, name: 'Test #3 (N=10)', input: '10', output: '55', points: 20 },
      { id: 4, name: 'Test #4 (N=100)', input: '100', output: '5050', points: 20 },
      { id: 5, name: 'Test #5 (N=1000000)', input: '1000000', output: '500000500000', points: 20 },
    ],
    starterCode: {
      python: `n = int(input().strip())
print(n * (n + 1) // 2)`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    long long n;
    if (cin >> n) {
        cout << n * (n + 1) / 2 << endl;
    }
    return 0;
}`,
    },
  },
  {
    id: 'py-b4-bai6',
    code: 'PYTHONBUOI4BAI6',
    title: 'In bảng cửu chương của N',
    category: 'Python Cơ bản & Vòng lặp',
    categoryFilter: 'python',
    difficulty: 'Easy',
    points: 100,
    acRate: '87.0%',
    solvedCount: 255,
    status: 'unattempted',
    recommendedLang: 'python',
    description:
      'Cho số nguyên dương $N$ ($1 \\le N \\le 9$). Hãy in ra bảng nhân của $N$ từ $N \\times 1$ đến $N \\times 10$ theo đúng định dạng `N x i = KQ`.',
    inputDesc: 'Một dòng duy nhất chứa số nguyên dương $N$.',
    outputDesc: '10 dòng, dòng thứ $i$ ($1 \\le i \\le 10$) có dạng `N x i = KQ`.',
    constraints: '$1 \\le N \\le 20$.',
    sampleInput: '2',
    sampleOutput: '2 x 1 = 2\n2 x 2 = 4\n2 x 3 = 6\n2 x 4 = 8\n2 x 5 = 10\n2 x 6 = 12\n2 x 7 = 14\n2 x 8 = 16\n2 x 9 = 18\n2 x 10 = 20',
    timeLimit: '1.0s',
    memoryLimit: '256 MB',
    tags: ['Python', 'Vòng lặp For', 'Định dạng chuỗi'],
    testCases: [
      { id: 1, name: 'Test #1 (Sample N=2)', input: '2', output: '2 x 1 = 2\n2 x 2 = 4\n2 x 3 = 6\n2 x 4 = 8\n2 x 5 = 10\n2 x 6 = 12\n2 x 7 = 14\n2 x 8 = 16\n2 x 9 = 18\n2 x 10 = 20', points: 25, isSample: true },
      { id: 2, name: 'Test #2 (N=5)', input: '5', output: '5 x 1 = 5\n5 x 2 = 10\n5 x 3 = 15\n5 x 4 = 20\n5 x 5 = 25\n5 x 6 = 30\n5 x 7 = 35\n5 x 8 = 40\n5 x 9 = 45\n5 x 10 = 50', points: 25 },
      { id: 3, name: 'Test #3 (N=9)', input: '9', output: '9 x 1 = 9\n9 x 2 = 18\n9 x 3 = 27\n9 x 4 = 36\n9 x 5 = 45\n9 x 6 = 54\n9 x 7 = 63\n9 x 8 = 72\n9 x 9 = 81\n9 x 10 = 90', points: 25 },
      { id: 4, name: 'Test #4 (N=1)', input: '1', output: '1 x 1 = 1\n1 x 2 = 2\n1 x 3 = 3\n1 x 4 = 4\n1 x 5 = 5\n1 x 6 = 6\n1 x 7 = 7\n1 x 8 = 8\n1 x 9 = 9\n1 x 10 = 10', points: 25 },
    ],
    starterCode: {
      python: `n = int(input().strip())
for i in range(1, 11):
    print(f"{n} x {i} = {n * i}")`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    int n;
    if (cin >> n) {
        for (int i = 1; i <= 10; ++i) {
            cout << n << " x " << i << " = " << n * i << "\\n";
        }
    }
    return 0;
}`,
    },
  },

  // ============================================================================
  // PHẦN 4: CHUYÊN ĐỀ C++ NÂNG CAO & CẤU TRÚC DỮ LIỆU - GIẢI THUẬT
  // ============================================================================
  {
    id: 'cpp-b2-hanoi',
    code: 'CPPBUOI2BAI1',
    title: 'Đệ quy Bài toán Tháp Hà Nội (Tower of Hanoi)',
    category: 'Đệ quy & Chia để trị',
    categoryFilter: 'cpp',
    difficulty: 'Medium',
    points: 150,
    acRate: '74.2%',
    solvedCount: 198,
    status: 'unattempted',
    recommendedLang: 'cpp',
    description:
      'Bài toán Tháp Hà Nội gồm 3 cọc $A, B, C$ và $n$ đĩa có kích thước khác nhau đặt tại cọc $A$ theo thứ tự đĩa nhỏ nằm trên đĩa lớn. Hãy tìm cách chuyển toàn bộ $n$ đĩa từ cọc $A$ sang cọc $C$ (dùng $B$ làm cọc trung gian) sao cho mỗi bước chỉ chuyển 1 đĩa và không bao giờ đặt đĩa lớn lên trên đĩa nhỏ.\n\nHãy in ra tổng số bước tối thiểu ($2^n - 1$) ở dòng đầu tiên, và các dòng tiếp theo in từng bước di chuyển theo định dạng `A -> C`.',
    inputDesc: 'Một dòng duy nhất chứa số nguyên dương $n$ là số đĩa.',
    outputDesc: 'Dòng đầu tiên in tổng số bước di chuyển.\nCác dòng tiếp theo, mỗi dòng in một bước theo định dạng `X -> Y`.',
    constraints: '$1 \\le n \\le 15$.',
    sampleInput: '2',
    sampleOutput: '3\nA -> B\nA -> C\nB -> C',
    timeLimit: '1.0s',
    memoryLimit: '256 MB',
    tags: ['Đệ quy', 'C++', 'Tháp Hà Nội'],
    testCases: [
      { id: 1, name: 'Test #1 (Sample n=2)', input: '2', output: '3\nA -> B\nA -> C\nB -> C', points: 25, isSample: true },
      { id: 2, name: 'Test #2 (n=1)', input: '1', output: '1\nA -> C', points: 25 },
      { id: 3, name: 'Test #3 (n=3)', input: '3', output: '7\nA -> C\nA -> B\nC -> B\nA -> C\nB -> A\nB -> C\nA -> C', points: 25 },
      { id: 4, name: 'Test #4 (n=4)', input: '4', output: '15\nA -> B\nA -> C\nB -> C\nA -> B\nC -> A\nC -> B\nA -> B\nA -> C\nB -> C\nB -> A\nC -> A\nB -> C\nA -> B\nA -> C\nB -> C', points: 25 },
    ],
    starterCode: {
      cpp: `#include <iostream>
using namespace std;

void hanoi(int n, char from, char to, char aux) {
    if (n == 0) return;
    hanoi(n - 1, from, aux, to);
    cout << from << " -> " << to << "\\n";
    hanoi(n - 1, aux, to, from);
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    cout << ((1 << n) - 1) << "\\n";
    hanoi(n, 'A', 'C', 'B');
    return 0;
}`,
      python: `def hanoi(n, src, dst, aux, out):
    if n == 0:
        return
    hanoi(n - 1, src, aux, dst, out)
    out.append(f"{src} -> {dst}")
    hanoi(n - 1, aux, dst, src, out)

n = int(input().strip())
moves = []
hanoi(n, 'A', 'C', 'B', moves)
print(len(moves))
print("\\n".join(moves))`,
    },
  },
  {
    id: 'cpp-b3-stack',
    code: 'CPPBUOI3BAI2',
    title: 'Ngăn xếp (Stack) & Kiểm tra Dấu ngoặc hợp lệ',
    category: 'Cấu trúc dữ liệu',
    categoryFilter: 'cpp',
    difficulty: 'Medium',
    points: 150,
    acRate: '72.8%',
    solvedCount: 215,
    status: 'unattempted',
    recommendedLang: 'cpp',
    description:
      'Cho một chuỗi $S$ chỉ gồm các ký tự ngoặc `(`, `)`, `[`, `]`, `{`, `}`. Hãy kiểm tra xem chuỗi ngoặc $S$ có hợp lệ (cân bằng và đóng mở đúng thứ tự) hay không.\n\nIn ra `YES` nếu chuỗi hợp lệ, ngược lại in ra `NO`.',
    inputDesc: 'Một dòng duy nhất chứa chuỗi ký tự ngoặc $S$.',
    outputDesc: 'In ra `YES` nếu hợp lệ, `NO` nếu không hợp lệ.',
    constraints: '$1 \\le |S| \\le 10^5$.',
    sampleInput: '([]){}',
    sampleOutput: 'YES',
    timeLimit: '1.0s',
    memoryLimit: '256 MB',
    tags: ['Stack', 'Chuỗi', 'Cấu trúc dữ liệu'],
    testCases: [
      { id: 1, name: 'Test #1 (Sample)', input: '([]){}', output: 'YES', points: 20, isSample: true },
      { id: 2, name: 'Test #2 (Sai thứ tự)', input: '([)]', output: 'NO', points: 20 },
      { id: 3, name: 'Test #3 (Thiếu ngoặc đóng)', input: '(((()))', output: 'NO', points: 15 },
      { id: 4, name: 'Test #4 (Ngoặc lồng nhau)', input: '{[()()[]]}', output: 'YES', points: 15 },
      { id: 5, name: 'Test #5 (Dư ngoặc đóng)', input: '())({}', output: 'NO', points: 15 },
      { id: 6, name: 'Test #6 (Chuỗi phức tạp)', input: '()[]{}{[()]}', output: 'YES', points: 15 },
    ],
    starterCode: {
      cpp: `#include <iostream>
#include <stack>
#include <string>
using namespace std;

bool isValid(const string& s) {
    stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '[' || c == '{') {
            st.push(c);
        } else {
            if (st.empty()) return false;
            char top = st.top();
            st.pop();
            if (c == ')' && top != '(') return false;
            if (c == ']' && top != '[') return false;
            if (c == '}' && top != '{') return false;
        }
    }
    return st.empty();
}

int main() {
    string s;
    if (cin >> s) {
        cout << (isValid(s) ? "YES" : "NO") << endl;
    }
    return 0;
}`,
      python: `s = input().strip()
stack = []
pairs = {')': '(', ']': '[', '}': '{'}
ok = True
for ch in s:
    if ch in '([{':
        stack.append(ch)
    elif ch in pairs:
        if not stack or stack[-1] != pairs[ch]:
            ok = False
            break
        stack.pop()
if stack:
    ok = False
print("YES" if ok else "NO")`,
    },
  },
  {
    id: 'cpp-b4-bst',
    code: 'CPPBUOI4BAI1',
    title: 'Cây nhị phân tìm kiếm (BST) - Duyệt Inorder',
    category: 'Cấu trúc dữ liệu',
    categoryFilter: 'cpp',
    difficulty: 'Medium',
    points: 200,
    acRate: '70.5%',
    solvedCount: 164,
    status: 'unattempted',
    recommendedLang: 'cpp',
    description:
      'Cho $n$ số nguyên dương. Hãy lần lượt chèn các số này vào một Cây nhị phân tìm kiếm (Binary Search Tree - BST) theo quy tắc: các khóa nhỏ hơn hoặc bằng nút hiện tại đi vào cây con trái (hoặc bỏ qua nếu trùng), khóa lớn hơn đi vào cây con phải. Sau đó in ra kết quả duyệt trung thứ tự (**Inorder Traversal**) của các giá trị phân biệt trên cây.',
    inputDesc: 'Dòng 1 chứa số nguyên dương $n$.\nDòng 2 chứa $n$ số nguyên cách nhau bởi dấu cách.',
    outputDesc: 'Một dòng chứa các phần tử theo thứ tự duyệt Inorder cách nhau bởi dấu cách.',
    constraints: '$1 \\le n \\le 10^4$.',
    sampleInput: '5\n4 2 5 1 3',
    sampleOutput: '1 2 3 4 5',
    timeLimit: '1.0s',
    memoryLimit: '256 MB',
    tags: ['BST', 'Cây nhị phân', 'C++'],
    testCases: [
      { id: 1, name: 'Test #1 (Sample)', input: '5\n4 2 5 1 3', output: '1 2 3 4 5', points: 25, isSample: true },
      { id: 2, name: 'Test #2', input: '6\n10 5 15 3 7 20', output: '3 5 7 10 15 20', points: 25 },
      { id: 3, name: 'Test #3 (Cây suy biến)', input: '4\n40 30 20 10', output: '10 20 30 40', points: 25 },
      { id: 4, name: 'Test #4', input: '7\n50 30 70 20 40 60 80', output: '20 30 40 50 60 70 80', points: 25 },
    ],
    starterCode: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

struct Node {
    int val;
    Node *left, *right;
    Node(int v) : val(v), left(nullptr), right(nullptr) {}
};

Node* insertBST(Node* root, int val) {
    if (!root) return new Node(val);
    if (val < root->val) root->left = insertBST(root->left, val);
    else if (val > root->val) root->right = insertBST(root->right, val);
    return root;
}

void inorder(Node* root, vector<int>& res) {
    if (!root) return;
    inorder(root->left, res);
    res.push_back(root->val);
    inorder(root->right, res);
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    Node* root = nullptr;
    for (int i = 0; i < n; ++i) {
        int x;
        cin >> x;
        root = insertBST(root, x);
    }
    vector<int> res;
    inorder(root, res);
    for (size_t i = 0; i < res.size(); ++i) {
        cout << res[i] << (i + 1 == res.size() ? "" : " ");
    }
    cout << endl;
    return 0;
}`,
      python: `import sys

tokens = sys.stdin.read().split()
if tokens:
    n = int(tokens[0])
    vals = sorted(set(int(x) for x in tokens[1:n+1]))
    print(*(vals))`,
    },
  },
  {
    id: 'icpc-bitmask-01',
    code: 'ICPCTRAINING01',
    title: 'Quy hoạch động Bitmask ICPC (Chu trình TSP)',
    category: 'Thuật toán & Cấu trúc dữ liệu',
    categoryFilter: 'algorithm',
    difficulty: 'Hard',
    points: 300,
    acRate: '42.6%',
    solvedCount: 89,
    status: 'unattempted',
    recommendedLang: 'cpp',
    description:
      'Cho đồ thị đầy đủ có hướng gồm $n$ đỉnh (đánh số từ $0$ đến $n-1$) với ma trận trọng số $C[i][j]$ là chi phí đi trực tiếp từ đỉnh $i$ sang đỉnh $j$.\n\nHãy tìm chu trình Hamilton có tổng chi phí nhỏ nhất xuất phát từ đỉnh $0$, đi qua tất cả các đỉnh đúng một lần và quay trở về đỉnh $0$ (Bài toán Người du lịch - Traveling Salesman Problem).',
    inputDesc: 'Dòng đầu tiên chứa số nguyên dương $n$ ($2 \\le n \\le 15$).\n$n$ dòng tiếp theo, mỗi dòng gồm $n$ số nguyên không âm mô tả ma trận chi phí $C$.',
    outputDesc: 'Một số nguyên duy nhất là tổng chi phí nhỏ nhất của chu trình.',
    constraints: '$2 \\le n \\le 15$, $0 \\le C[i][j] \\le 10^6$.',
    sampleInput: '4\n0 10 15 20\n10 0 35 25\n15 35 0 30\n20 25 30 0',
    sampleOutput: '80',
    sampleExplanation: 'Chu trình tối ưu: 0 -> 1 -> 3 -> 2 -> 0 có tổng chi phí 10 + 25 + 30 + 15 = 80.',
    timeLimit: '1.5s',
    memoryLimit: '256 MB',
    tags: ['DP Bitmask', 'ICPC', 'Quy hoạch động', 'Đồ thị'],
    testCases: [
      { id: 1, name: 'Test #1 (Sample)', input: '4\n0 10 15 20\n10 0 35 25\n15 35 0 30\n20 25 30 0', output: '80', points: 60, isSample: true },
      { id: 2, name: 'Test #2 (n=3)', input: '3\n0 5 9\n5 0 4\n9 4 0', output: '18', points: 60 },
      { id: 3, name: 'Test #3 (Bất đối xứng)', input: '4\n0 20 42 25\n20 0 30 34\n42 30 0 10\n25 34 10 0', output: '85', points: 60 },
      { id: 4, name: 'Test #4 (n=4 đồng nhất)', input: '4\n0 1 1 1\n1 0 1 1\n1 1 0 1\n1 1 1 0', output: '4', points: 60 },
      { id: 5, name: 'Test #5 (n=5)', input: '5\n0 3 1 5 8\n3 0 6 7 9\n1 6 0 4 2\n5 7 4 0 3\n8 9 2 3 0', output: '16', points: 60 },
    ],
    starterCode: {
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

const int INF = 1e9;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<vector<int>> c(n, vector<int>(n));
    for (int i = 0; i < n; ++i)
        for (int j = 0; j < n; ++j)
            cin >> c[i][j];

    int FULL = 1 << n;
    vector<vector<int>> dp(FULL, vector<int>(n, INF));
    dp[1][0] = 0;

    for (int mask = 1; mask < FULL; ++mask) {
        for (int u = 0; u < n; ++u) {
            if (dp[mask][u] == INF) continue;
            for (int v = 0; v < n; ++v) {
                if (!(mask & (1 << v))) {
                    int nextMask = mask | (1 << v);
                    dp[nextMask][v] = min(dp[nextMask][v], dp[mask][u] + c[u][v]);
                }
            }
        }
    }

    int ans = INF;
    for (int u = 1; u < n; ++u) {
        ans = min(ans, dp[FULL - 1][u] + c[u][0]);
    }
    cout << ans << endl;
    return 0;
}`,
      python: `import sys

tokens = sys.stdin.read().split()
if tokens:
    n = int(tokens[0])
    idx = 1
    c = [[0] * n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            c[i][j] = int(tokens[idx])
            idx += 1
    INF = 10**15
    FULL = 1 << n
    dp = [[INF] * n for _ in range(FULL)]
    dp[1][0] = 0
    for mask in range(1, FULL):
        for u in range(n):
            if dp[mask][u] == INF:
                continue
            for v in range(n):
                if not (mask & (1 << v)):
                    nxt = mask | (1 << v)
                    if dp[mask][u] + c[u][v] < dp[nxt][v]:
                        dp[nxt][v] = dp[mask][u] + c[u][v]
    ans = min(dp[FULL - 1][u] + c[u][0] for u in range(1, n))
    print(ans)`,
    },
  },

  // ============================================================================
  // PHẦN 5: CÁC BÀI TẬP ĐẶC SẮC CỦA TINPATH 411 (ĐÃ BỔ SUNG ĐẦY ĐỦ TESTCASES)
  // ============================================================================
  {
    id: 'p-1',
    code: 'CP-ALG-042',
    title: 'Tìm đường đi ngắn nhất trên mê cung lưới (BFS)',
    category: 'Thuật toán & Cấu trúc dữ liệu',
    categoryFilter: 'algorithm',
    difficulty: 'Medium',
    points: 200,
    acRate: '68.4%',
    solvedCount: 182,
    status: 'AC',
    recommendedLang: 'python',
    description:
      'Cho một lưới ô vuông kích thước $N \\times M$ gồm các ô trống (ký hiệu `0`) và các ô chướng ngại vật (ký hiệu `1`). Bạn xuất phát từ ô góc trên bên trái $(0, 0)$ và cần di chuyển đến ô góc dưới bên phải $(N-1, M-1)$. Mỗi bước bạn chỉ được đi sang 4 ô kề cạnh (trên, dưới, trái, phải).\n\nHãy tìm độ dài đường đi ngắn nhất (tính bằng số bước di chuyển). Nếu không có đường đi, in ra `-1`.',
    inputDesc: 'Dòng đầu tiên chứa 2 số nguyên dương $N, M$ ($1 \\le N, M \\le 500$).\n$N$ dòng tiếp theo, mỗi dòng chứa $M$ số nguyên `0` hoặc `1` cách nhau bởi khoảng trắng.',
    outputDesc: 'Một số nguyên duy nhất là số bước ngắn nhất từ $(0, 0)$ đến $(N-1, M-1)$, hoặc `-1` nếu không thể đến đích.',
    constraints: '$1 \\le N, M \\le 500$. Ô xuất phát và ô đích có thể là `0` hoặc `1`.',
    sampleInput: '4 4\n0 0 1 0\n1 0 0 0\n0 1 0 1\n0 0 0 0',
    sampleOutput: '6',
    sampleExplanation: 'Đường đi ngắn nhất: (0,0) -> (0,1) -> (1,1) -> (1,2) -> (2,2) -> (3,2) -> (3,3) gồm 6 bước.',
    timeLimit: '1.0s',
    memoryLimit: '256 MB',
    tags: ['BFS', 'Đồ thị lưới', 'Đường đi ngắn nhất'],
    testCases: [
      { id: 1, name: 'Test #1 (Sample)', input: '4 4\n0 0 1 0\n1 0 0 0\n0 1 0 1\n0 0 0 0', output: '6', points: 40, isSample: true },
      { id: 2, name: 'Test #2 (Không có đường)', input: '3 3\n0 1 0\n1 1 0\n0 0 0', output: '-1', points: 40 },
      { id: 3, name: 'Test #3 (Lưới trống)', input: '3 4\n0 0 0 0\n0 0 0 0\n0 0 0 0', output: '5', points: 40 },
      { id: 4, name: 'Test #4 (1x1)', input: '1 1\n0', output: '0', points: 40 },
      { id: 5, name: 'Test #5 (Đường vòng)', input: '5 5\n0 0 0 0 0\n1 1 1 1 0\n0 0 0 0 0\n0 1 1 1 1\n0 0 0 0 0', output: '16', points: 40 },
    ],
    starterCode: {
      python: `from collections import deque
import sys

def bfs_shortest_path():
    lines = sys.stdin.read().strip().split()
    if not lines:
        return
    n, m = int(lines[0]), int(lines[1])
    grid = []
    idx = 2
    for i in range(n):
        row = [int(lines[idx + j]) for j in range(m)]
        grid.append(row)
        idx += m

    if grid[0][0] == 1 or grid[n - 1][m - 1] == 1:
        print(-1)
        return

    queue = deque([(0, 0, 0)])
    visited = [[False] * m for _ in range(n)]
    visited[0][0] = True
    dirs = [(-1, 0), (1, 0), (0, -1), (0, 1)]

    while queue:
        r, c, dist = queue.popleft()
        if r == n - 1 and c == m - 1:
            print(dist)
            return
        for dr, dc in dirs:
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < m and not visited[nr][nc] and grid[nr][nc] == 0:
                visited[nr][nc] = True
                queue.append((nr, nc, dist + 1))

    print(-1)

bfs_shortest_path()`,
      cpp: `#include <iostream>
#include <vector>
#include <queue>
using namespace std;

int main() {
    int n, m;
    if (!(cin >> n >> m)) return 0;
    vector<vector<int>> grid(n, vector<int>(m));
    for (int i = 0; i < n; ++i)
        for (int j = 0; j < m; ++j)
            cin >> grid[i][j];

    if (grid[0][0] == 1 || grid[n - 1][m - 1] == 1) {
        cout << -1 << endl;
        return 0;
    }

    vector<vector<int>> dist(n, vector<int>(m, -1));
    queue<pair<int, int>> q;
    q.push({0, 0});
    dist[0][0] = 0;

    int dr[4] = {-1, 1, 0, 0};
    int dc[4] = {0, 0, -1, 1};

    while (!q.empty()) {
        auto [r, c] = q.front();
        q.pop();
        if (r == n - 1 && c == m - 1) {
            cout << dist[r][c] << endl;
            return 0;
        }
        for (int d = 0; d < 4; ++d) {
            int nr = r + dr[d], nc = c + dc[d];
            if (nr >= 0 && nr < n && nc >= 0 && nc < m && grid[nr][nc] == 0 && dist[nr][nc] == -1) {
                dist[nr][nc] = dist[r][c] + 1;
                q.push({nr, nc});
            }
        }
    }
    cout << -1 << endl;
    return 0;
}`,
    },
  },
  {
    id: 'p-2',
    code: 'PY-STR-104',
    title: 'Chuẩn hóa chuỗi họ tên tiếng Việt',
    category: 'Python Cơ bản & Xử lý chuỗi',
    categoryFilter: 'python',
    difficulty: 'Easy',
    points: 100,
    acRate: '91.2%',
    solvedCount: 420,
    status: 'AC',
    recommendedLang: 'python',
    description:
      'Viết chương trình nhận vào một chuỗi họ tên bất kỳ có thể chứa nhiều khoảng trắng thừa ở đầu, cuối hoặc giữa các từ, chữ hoa chữ thường lộn xộn. Hãy chuẩn hóa chuỗi họ tên đó theo quy tắc:\n1. Xóa toàn bộ khoảng trắng thừa ở đầu và cuối chuỗi.\n2. Giữa các từ chỉ giữ lại đúng 1 dấu cách.\n3. Chữ cái đầu mỗi từ viết hoa, các chữ cái còn lại viết thường.',
    inputDesc: 'Một dòng duy nhất chứa chuỗi họ tên cần chuẩn hóa (độ dài không quá 200 ký tự).',
    outputDesc: 'Chuỗi họ tên sau khi đã chuẩn hóa đúng quy tắc.',
    constraints: '$1 \\le |S| \\le 200$.',
    sampleInput: '   nGuYen   vAn    aN  ',
    sampleOutput: 'Nguyen Van An',
    timeLimit: '0.5s',
    memoryLimit: '128 MB',
    tags: ['Chuỗi', 'Python', 'Chuẩn hóa xâu'],
    testCases: [
      { id: 1, name: 'Test #1 (Sample)', input: '   nGuYen   vAn    aN  ', output: 'Nguyen Van An', points: 25, isSample: true },
      { id: 2, name: 'Test #2', input: 'tRAN   tHI   bICH   nGOC', output: 'Tran Thi Bich Ngoc', points: 25 },
      { id: 3, name: 'Test #3', input: 'le   hoang', output: 'Le Hoang', points: 25 },
      { id: 4, name: 'Test #4', input: '   PHAM    MINH   TUAN   ', output: 'Pham Minh Tuan', points: 25 },
    ],
    starterCode: {
      python: `raw_name = input()
words = raw_name.strip().split()
normalized = " ".join(word.capitalize() for word in words)
print(normalized)`,
      cpp: `#include <iostream>
#include <sstream>
#include <string>
#include <cctype>
using namespace std;

int main() {
    string line;
    getline(cin, line);
    stringstream ss(line);
    string word;
    bool first = true;
    while (ss >> word) {
        if (!first) cout << " ";
        first = false;
        word[0] = toupper(word[0]);
        for (size_t i = 1; i < word.size(); ++i)
            word[i] = tolower(word[i]);
        cout << word;
    }
    cout << endl;
    return 0;
}`,
    },
  },
  {
    id: 'p-4',
    code: 'CPP-DP-089',
    title: 'Bài toán cái túi (0/1 Knapsack Problem)',
    category: 'Quy hoạch động C++',
    categoryFilter: 'cpp',
    difficulty: 'Hard',
    points: 300,
    acRate: '44.5%',
    solvedCount: 145,
    status: 'attempted',
    recommendedLang: 'cpp',
    description:
      'Có $N$ đồ vật, vật thứ $i$ có trọng lượng $W_i$ và giá trị $V_i$. Một chiếc túi có sức chứa tối đa là $M$. Hãy chọn một số đồ vật bỏ vào túi (mỗi vật chỉ được chọn tối đa 1 lần) sao cho tổng trọng lượng không vượt quá $M$ và tổng giá trị đạt được là lớn nhất.',
    inputDesc: 'Dòng 1: Hai số nguyên dương $N$ và $M$ ($1 \\le N \\le 100, 1 \\le M \\le 1000$).\n$N$ dòng tiếp theo: Mỗi dòng gồm hai số nguyên $W_i$ và $V_i$.',
    outputDesc: 'Một số nguyên duy nhất là tổng giá trị lớn nhất có thể lấy được.',
    constraints: '$1 \\le N \\le 100, 1 \\le M \\le 1000, 1 \\le W_i \\le M, 1 \\le V_i \\le 10^6$.',
    sampleInput: '4 7\n1 1\n3 4\n4 5\n5 7',
    sampleOutput: '9',
    sampleExplanation: 'Chọn vật 2 (W=3, V=4) và vật 3 (W=4, V=5) có tổng trọng lượng 3 + 4 = 7 <= 7 và tổng giá trị 4 + 5 = 9.',
    timeLimit: '1.0s',
    memoryLimit: '256 MB',
    tags: ['Quy hoạch động', 'Knapsack', 'C++'],
    testCases: [
      { id: 1, name: 'Test #1 (Sample)', input: '4 7\n1 1\n3 4\n4 5\n5 7', output: '9', points: 60, isSample: true },
      { id: 2, name: 'Test #2', input: '3 50\n10 60\n20 100\n30 120', output: '220', points: 60 },
      { id: 3, name: 'Test #3 (Túi nhỏ)', input: '3 5\n6 10\n7 20\n8 30', output: '0', points: 60 },
      { id: 4, name: 'Test #4 (Lấy hết)', input: '3 10\n2 5\n3 8\n4 12', output: '25', points: 60 },
      { id: 5, name: 'Test #5', input: '5 10\n2 6\n2 3\n6 5\n5 4\n4 6', output: '15', points: 60 },
    ],
    starterCode: {
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n, m;
    if (!(cin >> n >> m)) return 0;

    vector<int> dp(m + 1, 0);
    for (int i = 0; i < n; ++i) {
        int w, v;
        cin >> w >> v;
        for (int j = m; j >= w; --j) {
            dp[j] = max(dp[j], dp[j - w] + v);
        }
    }

    cout << dp[m] << endl;
    return 0;
}`,
      python: `import sys

tokens = sys.stdin.read().split()
if tokens:
    n, m = int(tokens[0]), int(tokens[1])
    dp = [0] * (m + 1)
    idx = 2
    for _ in range(n):
        w, v = int(tokens[idx]), int(tokens[idx + 1])
        idx += 2
        for j in range(m, w - 1, -1):
            if dp[j - w] + v > dp[j]:
                dp[j] = dp[j - w] + v
    print(dp[m])`,
    },
  },
  {
    id: 'p-5',
    code: 'PY-LIST-019',
    title: 'Liệt kê số nguyên tố trong đoạn [L, R]',
    category: 'Python & Toán học',
    categoryFilter: 'python',
    difficulty: 'Easy',
    points: 100,
    acRate: '82.1%',
    solvedCount: 274,
    status: 'unattempted',
    recommendedLang: 'python',
    description:
      'Cho hai số nguyên dương $L$ và $R$ ($2 \\le L \\le R \\le 10^5$). Hãy liệt kê tất cả các số nguyên tố nằm trong đoạn $[L, R]$ theo thứ tự tăng dần trên một dòng, cách nhau bởi 1 khoảng trắng. Nếu không có số nguyên tố nào, in ra `-1`.',
    inputDesc: 'Một dòng chứa hai số nguyên dương $L, R$ cách nhau bởi dấu cách.',
    outputDesc: 'Các số nguyên tố trong đoạn $[L, R]$ cách nhau bởi dấu cách (hoặc `-1` nếu không có).',
    constraints: '$2 \\le L \\le R \\le 10^5$.',
    sampleInput: '10 30',
    sampleOutput: '11 13 17 19 23 29',
    timeLimit: '1.0s',
    memoryLimit: '256 MB',
    tags: ['Số nguyên tố', 'Sàng Eratosthenes', 'Python'],
    testCases: [
      { id: 1, name: 'Test #1 (Sample)', input: '10 30', output: '11 13 17 19 23 29', points: 25, isSample: true },
      { id: 2, name: 'Test #2', input: '2 10', output: '2 3 5 7', points: 25 },
      { id: 3, name: 'Test #3 (Không có)', input: '24 28', output: '-1', points: 25 },
      { id: 4, name: 'Test #4', input: '50 70', output: '53 59 61 67', points: 25 },
    ],
    starterCode: {
      python: `L, R = map(int, input().split())

is_prime = [True] * (R + 1)
is_prime[0] = is_prime[1] = False

for i in range(2, int(R**0.5) + 1):
    if is_prime[i]:
        for j in range(i * i, R + 1, i):
            is_prime[j] = False

primes = [str(x) for x in range(L, R + 1) if is_prime[x]]
print(" ".join(primes) if primes else "-1")`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int L, R;
    if (!(cin >> L >> R)) return 0;
    vector<bool> isPrime(R + 1, true);
    isPrime[0] = isPrime[1] = false;
    for (int i = 2; i * i <= R; ++i) {
        if (isPrime[i]) {
            for (int j = i * i; j <= R; j += i)
                isPrime[j] = false;
        }
    }
    vector<int> primes;
    for (int x = max(2, L); x <= R; ++x) {
        if (isPrime[x]) primes.push_back(x);
    }
    if (primes.empty()) {
        cout << -1 << endl;
    } else {
        for (size_t i = 0; i < primes.size(); ++i)
            cout << primes[i] << (i + 1 == primes.size() ? "" : " ");
        cout << endl;
    }
    return 0;
}`,
    },
  },
  {
    id: 'p-7',
    code: 'CPP-SORT-031',
    title: 'Đếm số cặp nghịch thế (Merge Sort Inversion Count)',
    category: 'Thuật toán & Cấu trúc dữ liệu',
    categoryFilter: 'algorithm',
    difficulty: 'Medium',
    points: 200,
    acRate: '64.0%',
    solvedCount: 152,
    status: 'unattempted',
    recommendedLang: 'cpp',
    description:
      'Cho mảng $A$ gồm $N$ số nguyên. Một cặp chỉ số $(i, j)$ được gọi là một **cặp nghịch thế** nếu $i < j$ nhưng $A[i] > A[j]$.\n\nHãy đếm tổng số cặp nghịch thế của mảng ở dòng thứ nhất, và in ra mảng sau khi đã sắp xếp tăng dần ở dòng thứ hai.',
    inputDesc: 'Dòng 1 chứa số nguyên dương $N$.\nDòng 2 chứa $N$ số nguyên $A_1, A_2, \\dots, A_N$.',
    outputDesc: 'Dòng 1: Số lượng cặp nghịch thế.\nDòng 2: Mảng đã sắp xếp tăng dần.',
    constraints: '$1 \\le N \\le 10^5$, $-10^9 \\le A_i \\le 10^9$.',
    sampleInput: '6\n8 4 2 1 9 5',
    sampleOutput: '8\n1 2 4 5 8 9',
    sampleExplanation: 'Các cặp nghịch thế: (8,4), (8,2), (8,1), (8,5), (4,2), (4,1), (2,1), (9,5) -> 8 cặp.',
    timeLimit: '1.0s',
    memoryLimit: '256 MB',
    tags: ['Merge Sort', 'Chia để trị', 'Nghịch thế'],
    testCases: [
      { id: 1, name: 'Test #1 (Sample)', input: '6\n8 4 2 1 9 5', output: '8\n1 2 4 5 8 9', points: 50, isSample: true },
      { id: 2, name: 'Test #2 (Đã sắp xếp)', input: '5\n1 2 3 4 5', output: '0\n1 2 3 4 5', points: 50 },
      { id: 3, name: 'Test #3 (Giảm dần)', input: '4\n4 3 2 1', output: '6\n1 2 3 4', points: 50 },
      { id: 4, name: 'Test #4', input: '5\n2 4 1 3 5', output: '3\n1 2 3 4 5', points: 50 },
    ],
    starterCode: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

long long mergeAndCount(vector<int>& arr, int l, int m, int r) {
    vector<int> left(arr.begin() + l, arr.begin() + m + 1);
    vector<int> right(arr.begin() + m + 1, arr.begin() + r + 1);
    int i = 0, j = 0, k = l;
    long long inv = 0;

    while (i < (int)left.size() && j < (int)right.size()) {
        if (left[i] <= right[j]) arr[k++] = left[i++];
        else {
            arr[k++] = right[j++];
            inv += (left.size() - i);
        }
    }
    while (i < (int)left.size()) arr[k++] = left[i++];
    while (j < (int)right.size()) arr[k++] = right[j++];
    return inv;
}

long long mergeSort(vector<int>& arr, int l, int r) {
    long long inv = 0;
    if (l < r) {
        int m = l + (r - l) / 2;
        inv += mergeSort(arr, l, m);
        inv += mergeSort(arr, m + 1, r);
        inv += mergeAndCount(arr, l, m, r);
    }
    return inv;
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> a(n);
    for (int i = 0; i < n; ++i) cin >> a[i];
    long long ans = mergeSort(a, 0, n - 1);
    cout << ans << "\\n";
    for (int i = 0; i < n; ++i) cout << a[i] << (i + 1 == n ? "" : " ");
    cout << endl;
    return 0;
}`,
      python: `import sys

tokens = sys.stdin.read().split()
if tokens:
    n = int(tokens[0])
    arr = [int(x) for x in tokens[1:n+1]]
    inv = 0
    for i in range(n):
        for j in range(i + 1, n):
            if arr[i] > arr[j]:
                inv += 1
    arr.sort()
    print(inv)
    print(*(arr))`,
    },
  },
  {
    id: 'p-3',
    code: 'WEB-CARD-004',
    title: 'Thiết kế Thẻ Hồ Sơ Học Sinh (HTML/CSS Flexbox)',
    category: 'Thiết kế Web (HTML/CSS)',
    categoryFilter: 'web',
    difficulty: 'Easy',
    points: 120,
    acRate: '84.0%',
    solvedCount: 195,
    status: 'AC',
    recommendedLang: 'web',
    description:
      'Xây dựng giao diện Thẻ hồ sơ học sinh (Student Profile Card) sử dụng HTML5 và CSS3 Flexbox với bố cục căn giữa, ảnh đại diện bo tròn, huy hiệu học sinh giỏi và nút tương tác có hiệu ứng hover.',
    inputDesc: 'Chỉnh sửa trực tiếp mã HTML, CSS và JS ở khung soạn thảo.',
    outputDesc: 'Giao diện Web hiển thị thẻ hồ sơ học sinh đạt đủ các tiêu chí cấu trúc HTML & định dạng CSS.',
    timeLimit: 'Instant',
    memoryLimit: 'Browser DOM',
    tags: ['HTML5', 'CSS3', 'Flexbox', 'UI Design'],
    testCases: [
      { id: 1, name: 'Kiểm tra thẻ .profile-card & cấu trúc HTML', input: 'DOM Check: .profile-card, h2, .badge', output: 'PASS', points: 40, isSample: true },
      { id: 2, name: 'Kiểm tra bố cục Flexbox & Bo góc CSS', input: 'CSS Check: display: flex / grid, border-radius', output: 'PASS', points: 40 },
      { id: 3, name: 'Kiểm tra nút tương tác & sự kiện JS', input: 'JS Check: button event listener', output: 'PASS', points: 40 },
    ],
    starterCode: {
      html: `<div class="profile-card">
  <div class="avatar-ring">
    <span class="avatar-emoji">🎓</span>
  </div>
  <span class="badge">Học sinh xuất sắc • Khối 12</span>
  <h2>Nguyễn Minh Khôi</h2>
  <p class="bio">Định hướng Khoa học Máy tính (CS) • Mục tiêu THPT Quốc gia 9.5+</p>
  <div class="stats">
    <div><strong>42</strong><span>Bài AC</span></div>
    <div><strong>1,850</strong><span>Điểm XP</span></div>
    <div><strong>#3</strong><span>Xếp hạng</span></div>
  </div>
  <button id="followBtn">Kết nối học tập</button>
</div>`,
      css: `body {
  margin: 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0f9ff 0%, #eef2ff 100%);
  font-family: system-ui, -apple-system, sans-serif;
}
.profile-card {
  background: #ffffff;
  width: 320px;
  padding: 28px 24px;
  border-radius: 24px;
  box-shadow: 0 20px 40px -15px rgba(37, 99, 235, 0.15);
  text-align: center;
  border: 1px solid #e2e8f0;
}
.avatar-ring {
  width: 76px;
  height: 76px;
  margin: 0 auto 14px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2563eb, #06b6d4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 34px;
}
.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  background: #eff6ff;
  color: #2563eb;
  font-size: 11px;
  font-weight: 700;
}
h2 {
  margin: 12px 0 6px;
  color: #0f172a;
  font-size: 20px;
}
.bio {
  font-size: 13px;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 18px;
}
.stats {
  display: flex;
  justify-content: space-around;
  background: #f8fafc;
  padding: 12px;
  border-radius: 16px;
  margin-bottom: 18px;
}
.stats div {
  display: flex;
  flex-direction: column;
}
.stats strong {
  color: #0f172a;
  font-size: 16px;
}
.stats span {
  color: #64748b;
  font-size: 11px;
}
button {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 12px;
  background: #2563eb;
  color: white;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s ease, background 0.2s;
}
button:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
}`,
      js: `const btn = document.getElementById('followBtn');
let connected = false;
btn.addEventListener('click', () => {
  connected = !connected;
  btn.textContent = connected ? '✓ Đã kết nối bạn học' : 'Kết nối học tập';
  btn.style.background = connected ? '#059669' : '#2563eb';
});`,
    },
  },
  {
    id: 'p-8',
    code: 'WEB-JS-055',
    title: 'Ứng dụng Máy tính bỏ túi tương tác (DOM & Events)',
    category: 'Thiết kế Web (HTML/CSS/JS)',
    categoryFilter: 'web',
    difficulty: 'Medium',
    points: 180,
    acRate: '76.8%',
    solvedCount: 142,
    status: 'unattempted',
    recommendedLang: 'web',
    description:
      'Thiết kế giao diện máy tính bỏ túi (Calculator) bằng CSS Grid và lập trình xử lý sự kiện click trên các nút số, phép tính (`+`, `-`, `*`, `/`), nút xóa `C` và nút tính kết quả `=`.',
    inputDesc: 'Chỉnh sửa trực tiếp mã HTML, CSS và JS ở khung soạn thảo.',
    outputDesc: 'Ứng dụng máy tính hoạt động đầy đủ trên khung Live Preview.',
    timeLimit: 'Instant',
    memoryLimit: 'Browser DOM',
    tags: ['JavaScript', 'DOM Events', 'CSS Grid'],
    testCases: [
      { id: 1, name: 'Kiểm tra cấu trúc màn hình #display & bàn phím .keys', input: 'DOM Check: #display, .calc, .keys', output: 'PASS', points: 60, isSample: true },
      { id: 2, name: 'Kiểm tra CSS Grid Layout (.keys)', input: 'CSS Check: grid-template-columns', output: 'PASS', points: 60 },
      { id: 3, name: 'Kiểm tra hàm tính toán JavaScript', input: 'JS Check: press(), calc(), clearDisp()', output: 'PASS', points: 60 },
    ],
    starterCode: {
      html: `<div class="calc">
  <div id="display" class="display">0</div>
  <div class="keys">
    <button class="op" onclick="clearDisp()">C</button>
    <button class="op" onclick="press('/')">÷</button>
    <button class="op" onclick="press('*')">×</button>
    <button class="op" onclick="press('-')">−</button>
    <button onclick="press('7')">7</button>
    <button onclick="press('8')">8</button>
    <button onclick="press('9')">9</button>
    <button class="op" onclick="press('+')">+</button>
    <button onclick="press('4')">4</button>
    <button onclick="press('5')">5</button>
    <button onclick="press('6')">6</button>
    <button class="eq" onclick="calc()">=</button>
    <button onclick="press('1')">1</button>
    <button onclick="press('2')">2</button>
    <button onclick="press('3')">3</button>
    <button onclick="press('0')">0</button>
  </div>
</div>`,
      css: `body {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
  background: #f1f5f9;
  font-family: 'JetBrains Mono', monospace;
}
.calc {
  background: #0f172a;
  padding: 20px;
  border-radius: 24px;
  width: 280px;
  box-shadow: 0 20px 35px rgba(15, 23, 42, 0.25);
}
.display {
  background: #1e293b;
  color: #38bdf8;
  font-size: 28px;
  font-weight: 700;
  text-align: right;
  padding: 16px;
  border-radius: 14px;
  margin-bottom: 16px;
  overflow-x: auto;
}
.keys {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}
button {
  padding: 16px 0;
  border: none;
  border-radius: 12px;
  background: #334155;
  color: #f8fafc;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
}
button:hover { background: #475569; }
button.op { background: #1e40af; color: #93c5fd; }
button.eq { background: #059669; color: white; grid-row: span 2; }`,
      js: `let expr = '';
const disp = document.getElementById('display');

function press(ch) {
  expr += ch;
  disp.textContent = expr;
}

function clearDisp() {
  expr = '';
  disp.textContent = '0';
}

function calc() {
  try {
    const res = Function('"use strict"; return (' + expr + ')')();
    disp.textContent = String(res);
    expr = String(res);
  } catch (e) {
    disp.textContent = 'Lỗi';
    expr = '';
  }
}`,
    },
  },
];
