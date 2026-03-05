"use client";

import Image from "next/image";

const GOLD = "#C9A84C";
const AVATAR_SIZE = 40;

const MEMBER_IMAGES = [
  "/members/person1.webp",
  "/members/person2.webp",
  "/members/person3.webp",
  "/members/person4.webp",
  "/members/person5.webp",
  "/members/person6.webp",
];

/** Row of 6 member images + 500+ circle (for inline use e.g. next to a button) */
export function MemberAvatarsRow() {
  return (
    <div className="flex items-center -space-x-2 flex-shrink-0">
      {MEMBER_IMAGES.map((src, i) => (
        <div
          key={src}
          className="relative rounded-full overflow-hidden flex-shrink-0 border-2 border-gold"
          style={{
            width: AVATAR_SIZE,
            height: AVATAR_SIZE,
            boxShadow: `0 0 0 1px ${GOLD}40`,
          }}
        >
          <Image
            src={src}
            alt={`Member ${i + 1}`}
            width={AVATAR_SIZE}
            height={AVATAR_SIZE}
            className="object-cover w-full h-full"
          />
        </div>
      ))}
      <div
        className="rounded-full flex items-center justify-center font-sans font-bold text-dark text-xs flex-shrink-0"
        style={{
          width: AVATAR_SIZE + 2,
          height: AVATAR_SIZE + 2,
          background: GOLD,
          border: "2px solid rgba(201, 168, 76, 0.8)",
          marginLeft: 4,
          boxShadow: `0 0 12px ${GOLD}60`,
        }}
      >
        500+
      </div>
    </div>
  );
}

export function MemberAvatars() {
  return (
    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
      <p className="font-sans text-sm text-white/90 mr-0 sm:mr-2">
        500+ members already in the Chamber
      </p>
      <MemberAvatarsRow />
    </div>
  );
}
