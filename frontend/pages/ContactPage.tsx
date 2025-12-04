"use client";

import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Calendar, ArrowRight, CheckCircle2, Facebook, Linkedin, Twitter, Youtube } from 'lucide-react';
import { useState } from 'react';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
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

  const services = [
    'Cloud Computing',
    'Phát triển phần mềm',
    'Quản trị dữ liệu',
    'Business Intelligence',
    'AI & Machine Learning',
    'Cybersecurity',
    'Khác'
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook', gradient: 'from-blue-600 to-blue-700' },
    { icon: Linkedin, href: '#', label: 'LinkedIn', gradient: 'from-blue-700 to-blue-800' },
    { icon: Twitter, href: '#', label: 'Twitter', gradient: 'from-sky-500 to-sky-600' },
    { icon: Youtube, href: '#', label: 'YouTube', gradient: 'from-red-600 to-red-700' },
  ];

  const offices = [
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden bg-gradient-to-br from-blue-900 via-cyan-900 to-blue-900 pt-32 pb-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 mb-8">
              <MessageCircle className="text-cyan-400" size={20} />
              <span className="text-white font-semibold text-sm">LIÊN HỆ VỚI CHÚNG TÔI</span>
            </div>
            
            <h1 className="text-white mb-8 text-5xl md:text-6xl">
              Hãy để chúng tôi
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                hỗ trợ bạn
              </span>
            </h1>
            
            <p className="text-xl text-blue-100 leading-relaxed">
              Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng tư vấn và hỗ trợ bạn 24/7
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 relative -mt-16">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <div 
                  key={index}
                  className="group bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="relative mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${info.gradient} rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                      <Icon className="text-white" size={28} />
                    </div>
                    <div className={`absolute inset-0 w-16 h-16 bg-gradient-to-br ${info.gradient} rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500`}></div>
                  </div>
                  
                  <h4 className="text-gray-900 mb-3">{info.title}</h4>
                  {info.link ? (
                    <a 
                      href={info.link}
                      target={info.link.startsWith('http') ? '_blank' : undefined}
                      rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-gray-600 hover:text-blue-600 transition-colors leading-relaxed block"
                    >
                      {info.content}
                    </a>
                  ) : (
                    <p className="text-gray-600 leading-relaxed">{info.content}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-28 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Contact Form */}
            <div>
              <div className="mb-10">
                <h2 className="text-gray-900 mb-4">Gửi yêu cầu tư vấn</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Điền thông tin bên dưới, chúng tôi sẽ phản hồi trong vòng 24h
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="0901234567"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Công ty
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="Tên công ty"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    Dịch vụ quan tâm <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="">Chọn dịch vụ</option>
                    {services.map((service, idx) => (
                      <option key={idx} value={service}>{service}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    Nội dung <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    placeholder="Mô tả chi tiết nhu cầu của bạn..."
                  />
                </div>

                <button
                  type="submit"
                  className="group w-full px-8 py-5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-2xl hover:shadow-cyan-500/50 transition-all transform hover:scale-105 flex items-center justify-center gap-3 font-semibold"
                >
                  {submitted ? (
                    <>
                      <CheckCircle2 size={24} />
                      Đã gửi thành công!
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Gửi yêu cầu
                      <ArrowRight className="group-hover:translate-x-2 transition-transform" size={20} />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right Column - Additional Info */}
            <div className="space-y-8">
              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-blue-900 via-cyan-900 to-blue-900 rounded-3xl p-10 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
                
                <div className="relative z-10">
                  <h3 className="text-white mb-6">Cần tư vấn ngay?</h3>
                  <p className="text-blue-100 mb-8 leading-relaxed">
                    Liên hệ trực tiếp với chúng tôi qua hotline hoặc đặt lịch hẹn tư vấn
                  </p>

                  <div className="space-y-4">
                    <a 
                      href="tel:+842812345678"
                      className="flex items-center gap-4 p-5 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all group"
                    >
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Phone className="text-white" size={24} />
                      </div>
                      <div>
                        <div className="text-sm text-blue-200 mb-1">Hotline</div>
                        <div className="font-semibold">(+84) 28 1234 5678</div>
                      </div>
                    </a>

                    <a 
                      href="#"
                      className="flex items-center gap-4 p-5 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all group"
                    >
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Calendar className="text-white" size={24} />
                      </div>
                      <div>
                        <div className="text-sm text-blue-200 mb-1">Đặt lịch hẹn</div>
                        <div className="font-semibold">Tư vấn 1-1 với chuyên gia</div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>

              {/* Office Locations */}
              <div className="bg-gray-50 rounded-3xl p-10 border border-gray-100">
                <h3 className="text-gray-900 mb-6">Văn phòng chi nhánh</h3>
                <div className="space-y-6">
                  {offices.map((office, idx) => (
                    <div key={idx} className="pb-6 border-b border-gray-200 last:border-b-0 last:pb-0">
                      <div className="font-semibold text-gray-900 mb-3">{office.city}</div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-start gap-2">
                          <MapPin className="flex-shrink-0 mt-0.5" size={16} />
                          <span>{office.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="flex-shrink-0" size={16} />
                          <a href={`tel:${office.phone}`} className="hover:text-blue-600 transition-colors">
                            {office.phone}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="flex-shrink-0" size={16} />
                          <a href={`mailto:${office.email}`} className="hover:text-blue-600 transition-colors">
                            {office.email}
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-3xl p-10 border-2 border-gray-100">
                <h4 className="text-gray-900 mb-6">Kết nối với chúng tôi</h4>
                <div className="grid grid-cols-2 gap-4">
                  {socialLinks.map((social, idx) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={idx}
                        href={social.href}
                        className={`flex items-center gap-3 p-4 bg-gradient-to-r ${social.gradient} text-white rounded-2xl hover:shadow-lg transition-all transform hover:scale-105`}
                      >
                        <Icon size={24} />
                        <span className="font-semibold">{social.label}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-[500px] bg-gray-200 relative">
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <MapPin size={48} className="mx-auto mb-4" />
            <p className="text-lg">Google Maps sẽ được tích hợp tại đây</p>
            <p className="text-sm mt-2">123 Đường ABC, Quận 1, TP. Hồ Chí Minh</p>
          </div>
        </div>
      </section>
    </div>
  );
}
