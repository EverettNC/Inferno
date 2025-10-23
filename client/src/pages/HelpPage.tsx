import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, MessageSquare, Heart, Shield, AlertTriangle, Book, Mail, ExternalLink } from 'lucide-react';

export default function HelpPage() {
  useEffect(() => {
    document.title = "Help & Support | Inferno AI";
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 pt-8 pb-24">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2 flex items-center gap-3">
          <Heart className="w-8 h-8 text-electric-cyan" />
          Help & Support
        </h1>
        <p className="text-text-secondary text-lg">
          You're not alone. Here are resources and support available to you.
        </p>
      </div>

      {/* Crisis Resources - Most Important Section */}
      <Card className="mb-6 border-danger-light/30 bg-danger-light/5" data-testid="card-crisis-resources">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-danger-light">
            <AlertTriangle className="w-6 h-6" />
            Crisis Support - Available 24/7
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-bg-secondary rounded-lg border border-border">
            <div className="flex items-start gap-3">
              <Phone className="w-6 h-6 text-electric-cyan flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">988 Suicide & Crisis Lifeline</h3>
                <p className="text-text-secondary text-sm mb-2">
                  Free, confidential support 24/7 for people in distress
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    asChild
                    className="bg-button-bg hover:bg-button-hover"
                    data-testid="button-call-988"
                  >
                    <a href="tel:988">
                      <Phone className="w-4 h-4 mr-2" />
                      Call 988
                    </a>
                  </Button>
                  <Button 
                    asChild
                    variant="outline"
                    data-testid="button-text-988"
                  >
                    <a href="sms:988">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Text 988
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-bg-secondary rounded-lg border border-border">
            <div className="flex items-start gap-3">
              <MessageSquare className="w-6 h-6 text-electric-cyan flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">Crisis Text Line</h3>
                <p className="text-text-secondary text-sm mb-2">
                  Text HOME to 741741 to connect with a crisis counselor
                </p>
                <Button 
                  asChild
                  variant="outline"
                  data-testid="button-crisis-text"
                >
                  <a href="sms:741741?body=HOME">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Text HOME to 741741
                  </a>
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4 bg-bg-secondary rounded-lg border border-border">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-electric-cyan flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">Veterans Crisis Line</h3>
                <p className="text-text-secondary text-sm mb-2">
                  Support for veterans, service members, and their families
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    asChild
                    variant="outline"
                    data-testid="button-veterans-call"
                  >
                    <a href="tel:988">
                      <Phone className="w-4 h-4 mr-2" />
                      Call 988, Press 1
                    </a>
                  </Button>
                  <Button 
                    asChild
                    variant="outline"
                    data-testid="button-veterans-text"
                  >
                    <a href="sms:838255">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Text 838255
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Resources */}
      <Card className="mb-6" data-testid="card-additional-resources">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="w-6 h-6 text-electric-cyan" />
            Additional Resources
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-bg-secondary rounded-lg border border-border">
            <h3 className="font-semibold mb-2">SAMHSA National Helpline</h3>
            <p className="text-text-secondary text-sm mb-2">
              Free, confidential, 24/7 treatment referral and information service for individuals and families facing mental health and/or substance use disorders
            </p>
            <Button 
              asChild
              variant="outline"
              size="sm"
              data-testid="button-samhsa"
            >
              <a href="tel:1-800-662-4357">
                <Phone className="w-4 h-4 mr-2" />
                1-800-662-HELP (4357)
              </a>
            </Button>
          </div>

          <div className="p-4 bg-bg-secondary rounded-lg border border-border">
            <h3 className="font-semibold mb-2">RAINN National Sexual Assault Hotline</h3>
            <p className="text-text-secondary text-sm mb-2">
              Confidential support from trained staff for survivors of sexual violence
            </p>
            <div className="flex flex-wrap gap-2">
              <Button 
                asChild
                variant="outline"
                size="sm"
                data-testid="button-rainn-call"
              >
                <a href="tel:1-800-656-4673">
                  <Phone className="w-4 h-4 mr-2" />
                  1-800-656-HOPE (4673)
                </a>
              </Button>
              <Button 
                asChild
                variant="outline"
                size="sm"
                data-testid="button-rainn-chat"
              >
                <a href="https://hotline.rainn.org/online" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Online Chat
                </a>
              </Button>
            </div>
          </div>

          <div className="p-4 bg-bg-secondary rounded-lg border border-border">
            <h3 className="font-semibold mb-2">National Domestic Violence Hotline</h3>
            <p className="text-text-secondary text-sm mb-2">
              Support for anyone affected by domestic violence or abuse
            </p>
            <div className="flex flex-wrap gap-2">
              <Button 
                asChild
                variant="outline"
                size="sm"
                data-testid="button-domestic-violence-call"
              >
                <a href="tel:1-800-799-7233">
                  <Phone className="w-4 h-4 mr-2" />
                  1-800-799-SAFE (7233)
                </a>
              </Button>
              <Button 
                asChild
                variant="outline"
                size="sm"
                data-testid="button-domestic-violence-text"
              >
                <a href="sms:22522?body=START">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Text START to 22522
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About Inferno AI */}
      <Card data-testid="card-about-inferno">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-electric-cyan" />
            About Inferno AI
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">What is Inferno AI?</h3>
            <p className="text-text-secondary text-sm">
              Inferno AI is a clinical-grade, trauma-informed AI platform designed to support individuals dealing with PTSD, anxiety, and trauma. 
              Our system integrates masters-level expertise in evidence-based therapies including Cognitive Processing Therapy (CPT), 
              Prolonged Exposure (PE), EMDR, and Dialectical Behavior Therapy (DBT).
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">How to Use Inferno AI</h3>
            <ul className="text-text-secondary text-sm space-y-2 list-disc list-inside">
              <li><strong>Daily Check-ins:</strong> Track your mood and emotional state</li>
              <li><strong>Grounding Exercises:</strong> Practice evidence-based techniques to manage anxiety</li>
              <li><strong>Voice Mode:</strong> Hands-free, real-time conversation with clinical AI</li>
              <li><strong>Chat:</strong> Written conversation with personalized support</li>
              <li><strong>Resources:</strong> Access educational materials and crisis contacts</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Important Disclaimers</h3>
            <ul className="text-text-secondary text-sm space-y-2 list-disc list-inside">
              <li>Inferno AI is <strong>not</strong> a replacement for professional mental health care</li>
              <li>This platform does not provide medical diagnosis or treatment</li>
              <li>In a crisis, please contact emergency services or call 988 immediately</li>
              <li>Always consult with a qualified mental health professional for serious concerns</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Contact & Support</h3>
            <p className="text-text-secondary text-sm mb-2">
              For technical support, feedback, or questions about the platform:
            </p>
            <Button 
              asChild
              variant="outline"
              size="sm"
              data-testid="button-email-support"
            >
              <a href="mailto:support@infernoai.app">
                <Mail className="w-4 h-4 mr-2" />
                support@infernoai.app
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
