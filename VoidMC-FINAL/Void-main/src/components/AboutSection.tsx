import React from 'react';
import { Users, Lightbulb, Sparkles, ArrowDownRight, ShieldCheck, Crown, UserCheck } from 'lucide-react';
import { Language, PlatformLinks } from '../types/index.ts';
import { DEFAULT_LINKS } from '../data/defaults.ts';
import { TRANSLATIONS } from '../data/translations.ts';

interface AboutSectionProps {
  language?: Language;
  onEnterVoid: () => void;
  links?: PlatformLinks;
}

const TEAM_MEMBERS = [
  {
    name: 'Ansh Raj',
    role: 'Owner',
    photo: '/assets/images/team/ansh_raj.jpg',
    icon: Crown,
    bio: 'Ansh Raj is the founder and owner of VOIDMC, responsible for leading the server with a clear vision and strong leadership. He oversees major decisions, plans future improvements, and works to make VOIDMC a unique and enjoyable experience for every player.',
  },
  {
    name: 'Meraj Mustafa',
    role: 'Co-Owner',
    photo: '/assets/images/team/meraj_mustafa.png',
    icon: Sparkles,
    bio: 'Meraj Mustafa assists the owner in managing VOIDMC and plays an important role in the server’s growth and development. He helps oversee operations, supports the staff team, and works to ensure that the community continues to grow smoothly.',
  },
  {
    name: 'Santosh Rout',
    role: 'Supervisor',
    photo: '/assets/images/team/santosh_rout.png',
    icon: ShieldCheck,
    bio: 'Santosh Rout supervises the staff team and helps maintain discipline, professionalism, and smooth operations across VOIDMC. He monitors staff activities, assists with management decisions, and ensures that responsibilities are handled properly.',
  },
  {
    name: 'Ayeshaa',
    role: 'Manager',
    photo: '/assets/images/team/ayeshaa.jpg',
    icon: UserCheck,
    bio: 'Ayeshaa manages the day-to-day operations of VOIDMC and helps keep the community organized and welcoming. She assists players, coordinates with staff members, and works to ensure that issues are handled properly and everyone has a positive experience on the server.',
  },
];

export const AboutSection: React.FC<AboutSectionProps> = ({ language = 'en', onEnterVoid, links = DEFAULT_LINKS }) => {
  const t = TRANSLATIONS[language]?.about || TRANSLATIONS.en.about;

  return (
    <div className="py-16 bg-[#0B0713]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Intro */}
        <div className="text-center mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-purple-400 font-bold">
            {t.discoverTitle}
          </span>
          <div className="text-xs font-mono tracking-widest text-slate-500 uppercase mt-1">
            {t.moreThanAServer}
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white mt-2 font-heading tracking-tight">
            {t.weAre} <span className="text-purple-400">{t.voidmc}</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto mt-6 leading-relaxed">
            {t.intro}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 text-xs font-mono text-purple-300">
            <span>{t.ourStory} ↘</span>
          </div>
          <div className="mt-2 text-[11px] font-mono text-purple-500/80">
            {t.subSeason}
          </div>
        </div>

        {/* 01 — OUR STORY */}
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

              {/* Milestones bar */}
              <div className="mt-8 pt-6 border-t border-purple-900/40 grid grid-cols-2 gap-4 font-mono text-xs">
                <div>
                  <div className="text-slate-500 uppercase">Season 1 Genesis</div>
                  <div className="text-white font-bold text-sm mt-0.5">2GB Aternos Box</div>
                </div>
                <div>
                  <div className="text-purple-400 uppercase">Season 5 Today</div>
                  <div className="text-purple-300 font-bold text-sm mt-0.5">50+ GB Dedicated Node</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-purple-800/50 shadow-2xl">
                <img
                  src="/assets/images/void_orbital_cannon.jpg"
                  alt="VOIDMC Arena & Orbital Cannon"
                  className="w-full h-80 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0713] via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-[#0B0713]/85 backdrop-blur-md border border-purple-500/30 text-xs text-purple-200 font-mono">
                  ⚡ Orbital Strike Cannon in action — Custom crafted feature of VOIDMC
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-purple-800/50 shadow-2xl">
                <img
                  src="/assets/images/voidmc_live_ranks.png"
                  alt="VOIDMC in-game rank board and player list"
                  className="w-full h-64 object-cover object-top"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-[#0B0713]/85 backdrop-blur-md border border-purple-500/30 text-[11px] text-purple-200 font-mono">
                  🏆 Live in-game rank board — Owner to Member, everyone in one world
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 02 — WHAT DEFINES US */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-purple-400 font-bold">
              {t.definesHeader}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-1 font-heading">
              {t.definesTitle}
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              {t.definesSub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Principle 01 - Community */}
            <div className="bg-[#110A1F] border border-purple-900/40 rounded-2xl p-7 flex flex-col justify-between hover:border-purple-600/50 transition-all shadow-lg hover:shadow-[0_0_25px_rgba(168,85,247,0.2)]">
              <div>
                <div className="flex items-center justify-between text-purple-400 font-mono text-xs mb-4">
                  <span>01 ◈ 01</span>
                  <span className="px-2 py-0.5 rounded bg-purple-950 border border-purple-700/40 text-[10px] font-bold text-purple-300">
                    {t.p1Badge}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white font-heading mb-3">
                  {t.p1Title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {t.p1Desc}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-purple-900/30 flex items-center gap-2 text-xs text-purple-300 font-semibold">
                <Users className="w-4 h-4 text-purple-400" />
                <span>Weekly Events For Everyone</span>
              </div>
            </div>

            {/* Principle 02 - Innovation */}
            <div className="bg-[#110A1F] border border-purple-900/40 rounded-2xl p-7 flex flex-col justify-between hover:border-purple-600/50 transition-all shadow-lg hover:shadow-[0_0_25px_rgba(168,85,247,0.2)]">
              <div>
                <div className="flex items-center justify-between text-purple-400 font-mono text-xs mb-4">
                  <span>02 ◇ 02</span>
                  <span className="px-2 py-0.5 rounded bg-purple-950 border border-purple-700/40 text-[10px] font-bold text-violet-300">
                    {t.p2Badge}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white font-heading mb-3">
                  {t.p2Title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {t.p2Desc}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-purple-900/30 flex items-center gap-2 text-xs text-purple-300 font-semibold">
                <Lightbulb className="w-4 h-4 text-purple-400" />
                <span>Orbital Strike & Custom Ranks</span>
              </div>
            </div>

            {/* Principle 03 - Quality */}
            <div className="bg-[#110A1F] border border-purple-900/40 rounded-2xl p-7 flex flex-col justify-between hover:border-purple-600/50 transition-all shadow-lg hover:shadow-[0_0_25px_rgba(168,85,247,0.2)]">
              <div>
                <div className="flex items-center justify-between text-purple-400 font-mono text-xs mb-4">
                  <span>03 ⬡ 03</span>
                  <span className="px-2 py-0.5 rounded bg-purple-950 border border-purple-700/40 text-[10px] font-bold text-pink-300">
                    {t.p3Badge}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white font-heading mb-3">
                  {t.p3Title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {t.p3Desc}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-purple-900/30 flex items-center gap-2 text-xs text-purple-300 font-semibold">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>50+GB Node • Zero Lag Performance</span>
              </div>
            </div>
          </div>
        </section>

        {/* 03 — TEAM BEHIND THE VOID */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-purple-400 font-bold">
              03 — THE STAFF
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-1 font-heading">
              TEAM BEHIND THE VOID
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              The people who run VOIDMC and keep the community going.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.name}
                className="bg-[#110A1F] border border-purple-900/40 rounded-2xl p-6 flex flex-col items-center text-center hover:border-purple-600/50 transition-colors shadow-lg"
              >
                <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-purple-700/60 bg-[#0B0713]">
                  <img
                    src={member.photo}
                    alt={`${member.name} — ${member.role} of VOIDMC`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="mt-4 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-950 border border-purple-700/40 text-[10px] font-mono font-bold uppercase tracking-wider text-purple-300">
                  <member.icon className="w-3 h-3" />
                  <span>{member.role}</span>
                </span>
                <h3 className="text-lg font-black text-white font-heading mt-3">{member.name}</h3>
                <p className="text-xs text-slate-300 leading-relaxed mt-2">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ORBITAL STRIKE CANNON VIDEO */}
        <section className="mb-24">
          <div className="text-center mb-8">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-purple-400 font-bold">
              EVENT SHOWCASE
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-1 font-heading uppercase">
              Orbital Strike Cannon 5th
            </h2>
          </div>
          <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden border border-purple-600/40 bg-black shadow-[0_0_40px_rgba(168,85,247,0.3)]">
            <video
              src="/orbital-strike.mp4"
              className="w-full h-auto block"
              controls
              playsInline
              loop
              muted
              preload="metadata"
            />
          </div>
        </section>

        {/* READY TO ENTER THE VOID? (Exact text from prompt) */}
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
              href={links.discord}
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
