import React, { useEffect, useState } from 'react';
import { Chart as ChartJS } from 'chart.js/auto';
import './Statistics.css';

const Statistics = () => {
    const [statistics, setStatistics] = useState(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [years, setYears] = useState([]);
    const [loading, setLoading] = useState(false);

    // Format tiền tệ
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    useEffect(() => {
        // Tạo danh sách năm (từ 2020 đến năm hiện tại)
        const currentYear = new Date().getFullYear();
        const yearList = [];
        for (let year = 2020; year <= currentYear; year++) {
            yearList.push(year);
        }
        setYears(yearList);

        // Lấy thống kê cho năm hiện tại
        getStatistics(currentYear);
    }, []);

    useEffect(() => {
        // Gọi API mỗi khi năm được chọn thay đổi
        getStatistics(selectedYear);
    }, [selectedYear]);

    const getStatistics = async (year) => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/admin/statistics?year=${year}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            if (!response.ok) {
                throw new Error('Lỗi khi gọi API: ' + response.status);
            }

            const responseJson = await response.json();
            setStatistics(responseJson.data);
            
            // Xóa biểu đồ cũ nếu có
            const revenueChartElement = document.getElementById('revenueChart');
            const orderStatusChartElement = document.getElementById('orderStatusChart');
            
            if (revenueChartElement) {
                const revenueChartInstance = ChartJS.getChart(revenueChartElement);
                if (revenueChartInstance) {
                    revenueChartInstance.destroy();
                }
            }
            
            if (orderStatusChartElement) {
                const orderStatusChartInstance = ChartJS.getChart(orderStatusChartElement);
                if (orderStatusChartInstance) {
                    orderStatusChartInstance.destroy();
                }
            }

            if (responseJson.data) {
                renderRevenueChart(responseJson.data);
                renderOrderStatusChart(responseJson.data);
            }
        } catch (error) {
            console.error('Lỗi:', error);
            // Sử dụng dữ liệu mẫu khi có lỗi
            setStatistics(mockData);
            renderRevenueChart(mockData);
            renderOrderStatusChart(mockData);
        } finally {
            setLoading(false);
        }
    };

    const renderRevenueChart = (data) => {
        const ctx = document.getElementById('revenueChart')?.getContext('2d');
        if (!ctx) return;

        new ChartJS(ctx, {
            type: 'line',
            data: {
                labels: data.revenueByMonth.labels,
                datasets: [{
                    label: 'Doanh thu',
                    data: data.revenueByMonth.data,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Doanh thu theo tháng'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return formatCurrency(value);
                            }
                        }
                    }
                }
            }
        });
    };

    const renderOrderStatusChart = (data) => {
        const ctx = document.getElementById('orderStatusChart')?.getContext('2d');
        if (!ctx) return;

        new ChartJS(ctx, {
            type: 'doughnut',
            data: {
                labels: data.orderStatus.labels,
                datasets: [{
                    data: data.orderStatus.data,
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    };

    if (loading) return (
        <div className="main-content">
            <div className="loading-spinner">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                </div>
            </div>
        </div>
    );

    if (!statistics) return null;

    return (
        <div className="main-content">
            <div className="container-fluid">
                <div className="year-selector mb-4">
                    <select 
                        className="form-select"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    >
                        {years.map(year => (
                            <option key={year} value={year}>
                                Năm {year}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="statistics-cards">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="text-muted">Tổng đơn hàng</h5>
                            <div className="d-flex justify-content-between align-items-center">
                                <h2>{statistics.summary.totalOrders.toLocaleString()}</h2>
                                <i className="bi bi-cart text-primary"></i>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-body">
                            <h5 className="text-muted">Doanh thu</h5>
                            <div className="d-flex justify-content-between align-items-center">
                                <h2>{formatCurrency(statistics.summary.totalRevenue)}</h2>
                                <i className="bi bi-currency-dollar text-success"></i>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-body">
                            <h5 className="text-muted">Đơn hàng hôm nay</h5>
                            <div className="d-flex justify-content-between align-items-center">
                                <h2>{statistics.summary.todayOrders}</h2>
                                <i className="bi bi-clock text-warning"></i>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-body">
                            <h5 className="text-muted">Tổng sản phẩm</h5>
                            <div className="d-flex justify-content-between align-items-center">
                                <h2>{statistics.summary.totalProducts.toLocaleString()}</h2>
                                <i className="bi bi-box text-info"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Doanh thu theo tháng năm {selectedYear}</h5>
                                <canvas id="revenueChart"></canvas>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Trạng thái đơn hàng năm {selectedYear}</h5>
                                <canvas id="orderStatusChart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card mt-4">
                    <div className="card-body">
                        <h5 className="card-title">Top sản phẩm bán chạy năm {selectedYear}</h5>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Sản phẩm</th>
                                        <th>Số lượng đã bán</th>
                                        <th>Doanh thu</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {statistics.topProducts.map((product, index) => (
                                        <tr key={index}>
                                            <td>{product.name}</td>
                                            <td>{product.soldQuantity.toLocaleString()}</td>
                                            <td>{formatCurrency(product.revenue)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Dữ liệu mẫu
const mockData = {
    summary: {
        totalOrders: 1234,
        totalRevenue: 1234567890,
        todayOrders: 45,
        totalProducts: 789
    },
    revenueByMonth: {
        labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
        data: [
            12000000, 15000000, 18000000, 14000000, 20000000, 25000000,
            22000000, 28000000, 30000000, 27000000, 35000000, 40000000
        ]
    },
    orderStatus: {
        labels: ['Chờ xác nhận', 'Đang xử lý', 'Đang giao hàng', 'Hoàn thành', 'Đã hủy'],
        data: [30, 45, 25, 180, 20]
    },
    topProducts: [
        { name: 'Bút bi Thiên Long', soldQuantity: 500, revenue: 5000000 },
        { name: 'Vở Campus', soldQuantity: 450, revenue: 4500000 },
        { name: 'Bút chì 2B', soldQuantity: 400, revenue: 2000000 },
        { name: 'Hộp bút màu', soldQuantity: 350, revenue: 7000000 },
        { name: 'Thước kẻ', soldQuantity: 300, revenue: 1500000 }
    ]
};

export default Statistics; 