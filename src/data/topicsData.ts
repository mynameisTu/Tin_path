import { SubjectTopicId } from '../types';

export interface LessonOutlineItem {
  id: string;
  title: string;
  level: 1 | 2;
}

export interface PracticeQuizQuestion {
  id: string;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export interface TopicLesson {
  id: SubjectTopicId;
  code: string;
  title: string;
  grade: '10' | '11' | '12';
  track?: 'ALL' | 'CS' | 'ICT';
  examWeight: string;
  iconName: string;
  summary: string;

  // New detailed curriculum sections matching user layout
  outline: LessonOutlineItem[];
  objectives: string[];
  standards: { level: string; desc: string }[];
  warmUp: { context: string; question: string };
  mainSections: {
    id: string;
    number: string;
    title: string;
    content: string;
    imageUrl?: string;
    imageCaption?: string;
    images?: { url: string; caption?: string; alt?: string }[];
    subSections?: {
      id: string;
      letter: string;
      title: string;
      content: string;
      example?: string;
      codeSnippet?: string;
      imageUrl?: string;
      imageCaption?: string;
      images?: { url: string; caption?: string; alt?: string }[];
    }[];
    table?: { headers: string[]; rows: string[][] };
    codeSnippet?: string;
  }[];
  memoryNotes: string[];
  practiceQuestions: PracticeQuizQuestion[];
  application: {
    realLife: string;
    examTraps: string[];
    tips: string[];
  };

  // Backwards compatibility fields
  requirements: string[];
  keyConcepts: {
    term: string;
    definition: string;
    example?: string;
  }[];
  theorySections: {
    title: string;
    content: string;
    subPoints?: string[];
    codeSnippet?: string;
  }[];
  practicalTips: string[];
  commonPitfalls: string[];
}

export const TOPIC_LESSONS: Record<SubjectTopicId, TopicLesson> = {
  "12A": {
    "id": "12A",
    "code": "Chủ đề 12A",
    "title": "Giới thiệu Trí tuệ Nhân tạo (AI)",
    "grade": "12",
    "track": "ALL",
    "examWeight": "Trọng tâm Lớp 12 (~15% lệnh hỏi)",
    "iconName": "sparkles",
    "summary": "Tìm hiểu lịch sử ra đời, 5 đặc trưng cơ bản (Học, Suy luận, Nhận thức, Hiểu ngôn ngữ, Giải quyết vấn đề), phân loại AI hẹp (ANI) và AI rộng (AGI), bài kiểm tra Turing, các lĩnh vực nghiên cứu, ứng dụng trong đời sống và cảnh báo về đạo đức, an ninh mạng.",
    "outline": [
      {
        "id": "muc-tieu",
        "title": "Mục tiêu bài học",
        "level": 1
      },
      {
        "id": "muc-do",
        "title": "Mức độ kiến thức và kĩ năng cần đạt",
        "level": 1
      },
      {
        "id": "khoi-dong",
        "title": "Hoạt động khởi động",
        "level": 1
      },
      {
        "id": "sec-1",
        "title": "1. Giới thiệu về trí tuệ nhân tạo (AI - Artificial Intelligence)",
        "level": 1
      },
      {
        "id": "sec-1-1",
        "title": "a) Khái niệm trí tuệ nhân tạo và lịch sử hình thành",
        "level": 2
      },
      {
        "id": "sec-1-2",
        "title": "b) Các đặc trưng của trí tuệ nhân tạo",
        "level": 2
      },
      {
        "id": "sec-1-3",
        "title": "c) Phân loại AI: AI hẹp (ANI) và AI rộng (AGI)",
        "level": 2
      },
      {
        "id": "sec-1-4",
        "title": "d) Một số lĩnh vực nghiên cứu phát triển AI trọng tâm",
        "level": 2
      },
      {
        "id": "sec-2",
        "title": "2. Trí tuệ nhân tạo trong khoa học và đời sống",
        "level": 1
      },
      {
        "id": "sec-2-1",
        "title": "a) Một số lĩnh vực phát triển nhờ ứng dụng của AI",
        "level": 2
      },
      {
        "id": "sec-2-2",
        "title": "b) Ảnh hưởng của AI đến con người và cảnh báo xã hội",
        "level": 2
      },
      {
        "id": "ghi-nho",
        "title": "Ghi nhớ",
        "level": 1
      },
      {
        "id": "luyen-tap",
        "title": "Luyện tập (Trắc nghiệm chuẩn sách)",
        "level": 1
      },
      {
        "id": "van-dung",
        "title": "Vận dụng",
        "level": 1
      }
    ],
    "objectives": [
      "Giải thích được sơ lược về khái niệm Trí tuệ nhân tạo (AI - Artificial Intelligence) và mốc lịch sử hình thành (1955 - 1956).",
      "Nêu được ví dụ minh hoạ cho một số ứng dụng điển hình của AI: điều khiển tự động, chẩn đoán bệnh tật, nhận dạng chữ viết/tiếng nói/khuôn mặt, trợ lí ảo.",
      "Chỉ ra được 5 đặc trưng nhận biết AI: Khả năng học, Khả năng suy luận, Khả năng nhận thức, Khả năng hiểu ngôn ngữ, Khả năng giải quyết vấn đề.",
      "Phân biệt được AI hẹp (ANI) và AI rộng (AGI); nắm được ý nghĩa của bài kiểm tra Turing (Turing Test).",
      "Phân tích được những cảnh báo về sự phát triển của AI trong tương lai: đạo đức, an ninh mạng (Deepfake), quyền riêng tư và việc làm."
    ],
    "standards": [
      {
        "level": "Nhận biết",
        "desc": "Nêu được khái niệm sơ lược về AI; mốc lịch sử năm 1955 do John McCarthy đề xuất và hội thảo Dartmouth 1956; chỉ ra được các ứng dụng AI thông dụng (trợ lý ảo, nhận diện khuôn mặt)."
      },
      {
        "level": "Thông hiểu",
        "desc": "Phân tích được 5 đặc trưng của AI qua ví dụ thực tế (hệ chuyên gia MYCIN suy luận luật, xe tự lái nhận thức cảm biến); giải thích sự khác biệt giữa AI hẹp (ANI) và AI rộng (AGI); hiểu cơ chế bài kiểm tra Turing."
      },
      {
        "level": "Vận dụng",
        "desc": "Đánh giá được tác động của AI trong thực tiễn (giáo dục cá nhân hoá, y tế, an ninh mạng); nhận diện hành vi lừa đảo qua Deepfake và đề xuất biện pháp bảo vệ dữ liệu cá nhân."
      }
    ],
    "warmUp": {
      "context": "Hằng ngày, khi bạn mở khoá điện thoại bằng Face ID, hỏi Siri về thời tiết hoặc dịch nhanh một đoạn văn bản bằng Google Translate, máy tính đang thực hiện những công việc mà trước đây chỉ con người mới làm được.",
      "question": "Theo em, máy tính làm thế nào để hiểu được giọng nói và nhận diện được khuôn mặt của chúng ta? Liệu máy tính có thực sự có 'suy nghĩ' và 'cảm xúc' như con người hay không?"
    },
    "mainSections": [
      {
        "id": "sec-1",
        "number": "1.",
        "title": "Giới thiệu về trí tuệ nhân tạo (AI - Artificial Intelligence)",
        "imageUrl": "/images/topics/12A/ai-history.jpg",
        "imageCaption": "Sơ đồ các mốc lịch sử phát triển quan trọng của Trí tuệ Nhân tạo (AI)",
        "content": "Năm 1955, Giáo sư John McCarthy (Đại học Dartmouth, Mỹ) lần đầu tiên đưa ra định nghĩa về ngành Trí tuệ nhân tạo là 'khoa học và kĩ thuật chế tạo máy móc thông minh'. Một năm sau, năm 1956, Hội thảo khoa học tại Đại học Dartmouth quy tụ nhiều nhà khoa học máy tính hàng đầu thế giới được xem là sự kiện lịch sử chính thức khai sinh ngành Trí tuệ nhân tạo.\nNgày nay, AI đã phát triển vượt bậc và trở thành một ngành khoa học mũi nhọn, định hình tương lai của nhân loại.",
        "subSections": [
          {
            "id": "sec-1-1",
            "letter": "a)",
            "title": "Khái niệm trí tuệ nhân tạo và bản chất",
            "imageUrl": "/images/topics/12A/ai-overview.jpg",
            "imageCaption": "Hình ảnh minh họa: Khái niệm Trí tuệ Nhân tạo và các năng lực trí tuệ mô phỏng con người",
            "content": "• Bản chất công việc trí tuệ: Là công việc thực hiện đòi hỏi trí tuệ đặc trưng của con người như khả năng suy luận, khái quát hoá, hiểu ngôn ngữ và ra quyết định.\n• Máy tính thông thường: Xử lí khối lượng dữ liệu khổng lồ cực kì nhanh và chính xác trong thời gian ngắn, nhưng không có khả năng tự suy luận hay thích ứng nếu không được lập trình cụ thể.\n• Ngành Trí tuệ nhân tạo: Ra đời nhằm nghiên cứu và phát triển trí tuệ của máy tính, làm cho máy tính có các năng lực trí tuệ tương tự như con người.\n• Định nghĩa thông dụng: Trí tuệ nhân tạo là khả năng của máy tính có thể làm những công việc mang tính trí tuệ con người, như khả năng học, khả năng suy luận, khả năng hiểu ngôn ngữ tự nhiên và khả năng giải quyết vấn đề phức tạp."
          },
          {
            "id": "sec-1-2",
            "letter": "b)",
            "title": "Các đặc trưng của trí tuệ nhân tạo",
            "imageUrl": "/images/topics/12A/mycin-system.jpg",
            "imageCaption": "Hệ chuyên gia y tế MYCIN: Minh họa cho khả năng suy luận logic dựa trên tri thức luật NẾU - THÌ",
            "content": "Theo sách Hướng dẫn ôn thi tốt nghiệp môn Tin học (Bộ GD&ĐT), trí tuệ nhân tạo được nhận biết qua các đặc trưng cốt lõi sau:\n1. Khả năng học: Khái quát hoá, trích rút ra các tri thức (mô hình, quy luật, mẫu) từ dữ liệu lớn đã có và sử dụng tri thức đó để đưa ra quyết định hợp lí. Ví dụ: phần mềm nhận dạng chữ viết tay, hệ thống dịch tự động đa ngôn ngữ, hệ thống nhận diện khuôn mặt người tham gia giao thông.\n2. Khả năng suy luận: Vận dụng các quy tắc suy luận logic và cơ sở tri thức có từ trước để rút ra kết luận mới hoặc quyết định. Ví dụ kinh điển: Phần mềm hệ chuyên gia y tế MYCIN đưa vào cơ sở tri thức các luật dạng 'NẾU có các triệu chứng A1, A2... THÌ bệnh nhân mắc bệnh B', sau đó hỗ trợ bác sĩ chẩn đoán bệnh nhiễm trùng máu chính xác.\n3. Khả năng nhận thức: Cảm nhận (thu nhận, phân tích) và hiểu biết (xử lí) về môi trường xung quanh thông qua các cảm biến (sensor) hoặc thiết bị thu nhận tín hiệu đầu vào. Ví dụ: Hệ thống xe ô tô tự lái nhận biết biển báo, người đi bộ, chướng ngại vật thông qua camera và cảm biến LiDAR gắn trên thân xe.\n4. Khả năng hiểu ngôn ngữ: Giao tiếp trực tiếp với con người bằng ngôn ngữ tự nhiên, bao gồm đọc, hiểu ý đồ và diễn giải bằng cả văn bản lẫn tiếng nói. Ví dụ: Tra cứu thông tin trên Internet thông qua tương tác với trợ lí ảo Siri, Google Assistant, Alexa.\n5. Khả năng giải quyết vấn đề: Phối hợp linh hoạt các khả năng trên để giải quyết những tình huống phức tạp hoặc tối ưu theo mục tiêu đặt ra. Ví dụ: Thuật toán tự động sắp xếp thời khoá biểu cho trường học dựa trên các ràng buộc phòng học và giáo viên."
          },
          {
            "id": "sec-1-3",
            "letter": "c)",
            "title": "Phân loại AI: AI hẹp (ANI) và AI rộng (AGI)",
            "content": "Dựa trên mức độ mô phỏng trí tuệ con người, AI được chia thành 2 cấp độ phân loại chính:\n• AI hẹp (Artificial Narrow Intelligence - ANI) hay AI yếu: Được xây dựng để giải quyết các nhiệm vụ chuyên biệt nằm trong phạm vi hẹp của một lĩnh vực cụ thể. Ví dụ: Hệ thống nhận diện biển báo giao thông hoạt động rất tốt khi phát hiện biển báo, nhưng không thể nhận dạng khuôn mặt hay dịch văn bản; phần mềm chơi cờ vua Stockfish hoặc cờ vây AlphaGo có thể đánh bại đại kiện tướng thế giới nhưng không thể lái xe hay làm thơ. Tất cả các hệ thống AI hiện nay (kể cả ChatGPT, Gemini) đều thuộc nhóm AI hẹp.\n• AI rộng (Artificial General Intelligence - AGI) hay AI mạnh: Được định hướng nhằm thực hiện các hoạt động trí tuệ tổng hợp trên nhiều lĩnh vực giống như con người. Đặc trưng nổi bật của AGI là khả năng tự học độc lập từ dữ liệu mới và hành động có ý thức không phụ thuộc hoàn toàn vào lập trình viên. Hiện nay AGI vẫn đang trong quá trình nghiên cứu lâu dài trong tương lai.\n• Bài kiểm tra Turing (Turing Test): Do nhà toán học thiên tài Alan Turing đề xuất năm 1950. Phép thử đặt ra rằng: nếu một giám khảo con người trò chuyện qua màn hình với một đối tượng (người hoặc máy) mà không thể phân biệt được mình đang nói chuyện với người hay với máy, thì cỗ máy đó được xem là đã đạt đến Trí tuệ nhân tạo."
          },
          {
            "id": "sec-1-4",
            "letter": "d)",
            "title": "Một số lĩnh vực nghiên cứu phát triển AI",
            "content": "Trí tuệ nhân tạo là một ngành khoa học liên ngành rộng lớn, gồm 4 phân ngành nghiên cứu trọng tâm:\n1. Học máy (Machine Learning): Nghiên cứu các thuật toán cho phép máy tính tự học hỏi và cải thiện hiệu suất từ dữ liệu mà không cần phải lập trình quy tắc tường minh.\n2. Thị giác máy tính (Computer Vision): Nghiên cứu các phương pháp giúp máy tính thu nhận, xử lí, phân tích và hiểu được các hình ảnh kĩ thuật số cũng như video thực tế.\n3. AI tạo sinh (Generative AI): Tạo ra các nội dung mới (văn bản, mã nguồn, hình ảnh, âm thanh, video) dựa trên các mẫu dữ liệu đã học (ví dụ: ChatGPT, Gemini, Midjourney).\n4. Xử lí ngôn ngữ tự nhiên (Natural Language Processing - NLP): Nghiên cứu khả năng giúp máy tính hiểu, dịch thuật và phát sinh ngôn ngữ con người một cách tự nhiên."
          }
        ],
        "table": {
          "headers": [
            "Tiêu chí so sánh",
            "AI Hẹp (ANI - Artificial Narrow Intelligence)",
            "AI Rộng (AGI - Artificial General Intelligence)"
          ],
          "rows": [
            [
              "Phạm vi hoạt động",
              "Chuyên biệt trong một nhiệm vụ/lĩnh vực duy nhất",
              "Đa lĩnh vực, tổng quát trên mọi khía cạnh trí tuệ"
            ],
            [
              "Khả năng tự ý thức",
              "Hoàn toàn không có ý thức, chỉ tính toán xác suất",
              "Có tư duy độc lập, có thể thích ứng như con người"
            ],
            [
              "Ví dụ thực tiễn",
              "AlphaGo, Siri, ChatGPT, nhận diện biển báo, xe tự lái",
              "Chưa tồn tại trong thực tế (mục tiêu nghiên cứu tương lai)"
            ],
            [
              "Tiêu chuẩn đánh giá",
              "Độ chính xác trên tập dữ liệu kiểm thử (Test Set)",
              "Vượt qua bài kiểm tra Turing (Turing Test)"
            ]
          ]
        }
      },
      {
        "id": "sec-2",
        "number": "2.",
        "title": "Trí tuệ nhân tạo trong khoa học và đời sống",
        "content": "AI đang cách mạng hoá mọi lĩnh vực kinh tế - xã hội, tuy nhiên sự phát triển nhanh chóng cũng kéo theo những thách thức sâu sắc về đạo đức và an ninh.",
        "subSections": [
          {
            "id": "sec-2-1",
            "letter": "a)",
            "title": "Một số lĩnh vực phát triển nhờ ứng dụng của AI",
            "images": [
              {
                "url": "/images/topics/12A/ai-applications-1.jpg",
                "caption": "Các lĩnh vực ứng dụng Trí tuệ Nhân tạo trong đời sống"
              },
              {
                "url": "/images/topics/12A/ai-applications-2.jpg",
                "caption": "Hệ sinh thái và mô hình giải pháp AI đa ngành"
              }
            ],
            "content": "• Trong giáo dục: Cá nhân hoá lộ trình học tập, tự động chấm điểm và đánh giá kết quả, phát hiện các lỗ hổng kiến thức để đề xuất ôn tập kịp thời; phần mềm giám sát thi tích hợp AI chống gian lận.\n• Trong y tế: Chẩn đoán bệnh sớm với độ chính xác cao qua ảnh X-quang, MRI; hệ thống MYCIN hỗ trợ vi trùng máu; IBM Watson hỗ trợ phác đồ điều trị ung thư; rút ngắn thời gian thử nghiệm lâm sàng dược phẩm.\n• Trong sản xuất và nông nghiệp: Tối ưu hoá quy trình tự động hoá, kiểm tra phân loại chất lượng nông sản bằng thị giác máy tính, dự báo chính xác chuỗi cung ứng hàng hoá.\n• Trong giao thông: Hệ thống điều khiển đèn giao thông thông minh chống ùn tắc; xe tự hành (Tesla, Waymo)."
          },
          {
            "id": "sec-2-2",
            "letter": "b)",
            "title": "Ảnh hưởng của AI đến con người và cảnh báo xã hội",
            "content": "1. Đạo đức và tính đúng đắn: Dữ liệu huấn luyện đúng đắn và không thiên vị là điều kiện tiên quyết để AI hoạt động chuẩn mực. Nếu dữ liệu bị thiên lệch, AI có thể đưa ra các phán đoán phân biệt chủng tộc, giới tính hoặc sai lệch lịch sử.\n2. An ninh mạng và tội phạm số: AI bị kẻ xấu lợi dụng để tạo ra công nghệ 'Deepfake' – giả mạo khuôn mặt, hình ảnh, giọng nói của người thân nạn nhân để gọi điện lừa đảo vay tiền, chiếm đoạt tài sản.\n3. Xâm phạm quyền riêng tư: Các mô hình AI thu thập khối lượng dữ liệu cá nhân (lịch sử duyệt web, vị trí, tin nhắn) có nguy cơ bị rò rỉ hoặc bán cho bên thứ ba vì mục đích vụ lợi.\n4. Tác động đến việc làm: Nhiều công việc hành chính, nhập liệu, dịch thuật và chăm sóc khách hàng đang dần bị thay thế bởi chatbot và tự động hoá, đòi hỏi người lao động phải không ngừng nâng cao kĩ năng số."
          }
        ]
      }
    ],
    "memoryNotes": [
      "Năm 1955 John McCarthy đưa ra định nghĩa AI; Hội thảo Dartmouth 1956 chính thức khai sinh ngành AI.",
      "5 đặc trưng nhận biết AI: Học, Suy luận, Nhận thức, Hiểu ngôn ngữ, Giải quyết vấn đề.",
      "Mọi hệ thống AI hiện nay (kể cả ChatGPT) đều là AI hẹp (ANI). AGI là mục tiêu nghiên cứu tương lai gắn với Bài kiểm tra Turing.",
      "Dữ liệu huấn luyện là điều kiện tiên quyết đảm bảo đạo đức AI; Deepfake là mối nguy lừa đảo công nghệ cao cần cảnh giác."
    ],
    "practiceQuestions": [
      {
            "id": "12a-q1",
            "question": "Câu 1. Mô tả nào sau đây nêu đúng quá trình nhận thức của máy tính?",
            "options": {
                  "A": "Quá trình trích rút được tri thức từ những dữ liệu do con người cung cấp.",
                  "B": "Quá trình tự động hiểu biết được môi trường xung quanh thông qua cảm biến.",
                  "C": "Quá trình thu thập thông tin từ nguồn tài nguyên mạng do con người cung cấp.",
                  "D": "Quá trình đọc, hiểu tri thức mới thông qua các quy tắc và tri thức sẵn có."
            },
            "correctAnswer": "A",
            "explanation": "Trích nguyên văn sách Hướng dẫn ôn thi tốt nghiệp môn Tin học (Bộ GD&ĐT, trang 172): 'Quá trình nhận thức có thể hiểu là trích rút các tri thức từ dữ liệu được thu thập thông qua hiểu biết về môi trường xung quanh và các nguồn tài nguyên sẵn có.'"
      },
      {
            "id": "12a-q2",
            "question": "Câu 2. Cụm từ thích hợp để mô tả sự thông minh của máy tính là:",
            "options": {
                  "A": "Trí tuệ của máy tính.",
                  "B": "Trí nhớ của máy tính.",
                  "C": "Trí óc của máy tính.",
                  "D": "Suy nghĩ của máy tính."
            },
            "correctAnswer": "A",
            "explanation": "Sự thông minh của máy tính đề cập đến 'Trí tuệ của máy tính' - tức khả năng thực hiện công việc mang tính trí tuệ như con người thông qua phần mềm và thuật toán mô phỏng."
      },
      {
            "id": "12a-q3",
            "question": "Câu 3. Phát biểu nào sau đây nêu đúng khái niệm trí tuệ nhân tạo?",
            "options": {
                  "A": "Khả năng của máy tính có thể làm những công việc mang tính trí tuệ con người.",
                  "B": "Trí tuệ của máy tính có thể làm những công việc tương đương trí tuệ con người.",
                  "C": "Tích hợp công nghệ hiện đại vào máy tính, giúp máy tính hiểu được con người.",
                  "D": "Hoạt động máy tính giao tiếp được với con người bằng ngôn ngữ tự nhiên."
            },
            "correctAnswer": "A",
            "explanation": "Trí tuệ nhân tạo (AI) là khả năng của máy tính có thể thực hiện những công việc mang tính trí tuệ của con người (như học hỏi, suy luận, hiểu ngôn ngữ và giải quyết vấn đề)."
      },
      {
            "id": "12a-q4",
            "question": "Câu 4. Thiết bị nào sau đây được tích hợp trợ lí ảo?",
            "options": {
                  "A": "Máy tính cầm tay bỏ túi.",
                  "B": "Điện thoại thông minh (smartphone).",
                  "C": "Chuông báo cháy gia đình.",
                  "D": "Máy quét mã vạch siêu thị."
            },
            "correctAnswer": "B",
            "explanation": "Điện thoại thông minh là thiết bị điển hình tích hợp các trợ lí ảo như Siri (Apple), Google Assistant (Google), Bixby (Samsung)."
      },
      {
            "id": "12a-q5",
            "question": "Câu 5. Yếu tố nào sau đây là điều kiện tiên quyết đảm bảo AI hạn chế vi phạm đạo đức?",
            "options": {
                  "A": "Môi trường triển khai hệ thống.",
                  "B": "Phạm vi kết nối mạng nội bộ.",
                  "C": "Dữ liệu huấn luyện đúng đắn và chuẩn mực.",
                  "D": "Tốc độ xử lý của vi xử lý GPU."
            },
            "correctAnswer": "C",
            "explanation": "Một hệ thống AI hoạt động đúng đắn khi dữ liệu học phù hợp với các tiêu chuẩn đạo đức và không bị định kiến (bias), vì đây chính là cơ sở tri thức để AI suy luận và ra quyết định."
      },
      {
            "id": "12a-q6",
            "question": "Câu 6. Thuật ngữ 'Deepfake' dùng để nói về hành vi nào sau đây?",
            "options": {
                  "A": "Tạo ra các hình ảnh, âm thanh, video giả mạo bằng AI.",
                  "B": "Phát hiện ra các lỗ hổng bảo mật trên hệ thống máy chủ.",
                  "C": "Tạo ra các trang web bán hàng tự động.",
                  "D": "Tối ưu hoá đường truyền cáp quang Internet."
            },
            "correctAnswer": "A",
            "explanation": "Deepfake sử dụng các mô hình học sâu (Deep Learning) để giả mạo khuôn mặt, hình ảnh và giọng nói của người khác, thường bị kẻ xấu lợi dụng để lừa đảo trực tuyến."
      },
      {
            "id": "12a-q7",
            "question": "Câu 7. Khả năng nào sau đây KHÔNG phải là một trong 5 đặc trưng cốt lõi của AI theo chương trình GDPT 2018?",
            "options": {
                  "A": "Khả năng học (Machine Learning).",
                  "B": "Khả năng nhận thức môi trường qua cảm biến.",
                  "C": "Khả năng bay lượn cơ học.",
                  "D": "Khả năng hiểu và xử lý ngôn ngữ tự nhiên."
            },
            "correctAnswer": "C",
            "explanation": "5 đặc trưng nhận biết AI theo sách giáo khoa gồm: Khả năng học, Khả năng suy luận, Khả năng nhận thức, Khả năng hiểu ngôn ngữ và Khả năng giải quyết vấn đề."
      },
      {
            "id": "12a-q8",
            "question": "Câu 8. Sự kiện lịch sử nào đánh dấu sự ra đời của thuật ngữ AI và chính thức khai sinh ngành Trí tuệ Nhân tạo?",
            "options": {
                  "A": "Hội thảo tại MIT vào năm 1960.",
                  "B": "Hội thảo tại Stanford vào năm 1955.",
                  "C": "Hội thảo khoa học Dartmouth năm 1956.",
                  "D": "Sự ra đời của hệ thống MYCIN vào năm 1970."
            },
            "correctAnswer": "C",
            "explanation": "Hội thảo khoa học tại Đại học Dartmouth năm 1956 do John McCarthy, Marvin Minsky, Claude Shannon... khởi xướng được xem là mốc lịch sử chính thức khai sinh ngành AI."
      },
      {
            "id": "12a-q9",
            "question": "Câu 9. Phát biểu nào sau đây ĐÚNG khi nói về sự khác nhau giữa Trí tuệ nhân tạo hẹp (AI hẹp - ANI) và Trí tuệ nhân tạo tổng quát (AI mạnh - AGI)?",
            "options": {
                  "A": "AI hẹp chỉ thực hiện một nhiệm vụ cụ thể trong phạm vi giới hạn.",
                  "B": "AI mạnh chỉ thực hiện được một công việc giống hệt máy tính cơ học.",
                  "C": "AI hẹp có khả năng tự học độc lập trên mọi khía cạnh tổng quát.",
                  "D": "AI hẹp hoàn toàn không có khả năng đưa ra bất kì quyết định nào."
            },
            "correctAnswer": "A",
            "explanation": "AI hẹp (ANI) được xây dựng để thực hiện xuất sắc một nhiệm vụ cụ thể (chơi cờ, nhận diện khuôn mặt, dịch văn bản). Mọi hệ thống AI hiện nay đều thuộc nhóm AI hẹp."
      },
      {
            "id": "12a-q10",
            "question": "Câu 10. Hệ chuyên gia y tế MYCIN là một thành tựu kinh điển minh hoạ cho đặc trưng nào của AI?",
            "options": {
                  "A": "Khả năng học tăng cường qua trò chơi.",
                  "B": "Khả năng suy luận logic dựa trên các luật NẾU - THÌ.",
                  "C": "Khả năng nhận thức môi trường bằng cảm biến LiDAR.",
                  "D": "Khả năng tự động điều khiển phần cứng cơ học."
            },
            "correctAnswer": "B",
            "explanation": "Hệ chuyên gia MYCIN sử dụng cơ sở tri thức gồm hàng trăm luật logic dạng IF... THEN... (NẾU có triệu chứng... THÌ mắc bệnh...) để hỗ trợ bác sĩ chẩn đoán bệnh nhiễm trùng máu."
      },
      {
            "id": "12a-q11",
            "question": "Câu 11. Tập hợp quy tắc suy diễn của hệ chuyên gia MYCIN được biểu diễn dưới dạng nào?",
            "options": {
                  "A": "IF … ELSE …",
                  "B": "FOR … THEN …",
                  "C": "WHILE … DO …",
                  "D": "IF … THEN … (NẾU … THÌ …)"
            },
            "correctAnswer": "D",
            "explanation": "Hệ chuyên gia MYCIN áp dụng mô hình tri thức luật suy diễn kinh điển dạng 'IF <điều kiện> THEN <kết luận>'."
      },
      {
            "id": "12a-q12",
            "question": "Câu 12. Thiết bị nào sau đây KHÔNG sử dụng trí tuệ nhân tạo để điều khiển tự động?",
            "options": {
                  "A": "Xe ô tô tự hành không người lái (Tesla, Waymo).",
                  "B": "Ấm đun nước siêu tốc tự ngắt khi sôi nhờ rơ-le nhiệt.",
                  "C": "Máy bay không người lái tự định vị đường bay.",
                  "D": "Robot hút bụi thông minh tự quét laser lập bản đồ phòng."
            },
            "correctAnswer": "B",
            "explanation": "Ấm điện siêu tốc hoạt động thuần tuý dựa trên nguyên lý cơ - nhiệt của rơ-le (tự động hoá cơ bản), không có khả năng học, suy luận hay xử lý thông tin thông minh của AI."
      },
      {
            "id": "12a-q13",
            "question": "Câu 13. Phần mềm IBM Watson for Oncology là ứng dụng AI hỗ trợ các bác sĩ trong việc điều trị bệnh gì?",
            "options": {
                  "A": "Bệnh ung thư.",
                  "B": "Bệnh tim mạch.",
                  "C": "Bệnh tiểu đường.",
                  "D": "Bệnh xương khớp."
            },
            "correctAnswer": "A",
            "explanation": "IBM Watson for Oncology là hệ thống AI phân tích hồ sơ bệnh án và hàng triệu tài liệu y khoa để đề xuất phác đồ điều trị hỗ trợ bác sĩ điều trị ung thư."
      },
      {
            "id": "12a-q14",
            "question": "Câu 14. Lĩnh vực nghiên cứu nào của AI tập trung vào việc giúp máy tính có khả năng nhận diện, phân tích và hiểu hình ảnh/video từ thế giới thực?",
            "options": {
                  "A": "Thị giác máy tính (Computer Vision).",
                  "B": "AI tạo sinh (Generative AI).",
                  "C": "Xử lí ngôn ngữ tự nhiên (NLP).",
                  "D": "Hệ thống quản trị cơ sở dữ liệu."
            },
            "correctAnswer": "A",
            "explanation": "Thị giác máy tính (Computer Vision) là phân ngành AI nghiên cứu các phương pháp giúp máy tính thu nhận, xử lí, phân tích và trích xuất thông tin hữu ích từ hình ảnh và video."
      },
      {
            "id": "12a-q15",
            "question": "Câu 15. ChatGPT được phát triển bởi công ty/tổ chức công nghệ nào?",
            "options": {
                  "A": "Apple.",
                  "B": "OpenAI.",
                  "C": "Microsoft.",
                  "D": "Google."
            },
            "correctAnswer": "B",
            "explanation": "ChatGPT là mô hình ngôn ngữ lớn (LLM) do OpenAI phát triển và ra mắt lần đầu vào tháng 11/2022."
      },
      {
            "id": "12a-q16",
            "question": "Câu 16. Robot hình người nổi tiếng được tích hợp hàng loạt ứng dụng AI và được cấp quyền công dân đầu tiên trên thế giới (2017) là:",
            "options": {
                  "A": "Sophia (Hanson Robotics).",
                  "B": "Asimo (Honda).",
                  "C": "Atlas (Boston Dynamics).",
                  "D": "Valkyrie (NASA)."
            },
            "correctAnswer": "A",
            "explanation": "Robot Sophia do hãng Hanson Robotics chế tạo, tích hợp thị giác máy tính, nhận diện giọng nói và biểu cảm khuôn mặt tự nhiên, được trao quyền công dân tại Ả Rập Xê Út năm 2017."
      },
      {
            "id": "12a-q17",
            "question": "Câu 17. Khả năng nào dưới đây của AI cho phép máy tính tự cải thiện hiệu suất và điều chỉnh hành vi dựa trên dữ liệu mới mà không cần lập trình lại từng dòng mã?",
            "options": {
                  "A": "Khả năng suy luận.",
                  "B": "Khả năng học (Machine Learning).",
                  "C": "Khả năng nhận thức phần cứng.",
                  "D": "Khả năng giải phóng bộ nhớ RAM."
            },
            "correctAnswer": "B",
            "explanation": "Khả năng học (Học máy - Machine Learning) cho phép hệ thống tự tìm ra quy luật từ dữ liệu lớn để nâng cao độ chính xác theo thời gian."
      },
      {
            "id": "12a-q18",
            "question": "Câu 18. Hệ thống khuyến nghị video trên YouTube hay đề xuất phim trên Netflix là minh chứng rõ nét cho đặc trưng nào của AI?",
            "options": {
                  "A": "Khả năng học (Machine Learning từ thói quen, lịch sử xem của người dùng).",
                  "B": "Khả năng nhận thức môi trường bằng cảm biến LiDAR.",
                  "C": "Khả năng tổng hợp giọng nói con người.",
                  "D": "Khả năng tối ưu hoá cơ chế làm mát vi xử lý."
            },
            "correctAnswer": "A",
            "explanation": "Hệ thống gợi ý phân tích hành vi của hàng triệu người dùng để 'học' sở thích cá nhân hoá và liên tục đưa ra các đề xuất nội dung tương thích nhất."
      },
      {
            "id": "12a-q19",
            "question": "Câu 19. Ứng dụng nào sau đây KHÔNG phải là ứng dụng của AI tạo sinh (Generative AI)?",
            "options": {
                  "A": "ChatGPT (tự động tạo văn bản mới).",
                  "B": "Midjourney (tự động vẽ hình ảnh nghệ thuật mới).",
                  "C": "Mubert (tự động sáng tác bản nhạc mới).",
                  "D": "Google Search (tìm kiếm và hiển thị danh sách trang web khớp từ khoá)."
            },
            "correctAnswer": "D",
            "explanation": "AI tạo sinh (Generative AI) là AI có khả năng sáng tạo nội dung mới (chữ, tranh, nhạc, video). Google Search truyền thống chỉ thực hiện thu thập và lập chỉ mục tìm kiếm thông tin sẵn có."
      },
      {
            "id": "12a-q20",
            "question": "Câu 20. Trợ lí ảo nào sau đây được tích hợp trên các dòng thiết bị di động của hãng Samsung?",
            "options": {
                  "A": "Siri.",
                  "B": "Bixby.",
                  "C": "Cortana.",
                  "D": "Alexa."
            },
            "correctAnswer": "B",
            "explanation": "Bixby là trợ lí ảo của Samsung. Siri của Apple, Cortana của Microsoft, Alexa của Amazon."
      },
      {
            "id": "12a-q21",
            "question": "Câu 21. Sự kết hợp giữa Trí tuệ nhân tạo (AI) và mạng Internet vạn vật (IoT) được viết tắt là gì?",
            "options": {
                  "A": "AIoT (Artificial Intelligence of Things).",
                  "B": "IoAI.",
                  "C": "SmartNet.",
                  "D": "RoboNet."
            },
            "correctAnswer": "A",
            "explanation": "AIoT (Artificial Intelligence of Things) là sự kết hợp giữa AI và IoT, cho phép các thiết bị kết nối mạng có khả năng tự thu thập và phân tích dữ liệu thông minh ngay tại biên."
      },
      {
            "id": "12a-q22",
            "question": "Câu 22. Trong các phương án sau, ứng dụng nào của AI mang lại lợi ích nổi bật trong lĩnh vực y học hiện đại?",
            "options": {
                  "A": "Phân tích hình ảnh y tế (chụp CT/MRI, X-quang) để phát hiện sớm các tế bào và khối u bất thường.",
                  "B": "Tự động phát tờ rơi khám bệnh tại quầy tiếp đón bệnh viện.",
                  "C": "Sản xuất giường bệnh cơ học thông thường.",
                  "D": "Thực hiện thu tiền viện phí thủ công bằng giấy tờ."
            },
            "correctAnswer": "A",
            "explanation": "Thị giác máy tính và AI y tế giúp bác sĩ phát hiện các tổn thương vi mô trên phim X-quang, MRI sọ não với tốc độ xử lý nhanh và độ chính xác rất cao."
      },
      {
            "id": "12a-q23",
            "question": "Câu 23. Trong xe ô tô tự lái, sự kết hợp giữa các thiết bị nào giúp hệ thống nhận thức môi trường, nhận diện biển báo và phát hiện người đi bộ?",
            "options": {
                  "A": "Camera thị giác máy tính kết hợp cảm biến LiDAR và Radar.",
                  "B": "Màn hình cảm ứng giải trí và bộ phát sóng Wi-Fi.",
                  "C": "Hệ thống sưởi ghế và quạt gió điều hoà cơ học.",
                  "D": "Cảm biến đo áp suất lốp và phanh tay cơ khí."
            },
            "correctAnswer": "A",
            "explanation": "Camera giúp xe đọc biển báo, đèn giao thông, vạch kẻ đường; LiDAR và Radar quét 3D môi trường để đo khoảng cách và vận tốc chướng ngại vật ngay cả trong đêm tối."
      },
      {
            "id": "12a-q24",
            "question": "Câu 24. Điểm khác biệt cơ bản nhất giữa Trí tuệ nhân tạo (AI) và các hệ thống Tự động hoá truyền thống là gì?",
            "options": {
                  "A": "AI có khả năng học hỏi từ dữ liệu và thích ứng với tình huống mới, trong khi tự động hoá truyền thống chỉ làm theo quy trình lập trình cố định.",
                  "B": "Tự động hoá cần kết hợp 5 đặc trưng trí tuệ con người còn AI thì không cần.",
                  "C": "AI không cần bất kì dữ liệu đầu vào nào để hoạt động.",
                  "D": "Tự động hoá luôn thông minh hơn và giải quyết được vấn đề đa lĩnh vực hơn AI."
            },
            "correctAnswer": "A",
            "explanation": "Tự động hoá truyền thống hoạt động theo tập lệnh cứng nhắc (không thể tự ứng biến); trong khi AI sở hữu các năng lực học, suy luận và nhận thức để giải quyết linh hoạt tình huống phát sinh."
      },
      {
            "id": "12a-q25",
            "question": "Câu 25. Phép thử nào do Alan Turing đề xuất năm 1950 nhằm kiểm tra khả năng máy tính có đạt đến trí tuệ con người hay không?",
            "options": {
                  "A": "Phép thử Turing (Turing Test).",
                  "B": "Phép thử Dartmouth.",
                  "C": "Phép thử McCarthy.",
                  "D": "Phép thử AlphaGo."
            },
            "correctAnswer": "A",
            "explanation": "Phép thử Turing (Turing Test) đặt giả định: nếu con người giao tiếp gián tiếp qua màn hình mà không phân biệt được đối thoại là người hay máy, thì cỗ máy đó đạt đến trí tuệ nhân tạo."
      },
      {
            "id": "12a-q26",
            "question": "Câu 26. Hiện nay, nhược điểm và rủi ro lớn nhất của các mô hình AI trong việc hỗ trợ ra quyết định tuyển dụng hay cấp tín dụng là gì?",
            "options": {
                  "A": "Kết quả có thể bị thiên vị hoặc sai lệch nếu dữ liệu huấn luyện ban đầu có định kiến xã hội.",
                  "B": "AI hoạt động quá nhanh khiến con người không kịp theo dõi.",
                  "C": "AI tiêu thụ ít điện năng hơn máy tính văn phòng.",
                  "D": "AI hoàn toàn không thể bị tấn công mạng."
            },
            "correctAnswer": "A",
            "explanation": "AI học theo các mẫu dữ liệu trong quá khứ; nếu dữ liệu đó chứa định kiến về giới tính, độ tuổi, vùng miền thì mô hình AI sẽ vô tình học và khuếch đại sự thiên vị đó."
      },
      {
            "id": "12a-q27",
            "question": "Câu 27. Công cụ AI nào sau đây chuyên tạo hình ảnh nghệ thuật dựa trên câu lệnh mô tả văn bản (text-to-image)?",
            "options": {
                  "A": "Midjourney.",
                  "B": "Whisper.",
                  "C": "Codex.",
                  "D": "Grammarly."
            },
            "correctAnswer": "A",
            "explanation": "Midjourney là nền tảng AI tạo sinh hình ảnh từ văn bản nổi tiếng nhất hiện nay. Whisper dùng nhận dạng giọng nói, Codex sinh code, Grammarly sửa ngữ pháp."
      },
      {
            "id": "12a-q28",
            "question": "Câu 28. Nền tảng nào do Google phát triển giúp lập trình viên xây dựng chatbot và giao diện đàm thoại ngôn ngữ tự nhiên?",
            "options": {
                  "A": "Dialogflow.",
                  "B": "TensorFlow.",
                  "C": "Rainbird.",
                  "D": "Origami."
            },
            "correctAnswer": "A",
            "explanation": "Dialogflow là dịch vụ của Google chuyên dùng để xây dựng các ứng dụng trò chuyện (chatbot), trợ lý giọng nói và đàm thoại ngôn ngữ tự nhiên."
      },
      {
            "id": "12a-q29",
            "question": "Câu 29. Lợi ích quan trọng nhất của AI đối với người học trong giáo dục thời đại số là gì?",
            "options": {
                  "A": "Cá nhân hoá tiến trình học tập, phát hiện lỗ hổng kiến thức và đề xuất bài tập rèn luyện phù hợp.",
                  "B": "Làm bài tập về nhà và thi cử thay thế cho học sinh.",
                  "C": "Thay thế hoàn toàn sự hiện diện của thầy cô giáo.",
                  "D": "Bỏ qua các môn học khoa học tự nhiên."
            },
            "correctAnswer": "A",
            "explanation": "AI trong giáo dục đóng vai trò trợ giảng thông minh 24/7, giúp theo dõi năng lực từng em, đề xuất lộ trình ôn tập cá nhân hoá để tối ưu hoá thời gian và hiệu quả tiếp thu."
      },
      {
            "id": "12a-q30",
            "question": "Câu 30. Hiện nay, Trí tuệ nhân tạo KHÔNG thể có năng lực nào sau đây?",
            "options": {
                  "A": "Khả năng cảm nhận và thấu hiểu cảm xúc con người một cách trọn vẹn và có ý thức tự thân.",
                  "B": "Khả năng nhận dạng tiếng nói và chuyển đổi thành văn bản.",
                  "C": "Khả năng dịch tự động giữa hơn 100 ngôn ngữ khác nhau trên thế giới.",
                  "D": "Khả năng phân tích và nhận diện khuôn mặt người tham gia giao thông."
            },
            "correctAnswer": "A",
            "explanation": "Các hệ thống AI hiện nay đều là AI hẹp (ANI), thuần tuý tính toán xác suất từ mô hình toán học; AI hoàn toàn không có cảm xúc, linh hồn hay ý thức như con người."
      }
],
    "application": {
      "realLife": "Khi nhận được cuộc gọi video từ người thân nhờ chuyển tiền gấp nhưng khẩu hình miệng hoặc giọng nói có dấu hiệu ngắt quãng bất thường, hãy bình tĩnh cúp máy và gọi trực tiếp bằng số điện thoại di động thông thường để xác minh, tránh bẫy công nghệ Deepfake.",
      "examTraps": [
        "Bẫy 1: Cho rằng ChatGPT đã là AGI (Sai, ChatGPT vẫn chỉ là AI hẹp ANI).",
        "Bẫy 2: Nhầm lẫn năm John McCarthy đặt thuật ngữ (1955) với năm diễn ra Hội thảo Dartmouth (1956).",
        "Bẫy 3: Cho rằng hệ chuyên gia MYCIN sử dụng học sâu hiện đại (Sai, MYCIN dùng cơ sở tri thức luật logic NẾU-THÌ)."
      ],
      "tips": [
        "Học thuộc 5 đặc trưng của AI: Học, Suy luận, Nhận thức, Hiểu ngôn ngữ, Giải quyết vấn đề.",
        "Luôn nhớ từ khoá 'Dữ liệu huấn luyện' là cốt lõi của tính đúng đắn và đạo đức AI."
      ]
    },
    "requirements": [
      "Giải thích sơ lược khái niệm Trí tuệ nhân tạo (AI - Artificial Intelligence).",
      "Nêu ví dụ minh hoạ cho một số ứng dụng điển hình: điều khiển tự động, chẩn đoán bệnh, nhận dạng chữ viết/tiếng nói/khuôn mặt, trợ lý ảo.",
      "Chỉ ra 5 đặc trưng nhận biết AI: Học, Suy luận, Nhận thức, Hiểu ngôn ngữ, Giải quyết vấn đề.",
      "Phân biệt được AI hẹp (ANI) và AI rộng (AGI), hiểu ý nghĩa phép thử Turing (Turing Test).",
      "Nêu được cảnh báo về đạo đức, an ninh mạng (Deepfake), quyền riêng tư và tác động việc làm."
    ],
    "keyConcepts": [
      {
        "term": "Thuật ngữ AI (1955 - 1956)",
        "definition": "Nhà khoa học John McCarthy đặt ra năm 1955. Hội thảo khoa học Dartmouth năm 1956 chính thức đánh dấu sự ra đời của ngành AI.",
        "example": "Khởi đầu từ hội thảo Dartmouth 1956 tại Mỹ."
      },
      {
        "term": "5 Đặc trưng của AI",
        "definition": "Gồm: (1) Khả năng học, (2) Khả năng suy luận, (3) Khả năng nhận thức, (4) Khả năng hiểu ngôn ngữ, (5) Khả năng giải quyết vấn đề.",
        "example": "Hệ chuyên gia MYCIN áp dụng luật IF-THEN chẩn đoán nhiễm trùng máu."
      },
      {
        "term": "AI hẹp (ANI) vs AI rộng (AGI)",
        "definition": "ANI giải quyết nhiệm vụ cụ thể trong phạm vi hẹp (AlphaGo, ChatGPT). AGI có trí tuệ tổng quát như con người và vượt qua phép thử Turing.",
        "example": "ChatGPT, xe tự lái hiện tại vẫn thuộc phạm vi AI hẹp."
      },
      {
        "term": "Deepfake & Đạo đức AI",
        "definition": "Công nghệ tạo hình ảnh, giọng nói giả mạo người thật. Dữ liệu huấn luyện đúng đắn là điều kiện tiên quyết đảm bảo đạo đức AI.",
        "example": "Giả giọng người thân vay tiền, tạo hình ảnh xuyên tạc."
      }
    ],
    "theorySections": [
      {
        "title": "1. Bản chất sự khác biệt giữa Con người và Máy tính",
        "content": "Con người có khả năng tư duy, khái quát hóa, suy luận logic và kiểm soát cảm xúc. Máy tính xử lý tính toán dữ liệu lớn cực nhanh và chính xác nhưng không có khả năng tự suy nghĩ nếu không được tích hợp AI."
      },
      {
        "title": "2. Các ứng dụng thực tế nổi bật",
        "content": "– Y tế: Hệ chuyên gia y tế MYCIN, IBM Watson.\n– Giao thông: Xe tự lái kết hợp camera + LiDAR.\n– Giáo dục: Cá nhân hóa lộ trình học.\n– Trợ lý ảo: Siri, Google Assistant, Alexa."
      }
    ],
    "practicalTips": [
      "Nhớ rõ mốc thời gian: John McCarthy (1955), Hội thảo Dartmouth (1956).",
      "Hệ chuyên gia MYCIN sử dụng quy tắc logic IF-THEN.",
      "ChatGPT là AI tạo sinh và vẫn thuộc nhóm AI hẹp (ANI)."
    ],
    "commonPitfalls": [
      "Nhầm lẫn dây chuyền tự động hóa thông thường là AI.",
      "Nghĩ rằng AI hiện nay đã có cảm xúc như con người.",
      "Cho rằng ChatGPT là AGI."
    ]
  },
  "12B": {
    "id": "12B",
    "code": "Chủ đề 12B",
    "title": "Mạng máy tính và Kết nối mạng",
    "grade": "12",
    "track": "ALL",
    "examWeight": "Trọng tâm Lớp 12 (~20% lệnh hỏi)",
    "iconName": "network",
    "summary": "Nắm vững kiến trúc mạng LAN/WLAN/WAN/Internet, thiết bị mạng (Switch, Router, Access Point, Modem), cáp xoắn UTP, cáp quang, giao thức TCP/IP, địa chỉ IPv4/IPv6, hệ thống DNS và thực hành chia sẻ tệp/máy in.",
    "outline": [
      {
        "id": "muc-tieu",
        "title": "Mục tiêu bài học",
        "level": 1
      },
      {
        "id": "muc-do",
        "title": "Mức độ kiến thức và kĩ năng cần đạt",
        "level": 1
      },
      {
        "id": "khoi-dong",
        "title": "Hoạt động khởi động",
        "level": 1
      },
      {
        "id": "sec-1",
        "title": "1. Khái niệm, ích lợi của mạng máy tính",
        "level": 1
      },
      {
        "id": "sec-2",
        "title": "2. Khái niệm mạng LAN và các thiết bị mạng thông dụng",
        "level": 1
      },
      {
        "id": "sec-2-1",
        "title": "a) Khái niệm mạng LAN và các thành phần chính",
        "level": 2
      },
      {
        "id": "sec-2-2",
        "title": "b) Chức năng của Switch, Router, Modem, Access Point",
        "level": 2
      },
      {
        "id": "sec-3",
        "title": "3. Môi trường truyền dẫn: Cáp xoắn và Cáp quang",
        "level": 1
      },
      {
        "id": "sec-4",
        "title": "4. Giao thức mạng TCP/IP và Địa chỉ IP",
        "level": 1
      },
      {
        "id": "sec-4-1",
        "title": "a) Bộ giao thức TCP/IP và cơ chế hoạt động",
        "level": 2
      },
      {
        "id": "sec-4-2",
        "title": "b) Cấu trúc địa chỉ IPv4 và IPv6",
        "level": 2
      },
      {
        "id": "sec-5",
        "title": "5. Thực hành chia sẻ tài nguyên trên mạng LAN",
        "level": 1
      },
      {
        "id": "ghi-nho",
        "title": "Ghi nhớ",
        "level": 1
      },
      {
        "id": "luyen-tap",
        "title": "Luyện tập (Trắc nghiệm chuẩn sách)",
        "level": 1
      },
      {
        "id": "van-dung",
        "title": "Vận dụng",
        "level": 1
      }
    ],
    "objectives": [
      "Nêu được khái niệm, ích lợi của mạng máy tính; phân biệt mạng LAN, WLAN (Wi-Fi), WAN và Internet.",
      "Mô tả được chức năng chính của các thiết bị mạng: Switch, Router, Modem, Access Point và kết nối được với PC.",
      "Giải thích được đặc điểm, cấu tạo và ứng dụng của cáp xoắn UTP và cáp quang.",
      "Mô tả sơ lược vai trò và chức năng của bộ giao thức TCP/IP; phân biệt được địa chỉ IPv4 (32 bit) và IPv6 (128 bit).",
      "Thực hiện được các thao tác thiết lập chia sẻ thư mục (Read, Change, Full Control) và chia sẻ máy in qua mạng LAN trên hệ điều hành Windows."
    ],
    "standards": [
      {
        "level": "Nhận biết",
        "desc": "Nêu được tên gọi các thiết bị mạng; phân biệt mạng Wi-Fi là WLAN; nhớ số bit của IPv4 (32 bit = 4 byte) và IPv6 (128 bit = 16 byte)."
      },
      {
        "level": "Thông hiểu",
        "desc": "Giải thích được cơ chế hoạt động của Switch qua bảng địa chỉ MAC; vai trò định tuyến của Router; chức năng điều chế của Modem; vai trò của TCP (kiểm soát luồng) và IP (định tuyến)."
      },
      {
        "level": "Vận dụng",
        "desc": "Chuyển đổi địa chỉ IPv4 từ nhị phân sang thập phân; thiết lập quyền chia sẻ thư mục và máy in trong mạng LAN trường học; khắc phục sự cố mất kết nối mạng."
      }
    ],
    "warmUp": {
      "context": "Trong phòng máy tính của trường, tất cả các máy tính của học sinh đều có thể in ra cùng một chiếc máy in đặt ở bàn giáo viên và truy cập chung vào một thư mục bài giảng.",
      "question": "Các máy tính đã kết nối với nhau như thế nào? Thiết bị mạng nào đóng vai trò trung tâm điều phối các kết nối này?"
    },
    "mainSections": [
      {
        "id": "sec-1",
        "number": "1.",
        "title": "Khái niệm, ích lợi của mạng máy tính",
        "content": "• Khái niệm mạng máy tính: Là một hệ thống các thiết bị số được kết nối với nhau thông qua các phương tiện truyền dẫn (có dây hoặc không dây) để truyền dữ liệu và trao đổi thông tin.\n• Lợi ích của mạng máy tính: Giúp người dùng chia sẻ tài nguyên phần cứng (máy in, máy quét, ổ cứng mạng), chia sẻ phần mềm, tài liệu học tập và giao tiếp trao đổi thông tin nhanh chóng, tiết kiệm chi phí."
      },
      {
        "id": "sec-2",
        "number": "2.",
        "title": "Khái niệm mạng LAN và các thiết bị mạng thông dụng",
        "content": "Mạng cục bộ (LAN - Local Area Network) kết nối các máy tính trong phạm vi hẹp như một toà nhà, văn phòng, trường học hoặc gia đình.",
        "subSections": [
          {
            "id": "sec-2-1",
            "letter": "a)",
            "title": "Các thành phần chính của mạng LAN",
            "content": "Một mạng LAN điển hình bao gồm: Máy chủ (Server), các máy tính cá nhân (Client PC), máy in mạng, cáp mạng, Switch, Router và Access Point."
          },
          {
            "id": "sec-2-2",
            "letter": "b)",
            "title": "Chức năng của Switch, Router, Modem, Access Point",
            "content": "1. Switch (Bộ chuyển mạch): Là thiết bị trung tâm kết nối các máy tính trong cùng mạng LAN bằng cáp mạng UTP. Switch xây dựng bảng địa chỉ MAC của từng cổng, từ đó chỉ chuyển tiếp gói tin đến đúng cổng của thiết bị nhận đích mà không gửi tràn lan sang các cổng khác.\n2. Router (Bộ định tuyến): Thiết bị quan trọng kết nối các mạng LAN khác nhau với nhau hoặc nối LAN ra mạng diện rộng WAN/Internet. Router đọc địa chỉ IP đích để tìm tuyến đường đi tốt nhất cho gói tin.\n3. Access Point (Điểm truy cập không dây): Tiếp nhận tín hiệu từ mạng LAN có dây và phát sóng Wi-Fi cho các thiết bị di động (laptop, điện thoại) kết nối vào mạng LAN.\n4. Modem: Thiết bị điều chế (chuyển đổi tín hiệu số Digital từ máy tính thành tín hiệu tương tự Analog để truyền qua đường dây viễn thông) và giải điều chế (chuyển tín hiệu tương tự nhận được thành tín hiệu số)."
          }
        ]
      },
      {
        "id": "sec-3",
        "number": "3.",
        "title": "Môi trường truyền dẫn: Cáp xoắn và Cáp quang",
        "content": "• Cáp xoắn UTP (Unshielded Twisted Pair): Gồm 4 cặp dây đồng bện xoắn đôi vào nhau để khử nhiễu điện từ. Đầu cáp bấm giắc RJ-45 chuẩn chuẩn T568A hoặc T568B. Chuẩn cáp CAT 5e hỗ trợ tốc độ 1 Gbps, CAT 6 hỗ trợ lên đến 10 Gbps trong cự li 100m.\n• Cáp quang (Fiber Optic): Cấu tạo gồm 3 lớp (lõi thủy tinh core, lớp phản quang cladding, lớp vỏ nhựa bảo vệ coating). Truyền dữ liệu bằng các xung ánh sáng dựa trên hiện tượng phản xạ toàn phần. Cáp quang có ưu điểm: tốc độ cực cao, cự li truyền xa hàng ngàn km, hoàn toàn không bị ảnh hưởng bởi nhiễu điện từ hay sấm sét."
      },
      {
        "id": "sec-4",
        "number": "4.",
        "title": "Giao thức mạng TCP/IP và Địa chỉ IP",
        "content": "Giao thức mạng là tập hợp các quy tắc chuẩn điều khiển việc truyền dữ liệu giữa các thiết bị mạng.",
        "subSections": [
          {
            "id": "sec-4-1",
            "letter": "a)",
            "title": "Bộ giao thức TCP/IP",
            "content": "• Giao thức TCP (Transmission Control Protocol): Hoạt động ở tầng Giao vận, phụ trách việc chia nhỏ thông điệp thành các gói tin (packet), đánh số thứ tự, kiểm soát luồng và kiểm tra phát hiện lỗi. Nếu có gói tin bị thất lạc, TCP yêu cầu gửi lại, đảm bảo truyền dữ liệu chính xác và tin cậy tuyệt đối.\n• Giao thức IP (Internet Protocol): Hoạt động ở tầng Mạng, phụ trách việc gán địa chỉ IP nguồn và IP đích cho gói tin, định tuyến đường đi tốt nhất qua các Router trên toàn cầu."
          },
          {
            "id": "sec-4-2",
            "letter": "b)",
            "title": "Cấu trúc địa chỉ IPv4 và IPv6",
            "content": "• IPv4: Có độ dài 32 bit, chia thành 4 octet (mỗi octet 8 bit = 1 byte), biểu diễn bằng 4 số thập phân phân cách bởi dấu chấm (ví dụ: 192.168.1.1). IPv4 cung cấp khoảng 2^32 ≈ 4,3 tỉ địa chỉ và hiện nay đã cạn kiệt.\n• IPv6: Có độ dài 128 bit (16 byte), gồm 8 nhóm số thập lục phân (hex) phân cách bởi dấu hai chấm (ví dụ: 2001:0db8:85a3:0000:0000:8a2e:0370:7334). Cung cấp 2^128 địa chỉ (gần như vô tận).\n• Hệ thống tên miền (DNS): Đóng vai trò như 'danh bạ', chuyển đổi tên miền dạng chữ (ví dụ: moet.gov.vn) sang địa chỉ IP dạng số mà máy tính có thể hiểu được."
          }
        ]
      },
      {
        "id": "sec-5",
        "number": "5.",
        "title": "Thực hành chia sẻ tài nguyên trên mạng LAN",
        "content": "• Chia sẻ thư mục trên Windows:\nBước 1: Nhấp chuột phải vào thư mục cần chia sẻ, chọn Properties -> tab Sharing -> nút Share.\nBước 2: Chọn tài khoản người dùng hoặc nhóm 'Everyone', sau đó gán quyền truy cập: Read (chỉ đọc), Change (sửa/xoá), Full Control (toàn quyền).\n• Chia sẻ máy in:\nBước 1: Mở Control Panel -> Devices and Printers -> nhấp chuột phải vào máy in -> Printer properties -> tab Sharing -> chọn 'Share this printer'.\nBước 2: Trên máy khách cần in, mở Add a printer -> chọn 'Select a shared printer by name' -> nhập đường dẫn mạng đến máy in đã chia sẻ."
      }
    ],
    "memoryNotes": [
      "Mạng Wi-Fi chính là mạng cục bộ không dây (WLAN).",
      "Switch chuyển mạch nội bộ LAN dựa vào địa chỉ MAC; Router định tuyến liên mạng dựa vào địa chỉ IP.",
      "IPv4 dài 32 bit (4 byte); IPv6 dài 128 bit (16 byte). Không được nhầm IPv6 dài 6 byte!",
      "Máy tính để bàn (Desktop PC) thông thường KHÔNG có sẵn Card mạng không dây Wi-Fi, cần trang bị thêm hoặc kết nối dây cáp UTP."
    ],
    "practiceQuestions": [
      {
        "id": "12b-q1",
        "question": "Câu 1. Phát biểu nào sau đây là tên thường gọi của mạng Wi-Fi?",
        "options": {
          "A": "Mạng WLAN.",
          "B": "Mạng Internet.",
          "C": "Mạng không dây.",
          "D": "Mạng cục bộ."
        },
        "correctAnswer": "A",
        "explanation": "Trích nguyên văn đáp án sách Hướng dẫn ôn thi tốt nghiệp môn Tin học (trang 172): 'A. Phương án C sai vì mạng Wi-Fi chỉ là một trong số nhiều loại mạng không dây (Wi-Fi, Bluetooth, 4G/5G). Mạng cục bộ không dây có tên viết tắt là WLAN (Wireless Local Area Network), chính là tên gọi kĩ thuật của mạng Wi-Fi.'"
      },
      {
        "id": "12b-q2",
        "question": "Câu 2. Phát biểu nào sau đây mô tả đúng về mạng WAN?",
        "options": {
          "A": "Tên viết tắt của Wide Area Network, nghĩa là mạng diện rộng.",
          "B": "Tên viết đầy đủ là Wireless Area Network, nghĩa là mạng diện rộng.",
          "C": "Là mạng kết nối trong phạm vi một trường học hoặc chung cư.",
          "D": "Là một dạng đặc biệt của mạng Internet."
        },
        "correctAnswer": "A",
        "explanation": "Trích nguyên văn đáp án sách (trang 173): 'A. Phương án C sai vì mạng kết nối trong phạm vi trường học hoặc chung cư là LAN. Phương án D sai vì Internet là một trường hợp riêng của mạng WAN toàn cầu.'"
      },
      {
        "id": "12b-q3",
        "question": "Câu 3. Giao thức TCP/IP là gì?",
        "options": {
          "A": "Tên ghép của hai giao thức TCP (kiểm soát truyền vận) và IP (định tuyến liên mạng).",
          "B": "Tên của một giao thức duy nhất phụ trách mọi chức năng mạng.",
          "C": "Giao thức chỉ sử dụng riêng cho mạng cục bộ LAN có dây.",
          "D": "Phần mềm ứng dụng dùng để xem trang web trên máy tính tính."
        },
        "correctAnswer": "A",
        "explanation": "Trích nguyên văn đáp án sách (trang 173): 'A. TCP/IP là tên của hai giao thức ghép lại: TCP phụ trách việc kiểm soát truyền vận không thất lạc gói tin; IP lo việc định tuyến, tìm ra tuyến đường đi tốt nhất trên mạng.'"
      },
      {
        "id": "12b-q4",
        "question": "Câu 4. Phát biểu nào sau đây đúng về địa chỉ IPv4 và IPv6?",
        "options": {
          "A": "Địa chỉ IPv4 có độ dài 32 bit (4 byte), còn độ dài của IPv6 là 128 bit (16 byte).",
          "B": "Địa chỉ IPv4 có độ dài 4 byte, còn độ dài của IPv6 là 6 byte.",
          "C": "Địa chỉ IPv4 có kho địa chỉ vô hạn và hiện chưa có dấu hiệu cạn kiệt.",
          "D": "Địa chỉ IP được cấp trực tiếp cho từng người dùng chứ không phải thiết bị."
        },
        "correctAnswer": "A",
        "explanation": "Trích nguyên văn đáp án sách (trang 173): 'A. IPv4 có độ dài 32 bit = 4 byte (khoảng 4,3 tỉ địa chỉ và đã cạn kiệt). IPv6 có độ dài 128 bit = 16 byte. Phương án B sai vì nhầm IPv6 là 6 byte.'"
      },
      {
        "id": "12b-q5",
        "question": "Câu 5. Phát biểu nào sau đây SAI khi nói về việc kết nối PC với mạng Wi-Fi thông qua các thiết bị kết nối mạng?",
        "options": {
          "A": "Cả máy tính để bàn lẫn máy tính xách tay đều có thể kết nối vào mạng Wi-Fi nếu được trang bị đầy đủ về phần cứng thiết bị.",
          "B": "Hiện nay, mọi Laptop và điện thoại thông minh thông thường đều được trang bị sẵn Card mạng (NIC) không dây để kết nối vào mạng Wi-Fi.",
          "C": "Hiện nay, các máy tính để bàn (Desktop PC) thông thường đều được trang bị sẵn Card mạng (NIC) không dây để kết nối vào mạng Wi-Fi.",
          "D": "Hiện nay, máy tính để bàn (Desktop PC) cần được lắp thêm Card mạng (NIC) không dây thì mới kết nối được vào mạng Wi-Fi."
        },
        "correctAnswer": "C",
        "explanation": "Trích nguyên văn đáp án sách (trang 173): 'C. Hiện nay, Desktop PC thông thường KHÔNG được trang bị sẵn NIC không dây mà chỉ có cổng mạng Ethernet có dây cắm giắc RJ-45.'"
      }
    ],
    "application": {
      "realLife": "Cách đổi nhị phân sang thập phân cho một octet IP: 8 bit tương ứng với các trọng số 128, 64, 32, 16, 8, 4, 2, 1. Ví dụ chuỗi nhị phân 11000000 = 128 + 64 = 192.",
      "examTraps": [
        "Bẫy phổ biến nhất: Nhầm độ dài IPv6 là 6 byte (Sai, 128 bit = 16 byte!).",
        "Bẫy 2: Nghĩ rằng máy tính để bàn luôn có Wi-Fi tích hợp sẵn.",
        "Bẫy 3: Cho rằng TCP/IP là một giao thức duy nhất."
      ],
      "tips": [
        "Thuộc lòng chức năng: Switch dùng bảng MAC nối nội bộ; Router dùng IP định tuyến liên mạng.",
        "Quyền chia sẻ thư mục: Read (chỉ đọc) < Change (sửa, ghi, xóa) < Full Control (toàn quyền)."
      ]
    },
    "requirements": [
      "Phân biệt mạng cục bộ (LAN), mạng cục bộ không dây (WLAN / Wi-Fi) và mạng diện rộng (WAN / Internet).",
      "Nêu chức năng chính của Switch, Router, Access Point, Modem.",
      "Hiểu rõ môi trường truyền dẫn: Cáp xoắn UTP và Cáp quang.",
      "Giải thích bộ giao thức TCP/IP, cấu trúc IPv4 và IPv6.",
      "Thao tác thiết lập chia sẻ dữ liệu và chia sẻ máy in qua mạng LAN."
    ],
    "keyConcepts": [
      {
        "term": "Switch (Bộ chuyển mạch)",
        "definition": "Thiết bị trung tâm nối các máy trong cùng mạng LAN bằng dây cáp UTP. Switch xây dựng bảng địa chỉ gồm số hiệu cổng và địa chỉ MAC máy trạm.",
        "example": "Switch 24/48 cổng trong phòng máy trường học."
      },
      {
        "term": "Router (Bộ định tuyến)",
        "definition": "Thiết bị kết nối các mạng LAN khác nhau với nhau và kết nối mạng LAN ra Internet. Router tìm đường đi tốt nhất để chuyển gói tin tới đúng địa chỉ IP đích.",
        "example": "Router điều hướng gói tin từ mạng gia đình tới máy chủ Google."
      },
      {
        "term": "IPv4 vs IPv6",
        "definition": "IPv4 dài 32 bit (gần 4,3 tỉ địa chỉ). IPv6 dài 128 bit (2^128 địa chỉ). DNS chuyển đổi tên miền dạng chữ sang IP dạng số.",
        "example": "IPv4: 192.168.1.1 — IPv6: 2402:9d80:85c::1"
      }
    ],
    "theorySections": [
      {
        "title": "1. Các thiết bị mạng trọng tâm",
        "content": "• Switch: Tạo kết nối có dây nội bộ LAN, tra cứu bảng MAC để gửi đích xác cổng nhận.\n• Access Point (AP): Phát sóng Wi-Fi cho laptop, điện thoại kết nối vào LAN.\n• Modem: Chuyển đổi tín hiệu số thành tương tự và ngược lại.\n• Router: Nối mạng LAN với Internet, định tuyến gói tin."
      }
    ],
    "practicalTips": [
      "Mạng Wi-Fi chính là mạng WLAN (mạng cục bộ không dây).",
      "TCP là kiểm soát lỗi và thứ tự truyền tin; IP là tìm đường đi (định tuyến)."
    ],
    "commonPitfalls": [
      "Cho rằng IPv6 dài 6 byte (Sai! IPv6 dài 128 bit = 16 byte).",
      "Nghĩ rằng máy bàn Desktop PC luôn có sẵn Wi-Fi."
    ]
  },
  "12D": {
    "id": "12D",
    "code": "Chủ đề 12D",
    "title": "Đạo đức, Pháp luật và Văn hoá trong Môi trường Số",
    "grade": "12",
    "track": "ALL",
    "examWeight": "Trọng tâm Lớp 12 (~10% lệnh hỏi)",
    "iconName": "shield",
    "summary": "Nắm vững ưu nhược điểm của giao tiếp trong không gian mạng, tác động tiêu cực của công nghệ số, sử dụng dịch vụ Internet đúng luật, phòng tránh hành vi vi phạm đạo đức, văn hoá số và lan toả giá trị nhân văn.",
    "outline": [
      {
        "id": "muc-tieu",
        "title": "Mục tiêu bài học",
        "level": 1
      },
      {
        "id": "muc-do",
        "title": "Mức độ kiến thức và kĩ năng cần đạt",
        "level": 1
      },
      {
        "id": "khoi-dong",
        "title": "Hoạt động khởi động",
        "level": 1
      },
      {
        "id": "sec-1",
        "title": "1. Một số tác động tiêu cực của công nghệ kĩ thuật số",
        "level": 1
      },
      {
        "id": "sec-2",
        "title": "2. Sử dụng dịch vụ Internet đúng luật",
        "level": 1
      },
      {
        "id": "sec-2-a",
        "title": "a) Những hành vi vi phạm pháp luật, trái đạo đức, thiếu văn hoá khi hoạt động trong môi trường số",
        "level": 2
      },
      {
        "id": "sec-2-b",
        "title": "b) Sử dụng dịch vụ Internet đúng luật",
        "level": 2
      },
      {
        "id": "ghi-nho",
        "title": "Ghi nhớ",
        "level": 1
      },
      {
        "id": "luyen-tap",
        "title": "Luyện tập (Trắc nghiệm chuẩn sách)",
        "level": 1
      },
      {
        "id": "van-dung",
        "title": "Vận dụng",
        "level": 1
      }
    ],
    "objectives": [
      "Phân tích được các ưu điểm và nhược điểm về giao tiếp trong thế giới ảo qua các ví dụ thực tiễn đời sống.",
      "Chỉ ra được những tác động tiêu cực của công nghệ số đối với tâm lí, lối sống, hành vi và sức khoẻ của con người.",
      "Nhận diện được những hành vi vi phạm pháp luật, trái chuẩn mực đạo đức và thiếu văn hoá khi tham gia môi trường số.",
      "Hiểu và thực hiện đúng các quy định của pháp luật (Luật An ninh mạng, Luật Sở hữu trí tuệ) khi sử dụng dịch vụ Internet.",
      "Phân tích được tính nhân văn trong ứng xử ở một số tình huống tham gia thế giới ảo và có ý thức lan toả điều tử tế trên mạng xã hội."
    ],
    "standards": [
      {
        "level": "Nhận biết",
        "desc": "Nêu được các ưu điểm và hạn chế cơ bản của giao tiếp mạng (tiết kiệm chi phí, thiếu tín hiệu cơ thể cảm xúc); nhận biết các hành vi sai trái phổ biến (mạo danh, tung tin giả, bạo lực mạng)."
      },
      {
        "level": "Thông hiểu",
        "desc": "Giải thích được vì sao giao tiếp mạng dễ dẫn đến hiểu lầm; phân tích nguyên nhân và hậu quả của lối sống ảo, nghiện Internet, rủi ro bảo mật dữ liệu cá nhân; hiểu các chế tài của pháp luật Việt Nam."
      },
      {
        "level": "Vận dụng",
        "desc": "Ứng xử văn hoá, lịch sự và nhân văn trong các tình huống tranh luận trên mạng; bảo vệ tài khoản cá nhân; chủ động ủng hộ và tham gia các hoạt động thiện nguyện trực tuyến tích cực."
      }
    ],
    "warmUp": {
      "context": "Một bạn học sinh chia sẻ: 'Trên mạng xã hội, mình có thể trò chuyện với bạn bè ở khắp nơi bất cứ lúc nào, thậm chí nói những điều ngoài đời mình không dám nói. Nhưng đôi khi những bình luận ác ý từ những tài khoản ẩn danh khiến mình mất ngủ nhiều ngày liền.'",
      "question": "Theo em, không gian mạng mang lại sự tự do giao tiếp nhưng vì sao lại tiềm ẩn nhiều nguy cơ tổn thương tâm lí? Chúng ta cần làm gì để bảo vệ bản thân và ứng xử nhân văn trên mạng?"
    },
    "mainSections": [
      {
        "id": "sec-1",
        "number": "1.",
        "title": "Một số tác động tiêu cực của công nghệ kĩ thuật số",
        "content": "Không gian mạng mang lại nhiều ưu điểm to lớn như thực hiện giao tiếp mọi lúc mọi nơi, mở rộng kết nối xã hội không giới hạn địa lí, tiết kiệm tối đa thời gian và chi phí đi lại, sinh hoạt. Tuy nhiên, theo sách Hướng dẫn ôn thi tốt nghiệp môn Tin học (trang 48-50), bên cạnh những ưu điểm, giao tiếp trên môi trường số cũng bộc lộ những tác động tiêu cực và hạn chế tiềm ẩn sâu sắc:\n\n• 1.1. Thiếu ngôn ngữ hình thể và tín hiệu cảm xúc: Các phương thức giao tiếp như tin nhắn, email thiếu ánh mắt, nét mặt, cử chỉ cơ thể và ngữ điệu âm thanh của giọng nói. Điều này rất dễ gây ra hiểu lầm do người đọc diễn giải sai ý nghĩa của lời văn. Ngoài ra, việc ẩn danh còn tạo cơ hội cho kẻ xấu mạo danh cá nhân, tổ chức uy tín để thực hiện hành vi lừa đảo.\n\n• 1.2. Giảm hiệu quả giao tiếp và kĩ năng ngôn ngữ: Lạm dụng ngôn ngữ mạng, teencode, viết tắt tuỳ tiện, sai chính tả, sai ngữ pháp làm xói mòn sự trong sáng của tiếng Việt. Việc bị phân tán bởi thông báo tin nhắn liên tục cũng làm giảm độ tập trung trong học tập và công việc.\n\n• 1.3. Nguy cơ nghiện Internet và lối sống ảo: Dành quá nhiều thời gian trên thế giới ảo dẫn đến lười vận động, ngại giao tiếp thực tế ngoài đời, trở nên ngây ngô trong ứng xử xã hội. Hiện tượng câu like, khoe khoang ảo tạo ra tâm lí so sánh, ghen tị và trầm cảm ở thanh thiếu niên.\n\n• 1.4. Nguy cơ về bảo mật và lộ lọt quyền riêng tư: Rủi ro bị lộ mật khẩu, mất thông tin cá nhân (CCCD, số điện thoại, tài khoản ngân hàng), bị theo dõi định vị hoặc bị tống tiền qua các nội dung riêng tư nhạy cảm.\n\n• 1.5. Phụ thuộc nặng nề vào hạ tầng kĩ thuật: Khi gặp sự cố đứt cáp quang, mất điện hoặc thiết bị không tương thích, việc giao tiếp bị gián đoạn hoàn toàn, ảnh hưởng lớn đến tiến độ học tập và kinh tế."
      },
      {
        "id": "sec-2",
        "number": "2.",
        "title": "Sử dụng dịch vụ Internet đúng luật",
        "content": "Môi trường số không phải là vùng ngoài vòng pháp luật. Mọi hành vi hoạt động trên Internet đều phải tuân thủ Hiến pháp, Luật An ninh mạng, Luật Công nghệ thông tin và Bộ quy tắc ứng xử trên mạng xã hội do Bộ Thông tin và Truyền thông ban hành.",
        "subSections": [
          {
            "id": "sec-2-a",
            "letter": "a)",
            "title": "Những hành vi vi phạm pháp luật, trái đạo đức, thiếu văn hoá khi hoạt động trong môi trường số",
            "content": "Theo quy định của pháp luật Việt Nam và chuẩn mực văn hoá số, các hành vi sau đây bị nghiêm cấm và phải chịu trách nhiệm pháp lí:\n\n1. Mạo danh và lừa đảo trực tuyến: Giả mạo tài khoản mạng xã hội của lãnh đạo, cơ quan nhà nước, giáo viên hoặc người thân để vay tiền, chiếm đoạt tài sản.\n2. Phát tán thông tin sai sự thật (Tin giả - Fake News): Đăng tải hoặc chia sẻ các thông tin chưa được kiểm chứng, tin đồn thất thiệt về dịch bệnh, thiên tai, an ninh trật tự gây hoang mang trong dư luận.\n3. Xúc phạm danh dự, nhân phẩm và quấy rối trực tuyến (Cyberbullying): Sử dụng từ ngữ lăng mạ, châm chọc, body shaming, công kích cá nhân, kích động bạo lực mạng nhắm vào học sinh, thầy cô hoặc người khác.\n4. Vi phạm quyền riêng tư và bí mật đời tư: Tự ý chụp ảnh, quay video người khác rồi đăng lên mạng khi chưa được sự đồng ý; chia sẻ dữ liệu cá nhân, tin nhắn riêng tư lên các hội nhóm công cộng.\n5. Vi phạm bản quyền và sở hữu trí tuệ: Tải về, sao chép, sử dụng trái phép các phần mềm bẻ khoá (crack), sách, ảnh, bài giảng của tác giả khác mà không xin phép hoặc không trích dẫn nguồn hợp pháp."
          },
          {
            "id": "sec-2-b",
            "letter": "b)",
            "title": "Sử dụng dịch vụ Internet đúng luật và ứng xử nhân văn",
            "content": "Để xây dựng môi trường mạng an toàn, văn minh và nhân văn, học sinh cần rèn luyện các nguyên tắc chuẩn mực sau:\n\n1. Thấu hiểu và đồng cảm: Luôn suy nghĩ trước khi bình luận; biết đặt mình vào hoàn cảnh của người khác; chia sẻ và động viên chân thành khi thấy bạn bè gặp khó khăn.\n2. Ứng xử có văn hoá, lịch sự: Sử dụng ngôn ngữ chuẩn mực, văn minh; tôn trọng sự khác biệt về quan điểm, sở thích; kiên quyết không dùng từ ngữ kích động phân biệt vùng miền, giới tính hay tôn giáo.\n3. Lan toả những điều tốt đẹp: Tích cực chia sẻ các tấm gương người tốt, việc tốt, các chương trình thiện nguyện giúp đỡ đồng bào bị ảnh hưởng bởi thiên tai bão lũ; lan toả nguồn cảm hứng học tập tích cực.\n4. Đấu tranh với cái xấu một cách văn minh: Bày tỏ sự phản đối, không tiếp tay chia sẻ các bài viết độc hại; chủ động báo cáo (report) nội dung vi phạm cho nền tảng mạng xã hội hoặc cơ quan chức năng.\n5. Nâng cao kĩ năng tự bảo vệ: Cài đặt mật khẩu mạnh (chữ hoa, số, kí tự đặc biệt), bật xác thực 2 lớp (2FA), không bấm vào các đường link lạ và cẩn trọng với các yêu cầu kết bạn từ người lạ."
          }
        ],
        "table": {
          "headers": [
            "Hành vi trong môi trường số",
            "Đánh giá chuẩn mực",
            "Hậu quả / Biện pháp xử lí"
          ],
          "rows": [
            [
              "Mạo danh người thân mượn tiền qua Deepfake",
              "Vi phạm pháp luật nghiêm trọng (Tội lừa đảo)",
              "Bị truy cứu trách nhiệm hình sự, phạt tù"
            ],
            [
              "Chia sẻ bài viết cảnh báo dịch bệnh không rõ nguồn gốc",
              "Vi phạm Luật An ninh mạng (Phát tán tin giả)",
              "Bị xử phạt vi phạm hành chính từ 5 - 10 triệu đồng"
            ],
            [
              "Chụp lén ảnh bạn ngủ trong lớp rồi chế meme đăng lên mạng",
              "Trái đạo đức, thiếu văn hoá, xâm phạm quyền riêng tư",
              "Bạn bè tẩy chay, nhà trường kỉ luật, buộc gỡ bỏ và xin lỗi"
            ],
            [
              "Quyên góp, ủng hộ đồng bào lũ lụt qua cổng thông tin chính thống",
              "Ứng xử nhân văn, lan toả giá trị tốt đẹp",
              "Xây dựng cộng đồng tương thân tương ái"
            ]
          ]
        }
      }
    ],
    "memoryNotes": [
      "Giao tiếp trong không gian mạng KHÔNG nhất thiết luôn giúp cải thiện kĩ năng giao tiếp trực tiếp do thiếu ngôn ngữ cơ thể và cảm xúc.",
      "Ưu điểm lớn nhất của giao tiếp mạng là tiết kiệm thời gian, công sức và chi phí do không cần di chuyển đến cùng một nơi.",
      "Môi trường mạng chịu sự điều chỉnh của Luật An ninh mạng; mọi hành vi bôi nhọ, phát tán tin giả, mạo danh đều bị xử phạt nghiêm minh.",
      "Nguyên tắc vàng: 'Hãy đối xử với người khác trên mạng như cách em muốn được đối xử ngoài đời thực'."
    ],
    "practiceQuestions": [
      {
        "id": "12d-q1",
        "question": "Câu 1. Giao tiếp trong không gian mạng KHÔNG có ưu điểm nào sau đây?",
        "options": {
          "A": "Thực hiện ở mọi lúc, mọi nơi.",
          "B": "Mở rộng kết nối xã hội và khả năng tương tác.",
          "C": "Tiết kiệm thời gian, công sức hoặc chi phí.",
          "D": "Luôn giúp cải thiện kĩ năng giao tiếp."
        },
        "correctAnswer": "D",
        "explanation": "Trích nguyên văn đáp án sách Hướng dẫn ôn thi tốt nghiệp môn Tin học (trang 177): 'D. Phương án D sai vì giao tiếp trong không gian mạng thiếu các tín hiệu cảm xúc, ngôn ngữ hình thể và âm điệu tiếng nói nên không nhất thiết luôn giúp cải thiện kĩ năng giao tiếp trực tiếp của con người.'"
      },
      {
        "id": "12d-q2",
        "question": "Câu 2. Giao tiếp trong không gian mạng KHÔNG có hạn chế nào sau đây?",
        "options": {
          "A": "Luôn thiếu ngôn ngữ hình thể, thiếu tín hiệu cảm xúc.",
          "B": "Nghiện Internet với hàng giờ giao lưu trên mạng.",
          "C": "Có thể gặp rủi ro về bảo mật và quyền riêng tư.",
          "D": "Phụ thuộc vào các phương tiện giao tiếp kĩ thuật số."
        },
        "correctAnswer": "A",
        "explanation": "Trích nguyên văn đáp án sách (trang 177): 'Phương án A không phải là hạn chế của mọi hình thức giao tiếp, ví dụ khi gọi video call (hội nghị truyền hình) người tham gia vẫn có thể nhìn thấy hình ảnh và cử chỉ nét mặt của đối phương.'"
      },
      {
        "id": "12d-q3",
        "question": "Câu 3. Hành động nào sau đây khó thực hiện được đầy đủ nhất khi ứng xử nhân văn trong không gian mạng?",
        "options": {
          "A": "Chia sẻ, đồng cảm với những hoàn cảnh khó khăn.",
          "B": "Ứng xử có văn hoá, thể hiện tính nhân văn khi giao tiếp.",
          "C": "Ủng hộ người làm việc tốt và tham gia làm việc tốt đó.",
          "D": "Phê phán và phản đối những việc xấu, người xấu."
        },
        "correctAnswer": "D",
        "explanation": "Trích nguyên văn đáp án sách (trang 177): 'D. Việc phê phán và phản đối những việc xấu, người xấu trên không gian mạng là khó thực hiện đầy đủ nhất vì dễ dẫn đến tranh cãi gay gắt, bị tấn công mạng ngược lại hoặc thiếu thông tin khách quan toàn diện để đánh giá đúng bản chất sự việc.'"
      },
      {
        "id": "12d-q4",
        "question": "Câu 4. Đặc điểm nào sau đây của giao tiếp trong không gian mạng thể hiện rõ nhất ưu điểm tiết kiệm thời gian, công sức và chi phí?",
        "options": {
          "A": "Tạo điều kiện thuận lợi cho việc lưu trữ nội dung trò chuyện.",
          "B": "Không cần di chuyển đến cùng một nơi để tham gia.",
          "C": "Các công cụ giao tiếp đa dạng miễn sao có kết nối mạng.",
          "D": "Nhiều người có thể tham gia ở các thời điểm khác nhau."
        },
        "correctAnswer": "B",
        "explanation": "Trích nguyên văn đáp án sách (trang 177): 'B. Không cần phải di chuyển đến cùng một địa điểm giúp người tham gia tiết kiệm tối đa thời gian đi lại, chi phí phương tiện và chi phí sinh hoạt phát sinh.'"
      }
    ],
    "application": {
      "realLife": "Khi đọc một bài viết bóc phốt hoặc thông tin giật gân chưa được báo chí chính thống xác nhận, em không nên vội vã nhấn like, share hay bình luận chỉ trích. Hãy kiểm tra nguồn tin, tìm kiếm thông tin đối chứng trên các trang báo điện tử chính thống của Nhà nước.",
      "examTraps": [
        "Bẫy 1: Nghĩ rằng giao tiếp qua mạng luôn giúp nâng cao kĩ năng nói và nghe (Sai, nhắn tin quá nhiều thực tế làm giảm phản xạ giao tiếp đời thực).",
        "Bẫy 2: Nhầm lẫn giữa quyền tự do ngôn luận với hành vi bôi nhọ, xúc phạm danh dự người khác (Mọi lời xúc phạm đều vi phạm Luật An ninh mạng)."
      ],
      "tips": [
        "Học thuộc 4 ưu điểm: Mọi lúc mọi nơi; Mở rộng kết nối; Tiết kiệm thời gian/chi phí; Có thể hỗ trợ người nhút nhát.",
        "Nắm vững 5 hạn chế: Thiếu ngôn ngữ cơ thể; Giảm hiệu quả do viết tắt; Nghiện mạng; Nguy cơ bảo mật; Phụ thuộc công nghệ."
      ]
    },
    "requirements": [
      "Phân tích được ưu và nhược điểm về giao tiếp trong thế giới ảo qua các ví dụ cụ thể.",
      "Phân tích được tính nhân văn trong ứng xử ở một số tình huống tham gia thế giới ảo.",
      "Nêu được một số tác động tiêu cực của công nghệ kĩ thuật số đối với đời sống con người.",
      "Nhận diện được các hành vi vi phạm pháp luật khi hoạt động trong môi trường số."
    ],
    "keyConcepts": [
      {
        "term": "Ưu điểm giao tiếp số",
        "definition": "Mọi lúc mọi nơi, mở rộng kết nối xã hội, tiết kiệm chi phí, hỗ trợ người khiếm khuyết/nhút nhát trao đổi.",
        "example": "Họp trực tuyến qua Google Meet tiết kiệm hàng triệu đồng vé máy bay."
      },
      {
        "term": "Hạn chế giao tiếp số",
        "definition": "Thiếu cảm xúc phi ngôn ngữ, viết tắt bừa bãi làm sai lệch ngữ pháp, nguy cơ nghiện Internet và mất an toàn dữ liệu.",
        "example": "Hiểu lầm ý bạn bè khi đọc tin nhắn không có ngữ điệu."
      },
      {
        "term": "Ứng xử nhân văn",
        "definition": "Tôn trọng người khác, lan toả điều tích cực, bảo vệ lẽ phải, lên án cái xấu bằng biện pháp văn minh.",
        "example": "Ủng hộ quỹ vaccine hoặc quyên góp cứu trợ bão lũ qua ứng dụng ngân hàng."
      }
    ],
    "theorySections": [
      {
        "title": "1. Ưu điểm nổi bật của giao tiếp trực tuyến",
        "content": "– Thực hiện linh hoạt mọi lúc mọi nơi.\n– Mở rộng mạng lưới quan hệ quốc tế.\n– Tiết kiệm chi phí đi lại và sinh hoạt."
      },
      {
        "title": "2. Mặt trái và quy định pháp luật cần nhớ",
        "content": "– Luật An ninh mạng xử phạt nghiêm khắc hành vi tung tin giả, bôi nhọ người khác.\n– Cần bảo mật mật khẩu và hạn chế chia sẻ dữ liệu nhạy cảm."
      }
    ],
    "practicalTips": [
      "Nhớ câu hỏi bẫy: Giao tiếp mạng KHÔNG PHẢI luôn cải thiện kĩ năng giao tiếp trực tiếp.",
      "Ưu điểm tiết kiệm chi phí thể hiện rõ nhất ở việc: Không cần di chuyển đến cùng một nơi."
    ],
    "commonPitfalls": [
      "Nghĩ rằng không gian mạng là vô danh nên không bị pháp luật điều chỉnh.",
      "Nhầm lẫn giữa phê phán hành vi xấu với việc bạo lực mạng nhục mạ cá nhân."
    ]
  },
  "12F": {
    "id": "12F",
    "code": "Chủ đề 12F",
    "title": "Tạo trang web với HTML và CSS",
    "grade": "12",
    "track": "ALL",
    "examWeight": "Trọng tâm Lớp 12 (~20% lệnh hỏi)",
    "iconName": "code",
    "summary": "Nắm vững cấu trúc trang web HTML5, các thẻ định dạng văn bản, danh sách, bảng, siêu liên kết, biểu mẫu form, đa phương tiện video/audio/iframe và mô hình hộp CSS Box Model, quy tắc bộ chọn (Selector).",
    "outline": [
      {
        "id": "muc-tieu",
        "title": "Mục tiêu bài học",
        "level": 1
      },
      {
        "id": "muc-do",
        "title": "Mức độ kiến thức và kĩ năng cần đạt",
        "level": 1
      },
      {
        "id": "khoi-dong",
        "title": "Hoạt động khởi động",
        "level": 1
      },
      {
        "id": "sec-1",
        "title": "1. Ngôn ngữ đánh dấu siêu văn bản HTML",
        "level": 1
      },
      {
        "id": "sec-1-1",
        "title": "a) Cấu trúc tài liệu HTML5 và các phần tử cơ bản",
        "level": 2
      },
      {
        "id": "sec-1-2",
        "title": "b) Định dạng văn bản, danh sách và bảng trong HTML",
        "level": 2
      },
      {
        "id": "sec-2",
        "title": "2. Siêu liên kết, đa phương tiện và biểu mẫu (Form)",
        "level": 1
      },
      {
        "id": "sec-2-a",
        "title": "a) Siêu liên kết và nhúng hình ảnh, âm thanh, video",
        "level": 2
      },
      {
        "id": "sec-2-b",
        "title": "b) Xây dựng biểu mẫu nhập dữ liệu (Form)",
        "level": 2
      },
      {
        "id": "sec-3",
        "title": "3. Định kiểu trang web với CSS",
        "level": 1
      },
      {
        "id": "sec-3-a",
        "title": "a) Cách chèn CSS và độ ưu tiên bộ chọn (Selector)",
        "level": 2
      },
      {
        "id": "sec-3-b",
        "title": "b) Mô hình hộp (CSS Box Model)",
        "level": 2
      },
      {
        "id": "ghi-nho",
        "title": "Ghi nhớ",
        "level": 1
      },
      {
        "id": "luyen-tap",
        "title": "Luyện tập (Trắc nghiệm chuẩn sách)",
        "level": 1
      },
      {
        "id": "van-dung",
        "title": "Vận dụng",
        "level": 1
      }
    ],
    "objectives": [
      "Hiểu và trình bày được cấu trúc chuẩn của tài liệu HTML5: <!DOCTYPE html>, <html>, <head>, <title>, <body>.",
      "Sử dụng thành thạo các thẻ định dạng văn bản: <h1>-<h6>, <p>, <strong>, <em>, <u>, <br>, <hr>.",
      "Thiết lập được bảng dữ liệu với thẻ <table>, <tr>, <td>, <th> và danh sách có thứ tự <ol>, không thứ tự <ul>.",
      "Tạo siêu liên kết với thẻ <a> và thuộc tính href; nhúng hình ảnh <img>, tệp âm thanh <audio>, tệp video <video>.",
      "Thiết kế biểu mẫu <form> gồm các trường <input> (text, password, radio, checkbox), <select>, <textarea>, <button>.",
      "Áp dụng CSS: 3 phương thức chèn CSS, quy tắc tính độ ưu tiên (Specificity), và mô hình hộp Box Model (margin, border, padding, content)."
    ],
    "standards": [
      {
        "level": "Nhận biết",
        "desc": "Nhận biết các thẻ HTML cơ bản; thuộc tính src trong thẻ <img>, href trong thẻ <a>; cấu tạo 4 lớp của CSS Box Model."
      },
      {
        "level": "Thông hiểu",
        "desc": "Phân biệt được thẻ khối (block-level) và thẻ nội dòng (inline); hiểu độ ưu tiên của các loại CSS selector (#id, .class, element); phân biệt được method GET và POST trong thẻ <form>."
      },
      {
        "level": "Vận dụng",
        "desc": "Viết mã HTML/CSS hoàn chỉnh cho một trang web giới thiệu cá nhân có biểu mẫu liên hệ, danh mục và video giới thiệu."
      }
    ],
    "warmUp": {
      "context": "Khi nhấp chuột phải vào bất kì trang web nào trên trình duyệt và chọn 'Kiểm tra' (Inspect) hoặc 'Xem nguồn trang' (View Page Source), em sẽ thấy hàng ngàn dòng mã văn bản có các dấu ngoặc nhọn < >.",
      "question": "Những thẻ < > đó là gì? Làm thế nào trình duyệt có thể biến những đoạn mã đánh dấu thành giao diện đẹp mắt với hình ảnh, màu sắc và video sống động?"
    },
    "mainSections": [
      {
        "id": "sec-1",
        "number": "1.",
        "title": "Ngôn ngữ đánh dấu siêu văn bản HTML",
        "content": "HTML (HyperText Markup Language) là ngôn ngữ đánh dấu chuẩn để xây dựng cấu trúc của các trang web trên Internet.\nMột phần tử HTML gồm thẻ mở <tên_thẻ thuộc_tính='giá_trị'>, nội dung và thẻ đóng </tên_thẻ>. Một số thẻ đơn không cần thẻ đóng như <br>, <hr>, <img>, <input>.",
        "subSections": [
          {
            "id": "sec-1-1",
            "letter": "a)",
            "title": "Cấu trúc tài liệu HTML5 chuẩn",
            "content": "Mọi trang web chuẩn HTML5 đều có khung sườn bắt buộc:\n• <!DOCTYPE html>: Khai báo phiên bản HTML5 cho trình duyệt.\n• <html lang='vi'>: Phần tử gốc chứa toàn bộ nội dung tài liệu web.\n• <head>: Chứa siêu dữ liệu (metadata), tiêu đề trang <title>, liên kết tệp CSS <link> và bộ mã kí tự <meta charset='UTF-8'>. Phần này không hiển thị trực tiếp trong thân trang.\n• <body>: Chứa toàn bộ nội dung hiển thị cho người xem (tiêu đề, hình ảnh, văn bản, video).",
            "codeSnippet": "<!DOCTYPE html>\n<html lang=\\\"vi\\\">\n  <head>\n    <meta charset=\\\"UTF-8\\\">\n    <title>Trang web đầu tiên của tôi</title>\n    <link rel=\\\"stylesheet\\\" href=\\\"style.css\\\">\n  </head>\n  <body>\n    <h1>Xin chào các bạn!</h1>\n    <p>Chào mừng bạn đến với TinPath.</p>\n  </body>\n</html>"
          },
          {
            "id": "sec-1-2",
            "letter": "b)",
            "title": "Định dạng văn bản, danh sách và bảng trong HTML",
            "content": "• Tiêu đề (Headings): Từ <h1> (lớn nhất) đến <h6> (nhỏ nhất).\n• Đoạn văn bản: Thẻ <p>. In đậm: <strong> hoặc <b>. In nghiêng: <em> hoặc <i>. Xuống dòng: <br>. Đường kẻ ngang phân cách: <hr>.\n• Danh sách: Có thứ tự <ol type='1' start='1'> và Không thứ tự <ul type='disc'>. Mỗi mục trong danh sách bắt đầu bằng thẻ <li>.\n• Bảng dữ liệu (Table): Khai báo bằng <table>. Mỗi hàng là <tr> (Table Row). Ô tiêu đề cột in đậm canh giữa là <th> (Table Header). Ô dữ liệu thông thường là <td> (Table Data). Thuộc tính rowspan gộp hàng, colspan gộp cột.",
            "codeSnippet": "<table border=\\\"1\\\">\n  <tr>\n    <th>Họ và tên</th>\n    <th>Điểm Tin</th>\n  </tr>\n  <tr>\n    <td>Nguyễn Văn An</td>\n    <td>9.5</td>\n  </tr>\n</table>"
          }
        ]
      },
      {
        "id": "sec-2",
        "number": "2.",
        "title": "Siêu liên kết, đa phương tiện và biểu mẫu (Form)",
        "content": "Siêu liên kết giúp kết nối các tài nguyên web; đa phương tiện làm trang web hấp dẫn; biểu mẫu form cho phép người dùng gửi dữ liệu tương tác lên máy chủ.",
        "subSections": [
          {
            "id": "sec-2-a",
            "letter": "a)",
            "title": "Siêu liên kết và nhúng đa phương tiện",
            "content": "• Siêu liên kết: Dùng thẻ <a> với thuộc tính href chỉ định URL đích. Thuộc tính target='_blank' giúp mở liên kết trong tab mới.\n• Chèn ảnh: Thẻ đơn <img> với thuộc tính bắt buộc src='đường_dẫn' và alt='mô tả ảnh' khi ảnh bị lỗi.\n• Chèn âm thanh và video: Thẻ <audio controls> và <video controls width='640'> với thẻ con <source src='...' type='video/mp4'>.\n• Khung nội tuyến <iframe>: Nhúng tài liệu hoặc video từ trang web khác (ví dụ: Google Maps, video YouTube).",
            "codeSnippet": "<a href=\\\"https://moet.gov.vn\\\" target=\\\"_blank\\\">Cổng thông tin Bộ GD&ĐT</a>\n<img src=\\\"logo.png\\\" alt=\\\"Logo TinPath\\\" width=\\\"120\\\">\n<video controls width=\\\"400\\\">\n  <source src=\\\"baihoc.mp4\\\" type=\\\"video/mp4\\\">\n</video>"
          },
          {
            "id": "sec-2-b",
            "letter": "b)",
            "title": "Xây dựng biểu mẫu nhập dữ liệu (Form)",
            "content": "Thẻ <form action='xuly.php' method='POST'> chứa các phần tử nhập dữ liệu:\n• <input type='text'>: Ô nhập một dòng chữ.\n• <input type='password'>: Ô nhập mật khẩu (che dấu chấm).\n• <input type='radio' name='gender'>: Nút chọn hình tròn (trong cùng name chỉ chọn được 1 phương án duy nhất).\n• <input type='checkbox'>: Ô kiểm vuông cho phép chọn nhiều phương án.\n• <select> cùng các thẻ con <option>: Danh sách chọn thả xuống (dropdown).\n• <textarea rows='4' cols='50'>: Ô nhập văn bản nhiều dòng.\n• <button type='submit'> hoặc <input type='submit'>: Nút gửi dữ liệu lên máy chủ."
          }
        ]
      },
      {
        "id": "sec-3",
        "number": "3.",
        "title": "Định kiểu trang web với CSS",
        "content": "CSS (Cascading Style Sheets) quy định màu sắc, kích thước, font chữ và bố cục hiển thị của trang web.",
        "subSections": [
          {
            "id": "sec-3-a",
            "letter": "a)",
            "title": "Cách chèn CSS và độ ưu tiên bộ chọn (Selector)",
            "content": "• 3 cách chèn CSS:\n1. Inline CSS: Viết trực tiếp trong thuộc tính style của thẻ (ví dụ: <p style='color: red;'>).\n2. Internal CSS: Viết trong khối thẻ <style> đặt bên trong phần tử <head>.\n3. External CSS (Khuyến nghị): Viết trong tệp .css riêng biệt và liên kết qua thẻ <link rel='stylesheet' href='style.css'>.\n• Độ ưu tiên bộ chọn (Specificity):\n!important (Cao nhất) > Inline style > ID selector (#id) > Class selector (.class) > Element selector (tên thẻ p, h1, div). Nếu cùng cấp độ ưu tiên, quy tắc viết sau sẽ ghi đè quy tắc viết trước."
          },
          {
            "id": "sec-3-b",
            "letter": "b)",
            "title": "Mô hình hộp (CSS Box Model)",
            "content": "Mọi phần tử HTML hiển thị trên trang web đều được xem như một chiếc hộp hình chữ nhật, gồm 4 lớp từ trong ra ngoài:\n1. Content (Nội dung): Vùng chứa văn bản hoặc hình ảnh thực tế (xác định bởi thuộc tính width và height).\n2. Padding (Vùng đệm): Khoảng cách trong suốt ngăn cách giữa Content và Border.\n3. Border (Đường viền): Đường bao quanh bọc lấy padding và content.\n4. Margin (Lề ngoài): Khoảng cách trống bên ngoài đường viền, ngăn cách phần tử với các phần tử lân cận xung quanh.",
            "codeSnippet": ".box {\n  width: 300px;\n  padding: 15px;\n  border: 2px solid #2878C8;\n  margin: 20px auto;\n}"
          }
        ]
      }
    ],
    "memoryNotes": [
      "Phần tử <title> nằm trong <head>, quyết định tên hiển thị trên thanh tiêu đề trình duyệt.",
      "<img>, <input>, <br>, <hr> là các thẻ rỗng (không cần thẻ đóng).",
      "Thẻ <a> dùng thuộc tính href; thẻ <img> dùng thuộc tính src và alt.",
      "Mô hình hộp Box Model từ trong ra ngoài: Content -> Padding -> Border -> Margin.",
      "Độ ưu tiên CSS: !important > ID (#) > Class (.) > Tag name."
    ],
    "practiceQuestions": [
      {
        "id": "12f-q1",
        "question": "Câu 1. Phần tử nào trong tài liệu HTML chứa các thông tin mô tả siêu dữ liệu (metadata) của trang web?",
        "options": {
          "A": "<body>",
          "B": "<h1>",
          "C": "<head>",
          "D": "<title>"
        },
        "correctAnswer": "C",
        "explanation": "Trích nguyên văn đáp án sách Hướng dẫn ôn thi tốt nghiệp môn Tin học (trang 173): 'C. Phần tử <head> chứa các thông tin siêu dữ liệu (metadata) của trang web, tệp CSS liên kết, bộ mã kí tự và tiêu đề trang web.'"
      },
      {
        "id": "12f-q2",
        "question": "Câu 2. Trong các phần mềm sau đây, phần mềm nào KHÔNG dùng để soạn thảo mã HTML?",
        "options": {
          "A": "Notepad.",
          "B": "Visual Studio Code.",
          "C": "Sublime Text.",
          "D": "Google Chrome."
        },
        "correctAnswer": "D",
        "explanation": "Trích nguyên văn đáp án sách (trang 174): 'D. Phương án D đúng vì Google Chrome là trình duyệt web dùng để hiển thị và biên dịch trang web, không phải là phần mềm soạn thảo mã nguồn.'"
      },
      {
        "id": "12f-q3",
        "question": "Câu 3. Thuộc tính nào trong thẻ <a> được dùng để xác định địa chỉ URL của trang web cần liên kết tới?",
        "options": {
          "A": "src",
          "B": "href",
          "C": "link",
          "D": "url"
        },
        "correctAnswer": "B",
        "explanation": "Trích nguyên văn đáp án sách (trang 174): 'B. Thuộc tính href (Hypertext Reference) trong thẻ <a> chỉ định địa chỉ URL của siêu liên kết. Thẻ <link> dùng để liên kết tệp CSS, không có thẻ <url>.'"
      },
      {
        "id": "12f-q4",
        "question": "Câu 4. Trong mô hình hộp CSS Box Model, lớp nào nằm ngay bên ngoài đường viền (Border) để tạo khoảng cách với các phần tử xung quanh?",
        "options": {
          "A": "Padding",
          "B": "Content",
          "C": "Margin",
          "D": "Outline"
        },
        "correctAnswer": "C",
        "explanation": "Trích nguyên văn đáp án sách (trang 174): 'C. Margin (lề ngoài) là khoảng cách nằm ngoài cùng bọc quanh đường viền border, dùng để ngăn cách giữa các phần tử với nhau.'"
      },
      {
        "id": "12f-q5",
        "question": "Câu 5. Trong CSS, bộ chọn nào sau đây có độ ưu tiên cao nhất khi cùng tác động lên một phần tử?",
        "options": {
          "A": "Bộ chọn tên thẻ (Element selector: p, h1)",
          "B": "Bộ chọn lớp (Class selector: .highlight)",
          "C": "Bộ chọn định danh (ID selector: #header)",
          "D": "Bộ chọn nhóm (Grouping selector: h1, h2)"
        },
        "correctAnswer": "C",
        "explanation": "Trích nguyên văn đáp án sách (trang 174): 'C. Bộ chọn ID (#) có độ ưu tiên cao hơn Class (.), và Class có độ ưu tiên cao hơn tên thẻ HTML thông thường.'"
      }
    ],
    "application": {
      "realLife": "Khi thiết kế nút bấm trên website, luôn đặt padding đủ lớn (ví dụ: padding: 12px 24px) để người dùng trên điện thoại cảm ứng dễ dàng chạm trúng mà không bị bấm nhầm.",
      "examTraps": [
        "Bẫy 1: Nhầm lẫn giữa thuộc tính src (dùng cho <img>, <script>, <iframe>) và href (dùng cho <a>, <link>).",
        "Bẫy 2: Nhầm padding là khoảng cách bên ngoài viền (Sai, Padding ở bên trong viền, Margin mới ở ngoài viền!).",
        "Bẫy 3: Cho rằng <input type='radio'> cho phép chọn nhiều phương án (Sai, radio chỉ chọn 1, checkbox mới chọn nhiều)."
      ],
      "tips": [
        "Ghi nhớ cấu trúc Box Model: Trong cùng là Content -> Kế tiếp là Padding -> Đến Border -> Ngoài cùng là Margin.",
        "Thẻ <h1> chỉ nên xuất hiện 1 lần duy nhất trên mỗi trang web để tối ưu SEO."
      ]
    },
    "requirements": [
      "Hiểu cấu trúc tài liệu HTML5: <!DOCTYPE html>, <html>, <head>, <title>, <body>.",
      "Sử dụng các thẻ định dạng: <h1>-<h6>, <p>, <strong>, <em>, <u>.",
      "Tạo siêu liên kết với thẻ <a> và thuộc tính href.",
      "Tạo bảng <table>, <tr>, <td>, <th>, <caption>.",
      "Tạo danh sách có thứ tự <ol> và không thứ tự <ul>.",
      "Chèn đa phương tiện: <img>, <audio>, <video>, <iframe>.",
      "Xây dựng biểu mẫu <form>: <input>, <textarea>, <select>, <button>.",
      "Áp dụng CSS: Box Model (content, padding, border, margin), CSS Selectors."
    ],
    "keyConcepts": [
      {
        "term": "Thẻ rỗng (Void elements)",
        "definition": "Những thẻ không có nội dung và không có thẻ đóng như <img>, <input>, <br>, <hr>.",
        "example": "<img src='anh.jpg' alt='minh hoa'>"
      },
      {
        "term": "CSS Box Model",
        "definition": "Gồm 4 thành phần: Content (nội dung), Padding (đệm trong), Border (đường viền), Margin (lề ngoài).",
        "example": "padding: 10px; margin: 20px;"
      }
    ],
    "theorySections": [
      {
        "title": "1. Các thẻ định dạng cấu trúc",
        "content": "• <h1>-<h6>: Tiêu đề\n• <p>: Đoạn văn\n• <a>: Siêu liên kết\n• <img>: Chèn ảnh"
      }
    ],
    "practicalTips": [
      "Nhớ quy tắc Box Model: Content -> Padding -> Border -> Margin."
    ],
    "commonPitfalls": [
      "Nhầm src với href."
    ]
  },
  "12G": {
    "id": "12G",
    "code": "Chủ đề 12G",
    "title": "Nhóm nghề Dịch vụ và Quản trị Mạng",
    "grade": "12",
    "track": "ALL",
    "examWeight": "Trọng tâm Lớp 12 (~10% lệnh hỏi)",
    "iconName": "briefcase",
    "summary": "Tìm hiểu chi tiết các nghề nghiệp cốt lõi trong thời đại số: Nghề Sửa chữa và bảo trì máy tính; Nghề Quản trị mạng và hệ thống; Nghề Bảo mật hệ thống thông tin. Nhu cầu nhân lực và định hướng đào tạo tương lai.",
    "outline": [
      {
        "id": "muc-tieu",
        "title": "Mục tiêu bài học",
        "level": 1
      },
      {
        "id": "muc-do",
        "title": "Mức độ kiến thức và kĩ năng cần đạt",
        "level": 1
      },
      {
        "id": "khoi-dong",
        "title": "Hoạt động khởi động",
        "level": 1
      },
      {
        "id": "sec-1",
        "title": "1. Nghề Sửa chữa và bảo trì máy tính",
        "level": 1
      },
      {
        "id": "sec-2",
        "title": "2. Nghề Quản trị mạng và hệ thống",
        "level": 1
      },
      {
        "id": "sec-3",
        "title": "3. Nghề Bảo mật hệ thống thông tin",
        "level": 1
      },
      {
        "id": "ghi-nho",
        "title": "Ghi nhớ",
        "level": 1
      },
      {
        "id": "luyen-tap",
        "title": "Luyện tập (Trắc nghiệm chuẩn sách)",
        "level": 1
      },
      {
        "id": "van-dung",
        "title": "Vận dụng",
        "level": 1
      }
    ],
    "objectives": [
      "Trình bày được đặc điểm, công việc chính của nghề Sửa chữa và bảo trì máy tính.",
      "Mô tả được vai trò, nhiệm vụ và yêu cầu chuyên môn của nghề Quản trị mạng và hệ thống.",
      "Phân tích được tầm quan trọng và nhu cầu nhân lực cấp thiết của nghề Bảo mật hệ thống thông tin.",
      "Nắm được các bậc học và định hướng nghề nghiệp tiếp theo sau khi tốt nghiệp THPT."
    ],
    "standards": [
      {
        "level": "Nhận biết",
        "desc": "Nêu được tên gọi các nghề trong nhóm dịch vụ CNTT; nhận biết công việc bảo trì phần cứng và cài đặt phần mềm."
      },
      {
        "level": "Thông hiểu",
        "desc": "Phân biệt được sự khác nhau giữa kĩ thuật viên sửa chữa máy tính với kĩ sư quản trị hệ thống mạng; hiểu vai trò của an toàn thông tin."
      },
      {
        "level": "Vận dụng",
        "desc": "Lựa chọn định hướng ngành học phù hợp với năng lực bản thân tại các trường cao đẳng, đại học kĩ thuật."
      }
    ],
    "warmUp": {
      "context": "Một công ty bất ngờ bị ngắt kết nối Internet toàn bộ trụ sở và nghi ngờ máy chủ cơ sở dữ liệu khách hàng bị tấn công mạng xâm nhập.",
      "question": "Những nhân sự thuộc chuyên môn nào trong công ty sẽ chịu trách nhiệm khắc phục sự cố này? Yêu cầu công việc của họ là gì?"
    },
    "mainSections": [
      {
        "id": "sec-1",
        "number": "1.",
        "title": "Nghề Sửa chữa và bảo trì máy tính",
        "content": "• Công việc chính: Kiểm tra, chẩn đoán sự cố phần cứng (RAM, ổ cứng, nguồn, bo mạch chủ), vệ sinh máy tính; cài đặt và cập nhật hệ điều hành, trình điều khiển (driver) và các phần mềm ứng dụng thông dụng; tối ưu hoá cấu hình hệ thống.\n• Yêu cầu: Hiểu sâu về cấu trúc máy tính, có kĩ năng thao tác cẩn thận, tỉ mỉ và kĩ năng giao tiếp, tư vấn hỗ trợ khách hàng. Không nhất thiết phải biết lập trình phần mềm."
      },
      {
        "id": "sec-2",
        "number": "2.",
        "title": "Nghề Quản trị mạng và hệ thống",
        "content": "• Công việc chính: Thiết kế, lắp đặt, cấu hình các thiết bị mạng (Switch, Router, Firewall, Server); quản lí tài khoản người dùng, phân quyền truy cập tài nguyên; giám sát lưu lượng và hiệu năng mạng, sao lưu dữ liệu dự phòng và xử lí sự cố mạng 24/7.\n• Yêu cầu: Nắm vững các mô hình mạng OSI, bộ giao thức TCP/IP, hệ điều hành mạng (Windows Server, Linux), kiến thức định tuyến, chuyển mạch và chứng chỉ nghề nghiệp quốc tế (CCNA, MCSA). Cần được đào tạo bài bản ở bậc đại học hoặc cao đẳng."
      },
      {
        "id": "sec-3",
        "number": "3.",
        "title": "Nghề Bảo mật hệ thống thông tin",
        "content": "• Tầm quan trọng: Trong kỉ nguyên chuyển đổi số, dữ liệu là tài sản quý giá nhất của tổ chức. Năm 2023 tại Việt Nam ghi nhận gần 14.000 vụ tấn công mạng vào các cơ quan, ngân hàng và doanh nghiệp.\n• Công việc chính: Đánh giá lỗ hổng bảo mật, thiết lập tường lửa (Firewall), triển khai các hệ thống phát hiện và ngăn chặn xâm nhập (IDS/IPS), phòng chống mã độc, xử lí khủng hoảng khi bị rò rỉ dữ liệu hoặc tống tiền bằng ransomware.\n• Nhu cầu nhân lực: Đang thiếu hụt trầm trọng với mức thu nhập hàng đầu trong ngành công nghệ thông tin."
      }
    ],
    "memoryNotes": [
      "Nghề Sửa chữa bảo trì máy tính KHÔNG bắt buộc phải biết lập trình.",
      "Quản trị mạng yêu cầu cấu hình thiết bị (Switch, Router) và phân quyền hệ thống.",
      "Bảo mật thông tin là nghề then chốt bảo vệ an toàn quốc gia và tài sản số của doanh nghiệp."
    ],
    "practiceQuestions": [
      {
        "id": "12g-q1",
        "question": "Câu 1. Phát biểu nào sau đây mô tả đúng về nghề Sửa chữa và bảo trì máy tính?",
        "options": {
          "A": "Yêu cầu phải biết lập trình.",
          "B": "Không đòi hỏi kĩ năng giao tiếp.",
          "C": "Yêu cầu phải biết điều chỉnh, tối ưu hoá các thông số cấu hình cho hệ điều hành và các phần mềm ứng dụng.",
          "D": "Yêu cầu phải biết sử dụng thành thạo tất cả những phần mềm ứng dụng thường gặp trên máy tính của người dùng."
        },
        "correctAnswer": "C",
        "explanation": "Trích nguyên văn đáp án sách Hướng dẫn ôn thi tốt nghiệp môn Tin học (trang 178): 'C. Người làm nghề sửa chữa và bảo trì máy tính cần nắm vững cách cài đặt, điều chỉnh và tối ưu hoá các thông số cấu hình của hệ điều hành và phần mềm. Phương án A sai vì nghề này không đòi hỏi phải biết lập trình.'"
      },
      {
        "id": "12g-q2",
        "question": "Câu 2. Phát biểu nào sau đây mô tả đúng về nghề Quản trị mạng và hệ thống?",
        "options": {
          "A": "Kĩ thuật viên công nghệ thông tin là người phụ trách công việc Quản trị mạng và hệ thống.",
          "B": "Người Quản trị mạng và hệ thống nhất thiết phải lập trình thành thạo.",
          "C": "Để trở thành người Quản trị mạng và hệ thống cần phải được đào tạo một cách bài bản ở các bậc học tiếp theo.",
          "D": "Trong các văn bản pháp luật, không có nội dung nào liên quan đến công việc của người Quản trị mạng và hệ thống."
        },
        "correctAnswer": "C",
        "explanation": "Trích nguyên văn đáp án sách (trang 178): 'C. Để trở thành người Quản trị mạng và hệ thống cần có kiến thức chuyên sâu về hạ tầng mạng, giao thức và hệ điều hành mạng nên bắt buộc phải được đào tạo bài bản ở bậc cao đẳng, đại học.'"
      },
      {
        "id": "12g-q3",
        "question": "Câu 3. Phát biểu nào sau đây mô tả SAI về nghề Bảo mật hệ thống thông tin?",
        "options": {
          "A": "Nhu cầu nhân lực trong hiện tại và tương lai gần rất cao.",
          "B": "Nghề này chỉ làm việc khi hệ thống máy tính đã bị tin tặc tấn công thành công.",
          "C": "Có nhiệm vụ giám sát, phòng ngừa và ngăn chặn các cuộc tấn công mạng.",
          "D": "Được đào tạo qua các chuyên ngành như An toàn thông tin, An ninh mạng."
        },
        "correctAnswer": "B",
        "explanation": "Trích nguyên văn đáp án sách (trang 178): 'B. Phát biểu B sai vì chuyên viên bảo mật phải chủ động giám sát, rà soát lỗ hổng và triển khai biện pháp phòng vệ liên tục trước khi bị tấn công, chứ không phải đợi đến khi bị tấn công mới làm việc.'"
      }
    ],
    "application": {
      "realLife": "Học sinh yêu thích phần cứng và mạng máy tính có thể định hướng thi vào các ngành: An toàn thông tin, Kĩ thuật Mạng máy tính và Truyền thông, Khoa học máy tính tại các trường đại học.",
      "examTraps": [
        "Bẫy 1: Nghĩ rằng thợ sửa máy tính bắt buộc phải biết viết code lập trình (Sai, chủ yếu là kiến thức phần cứng và hệ điều hành).",
        "Bẫy 2: Cho rằng an ninh mạng chỉ là cài phần mềm diệt virus cá nhân."
      ],
      "tips": [
        "Nhớ rõ sự phân biệt: Sửa chữa phần cứng (Bảo trì) < Quản lý hệ thống máy chủ/mạng (Quản trị) < Phòng chống tấn công mã độc (Bảo mật)."
      ]
    },
    "requirements": [
      "Trình bày được đặc điểm nghề Sửa chữa và bảo trì máy tính.",
      "Mô tả được nghề Quản trị mạng và hệ thống.",
      "Nêu được vai trò nghề Bảo mật hệ thống thông tin."
    ],
    "keyConcepts": [
      {
        "term": "Quản trị mạng",
        "definition": "Vận hành, cấu hình, cấp quyền tài nguyên và xử lý sự cố kết nối trong mạng cơ quan.",
        "example": "Cấu hình VLAN trên Switch trường học."
      }
    ],
    "theorySections": [
      {
        "title": "1. Các ngành nghề tiêu biểu",
        "content": "• Sửa chữa bảo trì máy tính\n• Quản trị mạng và hệ thống\n• An toàn thông tin"
      }
    ],
    "practicalTips": [
      "Thuộc nhiệm vụ cốt lõi từng nghề."
    ],
    "commonPitfalls": [
      "Nhầm bảo trì máy tính với lập trình viên."
    ]
  },
  "11F": {
    "id": "11F",
    "code": "Chủ đề 11F",
    "title": "Giới thiệu các Hệ Cơ sở Dữ liệu & SQL",
    "grade": "11",
    "track": "ALL",
    "examWeight": "Cốt lõi Lớp 11 (~15% lệnh hỏi)",
    "iconName": "database",
    "summary": "Nắm vững khái niệm cơ sở dữ liệu (CSDL), hệ quản trị CSDL (DBMS), mô hình quan hệ, khoá chính, khoá ngoại, liên kết bảng và các câu lệnh truy vấn dữ liệu SQL tiêu chuẩn (SELECT, FROM, WHERE, ORDER BY, GROUP BY, HAVING, COUNT).",
    "outline": [
      {
        "id": "muc-tieu",
        "title": "Mục tiêu bài học",
        "level": 1
      },
      {
        "id": "muc-do",
        "title": "Mức độ kiến thức và kĩ năng cần đạt",
        "level": 1
      },
      {
        "id": "khoi-dong",
        "title": "Hoạt động khởi động",
        "level": 1
      },
      {
        "id": "sec-1",
        "title": "1. Khái niệm CSDL và Hệ quản trị CSDL (DBMS)",
        "level": 1
      },
      {
        "id": "sec-2",
        "title": "2. Mô hình CSDL quan hệ, Khoá chính và Khoá ngoại",
        "level": 1
      },
      {
        "id": "sec-3",
        "title": "3. Ngôn ngữ truy vấn có cấu trúc SQL",
        "level": 1
      },
      {
        "id": "ghi-nho",
        "title": "Ghi nhớ",
        "level": 1
      },
      {
        "id": "luyen-tap",
        "title": "Luyện tập (Trắc nghiệm chuẩn sách)",
        "level": 1
      },
      {
        "id": "van-dung",
        "title": "Vận dụng",
        "level": 1
      }
    ],
    "objectives": [
      "Phân biệt được dữ liệu, cơ sở dữ liệu (CSDL) và hệ quản trị cơ sở dữ liệu (DBMS).",
      "Hiểu và chỉ ra được các thành phần của mô hình CSDL quan hệ: bảng (quan hệ), hàng (bản ghi), cột (thuộc tính), trường dữ liệu.",
      "Xác định được vai trò của Khoá chính (Primary Key) và Khoá ngoại (Foreign Key) trong việc liên kết các bảng.",
      "Viết và đọc hiểu các câu lệnh truy vấn SQL cơ bản: SELECT, FROM, WHERE, ORDER BY, GROUP BY, HAVING, COUNT, SUM, AVG."
    ],
    "standards": [
      {
        "level": "Nhận biết",
        "desc": "Nêu được khái niệm CSDL và ví dụ về DBMS (MySQL, SQL Server, Access); nhận biết cú pháp SELECT FROM WHERE."
      },
      {
        "level": "Thông hiểu",
        "desc": "Giải thích được tính toàn vẹn dữ liệu nhờ khoá chính không trùng lặp; phân biệt WHERE (lọc từng hàng) và HAVING (lọc nhóm sau GROUP BY)."
      },
      {
        "level": "Vận dụng",
        "desc": "Viết câu lệnh SQL truy vấn danh sách học sinh đạt điểm giỏi, đếm số thí sinh trúng tuyển theo từng trường."
      }
    ],
    "warmUp": {
      "context": "Khi tra cứu điểm thi tốt nghiệp THPT trên mạng, hàng triệu thí sinh cùng truy cập một lúc nhưng hệ thống vẫn trả về chính xác điểm số của từng số báo danh chỉ trong vài phần trăm giây.",
      "question": "Dữ liệu điểm thi khổng lồ đó được lưu trữ và truy vấn như thế nào? Tại sao không dùng tệp Excel thông thường để quản lí?"
    },
    "mainSections": [
      {
        "id": "sec-1",
        "number": "1.",
        "title": "Khái niệm CSDL và Hệ quản trị CSDL (DBMS)",
        "content": "• Cơ sở dữ liệu (Database): Là tập hợp các dữ liệu có liên quan với nhau, được lưu trữ có cấu trúc trên bộ nhớ ngoài của máy tính nhằm đáp ứng nhu cầu khai thác thông tin của nhiều người dùng đồng thời.\n• Hệ quản trị CSDL (DBMS - Database Management System): Là phần mềm chuyên dụng cung cấp môi trường để tạo lập, lưu trữ, cập nhật, truy xuất và bảo mật CSDL (ví dụ: Microsoft Access, MySQL, Microsoft SQL Server, Oracle, PostgreSQL)."
      },
      {
        "id": "sec-2",
        "number": "2.",
        "title": "Mô hình CSDL quan hệ, Khoá chính và Khoá ngoại",
        "content": "• Mô hình CSDL quan hệ (Relational Database): Dữ liệu được tổ chức dưới dạng các bảng 2 chiều (gọi là quan hệ - relation).\n• Hàng (Row / Record / Bản ghi): Đại diện cho một đối tượng cụ thể (ví dụ: thông tin 1 học sinh).\n• Cột (Column / Field / Thuộc tính): Đại diện cho một đặc tính của đối tượng (ví dụ: MaHS, HoTen, NgaySinh, DiemToan).\n• Khoá chính (Primary Key): Là một hoặc nhiều trường dùng để định danh duy nhất mỗi bản ghi trong bảng. Giá trị khoá chính không được để trống (NOT NULL) và không được trùng lặp.\n• Khoá ngoại (Foreign Key): Là trường trong bảng này đóng vai trò tham chiếu đến khoá chính của bảng khác, tạo nên mối quan hệ liên kết giữa các bảng."
      },
      {
        "id": "sec-3",
        "number": "3.",
        "title": "Ngôn ngữ truy vấn có cấu trúc SQL",
        "content": "SQL (Structured Query Language) là ngôn ngữ tiêu chuẩn để thao tác và truy xuất dữ liệu trong các hệ quản trị CSDL quan hệ.\nCú pháp truy vấn tổng quát:\nSELECT danh_sách_cột\nFROM tên_bảng\nWHERE điều_kiện_lọc\nGROUP BY cột_nhóm\nHAVING điều_kiện_nhóm\nORDER BY cột_sắp_xếp ASC/DESC;\n\n• Các hàm gộp thông dụng: COUNT() đếm số bản ghi, SUM() tính tổng, AVG() tính trung bình, MAX(), MIN().",
        "codeSnippet": "-- Đếm số học sinh có kết quả 'Đỗ'\nSELECT count(KetQua) \nFROM DiemTHPT \nWHERE KetQua = 'Đỗ';\n\n-- Lấy danh sách điểm thi ngày trong khoảng\nSELECT * \nFROM Sales \nWHERE Date BETWEEN '2025-01-01' AND '2025-12-31';"
      }
    ],
    "memoryNotes": [
      "Khoá chính xác định duy nhất mỗi bản ghi, giá trị không được trùng lặp và không được rỗng.",
      "WHERE dùng để lọc từng bản ghi trước khi gộp nhóm; HAVING dùng để lọc nhóm sau lệnh GROUP BY.",
      "Cú pháp: SELECT (chọn cột) -> FROM (chọn bảng) -> WHERE (điều kiện) -> ORDER BY (sắp xếp)."
    ],
    "practiceQuestions": [
      {
        "id": "11f-q1",
        "question": "Câu 1. Bảng DiemTHPT có các cột SoBaoDanh, DiemToan, DiemLi, DiemHoa, TongDiem, KetQua. Hãy chọn câu lệnh SQL đếm tổng số thí sinh có kết quả 'Đỗ':",
        "options": {
          "A": "Select count(KetQua) From DiemTHPT Where KetQua = 'Đỗ'",
          "B": "Select count(KetQua) From DiemTHPT Order KetQua = 'Đỗ'",
          "C": "Select count(KetQua) From DiemTHPT Having KetQua = 'Đỗ'",
          "D": "Select count(KetQua) From DiemTHPT Where KetQua = 'TRƯỢT'"
        },
        "correctAnswer": "A",
        "explanation": "Trích nguyên văn đáp án sách Hướng dẫn ôn thi tốt nghiệp môn Tin học (trang 178): 'A. Dùng hàm COUNT() kết hợp mệnh đề WHERE để lọc các bản ghi có KetQua = \"Đỗ\". Phương án B sai vì dùng ORDER, phương án C sai vì dùng HAVING khi không có GROUP BY.'"
      },
      {
        "id": "11f-q2",
        "question": "Câu 2. Câu lệnh SQL nào sau đây viết ĐÚNG cú pháp toán tử so sánh?",
        "options": {
          "A": "SELECT * FROM Table1 WHERE Column1 => 10",
          "B": "SELECT * FROM Table1 WHERE Column1 == 10",
          "C": "SELECT * FROM Table1 WHERE Column1 >= 10",
          "D": "SELECT * FROM Table1 WHERE Column1 =< 10"
        },
        "correctAnswer": "C",
        "explanation": "Trích nguyên văn đáp án sách (trang 178): 'C. Trong chuẩn SQL, toán tử lớn hơn hoặc bằng viết là >=. Kí hiệu => hay =< đều là sai cú pháp.'"
      },
      {
        "id": "11f-q3",
        "question": "Câu 3. Bảng DIEM có các trường GIUA_KI, HOC_KI. Để tìm những học sinh có điểm giữa kì lớn hơn 3 VÀ điểm học kì lớn hơn 5, biểu thức điều kiện nào sau đây là đúng?",
        "options": {
          "A": "MOT_TIET => 3 AND HOC_KI > 5",
          "B": "[GIUA_KI] > 3 AND [HOC_KI] > 5",
          "C": "[MOT_TIET] > 3 OR [HOC_KI] > 5",
          "D": "[MOT_TIET] > \"3\" AND [HOC_KI] > \"5\""
        },
        "correctAnswer": "B",
        "explanation": "Trích nguyên văn đáp án sách (trang 179): 'B. Điều kiện đồng thời thỏa mãn cả hai tiêu chí dùng từ khóa AND, các trường số so sánh trực tiếp không để trong dấu ngoặc kép.'"
      }
    ],
    "application": {
      "realLife": "Ứng dụng trong quản lí học bạ điện tử VnEdu: mỗi học sinh có một mã định danh duy nhất (Khoá chính) để liên kết bảng Điểm, bảng Điểm danh và bảng Khen thưởng.",
      "examTraps": [
        "Bẫy 1: Dùng HAVING thay cho WHERE khi lọc dữ liệu không có gộp nhóm.",
        "Bẫy 2: Viết nhầm toán tử so sánh >= thành => trong câu lệnh SQL."
      ],
      "tips": [
        "Nhớ thứ tự các từ khoá SQL: SELECT ... FROM ... WHERE ... GROUP BY ... HAVING ... ORDER BY."
      ]
    },
    "requirements": [
      "Phân biệt CSDL và DBMS.",
      "Hiểu mô hình CSDL quan hệ, khoá chính, khoá ngoại.",
      "Viết câu lệnh SQL truy vấn dữ liệu."
    ],
    "keyConcepts": [
      {
        "term": "Khoá chính (Primary Key)",
        "definition": "Định danh duy nhất mỗi bản ghi trong bảng, không được trùng lặp và không rỗng.",
        "example": "SoBaoDanh trong bảng Điểm thi."
      }
    ],
    "theorySections": [
      {
        "title": "1. Khái niệm cơ bản",
        "content": "CSDL quan hệ lưu dữ liệu dạng bảng. SQL là ngôn ngữ truy vấn tiêu chuẩn."
      }
    ],
    "practicalTips": [
      "Thuộc cú pháp SELECT FROM WHERE."
    ],
    "commonPitfalls": [
      "Nhầm HAVING với WHERE."
    ]
  },
  "11F_CS": {
    "id": "11F_CS",
    "code": "Chủ đề 11F-CS",
    "title": "Kĩ thuật Lập trình và Thuật toán",
    "grade": "11",
    "track": "CS",
    "examWeight": "Định hướng KHMT (~15% đề thi)",
    "iconName": "cpu",
    "summary": "Nắm vững mảng 1 chiều, mảng 2 chiều trong Python; thuật toán tìm kiếm tuần tự (Linear Search) và tìm kiếm nhị phân (Binary Search); các thuật toán sắp xếp (Bubble Sort, Insertion Sort, Selection Sort) và đánh giá độ phức tạp thuật toán O(n), O(log n), O(n^2).",
    "outline": [
      {
        "id": "muc-tieu",
        "title": "Mục tiêu bài học",
        "level": 1
      },
      {
        "id": "muc-do",
        "title": "Mức độ kiến thức và kĩ năng cần đạt",
        "level": 1
      },
      {
        "id": "khoi-dong",
        "title": "Hoạt động khởi động",
        "level": 1
      },
      {
        "id": "sec-1",
        "title": "1. Mảng một chiều và Mảng hai chiều trong Python",
        "level": 1
      },
      {
        "id": "sec-2",
        "title": "2. Thuật toán tìm kiếm tuần tự và Tìm kiếm nhị phân",
        "level": 1
      },
      {
        "id": "sec-3",
        "title": "3. Các thuật toán sắp xếp cơ bản (Nổi bọt, Chèn, Chọn)",
        "level": 1
      },
      {
        "id": "sec-4",
        "title": "4. Độ phức tạp thời gian của thuật toán",
        "level": 1
      },
      {
        "id": "ghi-nho",
        "title": "Ghi nhớ",
        "level": 1
      },
      {
        "id": "luyen-tap",
        "title": "Luyện tập (Trắc nghiệm chuẩn sách)",
        "level": 1
      },
      {
        "id": "van-dung",
        "title": "Vận dụng",
        "level": 1
      }
    ],
    "objectives": [
      "Sử dụng thành thạo cấu trúc danh sách (list) biểu diễn mảng 1 chiều và ma trận 2 chiều trong Python.",
      "Cài đặt và phân tích được thuật toán tìm kiếm tuần tự và tìm kiếm nhị phân (điều kiện mảng đã sắp xếp).",
      "Hiểu nguyên lí và cài đặt được 3 thuật toán sắp xếp: Sắp xếp nổi bọt (Bubble Sort), Sắp xếp chèn (Insertion Sort), Sắp xếp chọn (Selection Sort).",
      "Đánh giá và so sánh được độ phức tạp thuật toán qua kí hiệu Big-O trong trường hợp tốt nhất và xấu nhất."
    ],
    "standards": [
      {
        "level": "Nhận biết",
        "desc": "Nêu được điều kiện áp dụng tìm kiếm nhị phân (mảng phải được sắp xếp); nhận biết nguyên lí đổi chỗ 2 phần tử kề nhau của nổi bọt."
      },
      {
        "level": "Thông hiểu",
        "desc": "Giải thích được số vòng lặp và số bước so sánh của tìm kiếm nhị phân; hiểu vì sao độ phức tạp của tìm kiếm nhị phân là O(log n)."
      },
      {
        "level": "Vận dụng",
        "desc": "Viết mã nguồn Python giải bài toán tìm phần tử thoả mãn điều kiện; sắp xếp danh sách điểm thi học sinh theo thứ tự giảm dần."
      }
    ],
    "warmUp": {
      "context": "Khi tra một từ trong cuốn từ điển dày 1000 trang, em sẽ lật từng trang từ đầu đến cuối hay mở ngay vào giữa cuốn sách để thu hẹp phạm vi?",
      "question": "Cách mở vào giữa cuốn sách mô phỏng thuật toán tìm kiếm nào trong khoa học máy tính? Tại sao cách này lại nhanh hơn gấp nhiều lần?"
    },
    "mainSections": [
      {
        "id": "sec-1",
        "number": "1.",
        "title": "Mảng một chiều và Mảng hai chiều trong Python",
        "content": "• Mảng 1 chiều: Trong Python được biểu diễn bằng kiểu list, các phần tử đánh chỉ số từ 0 đến len(A)-1.\n• Mảng 2 chiều (Ma trận): Danh sách các danh sách (list of lists). Phần tử ở hàng i, cột j truy cập qua cú pháp A[i][j].",
        "codeSnippet": "# Khởi tạo mảng 2 chiều kích thước 3x3 chứa toàn số 0\nmatrix = [[0 for j in range(3)] for i in range(3)]"
      },
      {
        "id": "sec-2",
        "number": "2.",
        "title": "Thuật toán tìm kiếm tuần tự và Tìm kiếm nhị phân",
        "content": "• Tìm kiếm tuần tự (Linear Search): Duyệt tuần tự từ đầu mảng đến cuối mảng cho đến khi gặp phần tử cần tìm hoặc hết mảng. Áp dụng cho mọi mảng (không cần sắp xếp). Độ phức tạp: O(n).\n• Tìm kiếm nhị phân (Binary Search): BẮT BUỘC danh sách phải được sắp xếp trước. Mỗi bước so sánh giá trị cần tìm với phần tử ở giữa (mid). Nếu nhỏ hơn thì tìm ở nửa trái, lớn hơn tìm ở nửa phải. Độ phức tạp cực nhanh: O(log n).",
        "codeSnippet": "def binary_search(A, x):\n    left, right = 0, len(A) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if A[mid] == x:\n            return mid\n        elif A[mid] < x:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1"
      },
      {
        "id": "sec-3",
        "number": "3.",
        "title": "Các thuật toán sắp xếp cơ bản (Nổi bọt, Chèn, Chọn)",
        "content": "• Sắp xếp nổi bọt (Bubble Sort): So sánh liên tục 2 phần tử kề nhau, nếu đứng sai thứ tự thì đổi chỗ. Sau mỗi lượt duyệt, phần tử lớn nhất sẽ 'nổi' về cuối mảng.\n• Sắp xếp chọn (Selection Sort): Tìm phần tử nhỏ nhất trong đoạn chưa sắp xếp rồi đổi chỗ nó về vị trí đầu tiên của đoạn đó.\n• Sắp xếp chèn (Insertion Sort): Lấy lần lượt từng phần tử chèn vào đúng vị trí trong đoạn đã sắp xếp phía trước.",
        "codeSnippet": "def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n - 1):\n        for j in range(n - 1 - i):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n    return arr"
      },
      {
        "id": "sec-4",
        "number": "4.",
        "title": "Độ phức tạp thời gian của thuật toán",
        "content": "• O(1): Thời gian hằng số (truy cập mảng A[i]).\n• O(log n): Rất nhanh (tìm kiếm nhị phân, chia để trị).\n• O(n): Tuyến tính (tìm kiếm tuần tự, tìm max/min).\n• O(n log n): Thuật toán sắp xếp tối ưu (Merge Sort, Quick Sort).\n• O(n^2): Sắp xếp cơ bản (Bubble, Selection, Insertion Sort trong trường hợp xấu nhất)."
      }
    ],
    "memoryNotes": [
      "Điều kiện tiên quyết của tìm kiếm nhị phân: Mảng phải được sắp xếp trước.",
      "Tìm kiếm nhị phân có độ phức tạp O(log n); tìm kiếm tuần tự là O(n).",
      "Sắp xếp nổi bọt đổi chỗ 2 phần tử liền kề; sắp xếp chọn tìm phần tử nhỏ nhất đưa về đầu."
    ],
    "practiceQuestions": [
      {
        "id": "11fcs-q1",
        "question": "Câu 1. Thuật toán sắp xếp nổi bọt thực hiện sắp xếp dãy số không giảm bằng cách nào sau đây?",
        "options": {
          "A": "Đổi chỗ 2 số liền kề nhau nếu chúng đứng sai thứ tự cho đến khi dãy số được sắp xếp.",
          "B": "Di chuyển số nhỏ nhất về cuối danh sách.",
          "C": "Di chuyển số lớn nhất về đầu danh sách.",
          "D": "Chia mảng thành 2 nửa bằng nhau rồi gộp lại."
        },
        "correctAnswer": "A",
        "explanation": "Trích nguyên văn sách Hướng dẫn ôn thi tốt nghiệp môn Tin học (trang 87 & 180): 'A. Thuật toán sắp xếp nổi bọt so sánh cặp 2 phần tử kề nhau, nếu đứng sai thứ tự thì hoán đổi chỗ cho nhau.'"
      },
      {
        "id": "11fcs-q2",
        "question": "Câu 2. Để tìm kiếm phần tử bằng thuật toán tìm kiếm nhị phân, dãy số đầu vào bắt buộc phải thoả mãn điều kiện gì?",
        "options": {
          "A": "Dãy số phải có số lượng phần tử là số chẵn.",
          "B": "Dãy số phải được sắp xếp theo thứ tự tăng dần hoặc giảm dần.",
          "C": "Các phần tử trong dãy số đều phải là số nguyên dương.",
          "D": "Dãy số không được có bất kì phần tử nào trùng lặp."
        },
        "correctAnswer": "B",
        "explanation": "Trích nguyên văn đáp án sách (trang 180): 'B. Điều kiện bắt buộc của tìm kiếm nhị phân là dãy số phải được sắp xếp thứ tự trước để có thể so sánh giá trị phần tử giữa và loại bỏ một nửa không gian tìm kiếm ở mỗi bước.'"
      },
      {
        "id": "11fcs-q3",
        "question": "Câu 3. Thực hiện thuật toán tìm kiếm tuần tự để tìm số 10 trong danh sách [2, 6, 8, 4, 10, 12]. Đầu ra của thuật toán là thông báo nào?",
        "options": {
          "A": "'Không tìm thấy'.",
          "B": "'Tìm thấy'.",
          "C": "'Tìm thấy tại vị trí thứ 2'.",
          "D": "'Tìm thấy tại vị trí thứ 3'."
        },
        "correctAnswer": "B",
        "explanation": "Trích nguyên văn đáp án sách (trang 180): 'B. Số 10 có xuất hiện trong danh sách nên thuật toán trả về kết quả Tìm thấy.'"
      }
    ],
    "application": {
      "realLife": "Thuật toán tìm kiếm nhị phân là nền tảng của các chỉ mục cơ sở dữ liệu (B-Tree Index) và hệ thống tìm kiếm trong các tập đoàn công nghệ lớn.",
      "examTraps": [
        "Bẫy 1: Quên kiểm tra mảng đã sắp xếp hay chưa trước khi dùng Binary Search.",
        "Bẫy 2: Nhầm lẫn độ phức tạp O(log n) với O(n)."
      ],
      "tips": [
        "Học thuộc công thức vòng lặp Bubble Sort: cặp kề nhau arr[j] và arr[j+1].",
        "Công thức chỉ số giữa mid = (left + right) // 2."
      ]
    },
    "requirements": [
      "Sử dụng mảng 1 chiều, 2 chiều trong Python.",
      "Cài đặt thuật toán tìm kiếm tuần tự và nhị phân.",
      "Cài đặt thuật toán sắp xếp nổi bọt, chèn, chọn.",
      "Đánh giá độ phức tạp thời gian Big-O."
    ],
    "keyConcepts": [
      {
        "term": "Tìm kiếm nhị phân (Binary Search)",
        "definition": "Thuật toán tìm kiếm chia đôi trên mảng đã sắp xếp với độ phức tạp O(log n).",
        "example": "Tìm từ trong từ điển."
      }
    ],
    "theorySections": [
      {
        "title": "1. Thuật toán tìm kiếm",
        "content": "• Tuần tự: Duyệt từng phần tử O(n).\n• Nhị phân: Chia đôi O(log n)."
      }
    ],
    "practicalTips": [
      "Nhớ điều kiện mảng sắp xếp."
    ],
    "commonPitfalls": [
      "Dùng nhị phân cho mảng chưa sắp xếp."
    ]
  },
  "12F_CS": {
    "id": "12F_CS",
    "code": "Chủ đề 12F-CS",
    "title": "Giới thiệu Học máy và Khoa học Dữ liệu",
    "grade": "12",
    "track": "CS",
    "examWeight": "Định hướng KHMT (~10% đề thi)",
    "iconName": "brain",
    "summary": "Tìm hiểu nền tảng của Học máy (Machine Learning) gồm học có giám sát, không giám sát, học tăng cường; quy trình 5 bước của Khoa học dữ liệu và ứng dụng trong phân tích dự đoán.",
    "outline": [
      {
        "id": "muc-tieu",
        "title": "Mục tiêu bài học",
        "level": 1
      },
      {
        "id": "muc-do",
        "title": "Mức độ kiến thức và kĩ năng cần đạt",
        "level": 1
      },
      {
        "id": "khoi-dong",
        "title": "Hoạt động khởi động",
        "level": 1
      },
      {
        "id": "sec-1",
        "title": "1. Khái niệm và Phân loại Học máy (Machine Learning)",
        "level": 1
      },
      {
        "id": "sec-2",
        "title": "2. Quy trình Khoa học Dữ liệu (Data Science Process)",
        "level": 1
      },
      {
        "id": "ghi-nho",
        "title": "Ghi nhớ",
        "level": 1
      },
      {
        "id": "luyen-tap",
        "title": "Luyện tập (Trắc nghiệm chuẩn sách)",
        "level": 1
      },
      {
        "id": "van-dung",
        "title": "Vận dụng",
        "level": 1
      }
    ],
    "objectives": [
      "Trình bày được khái niệm Học máy và 3 nhóm chính: Học có giám sát, Học không giám sát, Học tăng cường.",
      "Mô tả được các bước cơ bản trong quy trình khoa học dữ liệu: Thu thập -> Tiền xử lí -> Khám phá -> Xây dựng mô hình -> Đánh giá & Triển khai.",
      "Nêu được ví dụ ứng dụng của Học máy trong dự báo thời tiết, lọc thư rác và gợi ý mua sắm."
    ],
    "standards": [
      {
        "level": "Nhận biết",
        "desc": "Nêu được định nghĩa học máy và các nhóm học máy cơ bản."
      },
      {
        "level": "Thông hiểu",
        "desc": "Phân biệt được dữ liệu có nhãn (học có giám sát) và không có nhãn (học không giám sát)."
      },
      {
        "level": "Vận dụng",
        "desc": "Đề xuất bài toán ứng dụng học máy giải quyết vấn đề phân loại hình ảnh rác thải học đường."
      }
    ],
    "warmUp": {
      "context": "Khi bạn xem một video trên TikTok hoặc YouTube, hệ thống sẽ tự động đề xuất những video tiếp theo rất đúng với sở thích của bạn.",
      "question": "Thuật toán học máy đã làm thế nào để nắm bắt được sở thích của người dùng?"
    },
    "mainSections": [
      {
        "id": "sec-1",
        "number": "1.",
        "title": "Khái niệm và Phân loại Học máy (Machine Learning)",
        "content": "Học máy là một nhánh của Trí tuệ nhân tạo, nghiên cứu các thuật toán giúp máy tính tự động học hỏi từ dữ liệu quá khứ để đưa ra dự đoán hoặc quyết định mà không cần lập trình quy tắc tường minh.\n• Học có giám sát (Supervised Learning): Dữ liệu huấn luyện có kèm nhãn đáp án (Label). Ví dụ: Phân loại email là 'Thư rác' hoặc 'Hợp lệ'.\n• Học không giám sát (Unsupervised Learning): Dữ liệu không có nhãn, mô hình tự tìm ra cấu trúc ẩn hoặc gom nhóm (Clustering). Ví dụ: Phân nhóm khách hàng theo hành vi mua sắm.\n• Học tăng cường (Reinforcement Learning): Mô hình học thông qua tương tác thử - sai với môi trường để nhận phần thưởng (Reward) hoặc hình phạt. Ví dụ: Huấn luyện robot di chuyển, chơi cờ AlphaGo."
      },
      {
        "id": "sec-2",
        "number": "2.",
        "title": "Quy trình Khoa học Dữ liệu",
        "content": "Gồm 5 bước chuẩn:\n1. Thu thập dữ liệu: Từ cảm biến, tệp log, cơ sở dữ liệu hoặc khảo sát.\n2. Tiền xử lí dữ liệu: Làm sạch dữ liệu, xử lí giá trị thiếu (missing values), loại bỏ dữ liệu ngoại lai và chuẩn hoá số liệu.\n3. Khám phá dữ liệu (EDA): Trực quan hoá bằng biểu đồ để tìm ra xu hướng.\n4. Huấn luyện mô hình: Chọn thuật toán học máy phù hợp.\n5. Đánh giá và triển khai: Kiểm thử trên dữ liệu mới và đưa vào ứng dụng thực tế."
      }
    ],
    "memoryNotes": [
      "Học có giám sát dùng dữ liệu có nhãn; học không giám sát dùng dữ liệu không có nhãn.",
      "Học tăng cường dựa trên cơ chế thưởng - phạt khi tương tác với môi trường.",
      "Làm sạch và tiền xử lí dữ liệu chiếm tới 70-80% thời gian của một dự án khoa học dữ liệu."
    ],
    "practiceQuestions": [
      {
        "id": "12fcs-q1",
        "question": "Câu 1. Phương pháp học máy nào sử dụng dữ liệu huấn luyện đã được gán nhãn (label)?",
        "options": {
          "A": "Học không giám sát.",
          "B": "Học có giám sát.",
          "C": "Học tăng cường.",
          "D": "Học tự do."
        },
        "correctAnswer": "B",
        "explanation": "Trích nguyên văn đáp án sách (trang 179): 'B. Học có giám sát (Supervised Learning) là phương pháp học máy mà tập dữ liệu huấn luyện đã có sẵn cả đầu vào và nhãn kết quả mong muốn.'"
      }
    ],
    "application": {
      "realLife": "Ứng dụng trong y tế: Mô hình phân loại khối u lành tính hay ác tính dựa trên hình ảnh chụp cắt lớp đã được bác sĩ gán nhãn.",
      "examTraps": [
        "Nhầm lẫn giữa học có giám sát và học không giám sát."
      ],
      "tips": [
        "Nhớ từ khoá 'có nhãn' là có giám sát, 'gom cụm không nhãn' là không giám sát."
      ]
    },
    "requirements": [
      "Hiểu khái niệm học máy.",
      "Phân biệt học có giám sát và không giám sát."
    ],
    "keyConcepts": [
      {
        "term": "Học có giám sát",
        "definition": "Học từ dữ liệu có nhãn."
      }
    ],
    "theorySections": [
      {
        "title": "1. Khái niệm",
        "content": "Học máy giúp máy tính tự học từ dữ liệu."
      }
    ],
    "practicalTips": [
      "Thuộc các nhóm học máy."
    ],
    "commonPitfalls": [
      "Nhầm học máy với CSDL."
    ]
  },
  "12E_ICT": {
    "id": "12E_ICT",
    "code": "Chủ đề 12E-ICT",
    "title": "Thực hành Phần mềm Tạo Trang Web",
    "grade": "12",
    "track": "ICT",
    "examWeight": "Định hướng THUD (~15% đề thi)",
    "iconName": "globe",
    "summary": "Sử dụng các phần mềm tạo trang web trực quan (như Google Sites, phần mềm CMS) để thiết kế website hoàn chỉnh: tạo thanh điều hướng (Navigation bar), chèn khối nội dung, văn bản, ảnh, nhúng video YouTube, biểu mẫu liên hệ và xuất bản lên Internet.",
    "outline": [
      {
        "id": "muc-tieu",
        "title": "Mục tiêu bài học",
        "level": 1
      },
      {
        "id": "muc-do",
        "title": "Mức độ kiến thức và kĩ năng cần đạt",
        "level": 1
      },
      {
        "id": "khoi-dong",
        "title": "Hoạt động khởi động",
        "level": 1
      },
      {
        "id": "sec-1",
        "title": "1. Quy trình thiết kế website trực quan",
        "level": 1
      },
      {
        "id": "sec-2",
        "title": "2. Tạo cấu trúc trang và thanh điều hướng",
        "level": 1
      },
      {
        "id": "sec-3",
        "title": "3. Nhúng đa phương tiện và Xuất bản trang web",
        "level": 1
      },
      {
        "id": "ghi-nho",
        "title": "Ghi nhớ",
        "level": 1
      },
      {
        "id": "luyen-tap",
        "title": "Luyện tập (Trắc nghiệm chuẩn sách)",
        "level": 1
      },
      {
        "id": "van-dung",
        "title": "Vận dụng",
        "level": 1
      }
    ],
    "objectives": [
      "Sử dụng thành thạo phần mềm thiết kế website trực quan để tạo trang web tin tức hoặc giới thiệu câu lạc bộ.",
      "Tạo được hệ thống trang phân cấp: Trang chủ (Home), Trang con và thanh điều hướng (Navigation Menu).",
      "Chèn và định dạng nội dung đa phương tiện: văn bản, hình ảnh, băng chuyền ảnh (Carousel), video nhúng YouTube.",
      "Thiết lập tên miền phụ và xuất bản (Publish) trang web công khai trên môi trường Internet."
    ],
    "standards": [
      {
        "level": "Nhận biết",
        "desc": "Nêu được các bước cơ bản để tạo trang web bằng phần mềm trực quan."
      },
      {
        "level": "Thông hiểu",
        "desc": "Hiểu cách tổ chức cấu trúc menu điều hướng trang web khoa học và thân thiện với người dùng."
      },
      {
        "level": "Vận dụng",
        "desc": "Hoàn thiện một trang web giới thiệu đặc sản quê hương với đầy đủ hình ảnh, video và bản đồ Google Maps."
      }
    ],
    "warmUp": {
      "context": "Nhóm của em được phân công làm một trang web giới thiệu dự án bảo vệ môi trường của trường trong vòng 2 ngày.",
      "question": "Thay vì gõ từng dòng mã HTML/CSS phức tạp, có công cụ nào giúp các em kéo thả để hoàn thành trang web nhanh chóng và chuyên nghiệp không?"
    },
    "mainSections": [
      {
        "id": "sec-1",
        "number": "1.",
        "title": "Quy trình thiết kế website trực quan",
        "content": "• Bước 1: Xác định mục tiêu và đối tượng phục vụ của trang web.\n• Bước 2: Phác thảo sơ đồ cấu trúc trang (Sitemap) gồm trang chủ và các trang thành phần.\n• Bước 3: Thu thập và chuẩn bị tài liệu (logo, bài viết, hình ảnh độ phân giải cao, video tư liệu).\n• Bước 4: Tạo lập giao diện bằng phần mềm tạo web (như Google Sites).\n• Bước 5: Kiểm thử hiển thị trên các màn hình máy tính, máy tính bảng và điện thoại di động.\n• Bước 6: Xuất bản (Publish) và chia sẻ liên kết."
      },
      {
        "id": "sec-2",
        "number": "2.",
        "title": "Tạo cấu trúc trang và thanh điều hướng",
        "content": "Thanh điều hướng (Navigation Bar) là thành phần sống còn giúp người xem di chuyển giữa các trang con. Cần sắp xếp danh mục ngắn gọn, rõ ràng theo thứ bậc hợp lí."
      },
      {
        "id": "sec-3",
        "number": "3.",
        "title": "Nhúng đa phương tiện và Xuất bản trang web",
        "content": "• Nhúng video: Khuyến nghị tải video lên YouTube rồi nhúng bằng mã hoặc đường link URL để tiết kiệm dung lượng lưu trữ của máy chủ web.\n• Xuất bản: Nhấn nút Publish, đặt tên địa chỉ web (web address) hợp lệ, thiết lập quyền xem công khai (Public)."
      }
    ],
    "memoryNotes": [
      "Nhúng video YouTube giúp tiết kiệm băng thông máy chủ và đảm bảo phát mượt mà trên mọi thiết bị.",
      "Thanh điều hướng cần đặt ở vị trí dễ thấy (đầu trang hoặc cạnh trái).",
      "Luôn kiểm tra quyền riêng tư (Sharing settings) trước khi gửi link cho mọi người."
    ],
    "practiceQuestions": [
      {
        "id": "12eict-q1",
        "question": "Câu 1. Khi thiết kế trang web bằng phần mềm trực quan, cách làm nào sau đây là TỐI ƯU NHẤT để chèn video vào trang web?",
        "options": {
          "A": "Tải video lên YouTube rồi chèn đối tượng nhúng video từ YouTube vào trang web.",
          "B": "Tải video trực tiếp từ máy tính lên trang web để lưu trữ cục bộ.",
          "C": "Chuyển video thành ảnh động GIF rồi chèn vào trang web.",
          "D": "Không thể chèn video vào trang web thiết kế trực quan."
        },
        "correctAnswer": "A",
        "explanation": "Trích nguyên văn đáp án sách Hướng dẫn ôn thi tốt nghiệp môn Tin học (trang 183): 'A. Đăng video lên YouTube rồi thêm video vào trang web thông qua đối tượng nhúng video giúp tối ưu hoá dung lượng lưu trữ và tốc độ tải trang web.'"
      }
    ],
    "application": {
      "realLife": "Tự tạo trang web portfolio cá nhân bằng Google Sites để lưu trữ các chứng chỉ, dự án học tập và hồ sơ xét tuyển đại học.",
      "examTraps": [
        "Cho rằng phải tự lưu video 4K trên hosting của mình mới xem được."
      ],
      "tips": [
        "Nhớ ưu điểm vượt trội của việc nhúng liên kết YouTube."
      ]
    },
    "requirements": [
      "Sử dụng phần mềm tạo web trực quan.",
      "Xuất bản website lên Internet."
    ],
    "keyConcepts": [
      {
        "term": "Phần mềm tạo web trực quan",
        "definition": "Công cụ thiết kế web kéo thả không cần viết code."
      }
    ],
    "theorySections": [
      {
        "title": "1. Thực hành",
        "content": "Kéo thả layout, nhúng ảnh và video."
      }
    ],
    "practicalTips": [
      "Nhúng video qua YouTube."
    ],
    "commonPitfalls": [
      "Quên xuất bản (Publish) trang web."
    ]
  },
  "11E_ICT": {
    "id": "11E_ICT",
    "code": "Chủ đề 11E-ICT",
    "title": "Thực hành Tạo và Khai thác Cơ sở Dữ liệu",
    "grade": "11",
    "track": "ICT",
    "examWeight": "Định hướng THUD (~15% đề thi)",
    "iconName": "server",
    "summary": "Thực hành tạo lập bảng, khai báo trường, kiểu dữ liệu, thiết lập khoá chính, tạo mối liên kết giữa các bảng, thiết kế biểu mẫu nhập liệu (Form), xây dựng mẫu hỏi truy vấn (Query) và tạo báo cáo tổng hợp (Report) trên hệ quản trị CSDL quan hệ.",
    "outline": [
      {
        "id": "muc-tieu",
        "title": "Mục tiêu bài học",
        "level": 1
      },
      {
        "id": "muc-do",
        "title": "Mức độ kiến thức và kĩ năng cần đạt",
        "level": 1
      },
      {
        "id": "khoi-dong",
        "title": "Hoạt động khởi động",
        "level": 1
      },
      {
        "id": "sec-1",
        "title": "1. Tạo cấu trúc bảng và Thiết lập Khoá chính",
        "level": 1
      },
      {
        "id": "sec-2",
        "title": "2. Tạo liên kết giữa các bảng",
        "level": 1
      },
      {
        "id": "sec-3",
        "title": "3. Tạo Mẫu hỏi truy vấn (Query) và Báo cáo (Report)",
        "level": 1
      },
      {
        "id": "ghi-nho",
        "title": "Ghi nhớ",
        "level": 1
      },
      {
        "id": "luyen-tap",
        "title": "Luyện tập (Trắc nghiệm chuẩn sách)",
        "level": 1
      },
      {
        "id": "van-dung",
        "title": "Vận dụng",
        "level": 1
      }
    ],
    "objectives": [
      "Tạo được các bảng CSDL với các kiểu dữ liệu thích hợp (Short Text, Number, Date/Time, AutoNumber, Yes/No).",
      "Chỉ định được khoá chính cho bảng dữ liệu.",
      "Thiết lập được mối liên kết giữa các bảng (1 - Nhiều) và bật tính toàn vẹn tham chiếu.",
      "Tạo được các câu truy vấn Query lọc dữ liệu có điều kiện và tạo báo cáo Report in ấn."
    ],
    "standards": [
      {
        "level": "Nhận biết",
        "desc": "Nêu được các đối tượng chính trong CSDL: Table, Query, Form, Report."
      },
      {
        "level": "Thông hiểu",
        "desc": "Hiểu sự cần thiết của việc liên kết các bảng để tránh dư thừa và nhất quán dữ liệu."
      },
      {
        "level": "Vận dụng",
        "desc": "Xây dựng CSDL Quản lí thư viện trường học gồm bảng Sách, bảng Độc giả và bảng Mượn trả."
      }
    ],
    "warmUp": {
      "context": "Khi đến thư viện mượn sách, thủ thư chỉ cần quét mã thẻ học sinh và mã cuốn sách thì thông tin ngày mượn, hạn trả lập tức được ghi nhận.",
      "question": "Các bảng Sách và bảng Bạn đọc được liên kết với nhau như thế nào trong phần mềm quản lí thư viện?"
    },
    "mainSections": [
      {
        "id": "sec-1",
        "number": "1.",
        "title": "Tạo cấu trúc bảng và Thiết lập Khoá chính",
        "content": "• Table (Bảng): Đối tượng cơ sở lưu trữ dữ liệu.\n• Khai báo trường (Field Name), kiểu dữ liệu (Data Type) và mô tả (Description).\n• Thiết lập Khoá chính: Chọn trường định danh duy nhất (ví dụ: MaSach, MaHS), nhấn biểu tượng chiếc chìa khoá (Primary Key)."
      },
      {
        "id": "sec-2",
        "number": "2.",
        "title": "Tạo liên kết giữa các bảng",
        "content": "Kéo thả trường khoá chính từ bảng cha sang trường khoá ngoại của bảng con trong cửa sổ Relationships. Bật tính năng 'Enforce Referential Integrity' (ràng buộc toàn vẹn tham chiếu) để ngăn chặn việc nhập mã không tồn tại."
      },
      {
        "id": "sec-3",
        "number": "3.",
        "title": "Tạo Mẫu hỏi truy vấn (Query) và Báo cáo (Report)",
        "content": "• Query (Mẫu hỏi): Lọc, sắp xếp, kết xuất dữ liệu từ một hoặc nhiều bảng thoả mãn điều kiện (Criteria).\n• Form (Biểu mẫu): Tạo giao diện thuận tiện cho người dùng nhập liệu.\n• Report (Báo cáo): Định dạng và tổng hợp dữ liệu để in ra giấy hoặc xuất bản tệp PDF."
      }
    ],
    "memoryNotes": [
      "4 đối tượng chính trong Access/DBMS: Table (Bảng), Query (Mẫu hỏi), Form (Biểu mẫu), Report (Báo cáo).",
      "Ràng buộc toàn vẹn tham chiếu đảm bảo không thể xoá bản ghi cha khi bản ghi con đang tham chiếu tới.",
      "Query dùng để tính toán và lọc dữ liệu; Report dùng để kết xuất in ấn."
    ],
    "practiceQuestions": [
      {
        "id": "11eict-q1",
        "question": "Câu 1. Trong hệ quản trị CSDL, đối tượng nào được thiết kế chuyên biệt để định dạng, tính toán tổng hợp và kết xuất dữ liệu phục vụ in ấn?",
        "options": {
          "A": "Table (Bảng).",
          "B": "Query (Mẫu hỏi).",
          "C": "Report (Báo cáo).",
          "D": "Form (Biểu mẫu)."
        },
        "correctAnswer": "C",
        "explanation": "Trích nguyên văn đáp án sách Hướng dẫn ôn thi tốt nghiệp môn Tin học (trang 185): 'C. Report (Báo cáo) là đối tượng chuyên dùng để tổng hợp, trình bày số liệu theo nhóm và định dạng bố cục phục vụ in ấn.'"
      }
    ],
    "application": {
      "realLife": "Xây dựng hệ thống quản lí điểm thi thử tốt nghiệp THPT của trường gồm bảng HocSinh, bảng MonThi và bảng KetQuaThi.",
      "examTraps": [
        "Nhầm lẫn giữa mục đích của Form (nhập liệu) với Report (in ấn)."
      ],
      "tips": [
        "Nhớ 4 đối tượng: Bảng lưu, Form nhập, Query lọc, Report in."
      ]
    },
    "requirements": [
      "Tạo bảng và khoá chính.",
      "Tạo quan hệ giữa các bảng.",
      "Tạo Query và Report."
    ],
    "keyConcepts": [
      {
        "term": "Report (Báo cáo)",
        "definition": "Đối tượng định dạng và in ấn dữ liệu."
      }
    ],
    "theorySections": [
      {
        "title": "1. Khai thác CSDL",
        "content": "Tạo Table, Query, Form, Report."
      }
    ],
    "practicalTips": [
      "Nhớ vai trò từng đối tượng."
    ],
    "commonPitfalls": [
      "Nhầm Form với Report."
    ]
  },
  "10_PYTHON": {
        "id": "10_PYTHON",
        "code": "Chủ đề 10-PY",
        "title": "Lập trình Python Cơ bản & Cấu trúc Dữ liệu (Lớp 10)",
        "grade": "10",
        "track": "ALL",
        "examWeight": "Trọng tâm Lớp 10 & Nền tảng THPT (~15% câu hỏi)",
        "iconName": "terminal",
        "summary": "Biên soạn toàn diện chuẩn SGK Tin học 10 GDPT 2018 kết hợp Note Python Tháng 6 & Tháng 7: Khai báo biến, các kiểu dữ liệu chuẩn, hệ thống 4 nhóm toán tử, cấu trúc rẽ nhánh if-elif-else, cấu trúc lặp for/while & kỹ thuật in hình, cấu trúc dữ liệu danh sách (List), từ điển (Dictionary), xử lý chuỗi (String) và hàm (Function def) cùng độ phức tạp thời gian Big-O.",
        "outline": [
            {
                "id": "muc-tieu",
                "title": "Mục tiêu bài học",
                "level": 1
            },
            {
                "id": "muc-do",
                "title": "Mức độ kiến thức và kĩ năng cần đạt",
                "level": 1
            },
            {
                "id": "khoi-dong",
                "title": "Hoạt động khởi động",
                "level": 1
            },
            {
                "id": "sec-1",
                "title": "1. Tổng quan về Python, Biến & Kiểu dữ liệu cơ bản",
                "level": 1
            },
            {
                "id": "sec-1-1",
                "title": "a) Ngôn ngữ Python & Quy tắc đặt tên biến",
                "level": 2
            },
            {
                "id": "sec-1-2",
                "title": "b) Các kiểu dữ liệu cơ bản & Cơ chế định kiểu động",
                "level": 2
            },
            {
                "id": "sec-1-3",
                "title": "c) Nhập xuất dữ liệu (print, input), ép kiểu & định dạng",
                "level": 2
            },
            {
                "id": "sec-2",
                "title": "2. Hệ thống Toán tử toàn diện trong Python",
                "level": 1
            },
            {
                "id": "sec-2-1",
                "title": "a) Toán tử số học (chia thực /, chia nguyên //, chia dư %, mũ **)",
                "level": 2
            },
            {
                "id": "sec-2-2",
                "title": "b) Toán tử gán & Toán tử gán kết hợp số học",
                "level": 2
            },
            {
                "id": "sec-2-3",
                "title": "c) Toán tử so sánh & Toán tử logic (and, or, not)",
                "level": 2
            },
            {
                "id": "sec-3",
                "title": "3. Cấu trúc rẽ nhánh điều kiện if - elif - else",
                "level": 1
            },
            {
                "id": "sec-3-1",
                "title": "a) Sơ đồ khối rẽ nhánh & Cú pháp if, if-else, if-elif-else",
                "level": 2
            },
            {
                "id": "sec-3-2",
                "title": "b) Quy tắc thụt lề (Indentation) & Cấu trúc rẽ nhánh lồng nhau",
                "level": 2
            },
            {
                "id": "sec-3-3",
                "title": "c) Bài toán thực tế: Máy tính mini & Quản lý số dư ATM",
                "level": 2
            },
            {
                "id": "sec-4",
                "title": "4. Cấu trúc lặp for, while & Kỹ thuật in hình, tính tổng",
                "level": 1
            },
            {
                "id": "sec-4-1",
                "title": "a) Vòng lặp for & Hàm range(start, stop, step)",
                "level": 2
            },
            {
                "id": "sec-4-2",
                "title": "b) Vòng lặp while, vòng lặp vô tận & lệnh break, continue",
                "level": 2
            },
            {
                "id": "sec-4-3",
                "title": "c) Vòng lặp lồng nhau: Kỹ thuật in các mẫu hình sao kinh điển",
                "level": 2
            },
            {
                "id": "sec-4-4",
                "title": "d) Công thức cấp số cộng & Giới thiệu Độ phức tạp thuật toán O(N)",
                "level": 2
            },
            {
                "id": "sec-5",
                "title": "5. Cấu trúc dữ liệu Danh sách (List)",
                "level": 1
            },
            {
                "id": "sec-5-1",
                "title": "a) Khái niệm List, chỉ số Index âm/dương & Cắt lát (Slicing)",
                "level": 2
            },
            {
                "id": "sec-5-2",
                "title": "b) Bảng phương thức List cốt lõi: append, insert, remove, pop, sort",
                "level": 2
            },
            {
                "id": "sec-5-3",
                "title": "c) Các hàm dựng sẵn: len, sum, max, min & Kỹ thuật nhập mảng 1 dòng",
                "level": 2
            },
            {
                "id": "sec-6",
                "title": "6. Cấu trúc dữ liệu Từ điển (Dictionary)",
                "level": 1
            },
            {
                "id": "sec-6-1",
                "title": "a) Khái niệm Dictionary, tính chất của Khóa (Key) và Giá trị (Value)",
                "level": 2
            },
            {
                "id": "sec-6-2",
                "title": "b) Khởi tạo, truy xuất, cập nhật, thêm mới và xóa phần tử",
                "level": 2
            },
            {
                "id": "sec-6-3",
                "title": "c) Duyệt Dictionary & Ứng dụng quản lý danh sách học sinh",
                "level": 2
            },
            {
                "id": "sec-7",
                "title": "7. Định nghĩa & Sử dụng Hàm (Function def)",
                "level": 1
            },
            {
                "id": "sec-7-1",
                "title": "a) Cú pháp def, tham số và giá trị trả về return",
                "level": 2
            },
            {
                "id": "sec-7-2",
                "title": "b) Phân loại hàm: Không tham số, có tham số, tham số mặc định",
                "level": 2
            },
            {
                "id": "sec-7-3",
                "title": "c) Các mẫu hàm thuật toán chuẩn: Kiểm tra nguyên tố, giai thừa, đối xứng",
                "level": 2
            },
            {
                "id": "sec-7-4",
                "title": "d) Quy trình 4 bước chuẩn giải bài toán lập trình bằng hàm",
                "level": 2
            },
            {
                "id": "sec-8",
                "title": "8. Xử lý Chuỗi ký tự (String) nâng cao",
                "level": 1
            },
            {
                "id": "sec-8-1",
                "title": "a) Các hàm chuỗi: count, find, replace, strip, split, join",
                "level": 2
            },
            {
                "id": "sec-8-2",
                "title": "b) Kỹ thuật đảo ngược xâu s[::-1] & Kiểm tra xâu đối xứng Palindrome",
                "level": 2
            },
            {
                "id": "ghi-nho",
                "title": "Ghi nhớ trọng tâm kiến thức",
                "level": 1
            },
            {
                "id": "luyen-tap",
                "title": "Luyện tập (Bộ 25 câu hỏi trắc nghiệm chuẩn)",
                "level": 1
            },
            {
                "id": "van-dung",
                "title": "Vận dụng & Dự án mini",
                "level": 1
            }
        ],
        "objectives": [
            "Nhận biết và sử dụng thành thạo 4 kiểu dữ liệu chuẩn: int (số nguyên), float (số thực), str (chuỗi ký tự), bool (logic True/False).",
            "Phân biệt và thực hiện chính xác các toán tử: chia thực /, chia nguyên //, chia dư %, lũy thừa **, toán tử gán kết hợp và toán tử logic and, or, not.",
            "Làm chủ cấu trúc rẽ nhánh if - elif - else, nắm vững quy tắc thụt lề (Indentation 4 spaces) và xử lý điều kiện lồng nhau.",
            "Vận dụng vòng lặp for i in range(...) và vòng lặp điều kiện while, điều khiển vòng lặp với break, continue và kỹ thuật in hình sao.",
            "Thao tác chuyên sâu trên Danh sách (List): Đánh chỉ số âm/dương, cắt lát slicing, sử dụng các phương thức append, pop, sort, reverse và kỹ thuật nhập dữ liệu trên một hàng ngang map(int, input().split()).",
            "Xây dựng và thao tác trên Từ điển (Dictionary) dạng Key-Value để tổ chức dữ liệu thực tế (quản lý học sinh, danh bạ, tài khoản ngân hàng).",
            "Định nghĩa hàm def có tham số và trả về kết quả qua return; giải các bài toán thuật toán nền tảng (số nguyên tố, giai thừa, ước chung).",
            "Hiểu khái niệm độ phức tạp thời gian Big-O cơ bản để tối ưu thuật toán tránh lỗi quá thời gian (TLE)."
        ],
        "standards": [
            {
                "level": "Nhận biết",
                "desc": "Nhận biết quy tắc đặt tên biến trong Python; phân biệt toán tử / và //; nhớ cấu trúc khai báo list [], dict {}, def; nhận biết các từ khóa chuẩn."
            },
            {
                "level": "Thông hiểu",
                "desc": "Theo dõi được sự thay đổi giá trị của biến qua từng bước lặp; giải thích được cơ chế hoạt động của hàm range(start, stop, step); hiểu cách truy xuất phần tử theo khóa trong Dictionary và theo chỉ số âm trong List."
            },
            {
                "level": "Vận dụng",
                "desc": "Viết chương trình hoàn chỉnh nhập mảng số trên một dòng, đếm số chẵn lẻ, tìm phần tử lớn nhất - nhỏ nhất, vẽ hình sao tam giác vuông và xây dựng hàm kiểm tra số nguyên tố."
            },
            {
                "level": "Vận dụng cao",
                "desc": "Thiết kế ứng dụng mini quản lý menu (ATM, máy tính cầm tay, danh sách sinh viên); áp dụng công thức cấp số cộng để tính tổng dãy số lớn trong thời gian O(1) tránh TLE."
            }
        ],
        "warmUp": {
            "context": "Python là ngôn ngữ lập trình được sáng lập bởi Guido van Rossum vào năm 1991. Hiện nay Python đứng đầu bảng xếp hạng TIOBE toàn cầu, là ngôn ngữ nền tảng của Trí tuệ Nhân tạo (AI), Khoa học Dữ liệu (Data Science) và Lập trình ứng dụng nhờ triết lý 'Đơn giản, trong sáng và dễ đọc như tiếng Anh'.",
            "question": "Tại sao một đoạn mã Python thường ngắn gọn hơn gấp 2 đến 3 lần so với mã C++ hay Java tương đương? Làm thế nào Python nhận biết một khối lệnh mà không cần đến cặp ngoặc nhọn { }?"
        },
        "mainSections": [
            {
                "id": "sec-1",
                "number": "1.",
                "title": "Tổng quan về Python, Biến & Kiểu dữ liệu cơ bản",
                "content": "Python là ngôn ngữ lập trình bậc cao thông dịch (interpreted language), có cú pháp mạch lạc, hỗ trợ nhiều mô hình lập trình (thủ tục, hướng đối tượng, hàm). Chương trình Python được lưu với phần mở rộng .py và thực thi tuần tự từ trên xuống dưới.",
                "imageUrl": "/images/topics/10_PYTHON/python-intro.jpg",
                "imageCaption": "Môi trường lập trình Python: Cú pháp ngắn gọn, kiểu dữ liệu động linh hoạt",
                "subSections": [
                    {
                        "id": "sec-1-1",
                        "letter": "a)",
                        "title": "Ngôn ngữ Python & Quy tắc đặt tên biến",
                        "content": "Biến (Variable) là tên đại diện cho một vùng nhớ lưu trữ giá trị trong bộ nhớ RAM máy tính. Trong Python, biến không cần khai báo kiểu dữ liệu trước mà tự động nhận kiểu khi gán giá trị.\n\n• Cú pháp khai báo biến: <tên_biến> = <giá_trị>\nVí dụ: x = 10 (biến x tự động có kiểu int), pi = 3.14 (kiểu float), ho_ten = \"Nguyễn Văn A\" (kiểu str).\n\n• 4 Quy tắc vàng khi đặt tên biến trong Python:\n1. Tên biến chỉ được chứa chữ cái (a-z, A-Z), chữ số (0-9) và dấu gạch dưới (_).\n2. Không được bắt đầu bằng chữ số (Ví dụ: 1so là SAI, so1 là ĐÚNG).\n3. Không được trùng với các từ khóa chuẩn của Python (như if, else, for, while, def, class, return, import, in, is, and, or, not...).\n4. Tên biến phân biệt chữ hoa và chữ thường (ví dụ: Diem, diem, DIEM là 3 biến hoàn toàn khác nhau). Nên đặt tên biến ngắn gọn, có ý nghĩa bằng tiếng Việt không dấu (snake_case như diem_toan, tong_tien).",
                        "example": "tuoi = 16\ndiem_trung_binh = 8.75\ntruong = \"THPT Trần Quốc Tuấn\"\nda_tot_nghiep = False",
                        "codeSnippet": "# Khai báo nhiều biến trên một dòng\na, b, c = 1, 2, 3\nprint(a, b, c)  # In ra: 1 2 3\n\n# Hoán đổi giá trị hai biến cực nhanh không cần biến trung gian (Pythonic)\na, b = b, a\nprint(\"Sau hoán đổi:\", a, b)  # In ra: 2 1"
                    },
                    {
                        "id": "sec-1-2",
                        "letter": "b)",
                        "title": "Các kiểu dữ liệu cơ bản & Cơ chế định kiểu động",
                        "content": "Python là ngôn ngữ định kiểu động (dynamic typing). Giá trị của biến quyết định kiểu dữ liệu của biến đó. Khi gán giá trị mới thuộc kiểu khác, biến sẽ tự động chuyển kiểu.\n\n• 4 kiểu dữ liệu cơ bản cốt lõi trong Python:\n1. int (Integer): Kiểu số nguyên không giới hạn độ dài trong Python 3 (Ví dụ: -5, 0, 100, 999999999999).\n2. float (Floating-point): Kiểu số thực dấu phẩy động (Ví dụ: 3.14, -0.05, 2.0, 1.5e3).\n3. str (String): Kiểu chuỗi ký tự, đặt trong cặp dấu nháy đơn '...' hoặc nháy kép \"...\" (Ví dụ: \"Tin học 10\", 'Python').\n4. bool (Boolean): Kiểu logic, chỉ nhận một trong 2 giá trị: True (Đúng) hoặc False (Sai). Lưu ý bắt buộc viết hoa chữ cái đầu (True, False), viết thường true/false sẽ báo lỗi NameError.\n\n• Hàm kiểm tra kiểu: type(tên_biến) trả về kiểu dữ liệu hiện tại của biến.",
                        "codeSnippet": "x = 42\nprint(type(x))  # <class 'int'>\n\nx = 3.14\nprint(type(x))  # <class 'float'>\n\nx = \"Xin chào!\"\nprint(type(x))  # <class 'str'>\n\nx = (5 > 2)\nprint(x, type(x))  # True <class 'bool'>"
                    },
                    {
                        "id": "sec-1-3",
                        "letter": "c)",
                        "title": "Nhập xuất dữ liệu (print, input), ép kiểu & định dạng số thực",
                        "content": "• Xuất dữ liệu với hàm print():\n- Cú pháp: print(*objects, sep=' ', end='\\n')\n- Tham số sep: Ký tự phân cách giữa các phần tử khi in (mặc định là dấu cách ' ').\n- Tham số end: Ký tự kết thúc sau khi in xong (mặc định là '\\n' xuống dòng). Nếu muốn in trên cùng một dòng (ví dụ in dãy số hoặc hình sao), ta đặt end=' ' hoặc end=''.\n\n• Nhập dữ liệu với hàm input():\n- Cú pháp: bien = input(\"Dòng nhắc: \")\n- QUAN TRỌNG: Hàm input() LUÔN LUÔN trả về kiểu chuỗi (str), kể cả khi người dùng gõ vào số 10 thì giá trị nhận được là \"10\". Để thực hiện tính toán số học, BẮT BUỘC phải ép kiểu.\n\n• Các hàm ép kiểu dữ liệu (Type Casting):\n- int(s): Chuyển chuỗi hoặc số thực thành số nguyên (bỏ phần thập phân, int(3.9) = 3).\n- float(s): Chuyển chuỗi hoặc số nguyên thành số thực (float(5) = 5.0).\n- str(x): Chuyển số hoặc logic thành chuỗi (str(123) = \"123\").\n- bool(x): Chuyển giá trị sang logic (0, rỗng \"\", [] thành False; còn lại là True).\n\n• Kỹ thuật nhập nhiều biến trên cùng 1 dòng (chuẩn thi HSG & Olympic):\n- Dùng hàm split() để tách các từ cách nhau bởi dấu cách, sau đó dùng map():\n  a, b = map(int, input().split())\n\n• Định dạng số thực / Làm tròn:\n- Hàm round(so, n): Làm tròn số đến n chữ số thập phân (round(3.14159, 2) = 3.14).\n- Định dạng chuỗi f-string: f\"{x:.2f}\" hoặc toán tử \"% .2f\" % x (in ra đúng 2 chữ số sau dấu phẩy, ví dụ 2.5 in ra 2.50).",
                        "codeSnippet": "# Nhập tuổi và tính năm sinh\ntuoi = int(input(\"Nhập tuổi: \"))\nnam_sinh = 2026 - tuoi\nprint(f\"Năm sinh của bạn là: {nam_sinh}\")\n\n# Nhập 2 số thực a, b trên cùng một dòng\na, b = map(float, input().split())\ntong = a + b\nprint(\"Tổng hai số là: %.2f\" % tong)\n\n# In dãy số từ 1 đến 5 trên cùng một dòng ngang\nfor i in range(1, 6):\n    print(i, end=' ')\n# Kết quả in: 1 2 3 4 5"
                    }
                ],
                "table": {
                    "headers": [
                        "Kiểu dữ liệu",
                        "Tên tiếng Anh",
                        "Giá trị mẫu",
                        "Ví dụ khai báo",
                        "Đặc điểm nhận dạng"
                    ],
                    "rows": [
                        [
                            "Số nguyên",
                            "int (Integer)",
                            "-15, 0, 42, 2026",
                            "n = 100",
                            "Không có dấu chấm thập phân, độ dài vô hạn"
                        ],
                        [
                            "Số thực",
                            "float (Floating point)",
                            "3.14, -0.5, 2.0",
                            "pi = 3.14159",
                            "Có dấu chấm thập phân . hoặc ký hiệu e"
                        ],
                        [
                            "Chuỗi ký tự",
                            "str (String)",
                            "\"Hà Nội\", 'Tin học'",
                            "ten = 'Python'",
                            "Bao bởi cặp dấu nháy đơn '' hoặc nháy kép \"\""
                        ],
                        [
                            "Logic",
                            "bool (Boolean)",
                            "True, False",
                            "is_valid = True",
                            "Chỉ nhận True hoặc False (viết hoa chữ đầu)"
                        ]
                    ]
                }
            },
            {
                "id": "sec-2",
                "number": "2.",
                "title": "Hệ thống Toán tử toàn diện trong Python",
                "content": "Toán tử (Operator) là các ký hiệu đại diện cho các phép biến đổi, tính toán trên các toán hạng (biến, hằng số). Python cung cấp 4 nhóm toán tử cốt lõi: số học, gán, so sánh và logic.",
                "subSections": [
                    {
                        "id": "sec-2-1",
                        "letter": "a)",
                        "title": "Toán tử số học (chia thực /, chia nguyên //, chia dư %, mũ **)",
                        "content": "• Các phép toán số học trong Python:\n+ : Phép cộng số học (hoặc ghép chuỗi: \"Tin\" + \"Path\" -> \"TinPath\").\n- : Phép trừ số học.\n* : Phép nhân số học (hoặc lặp chuỗi: \"Ha\" * 3 -> \"HaHaHa\").\n/ : Phép chia thực. QUAN TRỌNG: Trong Python, kết quả của phép chia / LUÔN LUÔN là kiểu số thực (float), kể cả 4 / 2 kết quả là 2.0 chứ không phải 2.\n// : Phép chia lấy phần nguyên (Floor division). Trả về số nguyên lớn nhất không vượt quá thương số (lấy phần trước dấu phẩy thập phân).\n     Ví dụ: 10 // 3 = 3; 17 // 5 = 3; 7 // 2 = 3.\n% : Phép chia lấy phần dư (Modulus - mod). Trả về số dư của phép chia.\n     Ví dụ: 10 % 3 = 1; 17 % 5 = 2; 8 % 2 = 0 (dùng để kiểm tra số chẵn).\n** : Phép lũy thừa (Exponentiation). a ** b tương đương a^b.\n     Ví dụ: 2 ** 3 = 8; 3 ** 4 = 81; 16 ** 0.5 = 4.0 (căn bậc 2).\n\n• Thứ tự ưu tiên toán tử: Dấu ngoặc tròn () -> Lũy thừa ** -> Nhân/Chia *, /, //, % -> Cộng/Trừ +, -.",
                        "imageUrl": "/images/topics/10_PYTHON/toan-tu-so-hoc.jpg",
                        "imageCaption": "Bảng tra cứu các toán tử số học trong Python (đặc biệt //, %, **)",
                        "codeSnippet": "# Phân tích sự khác biệt giữa /, // và %\na = 17\nb = 5\nprint(\"Chia thực 17 / 5 =\", a / b)    # 3.4 (float)\nprint(\"Chia nguyên 17 // 5 =\", a // b) # 3 (int)\nprint(\"Chia dư 17 % 5 =\", a % b)     # 2 (int)\nprint(\"Lũy thừa 2 ** 4 =\", 2 ** 4)   # 16\n\n# Ứng dụng: Tách chữ số hàng chục và hàng đơn vị của số có 2 chữ số\nn = 47\nchuc = n // 10  # 4\ndon_vi = n % 10 # 7\nprint(f\"Số {n} gồm {chuc} chục và {don_vi} đơn vị\")"
                    },
                    {
                        "id": "sec-2-2",
                        "letter": "b)",
                        "title": "Toán tử gán & Toán tử gán kết hợp số học",
                        "content": "Toán tử gán dùng để lưu một giá trị vào biến.\n• Phép gán cơ bản: biến = biểu_thức\n• Phép gán kết hợp (Augmented Assignment): Kết hợp phép toán số học với phép gán để viết code ngắn gọn và tối ưu tốc độ thực thi:\n- a += b  <=> a = a + b (tăng a lên b đơn vị)\n- a -= b  <=> a = a - b (giảm a đi b đơn vị)\n- a *= b  <=> a = a * b (nhân a với b)\n- a /= b  <=> a = a / b (chia a cho b)\n- a //= b <=> a = a // b (chia lấy nguyên)\n- a %= b  <=> a = a % b (chia lấy dư)\n- a **= b <=> a = a ** b (nâng a lên lũy thừa b)\n\nLưu ý: Python KHÔNG hỗ trợ cú pháp tăng giảm tự động như C++ (không có a++ hoặc ++a). Muốn tăng a lên 1, bắt buộc viết a += 1 hoặc a = a + 1.",
                        "imageUrl": "/images/topics/10_PYTHON/toan-tu-gan.jpg",
                        "imageCaption": "Bảng tra cứu toán tử gán và toán tử gán kết hợp số học trong Python",
                        "codeSnippet": "x = 10\nx += 5   # x = 15\nx *= 2   # x = 30\nx //= 4  # x = 7\nx %= 3   # x = 1\nprint(\"Giá trị cuối cùng của x:\", x) # 1"
                    },
                    {
                        "id": "sec-2-3",
                        "letter": "c)",
                        "title": "Toán tử so sánh & Toán tử logic (and, or, not)",
                        "content": "• Toán tử so sánh: Dùng để so sánh 2 giá trị. Kết quả LUÔN trả về một giá trị Boolean: True hoặc False.\n- == : So sánh bằng nhau (Lưu ý: phân biệt dấu gán = và dấu so sánh bằng ==).\n- != : So sánh khác nhau (không bằng).\n- > : Lớn hơn.\n- < : Nhỏ hơn.\n- >= : Lớn hơn hoặc bằng.\n- <= : Nhỏ hơn hoặc bằng.\n\n• Toán tử logic: Dùng để kết hợp nhiều biểu thức điều kiện so sánh:\n1. and (VÀ): Trả về True KHI VÀ CHỈ KHI cả hai biểu thức con đều True. Chỉ cần một biểu thức con False thì kết quả là False.\n2. or (HOẶC): Trả về True KHI ÍT NHẤT một trong hai biểu thức con True. Chỉ trả về False khi cả hai đều False.\n3. not (PHỦ ĐỊNH): Đảo ngược giá trị logic: not True là False, not False là True.\n\n• Điểm đặc sắc của Python: Hỗ trợ so sánh kép liền mạch cực kỳ tự nhiên, ví dụ: 0 <= diem <= 10 tương đương (diem >= 0) and (diem <= 10).",
                        "images": [
                            {
                                "url": "/images/topics/10_PYTHON/toan-tu-so-sanh.jpg",
                                "caption": "Bảng tra cứu toán tử so sánh trong Python",
                                "alt": "Toán tử so sánh"
                            },
                            {
                                "url": "/images/topics/10_PYTHON/toan-tu-logic.jpg",
                                "caption": "Bảng tra cứu toán tử logic and, or, not trong Python",
                                "alt": "Toán tử logic"
                            }
                        ],
                        "codeSnippet": "dtb = 8.5\nhanh_kiem = \"Tốt\"\n\n# Kiểm tra học sinh xuất sắc: Điểm >= 9.0 VÀ Hạnh kiểm Tốt\nis_xuat_sac = (dtb >= 9.0) and (hanh_kiem == \"Tốt\")\nprint(\"Xuất sắc?\", is_xuat_sac)  # False\n\n# Kiểm tra học sinh giỏi: Điểm >= 8.0 HOẶC Hạnh kiểm Tốt\nis_gioi = (dtb >= 8.0) or (hanh_kiem == \"Tốt\")\nprint(\"Đạt loại Giỏi?\", is_gioi)  # True\n\n# Phủ định\nprint(not (5 > 3))  # not True => False"
                    }
                ]
            },
            {
                "id": "sec-3",
                "number": "3.",
                "title": "Cấu trúc rẽ nhánh điều kiện if - elif - else",
                "content": "Cấu trúc rẽ nhánh cho phép máy tính lựa chọn thực hiện khối lệnh này hay khối lệnh khác tùy thuộc vào điều kiện kiểm tra là True (đúng) hay False (sai).",
                "subSections": [
                    {
                        "id": "sec-3-1",
                        "letter": "a)",
                        "title": "Sơ đồ khối rẽ nhánh & Cú pháp if, if-else, if-elif-else",
                        "content": "Python hỗ trợ 3 dạng câu lệnh rẽ nhánh:\n\n1. Dạng thiếu (if đơn):\nCú pháp:\nif <điều_kiện>:\n    <khối_lệnh>\nGiải thích: Nếu điều kiện đúng (True) thì thực thi khối lệnh; nếu sai (False) thì bỏ qua.\n\n2. Dạng đủ (if - else):\nCú pháp:\nif <điều_kiện>:\n    <khối_lệnh_1>\nelse:\n    <khối_lệnh_2>\nGiải thích: Nếu điều kiện đúng thì chạy khối lệnh 1; nếu sai thì bắt buộc chạy khối lệnh 2 trong nhánh else.\n\n3. Dạng đa nhánh (if - elif - else):\nCú pháp:\nif <điều_kiện_1>:\n    <khối_lệnh_1>\nelif <điều_kiện_2>:\n    <khối_lệnh_2>\nelse:\n    <khối_lệnh_mặc_định>\nGiải thích: Kiểm tra lần lượt từ trên xuống. Điều kiện nào đúng đầu tiên thì khối lệnh tương ứng sẽ được chạy và toàn bộ các nhánh còn lại phía sau sẽ bị bỏ qua. Nếu không có điều kiện nào đúng thì chạy nhánh else cuối cùng.",
                        "imageUrl": "/images/topics/10_PYTHON/so-do-khoi-if-else.png",
                        "imageCaption": "Sơ đồ khối luồng thực thi của cấu trúc rẽ nhánh điều kiện If - Else",
                        "codeSnippet": "# Xếp loại học lực theo điểm trung bình\ndtb = float(input(\"Nhập điểm TB (0-10): \"))\nif dtb >= 8.0:\n    print(\"Học lực: Giỏi\")\nelif dtb >= 6.5:\n    print(\"Học lực: Khá\")\nelif dtb >= 5.0:\n    print(\"Học lực: Trung bình\")\nelse:\n    print(\"Học lực: Yếu/Chưa đạt\")"
                    },
                    {
                        "id": "sec-3-2",
                        "letter": "b)",
                        "title": "Quy tắc thụt lề (Indentation) & Cấu trúc rẽ nhánh lồng nhau",
                        "content": "• Quy tắc thụt đầu dòng (Indentation):\n- Trong các ngôn ngữ như C, C++, Pascal, khối lệnh được bao bởi cặp ngoặc { } hoặc begin - end. Trong Python, các khối lệnh được xác định duy nhất bằng cách THỤT ĐẦU DÒNG (thường là 4 dấu cách space).\n- Dấu hai chấm (:) ở cuối dòng if, elif, else là bắt buộc, báo hiệu khối lệnh con bắt đầu.\n- Mọi câu lệnh trong cùng một khối lệnh con PHẢI có mức thụt lề bằng nhau chính xác. Nếu thụt lề sai, chương trình sẽ báo lỗi IndentationError ngay lập tức.\n\n• Cấu trúc rẽ nhánh lồng nhau (Nested if):\nMột câu lệnh if có thể nằm bên trong một nhánh của câu lệnh if khác để kiểm tra các điều kiện phụ thuộc tuần tự.",
                        "codeSnippet": "# Kiểm tra năm nhuận dương lịch\nnam = int(input(\"Nhập năm: \"))\nif nam % 400 == 0 or (nam % 4 == 0 and nam % 100 != 0):\n    print(f\"Năm {nam} là NĂM NHUẬN (tháng 2 có 29 ngày)\")\nelse:\n    print(f\"Năm {nam} là năm thường (tháng 2 có 28 ngày)\")"
                    },
                    {
                        "id": "sec-3-3",
                        "letter": "c)",
                        "title": "Bài toán thực tế: Máy tính mini & Quản lý số dư ATM",
                        "content": "Dưới đây là mã nguồn ứng dụng thực tế từ Note Python Tháng 6: Hệ thống mô phỏng cây ATM ngân hàng với menu rẽ nhánh quản lý số dư, nạp tiền, rút tiền và kiểm tra số dư hợp lệ.",
                        "codeSnippet": "# Mô phỏng hệ thống quản lý tài khoản ngân hàng ATM (Note Python Tháng 6)\nso_du = 500000.0  # Số dư ban đầu 500.000 VNĐ\n\nprint(\"=== HỆ THỐNG GIAO DỊCH ATM TQT ===\")\nprint(\"0. Thoát chương trình\")\nprint(\"1. Xem số dư hiện tại\")\nprint(\"2. Nạp tiền vào tài khoản\")\nprint(\"3. Rút tiền từ tài khoản\")\n\nchon = int(input(\"Vui lòng chọn chức năng (0-3): \"))\nif chon == 0:\n    print(\"Cảm ơn quý khách đã sử dụng dịch vụ. Tạm biệt!\")\nelif chon == 1:\n    print(f\"Số dư hiện tại của bạn là: {so_du:,.0f} VNĐ\")\nelif chon == 2:\n    nap = float(input(\"Nhập số tiền cần nạp: \"))\n    if nap > 0:\n        so_du += nap\n        print(f\"Nạp thành công! Số dư mới: {so_du:,.0f} VNĐ\")\n    else:\n        print(\"Số tiền nạp không hợp lệ!\")\nelif chon == 3:\n    rut = float(input(\"Nhập số tiền cần rút: \"))\n    if rut <= 0:\n        print(\"Số tiền rút không hợp lệ!\")\n    elif rut > so_du:\n        print(\"Giao dịch thất bại: Số dư trong tài khoản không đủ!\")\n    else:\n        so_du -= rut\n        print(f\"Rút thành công! Số dư còn lại: {so_du:,.0f} VNĐ\")\nelse:\n    print(\"Chức năng lựa chọn không hợp lệ!\")"
                    }
                ]
            },
            {
                "id": "sec-4",
                "number": "4.",
                "title": "Cấu trúc lặp for, while & Kỹ thuật in hình, tính tổng",
                "content": "Cấu trúc lặp giúp lặp đi lặp lại một khối lệnh nhiều lần mà không cần viết lại mã nguồn, tự động hóa các tác vụ tính toán lớn và duyệt tập hợp dữ liệu.",
                "subSections": [
                    {
                        "id": "sec-4-1",
                        "letter": "a)",
                        "title": "Vòng lặp for & Hàm range(start, stop, step)",
                        "content": "Vòng lặp for trong Python dùng để lặp qua một chuỗi tuần tự (danh sách, chuỗi, hoặc một khoảng số sinh bởi hàm range).\n• Cú pháp: for i in range(start, stop, step):\n\n• Nguyên tắc bán mở của hàm range: [start, stop) — bắt đầu từ start nhưng LUÔN DỪNG LẠI trước stop (giá trị cuối cùng được duyệt là stop - 1).\n- Dạng 1 tham số: range(stop) -> Duyệt từ 0 đến stop - 1 (bước nhảy mặc định là 1). Ví dụ: range(5) sinh dãy: 0, 1, 2, 3, 4.\n- Dạng 2 tham số: range(start, stop) -> Duyệt từ start đến stop - 1. Ví dụ: range(1, 6) sinh dãy: 1, 2, 3, 4, 5.\n- Dạng 3 tham số: range(start, stop, step) -> Duyệt từ start đến stop - 1 với bước tăng là step.\n  Ví dụ: range(1, 10, 2) sinh các số lẻ: 1, 3, 5, 7, 9.\n  Bước nhảy âm để đếm ngược: range(5, 0, -1) sinh: 5, 4, 3, 2, 1.",
                        "imageUrl": "/images/topics/10_PYTHON/python-range-loop.png",
                        "imageCaption": "Cơ chế sinh giá trị theo khoảng bán mở của hàm range(start, stop, step)",
                        "codeSnippet": "# Tính tổng các số chẵn từ 2 đến 100\ntong_chan = 0\nfor i in range(2, 101, 2):\n    tong_chan += i\nprint(\"Tổng các số chẵn từ 2 đến 100 là:\", tong_chan)  # 2550\n\n# Duyệt đếm ngược từ 5 về 1\nfor i in range(5, 0, -1):\n    print(i, end=' ')\nprint(\"Xuất phát!\")  # 5 4 3 2 1 Xuất phát!"
                    },
                    {
                        "id": "sec-4-2",
                        "letter": "b)",
                        "title": "Vòng lặp while, vòng lặp vô tận & lệnh break, continue",
                        "content": "• Vòng lặp while:\n- Cú pháp: while <điều_kiện>:\n- Khối lệnh được lặp khi điều kiện còn True. Mỗi lần lặp, điều kiện được kiểm tra lại. Khi điều kiện trở thành False thì vòng lặp kết thúc.\n- Lỗi vòng lặp vô tận (Infinite loop): Xảy ra khi điều kiện luôn True do quên thay đổi giá trị của biến điều kiện bên trong thân vòng lặp (ví dụ quên lệnh i += 1).\n\n• Hai lệnh điều khiển vòng lặp quan trọng:\n- break: Dừng và THOÁT NGAY LẬP TỨC khỏi vòng lặp chứa nó, nhảy đến lệnh kế tiếp sau vòng lặp.\n- continue: BỎ QUA toàn bộ các câu lệnh còn lại trong lần lặp hiện tại và chuyển ngay sang lần lặp kế tiếp.",
                        "codeSnippet": "# Tìm số nguyên dương k nhỏ nhất sao cho 1 + 2 + ... + k > 1000\nk = 1\ntong = 0\nwhile True:\n    tong += k\n    if tong > 1000:\n        break  # Đã đạt mục tiêu, ngắt vòng lặp\n    k += 1\n\nprint(f\"Giá trị k nhỏ nhất là {k} với tổng = {tong}\") # k = 45, tong = 1035\n\n# In các số từ 1 đến 10 nhưng bỏ qua số 5\nfor i in range(1, 11):\n    if i == 5:\n        continue\n    print(i, end=' ') # In: 1 2 3 4 6 7 8 9 10"
                    },
                    {
                        "id": "sec-4-3",
                        "letter": "c)",
                        "title": "Vòng lặp lồng nhau: Kỹ thuật in các mẫu hình sao kinh điển",
                        "content": "Vòng lặp lồng nhau (Nested loops) là kỹ thuật đặt một vòng lặp bên trong thân của một vòng lặp khác. Vòng lặp ngoài duyệt theo từng hàng (row), vòng lặp trong duyệt theo từng cột (column).\n\nDưới đây là 5 bài toán in hình kinh điển từ Note Python Tháng 6:",
                        "codeSnippet": "# Bài 1: Hình vuông sao n x n\nn = 4\nprint(\"=== HÌNH VUÔNG 4x4 ===\")\nfor i in range(n):\n    for j in range(n):\n        print(\"*\", end='')\n    print()\n\n# Bài 2: Tam giác vuông sao cạnh n\nprint(\"=== TAM GIÁC VUÔNG ===\")\nfor i in range(1, n + 1):\n    for j in range(i):\n        print(\"*\", end='')\n    print()\n\n# Bài 3: Tam giác số 1, 12, 123...\nprint(\"=== TAM GIÁC SỐ ===\")\nfor i in range(1, n + 1):\n    for j in range(1, i + 1):\n        print(j, end='')\n    print()\n\n# Bài 4: Tam giác vuông ngược\nprint(\"=== TAM GIÁC NGƯỢC ===\")\nfor i in range(n, 0, -1):\n    print(\"*\" * i)"
                    },
                    {
                        "id": "sec-4-4",
                        "letter": "d)",
                        "title": "Công thức cấp số cộng & Giới thiệu Độ phức tạp thuật toán O(N)",
                        "content": "• Công thức tính tổng dãy số có quy luật (Note Python Tháng 6):\n1. Tổng 1 + 2 + 3 + ... + n = n * (n + 1) // 2\n2. Tổng số lẻ 1 + 3 + 5 + ... + (2n - 1) = n ** 2\n3. Tổng số chẵn 2 + 4 + 6 + ... + 2n = n * (n + 1)\n4. Tổng bình phương 1^2 + 2^2 + ... + n^2 = n * (n + 1) * (2n + 1) // 6\n5. Cấp số cộng: Sn = n * (u1 + un) // 2 hoặc n * (2*u1 + (n - 1)*d) // 2\n\n• Giới thiệu Độ phức tạp thuật toán (Time Complexity / Big-O):\n- Khái niệm: Độ phức tạp không đo thời gian chạy cụ thể bằng giây (vì phụ thuộc máy tính mạnh hay yếu), mà đo TỐC ĐỘ TĂNG số lượng thao tác tính toán khi kích thước dữ liệu đầu vào N tăng lên.\n- 1 vòng lặp từ 1 đến N: Độ phức tạp O(N).\n- 2 vòng lặp lồng nhau (mỗi vòng đến N): Độ phức tạp O(N^2).\n- Thuật toán tìm kiếm nhị phân (chia đôi liên tục): Độ phức tạp O(log N).\n- Áp dụng công thức toán học cấp số cộng: Độ phức tạp O(1) - chạy tức thời.\n\n• Mẹo tối ưu cho đề thi Lập trình (Tránh lỗi TLE - Time Limit Exceeded):\nMỗi giây máy tính thực hiện được khoảng 10^7 đến 10^8 phép tính. Nếu N = 10^9 mà dùng vòng lặp for thì sẽ bị lỗi TLE chắc chắn. Bắt buộc phải áp dụng công thức cấp số cộng O(1) để có kết quả trong 0.001 giây!",
                        "codeSnippet": "# So sánh cách tính tổng từ 1 đến N\nimport time\nn = 10_000_000\n\n# Cách 1: Dùng công thức O(1) - Chạy tức thời\ns_ct = n * (n + 1) // 2\nprint(\"Kết quả O(1):\", s_ct)\n\n# Cách 2: Dùng vòng lặp O(N) - Chạy lâu hơn rất nhiều\n# tong = sum(range(1, n + 1))"
                    }
                ]
            },
            {
                "id": "sec-5",
                "number": "5.",
                "title": "Cấu trúc dữ liệu Danh sách (List)",
                "content": "Danh sách (List) là một trong những cấu trúc dữ liệu quan trọng và mạnh mẽ nhất trong Python. List là một thùng chứa tuần tự lưu trữ được nhiều giá trị có thể thuộc các kiểu dữ liệu khác nhau, các phần tử cách nhau bởi dấu phẩy và đặt trong cặp ngoặc vuông [ ].",
                "subSections": [
                    {
                        "id": "sec-5-1",
                        "letter": "a)",
                        "title": "Khái niệm List, chỉ số Index âm/dương & Cắt lát (Slicing)",
                        "content": "• Đặc tính của List: Có thứ tự, các phần tử có thể trùng lặp, và có thể thay đổi giá trị (mutable).\n\n• Hệ thống đánh chỉ số kép độc đáo của Python:\n- Chỉ số dương (Index >= 0): Đánh số từ trái sang phải, bắt đầu từ 0 cho đến len - 1.\n- Chỉ số âm (Index < 0): Đánh số từ phải sang trái, bắt đầu từ -1 cho phần tử cuối cùng, -2 cho phần tử áp chót, và -len cho phần tử đầu tiên.\nVí dụ: L = [10, 20, 30, 40, 50] thì L[0] = 10, L[-1] = 50.\n\n• Kỹ thuật cắt lát (List Slicing):\n- Cú pháp: L[start : stop : step]\n- Lấy một danh sách con từ chỉ số start đến trước stop (không bao gồm stop).\n- Ví dụ: L[1:4] lấy các phần tử từ chỉ số 1 đến 3.\n- L[:3] lấy từ đầu đến chỉ số 2.\n- L[2:] lấy từ chỉ số 2 đến hết danh sách.\n- L[::-1] kỹ thuật đảo ngược danh sách cực ngắn gọn!",
                        "imageUrl": "/images/topics/10_PYTHON/python-list-indexing.png",
                        "imageCaption": "Sơ đồ đánh chỉ số dương (từ trái qua 0..n-1) và chỉ số âm (từ phải qua -1..-n) trong List",
                        "codeSnippet": "a = [10, 20, 30, 40, 50]\nprint(\"Phần tử đầu:\", a[0])    # 10\nprint(\"Phần tử cuối:\", a[-1])  # 50\nprint(\"Cắt lát a[1:4]:\", a[1:4]) # [20, 30, 40]\nprint(\"Đảo ngược list:\", a[::-1]) # [50, 40, 30, 20, 10]"
                    },
                    {
                        "id": "sec-5-2",
                        "letter": "b)",
                        "title": "Bảng phương thức List cốt lõi: append, insert, remove, pop, sort",
                        "content": "Bảng tổng hợp toàn bộ các phương thức thao tác trên List từ Note Python Tháng 6 & Tháng 7:\n\n• Thêm phần tử:\n- append(x): Thêm phần tử x vào cuối danh sách.\n- insert(i, x): Chèn phần tử x vào vị trí chỉ số i.\n- extend(danh_sach_khac): Nối thêm một danh sách khác vào đuôi danh sách hiện tại.\n\n• Xóa phần tử:\n- remove(x): Xóa phần tử đầu tiên có giá trị bằng x. Báo lỗi ValueError nếu x không tồn tại trong danh sách.\n- pop(i): Xóa và trả về phần tử tại vị trí chỉ số i. Nếu gọi pop() không tham số, sẽ xóa phần tử cuối cùng.\n- clear(): Xóa toàn bộ phần tử, danh sách trở thành rỗng [].\n\n• Tìm kiếm & Sắp xếp:\n- index(x): Trả về vị trí chỉ số xuất hiện đầu tiên của x.\n- count(x): Đếm số lần phần tử x xuất hiện trong danh sách.\n- sort(): Sắp xếp danh sách tăng dần ngay tại chỗ (in-place).\n- sort(reverse=True): Sắp xếp danh sách giảm dần.\n- reverse(): Đảo ngược thứ tự các phần tử trong danh sách.",
                        "codeSnippet": "L = [3, 1, 4, 1, 5, 9]\n\nL.append(2)          # [3, 1, 4, 1, 5, 9, 2]\nL.insert(0, 8)       # [8, 3, 1, 4, 1, 5, 9, 2]\nL.remove(1)          # Xóa số 1 đầu tiên: [8, 3, 4, 1, 5, 9, 2]\nda_xoa = L.pop()     # Xóa phần tử cuối (2)\n\nprint(\"Số lần xuất hiện của số 1:\", L.count(1)) # 1\nL.sort()             # Sắp xếp tăng dần\nprint(\"List sau khi sắp xếp:\", L)"
                    },
                    {
                        "id": "sec-5-3",
                        "letter": "c)",
                        "title": "Các hàm dựng sẵn: len, sum, max, min & Kỹ thuật nhập mảng 1 dòng",
                        "content": "• Các hàm tích hợp sẵn tiện lợi:\n- len(L): Trả về số lượng phần tử (độ dài của list).\n- sum(L): Tính tổng tất cả các phần tử trong danh sách số.\n- max(L): Tìm phần tử có giá trị lớn nhất trong danh sách.\n- min(L): Tìm phần tử có giá trị nhỏ nhất trong danh sách.\n- x in L: Kiểm tra phần tử x có nằm trong list hay không (trả về True/False).\n- list(set(L)): Kỹ thuật loại bỏ các phần tử trùng lặp trong List.\n\n• Kỹ thuật nhập mảng số nguyên từ một dòng (Chuẩn đề thi):\nA = list(map(int, input().split()))",
                        "codeSnippet": "# Nhập mảng A từ bàn phím trên một dòng ngang\n# Ví dụ nhập: 12 45 7 89 23 45\nA = [12, 45, 7, 89, 23, 45]\nprint(\"Độ dài mảng:\", len(A))\nprint(\"Phần tử lớn nhất:\", max(A))\nprint(\"Phần tử nhỏ nhất:\", min(A))\nprint(\"Tổng các phần tử:\", sum(A))\nprint(\"Trung bình cộng:\", sum(A) / len(A))\n\n# Đếm và tách số chẵn - lẻ (Note Python Tháng 7)\nchan = [x for x in A if x % 2 == 0]\nle = [x for x in A if x % 2 != 0]\nprint(\"Các số chẵn:\", chan)\nprint(\"Các số lẻ:\", le)"
                    }
                ],
                "table": {
                    "headers": [
                        "Phương thức",
                        "Cú pháp mẫu",
                        "Ý nghĩa / Tác dụng",
                        "Ví dụ kết quả"
                    ],
                    "rows": [
                        [
                            "append",
                            "L.append(x)",
                            "Thêm x vào vị trí cuối cùng",
                            "[1, 2].append(3) => [1, 2, 3]"
                        ],
                        [
                            "insert",
                            "L.insert(i, x)",
                            "Chèn x vào chỉ số i",
                            "[1, 3].insert(1, 2) => [1, 2, 3]"
                        ],
                        [
                            "remove",
                            "L.remove(x)",
                            "Xóa giá trị x đầu tiên gặp",
                            "[1, 2, 2].remove(2) => [1, 2]"
                        ],
                        [
                            "pop",
                            "L.pop(i)",
                            "Xóa phần tử ở vị trí i (mặc định cuối)",
                            "[10, 20].pop() => 20"
                        ],
                        [
                            "count",
                            "L.count(x)",
                            "Đếm số lần xuất hiện của x",
                            "[1, 2, 1, 1].count(1) => 3"
                        ],
                        [
                            "sort",
                            "L.sort()",
                            "Sắp xếp tăng dần tại chỗ",
                            "[3, 1, 2].sort() => [1, 2, 3]"
                        ],
                        [
                            "reverse",
                            "L.reverse()",
                            "Đảo ngược danh sách tại chỗ",
                            "[1, 2, 3].reverse() => [3, 2, 1]"
                        ],
                        [
                            "clear",
                            "L.clear()",
                            "Xóa sạch toàn bộ phần tử",
                            "[1, 2].clear() => []"
                        ]
                    ]
                }
            },
            {
                "id": "sec-6",
                "number": "6.",
                "title": "Cấu trúc dữ liệu Từ điển (Dictionary)",
                "content": "Danh sách (List) rất tốt để lưu trữ dữ liệu tuần tự, nhưng không phù hợp khi một đối tượng có nhiều thuộc tính khác nhau (ví dụ: một học sinh gồm mã định danh, họ tên, ngày sinh, điểm số). Để lưu trữ dữ liệu có cấu trúc ánh xạ rõ ràng, Python cung cấp kiểu dữ liệu Từ điển (Dictionary).",
                "subSections": [
                    {
                        "id": "sec-6-1",
                        "letter": "a)",
                        "title": "Khái niệm Dictionary, tính chất của Khóa (Key) và Giá trị (Value)",
                        "content": "• Cấu trúc Dictionary:\nTrong từ điển, mỗi phần tử được lưu dưới dạng một cặp: <khóa> : <giá_trị> (<key> : <value>).\nCác phần tử được phân cách nhau bởi dấu phẩy và đặt trong cặp ngoặc nhọn { }.\n\n• 4 Đặc tính sống còn của Dictionary:\n1. Khóa (Key) phải là duy nhất: Mỗi khóa chỉ được xuất hiện đúng một lần trong từ điển. Nếu gán lại khóa đã có, giá trị cũ sẽ bị ghi đè.\n2. Khóa (Key) phải thuộc kiểu dữ liệu bất biến (immutable, hashable) như str, int, float, tuple. Không thể dùng List làm khóa.\n3. Giá trị (Value) có thể mang bất kỳ kiểu dữ liệu nào (số, chuỗi, list, hoặc thậm chí một dictionary khác) và các giá trị có thể trùng nhau.\n4. Truy xuất dữ liệu theo Khóa (Key) với tốc độ O(1) cực nhanh, không phụ thuộc vào vị trí hay số lượng phần tử.",
                        "imageUrl": "/images/topics/10_PYTHON/python-dict-structure.png",
                        "imageCaption": "Cấu trúc lưu trữ dữ liệu dạng cặp Khóa : Giá trị (Key : Value) trong Dictionary",
                        "codeSnippet": "# Khai báo từ điển thông tin học sinh (Note Python Tháng 6 & 7)\nhoc_sinh = {\n    \"ma_hs\": \"HS001\",\n    \"ho_ten\": \"Nguyễn Văn An\",\n    \"tuoi\": 16,\n    \"lop\": \"10A1\",\n    \"diem_tb\": 8.8\n}\nprint(hoc_sinh)"
                    },
                    {
                        "id": "sec-6-2",
                        "letter": "b)",
                        "title": "Khởi tạo, truy xuất, cập nhật, thêm mới và xóa phần tử",
                        "content": "• Khởi tạo từ điển: Dùng cú pháp d = {} hoặc d = dict().\n\n• Truy xuất giá trị theo khóa:\n- Cách 1: d[key] — Nếu key không tồn tại sẽ báo lỗi KeyError.\n- Cách 2: d.get(key, default) — An toàn hơn, nếu key không tồn tại sẽ trả về giá trị default (hoặc None) chứ không làm dừng chương trình.\n\n• Thêm mới hoặc Cập nhật giá trị:\n- Cú pháp: d[key] = value\n- Nếu key chưa có: Từ điển tự động thêm cặp key: value mới.\n- Nếu key đã có: Giá trị tương ứng với key đó sẽ được cập nhật giá trị mới.\n\n• Xóa phần tử:\n- del d[key]: Xóa cặp key: value ra khỏi từ điển.\n- d.pop(key): Xóa key và trả về giá trị vừa bị xóa.",
                        "codeSnippet": "sv = {\"ten\": \"Lê Bình\", \"tuoi\": 16, \"dia_chi\": \"Quảng Ngãi\"}\n\n# Truy cập\nprint(\"Họ tên:\", sv[\"ten\"])               # Lê Bình\nprint(\"Điện thoại:\", sv.get(\"sdt\", \"Chưa có\")) # Chưa có\n\n# Cập nhật giá trị đã có\nsv[\"tuoi\"] = 17\n\n# Thêm thuộc tính mới\nsv[\"truong\"] = \"THPT Trần Quốc Tuấn\"\n\n# Xóa thuộc tính\ndel sv[\"dia_chi\"]\n\nprint(\"Từ điển sau khi sửa đổi:\", sv)"
                    },
                    {
                        "id": "sec-6-3",
                        "letter": "c)",
                        "title": "Duyệt Dictionary & Ứng dụng quản lý danh sách học sinh",
                        "content": "• Các phương thức duyệt Dictionary:\n- for k in d: hoặc for k in d.keys(): Duyệt qua tất cả các Khóa.\n- for v in d.values(): Duyệt qua tất cả các Giá trị.\n- for k, v in d.items(): Duyệt đồng thời cả Khóa và Giá trị.\n\n• Ứng dụng đếm tần suất xuất hiện của các phần tử:\nMột bài toán kinh điển trong các kỳ thi là đếm xem mỗi số hoặc mỗi từ xuất hiện bao nhiêu lần. Dùng Dictionary giải bài toán này với độ phức tạp tối ưu O(N).",
                        "codeSnippet": "# Đếm số lần xuất hiện của từng phần tử trong danh sách\nday_so = [1, 2, 3, 2, 1, 4, 2, 5, 1, 2]\ntan_suat = {}\n\nfor so in day_so:\n    if so in tan_suat:\n        tan_suat[so] += 1\n    else:\n        tan_suat[so] = 1\n\nprint(\"Tần suất xuất hiện:\")\nfor k, v in tan_suat.items():\n    print(f\"Số {k} xuất hiện {v} lần\")"
                    }
                ]
            },
            {
                "id": "sec-7",
                "number": "7.",
                "title": "Định nghĩa & Sử dụng Hàm (Function def)",
                "content": "Hàm (Function) là một khối mã lệnh có tên gọi, được định nghĩa một lần và có thể gọi thực thi nhiều lần ở các vị trí khác nhau trong chương trình. Hàm giúp mã nguồn module hóa, tránh trùng lặp code (nguyên lý DRY - Don't Repeat Yourself) và dễ kiểm thử, bảo trì.",
                "subSections": [
                    {
                        "id": "sec-7-1",
                        "letter": "a)",
                        "title": "Cú pháp def, tham số và giá trị trả về return",
                        "content": "• Cú pháp định nghĩa hàm:\ndef <tên_hàm>(<tham_số_1>, <tham_số_2>, ...):\n    <khối_lệnh_xử_lý>\n    return <giá_trị_trả_về>\n\n• Thành phần của hàm:\n1. Từ khóa def: Báo hiệu định nghĩa hàm mới.\n2. Tên hàm: Đặt theo quy tắc đặt tên biến (chữ thường, gạch dưới).\n3. Tham số (Parameters): Các biến nhận dữ liệu truyền vào khi hàm được gọi.\n4. Khối lệnh: Thụt lề 4 khoảng trắng.\n5. Lệnh return: Trả giá trị kết quả về cho nơi gọi hàm và kết thúc hàm ngay lập tức. Nếu hàm không có lệnh return, nó ngầm định trả về giá trị đặc biệt None.\n\n• Phân biệt print() và return:\n- print() chỉ in kết quả ra màn hình để người dùng đọc, chương trình không thể lấy kết quả đó để tiếp tục tính toán.\n- return gửi giá trị về cho biến lưu trữ để tiếp tục tham gia vào các phép tính khác.",
                        "imageUrl": "/images/topics/10_PYTHON/python-function-def.png",
                        "imageCaption": "Cấu trúc định nghĩa hàm với từ khóa def, danh sách tham số và giá trị trả về return",
                        "codeSnippet": "# Định nghĩa hàm tính diện tích hình chữ nhật\ndef tinh_dien_tich_hcn(dai, rong):\n    dt = dai * rong\n    return dt\n\n# Gọi hàm và sử dụng kết quả trả về\ns1 = tinh_dien_tich_hcn(5, 3)\ns2 = tinh_dien_tich_hcn(10, 4)\ntong_dien_tich = s1 + s2\nprint(\"Tổng diện tích 2 hình chữ nhật:\", tong_dien_tich)  # 55"
                    },
                    {
                        "id": "sec-7-2",
                        "letter": "b)",
                        "title": "Phân loại hàm: Không tham số, có tham số, tham số mặc định",
                        "content": "• 4 dạng hàm phổ biến:\n1. Hàm không có tham số: Dùng để in thực đơn menu, lời chào mẫu.\n2. Hàm có 1 hoặc nhiều tham số bắt buộc.\n3. Hàm có tham số mặc định (Default Argument): Cho phép gán giá trị mặc định cho tham số nếu lúc gọi hàm không truyền giá trị vào.\n   Ví dụ: def chao(ten, loi_chao=\"Xin chào\"):\n4. Biến cục bộ (Local variable) và Biến toàn cục (Global variable):\n   - Biến khai báo bên trong hàm là biến cục bộ, chỉ tồn tại khi hàm đang chạy, bên ngoài hàm không thể truy cập.\n   - Biến khai báo ngoài hàm là biến toàn cục, có thể đọc ở mọi nơi.",
                        "codeSnippet": "# Hàm có tham số mặc định\ndef tinh_luong(so_gio, don_gia=50000):\n    return so_gio * don_gia\n\nprint(\"Lương mặc định:\", tinh_luong(8))        # 8 * 50000 = 400.000\nprint(\"Lương ca đêm:\", tinh_luong(8, 70000))  # 8 * 70000 = 560.000"
                    },
                    {
                        "id": "sec-7-3",
                        "letter": "c)",
                        "title": "Các mẫu hàm thuật toán chuẩn: Kiểm tra nguyên tố, giai thừa, đối xứng",
                        "content": "Dưới đây là các hàm mẫu chuẩn thường xuyên xuất hiện trong các bài kiểm tra và kỳ thi Tin học THPT:",
                        "codeSnippet": "# 1. Hàm kiểm tra số chẵn lẻ\ndef is_even(n):\n    return n % 2 == 0\n\n# 2. Hàm kiểm tra số nguyên tố tối ưu (chạy đến căn bậc 2 của n)\ndef is_prime(n):\n    if n < 2:\n        return False\n    for i in range(2, int(n ** 0.5) + 1):\n        if n % i == 0:\n            return False\n    return True\n\n# 3. Hàm tính giai thừa n! (Note Python Tháng 7)\ndef tinh_giai_thua(n):\n    if n <= 1:\n        return 1\n    gt = 1\n    for i in range(2, n + 1):\n        gt *= i\n    return gt\n\n# 4. Hàm kiểm tra xâu đối xứng (Palindrome)\ndef is_palindrome(s):\n    return s == s[::-1]\n\nprint(\"17 có phải số nguyên tố?\", is_prime(17))        # True\nprint(\"Giai thừa của 5:\", tinh_giai_thua(5))           # 120\nprint(\"radar có đối xứng?\", is_palindrome(\"radar\"))    # True"
                    },
                    {
                        "id": "sec-7-4",
                        "letter": "d)",
                        "title": "Quy trình 4 bước chuẩn giải bài toán lập trình bằng hàm",
                        "content": "Trích Note Python Tháng 7: Để giải một bài tập lập trình một cách khoa học, chuyên nghiệp và tránh sai sót, hãy tuân theo quy trình 4 bước chuẩn sau:\n\n• Bước 1: Phân tích Input & Output\n- Xác định rõ dữ liệu vào gồm những gì, kiểu dữ liệu gì (int, float, chuỗi hay mảng số).\n- Xác định kết quả đầu ra cần in ra theo định dạng nào.\n\n• Bước 2: Thiết kế và Viết hàm xử lý nghiệp vụ\n- Đặt tên hàm ngắn gọn, súc tích, mô tả đúng chức năng.\n- Định nghĩa các tham số cần thiết và viết thuật toán bên trong thân hàm, dùng return để trả kết quả.\n\n• Bước 3: Đọc dữ liệu từ bàn phím và Gọi hàm\n- Dùng input() và ép kiểu hoặc map(int, input().split()).\n- Truyền dữ liệu vừa nhập vào hàm để tính toán.\n\n• Bước 4: Định dạng và Xuất kết quả\n- Dùng print() kết hợp f-string hoặc định dạng số thập phân để in ra đúng yêu cầu của đề bài.",
                        "codeSnippet": "# Ví dụ áp dụng quy trình 4 bước: Tính tổng các ước số dương của n\n\n# Bước 2: Viết hàm tính tổng ước\ndef tong_uoc_so(n):\n    tong = 0\n    for i in range(1, n + 1):\n        if n % i == 0:\n            tong += i\n    return tong\n\n# Bước 1 & 3: Nhập Input và gọi hàm\nso_n = 12  # Giả sử người dùng nhập 12\nket_qua = tong_uoc_so(so_n)\n\n# Bước 4: Xuất kết quả Output\nprint(f\"Tổng các ước số của {so_n} là: {ket_qua}\")  # 1+2+3+4+6+12 = 28"
                    }
                ]
            },
            {
                "id": "sec-8",
                "number": "8.",
                "title": "Xử lý Chuỗi ký tự (String) nâng cao",
                "content": "Chuỗi ký tự (String) trong Python là một dãy tuần tự các ký tự, được bao bởi dấu nháy đơn '...' hoặc nháy kép \"...\". Chuỗi là kiểu dữ liệu bất biến (immutable) - không thể thay đổi từng ký tự tại chỗ như List, nhưng có hệ thống phương thức xử lý văn bản cực kỳ mạnh mẽ.",
                "subSections": [
                    {
                        "id": "sec-8-1",
                        "letter": "a)",
                        "title": "Các hàm chuỗi: count, find, replace, strip, split, join",
                        "content": "Các phương thức xử lý chuỗi thông dụng nhất (Note Python Tháng 7):\n\n• Tìm kiếm & Thống kê:\n- s.count(sub): Đếm số lần xuất hiện của chuỗi con sub trong s.\n- s.find(sub): Tìm vị trí chỉ số xuất hiện đầu tiên của chuỗi con sub. Nếu không tìm thấy, hàm trả về -1 (không gây lỗi).\n\n• Biến đổi & Làm sạch chuỗi:\n- s.replace(old, new): Thay thế tất cả các chuỗi old thành chuỗi new.\n- s.strip(): Xóa bỏ tất cả các khoảng trắng thừa ở hai đầu chuỗi.\n- s.lower(): Chuyển toàn bộ chuỗi thành chữ thường.\n- s.upper(): Chuyển toàn bộ chuỗi thành chữ hoa.\n- s.title(): Viết hoa chữ cái đầu tiên của mỗi từ (chuẩn hóa họ tên).\n\n• Tách & Nối chuỗi:\n- s.split(sep): Tách chuỗi s thành một danh sách các từ dựa trên ký tự phân cách sep (mặc định là dấu cách).\n- sep.join(list_str): Nối một danh sách các chuỗi thành một chuỗi duy nhất, ngăn cách bởi ký tự sep.\n\n• Kiểm tra tính chất ký tự:\n- s.isdigit(): Kiểm tra chuỗi có toàn là chữ số hay không.\n- s.isalpha(): Kiểm tra chuỗi có toàn là chữ cái hay không.",
                        "codeSnippet": "s = \"  Tin học Lớp 10 THPT Trần Quốc Tuấn  \"\n\n# Làm sạch khoảng trắng\ns_clean = s.strip()\nprint(\"Chuỗi sau làm sạch:\", s_clean)\n\n# Đếm từ\nprint(\"Số chữ 'T' (hoa):\", s_clean.count(\"T\")) # 3\n\n# Tách từ\nwords = s_clean.split()\nprint(\"Danh sách từ:\", words)\nprint(\"Số lượng từ:\", len(words))\n\n# Nối lại bằng dấu gạch ngang\ns_slug = \"-\".join(words)\nprint(\"Nối từ:\", s_slug)  # Tin-học-Lớp-10-THPT-Trần-Quốc-Tuấn"
                    },
                    {
                        "id": "sec-8-2",
                        "letter": "b)",
                        "title": "Kỹ thuật đảo ngược xâu s[::-1] & Kiểm tra xâu đối xứng Palindrome",
                        "content": "• Cắt lát trên chuỗi:\nGiống như List, chuỗi ký tự hỗ trợ chỉ số âm và cắt lát s[start:stop:step].\nĐể đảo ngược một chuỗi ký tự trong Python, cách ngắn gọn và hiệu quả nhất là sử dụng bước nhảy âm step = -1: s[::-1].\n\n• Kiểm tra xâu đối xứng (Palindrome):\nXâu đối xứng là xâu đọc từ trái sang phải hay từ phải sang trái đều giống hệt nhau (ví dụ: 'madam', 'radar', '12321').\nTrong Python, chỉ cần kiểm tra s == s[::-1].",
                        "codeSnippet": "# Kiểm tra xâu đối xứng không phân biệt hoa thường và khoảng trắng\ndef kiem_tra_doi_xung(van_ban):\n    s = van_ban.lower().replace(\" \", \"\")\n    return s == s[::-1]\n\nprint(kiem_tra_doi_xung(\"A ba\"))    # True (sau khi chuẩn hóa thành 'aba')\nprint(kiem_tra_doi_xung(\"Python\"))  # False"
                    }
                ],
                "table": {
                    "headers": [
                        "Phương thức",
                        "Cú pháp mẫu",
                        "Công dụng chính",
                        "Ví dụ kết quả"
                    ],
                    "rows": [
                        [
                            "count",
                            "s.count(sub)",
                            "Đếm số lần xuất hiện của chuỗi con sub",
                            "'banana'.count('a') => 3"
                        ],
                        [
                            "find",
                            "s.find(sub)",
                            "Tìm vị trí đầu tiên của sub (-1 nếu không có)",
                            "'python'.find('th') => 2"
                        ],
                        [
                            "replace",
                            "s.replace(old, new)",
                            "Thay thế chuỗi con old thành new",
                            "'c++'.replace('+', '#') => 'c##'"
                        ],
                        [
                            "strip",
                            "s.strip()",
                            "Xóa khoảng trắng thừa ở hai đầu",
                            "' hello '.strip() => 'hello'"
                        ],
                        [
                            "split",
                            "s.split()",
                            "Tách chuỗi thành danh sách các từ",
                            "'a b c'.split() => ['a', 'b', 'c']"
                        ],
                        [
                            "join",
                            "'-'.join(list)",
                            "Nối danh sách chuỗi thành 1 chuỗi",
                            "'-'.join(['x','y']) => 'x-y'"
                        ],
                        [
                            "isdigit",
                            "s.isdigit()",
                            "Kiểm tra chuỗi có hoàn toàn là số",
                            "'2026'.isdigit() => True"
                        ]
                    ]
                }
            }
        ],
        "memoryNotes": [
            "Python phân biệt chữ HOA và chữ thường; quy tắc thụt lề 4 khoảng trắng (Indentation) là bắt buộc để xác định khối lệnh.",
            "Hàm input() LUÔN LUÔN trả về kiểu chuỗi (str). Muốn tính toán số học bắt buộc phải ép kiểu int(input()) hoặc float(input()).",
            "Toán tử chia thực / luôn trả về kiểu float; phép chia nguyên // lấy phần nguyên; phép chia dư % lấy phần dư; phép lũy thừa ** tính số mũ.",
            "Hàm range(start, stop, step) tuân thủ nguyên lý bán mở: luôn dừng lại trước stop (phần tử cuối là stop - 1).",
            "List [] là danh sách có thể thay đổi (mutable); chỉ số âm L[-1] là phần tử cuối cùng; cắt lát L[::-1] giúp đảo ngược danh sách tức thời.",
            "Dictionary {} lưu dữ liệu dạng cặp Khóa : Giá trị (Key : Value). Khóa phải là duy nhất và bất biến. Truy cập khóa có tốc độ O(1).",
            "Hàm def giúp module hóa chương trình; lệnh return trả kết quả về cho biểu thức gọi hàm và kết thúc hàm ngay lập tức.",
            "Độ phức tạp Big-O: Khi N <= 10^6 có thể duyệt 1 vòng for O(N); khi N lớn (N >= 10^8) phải dùng công thức toán học O(1) để tránh TLE."
        ],
        "practiceQuestions": [
            {
                "id": "10py-q1",
                "question": "Câu 1. Trong các tên biến sau đây trong Python, tên biến nào là HỢP LỆ?",
                "options": {
                    "A": "2so_nguyen",
                    "B": "_diem_tong_ket",
                    "C": "class",
                    "D": "diem-toan"
                },
                "correctAnswer": "B",
                "explanation": "Tên biến hợp lệ trong Python chỉ chứa chữ cái, chữ số và dấu gạch dưới, không được bắt đầu bằng chữ số (A sai), không được chứa dấu gạch ngang (D sai), và không được trùng từ khóa chuẩn (C trùng từ khóa class)."
            },
            {
                "id": "10py-q2",
                "question": "Câu 2. Kết quả của đoạn mã Python sau là gì?\nx = 19 // 4\ny = 19 % 4\nz = 2 ** 3\nprint(x, y, z)",
                "options": {
                    "A": "4 3 8",
                    "B": "4.75 3 6",
                    "C": "4 3 6",
                    "D": "3 4 8"
                },
                "correctAnswer": "A",
                "explanation": "19 chia 4 bằng 4 dư 3. Phép chia lấy nguyên // trả về 4, phép chia lấy dư % trả về 3. Phép lũy thừa 2 ** 3 = 8. Vậy kết quả in ra là 4 3 8."
            },
            {
                "id": "10py-q3",
                "question": "Câu 3. Trong Python, câu lệnh a = int(input()) dùng để làm gì?",
                "options": {
                    "A": "In số nguyên a ra màn hình.",
                    "B": "Nhập một chuỗi ký tự bất kỳ từ bàn phím gán cho a.",
                    "C": "Nhập một giá trị từ bàn phím và ép kiểu thành số nguyên lưu vào biến a.",
                    "D": "Kiểm tra xem biến a có phải là số nguyên hay không."
                },
                "correctAnswer": "C",
                "explanation": "Hàm input() nhận dữ liệu nhập từ bàn phím dưới dạng chuỗi (str), sau đó hàm int(...) thực hiện ép kiểu chuỗi đó thành số nguyên và gán cho biến a."
            },
            {
                "id": "10py-q4",
                "question": "Câu 4. Kết quả của phép toán 10 / 2 trong Python trả về giá trị và kiểu dữ liệu nào?",
                "options": {
                    "A": "5 thuộc kiểu int",
                    "B": "5.0 thuộc kiểu float",
                    "C": "5 thuộc kiểu float",
                    "D": "'5' thuộc kiểu str"
                },
                "correctAnswer": "B",
                "explanation": "Trong Python, kết quả của toán tử chia thực / LUÔN LUÔN là một số thực kiểu float, do đó 10 / 2 trả về 5.0."
            },
            {
                "id": "10py-q5",
                "question": "Câu 5. Đoạn mã sau in ra kết quả gì?\na = 10\nb = 5\na += b * 2\nprint(a)",
                "options": {
                    "A": "30",
                    "B": "20",
                    "C": "25",
                    "D": "15"
                },
                "correctAnswer": "B",
                "explanation": "Phép toán b * 2 = 10 được thực hiện trước. Sau đó phép gán kết hợp a += 10 tương đương a = 10 + 10 = 20."
            },
            {
                "id": "10py-q6",
                "question": "Câu 6. Biểu thức logic nào sau đây kiểm tra số nguyên n là số có 2 chữ số?",
                "options": {
                    "A": "n >= 10 or n <= 99",
                    "B": "10 <= n <= 99",
                    "C": "n > 9 and n < 100",
                    "D": "Cả B và C đều đúng"
                },
                "correctAnswer": "D",
                "explanation": "Trong Python, cú pháp so sánh kép 10 <= n <= 99 và n > 9 and n < 100 đều đúng và tương đương nhau."
            },
            {
                "id": "10py-q7",
                "question": "Câu 7. Vòng lặp for i in range(3, 10, 2) sẽ duyệt qua các giá trị nào của biến i?",
                "options": {
                    "A": "3, 5, 7, 9",
                    "B": "3, 5, 7, 9, 11",
                    "C": "3, 4, 5, 6, 7, 8, 9",
                    "D": "5, 7, 9"
                },
                "correctAnswer": "A",
                "explanation": "Hàm range(3, 10, 2) bắt đầu từ 3, bước nhảy 2 và dừng trước 10 => các giá trị sinh ra là 3, 5, 7, 9."
            },
            {
                "id": "10py-q8",
                "question": "Câu 8. Vòng lặp for i in range(5, 0, -1) thực hiện bao nhiêu lần lặp?",
                "options": {
                    "A": "4 lần lặp",
                    "B": "5 lần lặp",
                    "C": "6 lần lặp",
                    "D": "0 lần lặp"
                },
                "correctAnswer": "B",
                "explanation": "Với bước nhảy âm -1, hàm range(5, 0, -1) sinh các giá trị 5, 4, 3, 2, 1 (dừng trước 0) => thực hiện đúng 5 lần lặp."
            },
            {
                "id": "10py-q9",
                "question": "Câu 9. Câu lệnh nào dùng để thoát khỏi vòng lặp ngay lập tức?",
                "options": {
                    "A": "continue",
                    "B": "pass",
                    "C": "break",
                    "D": "return"
                },
                "correctAnswer": "C",
                "explanation": "Lệnh break dùng để thoát khỏi vòng lặp ngay lập tức; lệnh continue chỉ bỏ qua lần lặp hiện tại."
            },
            {
                "id": "10py-q10",
                "question": "Câu 10. Cho danh sách L = [10, 20, 30, 40, 50]. Giá trị của L[-2] là:",
                "options": {
                    "A": "20",
                    "B": "30",
                    "C": "40",
                    "D": "50"
                },
                "correctAnswer": "C",
                "explanation": "Chỉ số âm đếm từ phải qua trái bắt đầu từ -1: L[-1] = 50, L[-2] = 40."
            },
            {
                "id": "10py-q11",
                "question": "Câu 11. Cho danh sách A = [1, 2, 3, 4, 5]. Biểu thức A[1:4] trả về kết quả nào?",
                "options": {
                    "A": "[1, 2, 3]",
                    "B": "[2, 3, 4]",
                    "C": "[2, 3, 4, 5]",
                    "D": "[1, 2, 3, 4]"
                },
                "correctAnswer": "B",
                "explanation": "Cắt lát A[1:4] lấy các phần tử từ chỉ số 1 đến 3 (chỉ số 1 là 2, chỉ số 2 là 3, chỉ số 3 là 4) => kết quả là [2, 3, 4]."
            },
            {
                "id": "10py-q12",
                "question": "Câu 12. Phương thức nào dùng để thêm một phần tử vào vị trí cuối cùng của List?",
                "options": {
                    "A": "L.insert(x)",
                    "B": "L.push(x)",
                    "C": "L.append(x)",
                    "D": "L.add(x)"
                },
                "correctAnswer": "C",
                "explanation": "Trong Python, phương thức L.append(x) thêm phần tử x vào cuối danh sách. L.insert(i, x) chèn tại vị trí i."
            },
            {
                "id": "10py-q13",
                "question": "Câu 13. Sự khác nhau giữa L.remove(x) và L.pop(i) là gì?",
                "options": {
                    "A": "remove(x) xóa theo giá trị; pop(i) xóa theo vị trí chỉ số.",
                    "B": "remove(x) xóa theo chỉ số; pop(i) xóa theo giá trị.",
                    "C": "Hai phương thức này hoàn toàn giống nhau.",
                    "D": "pop(i) không làm thay đổi danh sách ban đầu."
                },
                "correctAnswer": "A",
                "explanation": "L.remove(x) tìm và xóa phần tử đầu tiên có giá trị bằng x. L.pop(i) xóa phần tử ở vị trí chỉ số i và trả về phần tử đó."
            },
            {
                "id": "10py-q14",
                "question": "Câu 14. Cho danh sách L = [5, 2, 9, 1, 7]. Để sắp xếp danh sách L theo thứ tự giảm dần, ta dùng lệnh:",
                "options": {
                    "A": "L.sort()",
                    "B": "L.sort(reverse=True)",
                    "C": "L.reverse()",
                    "D": "sorted(L)"
                },
                "correctAnswer": "B",
                "explanation": "L.sort() sắp xếp tăng dần; để sắp xếp giảm dần ta truyền tham số reverse=True: L.sort(reverse=True)."
            },
            {
                "id": "10py-q15",
                "question": "Câu 15. Câu lệnh nào dùng để nhập một danh sách các số nguyên trên cùng một dòng ngang cách nhau bởi dấu cách?",
                "options": {
                    "A": "A = input().split()",
                    "B": "A = list(input())",
                    "C": "A = list(map(int, input().split()))",
                    "D": "A = [int(input())]"
                },
                "correctAnswer": "C",
                "explanation": "Hàm input().split() tách dòng nhập thành danh sách các chuỗi, map(int, ...) ép kiểu từng chuỗi thành số nguyên, và list(...) đóng gói lại thành mảng số nguyên."
            },
            {
                "id": "10py-q16",
                "question": "Câu 16. Trong Dictionary của Python, khẳng định nào sau đây là ĐÚNG?",
                "options": {
                    "A": "Khóa (Key) có thể bị trùng lặp nhiều lần.",
                    "B": "Khóa (Key) phải là duy nhất và thuộc kiểu dữ liệu bất biến (immutable).",
                    "C": "Giá trị (Value) bắt buộc phải là duy nhất.",
                    "D": "Không thể thay đổi giá trị của một khóa sau khi đã tạo."
                },
                "correctAnswer": "B",
                "explanation": "Trong Dictionary, mỗi Khóa (Key) là duy nhất và phải thuộc kiểu bất biến (như str, int, tuple). Giá trị (Value) có thể trùng nhau và có thể cập nhật."
            },
            {
                "id": "10py-q17",
                "question": "Câu 17. Cho d = {'ten': 'Hoa', 'tuoi': 16}. Câu lệnh d['lop'] = '10A' sẽ thực hiện thao tác gì?",
                "options": {
                    "A": "Báo lỗi KeyError vì khóa 'lop' chưa tồn tại.",
                    "B": "Thêm cặp khóa-giá trị mới 'lop': '10A' vào từ điển d.",
                    "C": "Xóa khóa 'ten' khỏi từ điển d.",
                    "D": "Không làm thay đổi từ điển d."
                },
                "correctAnswer": "B",
                "explanation": "Trong Python, khi gán d[key] = value mà key chưa tồn tại trong từ điển, Python sẽ tự động tạo mới cặp key-value đó."
            },
            {
                "id": "10py-q18",
                "question": "Câu 18. Phương thức nào dùng để duyệt đồng thời cả Khóa (Key) và Giá trị (Value) trong Dictionary?",
                "options": {
                    "A": "d.keys()",
                    "B": "d.values()",
                    "C": "d.items()",
                    "D": "d.all()"
                },
                "correctAnswer": "C",
                "explanation": "Phương thức d.items() trả về tập hợp các cặp (key, value), cho phép dùng cú pháp for k, v in d.items() để duyệt đồng thời."
            },
            {
                "id": "10py-q19",
                "question": "Câu 19. Từ khóa nào trong Python được dùng để định nghĩa một hàm mới?",
                "options": {
                    "A": "function",
                    "B": "def",
                    "C": "func",
                    "D": "define"
                },
                "correctAnswer": "B",
                "explanation": "Python dùng từ khóa def để bắt đầu định nghĩa một hàm (ví dụ: def tinh_tong(a, b):)."
            },
            {
                "id": "10py-q20",
                "question": "Câu 20. Khẳng định nào sau đây là ĐÚNG về lệnh return trong hàm?",
                "options": {
                    "A": "Lệnh return chỉ in kết quả ra màn hình mà không trả về giá trị.",
                    "B": "Một hàm có thể thực thi nhiều lệnh return cùng một lúc.",
                    "C": "Khi gặp lệnh return, hàm sẽ trả về giá trị và kết thúc thực thi ngay lập tức.",
                    "D": "Mọi hàm trong Python bắt buộc phải có lệnh return."
                },
                "correctAnswer": "C",
                "explanation": "Khi gặp lệnh return, hàm sẽ gửi giá trị trả về cho nơi gọi hàm và thoát khỏi hàm ngay lập tức."
            },
            {
                "id": "10py-q21",
                "question": "Câu 21. Đoạn mã sau in ra kết quả gì?\ndef f(x, y=10):\n    return x + y\nprint(f(5))",
                "options": {
                    "A": "5",
                    "B": "10",
                    "C": "15",
                    "D": "Báo lỗi thiếu tham số y"
                },
                "correctAnswer": "C",
                "explanation": "Tham số y có giá trị mặc định là 10. Khi gọi f(5), x nhận giá trị 5 và y nhận giá trị mặc định 10 => kết quả là 5 + 10 = 15."
            },
            {
                "id": "10py-q22",
                "question": "Câu 22. Đoạn mã sau dùng để kiểm tra số nguyên dương n:\ndef kiem_tra(n):\n    if n < 2:\n        return False\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0:\n            return False\n    return True\nHàm trên dùng để kiểm tra tính chất nào của số n?",
                "options": {
                    "A": "Kiểm tra n là số chẵn.",
                    "B": "Kiểm tra n là số chính phương.",
                    "C": "Kiểm tra n là số nguyên tố.",
                    "D": "Kiểm tra n là số hoàn hảo."
                },
                "correctAnswer": "C",
                "explanation": "Đây là thuật toán kiểm tra số nguyên tố chuẩn tối ưu, lặp kiểm tra ước từ 2 đến căn bậc hai của n."
            },
            {
                "id": "10py-q23",
                "question": "Câu 23. Trong Python, biểu thức nào dùng để đảo ngược một chuỗi ký tự s?",
                "options": {
                    "A": "s.reverse()",
                    "B": "reverse(s)",
                    "C": "s[::-1]",
                    "D": "s[-1:0]"
                },
                "correctAnswer": "C",
                "explanation": "Chuỗi ký tự trong Python là bất biến nên không có phương thức s.reverse(). Cách đảo ngược chuỗi chuẩn trong Python là dùng cắt lát bước nhảy âm s[::-1]."
            },
            {
                "id": "10py-q24",
                "question": "Câu 24. Cho chuỗi s = 'tin hoc 10'. Phương thức s.title() trả về kết quả gì?",
                "options": {
                    "A": "'TIN HOC 10'",
                    "B": "'Tin Hoc 10'",
                    "C": "'Tin hoc 10'",
                    "D": "'tin hoc 10'"
                },
                "correctAnswer": "B",
                "explanation": "Phương thức s.title() viết hoa chữ cái đầu tiên của từng từ trong chuỗi => 'Tin Hoc 10'."
            },
            {
                "id": "10py-q25",
                "question": "Câu 25. Để tính tổng S = 1 + 2 + ... + N với N = 10^9 trong thời gian chạy dưới 0.01 giây, ta nên chọn cách nào?",
                "options": {
                    "A": "Dùng vòng lặp for i in range(1, N + 1) với độ phức tạp O(N).",
                    "B": "Dùng vòng lặp while với độ phức tạp O(N).",
                    "C": "Dùng công thức toán học S = N * (N + 1) // 2 với độ phức tạp O(1).",
                    "D": "Tạo list L = list(range(1, N + 1)) rồi dùng hàm sum(L)."
                },
                "correctAnswer": "C",
                "explanation": "Với N = 10^9, mọi vòng lặp O(N) sẽ thực hiện hàng tỷ phép tính và bị lỗi quá thời gian (TLE). Áp dụng công thức cấp số cộng O(1) chỉ mất 1 phép nhân và 1 phép chia nguyên, thực hiện ngay lập tức trong 0.0001 giây."
            }
        ],
        "application": {
            "realLife": "Lập trình Python được ứng dụng sâu rộng trong phát triển Trí tuệ Nhân tạo (Machine Learning, Deep Learning), phân tích dữ liệu lớn (Big Data), lập trình web backend (Django, FastAPI), và viết các công cụ tự động hóa công việc văn phòng, tài chính.",
            "examTraps": [
                "Quên rằng hàm range(start, stop) không bao giờ chạm đến giá trị stop mà dừng trước stop đúng 1 đơn vị.",
                "Quên rằng kết quả của phép chia / trong Python luôn là số thực float (10 / 2 = 5.0).",
                "Nhầm lẫn giữa gán giá trị (=) và so sánh bằng (==) trong câu lệnh rẽ nhánh if.",
                "Quên ép kiểu dữ liệu cho hàm input() khi thực hiện tính toán số học (input() luôn trả về chuỗi ký tự).",
                "Lỗi IndentationError do thụt lề không đồng nhất (trộn lẫn tab và phím cách)."
            ],
            "tips": [
                "Luôn nhớ quy tắc bán mở của range() và cắt lát: [start, stop) lấy từ start đến stop - 1.",
                "Sử dụng s[::-1] để đảo ngược chuỗi hoặc list cực nhanh.",
                "Áp dụng map(int, input().split()) để đọc dữ liệu trên cùng một dòng ngang trong các bài thi chấm tự động.",
                "Khi N lớn hơn 10^7, luôn nghĩ đến công thức toán học O(1) thay vì vòng lặp for/while để tránh lỗi TLE."
            ]
        },
        "requirements": [
            "Nắm vững 4 kiểu dữ liệu chuẩn: int, float, str, bool.",
            "Hiểu bản chất các toán tử số học (//, %, **), toán tử gán, so sánh và logic.",
            "Sử dụng thành thạo cấu trúc rẽ nhánh if-elif-else và cấu trúc lặp for/while.",
            "Thao tác thuần thục trên cấu trúc dữ liệu List và Dictionary.",
            "Biết cách định nghĩa hàm với từ khóa def và trả về giá trị qua return."
        ],
        "keyConcepts": [
            {
                "term": "Indentation (Thụt lề)",
                "definition": "Quy tắc bắt buộc dùng khoảng trắng (thường là 4 spaces) ở đầu dòng để xác định một khối lệnh con trong Python thay cho cặp ngoặc nhọn { }."
            },
            {
                "term": "Dynamic Typing (Định kiểu động)",
                "definition": "Cơ chế của Python trong đó kiểu dữ liệu của biến được xác định tự động dựa trên giá trị được gán, không cần khai báo kiểu trước."
            },
            {
                "term": "Floor Division (//)",
                "definition": "Phép chia lấy phần nguyên, làm tròn xuống số nguyên lớn nhất không vượt quá thương số thực."
            },
            {
                "term": "List (Danh sách)",
                "definition": "Cấu trúc dữ liệu dạng mảng động tuần tự, bao bởi ngoặc vuông [ ], có thể thay đổi giá trị (mutable) và hỗ trợ chỉ số âm."
            },
            {
                "term": "Dictionary (Từ điển)",
                "definition": "Cấu trúc dữ liệu lưu trữ theo cặp Khóa : Giá trị (Key : Value) trong cặp ngoặc nhọn { }, cho phép tìm kiếm cực nhanh O(1) theo khóa."
            },
            {
                "term": "Function (Hàm)",
                "definition": "Khối lệnh có tên gọi bắt đầu bằng từ khóa def, nhận tham số đầu vào và trả về kết quả qua lệnh return để tái sử dụng mã nguồn."
            },
            {
                "term": "Big-O Notation",
                "definition": "Ký hiệu toán học dùng để đánh giá độ phức tạp thời gian của thuật toán khi kích thước dữ liệu đầu vào N tăng lên."
            }
        ],
        "theorySections": [
            {
                "title": "1. Tổng quan & Biến, Kiểu dữ liệu",
                "content": "Python là ngôn ngữ thông dịch, hỗ trợ định kiểu động, 4 kiểu dữ liệu cơ bản int, float, str, bool. Quy tắc đặt tên biến không bắt đầu bằng số và không trùng từ khóa."
            },
            {
                "title": "2. Toán tử số học, gán, so sánh và logic",
                "content": "Phép chia / ra float, // chia nguyên, % chia dư, ** lũy thừa. Toán tử logic and, or, not."
            },
            {
                "title": "3. Rẽ nhánh & Vòng lặp",
                "content": "Cú pháp if-elif-else thụt lề 4 spaces. Vòng lặp for i in range(...) bán mở, vòng lặp while điều kiện, lệnh break và continue."
            },
            {
                "title": "4. List & Dictionary",
                "content": "List [] đánh chỉ số âm L[-1], cắt lát L[1:4], các phương thức append, pop, sort. Dictionary {} lưu cặp key:value tra cứu O(1)."
            },
            {
                "title": "5. Hàm & Độ phức tạp",
                "content": "Định nghĩa hàm def, lệnh return trả kết quả. Đánh giá độ phức tạp thuật toán O(1), O(N), O(N^2) để tránh TLE."
            }
        ],
        "practicalTips": [
            "Nhớ thuộc lòng cú pháp nhập mảng 1 dòng: A = list(map(int, input().split())).",
            "Dùng s[::-1] để đảo ngược chuỗi hoặc kiểm tra đối xứng.",
            "Luôn kiểm tra điều kiện chia cho 0 trước khi thực hiện /, //, %.",
            "Dùng f-string f'{bien}' để in kết quả rõ ràng, chuyên nghiệp."
        ],
        "commonPitfalls": [
            "Quên dấu hai chấm (:) ở cuối dòng if, elif, else, for, while, def.",
            "Lẫn lộn giữa phép gán = và phép so sánh bằng ==.",
            "Quên ép kiểu int(input()) dẫn đến cộng chuỗi thay vì cộng số học ('5' + '5' = '55' thay vì 10).",
            "Quên rằng range(n) chỉ chạy đến n - 1 chứ không chạy đến n."
        ]
    }
};
