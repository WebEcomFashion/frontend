const Policy = () => {
  const policies = [
    {
      title: "Free Shipping",
      description: "Free shipping on orders over $100",
      icon: "🚚",
    },
    {
      title: "Easy Returns",
      description: "30-day return policy for all items",
      icon: "↩️",
    },
    {
      title: "Secure Payment",
      description: "100% secure and encrypted payments",
      icon: "🔒",
    },
    {
      title: "24/7 Support",
      description: "Dedicated customer support team",
      icon: "💬",
    },
  ]

  return (
    <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {policies.map((policy, index) => (
          <div key={index} className="text-center">
            <div className="text-4xl mb-4">{policy.icon}</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{policy.title}</h3>
            <p className="text-gray-600 text-sm">{policy.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Policy
