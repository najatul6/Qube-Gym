// Default mock data for qube-gym. Used to seed localStorage on first run.

const today = new Date();
const inDays = (n) => {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return d.toISOString();
};
const inDaysShort = (n) => {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

export const SEED = {
  // The demo account (also stored in the `users` array on init).
  user: {
    id: "u_001",
    name: "Alex Carter",
    email: "alex@qube-gym.com",
    password: "demo1234",
    phone: "+1 (415) 555-0182",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=faces",
    joinedAt: inDays(-120),
    membership: {
      plan: "pro",
      status: "active",
      billing: "monthly",
      startDate: inDays(-120),
      renewalDate: inDays(15),
      price: 49,
    },
    stats: {
      streak: 12,
      workoutsThisWeek: 4,
      totalWorkouts: 86,
      caloriesBurned: 41250,
      minutesTrained: 3120,
      goalCompletion: 78,
    },
    goals: [
      "Build muscle",
      "Improve conditioning",
      "Master boxing fundamentals",
    ],
  },

  classes: [
    {
      id: "c_hiit_inferno",
      name: "HIIT Inferno",
      category: "HIIT",
      description:
        "A 45-minute high-intensity interval furnace. Push your cardio ceiling with explosive circuits and zero rest.",
      intensity: "Extreme",
      duration: 45,
      capacity: 20,
      trainerId: "t_001",
      image:
        "https://images.unsplash.com/photo-1540497077203-4f0d619f5323?w=800&h=600&fit=crop",
      color: "from-orange-500/30 to-red-500/10",
      schedule: [
        { day: "Mon", time: "06:30" },
        { day: "Mon", time: "18:00" },
        { day: "Wed", time: "06:30" },
        { day: "Fri", time: "18:00" },
      ],
    },
    {
      id: "c_iron_strength",
      name: "Iron Strength",
      category: "Strength",
      description:
        "Progressive overload programming built around the big lifts. Move more weight, build dense, functional muscle.",
      intensity: "Hard",
      duration: 60,
      capacity: 16,
      trainerId: "t_002",
      image:
        "https://images.unsplash.com/photo-1534438327985-75483899c839?w=800&h=600&fit=crop",
      color: "from-neon/30 to-emerald-500/10",
      schedule: [
        { day: "Tue", time: "07:00" },
        { day: "Tue", time: "19:00" },
        { day: "Thu", time: "07:00" },
        { day: "Sat", time: "10:00" },
      ],
    },
    {
      id: "c_flow_yoga",
      name: "Flow Yoga",
      category: "Yoga",
      description:
        "Breath-led vinyasa flow to restore mobility, balance and focus. The perfect counterweight to heavy training days.",
      intensity: "Easy",
      duration: 50,
      capacity: 18,
      trainerId: "t_003",
      image:
        "https://images.unsplash.com/photo-1545205597-3d9d03683bb5?w=800&h=600&fit=crop",
      color: "from-violet-500/30 to-fuchsia-500/10",
      schedule: [
        { day: "Mon", time: "08:00" },
        { day: "Wed", time: "20:00" },
        { day: "Sun", time: "09:00" },
      ],
    },
    {
      id: "c_knockout_boxing",
      name: "Knockout Boxing",
      category: "Boxing",
      description:
        "Footwork, combinations and conditioning from the ground up. Hit the bags, sharpen reflexes, find your fight.",
      intensity: "Hard",
      duration: 55,
      capacity: 14,
      trainerId: "t_004",
      image:
        "https://images.unsplash.com/photo-1517438476312-57d3f6c5a76d?w=800&h=600&fit=crop",
      color: "from-amber-500/30 to-orange-500/10",
      schedule: [
        { day: "Tue", time: "18:30" },
        { day: "Thu", time: "18:30" },
        { day: "Sat", time: "11:30" },
      ],
    },
    {
      id: "c_power_cycle",
      name: "Power Cycle",
      category: "HIIT",
      description:
        "Studio cycling reimagined. Beat-matched sprints and climbs on a smart bike that tracks every watt.",
      intensity: "Hard",
      duration: 40,
      capacity: 24,
      trainerId: "t_001",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2d7b9de49?w=800&h=600&fit=crop",
      color: "from-cyan-500/30 to-blue-500/10",
      schedule: [
        { day: "Mon", time: "12:00" },
        { day: "Wed", time: "12:00" },
        { day: "Fri", time: "07:00" },
      ],
    },
    {
      id: "c_mobility_reset",
      name: "Mobility Reset",
      category: "Yoga",
      description:
        "A guided recovery session targeting joints, fascia and breath. Move better, recover faster, train longer.",
      intensity: "Easy",
      duration: 35,
      capacity: 20,
      trainerId: "t_003",
      image:
        "https://images.unsplash.com/photo-1599901860404-ec0f5b5e1f0b?w=800&h=600&fit=crop",
      color: "from-teal-500/30 to-emerald-500/10",
      schedule: [
        { day: "Thu", time: "20:00" },
        { day: "Sun", time: "10:30" },
      ],
    },
  ],

  trainers: [
    {
      id: "t_001",
      name: "Maya Reyes",
      role: "Head Conditioning Coach",
      bio: "Former national sprinter turned conditioning specialist. Maya builds engines — explosive, relentless, unstoppable.",
      specializations: ["HIIT", "Conditioning", "Cycling"],
      image:
        "https://images.unsplash.com/photo-1594381898411-8b7e5b5b5b5b?w=600&h=600&fit=crop&crop=faces",
      rating: 4.9,
      experience: 9,
      available: true,
      sessionsBooked: 312,
    },
    {
      id: "t_002",
      name: "Diego Santos",
      role: "Strength & Power Coach",
      bio: "IPF national lifter and S&C nerd. Diego programs for raw strength that transfers to every sport and every life.",
      specializations: ["Strength", "Powerlifting", "Olympic"],
      image:
        "https://images.unsplash.com/photo-1567013127520-2ac1a90d6f5b?w=600&h=600&fit=crop&crop=faces",
      rating: 4.8,
      experience: 11,
      available: true,
      sessionsBooked: 428,
    },
    {
      id: "t_003",
      name: "Priya Nair",
      role: "Mobility & Yoga Lead",
      bio: "500hr RYT with a movement-science lens. Priya blends breath, mobility and mindfulness into focused recovery.",
      specializations: ["Yoga", "Mobility", "Breathwork"],
      image:
        "https://images.unsplash.com/photo-1544005313-94df0d5f5c5c?w=600&h=600&fit=crop&crop=faces",
      rating: 5.0,
      experience: 8,
      available: true,
      sessionsBooked: 276,
    },
    {
      id: "t_004",
      name: "Marcus Bell",
      role: "Boxing & Combat Coach",
      bio: "Ex-pro amateur boxer with 14 years in the ring. Marcus teaches discipline, footwork and the science of the strike.",
      specializations: ["Boxing", "Footwork", "Conditioning"],
      image:
        "https://images.unsplash.com/photo-1568602471122-784295f94a9f?w=600&h=600&fit=crop&crop=faces",
      rating: 4.9,
      experience: 14,
      available: false,
      sessionsBooked: 503,
    },
  ],

  bookings: [
    {
      id: "b_001",
      userId: "u_001",
      classId: "c_hiit_inferno",
      className: "HIIT Inferno",
      category: "HIIT",
      trainerId: "t_001",
      trainerName: "Maya Reyes",
      date: inDaysShort(1),
      time: "18:00",
      duration: 45,
      status: "confirmed",
      createdAt: inDays(-2),
    },
    {
      id: "b_002",
      userId: "u_001",
      classId: "c_iron_strength",
      className: "Iron Strength",
      category: "Strength",
      trainerId: "t_002",
      trainerName: "Diego Santos",
      date: inDaysShort(3),
      time: "19:00",
      duration: 60,
      status: "confirmed",
      createdAt: inDays(-1),
    },
  ],

  trainerBookings: [
    {
      id: "tb_001",
      userId: "u_001",
      trainerId: "t_002",
      trainerName: "Diego Santos",
      date: inDaysShort(4),
      time: "10:00",
      focus: "Deadlift technique check",
      status: "pending",
      createdAt: inDays(-1),
    },
  ],

  messages: [],

  plans: [
    {
      id: "p_starter",
      name: "Starter",
      tagline: "Begin the journey",
      monthly: 19,
      annual: 190,
      features: [
        "Access to gym floor & lockers",
        "2 group classes / week",
        "Fitness assessment (quarterly)",
        "Mobile app access",
      ],
      highlight: false,
      cta: "Choose Starter",
    },
    {
      id: "p_pro",
      name: "Pro",
      tagline: "Most popular",
      monthly: 49,
      annual: 490,
      features: [
        "Unlimited group classes",
        "Full gym & recovery zone",
        "1 PT session / month",
        "Body composition tracking",
        "Nutrition starter guide",
      ],
      highlight: true,
      cta: "Choose Pro",
    },
    {
      id: "p_elite",
      name: "Elite",
      tagline: "All-in performance",
      monthly: 89,
      annual: 890,
      features: [
        "Everything in Pro",
        "4 PT sessions / month",
        "Custom training program",
        "Priority class booking",
        "Recovery & sauna access",
        "Guest passes (2/month)",
      ],
      highlight: false,
      cta: "Choose Elite",
    },
  ],

  testimonials: [
    {
      id: "ts_1",
      name: "Jordan M.",
      role: "Member · 1 yr",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43b?w=100&h=100&fit=crop&crop=faces",
      rating: 5,
      quote:
        "I've never stuck with a gym this long. The HIIT classes are brutal in the best way and the trainers actually know your name.",
    },
    {
      id: "ts_2",
      name: "Sofia L.",
      role: "Member · 8 mo",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
      rating: 5,
      quote:
        "The booking app is so smooth — I plan my whole week from my phone. Flow Yoga after Iron Strength is the perfect combo.",
    },
    {
      id: "ts_3",
      name: "Kwame A.",
      role: "Member · 2 yr",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
      rating: 5,
      quote:
        "Marcus turned my boxing from flailing to fluent. The energy here is electric — you walk in and you just want to work.",
    },
    {
      id: "ts_4",
      name: "Elena R.",
      role: "Member · 6 mo",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d35?w=100&h=100&fit=crop&crop=faces",
      rating: 5,
      quote:
        "Cleanest gym I've trained at. Dark, sharp, motivating. The dashboard keeps my streak alive and my ego in check.",
    },
  ],

  faqs: [
    {
      id: "f_1",
      q: "Can I try qube-gym before committing?",
      a: "Yes. Every new member gets one free trial class. Hit 'Book Free Trial' on the home page, pick a slot, and we'll see you on the floor.",
    },
    {
      id: "f_2",
      q: "Can I freeze or change my membership?",
      a: "Absolutely. You can upgrade, downgrade or freeze your plan anytime from the member dashboard. Annual members get one free freeze month per year.",
    },
    {
      id: "f_3",
      q: "What if I miss a booked class?",
      a: "You can reschedule or cancel any booking up to 2 hours before start time from your dashboard with no penalty. Late cancellations count as a session.",
    },
    {
      id: "f_4",
      q: "Do you offer personal training?",
      a: "Yes. Pro members get 1 PT session monthly included; Elite members get 4. You can also book extra 1-on-1 sessions with any trainer directly from the Trainers page.",
    },
    {
      id: "f_5",
      q: "Is there parking and showers?",
      a: "We have secure underground parking and full locker rooms with rain showers, sauna (Elite) and a recovery zone open all opening hours.",
    },
  ],

  stats: [
    { id: "s_1", label: "Active members", value: 3200, suffix: "+" },
    { id: "s_2", label: "Weekly classes", value: 48, suffix: "" },
    { id: "s_3", label: "Expert trainers", value: 24, suffix: "" },
    { id: "s_4", label: "Member satisfaction", value: 98, suffix: "%" },
  ],
};

export default SEED;
