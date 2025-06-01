import React from 'react';
import { Attendance } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

interface EventAttendanceListProps {
  attendance: Attendance[];
  loading: boolean;
}

const EventAttendanceList: React.FC<EventAttendanceListProps> = ({ attendance, loading }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daftar Kehadiran</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Memuat data kehadiran...</p>
        </CardContent>
      </Card>
    );
  }

  if (attendance.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daftar Kehadiran</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Belum ada data kehadiran untuk kegiatan ini.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='mt-6'>
      <CardHeader>
        <CardTitle>Daftar Kehadiran</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Pegawai</TableHead>
              <TableHead>NIP</TableHead>
              <TableHead>Waktu Check-in</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendance.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.employeeName}</TableCell>
                <TableCell>{item.nip}</TableCell>
                <TableCell>{format(item.checkInTime, 'dd MMM yyyy HH:mm', { locale: localeID })}</TableCell>
                <TableCell>
                  <Badge
                    className={`
                      ${item.status === 'present' && 'bg-green-100 text-green-800'}
                      ${item.status === 'late' && 'bg-yellow-100 text-yellow-800'}
                      ${item.status === 'absent' && 'bg-red-100 text-red-800'}
                      px-2 py-1 text-xs font-medium
                    `}
                  >
                    {item.status === 'present' && 'Hadir'}
                    {item.status === 'late' && 'Terlambat'}
                    {item.status === 'absent' && 'Tidak Hadir'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default EventAttendanceList;