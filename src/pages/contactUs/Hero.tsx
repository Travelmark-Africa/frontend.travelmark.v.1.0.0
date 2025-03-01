import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import Container from "@/components/Container";

const Hero = () => {
  return (
    <div className="pt-12 md:pt-24 bg-blue-50 min-h-screen">
      <Container>
        <div className="py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Column: Contact Info - Now vertically centered */}
            <div className="space-y-8 flex flex-col justify-center">
              <div>
                <h4 className="text-5xl font-bold mb-3">Contact Us</h4>
                <p className="text-gray-600 mb-6">
                  Email, call, or complete the form to learn how <br />
                  Travelmark can elevate your travel experience.
                </p>

                <div className="space-y-2">
                  <p className="text-gray-700">info@travelmarkafrica.com</p>
                  <p className="text-gray-700">🇷🇼 0788 357 850</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Support Box */}
                <div className="space-y-2">
                  <h4 className="font-bold text-md">Customer <br /> Support</h4>
                  <p className="text-gray-600 text-sm">
                    Our travel experts are available around the clock to address any concerns or queries you may have about your bookings.
                  </p>
                </div>

                {/* Feedback Box (Added from screenshot) */}
                <div className="space-y-2">
                  <h4 className="font-bold text-md">Feedback and Suggestions</h4>
                  <p className="text-gray-600 text-sm">
                    We value your feedback and are continuously working to improve Travelmark. Your input helps us create better travel experiences.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div>
              <Card className="overflow-hidden border-none shadow-xs rounded-xl bg-white/50 backdrop-blur-md">
                <CardContent className="p-8">
                  <h4 className="text-3xl font-bold mb-1">Get in Touch</h4>
                  <p className="text-gray-600 mb-6">You can reach us anytime</p>

                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input placeholder="First name" />
                      <Input placeholder="Last name" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input placeholder="Your email" />
                      <Input placeholder="Phone number" />
                    </div>

                    <div>
                      <Input placeholder="Subject" />
                    </div>
                    <div>
                      <Textarea
                        placeholder="How can we help with your travel plans?"
                      />
                      <div className="text-right text-gray-400 text-sm mt-1">0/120</div>
                    </div>

                    <div className="pt-2">
                      <Button type="submit" className="block mx-auto px-20" >
                        Submit
                      </Button>
                      <p className="text-center text-gray-500 text-xs mt-2">
                        By contacting us, you agree to our <a href="#" target="_blank" className="text-gray-900 font-medium">Terms of service</a> and <a href="#" target="_blank" className="text-gray-900 font-medium">Privacy Policy</a>
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Hero;