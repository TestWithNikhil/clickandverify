import { useState, useMemo } from 'react';
import {
  Search, MapPin, Briefcase, Clock, DollarSign, Star,
  Building2, ChevronRight, ArrowLeft, CheckCircle, Upload,
  BookOpen, Award, Plus, X, Filter, Bell, User, FileText,
  Heart, Share2, Eye, TrendingUp, Calendar, Globe, Linkedin,
  Github, ExternalLink, AlertCircle, Send, BarChart3, Target,
  Bookmark, RefreshCw, ChevronDown, Check
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
type PortalScreen = 'landing' | 'register' | 'profile' | 'search' | 'job-detail' | 'apply' | 'tracker';

interface Job {
  id: string; title: string; company: string; location: string; type: string;
  salary: string; salaryMin: number; salaryMax: number; posted: string; logo: string;
  description: string; requirements: string[]; responsibilities: string[];
  skills: string[]; benefits: string[]; level: string; category: string;
  remote: boolean; featured: boolean; applicants: number;
}

interface Application {
  id: string; jobId: string; jobTitle: string; company: string; logo: string;
  appliedDate: string; status: 'applied' | 'screening' | 'interview' | 'offer' | 'rejected' | 'withdrawn';
  nextStep?: string; interviewDate?: string; salary?: string;
}

interface UserProfile {
  firstName: string; lastName: string; email: string; phone: string;
  title: string; location: string; summary: string; linkedin: string;
  github: string; portfolio: string; skills: string[]; experience: number;
  availability: string; salary: string; remoteOk: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const JOBS: Job[] = [
  {
    id: 'j1', title: 'Senior QA Automation Engineer', company: 'TechCorp', location: 'San Francisco, CA',
    type: 'Full-time', salary: '$120k – $160k', salaryMin: 120000, salaryMax: 160000,
    posted: '2 days ago', logo: '🏢', level: 'Senior', category: 'QA/Testing', remote: true, featured: true, applicants: 47,
    description: 'We are looking for an experienced QA Automation Engineer to join our world-class engineering team. You will design, build, and maintain end-to-end test frameworks.',
    requirements: ['5+ years automation testing', 'Playwright or Selenium expertise', 'CI/CD pipeline experience', 'JavaScript/TypeScript proficiency'],
    responsibilities: ['Build and maintain test automation frameworks', 'Integrate tests into CI/CD pipelines', 'Mentor junior QA engineers', 'Define testing strategies'],
    skills: ['Playwright', 'Selenium', 'TypeScript', 'CI/CD', 'Jest', 'API Testing'],
    benefits: ['Health insurance', '401k matching', 'Remote-first', 'Learning budget $2k/yr', 'Unlimited PTO'],
  },
  {
    id: 'j2', title: 'Frontend Engineer (React)', company: 'StartupX', location: 'Austin, TX',
    type: 'Full-time', salary: '$95k – $130k', salaryMin: 95000, salaryMax: 130000,
    posted: '1 day ago', logo: '🚀', level: 'Mid', category: 'Engineering', remote: true, featured: false, applicants: 89,
    description: 'Join a fast-growing startup building the next generation of developer tools. You\'ll work directly with the founding team on cutting-edge frontend challenges.',
    requirements: ['3+ years React experience', 'TypeScript proficiency', 'Testing with Jest/RTL', 'State management (Redux/Zustand)'],
    responsibilities: ['Build responsive UI components', 'Optimize performance', 'Write comprehensive tests', 'Collaborate with designers'],
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Jest', 'GraphQL', 'Next.js'],
    benefits: ['Equity package', 'Flexible hours', 'Remote-friendly', 'Home office stipend'],
  },
  {
    id: 'j3', title: 'SDET – Mobile Testing', company: 'AppWorks', location: 'New York, NY',
    type: 'Full-time', salary: '$110k – $145k', salaryMin: 110000, salaryMax: 145000,
    posted: '5 days ago', logo: '📱', level: 'Senior', category: 'QA/Testing', remote: false, featured: true, applicants: 34,
    description: 'AppWorks is looking for a Software Development Engineer in Test with strong mobile testing expertise. You\'ll own end-to-end quality for our flagship mobile app.',
    requirements: ['Appium or Detox experience', 'iOS/Android native testing', 'API testing with Postman', 'Performance testing basics'],
    responsibilities: ['Build mobile automation framework', 'Define mobile test strategy', 'Track quality metrics', 'Bug triage and root cause analysis'],
    skills: ['Appium', 'Detox', 'Swift/Kotlin basics', 'Postman', 'Charles Proxy'],
    benefits: ['Commuter benefits', 'Lunch provided', '4 weeks PTO', 'Professional development'],
  },
  {
    id: 'j4', title: 'DevOps Engineer', company: 'CloudBase', location: 'Remote',
    type: 'Full-time', salary: '$130k – $175k', salaryMin: 130000, salaryMax: 175000,
    posted: '3 days ago', logo: '☁️', level: 'Senior', category: 'DevOps', remote: true, featured: false, applicants: 62,
    description: 'CloudBase is hiring a DevOps engineer to manage our cloud infrastructure and help scale our platform to millions of users.',
    requirements: ['AWS/GCP expertise', 'Kubernetes experience', 'Terraform or Ansible', 'Strong Linux skills'],
    responsibilities: ['Manage cloud infrastructure', 'Automate deployment pipelines', 'Monitor system health', 'Improve developer experience'],
    skills: ['AWS', 'Kubernetes', 'Terraform', 'Docker', 'GitHub Actions', 'Prometheus'],
    benefits: ['100% remote', 'Equipment budget', 'Health/dental/vision', 'Annual retreat'],
  },
  {
    id: 'j5', title: 'QA Engineer – API Testing', company: 'FinTech Pro', location: 'Chicago, IL',
    type: 'Full-time', salary: '$85k – $110k', salaryMin: 85000, salaryMax: 110000,
    posted: '1 week ago', logo: '💳', level: 'Mid', category: 'QA/Testing', remote: true, featured: false, applicants: 28,
    description: 'FinTech Pro is seeking a QA Engineer specializing in API testing to ensure the reliability and correctness of our financial APIs.',
    requirements: ['REST API testing', 'REST Assured or Postman', 'SQL knowledge', 'Security testing basics'],
    responsibilities: ['Design API test suites', 'Validate payment flows', 'Create test documentation', 'Participate in code reviews'],
    skills: ['REST Assured', 'Postman', 'SQL', 'Java', 'JIRA', 'Swagger'],
    benefits: ['Stock options', 'Hybrid work', 'Learning stipend', '401k'],
  },
  {
    id: 'j6', title: 'Performance Test Engineer', company: 'ScaleUp Inc', location: 'Seattle, WA',
    type: 'Contract', salary: '$70 – $95/hr', salaryMin: 145000, salaryMax: 197600,
    posted: '4 days ago', logo: '⚡', level: 'Senior', category: 'QA/Testing', remote: true, featured: false, applicants: 19,
    description: 'ScaleUp is looking for a performance testing specialist on a 6-month contract basis to help load-test our rapidly growing platform.',
    requirements: ['k6 or JMeter expertise', 'Load/stress/soak testing', 'APM tools (Datadog/NewRelic)', 'Distributed systems understanding'],
    responsibilities: ['Design performance test scenarios', 'Execute load tests', 'Analyze bottlenecks', 'Report metrics to leadership'],
    skills: ['k6', 'JMeter', 'Gatling', 'Datadog', 'AWS', 'Grafana'],
    benefits: ['W2 or C2C', 'Flexible hours', 'Remote', '6-month contract'],
  },
  {
    id: 'j7', title: 'Junior QA Engineer', company: 'GrowthCo', location: 'Denver, CO',
    type: 'Full-time', salary: '$60k – $80k', salaryMin: 60000, salaryMax: 80000,
    posted: '2 days ago', logo: '🌱', level: 'Junior', category: 'QA/Testing', remote: false, featured: false, applicants: 156,
    description: 'Perfect for someone starting their QA career! GrowthCo offers mentorship, structured training, and clear growth paths into senior roles.',
    requirements: ['1+ year manual testing', 'Basic automation interest', 'JIRA/TestRail experience', 'Strong communication'],
    responsibilities: ['Execute manual test cases', 'Report and track bugs', 'Learn automation frameworks', 'Maintain test documentation'],
    skills: ['Manual Testing', 'JIRA', 'TestRail', 'Selenium basics', 'SQL basics'],
    benefits: ['Mentorship program', 'Career path plan', 'Health insurance', 'On-site gym'],
  },
  {
    id: 'j8', title: 'Test Lead – E-commerce', company: 'ShopGiant', location: 'Boston, MA',
    type: 'Full-time', salary: '$115k – $145k', salaryMin: 115000, salaryMax: 145000,
    posted: '6 days ago', logo: '🛒', level: 'Lead', category: 'QA/Testing', remote: true, featured: true, applicants: 41,
    description: 'ShopGiant needs a Test Lead to own quality for our high-traffic e-commerce platform. You\'ll manage a team of 5 QA engineers and report to the VP Engineering.',
    requirements: ['7+ years QA experience', '2+ years team leadership', 'E-commerce domain knowledge', 'Agile/Scrum'],
    responsibilities: ['Lead and mentor QA team', 'Define testing strategy', 'Manage test environments', 'Stakeholder reporting'],
    skills: ['Cypress', 'Leadership', 'Agile', 'SQL', 'TestRail', 'Jira'],
    benefits: ['Management track', 'RSUs', 'Remote-friendly', 'Executive coaching'],
  },
];

const STATUS_CONFIG: Record<Application['status'], { label: string; color: string; bg: string; step: number }> = {
  applied:    { label: 'Applied',    color: 'text-blue-700 dark:text-blue-400',   bg: 'bg-blue-100 dark:bg-blue-900/30',   step: 1 },
  screening:  { label: 'Screening',  color: 'text-yellow-700 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30', step: 2 },
  interview:  { label: 'Interview',  color: 'text-purple-700 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30', step: 3 },
  offer:      { label: 'Offer!',     color: 'text-green-700 dark:text-green-400',  bg: 'bg-green-100 dark:bg-green-900/30',  step: 4 },
  rejected:   { label: 'Rejected',   color: 'text-red-700 dark:text-red-400',     bg: 'bg-red-100 dark:bg-red-900/30',     step: 0 },
  withdrawn:  { label: 'Withdrawn',  color: 'text-gray-600 dark:text-gray-400',   bg: 'bg-gray-100 dark:bg-gray-800',      step: 0 },
};

const CATEGORIES = ['All', 'QA/Testing', 'Engineering', 'DevOps'];
const LEVELS = ['All Levels', 'Junior', 'Mid', 'Senior', 'Lead'];
const TYPES = ['All Types', 'Full-time', 'Contract', 'Part-time'];

// ─── Job Card ─────────────────────────────────────────────────────────────────
function JobCard({ job, saved, onSave, onSelect, onApply, applied }: {
  job: Job; saved: boolean; applied: boolean;
  onSave: () => void; onSelect: () => void; onApply: () => void;
}) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 border rounded-xl p-5 hover:shadow-md transition-all duration-200 ${job.featured ? 'border-blue-200 dark:border-blue-800' : 'border-gray-200 dark:border-gray-700'}`}
      data-testid={`job-card-${job.id}`}
      data-job-id={job.id}
      data-featured={job.featured}
      data-remote={job.remote}
    >
      {job.featured && (
        <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-semibold mb-2" data-testid={`job-featured-badge-${job.id}`}>
          <Star size={11} className="fill-current" /> Featured
        </div>
      )}
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-2xl shrink-0" data-testid={`job-logo-${job.id}`}>
          {job.logo}
        </div>
        <div className="flex-1 min-w-0">
          <button onClick={onSelect} className="text-left w-full group">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" data-testid={`job-title-${job.id}`}>
              {job.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5" data-testid={`job-company-${job.id}`}>{job.company}</p>
          </button>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400" data-testid={`job-location-${job.id}`}>
              <MapPin size={11} /> {job.location}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Briefcase size={11} /> {job.type}
            </span>
            {job.remote && (
              <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium" data-testid={`job-remote-badge-${job.id}`}>
                <Globe size={11} /> Remote
              </span>
            )}
          </div>
        </div>
        <button
          onClick={onSave}
          className={`p-1.5 rounded-lg transition-colors shrink-0 ${saved ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-400 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          data-testid={`job-save-${job.id}`}
          aria-label={saved ? 'Remove from saved' : 'Save job'}
          aria-pressed={saved}
        >
          <Bookmark size={15} className={saved ? 'fill-current' : ''} />
        </button>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
        <div>
          <p className="text-sm font-bold text-gray-900 dark:text-gray-100" data-testid={`job-salary-${job.id}`}>{job.salary}</p>
          <p className="text-xs text-gray-400 mt-0.5">{job.posted} · {job.applicants} applicants</p>
        </div>
        {applied ? (
          <span className="flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg" data-testid={`job-applied-badge-${job.id}`}>
            <Check size={12} /> Applied
          </span>
        ) : (
          <button
            onClick={onApply}
            className="text-sm font-semibold bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
            data-testid={`job-quick-apply-${job.id}`}
          >
            Apply
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Landing ──────────────────────────────────────────────────────────────────
function Landing({ onRegister, onSearch }: { onRegister: () => void; onSearch: () => void }) {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  return (
    <div data-testid="jp-landing">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-700 via-blue-700 to-blue-600 text-white rounded-2xl p-8 mb-6 text-center" data-testid="jp-hero">
        <h1 className="text-3xl sm:text-4xl font-black mb-3" data-testid="jp-hero-title">Find Your Dream QA Job</h1>
        <p className="text-blue-100 mb-6 text-sm">Browse {JOBS.length}+ curated roles for testers, SDETs, and DevOps engineers</p>
        <div className="max-w-xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-2 bg-white/10 backdrop-blur p-2 rounded-xl" data-testid="jp-hero-search">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" />
              <input value={keyword} onChange={e => setKeyword(e.target.value)} className="w-full bg-white/20 text-white placeholder-white/60 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-white/50" placeholder="Job title, skill, company…" data-testid="jp-hero-keyword" />
            </div>
            <div className="relative flex-1">
              <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" />
              <input value={location} onChange={e => setLocation(e.target.value)} className="w-full bg-white/20 text-white placeholder-white/60 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-white/50" placeholder="City, state, or Remote" data-testid="jp-hero-location" />
            </div>
            <button onClick={onSearch} className="bg-white text-blue-700 font-bold px-5 py-2.5 rounded-lg hover:bg-blue-50 transition-colors text-sm" data-testid="jp-hero-search-btn">
              Search Jobs
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6" data-testid="jp-stats">
        {[
          { label: 'Open Roles', value: JOBS.length.toString(), icon: <Briefcase size={16} className="text-blue-500" />, id: 'jp-stat-jobs' },
          { label: 'Companies', value: new Set(JOBS.map(j => j.company)).size.toString(), icon: <Building2 size={16} className="text-purple-500" />, id: 'jp-stat-companies' },
          { label: 'Remote Jobs', value: JOBS.filter(j => j.remote).length.toString(), icon: <Globe size={16} className="text-green-500" />, id: 'jp-stat-remote' },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center" data-testid={s.id}>
            <div className="flex justify-center mb-1">{s.icon}</div>
            <p className="text-2xl font-black text-gray-900 dark:text-gray-100">{s.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Categories */}
      <h2 className="font-bold text-gray-800 dark:text-gray-200 mb-3">Browse by Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6" data-testid="jp-categories">
        {[
          { label: 'QA / Testing', icon: '🧪', count: JOBS.filter(j => j.category === 'QA/Testing').length, id: 'jp-cat-qa' },
          { label: 'Engineering', icon: '⚙️', count: JOBS.filter(j => j.category === 'Engineering').length, id: 'jp-cat-eng' },
          { label: 'DevOps', icon: '🔧', count: JOBS.filter(j => j.category === 'DevOps').length, id: 'jp-cat-devops' },
          { label: 'Remote Only', icon: '🌍', count: JOBS.filter(j => j.remote).length, id: 'jp-cat-remote' },
        ].map(c => (
          <button key={c.label} onClick={onSearch} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center hover:border-blue-400 hover:shadow-sm transition-all" data-testid={c.id}>
            <span className="text-2xl block mb-1">{c.icon}</span>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{c.label}</p>
            <p className="text-xs text-gray-400">{c.count} jobs</p>
          </button>
        ))}
      </div>

      {/* Featured jobs preview */}
      <h2 className="font-bold text-gray-800 dark:text-gray-200 mb-3">Featured Jobs</h2>
      <div className="space-y-3 mb-6">
        {JOBS.filter(j => j.featured).map(job => (
          <div key={job.id} className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-center gap-3 hover:shadow-md transition-all" data-testid={`jp-featured-${job.id}`}>
            <span className="text-3xl">{job.logo}</span>
            <div className="flex-1">
              <p className="font-bold text-sm text-gray-900 dark:text-gray-100">{job.title}</p>
              <p className="text-xs text-gray-500">{job.company} · {job.location}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{job.salary}</p>
              <p className="text-xs text-gray-400">{job.posted}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 justify-center">
        <button onClick={onSearch} className="flex items-center gap-2 bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors" data-testid="jp-browse-all-btn">
          Browse All Jobs <ChevronRight size={16} />
        </button>
        <button onClick={onRegister} className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" data-testid="jp-create-profile-btn">
          Create Profile
        </button>
      </div>
    </div>
  );
}

// ─── Register ─────────────────────────────────────────────────────────────────
function Register({ onComplete }: { onComplete: (profile: UserProfile) => void }) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>({
    firstName: '', lastName: '', email: '', phone: '', title: '', location: '',
    summary: '', linkedin: '', github: '', portfolio: '',
    skills: [], experience: 2, availability: 'immediately', salary: '', remoteOk: true,
  });
  const [skillInput, setSkillInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const SUGGESTED_SKILLS = ['Selenium', 'Playwright', 'Cypress', 'Jest', 'Postman', 'REST Assured', 'k6', 'JIRA', 'SQL', 'TypeScript', 'Java', 'Python', 'Docker', 'CI/CD', 'Appium'];

  const u = (field: keyof UserProfile, val: string | number | boolean | string[]) => setProfile(p => ({ ...p, [field]: val }));

  const validate1 = () => {
    const e: Record<string, string> = {};
    if (!profile.firstName.trim()) e.firstName = 'Required';
    if (!profile.lastName.trim()) e.lastName = 'Required';
    if (!profile.email || !/\S+@\S+\.\S+/.test(profile.email)) e.email = 'Valid email required';
    if (!profile.title.trim()) e.title = 'Required';
    setErrors(e); return Object.keys(e).length === 0;
  };

  const validate2 = () => {
    const e: Record<string, string> = {};
    if (profile.skills.length === 0) e.skills = 'Add at least one skill';
    if (!profile.salary) e.salary = 'Required';
    setErrors(e); return Object.keys(e).length === 0;
  };

  const addSkill = (s: string) => {
    const trimmed = s.trim();
    if (trimmed && !profile.skills.includes(trimmed) && profile.skills.length < 15) {
      u('skills', [...profile.skills, trimmed]);
      setSkillInput('');
    }
  };

  return (
    <div className="max-w-lg mx-auto" data-testid="jp-register">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6" data-testid="jp-register-steps">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === s ? 'bg-blue-600 text-white' : step > s ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`} data-testid={`jp-reg-step-${s}`}>
              {step > s ? '✓' : s}
            </div>
            <span className={`text-xs font-medium ${step === s ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
              {s === 1 ? 'Basic Info' : s === 2 ? 'Skills & Prefs' : 'Bio & Links'}
            </span>
            {s < 3 && <div className={`flex-1 h-0.5 ${step > s ? 'bg-green-400' : 'bg-gray-200 dark:bg-gray-700'}`} />}
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
        {step === 1 && (
          <div data-testid="jp-reg-step1">
            <h2 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-4 flex items-center gap-2"><User size={18} className="text-blue-500" /> Basic Information</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'firstName', label: 'First Name', placeholder: 'Jane', col: 1 },
                { name: 'lastName', label: 'Last Name', placeholder: 'Smith', col: 1 },
              ].map(f => (
                <div key={f.name}>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{f.label} *</label>
                  <input value={profile[f.name as keyof UserProfile] as string} onChange={e => u(f.name as keyof UserProfile, e.target.value)}
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[f.name] ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}
                    placeholder={f.placeholder} data-testid={`jp-reg-${f.name}`} />
                  {errors[f.name] && <p className="text-xs text-red-500 mt-1" data-testid={`jp-reg-${f.name}-error`}>{errors[f.name]}</p>}
                </div>
              ))}
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Email *</label>
                <input type="email" value={profile.email} onChange={e => u('email', e.target.value)} className={`w-full border rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`} placeholder="jane@example.com" data-testid="jp-reg-email" />
                {errors.email && <p className="text-xs text-red-500 mt-1" data-testid="jp-reg-email-error">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Phone</label>
                <input type="tel" value={profile.phone} onChange={e => u('phone', e.target.value)} className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="+1 555 0100" data-testid="jp-reg-phone" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Location</label>
                <input value={profile.location} onChange={e => u('location', e.target.value)} className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="San Francisco, CA" data-testid="jp-reg-location" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Current / Desired Job Title *</label>
                <input value={profile.title} onChange={e => u('title', e.target.value)} className={`w-full border rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`} placeholder="Senior QA Automation Engineer" data-testid="jp-reg-title" />
                {errors.title && <p className="text-xs text-red-500 mt-1" data-testid="jp-reg-title-error">{errors.title}</p>}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div data-testid="jp-reg-step2">
            <h2 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-4 flex items-center gap-2"><Award size={18} className="text-purple-500" /> Skills & Preferences</h2>
            <div className="space-y-5">
              <div data-testid="jp-skills-section">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Skills *</label>
                <div className="flex gap-2 mb-2">
                  <input value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill(skillInput))}
                    className="flex-1 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type a skill and press Enter…" data-testid="jp-skill-input" />
                  <button onClick={() => addSkill(skillInput)} className="px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700" data-testid="jp-skill-add"><Plus size={16} /></button>
                </div>
                {errors.skills && <p className="text-xs text-red-500 mb-2" data-testid="jp-skill-error">{errors.skills}</p>}
                {/* Suggestions */}
                <div className="flex flex-wrap gap-1.5 mb-3" data-testid="jp-skill-suggestions">
                  {SUGGESTED_SKILLS.filter(s => !profile.skills.includes(s)).slice(0, 8).map(s => (
                    <button key={s} onClick={() => addSkill(s)} className="text-xs border border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 px-2.5 py-1 rounded-lg hover:border-blue-400 hover:text-blue-500 transition-colors" data-testid={`jp-skill-suggest-${s.toLowerCase()}`}>+ {s}</button>
                  ))}
                </div>
                {/* Added skills */}
                {profile.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2" data-testid="jp-skills-list">
                    {profile.skills.map(s => (
                      <span key={s} className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs px-2.5 py-1 rounded-lg font-medium" data-testid={`jp-skill-tag-${s.toLowerCase()}`}>
                        {s} <button onClick={() => u('skills', profile.skills.filter(sk => sk !== s))} className="hover:text-blue-900 dark:hover:text-blue-200" data-testid={`jp-skill-remove-${s.toLowerCase()}`}><X size={11} /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Years of Experience: <span className="text-blue-600 dark:text-blue-400 font-bold" data-testid="jp-exp-display">{profile.experience}</span></label>
                <input type="range" min={0} max={20} step={1} value={profile.experience} onChange={e => u('experience', Number(e.target.value))} className="w-full accent-blue-600" data-testid="jp-exp-range" aria-label="Years of experience" />
                <div className="flex justify-between text-xs text-gray-400 mt-0.5"><span>0 yrs</span><span>20+ yrs</span></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Expected Salary *</label>
                  <input value={profile.salary} onChange={e => u('salary', e.target.value)} className={`w-full border rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.salary ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`} placeholder="$120k – $150k" data-testid="jp-reg-salary" />
                  {errors.salary && <p className="text-xs text-red-500 mt-1" data-testid="jp-reg-salary-error">{errors.salary}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Availability</label>
                  <select value={profile.availability} onChange={e => u('availability', e.target.value)} className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" data-testid="jp-reg-availability">
                    <option value="immediately">Immediately</option>
                    <option value="2weeks">2 Weeks Notice</option>
                    <option value="1month">1 Month</option>
                    <option value="2months">2+ Months</option>
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 dark:bg-gray-700 rounded-xl" data-testid="jp-remote-label">
                <input type="checkbox" checked={profile.remoteOk} onChange={e => u('remoteOk', e.target.checked)} className="w-4 h-4 rounded text-blue-600" data-testid="jp-reg-remote" />
                <div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Open to Remote Work</p>
                  <p className="text-xs text-gray-400">Show you are open to fully remote positions</p>
                </div>
              </label>
            </div>
          </div>
        )}

        {step === 3 && (
          <div data-testid="jp-reg-step3">
            <h2 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-4 flex items-center gap-2"><FileText size={18} className="text-green-500" /> Bio & Links</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Professional Summary</label>
                <textarea rows={4} value={profile.summary} onChange={e => u('summary', e.target.value)} className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Brief description of your experience and what you're looking for…" data-testid="jp-reg-summary" maxLength={500} />
                <p className="text-xs text-gray-400 mt-0.5 text-right">{profile.summary.length}/500</p>
              </div>
              {[
                { field: 'linkedin', label: 'LinkedIn URL', icon: <Linkedin size={14} />, placeholder: 'linkedin.com/in/yourname', testId: 'jp-reg-linkedin' },
                { field: 'github', label: 'GitHub URL', icon: <Github size={14} />, placeholder: 'github.com/yourname', testId: 'jp-reg-github' },
                { field: 'portfolio', label: 'Portfolio / Website', icon: <Globe size={14} />, placeholder: 'yoursite.com', testId: 'jp-reg-portfolio' },
              ].map(l => (
                <div key={l.field}>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1">{l.icon}{l.label}</label>
                  <input value={profile[l.field as keyof UserProfile] as string} onChange={e => u(l.field as keyof UserProfile, e.target.value)} className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder={l.placeholder} data-testid={l.testId} />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <button onClick={() => setStep(s => s - 1)} className="flex-1 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" data-testid="jp-reg-back">← Back</button>
          )}
          {step < 3 ? (
            <button onClick={() => { if (step === 1 && !validate1()) return; if (step === 2 && !validate2()) return; setStep(s => s + 1); }}
              className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors" data-testid="jp-reg-next">
              Continue →
            </button>
          ) : (
            <button onClick={() => { onComplete(profile); console.log('[ClickAndVerify] JP: Profile created for', profile.email); }}
              className="flex-1 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 flex items-center justify-center gap-2 transition-colors"
              data-testid="jp-reg-complete">
              <CheckCircle size={16} /> Create Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Job Search ───────────────────────────────────────────────────────────────
function JobSearch({ savedJobs, applications, onSave, onSelect, onApply }: {
  savedJobs: Set<string>;
  applications: Application[];
  onSave: (id: string) => void;
  onSelect: (job: Job) => void;
  onApply: (job: Job) => void;
}) {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All Levels');
  const [type, setType] = useState('All Types');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [salaryMin, setSalaryMin] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'salary' | 'applicants'>('recent');

  const filtered = useMemo(() => {
    let list = JOBS.filter(j => {
      const q = keyword.toLowerCase();
      const matchKw = !q || j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) || j.skills.some(s => s.toLowerCase().includes(q));
      const matchLoc = !location || j.location.toLowerCase().includes(location.toLowerCase()) || (j.remote && location.toLowerCase() === 'remote');
      const matchCat = category === 'All' || j.category === category;
      const matchLevel = level === 'All Levels' || j.level === level;
      const matchType = type === 'All Types' || j.type === type;
      const matchRemote = !remoteOnly || j.remote;
      const matchSalary = j.salaryMin >= salaryMin;
      return matchKw && matchLoc && matchCat && matchLevel && matchType && matchRemote && matchSalary;
    });
    if (sortBy === 'salary') list = [...list].sort((a, b) => b.salaryMax - a.salaryMax);
    else if (sortBy === 'applicants') list = [...list].sort((a, b) => a.applicants - b.applicants);
    return list;
  }, [keyword, location, category, level, type, remoteOnly, salaryMin, sortBy]);

  const appliedIds = new Set(applications.map(a => a.jobId));

  return (
    <div data-testid="jp-search">
      {/* Search bar */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 mb-4 space-y-3" data-testid="jp-search-bar">
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={keyword} onChange={e => setKeyword(e.target.value)} className="w-full border border-gray-200 dark:border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Job title, skills, company…" data-testid="jp-search-keyword" aria-label="Search keywords" />
          </div>
          <div className="relative">
            <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={location} onChange={e => setLocation(e.target.value)} className="w-full border border-gray-200 dark:border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Location or 'Remote'" data-testid="jp-search-location" aria-label="Job location" />
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button onClick={() => setShowFilters(f => !f)} className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border transition-colors ${showFilters ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-blue-400'}`} data-testid="jp-toggle-filters" aria-expanded={showFilters}>
            <Filter size={12} /> Filters
          </button>
          <label className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 cursor-pointer" data-testid="jp-remote-filter-label">
            <input type="checkbox" checked={remoteOnly} onChange={e => setRemoteOnly(e.target.checked)} className="w-3.5 h-3.5 rounded text-blue-600" data-testid="jp-remote-filter" /> Remote Only
          </label>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)} className="ml-auto border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-xs bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" data-testid="jp-sort-select">
            <option value="recent">Most Recent</option>
            <option value="salary">Highest Salary</option>
            <option value="applicants">Fewest Applicants</option>
          </select>
        </div>

        {showFilters && (
          <div className="grid sm:grid-cols-3 gap-3 pt-2 border-t border-gray-100 dark:border-gray-700" data-testid="jp-advanced-filters">
            <select value={category} onChange={e => setCategory(e.target.value)} className="border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" data-testid="jp-filter-category">
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <select value={level} onChange={e => setLevel(e.target.value)} className="border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" data-testid="jp-filter-level">
              {LEVELS.map(l => <option key={l}>{l}</option>)}
            </select>
            <select value={type} onChange={e => setType(e.target.value)} className="border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" data-testid="jp-filter-type">
              {TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
            <div className="sm:col-span-3">
              <label className="block text-xs text-gray-500 mb-1">Min Salary: <span className="font-semibold text-blue-600 dark:text-blue-400" data-testid="jp-salary-min-display">${(salaryMin / 1000).toFixed(0)}k</span></label>
              <input type="range" min={0} max={200000} step={10000} value={salaryMin} onChange={e => setSalaryMin(Number(e.target.value))} className="w-full accent-blue-600" data-testid="jp-salary-filter" aria-label="Minimum salary filter" />
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3" data-testid="jp-results-count">
        <span className="font-semibold text-gray-800 dark:text-gray-200">{filtered.length}</span> jobs found
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400" data-testid="jp-no-results">
          <Search size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No jobs match your search</p>
          <button onClick={() => { setKeyword(''); setLocation(''); setCategory('All'); setLevel('All Levels'); setType('All Types'); setRemoteOnly(false); setSalaryMin(0); }} className="mt-2 text-blue-600 text-sm hover:underline" data-testid="jp-clear-filters">Clear all filters</button>
        </div>
      ) : (
        <div className="space-y-3" data-testid="jp-job-list">
          {filtered.map(job => (
            <JobCard key={job.id} job={job} saved={savedJobs.has(job.id)} applied={appliedIds.has(job.id)}
              onSave={() => onSave(job.id)} onSelect={() => onSelect(job)} onApply={() => onApply(job)} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Job Detail ───────────────────────────────────────────────────────────────
function JobDetail({ job, saved, applied, onSave, onApply, onBack }: {
  job: Job; saved: boolean; applied: boolean;
  onSave: () => void; onApply: () => void; onBack: () => void;
}) {
  const [activeTab, setActiveTab] = useState<'overview' | 'requirements' | 'company'>('overview');

  return (
    <div data-testid="jp-job-detail" data-job-id={job.id}>
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-4" data-testid="jp-detail-back"><ArrowLeft size={14} />Back to results</button>

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 mb-4" data-testid="jp-detail-header">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-3xl shrink-0">{job.logo}</div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-black text-gray-900 dark:text-gray-100 mb-1" data-testid="jp-detail-title">{job.title}</h1>
            <p className="text-blue-600 dark:text-blue-400 font-semibold mb-2" data-testid="jp-detail-company">{job.company}</p>
            <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1" data-testid="jp-detail-location"><MapPin size={13} />{job.location}</span>
              <span className="flex items-center gap-1"><Briefcase size={13} />{job.type}</span>
              <span className="flex items-center gap-1"><Clock size={13} />{job.posted}</span>
              {job.remote && <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium" data-testid="jp-detail-remote"><Globe size={13} />Remote OK</span>}
            </div>
          </div>
          <button onClick={onSave} className={`p-2 rounded-xl border transition-colors shrink-0 ${saved ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'border-gray-200 dark:border-gray-700 text-gray-400 hover:border-blue-400'}`} data-testid="jp-detail-save" aria-pressed={saved}>
            <Bookmark size={16} className={saved ? 'fill-current' : ''} />
          </button>
        </div>

        <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100 dark:border-gray-700 flex-wrap gap-3">
          <div>
            <p className="text-2xl font-black text-gray-900 dark:text-gray-100" data-testid="jp-detail-salary">{job.salary}</p>
            <p className="text-xs text-gray-400">{job.applicants} applicants · {job.level} level</p>
          </div>
          {applied ? (
            <span className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-bold px-5 py-2.5 rounded-xl border border-green-200 dark:border-green-800" data-testid="jp-detail-applied-badge">
              <CheckCircle size={16} /> Already Applied
            </span>
          ) : (
            <button onClick={onApply} className="flex items-center gap-2 bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors" data-testid="jp-detail-apply-btn">
              <Send size={15} /> Apply Now
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden mb-4" data-testid="jp-detail-tabs">
        <div className="flex border-b border-gray-100 dark:border-gray-700">
          {(['overview', 'requirements', 'company'] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors ${activeTab === t ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`} data-testid={`jp-tab-${t}`} aria-selected={activeTab === t}>{t}</button>
          ))}
        </div>
        <div className="p-5" data-testid="jp-tab-content">
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-2">About the Role</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed" data-testid="jp-detail-description">{job.description}</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-2">Responsibilities</h3>
                <ul className="space-y-2" data-testid="jp-responsibilities-list">
                  {job.responsibilities.map((r, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-600 dark:text-gray-300" data-testid={`jp-responsibility-${i}`}>
                      <ChevronRight size={14} className="text-blue-500 shrink-0 mt-0.5" />{r}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-2" data-testid="jp-skills-list">
                  {job.skills.map(s => <span key={s} className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2.5 py-1 rounded-lg font-medium" data-testid={`jp-skill-${s.toLowerCase()}`}>{s}</span>)}
                </div>
              </div>
            </div>
          )}
          {activeTab === 'requirements' && (
            <div>
              <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-3">Requirements</h3>
              <ul className="space-y-3" data-testid="jp-requirements-list">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-600 dark:text-gray-300" data-testid={`jp-req-${i}`}>
                    <CheckCircle size={15} className="text-green-500 shrink-0 mt-0.5" />{req}
                  </li>
                ))}
              </ul>
              <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-3 mt-5">Benefits</h3>
              <div className="grid sm:grid-cols-2 gap-2" data-testid="jp-benefits-list">
                {job.benefits.map((b, i) => (
                  <div key={i} className="flex gap-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2" data-testid={`jp-benefit-${i}`}>
                    <Star size={13} className="text-yellow-400 shrink-0 mt-0.5 fill-current" />{b}
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'company' && (
            <div data-testid="jp-company-info">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{job.logo}</span>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">{job.company}</h3>
                  <p className="text-sm text-gray-500">View company profile</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {job.company} is a leading company in the tech industry known for innovation, strong engineering culture, and excellent work-life balance. They consistently rank among the best places to work.
              </p>
              <div className="grid grid-cols-3 gap-3 mt-4" data-testid="jp-company-stats">
                {[{ label: 'Employees', val: '500–1000' }, { label: 'Founded', val: '2015' }, { label: 'Location', val: job.location }].map(s => (
                  <div key={s.label} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500 mb-0.5">{s.label}</p>
                    <p className="font-bold text-sm text-gray-800 dark:text-gray-200">{s.val}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Apply ────────────────────────────────────────────────────────────────────
function ApplyForm({ job, profile, onSubmit, onBack }: {
  job: Job; profile: UserProfile | null;
  onSubmit: (appId: string) => void; onBack: () => void;
}) {
  const [form, setForm] = useState({
    firstName: profile?.firstName || '', lastName: profile?.lastName || '',
    email: profile?.email || '', phone: profile?.phone || '',
    coverLetter: '', linkedin: profile?.linkedin || '',
    noticePeriod: '2weeks', salary: profile?.salary || '',
    resumeFile: '', hearAbout: '',
  });
  const [loading, setLoading] = useState(false);
  const u = (f: string, v: string) => setForm(p => ({ ...p, [f]: v }));

  const submit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    const id = `APP${Date.now().toString().slice(-8)}`;
    setLoading(false);
    console.log(`[ClickAndVerify] JP: Applied to ${job.title} at ${job.company} — ref ${id}`);
    onSubmit(id);
  };

  return (
    <div className="max-w-lg mx-auto" data-testid="jp-apply-form">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-5" data-testid="jp-apply-back"><ArrowLeft size={14} />Back</button>
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-5 flex items-center gap-3" data-testid="jp-applying-for">
        <span className="text-2xl">{job.logo}</span>
        <div>
          <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">{job.title}</p>
          <p className="text-xs text-blue-600 dark:text-blue-400">{job.company} · {job.location}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 space-y-4">
        <h2 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2"><Send size={16} className="text-blue-500" />Your Application</h2>

        <div className="grid grid-cols-2 gap-4">
          {[['firstName', 'First Name', 'Jane'], ['lastName', 'Last Name', 'Smith']].map(([f, l, p]) => (
            <div key={f}>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{l} *</label>
              <input value={form[f as keyof typeof form]} onChange={e => u(f, e.target.value)} className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder={p} data-testid={`jp-apply-${f}`} />
            </div>
          ))}
        </div>

        {[
          { f: 'email', l: 'Email *', p: 'jane@example.com', t: 'email' },
          { f: 'phone', l: 'Phone', p: '+1 555 0100', t: 'tel' },
          { f: 'linkedin', l: 'LinkedIn Profile', p: 'linkedin.com/in/yourname', t: 'text' },
        ].map(({ f, l, p, t }) => (
          <div key={f}>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{l}</label>
            <input type={t} value={form[f as keyof typeof form]} onChange={e => u(f, e.target.value)} className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder={p} data-testid={`jp-apply-${f}`} />
          </div>
        ))}

        {/* Resume upload */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Resume / CV *</label>
          <label className="flex items-center gap-3 p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-blue-400 transition-colors" data-testid="jp-resume-upload-label">
            <Upload size={18} className="text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{form.resumeFile || 'Upload your resume'}</p>
              <p className="text-xs text-gray-400">PDF, DOC up to 5MB</p>
            </div>
            <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={e => u('resumeFile', e.target.files?.[0]?.name || '')} data-testid="jp-resume-file-input" />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Expected Salary</label>
            <input value={form.salary} onChange={e => u('salary', e.target.value)} className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="$120k" data-testid="jp-apply-salary" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Notice Period</label>
            <select value={form.noticePeriod} onChange={e => u('noticePeriod', e.target.value)} className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" data-testid="jp-apply-notice">
              <option value="immediately">Immediately</option>
              <option value="2weeks">2 Weeks</option>
              <option value="1month">1 Month</option>
              <option value="2months">2 Months</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Cover Letter</label>
          <textarea rows={5} value={form.coverLetter} onChange={e => u('coverLetter', e.target.value)} className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder={`Dear ${job.company} hiring team,\n\nI am excited to apply for the ${job.title} role…`} data-testid="jp-apply-cover-letter" maxLength={2000} />
          <p className="text-xs text-gray-400 text-right mt-0.5">{form.coverLetter.length}/2000</p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">How did you hear about us?</label>
          <select value={form.hearAbout} onChange={e => u('hearAbout', e.target.value)} className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" data-testid="jp-apply-hear-about">
            <option value="">Select…</option>
            <option value="job-portal">This Job Portal</option>
            <option value="linkedin">LinkedIn</option>
            <option value="referral">Employee Referral</option>
            <option value="google">Google Search</option>
            <option value="other">Other</option>
          </select>
        </div>

        <button onClick={submit} disabled={loading || !form.firstName || !form.email} className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-40 flex items-center justify-center gap-2 transition-colors" data-testid="jp-apply-submit" aria-busy={loading}>
          {loading ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> Submitting Application…</> : <><Send size={16} /> Submit Application</>}
        </button>
      </div>
    </div>
  );
}

// ─── Tracker ──────────────────────────────────────────────────────────────────
function Tracker({ applications, onWithdraw }: {
  applications: Application[];
  onWithdraw: (id: string) => void;
}) {
  const [filter, setFilter] = useState<Application['status'] | 'all'>('all');
  const filtered = filter === 'all' ? applications : applications.filter(a => a.status === filter);
  const PIPELINE = ['applied', 'screening', 'interview', 'offer'] as const;

  return (
    <div data-testid="jp-tracker">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-5 flex items-center gap-2"><BarChart3 size={20} className="text-indigo-500" /> Application Tracker</h2>

      {applications.length === 0 ? (
        <div className="text-center py-16 text-gray-400" data-testid="jp-tracker-empty">
          <Target size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No applications yet</p>
          <p className="text-sm mt-1">Apply to some jobs to start tracking here</p>
        </div>
      ) : (
        <>
          {/* Pipeline summary */}
          <div className="grid grid-cols-4 gap-2 mb-5" data-testid="jp-pipeline">
            {PIPELINE.map((s, i) => {
              const count = applications.filter(a => a.status === s).length;
              const cfg = STATUS_CONFIG[s];
              return (
                <div key={s} className={`text-center p-3 rounded-xl border ${cfg.bg} border-current/20`} data-testid={`jp-pipeline-${s}`}>
                  <p className={`text-2xl font-black ${cfg.color}`} data-testid={`jp-pipeline-count-${s}`}>{count}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{cfg.label}</p>
                </div>
              );
            })}
          </div>

          {/* Filter */}
          <div className="flex gap-2 flex-wrap mb-4" data-testid="jp-tracker-filters" role="group">
            {(['all', ...Object.keys(STATUS_CONFIG)] as const).map(s => (
              <button key={s} onClick={() => setFilter(s as typeof filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${filter === s ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                data-testid={`jp-tracker-filter-${s}`} aria-pressed={filter === s}>
                {s === 'all' ? `All (${applications.length})` : `${STATUS_CONFIG[s as Application['status']].label} (${applications.filter(a => a.status === s).length})`}
              </button>
            ))}
          </div>

          {/* Application cards */}
          <div className="space-y-3" data-testid="jp-applications-list">
            {filtered.map(app => {
              const cfg = STATUS_CONFIG[app.status];
              const stepIdx = PIPELINE.indexOf(app.status as typeof PIPELINE[number]);
              return (
                <div key={app.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5" data-testid={`jp-app-${app.id}`} data-status={app.status}>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{app.logo}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-bold text-gray-900 dark:text-gray-100 text-sm" data-testid={`jp-app-title-${app.id}`}>{app.jobTitle}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{app.company}</p>
                        </div>
                        <span className={`badge text-xs ${cfg.bg} ${cfg.color}`} data-testid={`jp-app-status-${app.id}`}>{cfg.label}</span>
                      </div>

                      {/* Progress pipeline */}
                      {app.status !== 'rejected' && app.status !== 'withdrawn' && (
                        <div className="flex items-center gap-1 mt-3" data-testid={`jp-app-pipeline-${app.id}`}>
                          {PIPELINE.map((s, i) => (
                            <div key={s} className="flex items-center gap-1 flex-1">
                              <div className={`w-full h-1.5 rounded-full transition-colors ${i <= stepIdx ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                              {i < PIPELINE.length - 1 && <div className={`w-2 h-2 rounded-full shrink-0 ${i < stepIdx ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'}`} />}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex gap-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1"><Calendar size={11} /> Applied {app.appliedDate}</span>
                          {app.interviewDate && <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-semibold"><Calendar size={11} /> Interview: {app.interviewDate}</span>}
                          {app.salary && <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold"><DollarSign size={11} />{app.salary}</span>}
                        </div>
                        {app.status !== 'withdrawn' && app.status !== 'rejected' && app.status !== 'offer' && (
                          <button onClick={() => onWithdraw(app.id)} className="text-xs text-red-500 hover:underline" data-testid={`jp-app-withdraw-${app.id}`}>Withdraw</button>
                        )}
                        {app.status === 'offer' && (
                          <span className="text-xs font-bold text-green-600 dark:text-green-400 animate-pulse" data-testid={`jp-app-offer-badge-${app.id}`}>🎉 Offer Received!</span>
                        )}
                      </div>
                      {app.nextStep && <p className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg px-2 py-1 mt-2 font-medium" data-testid={`jp-app-nextstep-${app.id}`}>Next: {app.nextStep}</p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function JobPortalFlow() {
  const [screen, setScreen] = useState<PortalScreen>('landing');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [applications, setApplications] = useState<Application[]>([
    { id: 'APP00001', jobId: 'j6', jobTitle: 'Performance Test Engineer', company: 'ScaleUp Inc', logo: '⚡', appliedDate: '2026-09-01', status: 'screening', nextStep: 'Technical phone screen on Sep 12' },
    { id: 'APP00002', jobId: 'j3', jobTitle: 'SDET – Mobile Testing', company: 'AppWorks', logo: '📱', appliedDate: '2026-08-28', status: 'interview', interviewDate: 'Sep 15, 2026', nextStep: 'Technical interview — prepare system design' },
    { id: 'APP00003', jobId: 'j7', jobTitle: 'Junior QA Engineer', company: 'GrowthCo', logo: '🌱', appliedDate: '2026-08-20', status: 'offer', salary: '$72k/yr', nextStep: 'Accept or decline by Sep 20' },
  ]);
  const [applyingTo, setApplyingTo] = useState<Job | null>(null);
  const [submittedApp, setSubmittedApp] = useState<string | null>(null);

  const toggleSave = (id: string) => {
    setSavedJobs(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const handleApply = (job: Job) => {
    setApplyingTo(job);
    setScreen('apply');
  };

  const handleAppSubmit = (appId: string) => {
    if (!applyingTo) return;
    const newApp: Application = {
      id: appId, jobId: applyingTo.id, jobTitle: applyingTo.title,
      company: applyingTo.company, logo: applyingTo.logo,
      appliedDate: new Date().toISOString().slice(0, 10), status: 'applied',
      nextStep: 'Application under review — expect response in 3–5 business days',
    };
    setApplications(prev => [newApp, ...prev]);
    setSubmittedApp(appId);
    setScreen('tracker');
  };

  const withdraw = (id: string) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: 'withdrawn' } : a));
    console.log(`[ClickAndVerify] JP: Application withdrawn: ${id}`);
  };

  const reset = () => {
    setScreen('landing'); setProfile(null); setSelectedJob(null);
    setSavedJobs(new Set()); setApplyingTo(null); setSubmittedApp(null);
    setApplications([
      { id: 'APP00001', jobId: 'j6', jobTitle: 'Performance Test Engineer', company: 'ScaleUp Inc', logo: '⚡', appliedDate: '2026-09-01', status: 'screening', nextStep: 'Technical phone screen on Sep 12' },
      { id: 'APP00002', jobId: 'j3', jobTitle: 'SDET – Mobile Testing', company: 'AppWorks', logo: '📱', appliedDate: '2026-08-28', status: 'interview', interviewDate: 'Sep 15, 2026', nextStep: 'Technical interview — prepare system design' },
      { id: 'APP00003', jobId: 'j7', jobTitle: 'Junior QA Engineer', company: 'GrowthCo', logo: '🌱', appliedDate: '2026-08-20', status: 'offer', salary: '$72k/yr', nextStep: 'Accept or decline by Sep 20' },
    ]);
  };

  const NAV_TABS: { screen: PortalScreen; label: string; icon: React.ReactNode }[] = [
    { screen: 'landing', label: 'Home', icon: <Globe size={14} /> },
    { screen: 'search', label: 'Jobs', icon: <Search size={14} /> },
    { screen: 'tracker', label: `Tracker (${applications.filter(a => a.status !== 'withdrawn').length})`, icon: <BarChart3 size={14} /> },
    { screen: profile ? 'profile' : 'register', label: profile ? 'Profile' : 'Create Profile', icon: <User size={14} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950" data-testid="job-portal-flow">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-14 z-30" data-testid="jp-header">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">💼</span>
            <span className="font-black text-lg text-gray-900 dark:text-gray-100" data-testid="jp-brand">TalentHub</span>
            <span className="badge bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 text-xs ml-1">Practice Portal</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={reset} className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 underline" data-testid="jp-reset-btn">Reset</button>
            {profile && (
              <div className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 rounded-full px-3 py-1.5 text-sm" data-testid="jp-profile-badge">
                <User size={14} /><span>{profile.firstName}</span>
              </div>
            )}
          </div>
        </div>
        {/* Nav */}
        <div className="max-w-4xl mx-auto px-4 flex gap-0 overflow-x-auto border-t border-gray-100 dark:border-gray-800" data-testid="jp-nav-tabs">
          {NAV_TABS.map(tab => (
            <button key={tab.screen} onClick={() => setScreen(tab.screen)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${screen === tab.screen || (screen === 'job-detail' && tab.screen === 'search') || (screen === 'apply' && tab.screen === 'search') ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
              data-testid={`jp-nav-${tab.screen.replace('/', '-')}`} aria-selected={screen === tab.screen}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* App submitted success banner */}
      {submittedApp && screen === 'tracker' && (
        <div className="bg-green-600 text-white text-center py-2.5 text-sm font-semibold animate-slide-in" data-testid="jp-applied-success-banner">
          🎉 Application submitted! Ref: {submittedApp}
          <button onClick={() => setSubmittedApp(null)} className="ml-3 text-green-200 hover:text-white" data-testid="jp-dismiss-banner"><X size={14} /></button>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-6">
        {screen === 'landing' && <Landing onRegister={() => setScreen('register')} onSearch={() => setScreen('search')} />}
        {screen === 'register' && <Register onComplete={p => { setProfile(p); setScreen('profile'); }} />}
        {screen === 'profile' && profile && (
          <div className="max-w-lg mx-auto" data-testid="jp-profile-view">
            <div className="bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-2xl p-6 mb-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-black">{profile.firstName[0]}{profile.lastName[0]}</div>
                <div>
                  <h2 className="text-xl font-black" data-testid="jp-profile-name">{profile.firstName} {profile.lastName}</h2>
                  <p className="text-blue-100" data-testid="jp-profile-title">{profile.title}</p>
                  <p className="text-xs text-blue-200 mt-0.5" data-testid="jp-profile-location">{profile.location}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-xs text-gray-400 mb-0.5">Email</p><p className="font-medium" data-testid="jp-profile-email">{profile.email}</p></div>
                <div><p className="text-xs text-gray-400 mb-0.5">Experience</p><p className="font-medium" data-testid="jp-profile-exp">{profile.experience} years</p></div>
                <div><p className="text-xs text-gray-400 mb-0.5">Expected Salary</p><p className="font-medium text-green-600 dark:text-green-400" data-testid="jp-profile-salary">{profile.salary}</p></div>
                <div><p className="text-xs text-gray-400 mb-0.5">Availability</p><p className="font-medium capitalize" data-testid="jp-profile-availability">{profile.availability}</p></div>
              </div>
              {profile.skills.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Skills</p>
                  <div className="flex flex-wrap gap-1.5" data-testid="jp-profile-skills">
                    {profile.skills.map(s => <span key={s} className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2.5 py-1 rounded-lg font-medium">{s}</span>)}
                  </div>
                </div>
              )}
              {profile.summary && <div><p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Summary</p><p className="text-sm text-gray-600 dark:text-gray-300" data-testid="jp-profile-summary">{profile.summary}</p></div>}
              <button onClick={() => setScreen('search')} className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors" data-testid="jp-find-jobs-btn">Find Matching Jobs →</button>
            </div>
          </div>
        )}
        {screen === 'search' && (
          <JobSearch savedJobs={savedJobs} applications={applications} onSave={toggleSave}
            onSelect={j => { setSelectedJob(j); setScreen('job-detail'); }}
            onApply={j => handleApply(j)} />
        )}
        {screen === 'job-detail' && selectedJob && (
          <JobDetail job={selectedJob} saved={savedJobs.has(selectedJob.id)}
            applied={applications.some(a => a.jobId === selectedJob.id && a.status !== 'withdrawn')}
            onSave={() => toggleSave(selectedJob.id)}
            onApply={() => handleApply(selectedJob)}
            onBack={() => setScreen('search')} />
        )}
        {screen === 'apply' && applyingTo && (
          <ApplyForm job={applyingTo} profile={profile} onSubmit={handleAppSubmit} onBack={() => setScreen('job-detail')} />
        )}
        {screen === 'tracker' && (
          <Tracker applications={applications} onWithdraw={withdraw} />
        )}
      </div>
    </div>
  );
}
