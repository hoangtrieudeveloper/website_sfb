import React from "react";

type StepBadgeProps = {
  step: number | string;
  className?: string;
};

function StarIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      className={className}
    >
      <path
        d="M1.60121 7.08806C1.38641 6.88942 1.50309 6.53031 1.79363 6.49587L5.91037 6.00758C6.02878 5.99354 6.13163 5.91918 6.18157 5.8109L7.91795 2.04648C8.0405 1.78081 8.41818 1.78076 8.54072 2.04643L10.2771 5.81082C10.327 5.9191 10.4292 5.99366 10.5476 6.0077L14.6646 6.49587C14.9551 6.53031 15.0715 6.88953 14.8567 7.08817L11.8134 9.90301C11.7259 9.98397 11.6869 10.1045 11.7101 10.2214L12.5178 14.2875C12.5748 14.5745 12.2694 14.7968 12.0141 14.6539L8.39677 12.6285C8.29272 12.5703 8.16631 12.5705 8.06226 12.6288L4.44451 14.6534C4.18922 14.7963 3.88326 14.5744 3.94028 14.2875L4.74808 10.2217C4.77132 10.1047 4.73244 9.98394 4.6449 9.90299L1.60121 7.08806Z"
        fill="url(#paint0_linear_469_1959)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_469_1959"
          x1="7.57267"
          y1="15.598"
          x2="15.5458"
          y2="13.0224"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#1D8FCF" />
          <stop offset="1" stopColor="#2EABE2" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function StepBadge({ step, className = "" }: StepBadgeProps) {
  return (
    <div
      className={[
        "flex w-[42px] flex-col items-center justify-center gap-[10px] py-[6px]",
        className,
      ].join(" ")}
    >
      <div className="relative">
        <div className="flex h-[32px] w-[32px] items-center justify-center rounded-full border-[1.5px] border-[#1D8FCF] bg-white">
          <span className="text-[14px] font-semibold text-[#1D8FCF]">
            {step}
          </span>
        </div>

        <StarIcon className="absolute -top-[10px] right-[-6px] h-[16px] w-[16px]" />
      </div>
    </div>
  );
}
