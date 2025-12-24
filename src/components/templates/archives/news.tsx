import { memo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Home } from 'lucide-react'
import { useStoreModal } from '@/store/modal'

interface NewsItem {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  author?: string;
}

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

// 상세 모달 컴포넌트
const NewsDetailModal = ({ id }: { id: string }) => {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/data/news/${id}.md`)
      .then(res => res.text())
      .then(text => {
        const { data, content } = parseMarkdown(text)

        let processedContent = content;

        // 1. Jekyll 스타일 변수 대치 ({{ page.title }}, {{ page.date }}, {{ page.excerpt }} 등)
        // YAML에 있는 모든 키값을 {{ page.key }} 형태로 대치
        Object.keys(data).forEach(key => {
          const placeholder = new RegExp(`{{\\s*page.${key}\\s*}}`, 'g');
          processedContent = processedContent.replace(placeholder, data[key]);
        });

        // 2. 만약 YAML에 date가 없는데 파일명에 날짜가 포함된 경우 (YYYY-MM-DD-...)
        if (!data.date && id.match(/^\d{4}-\d{2}-\d{2}/)) {
          const dateFromId = id.slice(0, 10).replace(/-/g, '.');
          processedContent = processedContent.replace(/{{\s*page.date\s*}}/g, dateFromId);
        }

        // 3. 기타 Jekyll 필터 및 경로 보정
        processedContent = processedContent
          .replace(/{{\s*site\.static_files\s*\|[^}]*}}/g, '')
          .replace(/{{\s*[^}]*relative_url\s*}}/g, '')
          .replace(/\/assets\/img\//g, '/images/')

        setContent(processedContent)
        setLoading(false)
      })
  }, [id])

  if (loading) return <div className="p-60 text-center text-gray-500">Loading...</div>

  return (
    <div className="archive-detail-content max-h-[80vh] overflow-y-auto">
      <div
        className="p-32 prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  )
}

export const ArchivesNewsTemplate = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const { showModal } = useStoreModal()

  useEffect(() => {
    const newsFiles = ['2025-09-01-1.md', '2025-06-14-1.md']

    const fetchAllNews = async () => {
      try {
        const results = await Promise.all(
          newsFiles.map(async (file) => {
            const response = await fetch(`/data/news/${file}`)
            const text = await response.text()
            const { data } = parseMarkdown(text)
            return {
              id: file.replace('.md', ''),
              title: data.title || 'No Title',
              date: data.date || '',
              excerpt: data.excerpt || '',
              author: data.author
            }
          })
        )
        // 날짜순 정렬
        setNewsItems(results.sort((a, b) => b.date.localeCompare(a.date)))
      } catch (err) {
        console.error('Failed to load news:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAllNews()
  }, [])

  return (
    <div className="flex flex-col">
      {/* Banner */}
      <div className="relative w-full h-332 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/banner/4.png)' }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full flex items-center justify-center">
          <h1 className="text-[36px] font-semibold text-white text-center">
            News
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
          <span className="text-base text-gray-400">Archives</span>
          <span className="text-[#cdcdcd]">›</span>
          <span className="text-base text-primary font-medium">News</span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-1480 mx-auto w-full px-20 pb-100">
        {loading ? (
          <div className="bg-[#f9fafb] rounded-[20px] p-60 text-center text-gray-500 font-medium">
            Loading news from markdown files...
          </div>
        ) : newsItems.length > 0 ? (
          <div className="flex flex-col gap-20">
            {newsItems.map((item) => (
              <div
                key={item.id}
                onClick={() => showModal({
                  maxWidth: '900px',
                  children: <NewsDetailModal id={item.id} />
                })}
                className="bg-white border border-[#f0f0f0] rounded-[20px] p-30 hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div className="flex items-start gap-20">
                  <div className="flex-1">
                    <div className="flex items-center gap-8 mb-12">
                      <Calendar className="size-14 text-gray-400" />
                      <span className="text-sm font-medium text-gray-500">{item.date}</span>
                      {item.author && (
                        <>
                          <span className="text-gray-300">|</span>
                          <span className="text-sm text-gray-500">{item.author}</span>
                        </>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-8 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                      {item.excerpt}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#f9fafb] rounded-[20px] p-60 text-center text-gray-500">
            No news items found in markdown folder.
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(ArchivesNewsTemplate)





