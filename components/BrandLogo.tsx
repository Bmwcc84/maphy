import Image from "next/image";

type BrandLogoProps = {
  size?: "sm" | "md" | "lg";
  priority?: boolean;
};

const styles = {
  sm: { mark: "h-9 w-9", text: "text-lg" },
  md: { mark: "h-10 w-10", text: "text-xl" },
  lg: { mark: "h-12 w-12", text: "text-2xl" },
};

export default function BrandLogo({ size = "md", priority = false }: BrandLogoProps) {
  const style = styles[size];

  return (
    <span className="inline-flex items-center gap-3">
      <span className={`relative shrink-0 overflow-hidden ${style.mark}`} aria-hidden="true">
        <Image
          src="/maphy-logo-mark.png"
          alt=""
          fill
          priority={priority}
          sizes={size === "lg" ? "48px" : size === "md" ? "40px" : "36px"}
          className="object-cover"
        />
      </span>
      <span className={`${style.text} font-serif font-black tracking-[0.06em] text-[#f2b84b]`}>
        MAPHY
      </span>
    </span>
  );
}
