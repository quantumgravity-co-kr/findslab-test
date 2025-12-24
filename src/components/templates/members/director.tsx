import { memo, useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Briefcase,
  BookOpen,
  Award,
  Building,
  ChevronRight,
  Home,
  FileText,
  ChevronDown,
  ChevronUp,
  Users,
  Search,
  CheckCircle2,
  Trophy,
  UserCheck,
  Globe,
  Network,
  GraduationCap as GradIcon,
} from 'lucide-react'
import type { ReviewerData } from '@/types/data'
import { useStoreModal } from '@/store/modal'

// Image Imports
import banner2 from '@/assets/images/banner/2.png'
import directorImg from '@/assets/images/members/director.jpg'
import logoKaist from '@/assets/images/logos/kaist.png'
import logoKyunghee from '@/assets/images/logos/kyunghee.png'
import logoDwu from '@/assets/images/logos/dwu.png'
import logoFinds from '@/assets/images/logos/finds.png'
import logoKangnam from '@/assets/images/logos/kangnam.png'
import logoKorea from '@/assets/images/logos/korea.png'
import logoWorldquant from '@/assets/images/logos/worldquant.jpg'
import logoEy from '@/assets/images/logos/ey.png'
import logoJl from '@/assets/images/logos/jl.png'
import logoCaptima from '@/assets/images/logos/captima.png'
import logoKfac from '@/assets/images/logos/kfac.png'
import logoMensa from '@/assets/images/logos/mensa.png'
import logoField from '@/assets/images/logos/field.png'
import logoFba from '@/assets/images/logos/fba.png'
import logoDading from '@/assets/images/logos/dading.png'

const education = [
  {
    school: 'KAIST',
    period: '2025.02',
    degree: 'Doctor of Philosophy (Ph.D.) in Engineering',
    field: 'Industrial and Systems Engineering',
    location: 'Korea Advanced Institute of Science and Technology (KAIST)',
    krName: '한국과학기술원 (KAIST) 산업및시스템공학 공학박사',
    advisor: 'Woo Chang Kim',
    leadership: [
      { role: 'Member', context: 'Graduate School Central Operations Committee', period: '2021.09 - 2025.01' },
      { role: 'Graduate Student Representative', context: 'Department of Industrial and Systems Engineering', period: '2021.09 - 2025.01' },
    ],
    awards: ['Best Doctoral Dissertation Award, Korean Operations Research and Management Science Society (KORMS, 한국경영과학회)'],
    logo: logoKaist
  },
  {
    school: 'KAIST',
    period: '2021.02',
    degree: 'Master of Science (M.S.)',
    field: 'Industrial and Systems Engineering',
    location: 'Korea Advanced Institute of Science and Technology (KAIST)',
    krName: '한국과학기술원 (KAIST) 산업및시스템공학 공학석사',
    advisor: 'Woo Chang Kim',
    awards: ["Best Master's Thesis Award, Korean Institute of Industrial Engineers (KIIE, 대한산업공학회)"],
    logo: logoKaist
  },
  {
    school: 'Kyung Hee',
    period: '2018.02',
    degree: 'Bachelor of Engineering (B.E.)',
    field: 'Industrial and Management Systems Engineering',
    location: 'Kyung Hee University',
    krName: '경희대학교 산업경영공학 공학사',
    advisor: 'Jang Ho Kim, Myoung-Ju Park',
    leadership: [
      { role: 'Head of Culture & Public Relations', context: '41st Student Council, College of Engineering', period: '2017.01 - 2017.11' },
      { role: 'President', context: '7th Student Council, Department of Industrial and Management Systems Engineering', period: '2016.01 - 2016.12' },
    ],
    awards: ['Valedictorian, 1st out of 86 students'],
    logo: logoKyunghee
  },
]

const employment = [
  { position: 'Assistant Professor', organization: "Dongduk Women's University", period: '2025.09 – Present', location: 'Division of Business Administration, College of Business', krOrg: '조교수 / 동덕여자대학교 경영대학 경영융합학부', logo: logoDwu },
  { position: 'Director', organization: 'FINDS Lab.', period: '2025.06 – Present', location: 'FINDS Lab.', krOrg: '디렉터 / FINDS Lab.', logo: logoFinds },
  { position: 'Lecturer', organization: 'Kangnam University', period: '2025.03 – 2026.02', location: 'Department of Electronic and Semiconductor Engineering', krOrg: '강사 / 강남대학교 공과대학 전자반도체공학부', logo: logoKangnam },
  { position: 'Lecturer', organization: 'Korea University', period: '2025.03 – 2026.02', location: 'Digital Business Major, Division of Convergence Business', krOrg: '강사 / 고려대학교 글로벌비즈니스대학 융합경영학부 디지털비즈니스전공', logo: logoKorea },
  { position: 'Lecturer', organization: 'Kyung Hee University', period: '2024.03 – 2024.08', location: 'Department of Industrial and Management Systems Engineering', krOrg: '강사 / 경희대학교 공과대학 산업경영공학과', logo: logoKyunghee },
  { position: 'Research Consultant', organization: 'WorldQuant Brain', period: '2022.06 – Present', location: 'WorldQuant Brain', krOrg: '연구 컨설턴트 / 월드퀀트 브레인', logo: logoWorldquant },
  { position: 'Intern', organization: 'EY Consulting', period: '2020.03 – 2020.05', location: 'Performance Improvement Department', krOrg: '인턴 / EY컨설팅 성과개선팀', logo: logoEy },
  { position: 'Founder', organization: 'JL Creatives & Contents (JL C&C)', period: '2014.06 – Recent', location: 'JL C&C', krOrg: '대표 / JL C&C', logo: logoJl },
]

const affiliations = [
  { organization: 'Korean Institute of Industrial Engineers (KIIE)', krOrg: '대한산업공학회 (KIIE) 종신회원', period: '2025.06 – Present', role: 'Lifetime Member' },
  { organization: 'Korean Securities Association (KSA)', krOrg: '한국증권학회 (KSA) 종신회원', period: '2023.09 – Present', role: 'Lifetime Member' },
  { organization: 'Korean Academic Society of Business Administration (KASBA)', krOrg: '한국경영학회 (KASBA) 종신회원', period: '2023.06 – Present', role: 'Lifetime Member' },
  { organization: 'Korea Intelligent Information Systems Society (KIISS)', krOrg: '한국지능정보시스템학회 (KIISS) 종신회원', period: '2022.06 – Present', role: 'Lifetime Member' },
]

const activities = [
  { name: 'CAPTIMA', logo: logoCaptima },
  { name: 'KFAC', logo: logoKfac },
  { name: 'MENSA Korea', logo: logoMensa },
  { name: 'FIELD', logo: logoField },
  { name: 'FBA Quant', logo: logoFba },
  { name: 'DadingCoding', logo: logoDading },
]

const researchInterests = [
  {
    category: 'Financial Data Science',
    items: [
      { en: 'AI in Quantitative Finance & Asset Management', ko: '인공지능을 활용한 포트폴리오 최적화, 자산 배분, 알고리즘 트레이딩' },
      { en: 'Financial Time-Series Modeling & Forecasting', ko: '변동성 예측, 국면 전환 모형, 선·후행 관계 분석, 수익률 예측 등 금융 시계열 모형 연구' },
      { en: 'Household Finance & Behavioral Decision Modeling', ko: '가계 금융과 투자자 행동 분석, 행동재무학 기반 의사결정 모형화' },
    ],
  },
  {
    category: 'Business Analytics',
    items: [
      { en: 'Data Analytics for Cross-Industry & Cross-Domain Convergences', ko: '다양한 산업과 분야 간의 결합과 융합을 위한 데이터 분석' },
      { en: 'Data Visualization & Transparency in Business Analytics', ko: '복잡한 데이터를 직관적으로 표현하고 투명성을 높이는 시각화 기법' },
      { en: 'Business Insights from Data Science Techniques', ko: '시계열 모형, 그래프 기반 모형, 자연어 처리(NLP) 등 데이터 사이언스 기법을 활용한 비즈니스 인사이트 발굴' },
    ],
  },
  {
    category: 'Data-Inspired Decision Making',
    items: [
      { en: 'Trustworthy Decision Systems & Optimization', ko: '신뢰할 수 있는 의사결정 시스템 설계와 최적화 기법' },
      { en: 'Risk-Aware & User-Friendly Decision Tools', ko: '금융·경영 위험을 반영하고 사용자 친화성을 갖춘 의사결정 도구' },
      { en: 'Decision Analytics for Complex Business Problems', ko: '복잡한 경영 및 투자 의사결정 문제 해결을 위한 분석 및 최적화 방법론' },
    ],
  },
]

export const MembersDirectorTemplate = () => {
  const [reviewerData, setReviewerData] = useState<ReviewerData | null>(null)
  const [showAllJournals, setShowAllJournals] = useState(false)
  const [loading, setLoading] = useState(true)
  const { showModal } = useStoreModal()

  useEffect(() => {
    fetch('/data/reviewer.json')
      .then((res) => res.json())
      .then((data: ReviewerData) => {
        setReviewerData(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load reviewer data:', err)
        setLoading(false)
      })
  }, [])

  const publicationStats = useMemo(() => {
    return [
      { label: 'SCIE', count: 0 },
      { label: 'SSCI', count: 0 },
      { label: 'A&HCI', count: 0 },
      { label: 'ESCI', count: 0 },
      { label: 'Scopus', count: 0 },
      { label: 'Other Int\'l', count: 0 },
      { label: 'Int\'l Conf', count: 0 },
      { label: 'KCI', count: 0 },
      { label: 'Dom. Conf', count: 0 },
    ]
  }, [])

  const citationStats = [
    { label: 'Citations', count: 127 },
    { label: 'g-index', count: 10 },
    { label: 'h-index', count: 7 },
    { label: 'i10-index', count: 5 },
  ]

  const displayedJournals = useMemo(() => {
    if (!reviewerData) return []
    return showAllJournals ? reviewerData.journals : reviewerData.journals.slice(0, 10)
  }, [reviewerData, showAllJournals])

  return (
    <div className="flex flex-col bg-white">
      {/* Banner */}
      <div className="relative w-full h-332 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${banner2})` }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full flex items-center justify-center">
          <h1 className="text-[36px] font-semibold text-white text-center">
            Director
          </h1>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-1480 mx-auto w-full px-20 py-40 border-b border-gray-100">
        <div className="flex items-center gap-10">
          <Link to="/" className="text-gray-400 hover:text-primary transition-colors">
            <Home size={16} />
          </Link>
          <span className="text-[#cdcdcd]">›</span>
          <span className="text-base text-gray-400">Members</span>
          <span className="text-[#cdcdcd]">›</span>
          <span className="text-base text-primary font-medium">Director</span>
        </div>
      </div>

      {/* Content */}
      <section className="max-w-1480 mx-auto w-full px-20 pb-[100px] pt-60">
        <div className="flex flex-col lg:flex-row gap-60">
          {/* Left Column: Profile Card & Quick Info */}
          <aside className="lg:w-380 flex flex-col gap-40">
            {/* Profile Card */}
            <div className="bg-white border border-gray-100 rounded-3xl p-32 shadow-sm sticky top-40">
              <div className="flex flex-col items-center text-center mb-32">
                <div className="size-200 bg-gray-100 rounded-2xl overflow-hidden mb-24 shadow-inner border border-gray-50">
                  <img
                    src={directorImg}
                    alt="Prof. Insu Choi"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-64">👨‍🏫</div>'
                    }}
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Insu Choi, Ph.D.</h2>
                <p className="text-lg text-gray-500 font-medium">최인수</p>
                <div className="mt-16 flex items-center gap-8 px-16 py-8 bg-primary/5 text-primary text-sm font-semibold rounded-full border border-primary/10">
                  <UserCheck size={14} />
                  Director of FINDS Lab.
                </div>
              </div>

              <div className="flex flex-col gap-20">
                <div className="flex items-start gap-12 group">
                  <div className="size-36 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <Briefcase size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Position</p>
                    <p className="text-sm font-semibold text-gray-800 leading-tight">Director</p>
                    <p className="text-xs text-gray-500">FINDS Lab.</p>
                  </div>
                </div>

                <div className="flex items-start gap-12 group">
                  <div className="size-36 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <Building size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Affiliation</p>
                    <p className="text-sm font-semibold text-gray-800 leading-tight">Assistant Professor</p>
                    <p className="text-xs text-gray-500">Division of Business Administration, DWU</p>
                  </div>
                </div>

                <div className="flex items-start gap-12 group">
                  <div className="size-36 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Office</p>
                    <p className="text-sm font-semibold text-gray-800 leading-tight">Room 706, Humanities Hall</p>
                    <p className="text-xs text-gray-500">인문관 706호</p>
                  </div>
                </div>

                <div className="flex items-start gap-12 group">
                  <div className="size-36 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">E-mail</p>
                    <a href="mailto:ischoi@dongduk.ac.kr" className="text-sm font-semibold text-primary hover:underline truncate block w-240">
                      ischoi@dongduk.ac.kr
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-12 group">
                  <div className="size-36 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Phone</p>
                    <p className="text-sm font-semibold text-gray-800 leading-tight">02-940-4424</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-12 mt-40">
                <button
                  onClick={() => showModal({
                    title: 'Curriculum Vitae',
                    maxWidth: '1000px',
                    children: <div className="p-40 text-center text-gray-500">CV content goes here...</div>
                  })}
                  className="flex items-center justify-center gap-8 py-14 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
                >
                  View CV
                  <ExternalLink size={14} />
                </button>
                <a
                  href="https://scholar.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-8 py-14 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-all"
                >
                  Scholar
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>

            {/* Activities Widget */}
            <div className="bg-white border border-gray-100 rounded-3xl p-32 shadow-sm">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-24 border-b border-gray-50 pb-12 flex items-center justify-between">
                Activities
                <Trophy size={16} className="text-yellow-500" />
              </h4>
              <div className="grid grid-cols-3 gap-16">
                {activities.map((act) => (
                  <div key={act.name} className="flex flex-col items-center gap-8 group">
                    <div className="size-64 bg-gray-50 rounded-2xl flex items-center justify-center p-12 group-hover:bg-white group-hover:shadow-md transition-all border border-transparent group-hover:border-gray-100">
                      <img src={act.logo} alt={act.name} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 text-center uppercase tracking-tighter">{act.name}</span>
                  </div>
                ))}
          </div>
        </div>
          </aside>

          {/* Right Column: Detailed Sections */}
          <main className="flex-1 flex flex-col gap-80">
        {/* Introduction */}
            <section>
              <div className="flex items-center gap-16 mb-24">
                <div className="size-48 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <FileText size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Introduction</h3>
              </div>
              <div className="bg-gray-50/50 rounded-3xl p-40 border border-gray-100/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-24 opacity-5">
                  <FileText size={120} />
                </div>
                <p className="text-lg text-gray-600 leading-relaxed relative z-10">
              I am an Assistant Professor at Dongduk Women's University and the Director of FINDS Lab, working across{' '}
                  <span className="text-gray-900 font-bold border-b-2 border-primary/20">Financial Data Science</span>,{' '}
                  <span className="text-gray-900 font-bold border-b-2 border-primary/20">Business Analytics</span>, and{' '}
                  <span className="text-gray-900 font-bold border-b-2 border-primary/20">Data-Driven Decision Making</span>. My research brings together modern
              data science and financial engineering to tackle practical questions in finance and broader business
              domains.
            </p>
                <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-24">
                  {[
                    { num: '1', text: 'AI-driven solutions for quantitative finance' },
                    { num: '2', text: 'Advanced analytics across business domains' },
                    { num: '3', text: 'Intelligent decision support systems' },
                  ].map((point) => (
                    <div key={point.num} className="flex gap-16 bg-white p-20 rounded-2xl shadow-sm border border-gray-100">
                      <span className="size-32 bg-primary text-white text-sm font-bold rounded-lg flex items-center justify-center shrink-0">{point.num}</span>
                      <p className="text-sm font-semibold text-gray-700 leading-tight">{point.text}</p>
                    </div>
                  ))}
                </div>
          </div>
        </section>

        {/* Research Interests */}
            <section>
              <div className="flex items-center gap-16 mb-32">
                <div className="size-48 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <Search size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Research Interests</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
                {researchInterests.map((area, index) => (
                  <div key={index} className="flex flex-col bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="bg-gray-900 p-20">
                      <h4 className="text-md font-bold text-white tracking-wide">{area.category}</h4>
                    </div>
                    <div className="p-24 flex flex-col gap-16">
                      {area.items.map((item, idx) => (
                        <div key={idx} className="flex flex-col gap-4">
                          <div className="flex items-start gap-8">
                            <CheckCircle2 size={14} className="text-primary mt-2 shrink-0" />
                            <span className="text-sm font-bold text-gray-800 leading-tight">{item.en}</span>
                          </div>
                          <span className="text-xs text-gray-400 pl-22 font-medium">{item.ko}</span>
                        </div>
                      ))}
                    </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
            <section>
              <div className="flex items-center gap-16 mb-32">
                <div className="size-48 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <GradIcon size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Education</h3>
              </div>
              <div className="flex flex-col gap-24">
            {education.map((edu, index) => (
                  <div key={index} className="group flex flex-col md:flex-row gap-32 bg-white border border-gray-100 rounded-3xl p-32 shadow-sm hover:border-primary/20 transition-all relative overflow-hidden">
                    <div className="size-80 bg-gray-50 rounded-2xl p-12 flex items-center justify-center shrink-0 group-hover:bg-white transition-colors border border-transparent group-hover:border-gray-100">
                      <img src={edu.logo} alt={edu.school} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 flex flex-col gap-16">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div>
                          <h4 className="text-xl font-bold text-gray-900">{edu.school}</h4>
                          <p className="text-sm font-semibold text-primary">{edu.degree}</p>
                        </div>
                        <span className="px-12 py-4 bg-gray-50 text-gray-400 text-xs font-bold rounded-full border border-gray-100">{edu.period}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        <div className="space-y-4">
                          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Major & Affiliation</p>
                          <p className="text-sm font-medium text-gray-600 leading-tight">{edu.field}</p>
                          <p className="text-[11px] text-gray-400">{edu.location}</p>
                          <p className="text-xs font-medium text-gray-500">{edu.krName}</p>
                        </div>
                        <div className="space-y-4">
                          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Advisor & Details</p>
                          <div className="flex items-center gap-6">
                            <span className="text-xs font-bold text-gray-800">Advisor:</span>
                            <span className="text-xs font-medium text-gray-600">{edu.advisor}</span>
                          </div>
                          {edu.leadership && (
                            <button
                              onClick={() => showModal({
                                title: 'Leadership Roles',
                                maxWidth: '600px',
                                children: (
                                  <div className="p-32 flex flex-col gap-16">
                                    {edu.leadership?.map((role, rIdx) => (
                                      <div key={rIdx} className="flex justify-between items-start gap-16 border-b border-gray-50 pb-16 last:border-0">
                  <div>
                                          <p className="text-sm font-bold text-gray-900">{role.role}</p>
                                          <p className="text-xs text-gray-500">{role.context}</p>
                                        </div>
                                        <span className="text-xs font-bold text-primary shrink-0">{role.period}</span>
                                      </div>
                                    ))}
                                  </div>
                                )
                              })}
                              className="flex items-center gap-4 text-xs font-bold text-gray-400 hover:text-primary transition-colors"
                            >
                              Leadership Roles <ChevronRight size={12} />
                            </button>
                          )}
                        </div>
                      </div>

                      {edu.awards.length > 0 && (
                        <div className="flex flex-wrap gap-8 pt-8 border-t border-gray-50">
                          {edu.awards.map((award, idx) => (
                            <div key={idx} className="flex items-center gap-6 px-12 py-6 bg-yellow-50 text-yellow-700 text-xs font-bold rounded-lg border border-yellow-100">
                              <Award size={12} />
                              {award}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Employment */}
            <section>
              <div className="flex items-center gap-16 mb-32">
                <div className="size-48 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <Briefcase size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Employment</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {employment.map((job, index) => (
                  <div key={index} className="flex items-center gap-20 bg-white border border-gray-100 rounded-2xl p-20 shadow-sm hover:border-primary/20 transition-all">
                    <div className="size-56 bg-gray-50 rounded-xl p-8 flex items-center justify-center shrink-0 border border-gray-100/50">
                      <img src={job.logo} alt={job.organization} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-8 mb-4">
                        <h4 className="text-sm font-bold text-gray-900 truncate">{job.organization}</h4>
                        <span className="text-[10px] font-bold text-primary shrink-0">{job.period}</span>
                      </div>
                      <p className="text-xs font-bold text-gray-500 mb-2">{job.position}</p>
                      <p className="text-[10px] text-gray-400 truncate">{job.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Professional Affiliations */}
            <section>
              <div className="flex items-center gap-16 mb-32">
                <div className="size-48 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <Globe size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Professional Affiliations</h3>
              </div>
              <div className="flex flex-col gap-12">
                {affiliations.map((aff, index) => (
                  <div key={index} className="flex items-center justify-between gap-24 bg-gray-50/50 border border-gray-100 rounded-2xl p-20 px-32 hover:bg-white hover:shadow-sm transition-all">
                    <div className="flex flex-col gap-2">
                      <h4 className="text-sm font-bold text-gray-900">{aff.organization}</h4>
                      <p className="text-xs text-gray-400 font-medium">{aff.krOrg}</p>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                      <span className="text-xs font-bold text-primary">{aff.role}</span>
                      <span className="text-[10px] text-gray-400 font-bold">{aff.period}</span>
                    </div>
              </div>
            ))}
          </div>
        </section>

            {/* Publication Statistics */}
            <section>
              <div className="flex items-center gap-16 mb-32">
                <div className="size-48 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <BookOpen size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Publication Statistics</h3>
              </div>
              <div className="flex flex-col gap-32">
                <div className="grid grid-cols-3 md:grid-cols-9 gap-12">
                  {publicationStats.map((stat, index) => (
                    <div key={index} className="bg-white border border-gray-100 rounded-xl p-12 text-center shadow-sm hover:border-primary/20 transition-all">
                      <div className="text-xl font-bold text-primary mb-2">{stat.count}</div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter leading-tight h-24 flex items-center justify-center">{stat.label}</div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-20">
                  {citationStats.map((stat, index) => (
                    <div key={index} className="bg-gray-900 rounded-2xl p-24 text-center shadow-lg relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                        <Trophy size={48} className="text-white" />
                      </div>
                      <div className="text-3xl font-bold text-primary mb-4 relative z-10">{stat.count}</div>
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest relative z-10">{stat.label}</div>
              </div>
            ))}
                </div>
          </div>
        </section>

            {/* Reviewer Activities */}
            <section>
              <div className="flex items-center gap-16 mb-32">
                <div className="size-48 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <UserCheck size={24} />
                </div>
                <div className="flex items-center justify-between flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">Reviewer Experience</h3>
                  <div className="flex gap-12">
                    <button className="text-xs font-bold text-primary flex items-center gap-4 transition-colors">
                      Journal Reviewer <ChevronRight size={14} />
                    </button>
                    <button className="text-xs font-bold text-gray-400 hover:text-primary flex items-center gap-4 transition-colors">
                      Conference Reviewer <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="bg-gray-50 rounded-3xl p-60 text-center border border-gray-100">
                  <p className="text-md text-gray-500 animate-pulse">Loading reviewer data...</p>
                </div>
              ) : reviewerData ? (
                <div className="flex flex-col gap-32">
                  <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                    <div className="bg-gray-50/50 px-32 py-20 flex items-center justify-between border-b border-gray-100">
                      <div className="flex items-center gap-12">
                        <Building size={18} className="text-primary" />
                        <h4 className="text-md font-bold text-gray-900">Reviewed Journals</h4>
                      </div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total {reviewerData.journals.length}</span>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {displayedJournals.map((journal) => (
                        <div key={journal.id} className="group px-32 py-20 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                          <div className="flex-1 min-w-0 pr-24">
                            <a href={journal.url} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-gray-800 hover:text-primary transition-colors block truncate mb-2">
                              {journal.name}
                            </a>
                            <p className="text-xs text-gray-400 font-medium truncate">{journal.publisher}</p>
                          </div>
                          <div className="flex items-center gap-16 shrink-0">
                            <span className={`px-10 py-4 rounded-lg text-[10px] font-bold border ${
                              journal.type === 'SCIE' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                              journal.type === 'SSCI' ? 'bg-green-50 text-green-600 border-green-100' :
                              journal.type === 'SCOPUS' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                              'bg-gray-50 text-gray-600 border-gray-200'
                            }`}>
                              {journal.type}
                            </span>
                            <span className="text-xs font-bold text-gray-300">Since {journal.since}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {reviewerData.journals.length > 10 && (
                      <button
                        onClick={() => setShowAllJournals(!showAllJournals)}
                        className="w-full py-16 bg-gray-50 text-xs font-bold text-gray-500 hover:bg-gray-100 hover:text-primary transition-all border-t border-gray-100 flex items-center justify-center gap-8"
                      >
                        {showAllJournals ? (
                          <>Show Less <ChevronUp size={14} /></>
                        ) : (
                          <>Show All {reviewerData.journals.length} Journals <ChevronDown size={14} /></>
                        )}
                      </button>
                    )}
                  </div>

                  <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                    <div className="bg-gray-50/50 px-32 py-20 flex items-center justify-between border-b border-gray-100">
                      <div className="flex items-center gap-12">
                        <Users size={18} className="text-primary" />
                        <h4 className="text-md font-bold text-gray-900">Conference Reviewer / PC Member</h4>
                      </div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total {reviewerData.conferences.length}</span>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {reviewerData.conferences.map((conf) => (
                        <div key={conf.id} className="group px-32 py-20 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                          <div className="flex-1 min-w-0 pr-24">
                            <a href={conf.url} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-gray-800 hover:text-primary transition-colors block truncate mb-2">
                              {conf.name}
                            </a>
                            <p className="text-xs text-gray-400 font-medium truncate">{conf.publisher}</p>
                          </div>
                          <div className="flex items-center gap-16 shrink-0">
                            <span className="text-xs font-bold text-gray-300">{conf.period}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </section>

            {/* Collaboration Network */}
            <section>
              <div className="flex items-center gap-16 mb-32">
                <div className="size-48 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <Network size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Collaboration Network</h3>
              </div>
              <div className="bg-gray-50 rounded-3xl p-60 text-center border border-gray-100 border-dashed relative overflow-hidden">
                <div className="absolute inset-0 bg-white/20 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                  <div className="size-64 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-16 animate-bounce">
                    <Search size={32} />
                  </div>
                  <p className="text-lg font-bold text-gray-900 mb-8">Network Visualization</p>
                  <p className="text-sm text-gray-500 max-w-300">Loading collaboration data and preparing the interactive network graph...</p>
                </div>
                {/* Placeholder for actual graph */}
                <div className="opacity-20 select-none pointer-events-none">
                  <div className="flex justify-center gap-40 mb-40">
                    <div className="size-48 rounded-full bg-gray-300" />
                    <div className="size-48 rounded-full bg-gray-300" />
                  </div>
                  <div className="flex justify-center gap-80">
                    <div className="size-64 rounded-full bg-primary" />
                  </div>
                </div>
              </div>
            </section>

            {/* Mentoring Program */}
            <section>
              <div className="flex items-center justify-between mb-32">
                <div className="flex items-center gap-16">
                  <div className="size-48 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <Users size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Mentoring Program</h3>
                </div>
                <button
                  onClick={() => showModal({
                    title: 'Full Mentoring List',
                    maxWidth: '800px',
                    children: <div className="p-40 text-center text-gray-500">Mentee list content goes here...</div>
                  })}
                  className="text-xs font-bold text-gray-400 hover:text-primary flex items-center gap-4 transition-colors"
                >
                  View All Mentees <ChevronRight size={14} />
                </button>
              </div>
              <div className="bg-white border border-gray-100 rounded-3xl p-40 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="size-80 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-20">
                  <Users size={40} />
                </div>
                <p className="text-lg font-bold text-gray-900 mb-8">Shape the Future with Us</p>
                <p className="text-sm text-gray-500 max-w-400 mb-24 leading-relaxed">
                  FINDS Lab offers a mentorship program for students interested in Financial Data Science and Business Analytics.
                </p>
                <button className="px-24 py-12 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-black transition-colors shadow-lg">
                  Learn About Mentoring
                </button>
              </div>
            </section>
          </main>
        </div>
      </section>
    </div>
  )
}

export default memo(MembersDirectorTemplate)
