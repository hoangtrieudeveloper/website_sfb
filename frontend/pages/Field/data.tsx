import {
    Code2,
    MonitorSmartphone,
    Network,
    Globe2,
    ShieldCheck,
    Users,
    Award,
    Target,
    Sparkles,
    ArrowRight,
    Phone,
} from "lucide-react";

export const fields = [
    {
        id: 1,
        icon: Code2,
        title: "Phát triển phần mềm",
        short:
            "Thiết kế & xây dựng các hệ thống phần mềm nghiệp vụ, web, mobile và sản phẩm đóng gói.",
        points: [
            "Ứng dụng quản lý nghiệp vụ cho cơ quan, doanh nghiệp",
            "Web / portal nội bộ & bên ngoài",
            "Sản phẩm phần mềm đóng gói, triển khai nhanh",
        ],
        gradient: "from-blue-500 to-cyan-500",
    },
    {
        id: 2,
        icon: MonitorSmartphone,
        title: "Tư vấn xây dựng & phát triển hệ thống CNTT",
        short:
            "Đồng hành từ khảo sát, tư vấn kiến trúc đến lộ trình triển khai tổng thể hệ thống CNTT.",
        points: [
            "Khảo sát hiện trạng & nhu cầu nghiệp vụ",
            "Đề xuất kiến trúc hệ thống & lộ trình chuyển đổi số",
            "Tư vấn lựa chọn nền tảng công nghệ phù hợp",
        ],
        gradient: "from-purple-500 to-pink-500",
    },
    {
        id: 3,
        icon: Network,
        title: "Tích hợp hệ thống & quản trị vận hành",
        short:
            "Kết nối các hệ thống hiện hữu, quản lý vận hành tập trung, an toàn và ổn định.",
        points: [
            "Xây dựng nền tảng tích hợp dữ liệu & dịch vụ",
            "Kết nối các hệ thống lõi, ứng dụng vệ tinh",
            "Giám sát, vận hành hệ thống 24/7",
        ],
        gradient: "from-emerald-500 to-teal-500",
    },
    {
        id: 4,
        icon: Globe2,
        title: "Giải pháp cổng thông tin điện tử",
        short:
            "Cổng thông tin cho tổ chức, doanh nghiệp với trải nghiệm người dùng hiện đại.",
        points: [
            "Cổng thông tin nội bộ & đối ngoại",
            "Quản lý nội dung, tin tức, dịch vụ trực tuyến",
            "Tối ưu tra cứu, tìm kiếm & tra cứu hồ sơ",
        ],
        gradient: "from-orange-500 to-amber-500",
    },
    {
        id: 5,
        icon: ShieldCheck,
        title: "Cổng thông tin Chính phủ điện tử trên nền tảng SharePoint",
        short:
            "Giải pháp chuyên sâu cho khối nhà nước dựa trên Microsoft SharePoint.",
        points: [
            "Kiến trúc tuân thủ quy định Chính phủ điện tử",
            "Quy trình phê duyệt, luân chuyển hồ sơ điện tử",
            "Bảo mật cao, phân quyền chi tiết",
        ],
        gradient: "from-sky-500 to-blue-600",
    },
    {
        id: 6,
        icon: Users,
        title: "Outsourcing",
        short:
            "Cung cấp đội ngũ phát triển phần mềm chuyên nghiệp, linh hoạt theo mô hình dự án.",
        points: [
            "Team dev, BA, QA, DevOps theo yêu cầu",
            "Linh hoạt thời gian & hình thức hợp tác",
            "Đảm bảo quy trình & chất lượng theo tiêu chuẩn SFB",
        ],
        gradient: "from-rose-500 to-pink-500",
    },
];

export const successMetrics = [
    {
        icon: Award,
        value: "8+ năm",
        label: "Kinh nghiệm triển khai",
        gradient: "from-blue-500 to-cyan-500",
    },
    {
        icon: Target,
        value: "Hàng trăm",
        label: "Dự án & triển khai thực tế",
        gradient: "from-purple-500 to-pink-500",
    },
    {
        icon: Users,
        value: "Nhiều đơn vị",
        label: "Cơ quan Nhà nước & doanh nghiệp",
        gradient: "from-emerald-500 to-teal-500",
    },
    {
        icon: Sparkles,
        value: "Đội ngũ",
        label: "Chuyên gia CNTT tận tâm",
        gradient: "from-orange-500 to-red-500",
    },
];

export const processSteps = [
    {
        id: "01",
        icon: Target,
        title: "Hiểu rõ đặc thù từng ngành",
        description:
            "Kinh nghiệm triển khai cho khối Nhà nước, giáo dục, y tế, doanh nghiệp giúp SFB nắm rõ quy định, quy trình và nhu cầu thực tế của từng đơn vị.",
        points: [
            "Nắm bắt nhanh yêu cầu nghiệp vụ",
            "Giải pháp “fit” quy trình, không one-size-fits-all",
        ],
        colors: {
            gradient: "from-blue-500 to-cyan-500",
            strip: "from-blue-500 via-cyan-500 to-sky-400",
            border: "border-blue-100",
            shadowInfo: {
                base: "rgba(15,23,42,0.06)",
                hover: "rgba(37,99,235,0.18)"
            },
            checkColor: "text-blue-600"
        },
        button: {
            text: "Liên hệ với chúng tôi",
            link: "/contact",
            icon: ArrowRight,
            iconSize: 18
        }
    },
    {
        id: "02",
        icon: Users,
        title: "Đội ngũ chuyên gia đồng hành",
        description:
            "Kết hợp BA, dev, QA, DevOps và chuyên gia nghiệp vụ theo từng lĩnh vực, hỗ trợ khách hàng từ giai đoạn ý tưởng đến vận hành.",
        points: [
            "Trao đổi trực tiếp với team tư vấn & triển khai",
            "Đào tạo & hỗ trợ sau khi go-live",
        ],
        colors: {
            gradient: "from-emerald-500 to-teal-500",
            strip: "from-emerald-500 via-teal-500 to-cyan-400",
            border: "border-emerald-100",
            shadowInfo: {
                base: "rgba(15,23,42,0.06)",
                hover: "rgba(16,185,129,0.22)"
            },
            checkColor: "text-emerald-600"
        },
        button: {
            text: "Kết nối với chuyên gia",
            link: "/experts",
            icon: Phone,
            iconSize: 18
        }
    },
    {
        id: "03",
        icon: Award,
        title: "Quy trình & chất lượng nhất quán",
        description:
            "Áp dụng quy trình chuẩn trong phân tích, phát triển, kiểm thử và triển khai, đảm bảo mỗi dự án đều đạt chất lượng như cam kết.",
        points: [
            "Quy trình rõ ràng, minh bạch tiến độ",
            "Dễ dàng mở rộng & bảo trì về sau",
        ],
        colors: {
            gradient: "from-purple-500 to-pink-500",
            strip: "from-purple-500 via-violet-500 to-pink-400",
            border: "border-purple-100",
            shadowInfo: {
                base: "rgba(15,23,42,0.06)",
                hover: "rgba(168,85,247,0.22)"
            },
            checkColor: "text-purple-600"
        },
        button: {
            text: "Tìm hiểu quy trình, nghiệp vụ",
            link: "/process",
            icon: Sparkles, // Using Sparkles as FileText wasn't imported in data.tsx, but I can add it
            iconSize: 18
        }
    },
];

// fieldHeroData
export const fieldHeroData = {
    title: {
        prefix: "Giải pháp công nghệ tối ưu",
        suffix: "vận hành doanh nghiệp"
    },
    description: "Hơn 8 năm xây dựng và phát triển, SFBTECH.,JSC đồng hành cùng nhiều cơ quan Nhà nước và doanh nghiệp trong hành trình chuyển đổi số với hàng trăm dự án triển khai thực tế.",
    button: {
        text: "KHÁM PHÁ GIẢI PHÁP",
        link: "/solutions"
    },
    image: "/images/fieldhero.png",
    stats: successMetrics // Reusing the existing export
};

export const fieldListSectionData = {
    header: {
        badge: "Lĩnh vực",
        title: "Các lĩnh vực hoạt động & dịch vụ",
        description: "Những mảng chuyên môn chính mà SFB đang cung cấp giải pháp và dịch vụ công nghệ thông tin cho cơ quan Nhà nước & doanh nghiệp"
    },
    items: fields // Reusing the existing export
};

export const fieldProcessSectionData = {
    header: {
        subtitle: "LỘ TRÌNH ĐỒNG HÀNH CÙNG SFB",
        title: {
            part1: "Vì sao SFB phù hợp cho",
            highlight: "nhiều",
            part2: "lĩnh vực khác nhau"
        }
    }
};
