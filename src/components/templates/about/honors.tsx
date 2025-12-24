import { memo, useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Award, Trophy, Medal, Home, ChevronDown, ChevronUp } from 'lucide-react'
import type { HonorsData, HonorItem } from '@/types/data'

// Image Imports
import banner1 from '@/assets/images/banner/1.png'

type FilterType = 'all' | 'honor' | 'award'

export const AboutHonorsTemplate = () => {
  const [honorsData, setHonorsData] = useState<HonorsData>({})
  const [filter, setFilter] = useState<FilterType>('all')
  const [expandedYear, setExpandedYear] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const safeJsonFetch = async (url: string) => {
      const response = await fetch(url)
      const text = await response.text()
      const cleaned = text.replace(/,(\s*[\}\]])/g, '$1')
      return JSON.parse(cleaned)
    }

    safeJsonFetch('/data/honors.json')
      .then((data: HonorsData) => {
        setHonorsData(data)
        // 가장 최신 연도를 펼침
        const years = Object.keys(data).sort((a, b) => Number(b) - Number(a))
        if (years.length > 0) {
          setExpandedYear(years[0])
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load honors data:', err)
        setLoading(false)
      })
  }, [])

  const stats = useMemo(() => {
    let honors = 0
    let awards = 0
    Object.values(honorsData).forEach((items) => {
      items.forEach((item) => {
        if (item.type === 'honor') honors++
        else if (item.type === 'award') awards++
      })
    })
    return [
      { label: 'Honors', subLabel: 'Honorary Recognition', count: honors, icon: Medal },
      { label: 'Awards', subLabel: 'Competition Awards', count: awards, icon: Trophy },
      { label: 'Total', subLabel: 'Total Achievements', count: honors + awards, icon: Award },
    ]
  }, [honorsData])

  const sortedYears = useMemo(() => {
    return Object.keys(honorsData).sort((a, b) => Number(b) - Number(a))
  }, [honorsData])

  const getFilteredItems = (items: HonorItem[]) => {
    if (filter === 'all') return items
    return items.filter((item) => item.type === filter)
  }

  const getYearCount = (year: string) => {
    const items = honorsData[year] || []
    if (filter === 'all') return items.length
    return items.filter((item) => item.type === filter).length
  }

  return (
    <div className="flex flex-col bg-white">
      {/* Banner */}
      <div className="relative w-full h-332 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${banner1})` }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full flex items-center justify-center">
          <h1 className="text-[36px] font-semibold text-white text-center">
            Honors & Awards
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
          <span className="text-base text-primary font-medium">Honors & Awards</span>
        </div>
      </div>

      {/* Content */}
      <section className="max-w-1480 mx-auto w-full px-20 pb-[80px]">
        {/* Statistics Section */}
        <div className="flex flex-col gap-[20px] mb-[40px]">
          <div className="flex items-center gap-[8px]">
            <h2 className="text-[26px] font-semibold text-gray-900">Statistics</h2>
          </div>
          <div className="grid grid-cols-3 gap-[20px]">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-20 py-[24px] bg-white border border-gray-100 rounded-[20px] shadow-sm"
              >
                <div className="flex items-center gap-[12px]">
                  <stat.icon className="w-[20px] h-[20px] text-gray-500" />
                  <div className="flex flex-col">
                    <span className="text-md font-semibold text-gray-900">{stat.label}</span>
                    <span className="text-[14px] text-gray-500">{stat.subLabel}</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-[2px]">
                  <span className="text-[24px] font-semibold text-primary">{stat.count}</span>
                  <span className="text-[12px] font-semibold text-gray-700">건</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-[12px] mb-[30px]">
          <h3 className="text-[18px] font-semibold text-gray-800 flex items-center gap-[8px]">
            Filters
          </h3>
          <div className="flex items-center gap-[8px]">
            {(['all', 'honor', 'award'] as FilterType[]).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-[16px] py-[8px] rounded-[8px] text-[14px] font-medium transition-colors ${
                  filter === type
                    ? 'bg-primary text-white'
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}
              >
                {type === 'all' ? 'All' : type === 'honor' ? 'Honors' : 'Awards'}
              </button>
            ))}
          </div>
        </div>

        {/* List by Year */}
        {loading ? (
          <div className="bg-gray-50 rounded-[20px] p-[60px] text-center">
            <p className="text-md text-gray-500">Loading...</p>
          </div>
        ) : sortedYears.length > 0 ? (
          <div className="flex flex-col gap-[16px]">
            {sortedYears.map((year) => {
              const filteredItems = getFilteredItems(honorsData[year])
              const yearCount = getYearCount(year)
              if (yearCount === 0) return null

              return (
                <div key={year} className="border border-gray-100 rounded-[20px] overflow-hidden shadow-sm">
                  <button
                    onClick={() => setExpandedYear(expandedYear === year ? null : year)}
                    className="w-full flex items-center justify-between px-[24px] py-[20px] bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-[16px]">
                      <span className="text-[20px] font-bold text-gray-800">{year}</span>
                      <span className="text-[14px] text-gray-500">{yearCount}건</span>
                    </div>
                    {expandedYear === year ? (
                      <ChevronUp className="w-[20px] h-[20px] text-gray-500" />
                    ) : (
                      <ChevronDown className="w-[20px] h-[20px] text-gray-500" />
                    )}
                  </button>
                  {expandedYear === year && (
                    <div className="flex flex-col">
                      {filteredItems.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-[16px] p-[24px] bg-white border-t border-gray-100"
                        >
                          <div
                            className={`w-[44px] h-[44px] rounded-[12px] flex items-center justify-center flex-shrink-0 ${
                              item.type === 'honor' ? 'bg-blue-100' : 'bg-amber-100'
                            }`}
                          >
                            {item.type === 'honor' ? (
                              <Medal className="w-[22px] h-[22px] text-blue-600" />
                            ) : (
                              <Trophy className="w-[22px] h-[22px] text-amber-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-md font-semibold text-gray-800 mb-[4px]">
                              {item.title}
                            </h4>
                            <p className="text-[14px] text-gray-600 mb-[4px]">{item.event}</p>
                            <p className="text-[13px] text-gray-500">{item.organization}</p>
                            {item.winners && item.winners.length > 0 && (
                              <div className="flex items-center gap-[8px] mt-[8px]">
                                {item.winners.map((winner, idx) => (
                                  <span
                                    key={idx}
                                    className="px-[10px] py-[4px] bg-gray-100 rounded-full text-[12px] text-gray-600"
                                  >
                                    {winner.name}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="text-[14px] text-primary font-medium whitespace-nowrap">
                            {item.date}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-[20px] p-[60px] text-center">
            <div className="w-[80px] h-[80px] bg-white rounded-full flex items-center justify-center mx-auto mb-[20px]">
              <Award className="w-[40px] h-[40px] text-gray-300" />
            </div>
            <p className="text-md text-gray-500">아직 등록된 수상 내역이 없습니다.</p>
          </div>
        )}
      </section>
    </div>
  )
}

export default memo(AboutHonorsTemplate)
