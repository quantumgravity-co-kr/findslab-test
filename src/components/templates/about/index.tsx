import { memo } from 'react'
import { Link } from 'react-router-dom'
import { Copy, Home } from 'lucide-react'

// Image Imports
import banner1 from '@/assets/images/banner/1.png'
import locationImg from '@/assets/images/location/1.png'

export const LocationTemplate = () => {
  const handleCopyAddress = () => {
    const address = '(02748) 서울특별시 성북구 화랑로13길 60 동덕여자대학교 인문관 706호'
    navigator.clipboard.writeText(address)
  }

  return (
    <div className="flex flex-col bg-white">
      {/* Banner Section */}
      <div className="relative w-full h-332 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${banner1})` }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full flex items-center justify-center">
          <h1 className="text-[36px] font-semibold text-white text-center">
            Location
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
          <span className="text-base text-primary font-medium">Location</span>
        </div>
      </div>

      {/* Content Section */}
      <section className="pb-80 px-20">
        <div className="max-w-1480 mx-auto flex gap-20">
          {/* Map Section */}
          <div className="flex-1 h-464 rounded-[20px] border border-gray-100 overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3162.5!2d127.0038!3d37.6063!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357cbc!2z64-Z645J7JeQ7J6Q64yA7ZWZ6rWQ!5e0!3m2!1sko!2skr!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Dongduk Women's University"
            />
          </div>

          {/* Info Section */}
          <div className="w-500 h-464 rounded-[20px] border border-gray-100 overflow-hidden flex flex-col">
            {/* Building Image with Overlay */}
            <div className="relative h-254 overflow-hidden">
              <img
                src={locationImg}
                alt="Building"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 h-64 bg-linear-to-r from-black/60 to-transparent">
                <div className="px-20 py-14">
                  <h3 className="text-md font-semibold text-white">
                    금융데이터인텔리전스 연구실 / 최인수 교수 연구실
                  </h3>
                  <p className="text-sm text-white">
                    FINDS Lab. / Prof. Insu Choi's Office
                  </p>
                </div>
              </div>
            </div>

            {/* Address Info */}
            <div className="flex-1 p-20 flex flex-col gap-16">
              <div className="flex items-center gap-8">
                <div className="w-3 h-18 bg-primary rounded-full" />
                <h4 className="text-xl font-semibold text-gray-900">
                  동덕여자대학교 인문관 706호
                </h4>
              </div>

              <div className="bg-gray-50 rounded-[12px] p-16 flex-1">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-12">
                    <p className="text-md font-medium text-gray-900 whitespace-pre-line">
                      (02748) 서울특별시 성북구 화랑로13길 60{'\n'}동덕여자대학교 인문관 706호
                    </p>
                    <p className="text-base text-gray-500 whitespace-pre-line">
                      Room 706, Humanities Hall{'\n'}Dongduk Women's University{'\n'}60 Hwarang-ro 13-gil, Seongbuk-gu, Seoul
                    </p>
                  </div>
                  <button
                    onClick={handleCopyAddress}
                    className="w-28 h-28 flex items-center justify-center bg-white border border-gray-100 rounded-[8px] hover:bg-gray-50 transition-colors"
                  >
                    <Copy className="w-16 h-16 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default memo(LocationTemplate)
