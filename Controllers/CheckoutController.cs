using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebFashion.Data;
using WebFashion.Models;
using WebFashion.Services.Interface;

namespace WebFashion.APIService.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CheckoutController : ControllerBase
    {
        private readonly IVnPayService _vnPayService;
        private readonly ApplicationDbContext _context;
        // ✅ Đặt cứng URL của frontend để dễ quản lý
        private const string _frontendBaseUrl = "http://localhost:5173";

        public CheckoutController(IVnPayService vnPayService, ApplicationDbContext dbContext)
        {
            _vnPayService = vnPayService;
            _context = dbContext;
        }

        [HttpGet("PaymentCallbackVnpay")]
        public async Task<IActionResult> PaymentCallbackVnpay()
        {
            string finalRedirectUrl;
            string orderIdStr = "0"; // Khởi tạo với giá trị mặc định

            try
            {
                var response = _vnPayService.PaymentExecute(Request.Query);

                // Lấy OrderId và ResponseCode
                orderIdStr = response.OrderId ?? "0";
                string responseCode = response.VnPayResponseCode;

                // ===== LOGIC SỬA LẠI (QUAN TRỌNG) =====

                // BƯỚC 1: Kiểm tra chữ ký (Hash) đầu tiên. 
                // Nếu hash sai (response.Success == false), ta KHÔNG TIN bất kỳ dữ liệu nào.
                if (!response.Success)
                {
                    Console.WriteLine("❌ LỖI HASH: Chữ ký VNPay không hợp lệ.");
                    // Trả về mã lỗi 97 (chữ ký không hợp lệ) để frontend xử lý
                    finalRedirectUrl = $"{_frontendBaseUrl}/payment-result/{orderIdStr}?vnp_ResponseCode=97";
                    return Content(CreateRedirectHtml(finalRedirectUrl, false), "text/html");
                }

                // BƯỚC 2: Chữ ký đã hợp lệ. Giờ ta kiểm tra trạng thái thanh toán (responseCode)
                if (responseCode != "00")
                {
                    // Thanh toán không thành công (VD: Hủy, lỗi, hết hạn...)
                    Console.WriteLine($"⚠️ Thanh toán không thành công. Mã lỗi VNPay: {responseCode}");
                    finalRedirectUrl = $"{_frontendBaseUrl}/payment-result/{orderIdStr}?vnp_ResponseCode={responseCode}";
                    return Content(CreateRedirectHtml(finalRedirectUrl, false), "text/html");
                }

                // BƯỚC 3: Nếu đến được đây -> Chữ ký HỢP LỆ và Giao dịch THÀNH CÔNG (00).
                // -> Tiến hành cập nhật Database
                
                Console.WriteLine("✅ Thanh toán VNPay THÀNH CÔNG. Bắt đầu cập nhật DB.");

                if (!int.TryParse(orderIdStr, out int orderId) || orderId == 0)
                {
                    Console.WriteLine("❌ OrderId không hợp lệ: " + orderIdStr);
                    finalRedirectUrl = $"{_frontendBaseUrl}/payment-result/{orderIdStr}?vnp_ResponseCode=98"; // Lỗi OrderId
                    return Content(CreateRedirectHtml(finalRedirectUrl, false), "text/html");
                }

                var order = await _context.Orders.FindAsync(orderId);
                if (order == null)
                {
                    Console.WriteLine("❌ Không tìm thấy đơn hàng với ID: " + orderId);
                    finalRedirectUrl = $"{_frontendBaseUrl}/payment-result/{orderIdStr}?vnp_ResponseCode=97"; // Lỗi không tìm thấy đơn
                    return Content(CreateRedirectHtml(finalRedirectUrl, false), "text/html");
                }

                // Cập nhật Order và tạo Payment
                order.Status = OrderStatus.Processing;
                order.PaymentId = response.PaymentId;
                order.UpdatedAt = DateTime.UtcNow;
                _context.Orders.Update(order);

                var payment = new Payment
                {
                    OrderId = orderId,
                    Amount = order.TotalAmount,
                    Currency = "VND",
                    PaymentMethod = response.PaymentMethod,
                    Status = PaymentStatus.Completed,
                    TransactionId = response.TransactionId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                _context.Payments.Add(payment);

                await _context.SaveChangesAsync();
                
                Console.WriteLine($"✅ Đã cập nhật DB cho đơn hàng: {orderId}");

                // ✅ Chuyển hướng thành công
                finalRedirectUrl = $"{_frontendBaseUrl}/payment-result/{orderIdStr}?vnp_ResponseCode=00";
                return Content(CreateRedirectHtml(finalRedirectUrl, true), "text/html");
            }
            catch (Exception ex)
            {
                Console.WriteLine("Lỗi ở payment CallBack: " + ex.Message);
                finalRedirectUrl = $"{_frontendBaseUrl}/payment-result/{orderIdStr}?vnp_ResponseCode=99"; // Lỗi hệ thống
                return Content(CreateRedirectHtml(finalRedirectUrl, false), "text/html");
            }
        }

        // ✅ Cập nhật hàm này để thông báo rõ ràng hơn
        private string CreateRedirectHtml(string url, bool success)
        {
            var color = success ? "green" : "red";
            var message = success ? "✅ Thanh toán thành công" : "❌ Thanh toán thất bại hoặc bị hủy";
            var status = success ? "Đang chuyển về trang xác nhận..." : "Đang chuyển về trang thanh toán...";

            return $@"
            <!DOCTYPE html>
            <html lang='vi'>
                <head>
                    <meta charset='UTF-8'>
                    <meta http-equiv='refresh' content='2;url={url}' />
                    <title>Đang xử lý thanh toán...</title>
                    <script>
                        setTimeout(function() {{
                            window.location.href = '{url}';
                        }}, 2000);
                    </script>
                </head>
                <body style='font-family: Arial, sans-serif;'>
                    <div style='text-align:center;margin-top:50px;'>
                        <h2 style='color:{color};'>{message}</h2>
                        <p>{status}</p>
                    </div>
                </body>
            </html>";
        }
    }
}