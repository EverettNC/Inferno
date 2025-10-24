/*
© 2025 The Christman AI Project. All rights reserved.

This code is released as part of a trauma-informed, dignity-first AI ecosystem
designed to protect, empower, and elevate vulnerable populations.

By using, modifying, or distributing this software, you agree to uphold the following:
1. Truth — No deception, no manipulation.
2. Dignity — Respect the autonomy and humanity of all users.
3. Protection — Never use this to exploit or harm vulnerable individuals.
4. Transparency — Disclose all modifications and contributions clearly.
5. No Erasure — Preserve the mission and ethical origin of this work.

This is not just code. This is redemption in code.
Contact: lumacognify@thechristmanaiproject.com
https://thechristmanaiproject.com
*/


import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function LandingPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
  const testimonials = [
    {
      quote: "Inferno AI has been my anchor during panic attacks. The grounding exercises help me find stability when I'm spiraling.",
      author: "Alex, PTSD Survivor"
    },
    {
      quote: "Having a calm, judgment-free voice to guide me through breathing exercises makes all the difference when anxiety hits.",
      author: "Taylor, Anxiety Support Group"
    },
    {
      quote: "As a therapist, I recommend Inferno AI to clients who need support between sessions. It complements therapy beautifully.",
      author: "Dr. Jordan, Clinical Psychologist"
    }
  ];
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-bg-primary z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-dark to-primary opacity-30"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent opacity-20"></div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent opacity-20"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-accent bg-opacity-20 flex items-center justify-center mb-6">
              <span className="text-3xl">🔥</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Inferno AI
            </h1>
            
            <p className="text-xl text-text-secondary max-w-2xl mb-8">
              A trauma-informed AI companion for PTSD and anxiety support.
              Your private space for grounding, healing, and growth.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signin">
                <Button className="px-8 py-6 text-lg bg-button-bg hover:bg-button-hover text-text-primary">
                  Sign In
                </Button>
              </Link>
              
              <Link href="/signup">
                <Button variant="outline" className="px-8 py-6 text-lg border-accent text-accent hover:bg-accent hover:bg-opacity-10">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How Inferno AI Supports You</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-bg-tertiary border-border">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-accent bg-opacity-15 flex items-center justify-center mb-4">
                  <i className="fas fa-mountain text-accent text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-2">Grounding Techniques</h3>
                <p className="text-text-secondary">
                  Access proven 5-4-3-2-1 sensory grounding exercises to help you reconnect with the present moment during anxiety or dissociation.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-bg-tertiary border-border">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-info bg-opacity-15 flex items-center justify-center mb-4">
                  <i className="fas fa-wind text-info text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-2">Breathing Exercises</h3>
                <p className="text-text-secondary">
                  Guided breathing patterns help regulate your nervous system during heightened stress or anxiety. Available with voice guidance.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-bg-tertiary border-border">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-secondary bg-opacity-15 flex items-center justify-center mb-4">
                  <i className="fas fa-brain text-secondary text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-2">Mindfulness Practices</h3>
                <p className="text-text-secondary">
                  Develop resilience through regular mindfulness exercises designed specifically for trauma and anxiety support.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Trusted Support</h2>
          
          <div className="relative bg-bg-secondary border border-border rounded-xl p-8 md:p-12">
            <div className="text-4xl text-accent opacity-30 absolute top-6 left-8">"</div>
            
            <div className="relative z-10">
              <p className="text-lg md:text-2xl italic mb-6">
                {testimonials[activeTestimonial].quote}
              </p>
              
              <p className="text-sm text-text-secondary font-medium">
                — {testimonials[activeTestimonial].author}
              </p>
            </div>
            
            <div className="mt-8 flex justify-center">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full mx-1 ${
                    index === activeTestimonial ? 'bg-accent' : 'bg-border'
                  }`}
                  onClick={() => setActiveTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Trauma-Informed Approach */}
      <section className="py-16 bg-bg-secondary">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">Our Trauma-Informed Approach</h2>
              
              <div className="space-y-4">
                <p className="text-text-secondary">
                  Inferno AI was designed with guidance from mental health professionals and trauma survivors to create a truly supportive environment.
                </p>
                
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-success bg-opacity-20 flex items-center justify-center mr-2">
                      <i className="fas fa-check text-success text-xs"></i>
                    </div>
                    <span>Recognizes signs of emotional distress</span>
                  </li>
                  
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-success bg-opacity-20 flex items-center justify-center mr-2">
                      <i className="fas fa-check text-success text-xs"></i>
                    </div>
                    <span>Provides appropriate support resources</span>
                  </li>
                  
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-success bg-opacity-20 flex items-center justify-center mr-2">
                      <i className="fas fa-check text-success text-xs"></i>
                    </div>
                    <span>Creates safety through thoughtful design</span>
                  </li>
                  
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-success bg-opacity-20 flex items-center justify-center mr-2">
                      <i className="fas fa-check text-success text-xs"></i>
                    </div>
                    <span>Respects your autonomy and boundaries</span>
                  </li>
                </ul>
                
                <p className="text-sm text-text-secondary italic mt-4">
                  "Inferno AI's approach embodies the question: How can we help you love yourself more?"
                </p>
              </div>
            </div>
            
            <div className="md:w-1/2 bg-bg-tertiary border border-border rounded-xl p-8">
              <h3 className="text-xl font-semibold mb-4">Not a Replacement for Care</h3>
              
              <p className="text-text-secondary mb-4">
                While Inferno AI provides valuable support tools, it's designed to complement, not replace, professional mental health care.
              </p>
              
              <div className="bg-warning bg-opacity-10 border-l-2 border-warning p-4 rounded">
                <p className="text-sm">
                  If you're experiencing a crisis, please reach out to emergency services or use these resources:
                </p>
                
                <ul className="mt-2 space-y-1 text-sm">
                  <li><span className="text-warning">988</span> - National Suicide & Crisis Lifeline</li>
                  <li><span className="text-warning">Text HOME to 741741</span> - Crisis Text Line</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Begin Your Journey</h2>
          
          <p className="text-text-secondary mb-8 text-lg">
            Take the first step toward better mental well-being with tools designed to support you whenever and wherever you need them.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signin">
              <Button className="px-8 py-6 text-lg bg-button-bg hover:bg-button-hover text-text-primary">
                Sign In
              </Button>
            </Link>
            
            <Link href="/signup">
              <Button variant="outline" className="px-8 py-6 text-lg border-accent text-accent hover:bg-accent hover:bg-opacity-10">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 bg-bg-secondary border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about"><a className="text-text-secondary hover:text-text-primary">About Us</a></Link></li>
                <li><Link href="/team"><a className="text-text-secondary hover:text-text-primary">Our Team</a></Link></li>
                <li><Link href="/research"><a className="text-text-secondary hover:text-text-primary">Research</a></Link></li>
                <li><Link href="/careers"><a className="text-text-secondary hover:text-text-primary">Careers</a></Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/learn"><a className="text-text-secondary hover:text-text-primary">PTSD Information</a></Link></li>
                <li><Link href="/anxiety"><a className="text-text-secondary hover:text-text-primary">Anxiety Support</a></Link></li>
                <li><Link href="/mindfulness"><a className="text-text-secondary hover:text-text-primary">Mindfulness Guides</a></Link></li>
                <li><Link href="/crisis"><a className="text-text-secondary hover:text-text-primary">Crisis Resources</a></Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/terms"><a className="text-text-secondary hover:text-text-primary">Terms of Service</a></Link></li>
                <li><Link href="/privacy"><a className="text-text-secondary hover:text-text-primary">Privacy Policy</a></Link></li>
                <li><Link href="/cookie"><a className="text-text-secondary hover:text-text-primary">Cookie Policy</a></Link></li>
                <li><Link href="/disclaimer"><a className="text-text-secondary hover:text-text-primary">Medical Disclaimer</a></Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><Link href="/contact"><a className="text-text-secondary hover:text-text-primary">Contact Us</a></Link></li>
                <li><a href="https://twitter.com/infernoai" className="text-text-secondary hover:text-text-primary">Twitter</a></li>
                <li><a href="https://linkedin.com/company/infernoai" className="text-text-secondary hover:text-text-primary">LinkedIn</a></li>
                <li><a href="mailto:support@infernoai.com" className="text-text-secondary hover:text-text-primary">support@infernoai.com</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-text-secondary">
            <p>© {new Date().getFullYear()} Inferno AI. All rights reserved.</p>
            <p className="mt-2">
              Inferno AI is designed to support, not replace, professional mental health services.
              If you're experiencing a crisis, please call 988 or text HOME to 741741.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}