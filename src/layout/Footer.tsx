const Footer = () => {
  return (
    <footer className="bg-black text-white mt-auto">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <h3 className="space-grotesk text-2xl font-bold mb-4">NOLabel</h3>
            <p className="text-gray-400 max-w-md leading-relaxed">
              Redefining fashion with minimalist design and timeless quality. No labels, just pure style.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Company</h4>
            <ul className="flex flex-col gap-3">
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                  About Us
                </a>
              </li>
              <li>
                <a href="/collection" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Collection
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="flex flex-col gap-3 text-sm">
              <li className="text-gray-400">+358-333-33-33</li>
              <li className="text-gray-400">hello@nolabel.com</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} NOLabel. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
