// Consolidated coreValues from AboutCoreValues.tsx
import {
    Eye,
    Target,
    Zap,
    Users,
    Heart,
    Shield,
    Lightbulb,
    Globe,
    Calendar,
    Award,
    Handshake,
    ShieldCheck,
    Database,
    Globe2,
    Building2,
    MapPin,
    Phone,
    Mail
} from "lucide-react";

export const aboutHeroData = {
    title: {
        line1: "SFB Technology",
        line2: "Công ty cổ phần",
        line3: "công nghệ SFB"
    },
    description: "Hơn 8 năm xây dựng và phát triển, SFBTECH.,JSC đồng hành cùng nhiều cơ quan Nhà nước và doanh nghiệp trong hành trình chuyển đổi số với hàng trăm dự án triển khai thực tế.",
    button: {
        text: "KHÁM PHÁ GIẢI PHÁP",
        link: "/solutions"
    },
    image: "/images/abouthero.png"
};

export const aboutCompanySectionData = {
    header: {
        sub: "GIỚI THIỆU SFB",
        title: {
            line1: "Đối tác công nghệ chiến lược",
            line2: "cho doanh nghiệp Việt"
        }
    },
    content: {
        image1: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
        title: "CÔNG TY CỔ PHẦN CÔNG NGHỆ SFB (SFB TECHNOLOGY JOINT STOCK COMPANY – viết tắt SFBTECH.,JSC)",
        description: "Công ty hoạt động theo mô hình cổ phần với giấy chứng nhận đăng ký kinh doanh số 0107857710 do Sở Kế hoạch và Đầu tư Hà Nội cấp ngày 24/05/2017.",
        button: {
            text: "Liên hệ với chúng tôi",
            link: "/contact"
        }
    },
    contact: {
        items: [
            {
                icon: Building2,
                title: "Trụ sở",
                text: "41A ngõ 68, đường Ngọc Thuỵ, phường Ngọc Thuỵ, quận Long Biên, Hà Nội."
            },
            {
                icon: MapPin,
                title: "Văn phòng",
                text: "P303, Tầng 3, Khách sạn Thể Thao, 15 Lê Văn Thiêm, P. Nhân Chính, Q. Thanh Xuân, Hà Nội."
            },
            {
                icon: Phone,
                title: "Hotline",
                text: "0888 917 999",
                isHighlight: true
            },
            {
                icon: Mail,
                title: "Email",
                text: "info@sfb.vn",
                isHighlight: true
            }
        ],
        button: {
            text: "Liên hệ ngay",
            link: "/contact"
        },
        image2: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
    }
};

export const visionMissionSectionData = {
    header: {
        title: "Tầm nhìn & Sứ mệnh",
        description: "Trở thành một trong những công ty công nghệ hàng đầu về phát triển bền vững, xây dựng trên nền tảng tri thức và trí tuệ sáng tạo của đội ngũ nhân sự SFB."
    },
    items: [
        { id: 1, text: "Phát triển bền vững trên nền tảng tri thức" },
        { id: 2, text: "Kết hợp trí tuệ tập thể & sự nhiệt huyết của đội ngũ" },
        { id: 3, text: "Xây dựng hệ thống, sản phẩm có giá trị lâu dài" },
        { id: 4, text: "Cung cấp sản phẩm, dịch vụ tốt nhất dựa trên công nghệ mới" },
        { id: 5, text: "Tạo dựng niềm tin vững chắc với khách hàng & nhà đầu tư" },
        { id: 6, text: "Chung tay cùng xã hội hướng tới nền công nghiệp 4.0" },
    ]
};

// Kept for backward compatibility if needed, but visionMissionSectionData is preferred for the UI
export const visionMission = [
    {
        icon: Eye,
        title: "Tầm nhìn",
        subtitle: "Vision",
        content:
            "Trở thành một trong những công ty công nghệ hàng đầu về phát triển bền vững, xây dựng trên nền tảng tri thức và trí tuệ sáng tạo của đội ngũ nhân sự SFB.",
        gradient: "from-blue-500 via-cyan-500 to-teal-500",
        highlights: [
            "Phát triển bền vững trên nền tảng tri thức",
            "Kết hợp trí tuệ tập thể & sự nhiệt huyết của đội ngũ",
            "Xây dựng hệ thống, sản phẩm có giá trị lâu dài",
        ],
    },
    {
        icon: Target,
        title: "Sứ mệnh",
        subtitle: "Mission",
        content:
            "Cung cấp các giải pháp và dịch vụ công nghệ thông tin chất lượng cao, mang lại giá trị thực tế cho khách hàng, nhà đầu tư, nhân sự và xã hội.",
        gradient: "from-purple-500 via-pink-500 to-rose-500",
        highlights: [
            "Cung cấp sản phẩm, dịch vụ tốt nhất dựa trên công nghệ mới",
            "Tạo dựng niềm tin vững chắc với khách hàng & nhà đầu tư",
            "Xây dựng môi trường làm việc chuyên nghiệp, nhân văn",
            "Chung tay cùng xã hội hướng tới nền công nghiệp 4.0",
        ],
    },
];

// Default export để tránh lỗi Next.js build (file này chỉ chứa data, không phải page)
export default {};

export const coreValues = [
    {
        icon: Lightbulb,
        title: "Đổi mới sáng tạo",
        description: "Luôn tìm kiếm giải pháp mới, áp dụng công nghệ tiên tiến vào sản phẩm & dịch vụ.",
        gradient: "from-yellow-500 to-orange-500",
    },
    {
        icon: Handshake,
        title: "Tận tâm với khách hàng",
        description: "Đặt lợi ích khách hàng lên hàng đầu, cam kết đồng hành dài lâu.",
        gradient: "from-rose-500 to-pink-500",
    },
    {
        icon: Users,
        title: "Hợp tác & đồng hành",
        description: "Làm việc nhóm chặt chẽ, cùng khách hàng xây dựng giải pháp phù hợp nhất.",
        gradient: "from-blue-500 to-cyan-500",
    },
    {
        icon: ShieldCheck,
        title: "Trách nhiệm & minh bạch",
        description: "Tuân thủ cam kết, quy trình rõ ràng, không phát sinh chi phí thiếu minh bạch.",
        gradient: "from-emerald-500 to-teal-500",
    },
    {
        icon: Database,
        title: "Học hỏi không ngừng",
        description: "Liên tục cập nhật xu hướng mới: Cloud, AI, Big Data, DevOps..",
        gradient: "from-purple-500 to-indigo-500",
    },
    {
        icon: Globe2,
        title: "Tư duy toàn cầu",
        description: "Tiếp cận theo chuẩn quốc tế, sẵn sàng mở rộng sang các thị trường mới.",
        gradient: "from-indigo-500 to-blue-500",
    },
];

// Milestones from AboutMilestones.tsx
export const milestones = [
    {
        year: "2017",
        title: "Thành lập SFBTECH.,JSC",
        description: "Được cấp giấy chứng nhận đăng ký kinh doanh số 0107857710 bởi Sở KH&ĐT Hà Nội, bắt đầu hoạt động theo mô hình công ty cổ phần.",
        icon: "🚀",
    },
    {
        year: "2018-2019",
        title: "Xây dựng đội ngũ & sản phẩm lõi",
        description: "Hình thành các giải pháp về cổng thông tin điện tử, văn bản điều hành, thư viện số và các hệ thống nghiệp vụ cho cơ quan Nhà nước.",
        icon: "📘",
    },
    {
        year: "2020-2022",
        title: "Mở rộng lĩnh vực & quy mô triển khai",
        description: "Triển khai nhiều dự án cho khối Tài chính, Bảo hiểm, Ngân hàng, Viễn thông, Chính phủ điện tử và Doanh nghiệp.",
        icon: "📈",
    },
    {
        year: "2023 - nay",
        title: "Tiếp tục tăng trưởng & chuyển đổi số",
        description: "Đẩy mạnh các giải pháp theo nhu cầu riêng của từng đơn vị, chú trọng mở rộng, an toàn, bảo mật và tích hợp hệ thống.",
        icon: "🎯",
    },
];

export const leaders = [
    {
        name: "Nguyễn Văn Điền",
        position: "KẾ TOÁN TRƯỞNG",
        email: "diennv@sfb.vn",
        phone: "0888 917 999",
        description: "Thành viên ban lãnh đạo phụ trách kế toán trưởng, phối hợp chặt chẽ với các khối giải pháp, sản phẩm và vận hành.",
        image: "https://sfb.vn/wp-content/uploads/2020/04/ngvandien-500x500.jpg",
    },
    {
        name: "Nguyễn Đức Duy",
        position: "GIÁM ĐỐC CÔNG NGHỆ",
        email: "duynd@sfb.vn",
        phone: "0705 146 789",
        description: "Thành viên ban lãnh đạo phụ trách giám đốc công nghệ, phối hợp chặt chẽ với các khối giải pháp, sản phẩm và vận hành.",
        image: "https://sfb.vn/wp-content/uploads/2025/08/HA-500x500.jpg",
    },
    {
        name: "Nguyễn Văn C",
        position: "GIÁM ĐỐC KINH DOANH",
        email: "nvc@sfb.vn",
        phone: "0705 146 789",
        description: "Thành viên ban lãnh đạo phụ trách giám đốc kinh doanh, phối hợp chặt chẽ với các khối giải pháp, sản phẩm và vận hành.",
        image: "https://sfb.vn/wp-content/uploads/2025/08/HA-500x500.jpg",
    },
    {
        name: "Lê Văn D",
        position: "GIÁM ĐỐC VẬN HÀNH",
        email: "lvd@sfb.vn",
        phone: "0987 654 321",
        description: "Thành viên ban lãnh đạo phụ trách vận hành và quy trình nội bộ, đảm bảo hiệu suất hoạt động tối ưu.",
        image: "https://sfb.vn/wp-content/uploads/2025/08/HA-500x500.jpg",
    },
    {
        name: "Phạm Thị E",
        position: "GIÁM ĐỐC NHÂN SỰ",
        email: "pte@sfb.vn",
        phone: "0123 456 789",
        description: "Thành viên ban lãnh đạo phụ trách phát triển nguồn nhân lực và văn hóa doanh nghiệp.",
        image: "https://sfb.vn/wp-content/uploads/2020/04/ngvandien-500x500.jpg",
    },
];

export const stats = [
    {
        value: "8+ năm",
        label: "Kinh nghiệm triển khai",
        icon: Calendar,
    },
    {
        value: "Hàng trăm",
        label: "Dự án & triển khai thực tế",
        icon: Target,
    },
    {
        value: "Nhiều đơn vị",
        label: "Cơ quan Nhà nước & doanh nghiệp",
        icon: Users,
    },
    {
        value: "Đội ngũ",
        label: "Chuyên gia CNTT tận tâm",
        icon: Award,
    },
];

export const companyStats = [
    {
        label: "Năm thành lập",
        value: "2017",
        description:
            "Hoạt động theo mô hình Công ty Cổ phần, GPKD số 0107857710 do Sở KH&ĐT Hà Nội cấp.",
    },
    {
        label: "Trụ sở chính",
        value: "Hà Nội",
        description:
            "41A ngõ 68, đường Ngọc Thuỵ, phường Ngọc Thuỵ, quận Long Biên, thành phố Hà Nội.",
    },
    {
        label: "Văn phòng",
        value: "P303",
        description:
            "Tầng 3, Khách sạn Thể Thao, 15 Lê Văn Thiêm, P. Nhân Chính, Q. Thanh Xuân, Hà Nội.",
    },
    {
        label: "Lĩnh vực kinh doanh",
        value: "Đa ngành",
        description:
            "Tài chính, Bảo hiểm, Ngân hàng, Viễn thông, Thư viện, Chính phủ & Doanh nghiệp.",
    },
];

export const orgDepartments = [
    {
        name: "Phòng Giải pháp",
        badge: "Giải pháp & tư vấn",
        gradient: "from-orange-400 to-rose-400",
        subUnits: [
            "Bộ phận triển khai",
            "Bộ phận phát triển phần mềm",
            "Bộ phận nghiệp vụ",
        ],
    },
    {
        name: "Phòng Sản phẩm",
        badge: "Quản lý & phát triển sản phẩm",
        gradient: "from-blue-400 to-indigo-500",
        subUnits: [
            "Bộ phận triển khai",
            "Bộ phận phát triển sản phẩm",
            "Bộ phận nghiệp vụ",
        ],
    },
    {
        name: "Phòng Dự án",
        badge: "Quản lý triển khai",
        gradient: "from-emerald-400 to-teal-500",
        subUnits: [
            "Bộ phận quản lý dự án",
            "Bộ phận hỗ trợ và đào tạo",
        ],
    },
    {
        name: "Phòng Kinh doanh",
        badge: "Bán hàng & đối tác",
        gradient: "from-purple-400 to-pink-500",
        subUnits: [],
    },
    {
        name: "Phòng Hành chính",
        badge: "Vận hành nội bộ",
        gradient: "from-cyan-400 to-blue-500",
        subUnits: [
            "Bộ phận hành chính",
            "Bộ phận nhân sự",
            "Bộ phận kế toán",
        ],
    },
    {
        name: "Phòng Hệ thống thông tin",
        badge: "Hạ tầng & vận hành hệ thống",
        gradient: "from-slate-500 to-slate-700",
        subUnits: [],
    },
];
