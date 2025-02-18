import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Container from '@/components/Container';
import Navbar from '@/components/navbar/Navbar';
import DestinationCard from '@/components/destinations/DestinationCard';
import DestinationCardSkeleton from '@/components/destinations/DestinationCardSkeleton';
import Empty from '@/components/Empty';
import { useSearchDestinationsQuery } from '@/redux/api/apiSlice';

// Define interfaces for type safety
interface SearchParams {
  country?: string;
  tag?: string;
  minPrice?: string;
  maxPrice?: string;
  [key: string]: string | undefined;
}

interface SearchResponse {
  data: {
    destinations: Destination[];
    totalCount: number;
  };
}

// Define custom error type to avoid using 'any'
interface ApiError {
  error: string;
  [key: string]: unknown;
}

const SearchPage: React.FC = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useState<SearchParams>({});

  // Get search parameters from URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const params: SearchParams = {};

    // Extract all parameters
    for (const [key, value] of queryParams.entries()) {
      params[key] = value;
    }

    setSearchParams(params);
  }, [location.search]);

  // Use the search destinations query with the extracted parameters
  const {
    data: searchResults,
    isLoading,
    isError,
    error,
  } = useSearchDestinationsQuery(searchParams) as {
    data?: SearchResponse;
    isLoading: boolean;
    isError: boolean;
    error: ApiError | unknown;
  };

  // Format search parameters for display
  const formatSearchCriteria = (): string => {
    const parts: string[] = [];
    if (searchParams.country) parts.push(`in ${searchParams.country}`);
    if (searchParams.tag) parts.push(`tagged as ${searchParams.tag}`);
    if (searchParams.minPrice && searchParams.maxPrice) {
      parts.push(`between $${searchParams.minPrice} and $${searchParams.maxPrice}`);
    } else if (searchParams.minPrice) {
      parts.push(`above $${searchParams.minPrice}`);
    } else if (searchParams.maxPrice) {
      parts.push(`below $${searchParams.maxPrice}`);
    }

    return parts.length > 0 ? parts.join(', ') : 'matching your criteria';
  };

  // Render destination content based on state
  const renderDestinationContent = () => {
    if (isLoading) {
      // Only show skeletons for cards, keep header visible
      const skeletonCards = Array(8)
        .fill(0)
        .map((_, index) => <DestinationCardSkeleton key={`skeleton-${index}`} />);

      return (
        <div
          className='
          grid 
          grid-cols-1
          sm:grid-cols-2 
          md:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
          2xl:grid-cols-4
          gap-8
        '
        >
          {skeletonCards}
        </div>
      );
    } else if (isError) {
      return (
        <div className='text-center text-red-500 mt-8'>
          Error loading search results:{' '}
          {error && typeof error === 'object' && 'error' in error
            ? (error as ApiError).error
            : 'Failed to load destinations. Please try again later.'}
        </div>
      );
    } else if (!searchResults?.data?.destinations || searchResults.data.destinations.length === 0) {
      return <Empty description='No destinations found, Try adjusting your search criteria to find more results' />;
    } else {
      // Render actual destination cards
      return (
        <div
          className='
          grid 
          grid-cols-1
          sm:grid-cols-2 
          md:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
          2xl:grid-cols-4
          gap-8
        '
        >
          {searchResults.data.destinations.map((destination: Destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>
      );
    }
  };

  // Calculate the total count and destinations count safely
  const destinationsCount = searchResults?.data?.destinations?.length || 0;
  const totalCount = searchResults?.data?.totalCount || 0;

  return (
    <>
      <Navbar />
      <Container>
        {/* Header Section - Always visible */}
        <div className='text-left space-y-2 pb-8 pt-32'>
          <h4 className='text-3xl font-bold'>Search Results</h4>
          <p className='text-gray-600 text-md'>Showing destinations {formatSearchCriteria()}</p>

          {/* Stats Section - Show loading indicator if needed */}
          <div className='flex items-center space-x-4 text-sm text-gray-600 pt-2'>
            {isLoading ? (
              <span>Searching destinations...</span>
            ) : isError ? (
              <span className='text-red-400'>Error loading results</span>
            ) : (
              <>
                <span className='font-semibold'>
                  {destinationsCount} destination{destinationsCount !== 1 ? 's' : ''} found
                </span>
                {totalCount > 0 && (
                  <>
                    <span>|</span>
                    <span>
                      Total of {totalCount} destination{totalCount !== 1 ? 's' : ''}
                    </span>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Render destination content based on state */}
        {renderDestinationContent()}
      </Container>
    </>
  );
};

export default SearchPage;
