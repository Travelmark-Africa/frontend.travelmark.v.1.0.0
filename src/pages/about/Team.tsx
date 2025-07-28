import { teamMembers } from '@/constants';

const Team = () => {
  // Determine appropriate grid classes based on number of members
  const getGridClasses = () => {
    const count = teamMembers.length;

    let classes = 'grid gap-8 mb-16 ';

    if (count <= 3) {
      classes += 'grid-cols-1 md:grid-cols-3 justify-items-center mx-auto max-w-4xl';
    } else if (count <= 4) {
      classes += 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-items-center mx-auto max-w-5xl';
    } else {
      classes += 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5 max-w-full';
    }

    return classes;
  };

  return (
    <div className='w-full bg-white py-16 px-4'>
      <div className='text-center mb-16'>
        <h1 className='text-4xl font-bold mb-3'>
          Meet the <span className='text-secondary'>TravelMark Africa Team</span>
        </h1>
        <p className='text-lg text-gray-700 max-w-2xl mx-auto'>
          Our diverse team of consultants, strategists, and coordinators is dedicated to shaping Africa’s presence in
          global business tourism.
        </p>
      </div>

      <div className={getGridClasses()}>
        {teamMembers.map(member => (
          <div key={member.id} className='flex flex-col items-center text-center'>
            <div className='mb-4 w-48 h-48 rounded-full overflow-hidden border-4 border-secondary/10 bg-[#FFF0E6]'>
              <img src={member.image} alt={member.name} className='w-full h-full object-cover' />
            </div>
            <h3 className='text-xl font-bold mb-1'>{member.name}</h3>
            <p className='text-gray-600 text-sm'>{member.position}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
