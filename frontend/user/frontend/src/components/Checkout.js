import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './Checkout.css';
import { BASE_API_URL } from '../utils/constants';

const Checkout = () => {
    const [cart, setCart] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [specificAddress, setSpecificAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
        loadProvinces();
    }, []);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
    };

    const calculateTotal = () => {
        const subtotal = Math.round(cart.reduce((sum, item) => {
            const discountPrice = item.price * (100 - item.discount) / 100;
            return sum + (discountPrice * item.quantity);
        }, 0));
        return subtotal;
    };

    const fetchCart = async () => {
        const token = localStorage.getItem('accessToken');
        const username = localStorage.getItem('username');

        if (!token || !username) {
            alert('Bạn cần đăng nhập để xem giỏ hàng!');
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`${BASE_API_URL}/user/${username}/carts/get-cart`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Không thể tải giỏ hàng');
            }

            const data = await response.json();
            setCart(data.data.cartItems || []);
        } catch (error) {
            console.error('Error fetching cart:', error);
            alert('Có lỗi xảy ra khi tải giỏ hàng!');
        }
    };

    const loadProvinces = async () => {
        try {
            const response = await fetch('https://provinces.open-api.vn/api/p/');
            const data = await response.json();
            setProvinces(data);
        } catch (error) {
            console.error('Error loading provinces:', error);
        }
    };

    const loadDistricts = async (provinceCode) => {
        try {
            const response = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
            const data = await response.json();
            setDistricts(data.districts || []);
            setWards([]);
            setSelectedDistrict('');
            setSelectedWard('');
        } catch (error) {
            console.error('Error loading districts:', error);
        }
    };

    const loadWards = async (districtCode) => {
        try {
            const response = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
            const data = await response.json();
            setWards(data.wards || []);
            setSelectedWard('');
        } catch (error) {
            console.error('Error loading wards:', error);
        }
    };

    const handleProvinceChange = (e) => {
        const provinceCode = e.target.value;
        setSelectedProvince(provinceCode);
        if (provinceCode) {
            loadDistricts(provinceCode);
        } else {
            setDistricts([]);
            setWards([]);
        }
    };

    const handleDistrictChange = (e) => {
        const districtCode = e.target.value;
        setSelectedDistrict(districtCode);
        if (districtCode) {
            loadWards(districtCode);
        } else {
            setWards([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedProvince || !selectedDistrict || !selectedWard || !specificAddress.trim()) {
            alert('Vui lòng nhập đầy đủ thông tin địa chỉ');
            return;
        }

        const provinceText = provinces.find(p => p.code === selectedProvince)?.name || '';
        const districtText = districts.find(d => d.code === selectedDistrict)?.name || '';
        const wardText = wards.find(w => w.code === selectedWard)?.name || '';
        const fullAddress = `${specificAddress}, ${wardText}, ${districtText}, ${provinceText}`;

        const total = calculateTotal();
        const initialStatus = paymentMethod === 'VNPAY' ? 'PENDING' : 'CASH_ON_DELIVERY';

        const orderRequest = {
            orderDate: new Date().toISOString(),
            totalAmount: total,
            status: initialStatus,
            shippingAddress: fullAddress,
            paymentMethod: paymentMethod,
            orderItemRequests: cart.map(item => ({
                id: item.id,
                quantity: item.quantity,
                productId: item.productId.toString()
            }))
        };

        try {
            const username = localStorage.getItem('username');
            const token = localStorage.getItem('accessToken');
            const orderResponse = await fetch(`${BASE_API_URL}/user/orders/${username}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderRequest)
            });

            if (!orderResponse.ok) {
                throw new Error('Không thể tạo đơn hàng');
            }

            const orderResult = await orderResponse.json();

            if (paymentMethod === 'VNPAY') {
                const vnpayResponse = await fetch(`${BASE_API_URL}/api/v1/payment/vn-pay?amount=${total}&bankCode=NCB&txnRef=${orderResult.data.txnRef}`);
                const vnpayData = await vnpayResponse.json();
                
                if (vnpayData.data && vnpayData.data.paymentUrl) {
                    localStorage.setItem('pendingOrderId', orderResult.data.id);
                    window.location.href = vnpayData.data.paymentUrl;
                } else {
                    throw new Error('Không thể khởi tạo thanh toán VNPAY');
                }
            } else {
                alert(`Đơn hàng đã được đặt thành công!\nPhương thức thanh toán: Thanh toán khi nhận hàng\nTrạng thái: Chờ xác nhận`);
                navigate('/orders');
            }
        } catch (error) {
            console.error('Lỗi:', error);
            alert('Có lỗi xảy ra: ' + error.message);
        }
    };

    return (
        <>
            <Header />
            <div className="container checkout-container">
                <div className="checkout-breadcrumb">
                    <Link to="/">Trang chủ</Link>
                    <span> / Thông tin mua hàng</span>
                </div>
                <hr />
                <div className="row">
                    <div className="col-md-7">
                        <h2 className="mb-4">Thông tin mua hàng</h2>
                        <form id="checkoutForm" className="checkout-form" onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <input type="email" className="form-control" placeholder="Email" required />
                            </div>
                            <div className="mb-3">
                                <input type="text" className="form-control" placeholder="Họ và tên" required />
                            </div>
                            <div className="mb-3">
                                <input type="tel" className="form-control" placeholder="Số điện thoại" required />
                            </div>
                            <div className="mb-3">
                                <select className="form-select" id="province" required value={selectedProvince} onChange={handleProvinceChange}>
                                    <option value="">Chọn Tỉnh/Thành phố</option>
                                    {provinces.map(province => (
                                        <option key={province.code} value={province.code}>{province.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <select className="form-select" id="district" required disabled={!selectedProvince} value={selectedDistrict} onChange={handleDistrictChange}>
                                    <option value="">Chọn Quận/Huyện</option>
                                    {districts.map(district => (
                                        <option key={district.code} value={district.code}>{district.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <select className="form-select" id="ward" required disabled={!selectedDistrict} value={selectedWard} onChange={(e) => setSelectedWard(e.target.value)}>
                                    <option value="">Chọn Phường/Xã</option>
                                    {wards.map(ward => (
                                        <option key={ward.code} value={ward.code}>{ward.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="specificAddress"
                                    placeholder="Địa chỉ cụ thể (Số nhà, tên đường, thôn/xóm...)"
                                    value={specificAddress}
                                    onChange={(e) => setSpecificAddress(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <textarea className="form-control" rows="3" placeholder="Ghi chú (Tùy chọn)"></textarea>
                            </div>
                        </form>
                    </div>

                    <div className="col-md-5">
                        <div className="card order-summary-card">
                            <div className="card-body">
                                <div className="payment-methods">
                                    <select
                                        className="form-select"
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        required
                                    >
                                        <option value="COD">Thanh toán khi nhận hàng (COD)</option>
                                        <option value="VNPAY">Thanh toán qua VNPay</option>
                                    </select>
                                </div>

                                <h5 className="mb-3">Đơn hàng ({cart.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm)</h5>
                                <div className="order-items-container mb-4">
                                    {cart.map(item => (
                                        <div key={item.id} className="order-item mb-3 border-bottom pb-3">
                                            <div className="d-flex">
                                                <img src={item.imageUrl} alt={item.name} className="product-img" />
                                                <div className="ms-3 flex-grow-1">
                                                    <h6>{item.name}</h6>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div className="quantity-display">
                                                            Số lượng: <span>{item.quantity}</span>
                                                        </div>
                                                        <span className="text-danger">{formatPrice(item.price * item.quantity)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="price-summary">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Tạm tính</span>
                                        <span>{formatPrice(calculateTotal())}</span>
                                    </div>
                                    <div className="d-flex justify-content-between border-top pt-2">
                                        <strong>Tổng tiền thanh toán</strong>
                                        <strong className="text-danger">{formatPrice(calculateTotal())}</strong>
                                    </div>
                                </div>

                                <button
                                    className="btn btn-danger w-100 place-order-btn"
                                    type="submit"
                                    form="checkoutForm"
                                >
                                    Đặt hàng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Checkout; 