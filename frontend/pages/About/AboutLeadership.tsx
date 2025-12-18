import { Phone, Mail } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../../components/ui/carousel";

export function AboutLeadership() {
    const leaders = [
        {
            name: "Nguyễn Văn Điền",
            position: "KÉ TOÁN TRƯỞNG",
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
        // Placeholder added to meet the "5 people" request
        {
            name: "Lê Văn D",
            position: "GIÁM ĐỐC VẬN HÀNH",
            email: "lvd@sfb.vn",
            phone: "0987 654 321",
            description: "Thành viên ban lãnh đạo phụ trách vận hành và quy trình nội bộ, đảm bảo hiệu suất hoạt động tối ưu.",
            image: "https://sfb.vn/wp-content/uploads/2025/08/HA-500x500.jpg",
        },
        // Placeholder added to meet the "5 people" request
        {
            name: "Phạm Thị E",
            position: "GIÁM ĐỐC NHÂN SỰ",
            email: "pte@sfb.vn",
            phone: "0123 456 789",
            description: "Thành viên ban lãnh đạo phụ trách phát triển nguồn nhân lực và văn hóa doanh nghiệp.",
            image: "https://sfb.vn/wp-content/uploads/2020/04/ngvandien-500x500.jpg",
        },
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-[1340px] mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16 max-w-4xl mx-auto">
                    <h2 className="text-[#0F172A] text-3xl md:text-5xl font-bold mb-4">
                        Ban lãnh đạo
                    </h2>
                    <p className="text-gray-600 md:text-lg leading-relaxed max-w-3xl mx-auto">
                        Đội ngũ lãnh đạo chủ chốt của SFB Technology, định hướng chiến lược và đồng hành cùng khách hàng trong mọi dự án
                    </p>
                </div>

                {/* Carousel */}
                <div className="px-12 relative">
                    <Carousel
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-4">
                            {leaders.map((leader, index) => (
                                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                                    <div className="group h-full bg-[#f9fafb] rounded-[16px] overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col items-center p-8 text-center">
                                        <div className="mb-6 relative w-48 h-48 flex-shrink-0">
                                            <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-md">
                                                <ImageWithFallback
                                                    src={leader.image}
                                                    alt={leader.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>

                                        <h3 className="text-[#0F172A] text-xl font-bold mb-1">
                                            {leader.name}
                                        </h3>

                                        <div className="text-[#2CA4E0] font-semibold text-sm uppercase mb-4 tracking-wider">
                                            {leader.position}
                                        </div>

                                        <p className="text-gray-500 text-xs leading-relaxed mb-6 max-w-xs mx-auto flex-grow">
                                            {leader.description}
                                        </p>

                                        <div className="mt-auto flex items-center justify-center gap-6 w-full pt-4 border-t border-gray-100">
                                            <div className="flex items-center gap-2">
                                                <Phone size={14} className="text-[#2CA4E0]" />
                                                <a href={`tel:${leader.phone}`} className="text-[#334155] text-xs hover:text-[#2CA4E0] transition-colors font-medium">
                                                    {leader.phone}
                                                </a>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Mail size={14} className="text-[#2CA4E0]" />
                                                <a href={`mailto:${leader.email}`} className="text-[#334155] text-xs hover:text-[#2CA4E0] transition-colors font-medium">
                                                    {leader.email}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="hidden md:flex -left-12 border-[#2CA4E0] text-[#2CA4E0] hover:bg-[#2CA4E0] hover:text-white" />
                        <CarouselNext className="hidden md:flex -right-12 border-[#2CA4E0] text-[#2CA4E0] hover:bg-[#2CA4E0] hover:text-white" />
                    </Carousel>
                </div>
            </div>
        </section>
    );
}
