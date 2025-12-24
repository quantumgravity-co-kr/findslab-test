import { memo, useState, useEffect, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  Search,
  SlidersHorizontal,
  Home,
  FileText,
  MessageSquare,
  BookOpen,
  FileCheck,
  BarChart3,
  Copy,
  Check,
} from 'lucide-react'
import { useStoreModal } from '@/store/modal'
import type { Publication, AuthorsData } from '@/types/data'

// Image Imports
import banner3 from '@/assets/images/banner/3.png'

// 필터 모달 컴포넌트
const FilterModal = ({
  filters,
  onChange,
  onReset
}: {
  filters: {
    type: string[];
    indexing: string[];
    conference: string[];
  };
  onChange: (key: keyof typeof filters, value: string) => void;
  onReset: () => void;
}) => {
  const sections = [
    {
      key: 'type' as const,
      label: 'Publication Type',
      options: ['Journal', 'Conference', 'Book', 'Report']
    },
    {
      key: 'indexing' as const,
      label: 'Journal Indexing',
      options: ['SCIE', 'SSCI', 'A&HCI', 'ESCI', 'Scopus', 'Other International', 'KCI Excellent', 'KCI Accredited', 'Other Domestic', 'Preprint']
    },
    {
      key: 'conference' as const,
      label: 'Conference',
      options: ['International Conference', 'Domestic Conference']
    }
  ]

  return (
    <div className="flex flex-col gap-20 p-20">
      {sections.map((section) => (
        <div key={section.key} className="flex flex-col gap-16">
          <h4 className="text-base font-bold text-gray-900">{section.label}</h4>
          <div className="flex flex-wrap gap-8">
            {section.options.map((option) => {
              const isActive = filters[section.key].includes(option)
              return (
                <button
                  key={option}
                  onClick={() => onChange(section.key, option)}
                  className={`px-16 py-8 rounded-lg text-sm font-medium transition-all border ${
                    isActive
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'bg-white text-[#7f8894] border-[#f0f0f0] hover:border-primary/30 hover:bg-gray-50'
                  }`}
                >
                  {option}
                </button>
              )
            })}
          </div>
        </div>
      ))}
      <div className="flex justify-end pt-16 border-t border-gray-100">
        <button
          onClick={onReset}
          className="px-16 py-8 text-sm font-medium text-gray-400 hover:text-primary transition-colors flex items-center gap-4"
        >
          Reset all filters
        </button>
      </div>
    </div>
  )
}

// 인용 모달 컴포넌트
const CitationModal = ({ citation }: { citation: Publication['citations'] }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const formats = [
    { key: 'apa', label: 'APA' },
    { key: 'mla', label: 'MLA' },
    { key: 'chicago', label: 'Chicago' },
    { key: 'harvard', label: 'Harvard' },
    { key: 'vancouver', label: 'Vancouver' },
    { key: 'korean', label: 'Korean' },
  ]

  return (
    <div className="flex flex-col gap-24 p-24">
      {formats.map((format) => {
        const text = citation[format.key as keyof typeof citation]
        if (!text) return null

        return (
          <div key={format.key} className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-900 uppercase tracking-wider">{format.label}</span>
              <button
                onClick={() => handleCopy(text, format.key)}
                className="flex items-center gap-4 text-xs font-medium text-primary hover:underline"
              >
                {copiedKey === format.key ? (
                  <>
                    <Check size={14} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    Copy Citation
                  </>
                )}
              </button>
            </div>
            <div className="p-16 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-600 leading-relaxed break-words">
              {text.replace(/<\/?em>/g, '')}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// 저자 역할 데이터
const authorshipRemarks = [
  { label: '연구 책임자', subLabel: 'Principal Investigator' },
  { label: '책임 연구원', subLabel: 'Leading Researcher' },
  { label: '참여 연구원', subLabel: 'Researcher' },
  { label: '지도교수', subLabel: 'Advisor' },
  { label: '제1저자', subLabel: 'First Author' },
  { label: '제2저자 / 공동저자', subLabel: 'Second / Co-author' },
  { label: '제3저자', subLabel: 'Third Author' },
  { label: '교신저자', subLabel: 'Corresponding Author' },
]

export const PublicationsTemplate = () => {
  const [publications, setPublications] = useState<Publication[]>([])
  const [authors, setAuthors] = useState<AuthorsData>({})
  const [expandedYear, setExpandedYear] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<{
    type: string[];
    indexing: string[];
    conference: string[];
  }>({
    type: [],
    indexing: [],
    conference: [],
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const { showModal } = useStoreModal()

  const handleFilterChange = useCallback((key: keyof typeof filters, value: string) => {
    setFilters((prev) => {
      const current = prev[key]
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      return { ...prev, [key]: next }
    })
    setCurrentPage(1)
  }, [])

  const handleFilterReset = useCallback(() => {
    setFilters({ type: [], indexing: [], conference: [] })
    setCurrentPage(1)
  }, [])

  const ITEMS_PER_PAGE = 5

  useEffect(() => {
    const safeJsonFetch = async (url: string) => {
      const response = await fetch(url)
      const text = await response.text()
      // Trailing commas 제거 (사람이 작성한 JSON 대응)
      const cleaned = text.replace(/,(\s*[\}\]])/g, '$1')
      return JSON.parse(cleaned)
    }

    Promise.all([
      safeJsonFetch('/data/pubs.json'),
      safeJsonFetch('/data/authors.json'),
    ])
      .then(([pubsData, authorsData]) => {
        setPublications(pubsData)
        setAuthors(authorsData)
        // 가장 최신 연도를 펼침
        if (pubsData.length > 0) {
          const years = ([...new Set(pubsData.map((p: Publication) => p.year))] as number[]).sort((a, b) => b - a)
          setExpandedYear(years[0])
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load publications data:', err)
        setLoading(false)
      })
  }, [])

  const statistics = useMemo(() => {
    let journals = 0
    let conferences = 0
    let books = 0
    let reports = 0

    publications.forEach((pub) => {
      if (pub.type === 'journal') journals++
      else if (pub.type === 'conference') conferences++
      else if (pub.type === 'book') books++
      else if (pub.type === 'report') reports++
    })

    return [
      { label: '저널 논문', subLabel: 'Journal Papers', count: journals, icon: FileText },
      { label: '컨퍼런스', subLabel: 'Conferences', count: conferences, icon: MessageSquare },
      { label: '서적', subLabel: 'Books', count: books, icon: BookOpen },
      { label: '리포트', subLabel: 'Reports', count: reports, icon: FileCheck },
      { label: '총량', subLabel: 'Total Outputs', count: publications.length, icon: BarChart3 },
    ]
  }, [publications])

  const getAuthorNames = useCallback(
    (authorIds: number[], authorMarks: string[]) => {
      return authorIds.map((id, idx) => {
        const author = authors[String(id)]
        const mark = authorMarks[idx] || ''
        if (author) {
          return { name: author.ko, mark }
        }
        return { name: `Unknown (${id})`, mark }
      })
    },
    [authors]
  )

  const filteredPublications = useMemo(() => {
    let result = publications

    // 검색어 필터링
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      result = result.filter((pub) => {
        const titleMatch = pub.title.toLowerCase().includes(term) || pub.title_ko.toLowerCase().includes(term)
        const venueMatch = pub.venue.toLowerCase().includes(term) || pub.venue_ko.toLowerCase().includes(term)
        const authorMatch = pub.authors.some((id) => {
          const author = authors[String(id)]
          return author && (author.en.toLowerCase().includes(term) || author.ko.toLowerCase().includes(term))
        })
        return titleMatch || venueMatch || authorMatch
      })
    }

    // 타입 필터링
    if (filters.type.length > 0) {
      result = result.filter((pub) => filters.type.some(t => t.toLowerCase() === pub.type.toLowerCase()))
    }

    // 인덱싱 필터링
    if (filters.indexing.length > 0) {
      result = result.filter((pub) => {
        if (!pub.indexing_group) return false
        return filters.indexing.includes(pub.indexing_group)
      })
    }

    // 컨퍼런스 필터링
    if (filters.conference.length > 0) {
      result = result.filter((pub) => {
        if (!pub.indexing_group) return false
        return filters.conference.includes(pub.indexing_group)
      })
    }

    return result
  }, [publications, searchTerm, authors, filters])

  const publicationsByYear = useMemo(() => {
    const grouped: { [year: number]: Publication[] } = {}
    filteredPublications.forEach((pub) => {
      if (!grouped[pub.year]) grouped[pub.year] = []
      grouped[pub.year].push(pub)
    })
    return grouped
  }, [filteredPublications])

  const sortedYears = useMemo(() => {
    return Object.keys(publicationsByYear)
      .map(Number)
      .sort((a, b) => b - a)
  }, [publicationsByYear])

  const paginatedYears = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return sortedYears.slice(start, start + ITEMS_PER_PAGE)
  }, [sortedYears, currentPage])

  const totalPages = Math.ceil(sortedYears.length / ITEMS_PER_PAGE)

  const getYearStats = useCallback(
    (year: number) => {
      const pubs = publicationsByYear[year] || []
      let journals = 0
      let conferences = 0
      let reports = 0
      let books = 0

      pubs.forEach((pub) => {
        if (pub.type === 'journal') journals++
        else if (pub.type === 'conference') conferences++
        else if (pub.type === 'report') reports++
        else if (pub.type === 'book') books++
      })

      return { journals, conferences, reports, books }
    },
    [publicationsByYear]
  )

  return (
    <div className="flex flex-col bg-white">
      {/* Banner Section */}
      <div className="relative w-full h-332 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${banner3})` }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full flex items-center justify-center">
          <h1 className="text-[36px] font-semibold text-white text-center">
            Publications
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
          <span className="text-base text-primary font-medium">Publications</span>
        </div>
      </div>

      {/* Content Section */}
      <section className="pb-80 px-20">
        <div className="max-w-1480 mx-auto flex flex-col gap-40">
          {/* Statistics Section */}
          <div className="flex flex-col gap-20">
            <div className="flex items-center gap-8">
              <h2 className="text-[26px] font-semibold text-gray-900">Statistics</h2>
            </div>
            <div className="grid grid-cols-5 gap-20">
              {statistics.map((stat, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-20 py-24 bg-white border border-gray-100 rounded-2xl shadow-sm"
                >
                  <div className="flex items-center gap-12">
                    <stat.icon className="size-20 text-gray-500" />
                    <div className="flex flex-col">
                      <span className="text-md font-semibold text-gray-900">{stat.label}</span>
                      <span className="text-sm text-gray-500">{stat.subLabel}</span>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[24px] font-semibold text-primary">{stat.count}</span>
                    <span className="text-xs font-semibold text-gray-700">건</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Authorship Remarks Section */}
          <div className="flex flex-col gap-20">
            <div className="flex items-center gap-8">
              <h2 className="text-[26px] font-semibold text-gray-900">Authorship Remarks</h2>
            </div>
            <div className="grid grid-cols-4 gap-20">
              {authorshipRemarks.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-16 px-20 py-20 bg-white border border-gray-100 rounded-2xl shadow-sm"
                >
                  <div className="size-46 flex-shrink-0">
                    <img
                      src={`/images/icons/publications/${index + 1}.png`}
                      alt={item.label}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-semibold text-gray-900">{item.label}</span>
                    <span className="text-xs text-gray-500">{item.subLabel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Filter & Search */}
          <div className="flex items-center gap-20 relative z-30">
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-8 px-16 py-16 border rounded-xl text-base transition-all ${
                  isFilterOpen || filters.type.length > 0 || filters.indexing.length > 0 || filters.conference.length > 0
                    ? 'bg-primary/5 border-primary text-primary font-medium'
                    : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'
                }`}
              >
                Filters
                <SlidersHorizontal className="size-20" />
              </button>

              {/* Filter Popup */}
              {isFilterOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsFilterOpen(false)}
                  />
                  <div className="absolute top-[calc(100%+12px)] left-0 w-[1000px] bg-white border border-gray-100 rounded-2xl shadow-xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <FilterModal
                      filters={filters}
                      onChange={handleFilterChange}
                      onReset={handleFilterReset}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex-1 flex items-center px-16 py-16 bg-white border border-gray-100 rounded-xl focus-within:border-primary transition-colors">
              <input
                type="text"
                placeholder="Search by title, author, venue..."
                className="flex-1 text-base text-gray-700 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="size-20 text-gray-500" />
            </div>
            <div className="px-16 py-16 bg-gray-50 border border-gray-100 rounded-xl text-base font-medium text-gray-500">
              {filteredPublications.length} of {publications.length}
            </div>
          </div>

          {/* Year List */}
          {loading ? (
            <div className="bg-gray-50 rounded-2xl p-60 text-center">
              <p className="text-md text-gray-500">Loading publications...</p>
            </div>
          ) : paginatedYears.length > 0 ? (
            <div className="flex flex-col gap-16">
              {paginatedYears.map((year) => {
                const stats = getYearStats(year)
                const pubs = publicationsByYear[year] || []

                return (
                  <div key={year} className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                    <button
                      onClick={() => setExpandedYear(expandedYear === year ? null : year)}
                      className="w-full flex items-center justify-between px-24 py-20 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex flex-col items-start gap-4">
                        <span className="text-lg font-semibold text-gray-900">{year}</span>
                        <span className="text-base text-gray-500">
                          {stats.journals} Journals · {stats.conferences} Conferences · {stats.reports} Reports · {stats.books} Books
                        </span>
                      </div>
                      {expandedYear === year ? (
                        <ChevronUp className="size-20 text-gray-500" />
                      ) : (
                        <ChevronDown className="size-20 text-gray-500" />
                      )}
                    </button>
                    {expandedYear === year && (
                      <div className="flex flex-col">
                        {pubs.map((pub, idx) => {
                          const authorList = getAuthorNames(pub.authors, pub.author_marks)
                          return (
                            <div key={idx} className="p-24 bg-white border-t border-gray-100">
                              <div className="flex items-start gap-16">
                                <div
                                  className={`px-10 py-4 rounded-lg text-xs font-medium flex-shrink-0 ${
                                    pub.type === 'journal'
                                      ? 'bg-blue-100 text-blue-700'
                                      : pub.type === 'conference'
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  {pub.type === 'journal' ? 'Journal' : pub.type === 'conference' ? 'Conference' : pub.type}
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-md font-semibold text-gray-800 mb-8 leading-relaxed">
                                    {pub.title}
                                  </h4>
                                  {pub.title_ko && (
                                    <p className="text-base text-gray-600 mb-8">{pub.title_ko}</p>
                                  )}
                                  <div className="flex flex-wrap gap-4 mb-8">
                                    {authorList.map((author, aIdx) => (
                                      <span key={aIdx} className="text-sm text-gray-600">
                                        {author.name}
                                        {author.mark && (
                                          <sup className="text-primary ml-1">{author.mark}</sup>
                                        )}
                                        {aIdx < authorList.length - 1 && ', '}
                                      </span>
                                    ))}
                                  </div>
                                  <p className="text-sm text-gray-500 italic">{pub.venue}</p>
                                  {pub.doi && (
                                    <a
                                      href={`https://doi.org/${pub.doi}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm text-primary hover:underline mt-4 inline-block"
                                    >
                                      DOI: {pub.doi}
                                    </a>
                                  )}
                                </div>
                                <div className="flex flex-col items-end gap-12">
                                  <div className="text-base text-gray-500 whitespace-nowrap">
                                    {pub.published_date}
                                  </div>
                                  <button
                                    onClick={() => showModal({
                                      title: 'Citation Formats',
                                      maxWidth: '600px',
                                      children: <CitationModal citation={pub.citations} />
                                    })}
                                    className="flex items-center gap-6 px-12 py-6 bg-gray-50 border border-gray-100 rounded-lg text-xs font-medium text-gray-600 hover:bg-primary/10 hover:text-primary transition-colors"
                                  >
                                    Cite
                                  </button>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-60 text-center">
              <p className="text-md text-gray-500">검색 결과가 없습니다.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-8">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="size-40 flex items-center justify-center text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                <ChevronLeft className="size-20" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`size-40 flex items-center justify-center rounded-xl text-base ${
                    currentPage === page
                      ? 'bg-primary/10 border border-primary text-primary'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="size-40 flex items-center justify-center text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                <ChevronRight className="size-20" />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default memo(PublicationsTemplate)
