import {
  FaSuitcaseRolling,
  FaCalendarCheck,
  FaBug,
  FaPoundSign,
  FaFileContract,
  FaHandshakeSlash
} from 'react-icons/fa';
import Wrapper from '../assets/wrappers/StatsContainer';
import StatsCard from './StatsCard';

const StatsContainer = ({ defaultStats }) => {
  const stats = [
    {
      title: 'pending applications',
      count: defaultStats?.pending || 0,
      icon: <FaSuitcaseRolling />,
      color: '#f59e0b',
      bcg: '#fef3c7'
    },
    {
      title: 'interviews scheduled',
      count: defaultStats?.interview || 0,
      icon: <FaCalendarCheck />,
      color: '#647acb',
      bcg: '#e0e8f9'
    },
    {
      title: 'jobs declined',
      count: defaultStats?.declined || 0,
      icon: <FaHandshakeSlash />,
      color: '#d66a6a',
      bcg: '#ffeeee'
    },
    {
      title: 'offers sent',
      count: defaultStats?.offer || 0,
      icon: <FaPoundSign />,
      color: 'cyan',
      bcg: '#fcf9c7'
    },
    {
      title: 'offers accepted',
      count: defaultStats?.hired || 0,
      icon: <FaFileContract />,
      color: 'green',
      bcg: '#b3a478'
    }
  ];

  return (
    <Wrapper>
      {stats.map(stat => {
        return <StatsCard key={stat.title} {...stat} />;
      })}
    </Wrapper>
  );
};

export default StatsContainer;
