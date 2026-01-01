export type ProductOverviewCard = {
    step: number;
    title: string;
    desc: string;
};

export type OverlayImage = {
    src: string;
    alt?: string;
    sizeClass: string;
    objectClass?: string;
    positionClass?: string;
    frameClass?: string;
};

export type ProductShowcase = {
    title: string;
    desc: string;
    bullets: string[];
    ctaText?: string;
    ctaHref?: string;


    single?: OverlayImage;


    overlay?: {
        back: OverlayImage;
        front: OverlayImage;
    };
};

export type TitledParagraph = {
    title: string;
    text: string;
};

export type SectionParagraph = string | TitledParagraph;

export type NumberedSection = {
    no: number;
    title: string;
    paragraphs: SectionParagraph[];
    image: string;
    imageAlt?: string;
    imageSide: "left" | "right";


    overlay?: {
        back: OverlayImage;
        front?: OverlayImage;
    };
};

export type ProductDetail = {
    slug: string;

    // HERO
    metaTop: string;
    name: string;
    heroDescription: string;
    heroImage: string;

    // OVERVIEW
    overviewKicker: string;
    overviewTitle: string;
    overviewCards: ProductOverviewCard[];

    // SHOWCASE
    showcase: ProductShowcase;

    // SECTION 1..5
    numberedSections: NumberedSection[];

    // EXPAND
    expandTitle: string;
    expandBullets: string[];
    expandCtaText: string;
    expandCtaHref: string;
    expandImage: string;
};

export const productDetails: ProductDetail[] = [
    {
        slug: "he-thong-tuyen-sinh-au-cap",

        metaTop: "TÀI LIỆU GIỚI THIỆU PHẦN MỀM",
        name: "Hệ thống tuyển sinh đầu cấp",
        heroDescription:
            "Phần mềm tuyển sinh đầu cấp là giải pháp giúp nhà trường quản lý tập trung thông tin học sinh và hoạt động lớp học. Phần mềm hỗ trợ các chức năng chính như quản lý hồ sơ học sinh, quản lý nhân sự, quản lý sổ sách, điểm danh và theo dõi đánh giá trẻ. Qua đó, giáo viên dễ dàng cập nhật tình hình học tập, rèn luyện của học sinh, nhà trường nâng cao hiệu quả quản lý, giảm sổ sách thủ công và đảm bảo thông tin chính xác.",

        heroImage: "/images/product_detail/heroproductdetail.png",

        overviewKicker: "SFB - HỒ SƠ HỌC SINH",
        overviewTitle: "Tổng quan hệ thống",
        overviewCards: [
            {
                step: 1,
                title: "Quản lý thông tin",
                desc: "Người dùng có thể quản lý các thông tin như nhân sự, lớp học, học sinh.",
            },
            {
                step: 2,
                title: "Nhập liệu",
                desc: "Chức năng cho phép giáo viên thực hiện nhập điểm và theo dõi học sinh.",
            },
            {
                step: 3,
                title: "Tổng kết",
                desc: "Là chức năng tổng hợp kết quả học tập theo năm của toàn trường.",
            },
            {
                step: 4,
                title: "Báo cáo",
                desc: "Cấp các chức năng báo cáo thống kê trên tất cả dữ liệu quản lý trong nhà trường.",
            },
            {
                step: 5,
                title: "Sổ sách",
                desc: "Quản lý các loại sổ sách của giáo viên, học sinh theo các mẫu đang sử dụng hiện hành trong trường.",
            },
        ],


        showcase: {
            title: "Trang chủ hệ thống",
            desc: "Trang chủ hệ thống hiển thị trực quan các biểu đồ thống kê theo kết quả học tập của lớp, khối để người dùng theo dõi tiến độ đánh giá, kết quả một cách nhanh và dễ dàng nhất.",
            bullets: [
                "Nắm bắt nhanh yêu cầu nghiệp vụ",
                'Giải pháp “fit” quy trình, không one-size-fits-all',
            ],
            ctaText: "Liên hệ với chúng tôi",
            ctaHref: "/contact",

            overlay: {
                back: {
                    src: "/images/product_detail/bieudocot.png",
                    alt: "Biểu đồ cột",
                    sizeClass: "w-[701px] h-[511px]",
                    objectClass: "object-fill",
                    frameClass:
                        "rounded-[24px] border-[10px] border-white bg-white shadow-[0_18px_36px_rgba(15,23,42,0.12)] overflow-hidden",
                },
                front: {
                    src: "/images/product_detail/bieudotron1.png",
                    alt: "Biểu đồ tròn",
                    sizeClass: "w-[561px] h-[375px]",
                    objectClass: "object-fill",
                    positionClass: "absolute left-[183.5px] bottom-0",
                    frameClass:
                        "rounded-[24px] bg-white shadow-[0_18px_36px_rgba(15,23,42,0.12)] overflow-hidden",
                },
            },

            // Nếu sản phẩm khác chỉ có 1 ảnh, bạn chỉ cần bỏ overlay,
            // và dùng single như dưới (ví dụ):
            // single: {
            //   src: "/images/products/product-2/showcase.png",
            //   alt: "Showcase",
            //   sizeClass: "w-[701px] h-[511px]",
            //   objectClass: "object-cover",
            //   frameClass:
            //     "rounded-[24px] border-[10px] border-white bg-white shadow-[0_18px_36px_rgba(15,23,42,0.12)] overflow-hidden",
            // },
        },

        numberedSections: [
            {
                no: 1,
                title: "Quản lý thông tin nhân sự, học sinh, lớp học",
                paragraphs: [
                    {
                        title: "Học sinh",
                        text: "Người dùng có thể quản lý học sinh theo khối, lớp, khu vực, giới tính nhằm phục vụ công tác quản lý, tuyển sinh sau này hoặc công tác phân bổ học sinh, giáo viên trên địa bàn.",
                    },
                    {
                        title: "Lớp học",
                        text: "Hệ thống cung cấp các tính năng trong việc phân chia lớp, xếp môn cho lớp. Việc phân môn chính xác giúp tính toán điểm và tổng kết đơn giản và dễ dàng hơn.",
                    },
                    {
                        title: "Nhân sự",
                        text: "Hệ thống quản lý tất cả thông tin của nhân sự theo từng trường, từng nhóm bộ môn. Dữ liệu quản lý có thể phục vụ cho việc thống kê, in báo cáo cho Ban giám hiệu nhà trường.",
                    },
                ],
                image: "/images/product_detail/featuresection1.png",
                imageSide: "right",


                overlay: {
                    back: {
                        src: "/images/product_detail/featuresection1.png",
                        alt: "Section 1 - ảnh chính",
                        sizeClass: "w-[701px] h-[511px]",
                        objectClass: "object-cover",
                        frameClass:
                            "rounded-[24px] border-[10px] border-white bg-white shadow-[0_18px_36px_rgba(15,23,42,0.12)] overflow-hidden",
                    },
                    front: {
                        src: "/images/product_detail/fearutesection1.1.png",
                        alt: "Section 1 - ảnh chồng",
                        sizeClass: "w-[561px] h-[375px]",
                        objectClass: "object-cover",
                        positionClass: "absolute left-[183.5px] bottom-0",
                        frameClass:
                            "rounded-[24px] bg-white shadow-[0_18px_36px_rgba(15,23,42,0.12)] overflow-hidden",
                    },
                },
            },
            {
                no: 2,
                title: "Chức năng nhập liệu",
                paragraphs: [
                    "Hệ thống căn cứ trên các thông tư được ban hành để xây dựng nên sổ dữ liệu tính điểm cho trường.",
                    "Thiết kế giao diện đơn giản cùng các tiện ích tìm kiếm phục vụ cho công tác tính điểm của giáo viên và công tác quản lý của ban giám hiệu nhà trường.",
                ],
                image: "/images/product_detail/featuresection2.png",
                imageSide: "left",

                overlay: {
                    back: {
                        src: "/images/product_detail/featuresection2.png",
                        alt: "Section 2 - ảnh chính",
                        sizeClass: "w-[701px] h-[511px]",
                        objectClass: "object-contain",
                        frameClass:
                            "rounded-[24px] border-[10px] border-white bg-white shadow-[0_18px_36px_rgba(15,23,42,0.12)] overflow-hidden",
                    },
                },
            },
            {
                no: 4,
                title: "Thống kê báo cáo",
                paragraphs: [
                    "Phần mềm cung cấp các chức năng báo cáo thống kê trên tất cả dữ liệu quản lý trong nhà trường.",
                ],
                image: "/images/product_detail/featuresection4.png",
                imageSide: "right",


                overlay: {
                    back: {
                        src: "/images/product_detail/featuresection4.png",
                        alt: "Section 4 - ảnh chính",
                        sizeClass: "w-[701px] h-[511px]",
                        objectClass: "object-cover",
                        frameClass:
                            "rounded-[24px] border-[10px] border-white bg-white shadow-[0_18px_36px_rgba(15,23,42,0.12)] overflow-hidden",
                    },
                    front: {
                        src: "/images/product_detail/featuresection4.1.png",
                        alt: "Section 4 - ảnh chồng",
                        sizeClass: "w-[561px] h-[375px]",
                        objectClass: "object-cover",
                        positionClass: "absolute left-[183.5px] bottom-0",
                        frameClass:
                            "rounded-[24px] bg-white shadow-[0_18px_36px_rgba(15,23,42,0.12)] overflow-hidden",
                    },
                },
            },
            {
                no: 5,
                title: "Sổ sách",
                paragraphs: [
                    "Ngoài việc quản lý thông tin, kết quả học tập, phần mềm Hồ sơ học sinh phát triển các tính năng phục vụ cho việc lưu trữ nhưcác sổ sách trong việc quản lý nhà trường. Thông tin các sổ sách được dựa theo thông tư đã ban hành và ý kiến trao đổi với phía nhà trường.",
                ],
                image: "/images/product_detail/featuresection5.png",
                imageSide: "left",


                overlay: {
                    back: {
                        src: "/images/product_detail/featuresection5.png",
                        alt: "Section 5 - ảnh chính",
                        sizeClass: "w-[701px] h-[511px]",
                        objectClass: "object-cover",
                        frameClass:
                            "rounded-[24px] border-[10px] border-white bg-white shadow-[0_18px_36px_rgba(15,23,42,0.12)] overflow-hidden",
                    },
                    front: {
                        src: "/images/product_detail/featuresection5.2.png",
                        alt: "Section 5 - ảnh chồng",
                        sizeClass: "w-[561px] h-[375px]",
                        objectClass: "object-cover",
                        positionClass: "absolute left-[183.5px] bottom-0",
                        frameClass:
                            "rounded-[24px] bg-white shadow-[0_18px_36px_rgba(15,23,42,0.12)] overflow-hidden",
                    },
                },
            },
        ],

        expandTitle: "Khả năng phát triển mở rộng",
        expandBullets: [
            "Tích hợp các hệ thống dùng chung",
            "Cập nhật liên tục các tiện ích, tính năng",
            "Hỗ trợ tận tình trong quá trình sử dụng",
        ],
        expandCtaText: "Demo hệ thống",
        expandCtaHref: "#demo",
        expandImage: "/images/product_detail/heroproductdetail.png",
    },
];

export function getProductBySlug(slug: string) {
    return productDetails.find((p) => p.slug === slug);
}
