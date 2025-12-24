import {
    Quote,
    CheckCircle2,
    TrendingUp,
    Clock,
    MessageCircle,
    Linkedin,
    Facebook,
    Twitter,
} from "lucide-react";
import { ImageWithFallback } from "../../../components/figma/ImageWithFallback";
import {
    newsDetailData,
    projectOverview,
    challengesData,
    solutionData,
    implementationData,
    resultsData,
    conclusionData,
} from "../data";

interface DetailContentProps {
    article: any;
    tableOfContents: any[];
    tags: string[];
}

export const DetailContent = ({
    article,
    tableOfContents,
    tags,
}: DetailContentProps) => {
    return (
        <section className="container mx-auto px-6 pb-28">
            <div className="grid lg:grid-cols-12 gap-16">
                <aside className="lg:col-span-3 hidden lg:block">
                    <div className="sticky top-28 space-y-6">
                        <div className="bg-gradient-to-br from-[#E6F4FF] to-white border-2 border-[#006FB3]/15 rounded-2xl p-6">
                            <h3 className="text-gray-900 mb-6 flex items-center gap-2">
                                <div className="w-1 h-6 bg-gradient-to-b from-[#006FB3] to-[#0088D9] rounded-full" />
                                {newsDetailData.tableOfContentsTitle}
                            </h3>
                            <nav className="space-y-3 text-sm">
                                {tableOfContents.map((item, index) => (
                                    <a
                                        key={item.id}
                                        href={`#${item.id}`}
                                        className="group flex items-start gap-3 text-gray-600 hover:text-[#006FB3] transition-all py-1.5"
                                    >
                                        <div className="w-6 h-6 rounded-lg bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-[#006FB3] group-hover:to-[#0088D9] flex items-center justify-center flex-shrink-0 transition-all">
                                            <span className="text-xs font-semibold group-hover:text-white">
                                                {index + 1}
                                            </span>
                                        </div>
                                        <span className="group-hover:translate-x-1 transition-transform">
                                            {item.title}
                                        </span>
                                    </a>
                                ))}
                            </nav>
                        </div>

                        <div className="bg-white border-2 border-gray-100 rounded-2xl p-6">
                            <h4 className="text-gray-900 mb-4">
                                {newsDetailData.shareTitle}
                            </h4>
                            <div className="space-y-2 text-sm">
                                <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#1877F2] text-white rounded-xl hover:shadow-lg transition-all">
                                    <Facebook size={18} />
                                    <span className="font-medium">Facebook</span>
                                </button>
                                <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#1DA1F2] text-white rounded-xl hover:shadow-lg transition-all">
                                    <Twitter size={18} />
                                    <span className="font-medium">Twitter</span>
                                </button>
                                <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#0A66C2] text-white rounded-xl hover:shadow-lg transition-all">
                                    <Linkedin size={18} />
                                    <span className="font-medium">LinkedIn</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>

                <article className="lg:col-span-9">
                    <div className="prose prose-lg max-w-none">
                        {/* Overview */}
                        <div id="overview" className="mb-16 scroll-mt-32">
                            <h2 className="text-gray-900 mb-6">{projectOverview.title}</h2>
                            {projectOverview.content.map((paragraph, idx) => (
                                <p key={idx} className="text-gray-700 leading-relaxed mb-6">
                                    {paragraph}
                                </p>
                            ))}

                            <div className="grid md:grid-cols-3 gap-6 my-10 not-prose">
                                {projectOverview.stats.map((stat, idx) => (
                                    <div
                                        key={idx}
                                        className={`bg-gradient-to-br ${stat.gradient} rounded-2xl p-6 text-white`}
                                    >
                                        <div className="text-4xl font-bold mb-2">{stat.value}</div>
                                        <div className="text-white/90">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Challenge */}
                        <div id="challenge" className="mb-16 scroll-mt-32">
                            <h2 className="text-gray-900 mb-6">{challengesData.title}</h2>
                            <p className="text-gray-700 leading-relaxed mb-6">
                                {challengesData.description}
                            </p>

                            <div className="space-y-4 not-prose mb-6">
                                {challengesData.items.map((challenge, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-4 bg-gray-50 rounded-xl p-5 border border-gray-200"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                                            <span className="text-white font-bold text-sm">
                                                {index + 1}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 pt-1">{challenge}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Solution */}
                        <div id="solution" className="mb-16 scroll-mt-32">
                            <h2 className="text-gray-900 mb-6">{solutionData.title}</h2>
                            <p className="text-gray-700 leading-relaxed mb-6">
                                {solutionData.description}
                            </p>

                            <div className="grid md:grid-cols-2 gap-6 not-prose mb-8">
                                {solutionData.items.map((solution, index) => (
                                    <div
                                        key={index}
                                        className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-[#006FB3] hover:shadow-xl transition-all group"
                                    >
                                        <div className="text-4xl mb-4">{solution.icon}</div>
                                        <h4 className="text-gray-900 mb-3">{solution.title}</h4>
                                        <p className="text-gray-600 leading-relaxed">
                                            {solution.description}
                                        </p>
                                        <div
                                            className={`h-1 mt-4 bg-gradient-to-r ${solution.gradient} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left`}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="bg-gradient-to-br from-[#E6F4FF] to-white border-l-4 border-[#006FB3] rounded-2xl p-8 my-10 not-prose">
                                <Quote className="text-[#006FB3] mb-4" size={32} />
                                <p className="text-xl text-gray-800 italic leading-relaxed mb-4">
                                    {solutionData.quote.text}
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#006FB3] to-[#0088D9]" />
                                    <div>
                                        <div className="font-semibold text-gray-900">
                                            {solutionData.quote.author}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {solutionData.quote.role}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Implementation */}
                        <div id="implementation" className="mb-16 scroll-mt-32">
                            <h2 className="text-gray-900 mb-6">
                                {implementationData.title}
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-6">
                                {implementationData.description}
                            </p>

                            <div className="space-y-6 not-prose">
                                {implementationData.stages.map((phase, index) => (
                                    <div
                                        key={index}
                                        className="relative pl-8 pb-8 border-l-2 border-gray-200 last:border-0 last:pb-0"
                                    >
                                        <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#006FB3] to-[#0088D9] border-4 border-white shadow-lg" />

                                        <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 hover:shadow-xl transition-all">
                                            <div className="flex items-center gap-4 mb-4">
                                                <span className="px-4 py-2 bg-gradient-to-r from-[#006FB3] to-[#0088D9] text-white rounded-full text-sm font-semibold">
                                                    {phase.phase}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    {phase.duration}
                                                </span>
                                            </div>

                                            <h4 className="text-gray-900 mb-4">{phase.title}</h4>

                                            <div className="space-y-2">
                                                {phase.tasks.map((task, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex items-center gap-3 text-gray-600"
                                                    >
                                                        <CheckCircle2
                                                            size={16}
                                                            className="text-[#006FB3] flex-shrink-0"
                                                        />
                                                        <span>{task}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Results */}
                        <div id="results" className="mb-16 scroll-mt-32">
                            <h2 className="text-gray-900 mb-6">{resultsData.title}</h2>
                            <p className="text-gray-700 leading-relaxed mb-8">
                                {resultsData.description}
                            </p>

                            <div className="grid md:grid-cols-2 gap-6 not-prose">
                                {resultsData.items.map((result, index) => {
                                    const Icon = result.icon;
                                    return (
                                        <div
                                            key={index}
                                            className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border-2 border-gray-100 hover:border-[#006FB3] hover:shadow-xl transition-all group"
                                        >
                                            <div
                                                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${result.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                                            >
                                                <Icon className="text-white" size={24} />
                                            </div>
                                            <div
                                                className={`text-5xl font-bold bg-gradient-to-r ${result.color} bg-clip-text text-transparent mb-3`}
                                            >
                                                {result.metric}
                                            </div>
                                            <div className="text-gray-600">{result.label}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Conclusion */}
                        <div id="conclusion" className="mb-16 scroll-mt-32">
                            <h2 className="text-gray-900 mb-6">{conclusionData.title}</h2>
                            {conclusionData.content.map((paragraph, idx) => (
                                <p key={idx} className="text-gray-700 leading-relaxed mb-6">
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                        {/* Tags */}
                        <div className="not-prose pt-8 border-t-2 border-gray-100">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-gray-600 font-medium">
                                    {newsDetailData.tagsLabel}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {tags.map((tag, index) => (
                                    <a
                                        key={index}
                                        href={`/news?tag=${encodeURIComponent(tag)}`}
                                        className="px-4 py-2 bg-[#E6F4FF] text-[#006FB3] rounded-xl hover:bg-gradient-to-r hover:from-[#006FB3] hover:to-[#0088D9] hover:text-white transition-all font-medium"
                                    >
                                        #{tag}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Author Bio */}
                    <div className="mt-16 bg-gradient-to-br from-[#E6F4FF] to-white rounded-3xl p-10 border-2 border-[#006FB3]/20">
                        <h3 className="text-gray-900 mb-8">{newsDetailData.authorTitle}</h3>
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#006FB3] to-[#0088D9] flex-shrink-0 overflow-hidden shadow-xl">
                                <ImageWithFallback
                                    src={article.author.avatar}
                                    alt={article.author.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-gray-900 mb-2">{article.author.name}</h4>
                                <div className="text-[#006FB3] mb-4">
                                    {article.author.position}
                                </div>
                                <p className="text-gray-600 leading-relaxed mb-6">
                                    {article.author.bio}
                                </p>
                                <a
                                    href={article.author.linkedin}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A66C2] text-white rounded-xl hover:shadow-lg transition-all transform hover:scale-105"
                                >
                                    <Linkedin size={18} />
                                    {newsDetailData.connectLinkedIn}
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="mt-16">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-gray-900 flex items-center gap-3">
                                <MessageCircle className="text-[#006FB3]" size={28} />
                                {newsDetailData.comments.title} (12)
                            </h3>
                        </div>

                        <div className="bg-white rounded-2xl border-2 border-gray-100 p-8">
                            <textarea
                                placeholder={newsDetailData.comments.placeholder}
                                rows={4}
                                className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:border-[#006FB3] focus:outline-none transition-all resize-none"
                            />
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-sm text-gray-500">
                                    {newsDetailData.comments.loginText}
                                </div>
                                <button className="px-8 py-3 bg-gradient-to-r from-[#006FB3] to-[#0088D9] text-white rounded-xl hover:shadow-lg transition-all transform hover:scale-105 font-semibold">
                                    {newsDetailData.comments.submitButton}
                                </button>
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </section>
    );
};
