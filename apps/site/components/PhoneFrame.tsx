import Image from 'next/image';

export default function PhoneFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="phone">
      <div className="phone-screen">
        <div className="phone-island" />
        <Image src={src} alt={alt} fill sizes="232px" />
      </div>
    </div>
  );
}
