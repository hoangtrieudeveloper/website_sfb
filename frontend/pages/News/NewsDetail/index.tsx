"use client";

import { useEffect, useState } from "react";
import { DetailHero } from "./DetailHero";
import { DetailFeaturedImage } from "./DetailFeaturedImage";
import { DetailContent } from "./DetailContent";
import { RelatedArticles } from "./RelatedArticles";
import {
    articleData,
    tableOfContents,
    relatedArticlesData,
    articleTags,
} from "../data";

export function NewsDetailPage() {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [likes, setLikes] = useState(125);
    const [isLiked, setIsLiked] = useState(false);
    const [readProgress, setReadProgress] = useState(0);

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikes(isLiked ? likes - 1 : likes + 1);
    };

    // Reading progress
    useEffect(() => {
        const handleScroll = () => {
            const totalHeight =
                document.documentElement.scrollHeight -
                document.documentElement.clientHeight;
            if (totalHeight <= 0) {
                setReadProgress(0);
                return;
            }
            const progress = (window.scrollY / totalHeight) * 100;
            setReadProgress(progress);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-white">
            {/* Reading progress bar */}
            <div className="fixed top-0 left-0 right-0 h-1.5 bg-gray-200/60 z-50">
                <div
                    className="h-full bg-gradient-to-r from-[#006FB3] via-[#00B4D8] to-[#8B5CF6] transition-all"
                    style={{ width: `${readProgress}%` }}
                />
            </div>

            <DetailHero
                article={articleData}
                likes={likes}
                isLiked={isLiked}
                handleLike={handleLike}
                isBookmarked={isBookmarked}
                setIsBookmarked={setIsBookmarked}
            />
            <DetailFeaturedImage article={articleData} />
            <DetailContent
                article={articleData}
                tableOfContents={tableOfContents}
                tags={articleTags}
            />
            <RelatedArticles relatedArticles={relatedArticlesData} />
        </div>
    );
}

export default NewsDetailPage;
