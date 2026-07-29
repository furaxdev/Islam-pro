import Image from 'next/image';

export default function PhoneFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="phone">
      <div className="phone-screen">
        {/* The captures have no real iOS status bar, so reserve a blank strip
            for the Dynamic Island instead of letting it sit on top of the
            app's own header text. */}
        <div className="phone-statusbar" />
        <div className="phone-island" />
        <div className="phone-shot">
          <Image src={src} alt={alt} fill sizes="232px" />
        </div>
      </div>
    </div>
  );
}
