import { Skeleton } from '@/components/ui/skeleton';
import { useGetTeamMembersQuery } from '@/hooks/useTeamMembers';
import { Linkedin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Team = () => {
  const { data: teamData, isLoading, isError, error } = useGetTeamMembersQuery();

  const teamMembers = teamData?.data || [];

  const getGridClasses = (count: number) => {
    let classes = 'grid gap-8 mb-16 justify-items-center mx-auto ';

    if (count === 1) {
      classes += 'grid-cols-1 max-w-xs';
    } else if (count === 2) {
      classes += 'grid-cols-1 md:grid-cols-2 max-w-2xl';
    } else if (count === 3) {
      classes += 'grid-cols-1 md:grid-cols-3 max-w-4xl';
    } else if (count === 4) {
      classes += 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-w-5xl';
    } else {
      classes += 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-w-5xl';
    }

    return classes;
  };

  if (isLoading) {
    return (
      <div className='w-full bg-secondary/10 py-16 px-4'>
        <div className='text-center mb-16'>
          <h1 className='text-4xl font-bold mb-3'>
            Meet the <span className='text-secondary'>TravelMark Africa Team</span>
          </h1>
          <p className='text-lg text-gray-700 max-w-2xl mx-auto'>
            Our diverse team of consultants, strategists, and coordinators is dedicated to shaping Africa's presence in
            global business tourism.
          </p>
        </div>

        <div className='grid gap-8 mb-16 grid-cols-1 md:grid-cols-3 justify-items-center mx-auto max-w-4xl'>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className='flex flex-col items-center text-center'>
              <div className='mb-4 w-48 h-48 rounded-full overflow-hidden border-4 border-secondary/10 bg-[#FFF0E6]'>
                <Skeleton className='w-full h-full rounded-full' />
              </div>
              <Skeleton className='h-6 w-32 mb-1' />
              <Skeleton className='h-4 w-24' />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='w-full bg-secondary/10 py-16 px-4'>
        <div className='text-center mb-16'>
          <h1 className='text-4xl font-bold mb-3'>
            Meet the <span className='text-secondary'>TravelMark Africa Team</span>
          </h1>
          <p className='text-lg text-gray-700 max-w-2xl mx-auto'>
            Our diverse team of consultants, strategists, and coordinators is dedicated to shaping Africa's presence in
            global business tourism.
          </p>
        </div>

        <div className='flex items-center justify-center h-60'>
          <div className='text-center'>
            <Users className='w-16 h-16 mx-auto text-red-400 mb-4' />
            <p className='text-gray-500'>{error instanceof Error ? error.message : 'Unable to load team members'}</p>
          </div>
        </div>
      </div>
    );
  }

  if (teamMembers.length === 0) {
    return (
      <div className='w-full bg-secondary/10 py-16 px-4'>
        <div className='text-center mb-16'>
          <h1 className='text-4xl font-bold mb-3'>
            Meet the <span className='text-secondary'>TravelMark Africa Team</span>
          </h1>
          <p className='text-lg text-gray-700 max-w-2xl mx-auto'>
            Our diverse team of consultants, strategists, and coordinators is dedicated to shaping Africa's presence in
            global business tourism.
          </p>
        </div>

        <div className='flex items-center justify-center h-60'>
          <div className='text-center'>
            <Users className='w-16 h-16 mx-auto text-gray-400 mb-4' />
            <p className='text-gray-500'>No team members available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full bg-secondary/10 py-16 px-4'>
      <div className='text-center mb-16'>
        <h1 className='text-4xl font-bold mb-3'>
          Meet the <span className='text-secondary'>TravelMark Africa Team</span>
        </h1>
        <p className='text-lg text-gray-700 max-w-2xl mx-auto'>
          Our diverse team of consultants, strategists, and coordinators is dedicated to shaping Africa's presence in
          global business tourism.
        </p>
      </div>

      <div className={getGridClasses(teamMembers.length)}>
        {teamMembers.map((member, index) => (
          <div key={member.$id || index} className='flex flex-col items-center text-center'>
            <div className='mb-4 w-48 h-48 rounded-full overflow-hidden border-4 border-secondary/10 bg-[#FFF0E6]'>
              <img src={member.profileImageUrl} alt={member.fullName} className='w-full h-full object-cover' />
            </div>
            <h3 className='text-xl font-bold mb-1'>{member.fullName}</h3>
            <p className='text-gray-600 text-sm'>{member.position}</p>
            <Link to={`${member.bio}`} className='text-center mt-2' target='_blank'>
              <Linkedin className='text-blue-600 hover:text-blue-800 transition-all duration-500' />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
