import {
    DollarSign,
    TrendingUp,
    Coffee,
    Heart,
    Rocket,
    Award,
} from "lucide-react";

export const benefits = [
    {
        icon: DollarSign,
        title: "Lương thưởng hấp dẫn",
        description:
            "Mức lương cạnh tranh top đầu thị trường, thưởng theo hiệu quả công việc",
        gradient: "from-emerald-500 to-teal-500",
    },
    {
        icon: TrendingUp,
        title: "Thăng tiến rõ ràng",
        description:
            "Lộ trình phát triển sự nghiệp minh bạch, đánh giá định kỳ 6 tháng",
        gradient: "from-[#006FB3] to-[#0088D9]",
    },
    {
        icon: Coffee,
        title: "Môi trường năng động",
        description:
            "Văn hóa startup, không gian làm việc hiện đại, team building định kỳ",
        gradient: "from-orange-500 to-amber-500",
    },
    {
        icon: Heart,
        title: "Chăm sóc sức khỏe",
        description:
            "Bảo hiểm sức khỏe toàn diện, khám sức khỏe định kỳ, gym membership",
        gradient: "from-rose-500 to-pink-500",
    },
    {
        icon: Rocket,
        title: "Công nghệ tiên tiến",
        description:
            "Làm việc với tech stack mới nhất, tham gia dự án quốc tế",
        gradient: "from-purple-500 to-pink-500",
    },
    {
        icon: Award,
        title: "Đào tạo & phát triển",
        description:
            "Ngân sách training unlimited, hỗ trợ certification & conference",
        gradient: "from-indigo-500 to-purple-500",
    },
];

export const positions = [
    {
        id: 1,
        title: "Senior Full-stack Developer",
        department: "Engineering",
        type: "Full-time",
        location: "TP. HCM",
        salary: "2000 - 3500 USD",
        experience: "4+ years",
        skills: ["React", "Node.js", "AWS", "MongoDB"],
        description:
            "Phát triển và maintain các hệ thống enterprise cho khách hàng lớn. Lead team 3-5 developers.",
        gradient: "from-[#006FB3] to-[#0088D9]",
    },
    {
        id: 2,
        title: "Mobile Developer (Flutter)",
        department: "Engineering",
        type: "Full-time",
        location: "TP. HCM / Remote",
        salary: "1500 - 2500 USD",
        experience: "2+ years",
        skills: ["Flutter", "Dart", "Firebase", "RESTful API"],
        description:
            "Xây dựng mobile app cho các lĩnh vực fintech, e-commerce, healthcare.",
        gradient: "from-purple-500 to-pink-500",
    },
    {
        id: 3,
        title: "DevOps Engineer",
        department: "Infrastructure",
        type: "Full-time",
        location: "TP. HCM",
        salary: "1800 - 3000 USD",
        experience: "3+ years",
        skills: ["AWS", "Kubernetes", "Docker", "Terraform"],
        description:
            "Quản lý infrastructure, CI/CD pipeline, monitoring và scaling hệ thống.",
        gradient: "from-emerald-500 to-teal-500",
    },
    {
        id: 4,
        title: "UI/UX Designer",
        department: "Design",
        type: "Full-time",
        location: "TP. HCM",
        salary: "1200 - 2000 USD",
        experience: "2+ years",
        skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
        description:
            "Thiết kế giao diện và trải nghiệm người dùng cho web/mobile app.",
        gradient: "from-orange-500 to-amber-500",
    },
    {
        id: 5,
        title: "Data Engineer",
        department: "Data",
        type: "Full-time",
        location: "TP. HCM",
        salary: "2000 - 3200 USD",
        experience: "3+ years",
        skills: ["Python", "Spark", "Airflow", "SQL"],
        description:
            "Xây dựng data pipeline, ETL và data warehouse cho dự án Big Data.",
        gradient: "from-indigo-500 to-purple-500",
    },
    {
        id: 6,
        title: "QA Automation Engineer",
        department: "Quality Assurance",
        type: "Full-time",
        location: "TP. HCM / Remote",
        salary: "1000 - 1800 USD",
        experience: "2+ years",
        skills: ["Selenium", "Jest", "Cypress", "CI/CD"],
        description:
            "Phát triển automation test, đảm bảo chất lượng sản phẩm.",
        gradient: "from-rose-500 to-pink-500",
    },
];

// Default export để tránh lỗi Next.js build (file này chỉ chứa data, không phải page)
export default function DataPage() {
    return null;
}