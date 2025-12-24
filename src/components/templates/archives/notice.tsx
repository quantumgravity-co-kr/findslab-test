import { memo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Calendar, Home } from 'lucide-react'
import { useStoreModal } from '@/store/modal'

// Image Imports
import banner4 from '@/assets/images/banner/4.png'

interface NoticeItem {
  id: string;
  title: string;
  date: string;
  description: string;
  isPinned?: boolean;
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
const NoticeDetailModal = ({ id }: { id: string }) => {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/findslab-test/data/notice/${id}.md`)
      .then(res => res.text())
      .then(text => {
        const { data, content } = parseMarkdown(text)

        let processedContent = content;

        // 1. Jekyll 스타일 변수 대치 ({{ page.title }}, {{ page.date }}, {{ page.excerpt }} 등)
        Object.keys(data).forEach(key => {
          const placeholder = new RegExp(`{{\\s*page.${key}\\s*}}`, 'g');
          processedContent = processedContent.replace(placeholder, data[key]);
        });

        // 2. 만약 YAML에 date가 없는데 파일명에 날짜가 포함된 경우
        if (!data.date && id.match(/^\d{4}-\d{2}-\d{2}/)) {
          const dateFromId = id.slice(0, 10).replace(/-/g, '.');
          processedContent = processedContent.replace(/{{\s*page.date\s*}}/g, dateFromId);
        }

        processedContent = processedContent
          .replace(/{{\s*site\.static_files\s*\|[^}]*}}/g, '')
          .replace(/{{\s*[^}]*relative_url\s*}}/g, '')
          .replace(/\/assets\/img\//g, '/findslab-test/images/')

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

export const ArchivesNoticeTemplate = () => {
  const [noticeItems, setNoticeItems] = useState<NoticeItem[]>([])
  const [loading, setLoading] = useState(true)
  const { showModal } = useStoreModal()

  useEffect(() => {
    const noticeFiles = ['2025-10-06-1.md', '2025-09-01-1.md']

    const fetchAllNotices = async () => {
      try {
        const results = await Promise.all(
          noticeFiles.map(async (file) => {
            const response = await fetch(`/findslab-test/data/notice/${file}`)
            const text = await response.text()
            const { data } = parseMarkdown(text)
            return {
              id: file.replace('.md', ''),
              title: data.title || 'No Title',
              date: data.date || '',
              description: data.excerpt || '',
              isPinned: data.isPinned === 'true' || data.isPinned === true
            }
          })
        )
        // 정렬: 고정글 우선 -> 날짜 최신순
        setNoticeItems(results.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return b.date.localeCompare(a.date);
        }))
      } catch (err) {
        console.error('Failed to load notices:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAllNotices()
  }, [])

  return (
    <div className="flex flex-col">
      {/* Banner */}
      <div className="relative w-full h-332 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${banner4})` }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full flex items-center justify-center">
          <h1 className="text-[36px] font-semibold text-white text-center">
            Notice
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
          <span className="text-base text-primary font-medium">Notice</span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-1480 mx-auto w-full px-20 pb-100">
        {loading ? (
          <div className="bg-[#f9fafb] rounded-[20px] p-60 text-center text-gray-500 font-medium">
            Loading notices from markdown files...
          </div>
        ) : noticeItems.length > 0 ? (
          <div className="flex flex-col gap-16">
            {noticeItems.map((item) => (
              <div
                key={item.id}
                onClick={() => showModal({
                  maxWidth: '900px',
                  children: <NoticeDetailModal id={item.id} />
                })}
                className={`bg-white border rounded-[16px] p-24 hover:shadow-lg transition-shadow cursor-pointer ${
                  item.isPinned ? 'border-primary bg-primary/5' : 'border-[#f0f0f0]'
                }`}
              >
                <div className="flex items-start gap-16">
                  <div className="flex-1">
                    <div className="flex items-center gap-8 mb-8">
                      <Calendar className="size-14 text-gray-400" />
                      <span className="text-sm font-medium text-gray-500">{item.date}</span>
                      {item.isPinned && (
                        <span className="px-8 py-2 bg-primary text-white text-[11px] font-semibold rounded-md">
                          PINNED
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#f9fafb] rounded-[20px] p-60 text-center">
            <div className="w-80 h-80 bg-white rounded-full flex items-center justify-center mx-auto mb-20">
              <Bell className="w-40 h-40 text-[#cdcdcd]" />
            </div>
            <p className="text-[18px] font-medium text-[#222222] mb-8">
              공지사항이 없습니다
            </p>
            <p className="text-[14px] text-[#7f8894]">
              아직 등록된 공지사항이 없습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(ArchivesNoticeTemplate)





