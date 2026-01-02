import {
    LineChart,
    Code,
    Database,
    Cloud,
    Users,
    TrendingUp,
    Zap,
    Award,
    Sparkles,
    CheckCircle2
} from "lucide-react";

export const solutionsHeroData = {
    title: {
        line1: "Giải pháp toàn diện cho",
        line2: "chuyển đổi số"
    },
    description: "Từ tư vấn, thiết kế đến triển khai và vận hành - chúng tôi đồng hành cùng bạn trong suốt hành trình số hóa doanh nghiệp",
    button: {
        text: "Khám phá giải pháp",
        link: "#solutions-list"
    },
    secondaryButton: {
        text: "Tư vấn miễn phí",
        link: "/contact"
    }
};

export const solutionsListData = {
    badge: "Giải pháp",
    title: "Lý do chọn giải pháp của SFB",
    description: "Nền tảng công nghệ và quy trình triển khai được chuẩn hóa, đảm bảo hệ thống ổn định, bảo mật và sẵn sàng mở rộng lâu dài",
    items: [
        {
            id: 1,
            icon: LineChart,
            title: "Quy trình được chuẩn hóa",
            description: "Tất cả công việc tại SFB đều được chuẩn hóa theo quy trình rõ ràng – từ tác vụ đơn giản đến các hạng mục phức tạp. Giúp kiểm soát chất lượng, tiến độ và rủi ro một cách nhất quán.",
            benefits: ["Minh bạch & dễ kiểm soát", "Giảm rủi ro dự án", "Chất lượng đồng nhất"],
            gradient: "from-blue-500 via-cyan-500 to-teal-500",
        },
        {
            id: 2,
            icon: Code,
            title: "Công nghệ .NET của Microsoft",
            description: "SFB lựa chọn nền tảng .NET phổ biến và ổn định của Microsoft để xây dựng hệ thống cho khách hàng – dễ phát triển, bảo mật cao, dễ bảo trì và mở rộng lâu dài.",
            benefits: ["Bảo mật cao", "Dễ bảo trì", "Hệ sinh thái mạnh"],
            gradient: "from-purple-500 via-indigo-500 to-blue-500",
        },
        {
            id: 3,
            icon: Database,
            title: "Giải pháp lưu trữ hiện đại & Big Data",
            description: "Xu hướng dữ liệu lớn (Big Data) giống như các hệ thống Google, Facebook là tất yếu. SFB tiên phong xây dựng giải pháp lưu trữ hiện đại, xử lý khối lượng dữ liệu lớn một cách an toàn và hiệu quả.",
            benefits: ["Big Data-ready", "Hiệu năng cao", "An toàn dữ liệu"],
            gradient: "from-emerald-500 via-green-500 to-lime-500",
        },
        {
            id: 4,
            icon: Cloud,
            title: "Khả năng mở rộng linh hoạt",
            description: "Kiến trúc hệ thống được thiết kế với tư duy mở rộng: cả về hạ tầng vật lý (N-Tier) lẫn kiến trúc phần mềm (N-Layer). Sẵn sàng đáp ứng nhu cầu tăng trưởng của doanh nghiệp.",
            benefits: ["N-Tier / N-Layer", "Dễ mở rộng", "Sẵn sàng quy mô lớn"],
            gradient: "from-orange-500 via-amber-500 to-yellow-500",
        },
    ]
};

export const processData = {
    badge: "QUY TRÌNH LÀM VIỆC",
    title: "Quy trình triển khai giải pháp tại SFB",
    description: "Từ khảo sát, thiết kế đến vận hành, quy trình được chuẩn hóa giúp dự án minh bạch, đúng tiến độ và dễ mở rộng trong tương lai",
    steps: [
        {
            number: "01",
            title: "Khảo sát hiện trạng & tư vấn giải pháp",
            description: "Làm việc với đơn vị để hiểu quy trình nghiệp vụ, phân tích hệ thống hiện tại, xác định vấn đề và thống nhất mục tiêu chuyển đổi số.",
            icon: Users,
        },
        {
            number: "02",
            title: "Thiết kế kiến trúc & kế hoạch triển khai",
            description: "Thiết kế kiến trúc hệ thống trên nền tảng .NET, cơ sở dữ liệu & hạ tầng (N-Tier / N-Layer), lập roadmap triển khai chi tiết theo từng giai đoạn.",
            icon: TrendingUp,
        },
        {
            number: "03",
            title: "Phát triển, kiểm thử & hoàn thiện",
            description: "Phát triển chức năng, tích hợp dữ liệu, kiểm thử (unit, integration, UAT) liên tục; demo định kỳ với khách hàng để tinh chỉnh theo thực tế.",
            icon: Zap,
        },
        {
            number: "04",
            title: "Triển khai, đào tạo & hỗ trợ vận hành",
            description: "Triển khai lên môi trường chính thức, đào tạo người dùng, bàn giao tài liệu và đồng hành hỗ trợ, bảo trì – tối ưu hiệu năng, mở rộng về sau.",
            icon: Award,
        },
    ]
};

export const ctaData = {
    title: "Sẵn sàng bắt đầu dự án của bạn?",
    description: "Liên hệ với chúng tôi ngay để được tư vấn miễn phí và nhận báo giá chi tiết",
    primaryButton: {
        text: "Liên hệ ngay",
        link: "/contact"
    },
    secondaryButton: {
        text: "Hotline: (+84) 28 1234 5678",
        link: "tel:+842812345678"
    }
};

// Default export để tránh lỗi Next.js build (file này chỉ chứa data, không phải page)
export default function DataPage() {
    return null;
}