type Props = {
  src: string;
  alt: string;
  caption?: string;
  ratio?: "photo" | "wide" | "tall";
  focus?: string;
};

export function Viewfinder({ src, alt, caption, ratio = "photo", focus }: Props) {
  return (
    <figure className={`plate plate-${ratio}`}>
      <div className="viewfinder corners">
        <span />
        <img
          src={src}
          alt={alt}
          style={focus ? { objectPosition: focus } : undefined}
        />
      </div>
      {caption ? <figcaption className="exif mono">{caption}</figcaption> : null}
    </figure>
  );
}
