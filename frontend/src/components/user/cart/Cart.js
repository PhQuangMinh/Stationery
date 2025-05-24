import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import './Cart.css';
import { BASE_API_URL } from '../../../utils/constants';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        const token = localStorage.getItem('accessToken');
        const username = localStorage.getItem('username');

        if (!token || !username) {
            setError("Bạn cần đăng nhập để xem giỏ hàng!");
            setLoading(false);
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
            setCartItems(data.data.cartItems || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching cart:', error);
            setError('Có lỗi xảy ra khi tải giỏ hàng!');
            setLoading(false);
        }
    };

    const updateCartItem = async (item) => {
        const token = localStorage.getItem('accessToken');
        const username = localStorage.getItem('username');

        try {
            const response = await fetch(`${BASE_API_URL}/user/${username}/carts/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    cartItems: [{
                        id: item.id,
                        productId: item.productId,
                        quantity: parseInt(item.quantity)
                    }]
                })
            });

            if (!response.ok) {
                throw new Error('Không thể thêm số lượng');
            }

            await fetchCart(); // Refresh cart after update
        } catch (error) {
            console.error('Error updating cart:', error);
        }
    };

    const removeProductFromCart = async (productId) => {
        const token = localStorage.getItem('accessToken');
        const username = localStorage.getItem('username');

        try {
            const response = await fetch(`${BASE_API_URL}/user/${username}/carts/remove-products`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: productId
                })
            });

            if (!response.ok) {
                throw new Error('Không thể xóa sản phẩm khỏi giỏ hàng');
            }

            await fetchCart(); // Refresh cart after deletion
        } catch (error) {
            console.error('Error removing product from cart:', error);
            alert('Có lỗi xảy ra khi xóa sản phẩm khỏi giỏ hàng');
        }
    };

    const handleQuantityChange = async (item, newQuantity) => {
        const updatedItem = { ...item, quantity: parseInt(newQuantity) };
        await updateCartItem(updatedItem);
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            alert("Giỏ hàng trống, vui lòng thêm sản phẩm trước khi thanh toán!");
            return;
        }
        navigate('/checkout');
    };

    const calculateTotals = () => {
        let originalTotal = 0;
        let finalTotal = 0;
        
        cartItems.forEach(item => {
            const originalItemTotal = item.price * item.quantity;
            const discountPrice = item.price * (100 - item.discount) / 100;
            const discountedItemTotal = discountPrice * item.quantity;
            
            originalTotal += originalItemTotal;
            finalTotal += discountedItemTotal;
        });

        return { originalTotal, finalTotal };
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price);
    };

    if (loading) {
        return (
            <>
                <Header />
                <div>Đang tải...</div>
                <Footer />
            </>
        );
    }

    const { originalTotal, finalTotal } = calculateTotals();

    return (
        <>
            <Header />
            <div className="cart-container">
                <div className="breadcrumb-section">
                    <Link to="/" className="text-dark text-decoration-none">Trang chủ</Link>
                    <span> / Giỏ hàng</span>
                    <hr />
                </div>

                <div className="container">
                    {error ? (
                        <div className="alert alert-warning">{error}</div>
                    ) : (
                        <>
                            <table className="table table-striped table-hover table-bordered">
                                <thead>
                                    <tr>
                                        <th>Ảnh sản phẩm</th>
                                        <th>Tên sản phẩm</th>
                                        <th>Đơn giá gốc</th>
                                        <th>Giảm giá</th>
                                        <th>Số lượng</th>
                                        <th>Thành tiền</th>
                                        <th>Xóa</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItems.length === 0 ? (
                                        <tr>
                                            <td colSpan="7">Giỏ hàng của bạn đang trống! 😢</td>
                                        </tr>
                                    ) : (
                                        cartItems.map((item, index) => {
                                            const discountPrice = item.price * (100 - item.discount) / 100;
                                            const totalPrice = discountPrice * item.quantity;
                                            
                                            return (
                                                <tr key={index}>
                                                    <td>
                                                        <img 
                                                            src={item.imageUrl} 
                                                            alt={item.name} 
                                                            className="cart-item-image"
                                                        />
                                                    </td>
                                                    <td>
                                                        <div className="product-info">
                                                            <Link to={`/product/${item.productId}`} className="product-name text-decoration-none">
                                                                {item.name}
                                                            </Link>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="price-info">
                                                            {formatPrice(item.price)} đ
                                                        </div>
                                                    </td>
                                                    <td className="text-center">
                                                        {item.discount}%
                                                    </td>
                                                    <td className="text-center">
                                                        <div className="quantity-control">
                                                            <button 
                                                                className="quantity-btn"
                                                                onClick={() => handleQuantityChange(item, Math.max(1, item.quantity - 1))}
                                                            >
                                                                -
                                                            </button>
                                                            <input
                                                                type="number"
                                                                value={item.quantity}
                                                                min="1"
                                                                max={item.stockQuantity}
                                                                className="form-control quantity"
                                                                onChange={(e) => handleQuantityChange(item, e.target.value)}
                                                            />
                                                            <button 
                                                                className="quantity-btn"
                                                                onClick={() => handleQuantityChange(item, item.quantity + 1)}
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                        {item.stockQuantity < 5 && (
                                                            <div className="stock-warning text-danger small">
                                                                Chỉ còn {item.stockQuantity} sản phẩm
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td>{formatPrice(totalPrice)} đ</td>
                                                    <td>
                                                        <button 
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => removeProductFromCart(item.id)}
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>

                            <div className="checkout-section">
                                <div className="row justify-content-end">
                                    <div className="col-lg-4 col-md-6">
                                        <table className="table table-bordered summary-table">
                                            <tbody>
                                                <tr>
                                                    <td><strong>Tạm tính:</strong></td>
                                                    <td>{formatPrice(originalTotal)} đ</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Tổng số tiền:</strong></td>
                                                    <td>{formatPrice(finalTotal)} đ</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div className="checkout-btn-container">
                                            <button 
                                                className="btn btn-danger btn-lg checkout-btn"
                                                onClick={handleCheckout}
                                            >
                                                Tiến hành thanh toán
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Cart;