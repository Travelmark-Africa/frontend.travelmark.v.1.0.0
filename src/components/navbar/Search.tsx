import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, CalendarIcon } from 'lucide-react';
import { differenceInDays, format } from 'date-fns';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useGetCountriesQuery } from '@/redux/api/apiSlice';

interface Country {
  id: string;
  name: string;
}

interface TourismTag {
  id: string;
  label: string;
}

interface SearchParams {
  country?: string;
  minPrice?: string;
  maxPrice?: string;
  tag?: string;
  startDate?: string;
  endDate?: string;
}

const tourismTags: TourismTag[] = [
  { id: 'popular', label: 'Most Popular' },
  { id: 'beach', label: 'Beach' },
  { id: 'mountain', label: 'Mountain' },
  { id: 'cultural', label: 'Cultural' },
  { id: 'adventure', label: 'Adventure' },
  { id: 'wildlife', label: 'Wildlife' },
  { id: 'historical', label: 'Historical' },
  { id: 'food', label: 'Food & Cuisine' },
];

const Search = () => {
  const navigate = useNavigate();
  const { data: countries, isLoading } = useGetCountriesQuery({});

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [country, setCountry] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [showPriceRange, setShowPriceRange] = useState<boolean>(false);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');

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

  return (
    <>
      <div
        onClick={handleOpen}
        className='border w-full md:w-auto py-1 rounded-full shadow-sm hover:shadow-md transition cursor-pointer bg-white'
      >
        <div className='flex flex-row items-center justify-between px-4 md:pr-2 md:pl-5'>
          <div className='text-sm font-semibold'>{selectedCountryName}</div>
          <div className='pl-5 hidden sm:block'>|</div>
          <div className='hidden sm:block text-sm font-semibold px-6 flex-1 text-center'>{durationLabel}</div>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-primary rounded-full text-white'>
              <SearchIcon size={18} />
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className='sm:max-w-xl mx-4 md:mx-auto'>
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
              <Label htmlFor='tag' className='text-sm font-medium'>
                Destination Type
              </Label>
              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select a tag' />
                </SelectTrigger>
                <SelectContent>
                  {tourismTags.map((tag: TourismTag) => (
                    <SelectItem key={tag.id} value={tag.id}>
                      {tag.label}
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
