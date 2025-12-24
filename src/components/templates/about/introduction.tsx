import { memo } from 'react'
import { Home, Search, Zap, Lightbulb, BarChart, ShieldCheck, Globe, Quote } from 'lucide-react'
import { Link } from 'react-router-dom'

// Image Imports
import banner1 from '@/assets/images/banner/1.png'
import icon10 from '@/assets/images/icons/10.png'
import icon11 from '@/assets/images/icons/11.png'
import icon12 from '@/assets/images/icons/12.png'

const focusAreas = [
  {
    image: icon12,
    title: 'Financial Data Science',
    titleKo: '금융 데이터 사이언스',
    desc: '금융 시장의 복잡한 데이터를 수집하고 분석하여 가치 있는 패턴을 발견합니다.'
  },
  {
    image: icon11,
    title: 'Business Analytics',
    titleKo: '비즈니스 애널리틱스',
    desc: '데이터 기반의 통계적 방법론을 통해 최적의 비즈니스 전략을 제안합니다.'
  },
  {
    image: icon10,
    title: 'Data-Inspired Decisions',
    titleKo: '데이터 기반 의사결정',
    desc: '객관적인 데이터 지능을 활용하여 더 명확하고 합리적인 의사결정을 돕습니다.'
  },
]

const pillars = [
  {
    icon: Search,
    label: 'Research',
    number: '01',
    title: 'We pursue research with\nan iridescent perspective.',
    description: '금융 데이터 사이언스와 비즈니스 애널리틱스 분야의 체계적이고 다각적인 방법론을 통해 새로운 지식을 확장합니다. 실무적 연관성과 데이터 기반 의사결정을 보장하는 투명한 프레임워크를 구축합니다.',
  },
  {
    icon: Zap,
    label: 'Impact',
    number: '02',
    title: 'We transform theory into\nintuitive solutions.',
    description: '복잡한 이론을 직관적인 솔루션으로 전환합니다. 정교한 분석과 실제 비즈니스 현장 사이의 간극을 메워, 금융 시장과 기업 운영의 불확실성을 해결하는 데 기여합니다.',
  },
  {
    icon: Lightbulb,
    label: 'Philosophy',
    number: '03',
    title: 'We strive toward\n"des avenirs lucides".',
    description: '데이터 사이언스를 통해 복잡함 속에서 명확함과 통찰을 이끌어냅니다. 투명하고 혁신적인 분석으로 금융과 비즈니스, 사회 전반에 긍정적인 변화를 만드는 미래를 지향합니다.',
  },
]

const identityKeywords = [
  { icon: BarChart, text: 'Data Intelligence' },
  { icon: ShieldCheck, text: 'Transparency' },
  { icon: Globe, text: 'Social Impact' },
]

export const AboutIntroductionTemplate = () => {
  return (
    <div className="flex flex-col">
      {/* Banner */}
      <div className="relative w-full h-332 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${banner1})` }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full flex items-center justify-center">
          <h1 className="text-[36px] font-semibold text-white text-center">
            Introduction
          </h1>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-1480 mx-auto w-full px-20 py-40">
        <div className="flex items-center gap-10">
          <Link to="/" className="text-gray-400 hover:text-primary transition-colors">
            <Home size={16} />
          </Link>
          <span className="text-[#cdcdcd]">›</span>
          <span className="text-base text-gray-400">About FINDS</span>
          <span className="text-[#cdcdcd]">›</span>
          <span className="text-base text-primary font-medium">Introduction</span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-1480 mx-auto w-full px-20 pb-120">

        {/* Introduction Section */}
        <section className="mb-120">
          <div className="flex items-center gap-12 mb-40">
            <span className="w-4 h-24 bg-primary rounded-full" />
            <h2 className="text-[28px] font-bold text-gray-900">Lab Introduction</h2>
          </div>

          <div className="flex gap-40 items-stretch">
            <div className="flex-1 bg-gray-50 rounded-3xl p-50 border border-gray-100 relative">
              <Quote size={40} className="text-primary/10 absolute top-30 right-40" />
              <p className="text-2xl text-gray-900 leading-[1.6] mb-30 font-bold">
                Towards Data-Illuminated<br />
                Financial Innovation
              </p>
              <div className="space-y-24">
                <p className="text-md text-gray-600 leading-[1.9]">
                  동덕여자대학교 경영융합학부 금융데이터인텔리전스 연구실(FINDS Lab.)은 데이터 중심으로 급변하는 비즈니스와 금융 환경 속에서 실질적인 가치를 창출하는 혁신적인 연구를 수행합니다.
                </p>
                <p className="text-md text-gray-600 leading-[1.9]">
                  저희는 <strong className="text-gray-900 font-bold underline decoration-primary/30 decoration-4 underline-offset-4">금융데이터사이언스</strong>와 <strong className="text-gray-900 font-bold underline decoration-primary/30 decoration-4 underline-offset-4">비즈니스 애널리틱스</strong>를 융합하여, 복잡한 데이터 속에서 새로운 <span className="text-primary font-bold">발견(finds)</span>을 이끌어내고 데이터 기반의 정교한 의사결정을 돕는 인텔리전스를 구축하는 것을 목표로 합니다.
                </p>
              </div>
            </div>
            {/*<div className="w-380 bg-primary/5 rounded-3xl p-40 border border-primary/10 flex flex-col justify-center">*/}
            {/*  <div className="size-50 bg-white rounded-2xl flex items-center justify-center mb-20 shadow-sm">*/}
            {/*    <Info size={24} className="text-primary" />*/}
            {/*  </div>*/}
            {/*  <h4 className="text-lg font-bold text-gray-900 mb-12">Core Focus</h4>*/}
            {/*  <ul className="space-y-12">*/}
            {/*    {['Data Intelligence', 'Business Insight', 'Strategic Discovery'].map((item) => (*/}
            {/*      <li key={item} className="flex items-center gap-8 text-md text-gray-600 font-medium">*/}
            {/*        <span className="size-6 bg-primary rounded-full" />*/}
            {/*        {item}*/}
            {/*      </li>*/}
            {/*    ))}*/}
            {/*  </ul>*/}
            {/*</div>*/}
          </div>
        </section>

        {/* Focus Areas Section */}
        <section className="mb-140">
          <div className="text-center mb-60">
            <h2 className="text-[28px] font-bold text-gray-900 mb-12">Our Focus Areas</h2>
            <p className="text-base text-gray-400">FINDS Lab.이 집중적으로 탐구하고 있는 주요 연구 분야입니다.</p>
          </div>

          <div className="flex justify-center gap-40">
            {focusAreas.map((area, index) => (
              <div key={index} className="flex-1 max-w-360 bg-white border border-gray-100 rounded-3xl p-40 flex flex-col items-center group hover:border-primary/30 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
                <div className="w-160 h-160 bg-gray-50 rounded-full flex items-center justify-center mb-30 group-hover:bg-primary/5 transition-colors duration-300">
                  <img
                    src={area.image}
                    alt={area.title}
                    className="size-90 object-contain transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="text-center">
                  <span className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors block mb-8">{area.title}</span>
                  <span className="text-base text-gray-400 font-medium block mb-16">{area.titleKo}</span>
                  <p className="text-sm text-gray-500 leading-relaxed font-light">{area.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Vision Section */}
        <section className="mb-60">
          <div className="bg-gray-50 rounded-3xl p-80 flex flex-col items-center text-center relative overflow-hidden">
            <Quote size={60} className="text-primary/20 absolute top-40 left-60 rotate-180" />
            <Quote size={60} className="text-primary/20 absolute bottom-40 right-60" />

            <div className="relative z-10">
              <span className="px-16 py-6 bg-white border border-gray-100 text-primary text-xs font-bold rounded-full mb-30 inline-block uppercase tracking-widest">
                Our Vision
              </span>
              <h2 className="text-[36px] font-bold text-gray-900 mb-40 leading-[1.4]">
                We illuminate the future of<br />
                <span className="text-primary">Better Data Intelligence</span>
              </h2>
              <div className="w-40 h-2 bg-primary/30 rounded-full mx-auto mb-40" />
              <p className="text-lg text-gray-600 max-w-850 mx-auto leading-[1.9] font-medium">
                We envision a future where <span className="text-gray-900 font-bold underline decoration-primary/30 decoration-4 underline-offset-4">data intelligence</span> diminishes knowledge asymmetry,
                turning complex data streams into clear, accessible, and strategically valuable insights
                — a future built upon meaningful <span className="text-primary font-bold">finds</span> that guide decision-makers across
                finance, business, and diverse societal domains.
              </p>
            </div>
          </div>
        </section>

        {/* Pillars Section */}
        <section className="mb-100">
          <div className="grid grid-cols-3 gap-30">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon
              return (
                <div
                  key={index}
                  className="bg-white border border-gray-100 rounded-3xl p-40 group hover:border-primary/50 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-30">
                    <div className="size-50 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <Icon size={24} strokeWidth={1.5} />
                    </div>
                    <span className="text-lg font-black text-gray-100 group-hover:text-primary/10 transition-colors">
                      {pillar.number}
                    </span>
                  </div>
                  <span className="text-primary text-xs font-bold uppercase tracking-widest mb-12 block">
                    {pillar.label}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mb-20 whitespace-pre-line leading-[1.4]">
                    {pillar.title}
                  </h3>
                  <p className="text-base text-gray-500 leading-[1.8]">
                    {pillar.description}
                  </p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Identity Keyword Section */}
        <section className="pt-40 border-t border-gray-100">
          <div className="flex justify-center items-center gap-80">
            {identityKeywords.map((kw, index) => {
              const Icon = kw.icon
              return (
                <div key={index} className="flex items-center gap-12 text-gray-400 group cursor-default">
                  <Icon size={18} className="group-hover:text-primary transition-colors" />
                  <span className="text-sm font-bold tracking-widest uppercase group-hover:text-gray-900 transition-colors">
                    {kw.text}
                  </span>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}

export default memo(AboutIntroductionTemplate)
