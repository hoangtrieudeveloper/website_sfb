import {
    BarChart3,
    ShieldCheck,
    FileCheck,
    LineChart,
    Code,
    Database,
    Cloud,
} from "lucide-react";

export const partners = [
    "/images/partners/baohiem.png",
    "/images/partners/botaichinh.png",
    "/images/partners/hvcsnd.png",
    "/images/partners/hưng-yên.png",
    "/images/partners/logo3.png",
    "/images/partners/namviet.png",
    "/images/partners/sotttt-removebg-preview.png",
    "/images/partners/usaid.png",
    "/images/partners/botaichinh.png", // Repeated to ensure enough items for scrolling if needed
    "/images/partners/hvcsnd.png",
];

export const trustFeatures = [
    {
        icon: BarChart3,
        title: "Năng lực được chứng minh",
        description:
            "Triển khai nhiều dự án quy mô lớn cho cơ quan Nhà nước, doanh nghiệp và tổ chức trong các lĩnh vực Tài chính, Ngân hàng, Giáo dục, Viễn thông, Công nghiệp.",
    },
    {
        icon: ShieldCheck,
        title: "Đội ngũ chuyên gia giàu kinh nghiệm",
        description:
            "Chuyên gia nhiều năm trong phát triển phần mềm, bảo mật, hạ tầng số và thiết kế hệ thống.",
    },
    {
        icon: FileCheck,
        title: "Quy trình & cam kết minh bạch",
        description:
            "Quy trình quản lý dự án rõ ràng, từ khảo sát đến vận hành, luôn minh bạch với khách hàng.",
    },
];

export const purposeItems = [
    {
        title: "Chúng tôi hiện diện để",
        text: "Cung cấp hệ thống hoạt động hiệu quả 24/7, đáp ứng mọi nghiệp vụ công nghệ thông tin.",
    },
    {
        title: "Xây dựng niềm tin",
        text: "Lấy niềm tin khách hàng và uy tín thương hiệu làm triết lý kinh doanh.",
    },
    {
        title: "Giá trị của nhân viên",
        text: "Đề cao trung thực – kinh nghiệm – sáng tạo – trách nhiệm.",
    },
];

export const advantages = [
    { title: "Nhiều năm kinh nghiệm", text: "Thực hiện hàng trăm dự án từ nhỏ tới lớn, phức tạp." },
    { title: "Nhân viên nhiệt huyết", text: "Đội ngũ trẻ, chuyên sâu, giàu tinh thần trách nhiệm." },
    { title: "Dự án lớn liên tục hoàn thành", text: "Đáp ứng yêu cầu khó, nghiệp vụ đa ngành." },
    { title: "Làm chủ công nghệ", text: "Hạ tầng server riêng, khả năng mở rộng tức thời." },
];

export const solutions = [
    {
        id: 1,
        icon: LineChart,
        title: "Quy trình được chuẩn hóa",
        description:
            "Tất cả công việc tại SFB đều được chuẩn hóa theo quy trình rõ ràng – từ tác vụ đơn giản đến các hạng mục phức tạp. Giúp kiểm soát chất lượng, tiến độ và rủi ro một cách nhất quán.",
        benefits: [
            "Minh bạch & dễ kiểm soát",
            "Giảm rủi ro dự án",
            "Chất lượng đồng nhất",
        ],
        buttonText: "Tìm hiểu cách SFB triển khai",
        buttonLink: "/contact",
        iconGradient: "from-cyan-400 to-blue-600",
    },
    {
        id: 2,
        icon: Code,
        title: "Công nghệ .Net của Microsoft",
        description:
            "Nền tảng phát triển mạnh mẽ, đa ngôn ngữ và đa hệ điều hành, hỗ trợ xây dựng ứng dụng từ web, mobile đến enterprise. .NET mang lại hiệu suất cao, bảo mật và tốc độ triển khai tối ưu.",
        benefits: ["Bảo mật cao", "Dễ bảo trì", "Hệ sinh thái mạnh"],
        buttonText: "Xem case studies",
        buttonLink: "/industries",
        iconGradient: "from-fuchsia-400 to-indigo-600",
    },
    {
        id: 3,
        icon: Database,
        title: "Giải pháp lưu trữ hiện đại & Big Data",
        description:
            "Hạ tầng lưu trữ tiên tiến giúp xử lý và quản lý dữ liệu khổng lồ theo thời gian thực. Big Data cho phép phân tích sâu, phát hiện xu hướng và đưa ra quyết định dựa trên dữ liệu chính xác.",
        benefits: ["Big Data-ready", "Hiệu năng cao", "An toàn dữ liệu"],
        buttonText: "Tư vấn miễn phí",
        buttonLink: "/contact",
        iconGradient: "from-emerald-400 to-green-600",
    },
    {
        id: 4,
        icon: Cloud,
        title: "Khả năng mở rộng linh hoạt",
        description:
            "Hệ thống được thiết kế để dễ dàng mở rộng theo nhu cầu: từ tăng tải người dùng đến mở rộng dịch vụ. Kiến trúc linh hoạt giúp tối ưu hiệu năng và đảm bảo hoạt động ổn định ngay cả khi quy mô tăng nhanh.",
        benefits: ["n-Tier / n-Layer", "Dễ mở rộng", "Sẵn sàng quy mô lớn"],
        buttonText: "Tìm hiểu cách SFB triển khai",
        buttonLink: "/contact",
        iconGradient: "from-orange-400 to-pink-600",
    },
];

export const solutionDomains = [
    "Chính phủ & cơ quan nhà nước",
    "Doanh nghiệp",
    "Ngân hàng & bảo hiểm",
    "Giáo dục & đào tạo",
    "Viễn thông & hạ tầng số",
];

export const aboutSlides = [
    {
        title: "Tư vấn & Đánh giá hiện trạng",
        description:
            "Chúng tôi phân tích toàn diện hiện trạng vận hành, dữ liệu và quy trình của doanh nghiệp. Xác định điểm mạnh – điểm nghẽn – rủi ro tiềm ẩn để đưa ra bức tranh tổng thể.",
        buttonText: "Nhận tư vấn ngay",
        buttonLink: "/contact",
        image: "/images/card-consulting.jpg",
    },
    {
        title: "Thiết kế giải pháp phù hợp",
        description:
            "Xây dựng giải pháp tối ưu dựa trên nhu cầu thực tế và đặc thù ngành. Đảm bảo tính linh hoạt, khả năng mở rộng và hiệu quả vận hành lâu dài.",
        buttonText: "Xem case studies",
        buttonLink: "/products",
        image: "/images/card-solution.png",
    },
    {
        title: "Triển khai & Tích hợp hệ thống",
        description:
            "Thực hiện triển khai chuyên nghiệp, đảm bảo tiến độ và chất lượng. Kết nối liền mạch với các hệ thống hiện có để tối ưu vận hành tổng thể.",
        buttonText: "Tìm hiểu thêm",
        buttonLink: "/solutions",
        image: "/images/card-implementation.png",
    },
];

export const testimonials = [
    {
        id: 1,
        quote:
            "Nhiều năm sử dụng phần mềm từ SFB, phần mềm đã đồng hành cùng chúng tôi đạt được nhiều thành công. Chúng tôi phát triển một phần nhờ phần mềm của các bạn, thì đương nhiên chúng tôi sẽ luôn luôn ủng hộ các bạn.",
        author: "Ông Nguyễn Hoàng Chinh",
        rating: 5,
    },
    {
        id: 2,
        quote:
            "Chất lượng sản phẩm và dịch vụ của các bạn luôn đáp ứng được những yêu cầu, mong mỏi từ phía khoso.vn. Có đôi điều để tôi nhận xét về SFB, đó là: chuyên nghiệp, trách nhiệm, tận tình và ham học hỏi.",
        author: "Ông Vũ Kim Trung",
        rating: 5,
    },
    {
        id: 3,
        quote:
            "Cám ơn các bạn SFB đã dành nhiều tâm sức cho việc triển khai các dự án tại Nam Việt và được các đối tác của Nam Việt đánh giá rất cao. Đây là một trong những đối tác công nghệ chúng tôi tin tưởng nhất.",
        author: "Ông Nguyễn Khánh Tùng",
        rating: 5,
    },
    {
        id: 4,
        quote:
            "SFB không chỉ cung cấp giải pháp phần mềm mà còn là người bạn đồng hành tin cậy. Sự hỗ trợ nhiệt tình và chuyên môn cao của đội ngũ kỹ thuật giúp chúng tôi yên tâm vận hành hệ thống 24/7.",
        author: "Ông Nguyễn Khanh",
        rating: 5,
    },
];

export const heroData = {
    title: {
        line1: "Chuyển đổi số",
        line2: "Thông minh",
        line3: "Cho doanh nghiệp"
    },
    description: "SFB Technology đồng hành cùng doanh nghiệp trong hành trình chuyển đổi số với các giải pháp công nghệ tiên tiến, tối ưu hóa quy trình và tăng trưởng bền vững.",
    primaryButton: { text: "Khám phá giải pháp", link: "/solutions" },
    secondaryButton: { text: "Xem video" },
    heroImage: "/images/hero.png",
    partners: partners
};

export const aboutCompanyData = {
    title: {
        part1: "Chuyển đổi số ",
        highlight1: "không bắt đầu từ phần mềm",
        part2: " mà ",
        highlight2: "từ hiệu quả thực tế",
        part3: " của doanh nghiệp."
    },
    description: "SFB giúp doanh nghiệp vận hành thông minh, giảm chi phí hạ tầng, tăng năng suất và bảo mật dữ liệu an toàn tuyệt đối.",
    slides: aboutSlides
};

export const featureData = {
    header: {
        sub: "GIỚI THIỆU SFB",
        title: "Chúng tôi là ai?",
        description: "Đơn vị phát triển phần mềm với kinh nghiệm thực chiến, chuyên sâu công nghệ và định hướng xây dựng hệ thống bền vững."
    },
    block1: {
        image: "/images/feature1.png",
        text: "SFB với kinh nghiệm qua nhiều dự án lớn nhỏ, tự tin xử lý các bài toán phần mềm phức tạp, yêu cầu chuyên môn sâu. Đội ngũ trẻ – đam mê – trách nhiệm giúp xây dựng hệ thống ổn định, hiệu quả và tối ưu chi phí.",
        list: [
            "Tự tin trong các dự án phức tạp",
            "Tối ưu quy trình và chi phí",
            "Đồng hành trọn vòng đời sản phẩm",
        ],
        button: { text: "Tìm hiểu thêm", link: "/about" }
    },
    block2: {
        image: "/images/feature2.png",
        button: { text: "Tìm hiểu cách SFB triển khai", link: "/solutions" },
        items: advantages
    },
    block3: {
        image: "/images/feature3.png",
        button: { text: "Liên hệ với chúng tôi", link: "/contact" },
        items: purposeItems
    }
};

export const solutionsSectionData = {
    subHeader: "GIẢI PHÁP CHUYÊN NGHIỆP",
    title: {
        part1: "Giải pháp phần mềm",
        part2: "đóng gói cho nhiều lĩnh vực"
    },
    domains: solutionDomains,
    items: solutions
};

export const testimonialsSectionData = {
    title: "Khách hàng nói về SFB?",
    reviews: testimonials
};

export const trustSectionData = {
    subHeader: "SFB TECHNOLOGY",
    title: "Độ tin cậy của SFB Technology",
    description: "Năng lực thực chiến, đội ngũ chuyên gia và quy trình minh bạch giúp SFB trở thành đối tác công nghệ tin cậy của hàng trăm tổ chức, doanh nghiệp.",
    image: "/images/card-consulting.jpg",
    button: { text: "Tìm hiểu thêm", link: "/about" },
    features: trustFeatures
};
