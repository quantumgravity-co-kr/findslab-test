import { memo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import Slider from '@/components/atoms/slider'

// Image Imports
import icon1 from '@/assets/images/icons/1.png'
import icon2 from '@/assets/images/icons/2.png'
import icon3 from '@/assets/images/icons/3.png'
import icon4 from '@/assets/images/icons/4.png'
import icon7 from '@/assets/images/icons/7.png'
import icon8 from '@/assets/images/icons/8.png'
import icon9 from '@/assets/images/icons/9.png'
import hero1 from '@/assets/images/hero/1.png'
import hero2 from '@/assets/images/hero/2.png'
import hero3 from '@/assets/images/hero/3.png'
import hero4 from '@/assets/images/hero/4.png'
import logoFinds from '@/assets/images/brand/logo-finds.png'

// Markdown Front Matter 파서
const parseMarkdown = (text: string) => {
  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = text.match(frontMatterRegex);
  if (!match) return { data: {} as any, content: text };

  const yaml = match[1];
  const content = match[2];
  const data: any = {};

  yaml.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > -1) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      data[key] = value;
    }
  });

  return { data, content };
};

// 서비스 항목 데이터
const serviceItems = [
  { name: 'About FINDS', path: '/about/introduction', image: icon2 },
  { name: 'Members', path: '/members/director', image: icon3 },
  { name: 'Publications', path: '/publications', image: icon4 },
  { name: 'Archives', path: '/archives/news', image: icon7 },
]

// 슬라이드 데이터
const heroSlides = [
  {
    id: 1,
    badge: 'FINDS Lab',
    title: 'Towards Data-Illuminated\nFinancial Innovation',
    image: hero1,
    buttons: [
      { label: 'Introduction', path: '/about/introduction' },
      { label: 'Honors & Awards', path: '/about/honors' },
    ],
  },
  {
    id: 2,
    badge: 'FINDS Lab',
    title: 'Accomplishments',
    subtitle: "Introducing FINDS Lab's\ncultural information",
    image: hero2,
    buttons: [
      { label: 'Publications', path: '/publications' },
    ],
  },
  {
    id: 3,
    badge: 'FINDS Lab',
    title: 'Updates',
    subtitle: 'Check out important announcements and\nnews from FINDS Lab',
    image: hero3,
    buttons: [
      { label: 'News', path: '/archives/news' },
    ],
  },
]

export const HomeTemplate = () => {
  const [newsItems, setNewsItems] = useState<{ title: string; date: string }[]>([])
  const [noticeItems, setNoticeItems] = useState<{ title: string; date: string }[]>([])

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        // 최근 뉴스 2개 로드
        const newsFiles = ['2025-09-01-1.md', '2025-06-14-1.md']
        const newsResults = await Promise.all(
          newsFiles.map(async (file) => {
            const response = await fetch(`/data/news/${file}`)
            const text = await response.text()
            const { data } = parseMarkdown(text)
            return { title: data.title, date: data.date }
          })
        )
        setNewsItems(newsResults)

        // 최근 공지 2개 로드
        const noticeFiles = ['2025-10-06-1.md', '2025-09-01-1.md']
        const noticeResults = await Promise.all(
          noticeFiles.map(async (file) => {
            const response = await fetch(`/data/notice/${file}`)
            const text = await response.text()
            const { data } = parseMarkdown(text)
            return { title: data.title, date: data.date }
          })
        )
        setNoticeItems(noticeResults)
      } catch (err) {
        console.error('Failed to load home data:', err)
      }
    }

    fetchLatest()
  }, [])

  return (
    <div className="flex flex-col bg-white">
      {/* Hero Section */}
      <section className="relative px-20 py-40">
        <div className="max-w-1480 mx-auto">
          <Slider loop autoplay autoplayDelay={5000} arrows dots>
            {heroSlides.map((slide) => (
              <div key={slide.id} className="relative bg-gray-50 h-full rounded-3xl px-100 py-48 flex items-center justify-between">
                <div className="flex flex-col flex-1 gap-24 z-10">
                  <div className="inline-flex items-center px-16 py-12 border border-primary rounded-full bg-white/10 w-fit">
                    <span className="text-md font-semibold text-primary">{slide.badge}</span>
                  </div>
                  <h1 className="text-[36px] font-bold text-gray-900 whitespace-pre-line">
                    {slide.title}
                  </h1>
                  {slide.subtitle && (
                    <p className="text-lg text-gray-600 whitespace-pre-line">{slide.subtitle}</p>
                  )}
                  <div className="flex gap-10">
                    {slide.buttons.map((button, btnIndex) => (
                      <Link
                        key={btnIndex}
                        to={button.path}
                        className="px-20 py-16 bg-primary text-white! text-md font-medium rounded-xl hover:bg-primary/90 transition-colors"
                      >
                        {button.label}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="flex-1 max-w-650 absolute right-0 top-0">
                  <img src={slide.image} alt="Hero Illustration" className="w-full h-full object-contain rounded-r-3xl" />
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* Service Introduction Section */}
      <section className="py-64 px-20">
        <div className="max-w-1480 mx-auto">
          <div className="flex items-center justify-center gap-8 mb-40">
            <img src={icon1} alt="" className="size-28" />
            <h2 className="text-[26px] font-semibold text-gray-900">Service introduction</h2>
          </div>
          <div className="flex justify-center gap-60">
            {serviceItems.map((item, index) => (
              <Link key={index} to={item.path} className="flex flex-col items-center gap-12 group">
                <div className="w-100 h-100 bg-gray-50 rounded-3xl flex items-center justify-center overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="size-68 object-contain group-hover:scale-110 transition-transform"
                  />
                </div>
                <span className="text-base text-gray-500 text-center">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Banner Section */}
      <section className="relative h-414 overflow-hidden">
        <img src={hero4} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative h-full flex flex-col items-center justify-center text-center text-white">
          <img src={logoFinds} alt="FINDS Lab" className="w-112 h-auto mb-24 brightness-0 invert" />
          <h2 className="text-2xl font-semibold text-primary mb-8">FINDS Lab</h2>
          <p className="text-xl font-medium mb-16">Financial Data Intelligence & Solutions Laboratory</p>
          <p className="text-xl font-medium max-w-400">
            동덕여자대학교 경영대학 경영융합학부
            <br />
            금융데이터인텔리전스 연구실 홈페이지입니다.
          </p>
        </div>
      </section>

      {/* News & Notice Section */}
      <section className="bg-gray-50 py-80 px-20">
        <div className="max-w-1480 mx-auto">
          <div className="flex gap-60">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-24">
                <div className="flex items-center gap-8">
                  <img src={icon8} alt="" className="size-26" />
                  <h3 className="text-[26px] font-semibold text-gray-900">News</h3>
                </div>
                <Link
                  to="/archives/news"
                  className="flex items-center gap-8 px-16 py-12 bg-white border border-gray-100 rounded-full text-base font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  자세히 보기
                  <ChevronRight size={18} className="text-primary" />
                </Link>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {newsItems.length > 0 ? (
                  newsItems.map((item, index) => (
                    <Link
                      key={index}
                      to="/archives/news"
                      className="flex items-center justify-between px-16 py-16 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-base font-medium text-gray-900 truncate max-w-400">· {item.title}</span>
                      <span className="text-base text-primary shrink-0 ml-16">{item.date}</span>
                    </Link>
                  ))
                ) : (
                  <div className="px-16 py-40 text-center text-base text-gray-500">
                    등록된 뉴스가 없습니다.
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-24">
                <div className="flex items-center gap-8">
                  <img src={icon9} alt="" className="size-26" />
                  <h3 className="text-[26px] font-semibold text-gray-900">Notice</h3>
                </div>
                <Link
                  to="/archives/notice"
                  className="flex items-center gap-8 px-16 py-12 bg-white border border-gray-100 rounded-full text-base font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  자세히 보기
                  <ChevronRight size={18} className="text-primary" />
                </Link>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {noticeItems.length > 0 ? (
                  noticeItems.map((item, index) => (
                    <Link
                      key={index}
                      to="/archives/notice"
                      className="flex items-center justify-between px-16 py-16 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-base font-medium text-gray-900 truncate max-w-400">· {item.title}</span>
                      <span className="text-base text-primary shrink-0 ml-16">{item.date}</span>
                    </Link>
                  ))
                ) : (
                  <div className="px-16 py-40 text-center text-base text-gray-500">
                    등록된 공지사항이 없습니다.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default memo(HomeTemplate)
