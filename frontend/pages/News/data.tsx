import { TrendingUp, Tag, Clock, TrendingUp as TrendingUpIcon, CheckCircle2 } from "lucide-react";

export const newsHeroData = {
    badge: "TIN TỨC & BLOG",
    title: {
        prefix: "Cập nhật",
        highlight: "công nghệ & hoạt động SFB"
    },
    description: "Tin công ty, sản phẩm và tin công nghệ mới nhất từ SFB Technology",
    searchPlaceholder: "Tìm kiếm bài viết...",
    icon: TrendingUp
};

export const newsSectionHeaders = {
    featured: {
        title: "Nổi bật",
        subtitle: "Bài viết được quan tâm nhất"
    },
    latest: {
        title: "Bài viết mới nhất",
        subtitle: "Cập nhật tin công ty, sản phẩm và công nghệ từ SFB"
    }
};

export const newsletterData = {
    badge: "ĐĂNG KÝ NHẬN TIN",
    title: "Đăng ký nhận bản tin",
    description: "Nhận tin tức công nghệ mới nhất, case study và tips hữu ích mỗi tuần",
    emailPlaceholder: "Email của bạn",
    buttonText: "Đăng ký ngay",
    securityNote: "🔒 Chúng tôi cam kết bảo mật thông tin của bạn",
    icon: Tag
};

export const uiText = {
    loading: "Đang tải...",
    noResults: "Không có bài viết phù hợp với từ khóa / bộ lọc hiện tại.",
    loadMore: "Xem thêm bài viết",
    readMore: "Đọc thêm"
};

export const categories = [
    { id: "all", name: "Tất cả" },
    { id: "company", name: "Tin công ty" },
    { id: "product", name: "Sản phẩm & giải pháp" },
    { id: "tech", name: "Tin công nghệ" },
] as const;

export const featuredNewsData = {
    id: 1,
    title: "Hệ thống tuyển sinh đầu cấp",
    slug: "he-thong-tuyen-sinh-dau-cap",
    excerpt:
        "Giải pháp phần mềm hỗ trợ công tác tuyển sinh đầu cấp cho nhà trường và phụ huynh: tổ chức tuyển sinh đúng quy chế, minh bạch, tra cứu kết quả trực tuyến mọi lúc mọi nơi.",
    image:"/images/news/news1.png",
    imageUrl: "/images/news/news1.png",
        
    category: "Sản phẩm & giải pháp",
    categoryId: "product" as const,
    date: "07 Tháng 8, 2025",
    author: "SFB Technology",
    readTime: "10 phút đọc",
    views: "1.5K",
    gradient: "from-blue-600 to-cyan-600",
    link: "/news-detail",
};

export const newsList = [
  {
    id: 1,
    title: "Báo giá sản phẩm – hệ thống Giáo dục thông minh",
    slug: "bao-gia-san-pham-he-thong-giao-duc-thong-minh",
        categoryId: "product" as const,
    excerpt:
      "Thông tin báo giá và gói dịch vụ cho hệ thống Giáo dục thông minh của SFB, hỗ trợ nhà trường triển khai dạy và học số một cách hiệu quả.",
   imageUrl: "/images/news/news1.png",
    likes: 20,
    comments: 16,
    publishedDate: "06/06/2025",
  },
  {
    id: 2,
    title: "Hệ thống CSDL quản lý công chứng, chứng thực",
    slug: "he-thong-csdl-quan-ly-cong-chung-chung-thuc",
        categoryId: "product" as const,
    excerpt:
      "Giải pháp quản lý cơ sở dữ liệu công chứng, chứng thực tập trung, bảo đảm an toàn thông tin và hỗ trợ nghiệp vụ cho các phòng công chứng.",
        imageUrl: "/images/news/news2.png",
    likes: 20,
    comments: 16,
    publishedDate: "06/06/2025",
  },
  {
    id: 3,
    title: "Điều khoản sử dụng app HS2",
    slug: "dieu-khoan-su-dung-app-hs2",
        categoryId: "tech" as const,
    excerpt:
      "Thông tin báo giá và gói dịch vụ cho hệ thống Giáo dục thông minh của SFB, hỗ trợ nhà trường triển khai dạy và học số một cách hiệu quả.",
    imageUrl: "/images/news/news3.png",
    likes: 20,
    comments: 16,
    publishedDate: "06/06/2025",
  },
  {
    id: 4,
    title: "Báo giá sản phẩm – hệ thống Giáo dục thông minh",
    slug: "bao-gia-san-pham-he-thong-giao-duc-thong-minh-2",
        categoryId: "product" as const,
    excerpt:
      "Thông tin báo giá và gói dịch vụ cho hệ thống Giáo dục thông minh của SFB, hỗ trợ nhà trường triển khai dạy và học số một cách hiệu quả.",
    imageUrl: "/images/news/news1.png",
    likes: 20,
    comments: 16,
    publishedDate: "06/06/2025",
  },
  {
    id: 5,
    title: "Hệ thống CSDL quản lý công chứng, chứng thực",
    slug: "he-thong-csdl-quan-ly-cong-chung-chung-thuc-2",
        categoryId: "product" as const,
    excerpt:
      "Giải pháp quản lý cơ sở dữ liệu công chứng, chứng thực tập trung, bảo đảm an toàn thông tin và hỗ trợ nghiệp vụ cho các phòng công chứng.",
    imageUrl:"/images/news/news2.png",
    likes: 20,
    comments: 16,
    publishedDate: "06/06/2025",
  },
  {
    id: 6,
    title: "Điều khoản sử dụng app HS2",
    slug: "dieu-khoan-su-dung-app-hs2-2",
        categoryId: "tech" as const,
    excerpt:
      "Thông tin báo giá và gói dịch vụ cho hệ thống Giáo dục thông minh của SFB, hỗ trợ nhà trường triển khai dạy và học số một cách hiệu quả.",
    imageUrl:"/images/news/news3.png",
    likes: 20,
    comments: 16,
    publishedDate: "06/06/2025",
  },
];


export const newsDetailData = {
    breadcrumb: "Tin tức",
    defaultCategory: "Bài viết",
    authorDefault: "SFB Technology",
    comments: {
        title: "Bình luận",
        placeholder: "Chia sẻ suy nghĩ của bạn...",
        loginText: "Đăng nhập để bình luận",
        submitButton: "Gửi bình luận"
    },
    tagsLabel: "Tags:",
    viewsSuffix: " lượt xem",
    shareTitle: "Chia sẻ bài viết",
    tableOfContentsTitle: "Mục lục",
    relatedArticlesTitle: "Bài viết liên quan",
    relatedArticlesSubtitle: "Khám phá thêm các bài viết cùng chủ đề",
    authorTitle: "Về tác giả",
    connectLinkedIn: "Kết nối trên LinkedIn",
    readNow: "Đọc ngay"
};

export const articleData = {
    title:
        "SFB Technology triển khai thành công hệ thống AI cho tập đoàn tài chính hàng đầu",
    subtitle:
        "Giải pháp AI/ML giúp tăng 85% hiệu quả phân tích rủi ro và giảm 40% thời gian xử lý giao dịch",
    category: "Case Study",
    author: {
        name: "Nguyễn Văn A",
        position: "Senior Solution Architect",
        avatar:
            "https://images.unsplash.com/photo-1589114207353-1fc98a11070b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGNvbnN1bHRhbnQlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzY0NTA2ODE3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        bio: "15+ năm kinh nghiệm trong lĩnh vực AI/ML và Data Science, từng làm việc cho các tập đoàn Fortune 500.",
        linkedin: "#",
    },
    date: "25 Tháng 11, 2024",
    readTime: "8 phút đọc",
    views: "2.5K",
    image:
        "https://images.unsplash.com/photo-1744640326166-433469d102f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwYnVzaW5lc3N8ZW58MXx8fHwxNzY0NTA5MzU0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
};

export const tableOfContents = [
    { id: "overview", title: "Tổng quan dự án" },
    { id: "challenge", title: "Thách thức" },
    { id: "solution", title: "Giải pháp" },
    { id: "implementation", title: "Triển khai" },
    { id: "results", title: "Kết quả" },
    { id: "conclusion", title: "Kết luận" },
];

export const relatedArticlesData = [
    {
        id: 1,
        title: "Top 5 xu hướng Cloud Computing năm 2024",
        image:
            "https://images.unsplash.com/photo-1573757056004-065ad36e2cf4?auto=format&fit=crop&w=1080&q=80",
        category: "Xu hướng",
        readTime: "6 phút đọc",
        gradient: "from-[#006FB3] to-[#0088D9]",
    },
    {
        id: 2,
        title: "Bảo mật dữ liệu trong kỷ nguyên số",
        image:
            "https://images.unsplash.com/photo-1744640326166-433469d102f2?auto=format&fit=crop&w=1080&q=80",
        category: "Tips & Tricks",
        readTime: "10 phút đọc",
        gradient: "from-purple-600 to-pink-600",
    },
    {
        id: 3,
        title: "AI & Machine Learning: Từ lý thuyết đến thực tiễn",
        image:
            "https://images.unsplash.com/photo-1573757056004-065ad36e2cf4?auto=format&fit=crop&w=1080&q=80",
        category: "Tin công nghệ",
        readTime: "9 phút đọc",
        gradient: "from-emerald-600 to-teal-600",
    },
];

export const articleTags = [
    "AI/ML",
    "Fintech",
    "Digital Transformation",
    "Case Study",
    "Big Data",
    "Cloud Computing",
];

export const projectOverview = {
    title: "Tổng quan dự án",
    content: [
        "Trong bối cảnh ngành tài chính đang chuyển mình mạnh mẽ với công nghệ số, một tập đoàn tài chính hàng đầu Việt Nam đã hợp tác cùng SFB Technology để xây dựng hệ thống phân tích rủi ro và xử lý giao dịch thông minh dựa trên AI/ML. Dự án này đánh dấu bước đột phá quan trọng trong chiến lược chuyển đổi số của khách hàng.",
        "Với quy mô triển khai lên đến 50+ chi nhánh và hơn 1000 nhân viên sử dụng hàng ngày, hệ thống AI mới đã mang lại những kết quả vượt ngoài kỳ vọng, giúp tăng 85% hiệu quả trong phân tích rủi ro và giảm 40% thời gian xử lý giao dịch."
    ],
    stats: [
        {
            value: "85%",
            label: "Tăng hiệu quả phân tích",
            gradient: "from-[#006FB3] to-[#0088D9]"
        },
        {
            value: "40%",
            label: "Giảm thời gian xử lý",
            gradient: "from-emerald-500 to-teal-500"
        },
        {
            value: "50+",
            label: "Chi nhánh triển khai",
            gradient: "from-purple-500 to-pink-500"
        }
    ]
};

export const challengesData = {
    title: "Thách thức",
    description: "Trước khi triển khai hệ thống AI, khách hàng đang gặp phải một số thách thức lớn trong vận hành:",
    items: [
        "Quy trình phân tích rủi ro thủ công, tốn nhiều thời gian và dễ sai sót",
        "Khó khăn trong việc phát hiện các giao dịch bất thường và gian lận",
        "Không có hệ thống dự đoán xu hướng thị trường hiệu quả",
        "Thiếu công cụ hỗ trợ ra quyết định đầu tư thông minh",
        "Dữ liệu khách hàng phân tán, khó tích hợp và phân tích",
    ]
};

export const solutionData = {
    title: "Giải pháp",
    description: "Đội ngũ chuyên gia của SFB Technology đã nghiên cứu kỹ lưỡng quy trình nghiệp vụ và đề xuất một giải pháp AI/ML toàn diện, bao gồm:",
    items: [
        {
            title: "AI Risk Analysis Engine",
            description: "Hệ thống phân tích rủi ro tự động sử dụng Machine Learning",
            icon: "🤖",
            gradient: "from-[#006FB3] to-[#0088D9]",
        },
        {
            title: "Fraud Detection System",
            description: "Phát hiện gian lận real-time với độ chính xác 99.2%",
            icon: "🛡️",
            gradient: "from-purple-500 to-pink-500",
        },
        {
            title: "Predictive Analytics",
            description: "Dự đoán xu hướng thị trường và hành vi khách hàng",
            icon: "📊",
            gradient: "from-emerald-500 to-teal-500",
        },
        {
            title: "Smart Dashboard",
            description: "Giao diện trực quan hóa dữ liệu và insights thông minh",
            icon: "📱",
            gradient: "from-orange-500 to-red-500",
        },
    ],
    quote: {
        text: "\"Hệ thống AI của SFB không chỉ giúp chúng tôi tự động hóa quy trình, mà còn mang lại những insights sâu sắc về khách hàng và thị trường mà trước đây chúng tôi chưa bao giờ có được.\"",
        author: "Trần Văn B",
        role: "CIO, Khách hàng"
    }
};

export const implementationData = {
    title: "Triển khai",
    description: "Dự án được triển khai theo phương pháp Agile với 4 giai đoạn chính:",
    stages: [
        {
            phase: "Phase 1",
            title: "Discovery & Planning",
            duration: "2 tuần",
            tasks: [
                "Phân tích yêu cầu nghiệp vụ",
                "Thiết kế kiến trúc hệ thống",
                "Lập kế hoạch triển khai",
            ],
        },
        {
            phase: "Phase 2",
            title: "Development & Training",
            duration: "8 tuần",
            tasks: [
                "Phát triển các AI models",
                "Training với dữ liệu thực tế",
                "Tích hợp hệ thống",
            ],
        },
        {
            phase: "Phase 3",
            title: "Testing & Optimization",
            duration: "4 tuần",
            tasks: [
                "UAT testing",
                "Fine-tuning models",
                "Performance optimization",
            ],
        },
        {
            phase: "Phase 4",
            title: "Deployment & Support",
            duration: "2 tuần",
            tasks: [
                "Triển khai production",
                "Đào tạo người dùng",
                "Hỗ trợ go-live",
            ],
        },
    ]
};

export const resultsData = {
    title: "Kết quả",
    description: "Sau 6 tháng vận hành, hệ thống AI đã mang lại những kết quả ấn tượng:",
    items: [
        {
            metric: "85%",
            label: "Tăng hiệu quả phân tích rủi ro",
            icon: TrendingUpIcon,
            color: "from-[#006FB3] to-[#0088D9]",
        },
        {
            metric: "40%",
            label: "Giảm thời gian xử lý giao dịch",
            icon: Clock,
            color: "from-emerald-500 to-teal-500",
        },
        {
            metric: "99.2%",
            label: "Độ chính xác phát hiện gian lận",
            icon: CheckCircle2,
            color: "from-purple-500 to-pink-500",
        },
        {
            metric: "60%",
            label: "Giảm chi phí vận hành",
            icon: TrendingUpIcon,
            color: "from-orange-500 to-red-500",
        },
    ]
};

export const conclusionData = {
    title: "Kết luận",
    content: [
        "Dự án AI cho tập đoàn tài chính là minh chứng cho năng lực và kinh nghiệm của SFB Technology trong việc triển khai các giải pháp công nghệ tiên tiến. Chúng tôi tự hào đã góp phần vào sự thành công của khách hàng và cam kết tiếp tục đồng hành trong hành trình chuyển đổi số.",
        "Nếu doanh nghiệp của bạn cũng đang tìm kiếm một đối tác công nghệ uy tín để triển khai AI/ML hoặc các giải pháp chuyển đổi số khác, hãy liên hệ với chúng tôi để được tư vấn chi tiết."
    ]
};
