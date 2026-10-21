import { getInitialsAvatar } from '../utils/avatarUtils';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  title: string;
  email: string;
  avatar: string;
  badge: string;
}

export const ARKASHINE_TEAM: TeamMember[] = [
  {
    id: 'ARK-TM-01',
    name: 'Dr. Sudha R. Karbari',
    role: 'Co-Founder & CEO',
    title: 'Chief Executive Officer • SIL Program Director',
    email: 'sudha@arkashine.com',
    avatar: getInitialsAvatar('Dr. Sudha R. Karbari', '#5C26C0'),
    badge: 'Co-Founder & CEO'
  },
  {
    id: 'ARK-TM-02',
    name: 'Akshata Gulannavar',
    role: 'Software Developer',
    title: 'Software Developer • Agritech Platform Engineering',
    email: 'akshata@arkashine.com',
    avatar: getInitialsAvatar('Akshata Gulannavar', '#0D9488'),
    badge: 'Software Developer'
  },
  {
    id: 'ARK-TM-03',
    name: 'Arpita Kori',
    role: 'Software Engineer',
    title: 'Software Engineer • Cloud Systems & Diagnostics',
    email: 'arpita@arkashine.com',
    avatar: getInitialsAvatar('Arpita Kori', '#D97706'),
    badge: 'Software Engineer'
  }
];
