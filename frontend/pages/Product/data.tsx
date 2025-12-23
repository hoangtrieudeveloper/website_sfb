
import {
    Package,
    Cloud,
    Shield,
    TrendingUp,
    Cpu,
} from "lucide-react";

export type CategoryId = "all" | "edu" | "justice" | "gov" | "kpi";

export const categories: {
    id: CategoryId;
    name: string;
    icon: any;
}[] = [
        { id: "all", name: "Tất cả sản phẩm", icon: Package },
        { id: "edu", name: "Giải pháp Giáo dục", icon: Cloud },
        {
            id: "justice",
            name: "Công chứng – Pháp lý",
            icon: Shield,
        },
        {
            id: "gov",
            name: "Quản lý Nhà nước/Doanh nghiệp",
            icon: TrendingUp,
        },
        { id: "kpi", name: "Quản lý KPI cá nhân", icon: Cpu },
    ];

export const products = [
    {
        id: 1,
        category: "edu" as CategoryId,
        name: "Hệ thống tuyển sinh đầu cấp",
        tagline: "Tuyển sinh trực tuyến minh bạch, đúng quy chế",
        meta: "Sản phẩm • Tin công nghệ • 07/08/2025",
        description:
            "Phần mềm hỗ trợ công tác tuyển sinh đầu cấp cho nhà trường và phụ huynh: tổ chức tuyển sinh đúng quy chế, minh bạch, tra cứu kết quả trực tuyến mọi lúc mọi nơi.",
        image: "https://sfb.vn/wp-content/uploads/2025/08/HDD-404x269.png",
        gradient: "from-[#006FB3] to-[#0088D9]",
        features: [
            "Đăng ký tuyển sinh trực tuyến cho phụ huynh",
            "Tích hợp quy chế tuyển sinh của Bộ/Ngành",
            "Tự động lọc, duyệt hồ sơ theo tiêu chí",
            "Tra cứu kết quả tuyển sinh online",
            "Báo cáo thống kê theo lớp, khối, khu vực",
            "Kết nối chặt chẽ giữa phụ huynh và nhà trường",
        ],
        stats: {
            users: "Nhiều trường học áp dụng",
            rating: 4.8,
            deploy: "Triển khai Cloud/On-premise",
        },
        pricing: "Liên hệ",
        badge: "Giải pháp nổi bật",
    },
    {
        id: 2,
        category: "edu" as CategoryId,
        name: "Báo giá sản phẩm – hệ thống Giáo dục thông minh",
        tagline: "Hệ sinh thái giáo dục số cho nhà trường",
        meta: "Sản phẩm • Tin công nghệ • 08/12/2023",
        description:
            "Gói sản phẩm và dịch vụ cho hệ thống Giáo dục thông minh của SFB, giúp nhà trường số hóa toàn bộ hoạt động quản lý, giảng dạy và tương tác với phụ huynh, học sinh.",
        image: "https://sfb.vn/wp-content/uploads/2023/12/Daiien-512x341.png",
        gradient: "from-purple-600 to-pink-600",
        features: [
            "Quản lý hồ sơ học sinh – giáo viên",
            "Quản lý học tập, điểm số, thời khóa biểu",
            "Cổng thông tin điện tử cho phụ huynh & học sinh",
            "Học bạ điện tử và sổ liên lạc điện tử",
            "Tích hợp học trực tuyến, bài tập online",
            "Báo cáo, thống kê theo năm học/kỳ học",
        ],
        stats: {
            users: "Nhiều cơ sở giáo dục triển khai",
            rating: 4.9,
            deploy: "Mô hình Cloud",
        },
        pricing: "Theo gói triển khai",
        badge: "Giải pháp giáo dục",
    },
    {
        id: 3,
        category: "justice" as CategoryId,
        name: "Hệ thống CSDL quản lý công chứng, chứng thực",
        tagline: "Cơ sở dữ liệu công chứng tập trung, an toàn",
        meta: "Sản phẩm • Tin công nghệ • 16/09/2023",
        description:
            "Giải pháp quản lý cơ sở dữ liệu công chứng, chứng thực tập trung, giúp giảm rủi ro trong các giao dịch, hỗ trợ nghiệp vụ cho các tổ chức hành nghề công chứng.",
        image: "https://sfb.vn/wp-content/uploads/2023/09/C3T-318x212.png",
        gradient: "from-orange-600 to-amber-600",
        features: [
            "Lưu trữ tập trung hợp đồng công chứng, chứng thực",
            "Tra cứu nhanh lịch sử giao dịch theo nhiều tiêu chí",
            "Cảnh báo trùng lặp, rủi ro trong giao dịch",
            "Phân quyền chi tiết theo vai trò nghiệp vụ",
            "Tích hợp chữ ký số và chứng thư số",
            "Báo cáo thống kê, hỗ trợ thanh tra, kiểm tra",
        ],
        stats: {
            users: "Phòng công chứng, VP công chứng",
            rating: 4.8,
            deploy: "Triển khai toàn tỉnh/thành",
        },
        pricing: "Liên hệ",
        badge: "Cho lĩnh vực công chứng",
    },
    {
        id: 4,
        category: "edu" as CategoryId,
        name: "Phần mềm quản lý Đại học – Học viện – Cao đẳng",
        tagline: "Giải pháp quản lý tổng thể cơ sở đào tạo",
        meta: "Sản phẩm • 01/11/2022",
        description:
            "Giải pháp quản lý tổng thể dành cho các trường Đại học, Học viện, Cao đẳng, hỗ trợ quản lý đào tạo, sinh viên, chương trình học và chất lượng đào tạo.",
        image: "https://sfb.vn/wp-content/uploads/2022/11/BG-768x512.png",
        gradient: "from-emerald-600 to-teal-600",
        features: [
            "Quản lý tuyển sinh, hồ sơ sinh viên",
            "Quản lý chương trình đào tạo, tín chỉ, lớp học",
            "Quản lý giảng viên, phân công giảng dạy",
            "Cổng thông tin cho sinh viên & giảng viên",
            "Quản lý học phí, công nợ, học bổng",
            "Báo cáo theo chuẩn Bộ/Ngành",
        ],
        stats: {
            users: "Phù hợp ĐH, HV, CĐ",
            rating: 4.7,
            deploy: "Cloud/On-premise",
        },
        pricing: "Theo quy mô trường",
        badge: "Giải pháp tổng thể",
    },
    {
        id: 5,
        category: "gov" as CategoryId,
        name: "Hệ thống thông tin quản lý, giám sát doanh nghiệp",
        tagline: "Giám sát doanh nghiệp Nhà nước hiệu quả",
        meta: "Sản phẩm • 16/01/2021",
        description:
            "Hệ thống thông tin quản lý, giám sát Nhà nước tại doanh nghiệp, hỗ trợ cơ quan quản lý nắm bắt tình hình hoạt động và chỉ tiêu của doanh nghiệp một cách chi tiết.",
        image: "https://sfb.vn/wp-content/uploads/2021/01/btc-255x170.png",
        gradient: "from-indigo-600 to-purple-600",
        features: [
            "Quản lý hồ sơ, thông tin doanh nghiệp",
            "Theo dõi tình hình tài chính và sản xuất kinh doanh",
            "Bộ chỉ tiêu báo cáo chuẩn hóa",
            "Cảnh báo sớm các rủi ro, vi phạm",
            "Dashboard giám sát trực quan theo ngành/lĩnh vực",
            "Kết nối, chia sẻ dữ liệu với hệ thống khác",
        ],
        stats: {
            users: "Cơ quan quản lý Nhà nước",
            rating: 4.8,
            deploy: "Triển khai tập trung",
        },
        pricing: "Thiết kế theo bài toán",
        badge: null,
    },
    {
        id: 6,
        category: "kpi" as CategoryId,
        name: "Hệ thống quản lý KPI cá nhân (BSC/KPIs)",
        tagline: "Quản trị hiệu suất cá nhân & tổ chức",
        meta: "Sản phẩm • 16/01/2021",
        description:
            "Hệ thống quản lý BSC/KPIs cá nhân giúp thiết kế bảng điểm cân bằng và hệ thống chỉ tiêu KPI, hỗ trợ đo lường và đánh giá hiệu quả công việc.",
        image: "https://sfb.vn/wp-content/uploads/2021/02/Skpi-red-768x512.png",
        gradient: "from-red-600 to-rose-600",
        features: [
            "Thiết kế BSC và hệ thống chỉ tiêu KPI",
            "Giao KPI theo cá nhân, phòng ban, đơn vị",
            "Theo dõi tiến độ, kết quả thực hiện theo kỳ",
            "Tự động tính điểm và xếp loại",
            "Kết nối với hệ thống lương thưởng, đánh giá",
            "Báo cáo phân tích hiệu suất đa chiều",
        ],
        stats: {
            users: "Doanh nghiệp mọi quy mô",
            rating: 4.7,
            deploy: "Cloud/On-premise",
        },
        pricing: "Tùy theo số lượng user",
        badge: "Tập trung KPI",
    },
];

export const benefits = [
    {
        icon: "/icons/custom/product1.svg",
        title: "Bảo mật cao",
        description: "Tuân thủ chuẩn bảo mật, mã hóa dữ liệu end-to-end.",
        gradient: "from-[#006FB3] to-[#0088D9]",
    },
    {
        icon: "/icons/custom/product2.svg",
        title: "Hiệu năng ổn định",
        description: "Hệ thống tối ưu, uptime cao, đáp ứng nhu cầu vận hành.",
        gradient: "from-[#FF81C2] to-[#667EEA]",
    },
    {
        icon: "/icons/custom/product3.svg",
        title: "Dễ triển khai & sử dụng",
        description: "Giao diện trực quan, đào tạo & hỗ trợ cho người dùng.",
        gradient: "from-[#2AF598] to-[#009EFD]",
    },
    {
        icon: "/icons/custom/product4.svg",
        title: "Sẵn sàng mở rộng",
        description: "Kiến trúc linh hoạt, dễ tích hợp và mở rộng về sau.",
        gradient: "from-[#FA709A] to-[#FEE140]",
    },
];

export const testimonials = [
    {
        company: "Đối tác khối Công",
        quote:
            "Cám ơn các bạn SFB đã dành nhiều tâm sức cho việc triển khai các dự án tại Nam Việt và được các đối tác của Nam Việt đánh giá rất cao. Đây là một trong những đối tác công nghệ chúng tôi tin tưởng nhất.",
        author: "Ông Nguyễn Khánh Tâm",
        rating: 5,
    },
    {
        company: "Đối tác khối Giáo dục",
        quote:
            "Nhiều năm sử dụng phần mềm từ SFB, phần mềm đã đồng hành cùng chúng tôi đạt được nhiều thành công. Chúng tôi phát triển một phần nhờ phần mềm của các bạn, thì đương nhiên chúng tôi sẽ luôn luôn ủng hộ các bạn.",
        author: "Ông Nguyễn Hoàng Chinh",
        rating: 5,
    },
    {
        company: "Đối tác khối Công",
        quote:
            "Chất lượng sản phẩm và dịch vụ của các bạn luôn đáp ứng được những yêu cầu, mong mỏi từ phía khoso.vn. Có đôi điều để tôi nhận xét về SFB, đó là: chuyên nghiệp, trách nhiệm, tận tình và ham học hỏi.",
        author: "Ông Nguyễn Khánh Tùng",
        rating: 5,
    },
    {
        company: "Khối Doanh nghiệp",
        quote:
            "Cám ơn các bạn SFB đã dành nhiều tâm sức cho việc triển khai các dự án tại Nam Việt và được các đối tác của Nam Việt đánh giá rất cao. Đây là một trong những đối tác công nghệ chúng tôi tin tưởng nhất.",
        author: "Ông Vũ Kim Trung",
        rating: 5,
    },
    {
        company: "Khối Doanh nghiệp",
        quote:
            "Nhiều năm sử dụng phần mềm từ SFB, phần mềm đã đồng hành cùng chúng tôi đạt được nhiều thành công. Chúng tôi phát triển một phần nhờ phần mềm của các bạn, thì đương nhiên chúng tôi sẽ luôn luôn ủng hộ các bạn.",
        author: "Ông nguyễn Khanh",
        rating: 5,
    },
];

export const productHeroData = {
    title: {
        line1: "Bộ giải pháp phần mềm",
        line2: "Phục vụ Giáo dục, Công chứng & Doanh nghiệp"
    },
    description: "Các sản phẩm SFB được xây dựng từ bài toán thực tế của cơ quan Nhà nước, nhà trường và doanh nghiệp, giúp tối ưu quy trình và nâng cao hiệu quả quản lý.",
    buttons: {
        primary: {
            text: "Xem danh sách sản phẩm",
            link: "#products"
        },
        secondary: {
            text: "Tư vấn giải pháp",
            link: "/contact"
        }
    },
    stats: [
        { value: "+32.000", label: "Giải pháp phần mềm" },
        { value: "+6.000", label: "Đơn vị triển khai thực tế" },
        { value: "4.9★", label: "Mức độ hài lòng trung bình" }
    ]
};

export const productListSectionData = {
    header: {
        subtitle: "GIẢI PHÁP CHUYÊN NGHIỆP",
        title: "Sản phẩm & giải pháp nổi bật",
        description: "Danh sách các hệ thống phần mềm đang được SFB triển khai cho nhà trường, cơ quan Nhà nước và doanh nghiệp."
    }
};

export const productTestimonialsSectionData = {
    title: "Khách hàng nói gì về SFB ?"
};
