using Microsoft.AspNetCore.Mvc;
using WebFashion.BusinessObjects.Vnpay;
using WebFashion.Services.Interface;

namespace WebFashion.APIService.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly IVnPayService _vnPayService;
        public PaymentController(IVnPayService vnPayService)
        {
            _vnPayService = vnPayService;
        }
        [HttpPost("create-vnpay-url")]
        public IActionResult CreatePaymentUrlVnpay([FromBody] PaymentInformationModel model)
        {
            var url = _vnPayService.CreatePaymentUrl(model, HttpContext);
            return Ok(new
            {
                success = true,
                paymentUrl = url
            });
        }

    }
}
