using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

namespace SFF_FrontEnd.Controllers
{
    public class HomeController : Controller
    {
        private readonly IWebHostEnvironment env;
        public HomeController(IWebHostEnvironment env)
        {
            this.env = env;
        }
        public IActionResult Index() 
        {
            return View("Views/Home/Index.cshtml");
        }
    }
}