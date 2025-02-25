import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search as SearchIcon, CalendarIcon } from 'lucide-react';
import { differenceInDays, format, parse } from 'date-fns';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useGetCountriesQuery, useGetTagsQuery } from '@/redux/api/apiSlice';

interface Country {
  id: string;
  name: string;
}

interface TourismTag {
  id: string;
  name: string;
}

interface SearchParams {
  country?: string;
  minPrice?: string;
  maxPrice?: string;
  tag?: string;
  startDate?: string;
  endDate?: string;
}

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: countries, isLoading: isLoadingCountries } = useGetCountriesQuery({});
  const { data: tags, isLoading: isLoadingTags } = useGetTagsQuery({});

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [country, setCountry] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [showPriceRange, setShowPriceRange] = useState<boolean>(false);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');

  // Parse URL parameters on initial load
  useEffect(() => {
    if (countries?.data && tags?.data) {
      const params = new URLSearchParams(location.search);

      // Set country based on name from URL
      const countryParam = params.get('country');
      if (countryParam) {
        const foundCountry = countries.data.find((c: Country) => c.name.toLowerCase() === countryParam.toLowerCase());
        if (foundCountry) {
          setCountry(foundCountry.id);
        }
      }

      // Set price range if either min or max exists
      const minPriceParam = params.get('minPrice');
      const maxPriceParam = params.get('maxPrice');
      if (minPriceParam || maxPriceParam) {
        setShowPriceRange(true);
        if (minPriceParam) setMinPrice(minPriceParam);
        if (maxPriceParam) setMaxPrice(maxPriceParam);
      }

      // Set tourism tag
      const tagParam = params.get('tag');
      if (tagParam) {
        setSelectedTag(tagParam);
      }

      // Set date range
      const startDateParam = params.get('startDate');
      const endDateParam = params.get('endDate');
      if (startDateParam) {
        setStartDate(parse(startDateParam, 'yyyy-MM-dd', new Date()));
      }
      if (endDateParam) {
        setEndDate(parse(endDateParam, 'yyyy-MM-dd', new Date()));
      }
    }
  }, [location.search, countries, tags]);

  const durationLabel = useMemo(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diff = differenceInDays(end, start);
      return diff <= 0 ? '1 Day' : `${diff} Days`;
    }
    return 'Any Week';
  }, [startDate, endDate]);

  const selectedCountryName = useMemo(() => {
    if (country && countries?.data) {
      const selectedCountry = countries.data.find((c: Country) => c.id === country);
      return selectedCountry?.name;
    }
    return 'Anywhere';
  }, [country, countries]);

  const handleOpen = (): void => setIsOpen(true);
  const handleClose = (): void => setIsOpen(false);

  const constructSearchParams = (): SearchParams => {
    const params: SearchParams = {};

    if (country && countries?.data) {
      const selectedCountry = countries.data.find((c: Country) => c.id === country);
      if (selectedCountry) {
        params.country = selectedCountry.name;
      }
    }
    if (showPriceRange && minPrice) params.minPrice = minPrice;
    if (showPriceRange && maxPrice) params.maxPrice = maxPrice;
    if (selectedTag) params.tag = selectedTag;
    if (startDate) params.startDate = format(startDate, 'yyyy-MM-dd');
    if (endDate) params.endDate = format(endDate, 'yyyy-MM-dd');

    return params;
  };

  const handleSearch = (): void => {
    const searchParams = new URLSearchParams();
    const params = constructSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    navigate(`/search?${searchParams.toString()}`);
    handleClose();
  };

  // Function to clear the tag selection
  const clearTagSelection = () => {
    setSelectedTag('');
  };

  const isLoading = isLoadingCountries || isLoadingTags;

  return (
    <>
      <div
        onClick={handleOpen}
        className='border w-full md:w-auto py-1 rounded-full shadow-sm hover:shadow-md transition cursor-pointer bg-transparent'
      >
        <div className='flex flex-row items-center justify-between px-3 sm:px-4 md:px-5'>
          <div className='text-sm font-semibold truncate max-w-[100px] sm:max-w-[150px]'>{selectedCountryName}</div>
          <div className='hidden sm:flex items-center justify-center'>
            <div className='mx-2 text-gray-300'>|</div>
            <div className='text-sm font-semibold px-2 sm:px-3 md:px-4 text-center truncate max-w-[100px] sm:max-w-[150px]'>
              {durationLabel}
            </div>
          </div>
          <div className='p-2 bg-primary rounded-full text-white flex-shrink-0 ml-2'>
            <SearchIcon size={18} />
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent>
          <h4 className='text-xl font-semibold font-body'>Search Properties</h4>
          <div className='grid gap-6 py-2'>
            <div className='space-y-2'>
              <Label htmlFor='country' className='text-sm font-medium'>
                Country
              </Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select a country' />
                </SelectTrigger>
                <SelectContent>
                  {countries?.data?.map((country: Country) => (
                    <SelectItem key={country.id} value={country.id}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label className='text-sm font-medium'>Date Range</Label>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      className='w-full justify-start text-left font-normal rounded-md shadow-none py-5 hover:bg-transparent focus:ring-1 focus:ring-offset-1 focus:ring-ring/30'
                    >
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {startDate ? format(startDate, 'PPP') : 'Pick start date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0'>
                    <Calendar mode='single' selected={startDate} onSelect={setStartDate} initialFocus />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      className='w-full justify-start text-left font-normal rounded-md shadow-none py-5 hover:bg-transparent focus:ring-1 focus:ring-offset-1 focus:ring-ring/30'
                    >
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {endDate ? format(endDate, 'PPP') : 'Pick end date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0'>
                    <Calendar mode='single' selected={endDate} onSelect={setEndDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className='space-y-4'>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='showPrice'
                  checked={showPriceRange}
                  onCheckedChange={(checked: boolean) => setShowPriceRange(checked)}
                  className='h-4 w-4'
                />
                <Label htmlFor='showPrice' className='text-sm font-medium'>
                  Show destinations with price range
                </Label>
              </div>

              {showPriceRange && (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='minPrice' className='text-sm font-medium'>
                      Min Price
                    </Label>
                    <Input
                      id='minPrice'
                      type='number'
                      value={minPrice}
                      onChange={e => setMinPrice(e.target.value)}
                      className='w-full'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='maxPrice' className='text-sm font-medium'>
                      Max Price
                    </Label>
                    <Input
                      id='maxPrice'
                      type='number'
                      value={maxPrice}
                      onChange={e => setMaxPrice(e.target.value)}
                      className='w-full'
                    />
                  </div>
                </div>
              )}
            </div>

            <div className='space-y-2'>
              <div className='flex justify-between items-center'>
                <Label htmlFor='tag' className='text-sm font-medium'>
                  Destination Type
                </Label>
                {selectedTag && (
                  <Button
                    variant='ghost'
                    onClick={clearTagSelection}
                    className='text-xs h-6 px-2 py-0 text-accent hover:text-white bg-accent/10'
                  >
                    Clear
                  </Button>
                )}
              </div>
              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select a tag (optional)' />
                </SelectTrigger>
                <SelectContent>
                  {tags?.data?.map((tag: TourismTag) => (
                    <SelectItem key={tag.id} value={tag.name}>
                      {tag.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className='flex justify-end'>
            <Button
              onClick={handleSearch}
              className='bg-primary hover:bg-primary/90 cursor-pointer text-white px-6 py-5'
              disabled={isLoading}
            >
              Search
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Search;
