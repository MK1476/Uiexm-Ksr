import { Award, Users, Target, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              About KSR Agros
            </h1>
            <p className="text-lg text-gray-600">
              Your trusted partner in agricultural excellence
            </p>
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <img
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400"
                  alt="KSR Agros team"
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Story</h2>
                <p className="text-gray-600 mb-6">
                  Founded with a vision to revolutionize Indian agriculture, KSR Agros has been serving farmers and agricultural 
                  professionals for over two decades. We understand the challenges faced by modern farmers and strive to provide 
                  innovative solutions that enhance productivity while being environmentally sustainable.
                </p>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h3>
                <p className="text-gray-600 mb-6">
                  To empower farmers with cutting-edge agricultural technology and equipment, ensuring food security and sustainable 
                  farming practices for future generations. We believe in building long-term partnerships with our customers and 
                  supporting them throughout their agricultural journey.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">500+</div>
                    <div className="text-gray-600">Happy Customers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">20+</div>
                    <div className="text-gray-600">Years Experience</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Values */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="text-center">
                <CardContent className="p-6">
                  <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Quality</h3>
                  <p className="text-gray-600">
                    We provide only the highest quality agricultural equipment from trusted manufacturers.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Partnership</h3>
                  <p className="text-gray-600">
                    We build lasting relationships with our customers, supporting them every step of the way.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Innovation</h3>
                  <p className="text-gray-600">
                    We continuously seek innovative solutions to help farmers improve their productivity.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Dedication</h3>
                  <p className="text-gray-600">
                    Our commitment to farmers drives everything we do, from product selection to customer service.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Additional Content */}
            <div className="mt-16 bg-white rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Why Choose KSR Agros?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Expert Knowledge</h3>
                  <p className="text-gray-600 mb-4">
                    Our team has deep expertise in agricultural equipment and farming practices, ensuring you get the right solutions for your needs.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Comprehensive Support</h3>
                  <p className="text-gray-600">
                    From product selection to installation and maintenance, we provide comprehensive support throughout your equipment's lifecycle.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Competitive Pricing</h3>
                  <p className="text-gray-600 mb-4">
                    We offer competitive pricing without compromising on quality, ensuring you get the best value for your investment.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Pan-India Presence</h3>
                  <p className="text-gray-600">
                    With our extensive network, we can serve customers across India with fast delivery and local support.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
