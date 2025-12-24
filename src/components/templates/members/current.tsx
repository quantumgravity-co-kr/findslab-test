import { memo, useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Users, GraduationCap, BookOpen, UserCheck, ChevronRight, Home, Mail, Github, Linkedin, Globe } from 'lucide-react'
import { useStoreModal } from '@/store/modal'
import { MembersDetailTemplate } from './detail'
import type { MemberData } from '@/types/data'

const degreeLabels = {
  phd: 'Ph.D. Students',
  ms: 'M.S. Students',
  undergrad: 'Undergraduate Researchers',
}

const degreeColors = {
  phd: 'bg-red-100 text-red-700',
  ms: 'bg-blue-100 text-blue-700',
  undergrad: 'bg-green-100 text-green-700',
}

export const MembersCurrentTemplate = () => {
  const [members, setMembers] = useState<MemberData[]>([])
  const [loading, setLoading] = useState(true)
  const { showModal } = useStoreModal()

  useEffect(() => {
    const safeJsonFetch = async (url: string) => {
      const response = await fetch(url)
      const text = await response.text()
      const cleaned = text.replace(/,(\s*[\}\]])/g, '$1')
      return JSON.parse(cleaned)
    }

    // members 폴더의 모든 파일 로드
    const memberFiles = ['kim-phd.json', 'park-ms.json', 'choi-undergrad.json']

    Promise.all(
      memberFiles.map((file) =>
        safeJsonFetch(`/data/members/${file}`)
          .catch(() => null)
      )
    )
      .then((results) => {
        const validMembers = results.filter((m): m is MemberData => m !== null && m.status === 'active')
        setMembers(validMembers)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load members data:', err)
        setLoading(false)
      })
  }, [])

  const stats = useMemo(() => {
    const phdCount = members.filter((m) => m.degree === 'phd').length
    const msCount = members.filter((m) => m.degree === 'ms').length
    const undergradCount = members.filter((m) => m.degree === 'undergrad').length

    return [
      { label: '박사 과정', subLabel: 'Ph.D. Students', count: phdCount, icon: GraduationCap },
      { label: '석사 과정', subLabel: 'M.S. Students', count: msCount, icon: BookOpen },
      { label: '학부 연구생', subLabel: 'Undergrad Researchers', count: undergradCount, icon: UserCheck },
      { label: '전체 멤버', subLabel: 'Total Members', count: members.length, icon: Users },
    ]
  }, [members])

  const groupedMembers = useMemo(() => {
    const grouped: { [key: string]: MemberData[] } = {
      phd: [],
      ms: [],
      undergrad: [],
    }
    members.forEach((m) => {
      if (grouped[m.degree]) {
        grouped[m.degree].push(m)
      }
    })
    return grouped
  }, [members])

  return (
    <div className="flex flex-col bg-white">
      {/* Banner */}
      <div className="relative w-full h-332 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/banner/2.png)' }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full flex items-center justify-center">
          <h1 className="text-[36px] font-semibold text-white text-center">
            Current Members
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
          <span className="text-base text-gray-400">Members</span>
          <span className="text-[#cdcdcd]">›</span>
          <span className="text-base text-primary font-medium">Current Members</span>
        </div>
      </div>

      {/* Content */}
      <section className="max-w-1480 mx-auto w-full px-20 pb-[80px]">
        {/* Statistics Section */}
        <div className="flex flex-col gap-[20px] mb-[60px]">
          <div className="flex items-center gap-[8px]">
            <h2 className="text-[26px] font-semibold text-gray-900">Statistics</h2>
          </div>
          <div className="grid grid-cols-4 gap-[20px]">
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
                  <span className="text-[12px] font-semibold text-gray-700">명</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Members List */}
        {loading ? (
          <div className="bg-gray-50 rounded-[20px] p-[60px] text-center">
            <p className="text-md text-gray-500">Loading members...</p>
          </div>
        ) : members.length > 0 ? (
          <div className="flex flex-col gap-[40px]">
            {(['phd', 'ms', 'undergrad'] as const).map((degree) => {
              const degreeMembers = groupedMembers[degree]
              if (degreeMembers.length === 0) return null

              return (
                <div key={degree}>
                  <h3 className="text-[22px] font-semibold text-gray-800 mb-[20px] flex items-center gap-[8px]">
                    {degree === 'phd' && <GraduationCap className="w-[24px] h-[24px] text-primary" />}
                    {degree === 'ms' && <BookOpen className="w-[24px] h-[24px] text-primary" />}
                    {degree === 'undergrad' && <UserCheck className="w-[24px] h-[24px] text-primary" />}
                    {degreeLabels[degree]}
                  </h3>
                  <div className="grid grid-cols-3 gap-[20px]">
                    {degreeMembers.map((member) => (
                      <div
                        key={member.id}
                        className="bg-white border border-gray-100 rounded-[20px] p-[24px] shadow-sm"
                      >
                        <div className="flex items-start gap-[16px]">
                          <div className="w-[80px] h-[80px] bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {member.avatar ? (
                              <img
                                src={member.avatar.replace('/assets/img/', '/images/')}
                                alt={member.name.ko}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                  e.currentTarget.nextElementSibling?.classList.remove('hidden')
                                }}
                              />
                            ) : null}
                            <span className={`text-[40px] ${member.avatar ? 'hidden' : ''}`}>👤</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-[8px] mb-[4px]">
                              <h4 className="text-[18px] font-semibold text-gray-800">{member.name.ko}</h4>
                              <span className={`px-[8px] py-[2px] rounded-full text-[11px] font-medium ${degreeColors[member.degree]}`}>
                                {member.role.ko}
                              </span>
                            </div>
                            <p className="text-[14px] text-gray-500 mb-[8px]">{member.name.en}</p>
                            <p className="text-[13px] text-gray-500">
                              {member.period.start} ~ {member.period.expected_graduation || 'Present'}
                            </p>
                          </div>
                        </div>

                        {member.research.interests.length > 0 && (
                          <div className="mt-[16px]">
                            <p className="text-[12px] text-gray-500 mb-[8px]">Research Interests</p>
                            <div className="flex flex-wrap gap-[6px]">
                              {member.research.interests.slice(0, 4).map((interest, idx) => (
                                <span
                                  key={idx}
                                  className="px-[10px] py-[4px] bg-gray-100 rounded-full text-[11px] text-gray-600"
                                >
                                  {interest}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="mt-[16px] pt-[16px] border-t border-gray-100 flex items-center gap-[12px]">
                          {member.contact.email && (
                            <a
                              href={`mailto:${member.contact.email}`}
                              className="text-gray-400 hover:text-primary transition-colors"
                              title="Email"
                            >
                              <Mail size={18} />
                            </a>
                          )}
                          {member.social?.github && (
                            <a
                              href={member.social.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-primary transition-colors"
                              title="GitHub"
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
                              title="LinkedIn"
                            >
                              <Linkedin size={18} />
                            </a>
                          )}
                          {member.social?.personal_website && (
                            <a
                              href={member.social.personal_website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-primary transition-colors"
                              title="Personal Website"
                            >
                              <Globe size={18} />
                            </a>
                          )}
                          <button
                            onClick={() => showModal({
                              maxWidth: '800px',
                              children: <MembersDetailTemplate memberId={member.id} />
                            })}
                            className="ml-auto flex items-center gap-4 text-[13px] font-medium hover:underline"
                          >
                            View Profile
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-[20px] p-[60px] text-center">
            <div className="w-[80px] h-[80px] bg-white rounded-full flex items-center justify-center mx-auto mb-[20px]">
              <Users className="w-[40px] h-[40px] text-gray-300" />
            </div>
            <p className="text-[18px] font-medium text-gray-800 mb-[8px]">No members found</p>
            <p className="text-[14px] text-gray-500">현재 등록된 멤버가 없습니다.</p>
          </div>
        )}
      </section>
    </div>
  )
}

export default memo(MembersCurrentTemplate)
