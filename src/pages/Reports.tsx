import { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, Calendar, Users, TrendingUp } from 'lucide-react';
import { useAppFirestore } from '@/hooks/useAppFirestore';
import { useToast } from '@/components/ui/use-toast';

const ATTENDANCE_STATUS = {
  PRESENT: 'present',

  ABSENT: 'absent',
} as const;

type AttendanceStatusType = typeof ATTENDANCE_STATUS[keyof typeof ATTENDANCE_STATUS];

const EVENT_STATUS = {
  ONGOING: 'ongoing',
  UPCOMING: 'upcoming',
} as const;

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon: IconComponent }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <IconComponent className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

interface AttendanceProgressBarProps {
  label: string;
  value: number;
  total: number;
  colorClass: string;
}

const AttendanceProgressBar: React.FC<AttendanceProgressBarProps> = ({ label, value, total, colorClass }) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm">{label}</span>
      <div className="flex items-center space-x-2">
        <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`${colorClass} h-2 rounded-full`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm font-medium">{value}</span>
      </div>
    </div>
  );
};

const Reports = () => {
  const { pegawai, events, attendance } = useAppFirestore();
  const [dateRange, setDateRange] = useState<string>('this_month');
  const [eventFilter, setEventFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  const stats = useMemo(() => {
    return {
      totalPegawai: pegawai?.length || 0,
      totalEvents: events?.length || 0,
      totalAttendance: attendance?.length || 0,
      activeEvents: events?.filter(e => e.status === EVENT_STATUS.ONGOING || e.status === EVENT_STATUS.UPCOMING).length || 0
    };
  }, [pegawai, events, attendance]);

  const attendanceStats = useMemo(() => {
    if (!attendance?.length) return { present: 0, absent: 0, total: 0 };
    
    const present = attendance.filter(a => a.status === ATTENDANCE_STATUS.PRESENT).length;
    const absent = attendance.filter(a => a.status === ATTENDANCE_STATUS.ABSENT).length;
    
    return { present, absent, total: attendance.length };
  }, [attendance]);

  const filteredAttendance = useMemo(() => {
    if (!attendance) return [];
    
    let filtered = [...attendance];
    
    if (eventFilter !== 'all') {
      filtered = filtered.filter(a => a.eventId === eventFilter);
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(a => a.status === statusFilter);
    }
    
    return filtered;
  }, [attendance, eventFilter, statusFilter]);

  const statusBadgeConfig: Record<AttendanceStatusType, { className: string; label: string }> = {
    [ATTENDANCE_STATUS.PRESENT]: { className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", label: "Hadir" },
  
    [ATTENDANCE_STATUS.ABSENT]: { className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", label: "Tidak Hadir" },
  };

  const getStatusBadge = (status: string) => {
    const config = statusBadgeConfig[status as AttendanceStatusType];
    if (!config) return <Badge variant="outline">Unknown</Badge>;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const handleExportReport = useCallback(() => {
    toast({
      title: "Export Laporan",
      description: "Fitur export akan segera tersedia dengan fungsionalitas penuh.",
      variant: "default",
    });
  }, [toast]);

  const formatCheckInTime = (date?: Date | { toDate: () => Date }): string => {
    if (!date) return 'Unknown';
    const dateObject = date instanceof Date ? date : date?.toDate?.();
    if (!dateObject) return 'Invalid Date';
    
    try {
      return dateObject.toLocaleString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: `Error formatting date: ${error.message}`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: `An unknown error occurred while formatting date.`,
          variant: "destructive",
        });
      }
      return "Invalid Date";
    }
  };

  if (!pegawai || !events || !attendance) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8 text-center">
        <p className="text-gray-600 dark:text-gray-400">Memuat data laporan...</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-6 py-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Laporan Kehadiran</h1>
        <p className="text-gray-600 dark:text-gray-400">Analisis dan statistik kehadiran pegawai pada berbagai kegiatan.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard title="Total Pegawai" value={stats.totalPegawai} description="Pegawai terdaftar" icon={Users} />
        <StatCard title="Total Kegiatan" value={stats.totalEvents} description={`${stats.activeEvents} kegiatan aktif`} icon={Calendar} />
        <StatCard title="Total Kehadiran" value={stats.totalAttendance} description="Record kehadiran" icon={TrendingUp} />
        <StatCard 
          title="Tingkat Kehadiran" 
          value={attendanceStats.total > 0 ? `${Math.round((attendanceStats.present / attendanceStats.total) * 100)}%` : '0%'} 
          description="Rata-rata kehadiran" 
          icon={TrendingUp} 
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        <Card className="dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-lg">Statistik Kehadiran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <AttendanceProgressBar label="Hadir" value={attendanceStats.present} total={attendanceStats.total} colorClass="bg-green-500" />

              <AttendanceProgressBar label="Tidak Hadir" value={attendanceStats.absent} total={attendanceStats.total} colorClass="bg-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="p-6 border-b border-gray-200 dark:border-gray-700">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Filter Laporan Analisis
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <label htmlFor="dateRangeSelect" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Periode Laporan
                </label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger id="dateRangeSelect" className="w-full">
                    <SelectValue placeholder="Pilih rentang periode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="this_week">Minggu Ini</SelectItem>
                    <SelectItem value="this_month">Bulan Ini</SelectItem>
                    <SelectItem value="last_month">Bulan Lalu</SelectItem>
                    <SelectItem value="this_year">Tahun Ini</SelectItem>
                    <SelectItem value="last_year">Tahun Lalu</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="eventFilterSelect" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Jenis Kegiatan
                </label>
                <Select value={eventFilter} onValueChange={setEventFilter}>
                  <SelectTrigger id="eventFilterSelect" className="w-full">
                    <SelectValue placeholder="Pilih jenis kegiatan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kegiatan</SelectItem>
                    {events && events.map(event => (
                      <SelectItem key={event.id} value={event.id!}>
                        {event.name || 'Kegiatan Tanpa Nama'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="statusFilterSelect" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status Kehadiran
                </label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="statusFilterSelect" className="w-full">
                    <SelectValue placeholder="Pilih status kehadiran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value={ATTENDANCE_STATUS.PRESENT}>Hadir</SelectItem>
                    <SelectItem value={ATTENDANCE_STATUS.ABSENT}>Tidak Hadir</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <Button
                onClick={handleExportReport}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition-colors duration-200 ease-in-out"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Laporan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-lg">Detail Kehadiran</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pegawai</TableHead>
                  <TableHead>Kegiatan</TableHead>
                  <TableHead>Waktu Check-in</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttendance.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">
                      Tidak ada data kehadiran yang sesuai dengan filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAttendance.map((record) => {
                    const pegawaiData = pegawai?.find(p => p.id === record.pegawaiId);
                    const eventData = events?.find(e => e.id === record.eventId);
                    
                    return (
                      <TableRow key={record.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                        <TableCell className="font-medium">
                          {pegawaiData?.nama || 'Pegawai Tidak Dikenal'}
                        </TableCell>
                        <TableCell>{eventData?.name || 'Kegiatan Tidak Dikenal'}</TableCell>
                        <TableCell>
                          {formatCheckInTime(record.checkInTime)}
                        </TableCell>
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
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