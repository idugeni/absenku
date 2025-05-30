
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, Calendar, Users, TrendingUp, Filter } from 'lucide-react';
import { useAppFirestore } from '@/hooks/useAppFirestore';


const Reports = () => {
  const { pegawai, events, attendance } = useAppFirestore();
  const [dateRange, setDateRange] = useState('this_month');
  const [eventFilter, setEventFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const getTotalStats = () => {
    return {
      totalPegawai: pegawai?.length || 0,
      totalEvents: events?.length || 0,
      totalAttendance: attendance?.length || 0,
      activeEvents: events?.filter(e => e.status === 'ongoing' || e.status === 'upcoming').length || 0
    };
  };

  const getAttendanceStats = () => {
    if (!attendance) return { present: 0, late: 0, absent: 0 };
    
    const present = attendance.filter(a => a.status === 'present').length;
    const late = attendance.filter(a => a.status === 'late').length;
    const absent = attendance.filter(a => a.status === 'absent').length;
    
    return { present, late, absent };
  };

  const getFilteredAttendance = () => {
    if (!attendance) return [];
    
    let filtered = attendance;
    
    if (eventFilter !== 'all') {
      filtered = filtered.filter(a => a.eventId === eventFilter);
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(a => a.status === statusFilter);
    }
    
    return filtered;
  };

  const stats = getTotalStats();
  const attendanceStats = getAttendanceStats();
  const filteredAttendance = getFilteredAttendance();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-100 text-green-800">Hadir</Badge>;
      case 'late':
        return <Badge className="bg-yellow-100 text-yellow-800">Terlambat</Badge>;
      case 'absent':
        return <Badge className="bg-red-100 text-red-800">Tidak Hadir</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleExportReport = () => {
    // Implementasi export laporan
    alert('Fitur export akan segera tersedia');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Laporan Kehadiran</h1>
          <p className="text-gray-600">Analisis dan statistik kehadiran pegawai pada berbagai kegiatan</p>
        </div>

        {/* Summary Statistics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pegawai</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPegawai}</div>
              <p className="text-xs text-muted-foreground">Pegawai terdaftar</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Kegiatan</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEvents}</div>
              <p className="text-xs text-muted-foreground">{stats.activeEvents} kegiatan aktif</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Kehadiran</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAttendance}</div>
              <p className="text-xs text-muted-foreground">Record kehadiran</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tingkat Kehadiran</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {attendance && attendance.length > 0 ? Math.round((attendanceStats.present / attendance.length) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">Rata-rata kehadiran</p>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Statistics */}
        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statistik Kehadiran</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Hadir</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${attendance && attendance.length > 0 ? (attendanceStats.present / attendance.length) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{attendanceStats.present}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Terlambat</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full" 
                        style={{ width: `${attendance && attendance.length > 0 ? (attendanceStats.late / attendance.length) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{attendanceStats.late}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Tidak Hadir</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${attendance && attendance.length > 0 ? (attendanceStats.absent / attendance.length) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{attendanceStats.absent}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Filter Laporan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Periode</label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="this_week">Minggu Ini</SelectItem>
                      <SelectItem value="this_month">Bulan Ini</SelectItem>
                      <SelectItem value="last_month">Bulan Lalu</SelectItem>
                      <SelectItem value="this_year">Tahun Ini</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Kegiatan</label>
                  <Select value={eventFilter} onValueChange={setEventFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Kegiatan</SelectItem>
                      {events && events.map(event => (
                        <SelectItem key={event.id} value={event.id!}>
                          {event.name || 'Unknown Event'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Status</SelectItem>
                      <SelectItem value="present">Hadir</SelectItem>
                      <SelectItem value="late">Terlambat</SelectItem>
                      <SelectItem value="absent">Tidak Hadir</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button onClick={handleExportReport} className="bg-blue-600 hover:bg-blue-700">
                  <Download className="h-4 w-4 mr-2" />
                  Export Laporan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Attendance Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Detail Kehadiran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pegawai</TableHead>
                    <TableHead>Kegiatan</TableHead>
                    <TableHead>Waktu Check-in</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Lokasi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAttendance.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        Tidak ada data kehadiran
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAttendance.map((record) => {
                      const pegawaiData = pegawai?.find(p => p.id === record.pegawaiId);
                      const eventData = events?.find(e => e.id === record.eventId);
                      
                      return (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">
                            {pegawaiData?.nama || 'Unknown'}
                          </TableCell>
                          <TableCell>{eventData?.name || 'Unknown'}</TableCell>
                          <TableCell>
                            {record.checkInTime?.toLocaleString?.('id-ID') || 'Unknown'}
                          </TableCell>
                          <TableCell>{getStatusBadge(record.status)}</TableCell>
                          <TableCell>{record.location || '-'}</TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
    </div>
  );
};

export default Reports;
