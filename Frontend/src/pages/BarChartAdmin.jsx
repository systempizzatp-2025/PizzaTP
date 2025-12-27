import RevenueAreaChart from "../components/RevenueAreaChart";
import CustomerAnalysisChart from "../components/CustomerAnalysisChart";
import PaymentStatusChart from "../components/PaymentStatusChart";
import CustomerRatingChart from "../components/CustomerRatingChart";
import HourlyPerformanceChart from "../components/HourlyPerformanceChart";
import TopProductChart from "../components/TopProductChart";
import DashboardSummary from "../components/DashboardSummary";

export default function PizzaDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Stats Cards - Compact */}
        <DashboardSummary />

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {/* Revenue Area Chart */}
          <RevenueAreaChart />

          {/* User Dynamics Area Chart */}
          <CustomerAnalysisChart />

          {/* Top Products Pie Chart */}
          <TopProductChart />

          {/* Order Status Pie Chart */}
          <PaymentStatusChart />

          {/* Customer Ratings Bar Chart */}
          <CustomerRatingChart />

          {/* Hourly Performance Composed Chart */}
          <HourlyPerformanceChart />
        </div>
      </div>
    </div>
  );
}
