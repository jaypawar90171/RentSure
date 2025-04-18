import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { ArrowUpRight, Building, CalendarClock, DollarSign, FileCheck, UserCheck } from "lucide-react";

function StatCard({ title, value, description, icon, trend, trendUp }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-rentsure-100 flex items-center justify-center">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
        {trend && (
          <div className={`flex items-center mt-2 text-xs ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
            <ArrowUpRight className={`h-3 w-3 mr-1 ${!trendUp && 'rotate-90'}`} />
            <span>{trend}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function LandlordStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Active Properties" value="4" description="Total properties under management" icon={<Building className="h-4 w-4 text-rentsure-600" />} trend="1 new this month" trendUp />
      <StatCard title="Active Contracts" value="5" description="Legally binding smart contracts" icon={<FileCheck className="h-4 w-4 text-rentsure-600" />} />
      <StatCard title="Rental Income" value="$4,750" description="Monthly recurring revenue" icon={<DollarSign className="h-4 w-4 text-rentsure-600" />} trend="Up 12% from last month" trendUp />
      <StatCard title="Upcoming Renewals" value="2" description="Contracts expiring in 30 days" icon={<CalendarClock className="h-4 w-4 text-rentsure-600" />} />
    </div>
  );
}

export function TenantStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Current Lease" value="Active" description="Smart contract in good standing" icon={<FileCheck className="h-4 w-4 text-rentsure-600" />} />
      <StatCard title="Monthly Rent" value="$1,250" description="Due on the 1st of each month" icon={<DollarSign className="h-4 w-4 text-rentsure-600" />} />
      <StatCard title="Lease Expiration" value="Oct 15, 2025" description="189 days remaining" icon={<CalendarClock className="h-4 w-4 text-rentsure-600" />} />
      <StatCard title="Landlord" value="ABC Properties" description="Responsive within 24 hours" icon={<UserCheck className="h-4 w-4 text-rentsure-600" />} />
    </div>
  );
}
