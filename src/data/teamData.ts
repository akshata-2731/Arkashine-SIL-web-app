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
    name: 'Akshata Patil',
    role: 'Co-Founder & CEO',
    title: 'Chief Executive Officer • SIL Program Director',
    email: 'akshata@arkashine.com',
    avatar: getInitialsAvatar('Akshata Patil', '#5C26C0'),
    badge: 'Co-Founder & CEO'
  },
  {
    id: 'ARK-TM-02',
    name: 'Dr. Vivek Saxena',
    role: 'Co-Founder & CTO',
    title: 'Chief Technology Officer • SoiLENZ Sensor Architect',
    email: 'vivek@arkashine.com',
    avatar: getInitialsAvatar('Dr. Vivek Saxena', '#0D9488'),
    badge: 'Co-Founder & CTO'
  },
  {
    id: 'ARK-TM-03',
    name: 'Dr. Sunita Deshmukh',
    role: 'Co-Founder & COO',
    title: 'Chief Operating Officer • Director of Academic Partnerships',
    email: 'sunita@arkashine.com',
    avatar: getInitialsAvatar('Dr. Sunita Deshmukh', '#D97706'),
    badge: 'Co-Founder & COO'
  }
];
