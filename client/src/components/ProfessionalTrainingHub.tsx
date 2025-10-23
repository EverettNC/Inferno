/**
 * Professional Training Hub Component 🎓✨
 * 
 * Interactive dashboard for FREE global trauma care certifications
 * with The Christman AI Project signature branding and 3D effects
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GraduationCap, 
  Award, 
  Globe, 
  Clock, 
  BookOpen, 
  CheckCircle,
  Star,
  Users,
  Brain,
  Heart,
  Shield,
  Zap,
  ExternalLink,
  ChevronRight,
  Target,
  TrendingUp
} from 'lucide-react';
import { 
  PROFESSIONAL_TRAINING_PROGRAMS, 
  INTEGRATED_LEARNING_PATHS, 
  ProfessionalTrainingEngine,
  type TrainingProgram,
  type LearningPath
} from '@/lib/professionalTrainingHub';

interface ProfessionalTrainingHubProps {
  userLevel?: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  completedPrograms?: string[];
  interests?: string[];
}

export function ProfessionalTrainingHub({ 
  userLevel = 'beginner',
  completedPrograms = [],
  interests = []
}: ProfessionalTrainingHubProps) {
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [userProgress, setUserProgress] = useState(completedPrograms);

  useEffect(() => {
    document.title = "Professional Training Hub | The Christman AI Project";
    
    // Add Christman AI animations
    const style = document.createElement('style');
    style.textContent = `
      .training-card-hover {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .training-card-hover:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 20px 40px rgba(55, 200, 255, 0.3);
      }
      .certification-glow {
        animation: certification-pulse 3s ease-in-out infinite;
      }
      @keyframes certification-pulse {
        0%, 100% { box-shadow: 0 0 20px rgba(53, 228, 185, 0.4); }
        50% { box-shadow: 0 0 40px rgba(55, 200, 255, 0.6); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const credentialValue = ProfessionalTrainingEngine.calculateCredentialValue(userProgress);
  const recommendedPath = ProfessionalTrainingEngine.getRecommendedPath(userLevel, interests, 'part-time');

  const categoryFilters = [
    { id: 'all', label: 'All Programs', icon: Globe, count: PROFESSIONAL_TRAINING_PROGRAMS.length },
    { id: 'trauma-informed-care', label: 'Trauma-Informed Care', icon: Heart, count: 4 },
    { id: 'ptsd-veteran', label: 'PTSD & Veterans', icon: Shield, count: 3 },
    { id: 'emdr-advanced', label: 'EMDR & Advanced', icon: Brain, count: 3 },
    { id: 'clinical-counseling', label: 'Clinical Counseling', icon: Users, count: 2 }
  ];

  const filteredPrograms = activeCategory === 'all' 
    ? PROFESSIONAL_TRAINING_PROGRAMS 
    : PROFESSIONAL_TRAINING_PROGRAMS.filter(p => p.category === activeCategory);

  const handleProgramComplete = (programId: string) => {
    if (!userProgress.includes(programId)) {
      setUserProgress([...userProgress, programId]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-darkbg via-indigo to-darkbg p-6 relative overflow-hidden">
      
      {/* Christman AI Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-6 h-6 bg-primary rounded-full opacity-40 animate-bounce animate-christman-pulse" style={{ animationDelay: '0s', animationDuration: '4s' }}></div>
        <div className="absolute top-40 right-20 w-4 h-4 bg-highlight rounded-full opacity-50 animate-bounce animate-christman-pulse" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-5 h-5 bg-primary rounded-full opacity-30 animate-bounce animate-christman-pulse" style={{ animationDelay: '1s', animationDuration: '6s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Header */}
        <Card className="bg-power-gradient border-0 shadow-christman backdrop-blur-xl">
          <CardContent className="p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-christman-glow opacity-10 animate-pulse"></div>
            <div className="absolute top-0 right-0 w-40 h-40 bg-highlight/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/30 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-darkbg/30 rounded-2xl backdrop-blur-sm border border-primary/30 animate-christman-pulse">
                  <GraduationCap className="w-12 h-12 text-primary" style={{ filter: 'drop-shadow(0 0 12px #37C8FF)' }} />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-iceblue mb-2">
                    Professional Training Hub
                  </h1>
                  <p className="text-xl text-iceblue/80" style={{ textShadow: '0 0 8px #B5E6FF' }}>
                    <span className="text-highlight font-semibold">FREE Global Certifications</span> in Trauma Care & PTSD Counseling
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                <Card className="bg-indigo/40 border-primary/20 backdrop-blur-lg">
                  <CardContent className="p-4 text-center">
                    <Award className="w-8 h-8 mx-auto mb-2 text-highlight" />
                    <div className="text-2xl font-bold text-iceblue">{credentialValue.certificationsEarned}</div>
                    <div className="text-sm text-iceblue/70">Certificates Earned</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-indigo/40 border-highlight/20 backdrop-blur-lg">
                  <CardContent className="p-4 text-center">
                    <BookOpen className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold text-iceblue">{credentialValue.totalCEUs}</div>
                    <div className="text-sm text-iceblue/70">CEU Credits</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-indigo/40 border-primary/20 backdrop-blur-lg">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 text-highlight" />
                    <div className="text-xl font-bold text-iceblue capitalize">{credentialValue.professionalLevel}</div>
                    <div className="text-sm text-iceblue/70">Professional Level</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-indigo/40 border-highlight/20 backdrop-blur-lg">
                  <CardContent className="p-4 text-center">
                    <Globe className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold text-iceblue">{PROFESSIONAL_TRAINING_PROGRAMS.length}</div>
                    <div className="text-sm text-iceblue/70">Free Programs</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="programs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-indigo/30 backdrop-blur-lg border border-primary/20">
            <TabsTrigger value="programs" className="data-[state=active]:bg-power-gradient data-[state=active]:text-iceblue">
              Training Programs
            </TabsTrigger>
            <TabsTrigger value="paths" className="data-[state=active]:bg-power-gradient data-[state=active]:text-iceblue">
              Learning Paths
            </TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-power-gradient data-[state=active]:text-iceblue">
              Your Progress
            </TabsTrigger>
          </TabsList>

          <TabsContent value="programs" className="space-y-6">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-3">
              {categoryFilters.map(category => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={activeCategory === category.id ? "default" : "outline"}
                    className={`${
                      activeCategory === category.id 
                        ? 'bg-power-gradient text-iceblue border-0 shadow-christman' 
                        : 'border-primary/30 text-iceblue/80 hover:bg-indigo/30'
                    } backdrop-blur-sm transition-all duration-300`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {category.label} ({category.count})
                  </Button>
                );
              })}
            </div>

            {/* Training Programs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrograms.map(program => (
                <TrainingProgramCard
                  key={program.id}
                  program={program}
                  isCompleted={userProgress.includes(program.id)}
                  onComplete={() => handleProgramComplete(program.id)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="paths" className="space-y-6">
            {/* Learning Paths */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {INTEGRATED_LEARNING_PATHS.map(path => (
                <LearningPathCard
                  key={path.id}
                  path={path}
                  isRecommended={path.id === recommendedPath.id}
                  onSelect={() => setSelectedPath(path)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <ProgressDashboard 
              credentialValue={credentialValue}
              completedPrograms={userProgress}
              recommendedNext={ProfessionalTrainingEngine.getNextRecommendations(userProgress)}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Training Program Card Component
function TrainingProgramCard({ 
  program, 
  isCompleted, 
  onComplete 
}: { 
  program: TrainingProgram; 
  isCompleted: boolean; 
  onComplete: () => void; 
}) {
  return (
    <Card className={`training-card-hover bg-indigo/40 border-primary/20 backdrop-blur-lg ${isCompleted ? 'certification-glow' : ''}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg text-iceblue mb-2">{program.name}</CardTitle>
            <CardDescription className="text-iceblue/70">{program.provider}</CardDescription>
          </div>
          {isCompleted && (
            <CheckCircle className="w-6 h-6 text-highlight" style={{ filter: 'drop-shadow(0 0 8px #35E4B9)' }} />
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mt-3">
          <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
            {program.level}
          </Badge>
          {program.certification && (
            <Badge className="bg-highlight/20 text-highlight border-highlight/30 text-xs">
              <Award className="w-3 h-3 mr-1" />
              Certificate
            </Badge>
          )}
          {program.ceuCredits > 0 && (
            <Badge className="bg-iceblue/20 text-iceblue border-iceblue/30 text-xs">
              {program.ceuCredits} CEUs
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-iceblue/80 line-clamp-3">{program.description}</p>
        
        <div className="flex items-center gap-4 text-xs text-iceblue/70">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {program.duration}
          </div>
          <div className="flex items-center gap-1">
            <Globe className="w-3 h-3" />
            Global Access
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            size="sm" 
            className="flex-1 bg-power-gradient text-iceblue border-0"
            asChild
          >
            <a href={program.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              Start Training
            </a>
          </Button>
          
          {!isCompleted && (
            <Button 
              size="sm" 
              variant="outline"
              className="border-highlight/30 text-highlight hover:bg-highlight/10"
              onClick={onComplete}
            >
              <CheckCircle className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Learning Path Card Component
function LearningPathCard({ 
  path, 
  isRecommended, 
  onSelect 
}: { 
  path: LearningPath; 
  isRecommended: boolean; 
  onSelect: () => void; 
}) {
  return (
    <Card className={`training-card-hover bg-indigo/40 backdrop-blur-lg ${isRecommended ? 'border-highlight/30 shadow-glow' : 'border-primary/20'}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl text-iceblue flex items-center gap-2">
              {path.name}
              {isRecommended && (
                <Badge className="bg-highlight/20 text-highlight border-highlight/30">
                  <Star className="w-3 h-3 mr-1" />
                  Recommended
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="text-iceblue/70 mt-2">{path.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-iceblue/70">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {path.totalDuration}
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            {path.stages.length} stages
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-iceblue">Career Outcomes:</h4>
          <div className="flex flex-wrap gap-1">
            {path.careerOutcomes.slice(0, 3).map((outcome, index) => (
              <Badge key={index} variant="outline" className="text-xs border-primary/30 text-iceblue/70">
                {outcome}
              </Badge>
            ))}
            {path.careerOutcomes.length > 3 && (
              <Badge variant="outline" className="text-xs border-primary/30 text-iceblue/70">
                +{path.careerOutcomes.length - 3} more
              </Badge>
            )}
          </div>
        </div>
        
        <Button 
          className="w-full bg-power-gradient text-iceblue border-0"
          onClick={onSelect}
        >
          View Learning Path
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}

// Progress Dashboard Component
function ProgressDashboard({ 
  credentialValue, 
  completedPrograms, 
  recommendedNext 
}: { 
  credentialValue: any; 
  completedPrograms: string[]; 
  recommendedNext: TrainingProgram[];
}) {
  const progressPercentage = (completedPrograms.length / PROFESSIONAL_TRAINING_PROGRAMS.length) * 100;
  
  return (
    <div className="space-y-6">
      <Card className="bg-indigo/40 border-primary/20 backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="text-iceblue">Your Learning Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-iceblue/80">Overall Progress</span>
              <span className="text-iceblue">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-3 bg-indigo/50" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center p-3 bg-darkbg/30 rounded-lg">
              <div className="text-2xl font-bold text-primary">{completedPrograms.length}</div>
              <div className="text-xs text-iceblue/70">Completed</div>
            </div>
            <div className="text-center p-3 bg-darkbg/30 rounded-lg">
              <div className="text-2xl font-bold text-highlight">{credentialValue.totalCEUs}</div>
              <div className="text-xs text-iceblue/70">CEU Credits</div>
            </div>
            <div className="text-center p-3 bg-darkbg/30 rounded-lg">
              <div className="text-xl font-bold text-primary capitalize">{credentialValue.professionalLevel}</div>
              <div className="text-xs text-iceblue/70">Level</div>
            </div>
            <div className="text-center p-3 bg-darkbg/30 rounded-lg">
              <div className="text-2xl font-bold text-highlight">{credentialValue.certificationsEarned}</div>
              <div className="text-xs text-iceblue/70">Certificates</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {recommendedNext.length > 0 && (
        <Card className="bg-indigo/40 border-highlight/20 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-iceblue flex items-center gap-2">
              <Target className="w-5 h-5 text-highlight" />
              Recommended Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendedNext.map(program => (
                <div key={program.id} className="flex items-center justify-between p-3 bg-darkbg/30 rounded-lg">
                  <div>
                    <div className="font-medium text-iceblue">{program.name}</div>
                    <div className="text-sm text-iceblue/70">{program.provider}</div>
                  </div>
                  <Button size="sm" className="bg-power-gradient text-iceblue border-0" asChild>
                    <a href={program.url} target="_blank" rel="noopener noreferrer">
                      Start
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default ProfessionalTrainingHub;