import React from 'react';
import { Users } from 'lucide-react';
import { Language } from '../types/index.ts';
import { TRANSLATIONS } from '../data/translations.ts';
import orbitalCannonImage from '../assets/images/void_orbital_cannon_1792693303731.jpg';

interface AboutSectionProps {
  language?: Language;
  onEnterVoid: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  language = 'en',
  onEnterVoid,
}) => {
  const t = TRANSLATIONS[language]?.about || TRANSLATIONS.en.about;

  const teamMembers = [
    {
      name: 'elite ansh',
      role: 'Owner',
      badge: 'FOUNDER & LEAD DEV',
      avatar: 'https://mc-heads.net/avatar/elite_ansh/96',
      desc: 'Architect of VOIDMC network systems, dedicated Singapore node infrastructure, and custom economy mechanics.',
    },
    {
      name: 'DMM VOID',
      role: 'Co-Owner',
      badge: 'CO-FOUNDER',
      avatar: 'https://mc-heads.net/avatar/DMM_VOID/96',
      desc: 'Oversees server community direction, staff operations, and orbital weapon balance.',
    },
    {
      name: 'Santosh rout',
      role: 'Supervisor',
      badge: 'CHIEF SUPERVISOR',
      avatar: 'https://mc-heads.net/avatar/Santosh_rout/96',
      desc: 'Directs moderation standards, anti-cheat enforcement, and competitive tournament rules.',
    },
    {
      name: 'Ayeshaa',
      role: 'Manager',
      badge: 'COMMUNITY MANAGER',
      avatar: 'https://mc-heads.net/avatar/Ayeshaa/96',
      desc: 'Leads player relations, store order verifications, Discord events, and creator collaborations.',
    },
  ];

  return (
    <div className="py-16 bg-[#0B0713]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* OUR STORY */}
        <section className="mb-24 bg-[#110A1F] border border-purple-900/40 rounded-3xl p-8 sm:p-12 shadow-[0_0_35px_rgba(168,85,247,0.15)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-purple-400 font-bold">
                {t.storyHeader}
              </span>

              <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 font-heading leading-tight">
                {t.storyTitle}
              </h2>

              <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed mt-6">
                <p>{t.storyDesc1}</p>
                <p>{t.storyDesc2}</p>
              </div>

              <div className="mt-8 pt-6 border-t border-purple-900/40 grid grid-cols-2 gap-4 font-mono text-xs">
                <div>
                  <div className="text-slate-500 uppercase">Season 1 Genesis</div>
                  <div className="text-white font-bold text-sm mt-0.5">
                    2GB Aternos Box
                  </div>
                </div>

                <div>
                  <div className="text-purple-400 uppercase">Season 5 Today</div>
                  <div className="text-purple-300 font-bold text-sm mt-0.5">
                    50+ GB Dedicated Node
                  </div>
                </div>
              </div>
            </div>

            {/* VOIDMC IMAGE */}
            <div className="relative rounded-2xl overflow-hidden border border-purple-800/50 shadow-2xl">
              <img
                src={orbitalCannonImage}
                alt="VOIDMC Arena and Orbital Cannon"
                className="block w-full h-80 object-cover"
                loading="eager"
                onError={(event) => {
                  console.error(
                    'VOIDMC About image failed to load:',
                    event.currentTarget.src
                  );
                }}
              />

              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0B0713] via-transparent to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-[#0B0713]/85 backdrop-blur-md border border-purple-500/30 text-xs text-purple-200 font-mono">
                ⚡ Orbital Strike Cannon in action — Custom crafted feature of VOIDMC
              </div>
            </div>
          </div>
        </section>

        {/* THE TEAM */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-purple-400 font-bold">
              {t.teamHeader}
            </span>

            <h2 className="text-3xl sm:text-4xl font-black text-white mt-1 font-heading">
              {t.teamTitle}
            </h2>

            <p className="text-sm text-slate-400 mt-2">
              {t.teamSub}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="bg-[#110A1F] border border-purple-900/50 rounded-2xl p-6 text-center hover:border-purple-500/60 transition-all hover:shadow-[0_0_25px_rgba(168,85,247,0.25)] flex flex-col justify-between"
              >
                <div>
                  <div className="relative w-20 h-20 mx-auto mb-4">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full rounded-xl bg-purple-950/60 border-2 border-purple-600/40 shadow-md object-contain"
                      onError={(event) => {
                        event.currentTarget.src =
                          'https://mc-heads.net/avatar/Steve/96';
                      }}
                    />

                    <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white text-[10px] shadow">
                      👑
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-white tracking-wide font-heading">
                    {member.name}
                  </h3>

                  <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mt-0.5">
                    {member.role}
                  </div>

                  <div className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-purple-950/40 border border-purple-900/40 inline-block mt-2">
                    {member.badge}
                  </div>

                  <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                    {member.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-purple-900/30 flex items-center justify-center gap-1.5 text-[11px] font-mono text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Active Staff</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* READY TO ENTER THE VOID */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-950 via-[#190E2E] to-purple-950 border border-purple-600/50 p-8 sm:p-14 text-center shadow-[0_0_50px_rgba(168,85,247,0.3)]">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-purple-300 font-bold">
            {t.journeyStart}
          </span>

          <h2 className="text-3xl sm:text-5xl font-black text-white mt-2 font-heading">
            {t.readyToEnter}
          </h2>

          <p className="text-sm sm:text-base text-purple-200/90 max-w-xl mx-auto mt-4 leading-relaxed">
            {t.legacyWait}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onEnterVoid}
              className="px-8 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-[#0B0713] font-black text-xs uppercase tracking-wider shadow-xl transition-all hover:scale-105 active:scale-95"
            >
              Copy Server IP & Connect
            </button>

            <a
              href="https://discord.gg/J64n9aEsW"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white font-bold text-xs uppercase tracking-wider transition-all"
            >
              Join Official Discord
            </a>
          </div>
        </section>

      </div>
    </div>
  );
};
