import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import Empty from '@/components/Empty';
import CustomerDashboardLayout from '@/layouts/CustomerDashboardLayout';
import { useGetUserAddressesQuery } from '@/redux/api/apiSlice';

const TableRowSkeleton = () => (
  <TableRow>
    <TableCell>
      <Skeleton className='h-4 w-24' />
    </TableCell>
    <TableCell>
      <Skeleton className='h-4 w-32' />
    </TableCell>
    <TableCell>
      <Skeleton className='h-4 w-20' />
    </TableCell>
    <TableCell>
      <Skeleton className='h-4 w-32' />
    </TableCell>
  </TableRow>
);

const ErrorAlert = ({ message }: { message: string }) => (
  <Alert variant='destructive' className='mb-6'>
    <AlertCircle className='h-4 w-4' />
    <AlertDescription>{message}</AlertDescription>
  </Alert>
);

const Addresses = () => {
  const { data: response, error, isLoading } = useGetUserAddressesQuery({});

  const addresses = response?.data;

  return (
    <CustomerDashboardLayout>
      <h1 className='text-2xl font-[sofia-bold] tracking-tight'>Saved Addresses</h1>

      {error ? (
        <ErrorAlert message={'error' in error ? error.error : 'Failed to load addresses. Please try again later.'} />
      ) : (
        <Card className='mt-4'>
          <CardContent>
            {isLoading ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Address</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Postal Code</TableHead>
                    <TableHead>Country</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(5)].map((_, index) => (
                    <TableRowSkeleton key={index} />
                  ))}
                </TableBody>
              </Table>
            ) : addresses?.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Address</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Postal Code</TableHead>
                    <TableHead>Country</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {addresses.map((address: Address) => (
                    <TableRow key={address.id}>
                      <TableCell>{address.addressLine1}</TableCell>
                      <TableCell>{address.city}</TableCell>
                      <TableCell>{address.postalCode}</TableCell>
                      <TableCell>{address.country}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className='flex flex-1 items-center justify-center'>
                <Empty description='No addresses found' />
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </CustomerDashboardLayout>
  );
};

export default Addresses;
