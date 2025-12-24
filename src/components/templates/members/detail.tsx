import { memo, useState, useEffect } from 'react'
import {
  Mail,
  Github,
  Linkedin,
  Globe,
  GraduationCap,
} from 'lucide-react'
import type { MemberData } from '@/types/data'

interface Props {
  memberId: string
}

export const MembersDetailTemplate = ({ memberId }: Props) => {
  const [member, setMember] = useState<MemberData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!memberId) return

    const safeJsonFetch = async (url: string) => {
      const response = await fetch(url)
      const text = await response.text()
      const cleaned = text.replace(/,(\s*[\}\]])/g, '$1')
      return JSON.parse(cleaned)
    }

    safeJsonFetch(`/findslab-test/data/members/${memberId}.json`)
      .then((data: MemberData) => {
        setMember(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load member detail:', err)
        setLoading(false)
      })
  }, [memberId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-gray-500">Loading member profile...</div>
      </div>
    )
  }

  if (!member) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="text-gray-500 text-lg font-medium">Member not found</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-40 p-30">
      <div className="flex flex-col md:flex-row gap-40">
        {/* Left: Profile Info */}
        <div className="w-full md:w-260 flex flex-col items-center text-center">
          <div className="w-160 h-160 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden mb-24 border-4 border-gray-50">
            {member.avatar ? (
              <img
                src={member.avatar.replace('/assets/img/', '/findslab-test/images/')}
                alt={member.name.ko}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-[80px]">👤</span>
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{member.name.ko}</h2>
          <p className="text-base text-gray-500 mb-12">{member.name.en}</p>
          <div className="inline-flex px-12 py-4 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-20">
            {member.role.en}
          </div>

          <div className="w-full pt-20 border-t border-gray-100 flex flex-col gap-12 text-left">
            <div className="flex items-center gap-10 text-gray-600">
              <Mail size={16} className="text-gray-400 shrink-0" />
              <a href={`mailto:${member.contact.email}`} className="text-sm hover:text-primary transition-colors truncate">
                {member.contact.email}
              </a>
            </div>
            {member.social?.personal_website && (
              <div className="flex items-center gap-10 text-gray-600">
                <Globe size={16} className="text-gray-400 shrink-0" />
                <a
                  href={member.social.personal_website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-primary transition-colors truncate"
                >
                  Personal Website
                </a>
              </div>
            )}
            <div className="flex items-center gap-12 mt-8">
              {member.social?.github && (
                <a
                  href={member.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  <Github size={18} />
                </a>
              )}
              {member.social?.linkedin && (
                <a
                  href={member.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  <Linkedin size={18} />
                </a>
              )}
              {member.social?.google_scholar && (
                <a
                  href={member.social.google_scholar}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary transition-colors"
                  title="Google Scholar"
                >
                  <GraduationCap size={18} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right: Detailed Content */}
        <div className="flex-1 flex flex-col gap-40">
          {/* Research Interests */}
          <div>
            <div className="flex items-center gap-10 mb-20">
              <h3 className="text-xl font-bold text-gray-900">Research Interests</h3>
            </div>
            <div className="flex flex-wrap gap-8">
              {member.research.interests.map((interest, idx) => (
                <span
                  key={idx}
                  className="px-16 py-8 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-700 font-medium"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <div className="flex items-center gap-10 mb-20">
              <h3 className="text-xl font-bold text-gray-900">Education</h3>
            </div>
            <div className="flex flex-col gap-16">
              {member.education.map((edu, idx) => (
                <div key={idx} className="relative pl-24 border-l-2 border-gray-100">
                  <div className="absolute left-[-7px] top-0 size-12 bg-white border-2 border-primary rounded-full" />
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-primary">{edu.start} ~ {edu.end || edu.expected || 'Present'}</span>
                    <h4 className="text-base font-bold text-gray-900">
                      {edu.degree} in {edu.field}
                    </h4>
                    <p className="text-sm text-gray-600">{edu.school}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(MembersDetailTemplate)


