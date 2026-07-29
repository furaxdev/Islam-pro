import PhoneFrame from './PhoneFrame';
import Reveal from './Reveal';

interface Item {
  mark: string;
  title: string;
  desc: string;
}

export default function FeatureRow({
  id,
  eyebrow,
  title,
  lede,
  items,
  phoneSrc,
  phoneAlt,
  reverse = false,
}: {
  id: string;
  eyebrow: string;
  title: string;
  lede: string;
  items: Item[];
  phoneSrc: string;
  phoneAlt: string;
  reverse?: boolean;
}) {
  return (
    <section className="section" id={id}>
      <div className="wrap">
        <div className={`feature-row${reverse ? ' feature-row--reverse' : ''}`}>
          <div className="feature-phone">
            <Reveal>
              <PhoneFrame src={phoneSrc} alt={phoneAlt} />
            </Reveal>
          </div>
          <div>
            <Reveal>
              <span className="eyebrow">{eyebrow}</span>
              <h2 className="section-heading">{title}</h2>
              <p className="section-lede">{lede}</p>
            </Reveal>
            <ul className="feature-list">
              {items.map((item, i) => (
                <Reveal as="li" key={item.title} delay={i * 80}>
                  <div className="feature-item">
                    <span className="feature-mark" aria-hidden="true">
                      {item.mark}
                    </span>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
