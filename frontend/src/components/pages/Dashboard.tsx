import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertCircle, CheckCircle, Clock, Wrench, TrendingUp } from 'lucide-react';
import { RepairTicket, RepairStatus } from '../../types/repair';
import { cn } from '../../utils';

const COLORS = {
  pending: '#eab308',
  'in-progress': '#3b82f6',
  completed: '#22c55e',
  cancelled: '#6b7280',
};

export function Dashboard() {
  const [requests, setRequests] = useState<RepairTicket[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0,
  });

  useEffect(() => {
    // Mock data for now - TODO: implement actual data fetching
    const mockData: RepairTicket[] = [];
    setRequests(mockData);
    setStats({
      total: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
      cancelled: 0,
    });
  }, []);

  const loadData = async () => {
    try {
      // Fetch real data from backend API
      const response = await fetch('/api/repair-requests');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      const allRequests: RepairTicket[] = result.data || [];
      setRequests(allRequests);

      const newStats = {
        total: allRequests.length,
        pending: allRequests.filter((r: RepairTicket) => r.status === 'pending').length,
        inProgress: allRequests.filter((r: RepairTicket) => r.status === 'in-progress').length,
        completed: allRequests.filter((r: RepairTicket) => r.status === 'completed').length,
        cancelled: allRequests.filter((r: RepairTicket) => r.status === 'cancelled').length,
      };
      setStats(newStats);
    } catch (error) {
      console.error('Error loading data:', error);
      setRequests([]);
      setStats({
        total: 0,
        pending: 0,
        inProgress: 0,
        completed: 0,
        cancelled: 0,
      });
    }
  };

  const statusData = [
    { name: 'รอดำเนินการ', value: stats.pending },
    { name: 'กำลังซ่อม', value: stats.inProgress },
    { name: 'เสร็จสิ้น', value: stats.completed },
    { name: 'ยกเลิก', value: stats.cancelled },
  ].filter(item => item.value > 0);

  const districtData = requests.reduce((acc, req) => {
    const existing = acc.find(item => item.district === req.district);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ district: req.district, count: 1 });
    }
    return acc;
  }, [] as { district: string; count: number }[])
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const priorityData = [
    { name: 'ปกติ', value: requests.filter(r => r.priority === 'high').length },
    { name: 'ด่วน', value: requests.filter(r => r.priority === 'medium').length },
    { name: 'ด่วนมาก', value: requests.filter(r => r.priority === 'low').length },
  ].filter(item => item.value > 0);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-1">ภาพรวมระบบแจ้งซ่อม CCTV กรุงเทพมหานคร</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">รายการทั้งหมด</CardTitle>
            <TrendingUp className="size-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-gray-500 mt-1">รายการแจ้งซ่อมทั้งหมด</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">รอดำเนินการ</CardTitle>
            <Clock className="size-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-gray-500 mt-1">รอการดำเนินการ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">กำลังซ่อม</CardTitle>
            <Wrench className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <p className="text-xs text-gray-500 mt-1">อยู่ระหว่างการซ่อม</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">เสร็จสิ้น</CardTitle>
            <CheckCircle className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-gray-500 mt-1">ซ่อมเสร็จแล้ว</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>สถานะการซ่อม</CardTitle>
            <CardDescription>แสดงสัดส่วนสถานะรายการแจ้งซ่อม</CardDescription>
          </CardHeader>
          <CardContent>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name as RepairStatus]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                ไม่มีข้อมูล
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ความเร่งด่วน</CardTitle>
            <CardDescription>จำนวนรายการแจ้งซ่อมแยกตามความเร่งด่วน</CardDescription>
          </CardHeader>
          <CardContent>
            {priorityData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                ไม่มีข้อมูล
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>10 เขตที่มีการแจ้งซ่อมมากที่สุด</CardTitle>
          <CardDescription>จำนวนรายการแจ้งซ่อมแยกตามเขต</CardDescription>
        </CardHeader>
        <CardContent>
          {districtData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={districtData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="district" width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[400px] flex items-center justify-center text-gray-500">
              ไม่มีข้อมูล
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>รายการล่าสุด</CardTitle>
          <CardDescription>รายการแจ้งซ่อมล่าสุด 5 รายการ</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {requests.slice(0, 5).map((request) => (
              <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{request.ticketNumber}</span>
                    <Badge className="text-xs">
                      {request.district}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{request.issue}</p>
                  <p className="text-xs text-gray-500">{request.location}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={
                    request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    request.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    request.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }>
                    {request.status === 'pending' ? 'รอดำเนินการ' :
                     request.status === 'in-progress' ? 'กำลังซ่อม' :
                     request.status === 'completed' ? 'เสร็จสิ้น' :
                     request.status}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {new Date(request.reportedDate).toLocaleDateString('th-TH')}
                  </span>
                </div>
              </div>
            ))}
            {requests.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                ยังไม่มีรายการแจ้งซ่อม
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
