import { React, useEffect, useState } from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { Pie, Bar, Doughnut, Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    TimeScale,
    LineElement, // ✅ Required for line charts
    PointElement, // ✅ This is needed to fix the error
    Title,
    Tooltip,
    Legend,
  } from "chart.js";  
import "chartjs-adapter-date-fns";
import "./dashboard.css";
import useStatsStore from "../../Stores/useStatsStore";
import useUserStore from "../../Stores/useUserStore";
import { useNavigate } from "react-router-dom";
import { getLoggedUserInformation } from "../../Handles/handleLogin";
import { useIntl } from "react-intl";
import handleNotification from "../../Handles/handleNotification";
import useWebSocketProducts from "../../Websockets/useWebSocketProducts";
import useWebSocketUsers from "../../Websockets/useWebSocketUsers";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    TimeScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
  );

const Dashboard = () => {
  const { userStats, fetchUserStats, fetchProductStats } = useStatsStore();
  const token = useUserStore((state) => state.token);
  const navigate = useNavigate();
  const intl = useIntl();
  const { productStats } = useStatsStore();
  const { websocketProducts } = useWebSocketProducts();
  const { websocketUsers } = useWebSocketUsers();

  useEffect(() => {
    const checkIfAdminAndGetStats = async () => {
      try {
        let userInformation = await getLoggedUserInformation(token, intl);
        if (!userInformation.admin) {
          handleNotification(intl, "info", "adminNoPermission");
          navigate("/");
        }
        await fetchProductStats(token);
        await fetchUserStats(token);
        console.log(userStats);
      } catch (error) {
        handleNotification(intl, "error", `error${error.message}`);
        navigate("/");
      }
    };
    if (token) {
      checkIfAdminAndGetStats();
    }
  }, [token]);

  const productsData = {
    totalProducts: productStats?.totalProducts || 0,
    states: {
      labels: Object.keys(productStats?.productsByState || {}),
      datasets: [
        {
          label: "Product States",
          data: Object.values(productStats?.productsByState || {}),
          backgroundColor: [
            "#4CAF50", // Green
            "#F44336", // Red
            "#FFC107", // Amber
            "#2196F3", // Blue
          ],
        },
      ],
    },
    categories: {
      labels: productStats?.productsByCategory?.map((cat) => cat.nameEng) || [],
      datasets: [
        {
          label: "Products by Category",
          data:
            productStats?.productsByCategory?.map((cat) => cat.productCount) ||
            [],
          backgroundColor: [
            "#3F51B5", // Indigo
            "#E91E63", // Pink
            "#00BCD4", // Cyan
            "#4CAF50", // Green
            "#FF9800", // Orange
          ],
        },
      ],
    },
    avgProductsPerUser: productStats?.avgProductsPerUser || 0.0,
    avgPrice: productStats?.avgPriceOfProducts || 0.0,
    avgPriceByCategory: {
      labels:
        productStats?.avgPricePerCategory?.map((cat) => cat.nameEng) || [],
      datasets: [
        {
          label: "Average Price by Category",
          data:
            productStats?.avgPricePerCategory?.map((cat) => cat.avgPrice) || [],
          backgroundColor: [
            "#4CAF50", // Green
            "#F44336", // Red
            "#FFC107", // Amber
            "#2196F3", // Blue
            "#FF9800", // Orange
          ],
        },
      ],
    },
    topLocations: {
      labels: Object.keys(productStats?.topLocations || {}),
      datasets: [
        {
          label: "Top Locations",
          data: Object.values(productStats?.topLocations || {}),
          backgroundColor: [
            "#4CAF50", // Green
            "#F44336", // Red
            "#FFC107", // Amber
            "#2196F3", // Blue
            "#FF9800", // Orange
          ], // Assigning colors dynamically
        },
      ],
    },
  };

  const usersData = {
    total: userStats?.totalUsers || 0, // Get total users count
    accountStates: {
      labels: Object.keys(userStats?.usersByState || {}), // Extract state names
      datasets: [
        {
          label: "User Account States",
          data: Object.values(userStats?.usersByState || {}), // Extract counts per state
          backgroundColor: [
            "#4CAF50", // Green
            "#F44336", // Red
            "#FFC107", // Amber
            "#2196F3", // Blue
          ],
        },
      ],
    },
    newUsers: {
      day: userStats?.newUsersByPeriod?.day || 0,
      week: userStats?.newUsersByPeriod?.week || 0,
      month: userStats?.newUsersByPeriod?.month || 0,
    },
    avgTimeToActivate: `${userStats?.avgTimeToActivate || 0.0} minutes`,
    avgTimeToPublish: `${userStats?.avgTimeToFirstPublish || 0.0} minutes`,
    userGrowthByDate: {
        labels: Object.keys(userStats?.newUsersByDayOfYear || {}), // Ensure safe access
        datasets: [
          {
            label: "New Users Per Day",
            data: Object.values(userStats?.newUsersByDayOfYear || {}), // Prevent crashes
            borderColor: "#4CAF50",
            backgroundColor: "rgba(76, 175, 80, 0.2)",
            tension: 0.3, // Smooth curve
          },
        ],
      },
  };      

    

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { type: "time", time: { unit: "day" } }, // Format X-axis as date
      y: { beginAtZero: true },
    },
  };
  

  const MetricCard = ({ title, value, color }) => (
    <Paper className={`metric-card ${color}`}>
      <Typography variant="subtitle2" className="metric-label">
        {title}
      </Typography>
      <Typography variant="h4" className="metric-value">
        {value}
      </Typography>
    </Paper>
  );

  return (
    <Box className="dashboard-container">
      <Typography variant="h4" component="h1" className="dashboard-title">
        Analytics Dashboard
      </Typography>

      {/* Products Section */}
      <Box className="dashboard-section">
        <Typography variant="h5" component="h2" className="section-title">
          Products Analytics
        </Typography>
        <Grid container spacing={3} className="grid-container">
          {/* Total Products */}
          <Grid item xs={12} sm={6} md={3} className="grid-item">
            <Paper className="total-card">
              <Typography variant="h6" className="card-title">
                Total Products
              </Typography>
              <Typography variant="h2" className="total-value">
                {productsData.totalProducts}
              </Typography>
            </Paper>
          </Grid>
          {/* Products by State */}
          <Grid item xs={12} sm={6} md={4} className="grid-item">
            <Paper className="chart-card">
              <Typography variant="h6" className="card-title">
                Products by State
              </Typography>
              <div className="chart-container">
                <Doughnut
                  data={{
                    labels: productsData.states.labels,
                    datasets: productsData.states.datasets, // Pass the full datasets array
                  }}
                  options={chartOptions}
                />
              </div>
            </Paper>
          </Grid>

          {/* Products by Category */}
          <Grid item xs={12} sm={6} md={4} className="grid-item">
            <Paper className="chart-card">
              <Typography variant="h6" className="card-title">
                Products by Category
              </Typography>
              <div className="chart-container">
                <Pie
                  data={{
                    labels: productsData.categories.labels,
                    datasets: productsData.categories.datasets, // Pass the full datasets array
                  }}
                  options={chartOptions}
                />
              </div>
            </Paper>
          </Grid>

          {/* Key Metrics */}
          <Grid item xs={12} sm={6} md={4} className="grid-item">
            <Paper className="metrics-card">
              <Typography variant="h6" className="card-title">
                Key Metrics
              </Typography>
              <div className="metrics-grid">
                <MetricCard
                  title="Average Products per User"
                  value={productsData.avgProductsPerUser}
                  color="metric-blue"
                />
                <MetricCard
                  title="Average Price"
                  value={`$${productsData.avgPrice.toFixed(2)}`}
                  color="metric-green"
                />
              </div>
            </Paper>
          </Grid>

          {/* Average Price by Category */}
          <Grid item xs={12} md={6} className="grid-item">
            <Paper className="chart-card">
              <Typography variant="h6" className="card-title">
                Average Price by Category
              </Typography>
              <div className="chart-container">
                <Bar
                  data={productsData.avgPriceByCategory} // Directly pass the formatted object
                  options={barChartOptions}
                />
              </div>
            </Paper>
          </Grid>

          {/* Top Products Locations */}
          <Grid item xs={12} md={6} className="grid-item">
            <Paper className="chart-card">
              <Typography variant="h6" className="card-title">
                Top Products Locations
              </Typography>
              <div className="chart-container">
                <Bar
                  data={productsData.topLocations} // Pass structured data directly
                  options={barChartOptions}
                />
              </div>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Users Section */}
      <Box className="dashboard-section">
        <Typography variant="h5" component="h2" className="section-title">
          Users Analytics
        </Typography>

        <Grid container spacing={3} className="grid-container">
          {/* Total Users */}
          <Grid item xs={12} sm={6} md={3} className="grid-item">
            <Paper className="total-card">
              <Typography variant="h6" className="card-title">
                Total Users
              </Typography>
              <Typography variant="h2" className="total-value">
                {usersData.total}
              </Typography>
            </Paper>
          </Grid>

          {/* Users by Account State */}
          <Grid item xs={12} sm={6} md={3} className="grid-item">
            <Paper className="chart-card">
              <Typography variant="h6" className="card-title">
                Users by Account State
              </Typography>
              <div className="chart-container">
                <Pie
                  data={{
                    labels: usersData.accountStates.labels,
                    datasets: usersData.accountStates.datasets, // Pass the entire datasets array
                  }}
                  options={chartOptions}
                />
              </div>
            </Paper>
          </Grid>

          {/* New Users */}
          <Grid item xs={12} sm={6} md={3} className="grid-item">
            <Paper className="metrics-card">
              <Typography variant="h6" className="card-title">
                New Users
              </Typography>
              <div className="metrics-grid">
                <MetricCard
                  title="Last 24 Hours"
                  value={usersData.newUsers.day}
                  color="metric-purple"
                />
                <MetricCard
                  title="Last Week"
                  value={usersData.newUsers.week}
                  color="metric-indigo"
                />
                <MetricCard
                  title="Last Month"
                  value={usersData.newUsers.month}
                  color="metric-blue"
                />
              </div>
            </Paper>
          </Grid>

          {/* Average Time to Publish */}
          <Grid item xs={12} sm={6} md={3} className="grid-item">
            <Paper className="time-card">
              <Typography variant="h6" className="card-title">
                Avg. Time to Activate Account
              </Typography>
              <Typography variant="h3" className="time-value">
                {usersData.avgTimeToActivate}
              </Typography>
              <Typography variant="body2" className="time-label">
                After registration
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3} className="grid-item">
            <Paper className="time-card">
              <Typography variant="h6" className="card-title">
                Avg. Time to Publish
              </Typography>
              <Typography variant="h3" className="time-value">
                {usersData.avgTimeToPublish}
              </Typography>
              <Typography variant="body2" className="time-label">
                After registration
              </Typography>
            </Paper>
          </Grid>
          <Box className="dashboard-section">
      <Typography variant="h5" className="section-title">User Growth Analytics</Typography>

      <Grid item xs={12} md={6} className="grid-item">
        <Paper className="chart-card">
          <Typography variant="h6" className="card-title">Users by Date</Typography>
          <div className="chart-container">
            <Line data={usersData.userGrowthByDate} options={lineChartOptions} />
          </div>
        </Paper>
      </Grid>
    </Box>

        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
