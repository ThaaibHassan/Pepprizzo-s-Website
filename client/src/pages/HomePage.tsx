import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { 
  ArrowRightIcon, 
  ClockIcon, 
  TruckIcon, 
  StarIcon,
  FireIcon,
  HeartIcon
} from '@heroicons/react/24/outline'
import { useQuery } from '@tanstack/react-query'
import { apiHelpers, endpoints } from '../lib/api'

const HomePage = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  // Fetch featured menu items
  const { data: featuredData, isLoading: featuredLoading } = useQuery({
    queryKey: ['featured-menu'],
    queryFn: () => apiHelpers.get(endpoints.menu.featured),
  })

  const featuredItems = featuredData?.data?.featured_items || []

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 overflow-hidden">
        <div className="absolute inset-0 pizza-pattern opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 text-shadow-lg">
              Fresh & Delicious
              <br />
              <span className="text-secondary-300">Pizza Delivered</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto text-shadow">
              Experience the perfect blend of authentic Italian flavors and fresh, 
              locally-sourced ingredients. Order online for fast delivery or pickup.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/menu"
                className="btn-secondary btn-lg inline-flex items-center group"
              >
                Order Now
                <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/about"
                className="btn-outline btn-lg bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
        
        {/* Floating pizza elements */}
        <div className="absolute top-20 left-10 animate-float animation-delay-200">
          <div className="w-16 h-16 bg-white/10 rounded-full backdrop-blur"></div>
        </div>
        <div className="absolute bottom-20 right-10 animate-float animation-delay-600">
          <div className="w-12 h-12 bg-secondary-300/20 rounded-full backdrop-blur"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
              Why Choose Peprizzo's?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to delivering the best pizza experience with quality ingredients, 
              fast service, and exceptional taste.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FireIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Fresh Ingredients
              </h3>
              <p className="text-gray-600">
                We use only the freshest, locally-sourced ingredients to ensure every bite is delicious.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClockIcon className="h-8 w-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Fast Delivery
              </h3>
              <p className="text-gray-600">
                Hot and fresh pizza delivered to your door in 30 minutes or less.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HeartIcon className="h-8 w-8 text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Made with Love
              </h3>
              <p className="text-gray-600">
                Every pizza is handcrafted with care and attention to detail.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Menu Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
              Popular Menu Items
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our most loved pizzas and dishes, crafted with premium ingredients.
            </p>
          </div>

          {featuredLoading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <div className="card-body">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredItems.slice(0, 3).map((category: any) => 
                category.items?.slice(0, 1).map((item: any) => (
                  <div key={item.id} className="card group hover:shadow-lg transition-shadow duration-300">
                    <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                      {item.image_url ? (
                        <img 
                          src={item.image_url} 
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                          <span className="text-4xl">🍕</span>
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        {item.is_vegetarian && (
                          <span className="badge-success">Veg</span>
                        )}
                        {item.is_spicy && (
                          <span className="badge-warning ml-1">Spicy</span>
                        )}
                      </div>
                    </div>
                    <div className="card-body">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {item.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-primary-600">
                          ${item.price}
                        </span>
                        <Link
                          to="/menu"
                          className="btn-primary btn-sm"
                        >
                          Order Now
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/menu"
              className="btn-primary btn-lg inline-flex items-center group"
            >
              View Full Menu
              <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Ready to Order?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who choose Peprizzo's for their pizza cravings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/menu"
              className="btn-secondary btn-lg"
            >
              Start Ordering
            </Link>
            <Link
              to="/register"
              className="btn-outline btn-lg bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                rating: 5,
                comment: "The best pizza I've ever had! Fresh ingredients and perfect crust every time."
              },
              {
                name: "Mike Chen",
                rating: 5,
                comment: "Fast delivery and amazing taste. Peprizzo's is my go-to for pizza nights."
              },
              {
                name: "Emily Rodriguez",
                rating: 5,
                comment: "Love the variety of options and the loyalty program. Great value for money!"
              }
            ].map((testimonial, index) => (
              <div key={index} className="card text-center">
                <div className="card-body">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">
                    "{testimonial.comment}"
                  </p>
                  <p className="font-semibold text-gray-900">
                    {testimonial.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
