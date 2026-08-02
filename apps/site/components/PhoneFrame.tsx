import Image from 'next/image';

export default function PhoneFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="phone">
      <div className="phone-screen">
        {/* The captures have no real iOS status bar, so reserve a blank strip
            for the Dynamic Island instead of letting it sit on top of the
            app's own header text - and draw a real one (time, signal, wifi,
            battery) so the mockup reads as an actual iPhone. */}
        <div className="phone-statusbar">
          <span className="phone-time">9:41</span>
          <svg className="phone-status-icons" viewBox="0 0 78 16" fill="none" aria-hidden="true">
            {/* signal */}
            <rect x="0" y="9" width="3" height="7" rx="0.8" fill="currentColor" />
            <rect x="5" y="7" width="3" height="9" rx="0.8" fill="currentColor" />
            <rect x="10" y="4" width="3" height="12" rx="0.8" fill="currentColor" />
            <rect x="15" y="1" width="3" height="15" rx="0.8" fill="currentColor" />
            {/* wifi */}
            <path
              d="M30 6.8c3.4-3.3 8.7-3.3 12 0M32.3 9.3c2-1.9 5.2-1.9 7.2 0M34.7 11.7a2 2 0 0 1 3 0"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            {/* battery */}
            <rect x="52" y="2.5" width="22" height="11" rx="2.8" stroke="currentColor" strokeWidth="1.2" />
            <rect x="54" y="4.3" width="16" height="7.4" rx="1.3" fill="currentColor" />
            <rect x="75.5" y="5.5" width="1.8" height="5" rx="0.9" fill="currentColor" />
          </svg>
        </div>
        <div className="phone-island">
          <span className="phone-camera" />
        </div>
        <div className="phone-shot">
          <Image src={src} alt={alt} fill sizes="232px" />
        </div>
      </div>
    </div>
  );
}
