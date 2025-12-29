import { contactInfo } from "./data";

export function ContactInfoCards() {
    return (
        <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 relative -mt-16">
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                    {contactInfo.map((info, index) => {
                        const Icon = info.icon;
                        return (
                            <div
                                key={index}
                                className="group bg-white rounded-3xl p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 border border-gray-100"
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
    );
}
