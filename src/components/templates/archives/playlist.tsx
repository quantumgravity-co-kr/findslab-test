import { memo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Play, Clock, Calendar, Home } from 'lucide-react'

// Image Imports
import banner4 from '@/assets/images/banner/4.png'

interface PlaylistItem {
  title: string;
  date: string;
  duration: string;
  thumbnail?: string;
  youtubeUrl: string;
}

export const ArchivesPlaylistTemplate = () => {
  const [playlists, setPlaylists] = useState<PlaylistItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await fetch('/data/playlist/ischoi.json')
        const text = await response.text()
        const cleaned = text.replace(/,(\s*[\}\]])/g, '$1')
        const data = JSON.parse(cleaned)
        
        // 데이터 형식 변환 (ischoi.json -> UI 형식)
        const items = data.items.map((item: any) => {
          // YouTube URL에서 비디오 ID 추출
          const videoId = item.url.split('v=')[1]?.split('&')[0]
          return {
            title: 'FINDS Lab Playlist Video', // 실제 타이틀은 API 등으로 가져와야 하지만 여기서는 기본값
            date: '2025.01.01', // 기본값
            duration: '00:00', // 기본값
            thumbnail: videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : undefined,
            youtubeUrl: item.url
          }
        })
        
        setPlaylists(items)
      } catch (err) {
        console.error('Failed to load playlists:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPlaylists()
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
            Playlist
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
          <span className="text-base text-primary font-medium">Playlist</span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-1480 mx-auto w-full px-20 pb-100">
        {loading ? (
          <div className="bg-[#f9fafb] rounded-[20px] p-60 text-center text-gray-500">
            Loading playlist...
          </div>
        ) : playlists.length > 0 ? (
          <div className="grid grid-cols-3 gap-20">
            {playlists.map((item, index) => (
              <a
                key={index}
                href={item.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white border border-[#f0f0f0] rounded-[20px] overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <div className="relative aspect-video bg-[#f9fafb] flex items-center justify-center">
                  {item.thumbnail ? (
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <div className="w-60 h-60 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-30 h-30 text-white ml-4" fill="white" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-20">
                  <h3 className="text-md font-semibold text-[#222222] mb-12 group-hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-8">
                      <Calendar className="w-14 h-14 text-[#7f8894]" />
                      <span className="text-[13px] text-[#7f8894]">{item.date}</span>
                    </div>
                    <div className="flex items-center gap-8">
                      <Clock className="w-14 h-14 text-[#7f8894]" />
                      <span className="text-[13px] text-[#7f8894]">{item.duration}</span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="bg-[#f9fafb] rounded-[20px] p-60 text-center">
            <div className="w-80 h-80 bg-white rounded-full flex items-center justify-center mx-auto mb-20">
              <Play className="w-40 h-40 text-[#cdcdcd]" />
            </div>
            <p className="text-[18px] font-medium text-[#222222] mb-8">
              플레이리스트 준비 중
            </p>
            <p className="text-[14px] text-[#7f8894]">
              아직 등록된 영상이 없습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(ArchivesPlaylistTemplate)





