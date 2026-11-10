import { ImageZoom } from "./ImageZoom";

type CaseImageProps = {
  src?: string;
  alt: string;
  type: string;
  label: string;
  hint?: string;
  className?: string;
  /** Filename stem in public/images/alerting/. */
  assetKey?: string;
  width?: number;
  height?: number;
};

/** Dashed slot until `src` is set, then the real image. */
export function CaseImage({ src, alt, type, label, hint, className, assetKey, width, height }: CaseImageProps) {
  const classes = ["case-image", src ? "is-filled" : "", className].filter(Boolean).join(" ");

  if (src) {
    return (
      <figure className={classes} data-asset={assetKey}>
        <ImageZoom src={src} alt={alt}>
          <img src={src} alt="" width={width} height={height} loading="lazy" decoding="async" />
        </ImageZoom>
      </figure>
    );
  }

  return (
    <div
      className={classes}
      data-asset={assetKey}
      role="img"
      aria-label={[type, label, hint].filter(Boolean).join(". ")}
    >
      <span className="case-image-type">{type}</span>
      <strong>{label}</strong>
      {hint ? <span className="case-image-hint">{hint}</span> : null}
    </div>
  );
}
