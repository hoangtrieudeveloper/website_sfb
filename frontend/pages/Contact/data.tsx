import {
    MapPin,
    Phone,
    Mail,
    Clock,
    Facebook,
    Linkedin,
    Twitter,
    Youtube,
    MessageCircle
} from 'lucide-react';

export const contactHeroData = {
    badge: "LIÊN HỆ VỚI CHÚNG TÔI",
    title: {
        prefix: "Hãy để chúng tôi",
        highlight: "hỗ trợ bạn"
    },
    description: "Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng tư vấn và hỗ trợ bạn 24/7",
    icon: MessageCircle,
    image: "/images/contact_hero.png"
};

export const contactInfo = [
    {
        icon: MapPin,
        title: 'Địa chỉ văn phòng',
        content: '123 Đường ABC, Quận 1, TP. Hồ Chí Minh, Việt Nam',
        link: 'https://maps.google.com',
        gradient: 'from-blue-500 to-cyan-500'
    },
    {
        icon: Phone,
        title: 'Điện thoại',
        content: '(+84) 28 1234 5678',
        link: 'tel:+842812345678',
        gradient: 'from-emerald-500 to-teal-500'
    },
    {
        icon: Mail,
        title: 'Email',
        content: 'contact@sfb.vn',
        link: 'mailto:contact@sfb.vn',
        gradient: 'from-purple-500 to-pink-500'
    },
    {
        icon: Clock,
        title: 'Giờ làm việc',
        content: 'T2 - T6: 8:00 - 17:30, T7: 8:00 - 12:00',
        link: null,
        gradient: 'from-orange-500 to-amber-500'
    },
];

export const services = [
    'Cloud Computing',
    'Phát triển phần mềm',
    'Quản trị dữ liệu',
    'Business Intelligence',
    'AI & Machine Learning',
    'Cybersecurity',
    'Khác'
];

export const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook', gradient: 'from-blue-600 to-blue-700' },
    { icon: Linkedin, href: '#', label: 'LinkedIn', gradient: 'from-blue-700 to-blue-800' },
    { icon: Twitter, href: '#', label: 'Twitter', gradient: 'from-sky-500 to-sky-600' },
    { icon: Youtube, href: '#', label: 'YouTube', gradient: 'from-red-600 to-red-700' },
];

export const offices = [
    {
        city: 'TP. Hồ Chí Minh',
        address: '123 Đường ABC, Quận 1',
        phone: '(+84) 28 1234 5678',
        email: 'hcm@sfb.vn'
    },
    {
        city: 'Hà Nội',
        address: '456 Đường XYZ, Quận Ba Đình',
        phone: '(+84) 24 8765 4321',
        email: 'hn@sfb.vn'
    },
    {
        city: 'Đà Nẵng',
        address: '789 Đường DEF, Quận Hải Châu',
        phone: '(+84) 236 987 6543',
        email: 'dn@sfb.vn'
    }
];

export const mapData = {
    address: 'Khách sạn Thể Thao, P306, Tầng 3, Số 15 P. Lê Văn Thiêm, Thanh Xuân, Hà Nội',
    iframeSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.7819253605126!2d105.8003122759699!3d21.001376980641176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135acc9f0d65555%3A0x6a092258a61f4c4a!2zQ8O0bmcgVHkgQ-G7lSBQaOG6p24gQ8O0bmcgTmdo4buHIFNmYg!5e0!3m2!1svi!2s!4v1766463463476!5m2!1svi!2s"
};

export const contactFormData = {
    header: "Gửi yêu cầu tư vấn",
    description: "Điền thông tin bên dưới, chúng tôi sẽ phản hồi trong vòng 24h",
    fields: {
        name: { label: "Họ và tên", placeholder: "Nguyễn Văn A" },
        email: { label: "Email", placeholder: "email@example.com" },
        phone: { label: "Số điện thoại", placeholder: "0901234567" },
        company: { label: "Công ty", placeholder: "Tên công ty" },
        service: { label: "Dịch vụ quan tâm", placeholder: "Chọn dịch vụ" },
        message: { label: "Nội dung", placeholder: "Mô tả chi tiết nhu cầu của bạn..." }
    },
    button: {
        submit: "Gửi yêu cầu",
        success: "Đã gửi thành công!"
    }
};

export const contactSidebarData = {
    quickActions: {
        title: "Cần tư vấn ngay?",
        description: "Liên hệ trực tiếp với chúng tôi qua hotline hoặc đặt lịch hẹn tư vấn",
        buttons: {
            hotline: { label: "Hotline", value: "(+84) 28 1234 5678", href: "tel:+842812345678" },
            appointment: { label: "Đặt lịch hẹn", value: "Tư vấn 1-1 với chuyên gia", href: "#" }
        }
    },
    offices: {
        title: "Văn phòng chi nhánh",
        items: offices // Using the export above
    },
    socials: {
        title: "Kết nối với chúng tôi",
        items: socialLinks // Using the export above
    }
};

// Default export để tránh lỗi Next.js build (file này chỉ chứa data, không phải page)
export default function DataPage() {
    return null;
}