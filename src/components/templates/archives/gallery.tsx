import { memo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Image as ImageIcon, Calendar, Home } from 'lucide-react'

// Image Imports
import banner4 from '@/assets/images/banner/4.png'

interface GalleryItem {
  id: string;
  title: string;
  date: string;
  thumb: string;
  tags: string[];
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

      // 태그 등 배열 처리 [tag1, tag2]
      if (value.startsWith('[') && value.endsWith(']')) {
        data[key] = value.slice(1, -1).split(',').map(t => t.trim());
      } else {
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        data[key] = value;
      }
    }
  });

  return { data, content };
};

export const ArchivesGalleryTemplate = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 갤러리 폴더 목록 (브라우저에서는 목록을 알 수 없어 현재 존재하는 데이터를 기반으로 합니다)
    const galleryFolders = ['2025-09-01-1']

    const fetchAllGalleries = async () => {
      try {
        const results = await Promise.all(
          galleryFolders.map(async (folder) => {
            const response = await fetch(`/data/gallery/${folder}/index.md`)
            const text = await response.text()
            const { data } = parseMarkdown(text)
            return {
              id: folder,
              title: data.title || 'No Title',
              date: data.date || '',
              thumb: data.thumb || '',
              tags: data.tags || []
            }
          })
        )
        setGalleryItems(results.sort((a, b) => b.date.localeCompare(a.date)))
      } catch (err) {
        console.error('Failed to load galleries:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAllGalleries()
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
            Gallery
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
          <span className="text-base text-primary font-medium">Gallery</span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-1480 mx-auto w-full px-20 pb-100">
        {loading ? (
          <div className="bg-[#f9fafb] rounded-[20px] p-60 text-center text-gray-500 font-medium">
            Loading galleries from markdown files...
          </div>
        ) : galleryItems.length > 0 ? (
          <div className="grid grid-cols-3 gap-20">
            {galleryItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#f0f0f0] rounded-[20px] overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div className="aspect-[4/3] bg-[#f9fafb] flex items-center justify-center overflow-hidden">
                  {item.thumb ? (
                    <img
                      src={`/data/gallery/${item.id}/${item.thumb}`}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <ImageIcon className="size-40 text-[#cdcdcd]" />
                  )}
                </div>
                <div className="p-20">
                  <div className="flex items-center gap-8 mb-8">
                    <Calendar className="size-14 text-primary" />
                    <span className="text-sm font-medium text-primary">{item.date}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-12">{item.title}</h3>
                  <div className="flex flex-wrap gap-6">
                    {item.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="px-10 py-4 bg-gray-50 text-gray-500 text-xs rounded-full border border-gray-100">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#f9fafb] rounded-[20px] p-60 text-center text-gray-500">
            No gallery items found in markdown folder.
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(ArchivesGalleryTemplate)





